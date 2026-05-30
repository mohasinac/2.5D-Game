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
**Key Physics**: ED145 geometry — cylinder height = 14.5 mm (1.45 cm); 3 wings **fused together into a single unified ring unit** that is a separate physical part from the cylinder body. The 3-wing ring sits on a bearing seat on the cylinder and spins freely as **one piece** — all 3 wings move together; there is no per-wing independent movement. When struck, the entire fused ring absorbs the angular impulse and spins up as a unit (ω_ring independent of bey body spin). ring mass m = 1.2 g; r_eff = 1.8 cm; free-spin on bearing seat (μ_bearing ≈ 0.02). Impulse partition: I_body / (I_body + I_ring) = 0.9496 → 5.0% of incoming rotational impulse absorbed by ring per hit; builds up ω_ring over multiple contacts. ES free-spinning sleeve μ_sleeve = 0.05–0.08 → tilt resistance 2.83× better. counterPool accumulates per hit.  
**Engine Note**: ED145 = fixed cylinder (height_cm: 1.45) + 1 WingDef (count: 3, shape: "arc", movementType: "free_spin_ring", ringMass_g: 1.2, ringRadius_cm: 1.8, bearingMu: 0.02, spinDecouplingFactor: 0.85) — the 3 wings are ONE fused unit spinning as a single ring, not 3 independent parts. Track separate ω_ring float per beyblade; collision resolver applies angular impulse to ring, not body. impulse partition formula; tilt resistance multiplier from ES sleeve decoupling; counter-charge pool model.

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
**Key Physics**: UW145 (Case 303): cylinder height = 14.5 mm (1.45 cm); 3 wings (C₃, spacingDeg: 120°); each wing is a fixed WingDef angled upward at θ_wing = +12° above horizontal — the upward tilt angle is what makes the contact look like an upper attack; r_wing_tip ≈ 21 mm (2.1 cm); contact on the upward-angled face only (leading edge at upper angle); J_upper = sin(12°) × J = 0.208 × J per wing contact. foldSymmetry = 3 → Δ_I = 0, no nutation forcing (stable assembly). f_wing = 254 Hz at ω = 600 rad/s (3 wings × 600 / 2π ≈ 286 contacts/s). BeySpirit channels wing centrifugal energy into feather-blade projectiles (Case 730) or spiral conduit (Case 731). EWD (Case 302): r_eff_core ≈ 1.5 mm; dω/dt = −5.9 rad/s²; spin life ≈ 101.7 s; α_EWD = 0.45 (45% lateral absorption). Evil Befall wheel [M]: smooth stamina profile φ ≈ 42°, C₂.  
**Engine Note**: UW145 = fixed cylinder (height_cm: 1.45) + 3 WingDefs (count: 3, spacingDeg: 120, movementType: "fixed", tiltAngle_deg: +12) — the positive tiltAngle on the WingDef is what produces upper-attack behavior via upperLaunch mechanic; NOT 4 wings. C₃ symmetry → nutationForcing = 0. EWD near-point stamina + free-spin absorption; two separate special moves from same assembly.

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

### [Case 754 — [SPECIAL MOVE] Brutal Squall: Wakiya Murasaki / Brutal Lúinor 13 Jolt](./13%20case%20study.md#case-754)

**Category**: Special Move — reactive aerial counter-dive  
**Bey / Blader**: Wakiya Murasaki / Brutal Lúinor 13 Jolt (Burst God Layer)  
**Franchise Move**: Lúinor launches off wall, soars overhead, dive-bombs straight down. Only triggered by an incoming attack — pure reactive counter.  
**Key Physics**: Trigger-required: activates only when F_impact ≥ 4.0 N. Phase 1 (impact_reaction): Case 753 Jolt launch; v_z = k_jolt × (F − 4.0) / m; at F = 8.0 N → v_z ≈ 2.72 m/s (√(v_h² + 2gh) with h ≈ 0.12 m); beyTiltAngle → 75°; wall-flip reverses v_horizontal. Phase 2 (apex_pause 150 ms): aerial positioning window; opponent cannot_move_away. Phase 3 (dive_bomb): Brutal Lúinor C₄ smash at φ = 22°; spinDelta = −520 rad/s; impulse 5200 eu; damageMultiplier 2.4×; burstBonus +25%. Self-cost −160 spinDelta (Jolt rubber burns fast; BeySpirit suppresses worst of wall-impact cost). Stance expires if no attack within 3000 ms of activation.  
**Compatible beys**: Any beyblade.  
**Engine Note**: trigger-only activation (no manual launch); wall-flip v_h reversal; v_z aerial-launch model; burstBonus +25% from dive angle.

---

### [Case 755 — [COMBO] Squall Dive: Jolt Orbit-Break Re-Entry (3-key: ↓↑J)](./13%20case%20study.md#case-755)

**Category**: Combo — aerial re-entry overhead strike  
**Sequence**: moveDown → moveUp → attack  
**Key Physics**: Combo expression of Case 753 Jolt impact-reactive launch without BeySpirit amplification. Phase 1 (↓): defensive retreat; contact pressure loads Jolt threshold. Phase 2 (↑): upward arc at tilt ≈ 35° (below full 75° dive; combo budget); v_z ≈ 0.8 m/s. Phase 3 (J): elevated overhead smash; spinDelta = −49 rad/s; damageMultiplier 1.40×; lockMs 70. No burstBonus at combo scale (requires BeySpirit dive physics). Cost 25, attack-type.  
**Engine Note**: partial aerial trajectory vs full dive-bomb in Case 754; no burstBonus without BeySpirit; Jolt rubber window still applies.

---

### [Case 756 — [GIMMICK] Dark Bull H145SD: H145 Horn Spin Track Upper Contact, Dark Bull Fusion Wheel, and Semi-Defense Tip Stability](./13%20case%20study.md#case-756)

**Category**: Gimmick — H145 Spin Track horn upper contact + Dark Bull Fusion Wheel + SD tip  
**Parts**: Dark Bull H145SD (Metal Fight Beyblade) — Dark Bull Fusion Wheel + H145 Spin Track + SD Performance Tip  
**Key Physics**: H145 Spin Track geometry — cylinder base height = 14.5 mm (1.45 cm); the 145 designation is the cylinder height, not a radius. The 2 horns are WingDef sub-components fixed to the cylinder body (movementType: "fixed", C₂ symmetry, spacingDeg: 180). Each horn has contact points on **both sides** (both the leading face and the trailing face of the wing) — 4 contact points total: 2 horns × 2 contact faces per horn. Horn tips extend outward at θ_engage ≈ 13° above horizontal; r_horn_tip ≈ 2.5 cm. H145 foldSymmetry = 2 (C₂ horn pair) → Δ_I > 0, some nutation forcing. Horn contact zone sits at z = 0.6–1.45 cm (track height band). Dark Bull Fusion Wheel (MFB term — not AR): C₂ asymmetric; bull-horn smash face on one side (φ_bull ≈ 20°), rounded defense face opposite; equatorial contact at z = 1.45–2.1 cm (above the track). SD tip: r_eff ≈ 0.25 cm (annular contact); μ = 0.22; dω/dt = −10.0 rad/s²; spin life ≈ 60.0 s; moderate stability. Assembly uses H145's bilateral horn contact for surprise under-tilt upper strike.  
**Engine Note**: H145 = fixed cylinder (height_cm: 1.45) + 2 WingDefs (count:2, spacingDeg:180, movementType:"fixed", contactFaces:"both_sides" → 4 ContactPoints total). Horn contact z = 0.6–1.45 cm; Dark Bull FW contact z = 1.45–2.1 cm — two non-overlapping z bands. The "both sides" contact means the horn can strike whether it is the leading or trailing wing face in the rotation direction. SD tip stability budget. No AR in this system — Dark Bull is a Fusion Wheel (MFB).

---

### [Case 757 — [SPECIAL MOVE] Bull Uppercut: Benkei Hanawa / Dark Bull H145SD](./13%20case%20study.md#case-757)

**Category**: Special Move — horn-lock tilt uppercut  
**Bey / Blader**: Benkei Hanawa / Dark Bull H145SD (Metal Fight Beyblade)  
**Franchise Move**: Dark Bull charges low, horn engages under opponent's rim, violently uppercuts opponent upward. Benkei attacks head-on.  
**Key Physics**: Phase 1 (tilt_under 300 ms): BeySpirit forces beyTiltAngle_self → −12° (nose-down approach); H145 horn clears under opponent bottom. Phase 2 (horn_lock 50 ms QTE "Break Lock"): horn engages at θ = 13°; if QTE missed → successful lock → opponent beyTiltAngle_opp +20° (destabilised, nutation likely). Phase 3 (uppercut_fire): full H145 horn leverage; spinDelta = −280 rad/s; upward impulse 3200 eu; damageMultiplier 1.8×. QTE "Block Uppercut" 130 ms (aerial state). Self-cost −120 spinDelta (nose-down approach friction + horn impact).  
**Compatible beys**: Any beyblade.  
**Engine Note**: tilt_self manipulation for under-rim approach; horn-lock tilt penalty on opponent; two sequential QTEs (Break Lock + Block Uppercut).

---

### [Case 758 — [COMBO] Bull Undercut: H145 Horn Sweep (3-key: ↓J↑)](./13%20case%20study.md#case-758)

**Category**: Combo — horn-sweep undercut  
**Sequence**: moveDown → attack → moveUp  
**Key Physics**: Combo expression of Case 756 H145 horn geometry. Phase 1 (↓): low approach, Dark Bull nose-tilt partial (combo-scale: beyTiltAngle_self → −5°). Phase 2 (J): horn at θ = 13° engages opponent lower rim; spinDelta = −40 rad/s; damageMultiplier 1.30×; lockMs 80 (horn sweep arc traversal time). Phase 3 (↑): upward launch exit; clears opponent after sweep. No tilt penalty at combo scale (no BeySpirit enforcement). Cost 25, attack-type.  
**Engine Note**: partial tilt approach vs full −12° in Case 757; horn sweep lockMs 80 reflects arc geometry; no tilt-penalty without BeySpirit.

---

### [Case 759 — [GIMMICK] Burn Fireblaze 135MS: Metal Sharp Tip Near-Point Stamina and Circular Blade Spin Persistence](./13%20case%20study.md#case-759)

**Category**: Gimmick — MS near-point tip + 135 height + circular stamina blade  
**Parts**: Burn Fireblaze 135MS (Metal Fight Beyblade) — Burn Fireblaze wheel [M] + 135 track + MS tip  
**Key Physics**: MS tip: r_eff = 0.5 mm (near-point, almost bearing); μ ≈ 0.10; F_lat = μ × m × g = 0.10 × 0.038 × 9.81 ≈ 0.037 N; dω/dt ≈ −2.45 rad/s²; spin life ≈ 245 s (theoretical maximum in MS class). 135 track: intermediate height for stable precession orbit. Burn Fireblaze wheel [M]: full circular rim C₁₂ symmetry; rim contact φ ≈ 42°; optimised for sustained orbital stamina — minimal smash attack. Assembly is the highest-endurance non-bearing tip in Metal Fight Beyblade.  
**Engine Note**: MS near-point friction model; 245 s spin life; Burn wheel C₁₂ stamina profile.

---

### [Case 760 — [SPECIAL MOVE] Burning Fire Strike: Masamune Kadoya / Burn Fireblaze 135MS](./13%20case%20study.md#case-760)

**Category**: Special Move — dual-path fire strike  
**Bey / Blader**: Masamune Kadoya / Burn Fireblaze 135MS (Metal Fight Beyblade)  
**Franchise Move**: Fireblaze ignites in orbital fire; straight-line charge OR aerial fire arc crashes down. Thermal energy melts opponent's tip contact zone.  
**Key Physics**: Phase 1 (ignition 500 ms): BeySpirit fire aura; v_orb → 4.5 m/s. Phase 2 branching — extreme_friction path (flat arena): MS tip transitions to Flat-like friction (BeySpirit heat μ → 0.35); v_linear 5.0 m/s; spinDelta = −480 rad/s; impulse 5000 eu; damageMultiplier 2.2×; fireDebuff ×1.4 / 2500 ms. OR aerial_arc path (slope/wall available): beyond wall ascent v_z ≈ 1.5 m/s → dive at φ_impact = 35°; same spinDelta/impulse/dmg + upwardKick 800 eu. Self-cost −200 spinDelta (MS tip nearly stalled by BeySpirit heat friction). QTE "Fire Wall" 180 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: two-path branching from arena geometry; BeySpirit heat-friction transition on MS tip; fireDebuff ×1.4 thermal zone.

---

### [Case 761 — [COMBO] Ember Approach: Burn Circular Orbit Graze (3-key: ↓→J)](./13%20case%20study.md#case-761)

**Category**: Combo — stamina orbital graze  
**Sequence**: moveDown → moveRight → attack  
**Key Physics**: Combo expression of Case 759 MS orbital endurance. Phase 1 (↓): pull back to orbit periphery. Phase 2 (→): rightward orbital arc maintains near-tangential approach (stamina-type φ = 42°). Phase 3 (J): Burn rim contact; spinDelta = −42 rad/s; damageMultiplier 1.25×; lockMs 45 (smooth rim sliding). No fireDebuff at combo scale. Cost 15, stamina-type.  
**Engine Note**: near-tangential graze geometry from stamina profile; low lockMs from circular blade; low cost reflects stamina archetype.

---

### [Case 762 — [GIMMICK] Flame Serpent SW145F: S-Wave Spin Track Asymmetric Drag and Flat-Tip Orbital Drive](./13%20case%20study.md#case-762)

**Category**: Gimmick — SW145 asymmetric path deflection + F tip orbit  
**Parts**: Flame Serpent SW145F (Metal Masters) — Flame Serpent wheel [M] + SW145 track + F tip  
**Key Physics**: SW145: sinusoidal wave track; asymmetric aerodynamic drag F_asym ≈ 0.05 N; each tab-switch deflects path Δθ ≈ 8–12° per pass; creates irregular orbital arc that defies prediction. Flame Serpent wheel [M]: C₂ serpentine blade; φ ≈ 25° one side, rounded deflection opposite. F tip (Case 339): r_flat = 2.04 mm; μ = 0.35; dω/dt = −44.1 rad/s²; spin life 13.6 s; R_curve ≈ 73 mm. SW145 path irregularity + F tip speed = unpredictable fast orbit with stochastic contact angle.  
**Engine Note**: SW145 tab-switch path-deflection model; Δθ per tab; F tip orbital drive; stochastic approach angle for combat.

---

### [Case 763 — [SPECIAL MOVE] Burning Mirage: Ryuga Kishiro / Flame Serpent SW145F](./13%20case%20study.md#case-763)

**Category**: Special Move — accelerating mirage orbit attack  
**Bey / Blader**: Ryuga Kishiro / Flame Serpent SW145F (Metal Masters)  
**Franchise Move**: Serpent spirit multiplies into phantom images; true Serpent accelerates to 3–4× speed; phantom images confuse opponent as real Serpent strikes.  
**Key Physics**: Phase 1 (mirage_spawn 800 ms): BeySpirit creates N_phantom = 3 decoys at equal angular spacing; opponent HUD obscured. Phase 2 (spiral_acceleration): v_orb 0.5 → 3.5 m/s over 3 laps (exponential ramp); opponent must_track_true_bey (QTE "True Serpent" 350 ms). Phase 3 (flame_strike): if QTE missed → spinDelta = −350 rad/s; impulse 4200 eu; damageMultiplier 1.9×; fireDebuff ×1.2 / 2000 ms. QTE hit → spinDelta = −180; dmg 1.4×. Self-cost −160 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: phantom decoy HUD mechanic; v_orb acceleration ramp 0.5→3.5 m/s; QTE True Serpent branching damage.

---

### [Case 764 — [COMBO] Serpent Drift: SW145 Path-Deflection Feint (3-key: ←↓J)](./13%20case%20study.md#case-764)

**Category**: Combo — deflection feint strike  
**Sequence**: moveLeft → moveDown → attack  
**Key Physics**: Combo expression of Case 762 SW145 tab-deflection. Phase 1 (←): leftward orbital entry; SW145 tab applies Δθ ≈ 8° to approach angle. Phase 2 (↓): path deflects downward-inward (second tab), approach appears to retreat. Phase 3 (J): Flame Serpent blade strikes from unexpected angle (combo feint); spinDelta = −44 rad/s; damageMultiplier 1.35×; lockMs 55. No phantom decoys at combo scale. Cost 25, attack-type.  
**Engine Note**: SW145 two-tab deflection as combo feint mechanism; lockMs 55 from angled contact; no BeySpirit phantoms at combo scale.

---

### [Case 765 — [GIMMICK] Samurai Ifraid W145CF: Wing 145 Upper Contact Centrifuge and Central Flat Aggressive Tip](./13%20case%20study.md#case-765)

**Category**: Gimmick — W145 wing upper + CF tip orbit + Ifraid flame wing AR  
**Parts**: Samurai Ifraid W145CF (Metal Masters) — Samurai Ifraid wheel [M] + W145 track + CF tip  
**Key Physics**: W145 (Case 303-variant): h = 14.5 mm; r_wing = 20 mm; θ_engage = 16° above horizontal (vs UW145's 12°); 4-wing C₄; J_upper = sin(16°) × J = 0.276 × J. Ifraid wheel [M]: phoenix-wing blade φ = 20° main; wing extension φ_wing = 20°; bilateral upper-attack geometry. CF tip: r_eff = 3.0 mm center; μ = 0.32; dω/dt = −44.9 rad/s²; spin life ≈ 13.4 s. CF centrifugal orbit combines with W145 upper angle for simultaneous orbit drive and aerial blade contact.  
**Engine Note**: W145 θ_engage = 16° (steeper than UW145 12°); CF centrifugal orbit; Ifraid bilateral wing geometry.

---

### [Case 766 — [SPECIAL MOVE] Burning Tornado Fire: Chris Teufel / Samurai Ifraid W145CF](./13%20case%20study.md#case-766)

**Category**: Special Move — multi-beast scaling tornado AoE  
**Bey / Blader**: Chris Teufel / Samurai Ifraid W145CF (Metal Masters)  
**Franchise Move**: Wing flames ignite; Ifraid spirit joined by allied beast spirits; combined BeySpirit tornado engulfs entire arena. Scales with number of allied bey-spirits present.  
**Key Physics**: n_beasts determines scaling tier — 1 beast: spinDelta = −380 rad/s; impulse 3500 eu; dmg 1.9×; 3–4 beasts: spinDelta = −500; impulse 5000 eu; dmg 2.4×; 5 beasts (max): spinDelta = −700; impulse 6500 eu; damageMultiplier 3.0×; burstBonus +50%; AoE all opponents −200 rad/s additional each. Self-cost (all tiers): −450 spinDelta; ally-cost −150 rad/s each contributing beast-spirit. Cooldown 10000 ms (longest in CS13). QTE "Storm Break" 200 ms window. Special-move-only — combos cannot create arena-wide effects or multi-bey AoE at this scale.  
**Compatible beys**: Any beyblade.  
**Engine Note**: n_beasts integer scaling table; AoE all opponents; ally-cost per contributing spirit; 10000 ms cooldown as game design ceiling.

---

### [Case 767 — [SPECIAL MOVE] Burning Uppercut: Chris Teufel / Samurai Ifraid W145CF](./13%20case%20study.md#case-767)

**Category**: Special Move — cyclone-pull wing uppercut  
**Bey / Blader**: Chris Teufel / Samurai Ifraid W145CF (Metal Masters)  
**Franchise Move**: Ifraid wing creates cyclone; sucks opponent inward, then wing uppercuts opponent skyward.  
**Key Physics**: Phase 1 (cyclone_pull 600 ms): BeySpirit generates inward pull force on opponent F_pull = 5.10 N; opponent cannot_move_away during pull; beyTiltAngle_self → +8° (windup lean). Phase 2 (wing_uppercut): W145 wing θ = 16°; Ifraid wing extension engages; spinDelta = −400 rad/s; upward impulse 4500 eu; damageMultiplier 2.0×; beyTiltAngle_opponent +15° (destabilised aerial). QTE "Cut Cyclone" 280 ms (during pull phase — interrupt before uppercut). Self-cost −180 spinDelta. Distinct from Burning Tornado Fire (767 is single-target; 766 is AoE multi-beast).  
**Compatible beys**: Any beyblade.  
**Engine Note**: F_pull cyclone inward-force model; tilt penalty +15° on opponent; two separate specials from same assembly — tornado (766) vs uppercut (767).

---

### [Case 768 — [COMBO] Ifraid Wing Arc: W145 Upper Overhead (3-key: ↑J↓)](./13%20case%20study.md#case-768)

**Category**: Combo — overhead upper-wing arc  
**Sequence**: moveUp → attack → moveDown  
**Key Physics**: Combo expression of Case 765 W145 upper-angle geometry. Phase 1 (↑): upward orbital arc; elevation positions W145 wing above opponent rim (from-above vs Bull Undercut's from-below). Phase 2 (J): W145 wing at θ = 16°; spinDelta = −47 rad/s; damageMultiplier 1.35×; lockMs 65 (wing arc traversal). Phase 3 (↓): downward post-contact exit; orbit continues below. Contrast with Case 758 Bull Undercut (↓J↑ from-below) — this is the from-above mirror. Cost 25, attack-type.  
**Engine Note**: from-above orbital entry vs from-below; W145 θ_engage = 16°; symmetrical contrast with Case 758.

---

### [Case 769 — [GIMMICK] Strata Dragoon V: Dragon Saucer Core AR Rolling Disc Mode, Final Clutch Base with Gradual Deceleration Guard, and Right Engine Gear Metal Flat](./13%20case%20study.md#case-769)

**Category**: Gimmick — rolling disc mode + GDG Final Clutch + Right EG Metal Flat  
**Parts**: Strata Dragoon V, Plastic Gen V-Force — Dragon Saucer Core AR + Eight Balance WD + Right SG (Reverse) [M] + Final Clutch Base GDG [M]  
**Key Physics**: Dragon Saucer Core AR: r_saucer = 21 mm; low-profile disc shape; rolling mode activation at tilt ≥ 45°: beyTiltAngle → 85°; v_roll = ω × r_saucer × cos(tiltAngle) = ω × 0.021 × cos(85°) ≈ ω × 0.00183 m; at ω = 500 rad/s → v_roll ≈ 0.92 m/s. Right EG Metal Flat (Case 339-variant): μ = 0.35; r_eff = 2.04 mm flat. Final Clutch Base GDG: Gradual Deceleration Guard — clutch delays EG spring release from t₀ to t_GDG (±1.5 s variance from tilt state). Assembly m = 0.044 kg; I = 9.0×10⁻⁶ kg·m²; ω₀ = 500 rad/s.  
**Engine Note**: rolling disc v_roll model vs normal spinning; beyTiltAngle threshold for disc mode activation; GDG clutch timing variance.

---

### [Case 770 — [SPECIAL MOVE] Vast Cutter: Daichi Sumeragi / Strata Dragoon V](./13%20case%20study.md#case-770)

**Category**: Special Move — rolling saw-blade cleave  
**Bey / Blader**: Daichi Sumeragi / Strata Dragoon V (Beyblade V-Force)  
**Franchise Move**: Strata Dragoon rolls on its side as a giant energy saw blade (BeySpirit expands r_saucer to r_saw = 60 mm). Cleaves solid constructs. First special move used by Daichi.  
**Key Physics**: Phase 1 (rolling_approach 600 ms): beyTiltAngle → 85°; BeySpirit sustains ω; v_roll = ω × r_saucer = 500 × 0.021 ≈ 10.5 m/s. Phase 2 (saw_cleave): extended traversal lock — saw crosses opponent body; spinDelta = −500 rad/s; linearImpulse = 6000 eu; damageMultiplier 2.3×; lockMs = 200 (saw traversal — cleave geometry); burstChanceBonus +20% (perpendicular disc torque). QTE "Disc Break" 200 ms (jump): success → 50% spinDelta, lockMs 50. Self-cost −180 spinDelta (EG Metal Flat at 85° tilt — rolling friction).  
**Compatible beys**: Any beyblade.  
**Engine Note**: lockMs 200 reflects disc traversal (longest contact lock in CS13 specials); beyTiltAngle 85° maintained during contact; BeySpirit anime override re-engages EG spring.

---

### [Case 771 — [SPECIAL MOVE] Vast Hurricane: Daichi Sumeragi / Strata Dragoon V](./13%20case%20study.md#case-771)

**Category**: Special Move — centrifugal dust-devil ring-out  
**Bey / Blader**: Daichi Sumeragi / Strata Dragoon V (Beyblade V-Force)  
**Franchise Move**: Strata Dragoon circles at high speed creating a dust devil to blow the opposing bey away. Second special move used by Daichi.  
**Key Physics**: Phase 1 (EG_surge 200 ms): BeySpirit re-engages EG spring; v_orb → 3.0 m/s; R_orbit ≈ 80 mm. Phase 2 (dust_devil 800 ms): centrifugal force F = m × v²/R = 0.044 × 9.0 / 0.080 = 4.95 N outward; forceState "outward_wind_push" on opponent. Phase 3 (wind_release): spinDelta = −220 rad/s (wind, not blade contact); linearImpulse = 5000 eu outward (ring-out direction); damageMultiplier 1.6×. QTE "Dust Guard" 200 ms (defense): success → 50% impulse only. Self-cost −130 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: outward impulse (inverse of Burning Uppercut inward pull); EG spring BeySpirit re-engagement; ring-out threat from outward 5000 eu.

---

### [Case 772 — [COMBO] Saucer Roll: Dragon Saucer AR Disc-Edge Sweep (3-key: →J↑)](./13%20case%20study.md#case-772)

**Category**: Combo — partial disc-edge rolling contact  
**Sequence**: moveRight → attack → moveUp  
**Key Physics**: Combo expression of Case 769 Dragon Saucer disc-edge geometry. Phase 1 (→): rightward sweep raises beyTiltAngle to ≈20° (partial disc-edge engagement, below full 85° rolling mode). Phase 2 (J): Dragon Saucer disc-edge contact; force distributed across ~5 mm arc; spinDelta = −43 rad/s; damageMultiplier 1.25×; lockMs = 80 (disc-edge traversal arc vs blade point 50 ms). Phase 3 (↑): tilt recovery exit arc. No full rolling disc mode at combo scale (BeySpirit required for 85° sustained tilt). Cost 25, attack-type.  
**Engine Note**: lockMs 80 reflects disc-edge wider contact geometry; beyTiltAngle 20° partial vs 85° full; no v_roll model at combo scale.

---

### [Case 773 — [GIMMICK] Forbidden Eonis ED145FB: ED145 Centrifugal Air-Control Wing Track, FB Compound Tip, and Forbidden Fusion Wheel Peripheral Inertia](./13%20case%20study.md#case-773)

**Category**: Gimmick — ED145 air-control pressure field + FB compound tip stamina  
**Parts**: Forbidden Eonis ED145FB (Metal Fight Beyblade) — Forbidden Fusion Wheel [M] (Case 353a) + Eonis Clear Wheel [M] (Case 353d) + ED145 Track (Case 353b) + FB tip (Case 353c)  
**Key Physics**: ED145 (Case 353b): 3 free-rotating wings; r_wing = 15 mm; v_tip = ω × r_wing = 600 × 0.015 = 9.0 m/s; centrifugal air pressure q = 49.6 Pa; R_field ≈ 67 mm. Forbidden Fusion Wheel [M] (Case 353a): 31.7 g; I = 7.97×10⁻⁶ kg·m²; φ_gap = 45°; J_gap = 0.707×J. FB tip (Case 353c): ball mode r_ball = 2.5 mm; dω/dt_ball ≈ 0.231 rad/s² (this assembly, 0.041 kg); flat mode at θ > 8.2°. Assembly: m = 0.041 kg; I = 9.01×10⁻⁶ kg·m²; ω₀ = 600 rad/s. FB ball-mode spin life theoretical maximum for non-bearing class.  
**Engine Note**: ED145 centrifugal pressure field model; R_field spin-dependent radius; FB compound tip θ_switch model.

---

### [Case 774 — [SPECIAL MOVE] Burst Satellite: Jigsaw / Forbidden Eonis ED145FB](./13%20case%20study.md#case-774)

**Category**: Special Move — AoE field stamina drain + simultaneous supernova blast  
**Bey / Blader**: Jigsaw / Forbidden Eonis ED145FB (Metal Fight Beyblade)  
**Franchise Move**: Eonis focuses all spin into itself then blasts a red supernova AoE. Powerful enough to drain Evil Befall, Spiral Fox, and Spiral Lyre simultaneously.  
**Key Physics**: Phase 1 (energy_compression ~1.5 s): BeySpirit spin-up ω 600 → 850 rad/s; ΔKE = 1.633 J stored; v_tip_max = 12.75 m/s; q_max = 99.7 Pa. Phase 2 (satellite_field 1500 ms): R_field = R_stadium ≈ 90 mm (AoE all opponents); vortex_pull F = 1.5 N inward; opponent spinDecayRate ×2.0 for 1500 ms ("sapping stamina"). Phase 3 (supernova_burst AoE): per-opponent spinDelta = −280 rad/s; linearImpulse = 2800 eu outward; damageMultiplier 1.8×. Self-cost −250 spinDelta (compression-release energy dump). QTE "Satellite Guard" 260 ms (defense): success → 30% spinDelta per opponent. Cooldown 8000 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: AoE field-type special (special-move-only — combos cannot replicate stadium-wide spinDecayRate boost); vortex_pull inward then supernova outward; three-opponent franchise basis captured by per-opponent AoE.

---

### [Case 775 — [COMBO] Eternal Wing: ED145 Free-Rotating Wing Deflection Pass (3-key: ↑K↑)](./13%20case%20study.md#case-775)

**Category**: Combo — ED145 wing sweep + Forbidden gap double contact  
**Sequence**: moveUp → defense → moveUp  
**Key Physics**: Combo expression of Case 773 ED145 wing deflection. Phase 1 (↑): upper orbital arc approach. Phase 2 (K): ED145 wing at r = 15 mm sweeps against opponent outer ring; τ_pivot = 2.63×10⁻³ N·m (wing transmits force, not folds); wing contribution spinDelta ≈ −20 rad/s. Forbidden gap φ = 45° simultaneous: spinDelta contribution ≈ −24 rad/s. Combined: spinDelta = −44 rad/s; damageMultiplier 1.30×; lockMs 50. Phase 3 (↑): FB ball tip exit at near-zero friction (dω/dt_ball ≈ 0.231). No air-vortex field at combo scale. Cost 15, balanced-type.  
**Engine Note**: ED145 wing + Forbidden gap double-component hit; low cost reflects stamina/balanced archetype; no BeySpirit vortex field at combo level.

---

### [Case 776 — [GIMMICK] Bushin Ashindra Hurricane Keep Ten: Twelve-Blade Defense Shell, Hurricane Disc, and Keep Tip Phase Transition](./13%20case%20study.md#case-776)

**Category**: Gimmick — 12-blade defense barrier + 7-tooth burst resistance + Keep tip phase  
**Parts**: Bushin Ashindra Hurricane Keep Ten (Burst GT/Gatinko) — Gatinko Chip Ashura (Case 607) + Layer Weight Ten (Case 608) + Layer Base Bushin (Case 609) + Forge Disc Hurricane (Case 610) + Performance Tip Keep (Case 611)  
**Key Physics**: Layer Base Bushin (Case 609): 12 blades, r_blade = 20 mm; α_blade = 25° sweep-back; F_radial = sin(25°) × F = 0.423×F (57.7% recoil reduction). Ashura chip (Case 607): 7-tooth ratchet; burst resistance ×2.33. Bushin deep skirt: burst probability ×0.60 baseline. Combined: 0.60 / 2.33 = 0.257 burst contact ratio (74.3% lower than baseline). Hurricane disc (Case 610): 25.1 g; I = 2.369×10⁻⁶ kg·m²; inward-concentrated. Keep tip (Case 611): Phase 1 (ω > 200 rad/s) dω/dt = −116.0 rad/s²; Phase 2 (ω < 200) dω/dt = −58.0 rad/s². Assembly: m = 53.0 g; I = 8.966×10⁻⁶ kg·m²; ω₀ = 694 rad/s.  
**Engine Note**: three-layer burst suppression stack; Keep ω_couple 200 rad/s phase transition; Bushin I-fraction dominance (45.9%) despite being 19.4% of mass.

---

### [Case 777 — [SPECIAL MOVE] Bushin Guard: Arman Kusaba / Bushin Ashindra Hurricane Keep Ten](./13%20case%20study.md#case-777)

**Category**: Special Move — pure sustained defensive guard  
**Bey / Blader**: Arman Kusaba / Bushin Ashindra Hurricane Keep Ten (Beyblade Burst GT)  
**Franchise Move**: Six of twelve Bushin blades create a lime-green whirlwind that defends from opposing attacks.  
**Key Physics**: Phase 1 (instantaneous): BeySpirit activates 6 of 12 blades (alternating hexagonal set); v_tip = 694 × 0.020 = 13.88 m/s; q_vortex = 117.9 Pa; R_guard = 35 mm; forceState "whirlwind_guard". Phase 2 (guard_window 2000 ms): any incoming contact within 35 mm → spinDelta_received ×0.20 (80% deflected); spinDelta_self +35 per absorbed hit (deflected energy recycled); incoming attack vector rotated +70° (tangential vortex redirect — removes burst-axis alignment). Phase 3 (expire): guard ends; net = +35 × N_hits recovery. Self-cost −100 spinDelta (activation). Opponent QTE "Vortex Break" (J within 250 ms): bypasses 80% deflection for that hit. Only purely defensive special in CS13 — no counter-attack phase.  
**Compatible beys**: Any beyblade.  
**Engine Note**: 80% deflection model; +35 spin recovery per hit absorbed; no counter-attack distinguishes this from all other CS13 specials.

---

### [Case 778 — [COMBO] Whirlwind Parry: Bushin Swept-Blade Double Deflect (3-key: K↑K)](./13%20case%20study.md#case-778)

**Category**: Combo — swept-blade double parry  
**Sequence**: defense → moveUp → defense  
**Key Physics**: Combo expression of Case 776 Bushin 12-blade geometry. Phase 1 (K): Bushin swept-blade defense stance; α = 25° contact → 42.3% radial recoil (57.7% redirected). Phase 2 (↑): redirected force channels upward along swept-blade ramp. Phase 3 (K): second Bushin blade contacts from complementary angle (12-blade density: next blade always within 30°); spinDelta = −37 rad/s; damageMultiplier 1.20×; lockMs 30. No sustained whirlwind field at combo scale (BeySpirit required). Cost 15, defense-type.  
**Engine Note**: α = 25° radial transmission 42.3% consistent with spinDelta = 37 vs full-force; double-parry geometry from 12-blade density; no field effect at combo level.

---

### [Case 779 — [GIMMICK] Spiral Fox TR145W²D: TR145 Rolling-Resistance LAD Approach and W²D Compound Tip Wear Progression](./13%20case%20study.md#case-779)

**Category**: Gimmick — TR145 roller-ball LAD + W²D compound tip + Spiral stamina wheel  
**Parts**: Spiral Fox TR145W²D (Metal Fight Beyblade: Metal Fury) — Spiral Fusion Wheel [M] + Fox Clear Wheel [M] + TR145 Track (Case 64) + W²D tip (Case 65)  
**Key Physics**: TR145 (Case 64): 3 roller balls; r_roller = 1.5 mm; C_rr = 0.004; LAD decel a_roll = 0.039 m/s² vs sliding a_slide = 4.9 m/s² (124× less drag); at tilt ≥ 80° rollers contact floor → rolling mode; approach momentum preserved. W²D (Case 65): θ_switch_fresh = 22°; worn (0.3): θ_switch = 13°; spike near-zero friction upright; disc flat μ = 0.50 at tilt. Spiral Fusion Wheel [M]: φ ≈ 15° smooth curved contacts; J_spiral = cos(15°) × J = 0.966×J. Assembly [M]: m ≈ 0.036 kg; I ≈ 5.59×10⁻⁶ kg·m²; ω₀ = 600 rad/s.  
**Engine Note**: TR145 rolling resistance model; LAD distance ratio 124× vs sliding; W²D θ_switch wear progression.

---

### [Case 780 — [SPECIAL MOVE] Buster Tail: Zeo Abyss / Spiral Fox TR145W²D](./13%20case%20study.md#case-780)

**Category**: Special Move — TR145 rolling-approach high-speed crash  
**Bey / Blader**: Zeo Abyss / Spiral Fox TR145W²D (Metal Fight Beyblade: Metal Fury)  
**Franchise Move**: Zeo motions a kick; Spiral Fox glows bright blue and crashes into opponent with great force.  
**Key Physics**: Phase 1 (kick_acceleration): beyTiltAngle → 75° (TR145 rollers enter floor contact); BeySpirit spin-to-linear conversion — 40% of KE_rot = 0.402 J → v_approach = √(2 × 0.402 / 0.036) = 4.73 m/s; a_roll = 0.039 m/s² (negligible approach drag). Phase 2 (crash_impact): F_crash = m × v / t = 0.036 × 4.73 / 0.003 = 56.8 N; spinDelta = −350 rad/s; linearImpulse = 5500 eu (primary output — ring-out risk); damageMultiplier 2.0×. QTE "Fox Guard" 200 ms (defense): success → 45% spin + impulse. Self-cost −160 spinDelta (40% KE consumed).  
**Compatible beys**: Any beyblade.  
**Engine Note**: rolling approach gives minimal QTE warning (high-speed, short window); TR145 rolling resistance makes approach near-frictionless; linearImpulse primary vs spinDelta secondary (straight-line crash archetype).

---

### [Case 781 — [COMBO] Rolling Slash: TR145 Low-Orbit Rolling Approach (3-key: ↓J↓)](./13%20case%20study.md#case-781)

**Category**: Combo — low-orbit tilt-augmented rolling approach strike  
**Sequence**: moveDown → attack → moveDown  
**Key Physics**: Combo expression of Case 779 TR145 rolling property. Phase 1 (↓): lower arc; beyTiltAngle rises to ≈15–25°; TR145 rollers begin floor engagement; W²D flat disc activates at wear ≈ 0.3 (θ_switch ≈ 13°). Phase 2 (J): Spiral wheel contact at tilt-augmented approach angle; φ = 15°; spinDelta = −45 rad/s; damageMultiplier 1.30×; lockMs 55. Phase 3 (↓): continue low orbit; TR145 rolling throughout (no approach momentum loss). No BeySpirit spin-to-linear conversion at combo scale. Cost 15, attack-type.  
**Engine Note**: TR145 rolling throughout combo (passive property); double-bottom effect (roller reduces drag + flat disc lateral grip at impact); no spin conversion without BeySpirit.

---

### [Case 782 — [GIMMICK] Galux: War Lynx AR Wide-Arc Cat-Paw Slicing Geometry and Speed-Optimised Attack Profile](./13%20case%20study.md#case-782)

**Category**: Gimmick — War Lynx AR wide-arc slash + speed-optimised light assembly  
**Parts**: Galux, Plastic Gen (unreleased/prototype) — War Lynx AR (Case 271) + WD [M] + Base [M]  
**Key Physics**: War Lynx AR (Case 271): ~6.65 g [M]; wide cat-paw contact arc ≈ 35°–40° span; φ_slash ≈ 12° [M]; J_slash = cos(12°) × J = 0.978×J; r_outer ≈ 22 mm. Wide arc = sustained contact slide vs point-impact smash (slicing geometry). Assembly [M]: m ≈ 0.029 kg; I ≈ 4.51×10⁻⁶ kg·m²; ω₀ = 500 rad/s. Lighter assembly → higher orbital speed at equal launch power (speed-optimised). WD [M] ≈ 14 g; Base [M] ≈ 7 g.  
**Engine Note**: wide arc contact duration model; 37° span vs standard narrow AR; all values [M] (prototype/unreleased bey, anime imagery only).

---

### [Case 783 — [SPECIAL MOVE] Cat Scratch: Mariah / Galux](./13%20case%20study.md#case-783)

**Category**: Special Move — beast-manifest straight-line slash charge  
**Bey / Blader**: Mariah / Galux (Beyblade Original Plastic Generation)  
**Franchise Move**: War Lynx cat spirit emerges from Galux, charges at opponent, delivers powerful slicing attack.  
**Key Physics**: Phase 1 (beast_manifest 800 ms): BeySpirit projects luminous lynx spirit; 50% KE_rot converts to linear — KE_linear = 0.282 J; v_charge = √(2 × 0.282 / 0.029) = 4.41 m/s. Phase 2 (claw_charge): straight-line non-orbital approach at 4.41 m/s; War Lynx wide arc (≈37°) sustained slide contact. Phase 3 (slash_impact): spinDelta = −420 rad/s; linearImpulse = 4800 eu; damageMultiplier 2.1×; burstChanceBonus +15% (wide-arc sustained contact maximises burst-angle exposure duration). QTE "Pounce Dodge" 200 ms (dodge/direction): success → 35% spinDelta + impulse. Self-cost −180 spinDelta. Cooldown 4500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: beast-manifest non-orbital linear approach; wide-arc lockMs proportional to 37° contact span; 50% KE conversion model.

---

### [Case 784 — [COMBO] Pounce Slash: War Lynx Wide-Arc Overhead Strike (3-key: ↑J←)](./13%20case%20study.md#case-784)

**Category**: Combo — upper-arc wide-arc slash with sweep exit  
**Sequence**: moveUp → attack → moveLeft  
**Key Physics**: Combo expression of Case 782 War Lynx wide-arc geometry. Phase 1 (↑): upper arc "pounce" approach — slightly downward contact angle at midplane. Phase 2 (J): War Lynx wide cat-paw arc ≈37° span engages from above; spinDelta = −48 rad/s; damageMultiplier 1.35×; lockMs 60 (wider arc span = longer contact than narrow AR). Phase 3 (←): sweep-through exit leftward — cat paw completing swipe. Sequence ↑J← traces pounce arc geometry. No beast-manifest at combo scale. Cost 15, attack-type.  
**Engine Note**: lockMs 60 reflects 37° contact arc vs narrow AR 50 ms; upper-arc pounce approach angle; sweep-through exit from wide blade geometry.

---

### [Case 785 — [GIMMICK] Chain Kerbeus Fortress Yard' (DB/BU System): Chain-Retraction Spin-Up, Fortress Hexagonal Disc, Yard' Dash Anti-Burst, and Slope-Climb Burst Immunity](./13%20case%20study.md#case-785)

**Category**: Gimmick — chain retraction angular-momentum spin-up + Yard' Dash anti-burst  
**Parts**: Chain Kerbeus Fortress Yard' (DB/BU) — DB Core Kerbeus (Case 462) + BU Blade Chain (Case 463) + Armor 6 (Case 464) + Forge Disc Fortress (Case 465) + Yard' Dash tip (Case 466)  
**Key Physics**: BU Blade Chain (Case 463): 6 rubber + 2 plastic chains; I_ext = 5.066×10⁻⁶; I_ret = 3.995×10⁻⁶; on-contact retraction spin-up: ω₂ = ω × (I_total_ext / I_total_ret) = ω × 1.062 (+6.2% per retraction). Fortress disc (Case 465): 25.1 g; I = 2.369×10⁻⁶ kg·m²; hexagonal C₂; eccentricity e = 0.322 mm; F_imb = 3.607 N (controlled orbital assist). Yard' Dash (Case 466): τ_burst_eff = 13.0 × 1.40 = 18.2 mN·m (effectively unburst-able). Yard' ball tip: dω/dt = −0.599 rad/s²; theoretical t_spin = 1158 s. Assembly: m = 74.8 g (heaviest DB/BU in CS13); I_ext = 1.833×10⁻⁵ kg·m²; ω₀ = 694 rad/s; KE₀ = 4.413 J (highest in CS13).  
**Engine Note**: chain retraction angular momentum conservation model; +6.2% ω per contact event; KE₀ = 4.413 J energy reservoir for slope-climb special.

---

### [Case 786 — [SPECIAL MOVE] Chain Break: Lain Valhalla / Chain Kerbeus Fortress Yard'](./13%20case%20study.md#case-786)

**Category**: Special Move — slope-climb potential-energy gravity-dive crash  
**Bey / Blader**: Lain Valhalla / Chain Kerbeus Fortress Yard' (DB/BU)  
**Franchise Move**: Chain Kerbeus climbs the bowl wall, forms chain barrier, then crashes down with gravity-dive force.  
**Key Physics**: Phase 1 (slope_climb): 25° wall; h = 63.4 mm; ΔPE = 0.04649 J; chain retraction at wall contact: ω rises +6.2% to 737 rad/s (BeySpirit). Phase 2 (chain_barrier 800 ms): all 8 chains extend to r = 22 mm; incoming attack absorption −40% (elastic chain absorption); Kerbeus self-decay negligible (Yard' ball dω/dt = −0.599 rad/s²). Phase 3 (gravity_dive_crash): BeySpirit amplification ×4.0; v_crash = √(2 × 9.81 × 0.0634) × 4.0 = 1.115 × 4.0 = 4.46 m/s; chain retraction at impact (+6.2% ω surge); spinDelta = −390 rad/s; linearImpulse = 5500 eu; damageMultiplier 1.9×; burstBonus +20% (chain tabs engage burst mechanism). QTE "Chain Barrier" 350 ms (J during phase 2): success → full chain radius at impact; miss → −25% spinDelta. Self-cost −180 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: slope-climb PE model; BeySpirit ×4.0 velocity amplifier; second +6.2% spin-up at impact contact; chain elastic absorption in phase 2.

---

### [Case 787 — [COMBO] Chain Strike: BU Blade Chain Retraction-Momentum Lateral Strike (3-key: →↑J)](./13%20case%20study.md#case-787)

**Category**: Combo — chain retraction spin-steal contact  
**Sequence**: moveRight → moveUp → attack  
**Key Physics**: Combo expression of Case 785 BU Blade Chain retraction. Phase 1 (→): right-flank approach. Phase 2 (↑): swing upward to opponent's burst-tab elevation. Phase 3 (J): contact at retraction moment — chain retraction spin-steal; spinDelta = −42 rad/s; damageMultiplier 1.28×; lockMs 45. BU Blade Chain part required. Cost 15, universal.  
**Engine Note**: chain retraction spin-steal at combo scale (no BeySpirit slope-climb); ceiling: 1.28× ≤ 1.5×; 45 ms ≤ 300 ms; −42 ≤ 50 all pass.

---

### [Case 788 — [GIMMICK] Burning Cerberus Ten Wide Cross Attack Customize Bearing Base: Triple Attacker Three-Head Geometry, Cross Attack SP Recoil, and CBB Upper-Attack Resistance](./13%20case%20study.md#case-788)

**Category**: Gimmick — Triple Attacker 3-head geometry + CBB zombie platform + Cross Attack SP tether  
**Parts**: Burning Cerberus, Plastic Gen — Triple Attacker AR (Case 153) + Ten Wide WD (Case 154) + Neo Right SG DB (Cases 155–156) + Cross Attack SP (Case 157) + Customize Bearing Base (Case 158)  
**Key Physics**: Triple Attacker AR (Case 153): 3 heads at 120° spacing — Head A θ = 23°/38° dual-face; Head B θ = 28° force-smash (C_smash = 0.883); Head C α = 28° spike (stress-concentrated). Dual-head engagement (arc < 120°): chain bonus J_chain = 1.12×J_single. Cross Attack SP (Case 157): α = 80°; J_recoil = 0.985×J (near-total radial recoil); anime chain-anchor protrusions for Chain Flame BeySpirit. CBB (Case 158): J_vertical = 0.30×J (−22% vs flat base); zombie-spin double-bearing τ_coupling ≈ 2.4×10⁻⁶ N·m (near-zero spin steal). Assembly [M]: m ≈ 31.6 g; I ≈ 1.061×10⁻⁵ kg·m²; ω₀ = 500 rad/s; KE₀ ≈ 1.326 J.  
**Engine Note**: dual-head chain bonus ×1.12; CBB upper-attack absorption −22%; Cross Attack SP as BeySpirit chain-anchor point.

---

### [Case 789 — [SPECIAL MOVE] Chain Flame: Leon Zagart / Burning Cerberus (Beyblade V-Force)](./13%20case%20study.md#case-789)

**Category**: Special Move — proximity tether DoT + bit-beast theft at 6.66 s  
**Bey / Blader**: Leon Zagart (Zeo Zagart) / Burning Cerberus (Beyblade V-Force)  
**Franchise Move**: Burning Cerberus attaches spectral flame-chains to opponent, dealing continuous damage. If proximity sustained 6.66 seconds: bit-beast stolen for 15 seconds.  
**Key Physics**: Trigger: both beys within 10 units. Phase 1 (chain_tether): BeySpirit projects flame-chains from Cross Attack SP protrusions; forceState "chain_tether". Phase 2 (proximity_burn, tick-based): opponent spinDecayRate ×1.5; opponent spinDelta = −0.8/tick at 60 Hz (= −48 rad/s per second). Chain break if opponent exits 10 units → all effects stop, theft does NOT trigger. Self-cost: spinDecayRate ×1.1 per second. QTE "Flame Hold" (hold J): reduces self ×1.1 to ×1.05. Phase 3 (bit_beast_theft at t = 6.66 s continuous): opponent "bit_beast_stolen" debuff 15000 ms (no SP earned; next special blocked 15 s); self spinDelta = −80. Full 6.66 s drain: opponent cumulative −320 rad/s. Total self-cost −120. Cooldown 7000 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: proximity timer resets on range break (chain-break anti-kite mechanic); bit-beast theft is special-move-only; sustained DoT model — not single-hit spinDelta.

---

### [Case 790 — [SPECIAL MOVE] Chain Storm: Leon Zagart / Burning Cerberus (Beyblade V-Force)](./13%20case%20study.md#case-790)

**Category**: Special Move — expanding chain-whip AoE sweep  
**Bey / Blader**: Leon Zagart (Zeo Zagart) / Burning Cerberus (Beyblade V-Force)  
**Franchise Move**: Burning Cerberus spins up until all 8 chains extend fully outward, then releases the full rotational momentum in a sweeping AoE burst. Chains rake any beyblade in the stadium.  
**Key Physics**: Phase 1 (spin_up 800ms): chain retraction reverse — BeySpirit drives ω up; all 8 chains extend to r = 22 mm. Phase 2 (chain_sweep): simultaneous AoE burst to all opponents within 120px. Per-target: spinDelta = −75 rad/s; linearImpulse = 1100 eu outward radial; dmgMult 1.65×; burstBonus +12% (chain tab burst geometry). Self-cost −200 spinDelta (full chain-extension drain). QTE "Chain Sweep" 250 ms (tap J before sweep fires): success → all spinDeltas + 20%; miss → standard. Cooldown 6500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: AoE radial burst — all opponents; chain extension reverses the retraction spin-up model; special-move-only AoE sweep.

---

### [Case 791 — [SPECIAL MOVE] Chain Thunder: Leon Zagart / Burning Cerberus (Beyblade V-Force)](./13%20case%20study.md#case-791)

**Category**: Special Move — lightning chain single-target stun  
**Bey / Blader**: Leon Zagart (Zeo Zagart) / Burning Cerberus (Beyblade V-Force)  
**Franchise Move**: One Cerberus chain becomes a lightning conductor; Cerberus orbits the opponent once and lashes out with a single electrified chain strike. Stuns the target — opponent controls lock for 500 ms.  
**Key Physics**: Phase 1 (orbit 500 ms): Cerberus circles opponent at r = 80 px (BeySpirit sustains orbit close range). Phase 2 (lightning_lash): single chain at θ_chain = 90° extends to r = 22 mm; spinDelta = −120 rad/s; linearImpulse = 2000 eu; dmgMult 1.85×; burstBonus +15%. Stun debuff: opponentInputLocked = true for 500 ms (unique debuff — first control-lock in CS13). Self-cost −130 spinDelta. QTE "Thunder Chain" 200 ms (J): success → stun duration 700 ms + burstBonus +20%. Cooldown 7500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: opponent input-lock 500–700 ms is special-move-only; single-chain BeySpirit amplification model; orbit phase before strike delivery.

---

### [Case 792 — [COMBO] Three-Head Slash: Burning Cerberus Triple AR Contact (3-key: J↑J)](./13%20case%20study.md#case-792)

**Category**: Combo — triple-head chain smash sequence  
**Sequence**: attack → moveUp → attack  
**Key Physics**: Combo expression of Triple Attacker AR 3-head geometry (Case 788). Phase 1 (J): Head A dual-face contact; spinDelta = −28 rad/s; dmgMult 1.22×; lockMs 25. Phase 2 (↑): orbital re-approach arc; elevation angle. Phase 3 (J): Head B force-smash C_smash = 0.883; spinDelta = −40 rad/s; dmgMult 1.38×; lockMs 35. Each hit individually within ceiling. Combined spinDelta −68 from two independent sources (28 and 40, each ≤50 individually); combined lockMs 60 ≤ 300. Cost 25, universal.  
**Engine Note**: two-source spinDelta (28 + 40) each ≤ 50 individually; combined lock 60 ms; dual-head chain bonus ×1.12 applies to second hit.

---

### [Case 793 — [GIMMICK] Grand Capricorn 145D — Grand AR Multi-Contact Geometry and D-Tip Orbit](./13%20case%20study.md#case-793)

**Category**: Gimmick — aggressive multi-contact AR + Defense tip orbit  
**Parts**: Grand Capricorn 145D [M] — Grand AR + 145 track + Defense tip  
**Key Physics**: Grand AR [M]: large, multi-contact aggressive wheel; 4 primary contacts at r_AR ≈ 22 mm [M]; θ_smash ≈ 20° [M]; C_smash ≈ 0.82 [M]. 145 track: height 14.5 mm. D (Defense) tip: r_tip ≈ 7 mm [M]; μ_D ≈ 0.06 [M] — wide rubber ring, low friction, stable orbit. Assembly [M]: m ≈ 42.0 g; I ≈ 1.20×10⁻⁵ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 2.160 J. dω/dt ≈ −1.85 rad/s² [M] (Defense tip stamina platform). BeySpirit amplification factor ×2.2 [M] (Tsubasa-era mid-tier blader).  
**Engine Note**: high-mass AR combined with low-friction D tip gives offense/stamina hybrid; C_smash 0.82 is among highest in gimmick assemblies.

---

### [Case 794 — [SPECIAL MOVE] Claw of the Storm: Tsubasa Otori early / Grand Capricorn 145D](./13%20case%20study.md#case-794)

**Category**: Special Move — claw-rend burst attack  
**Bey / Blader**: Tsubasa Otori (early MFB) / Grand Capricorn 145D  
**Franchise Move**: Grand Capricorn rises up and rakes across the opponent with claw-shaped BeySpirit energy.  
**Key Physics**: Phase 1 (rise 400 ms): beyTiltAngle → 35°. Phase 2 (claw_rend): 3 sequential raking contacts from multi-contact AR; spinDelta = −180 rad/s total (−60 per claw, 3 claws); linearImpulse = 2800 eu; dmgMult 1.80×; burstBonus +14%; lockMs = 120 ms (raking traversal). Self-cost −100 spinDelta. QTE "Storm Claw" 220 ms (J): miss → only 2 of 3 claws land. Cooldown 5500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: 3-claw multi-hit model; each claw −60 ≤ 50 checked individually (three sources); total combined delivers −180; lockMs 120 ms total traversal.

---

### [Case 795 — [COMBO] Horn Charge: Grand AR Rising Smash (3-key: ↑↑J)](./13%20case%20study.md#case-795)

**Category**: Combo — double-advance horn smash  
**Sequence**: moveUp → moveUp → attack  
**Key Physics**: Combo expression of Grand AR contact geometry. Double advance closes orbital gap rapidly; AR contact at full approach momentum. spinDelta = −46 rad/s; dmgMult 1.38×; lockMs 50. Cost 0 (free), universal. C_smash 0.82 utilized at standard orbital impact; no BeySpirit overhead.  
**Engine Note**: free combo using high-C_smash AR; 46 ≤ 50; 1.38× ≤ 1.5×; 50 ms ≤ 300 ms — all ceiling checks pass.

---

### [Case 796 — [GIMMICK] Venom/Erase Devolos Vanguard Bullet — Dual-Layer Clone and V2 Bullet Tip](./13%20case%20study.md#case-796)

**Category**: Gimmick — dual-spin-direction clone mechanic + Bullet rubber driver  
**Parts**: Venom/Erase Devolos Vanguard Bullet (DB/Burst BU era) — DB Core Devolos + BU Blade Venom (Burst-direction) or Erase (Attack-direction) + Vanguard disc + Bullet driver  
**Key Physics**: Dual-layer system: Venom blade = counter-clockwise (burst-direction), Erase blade = clockwise (standard attack). In anime, both layers can be active simultaneously — the Clone Attack BeySpirit creates a second phantom Devolos with the opposite spin direction, enabling simultaneous two-direction contact. Bullet driver [M]: μ_rubber ≈ 0.80; r_tip ≈ 4 mm; high-aggression orbit. dω/dt_Bullet ≈ −180 rad/s² [M] (short match duration intended). Assembly [M]: m ≈ 33.0 g; I ≈ 9.5×10⁻⁶ kg·m²; ω₀ = 650 rad/s; KE₀ ≈ 2.006 J.  
**Engine Note**: dual-spin clone is special-move-only; Bullet driver fastest-orbit rubber tip in Devolos assembly; BeySpirit required to actuate the anti-spin layer.

---

### [Case 797 — [SPECIAL MOVE] Clone Attack: Aiger Akabane / Venom/Erase Devolos Vanguard Bullet](./13%20case%20study.md#case-797)

**Category**: Special Move — dual-spin phantom clone simultaneous strike  
**Bey / Blader**: Aiger Akabane / Venom/Erase Devolos Vanguard Bullet (DB/Burst BU era)  
**Franchise Move**: Devolos' dual-layer BeySpirit creates a phantom clone that spins opposite to the real Devolos; both hit simultaneously from opposite angles. Impossible to burst-guard both at once — burst-tab guard is direction-specific.  
**Key Physics**: Phase 1 (clone_materialize 600 ms): BeySpirit splits; phantom clone appears at diametrically opposite arena position. Phase 2 (simultaneous_strike): real Devolos and clone both contact opponent in same tick. Real bey: spinDelta = −90 rad/s; linearImpulse = 1600 eu; dmgMult 1.70×; burstBonus +12%. Phantom clone: spinDelta = −60 rad/s; linearImpulse = 1000 eu; dmgMult 1.55×; burstBonus +25% (opposite-spin burst bypass). Total per event: −150 combined spinDelta; burst at least one direction. QTE "Mirror Strike" 200 ms (J): success → both hits at full; miss → clone at 60%. Self-cost −120. Cooldown 6500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: two-source spinDelta (90 + 60, each ≤ 50 fails individually — BeySpirit override justifies; special-move-only dual source); opposite-direction burst bypass is special-move-only.

---

### [Case 798 — [SPECIAL MOVE] Bullet Split: Aiger Akabane / Venom/Erase Devolos Vanguard Bullet](./13%20case%20study.md#case-798)

**Category**: Special Move — high-speed Bullet driver ring-out charge  
**Bey / Blader**: Aiger Akabane / Venom/Erase Devolos Vanguard Bullet  
**Franchise Move**: Devolos accelerates to maximum Bullet-driver speed and fires directly through the opponent toward the ring edge, carrying both beys toward ring-out.  
**Key Physics**: Phase 1 (bullet_charge 500 ms): Bullet rubber driver; BeySpirit ×2.5; v_charge = 1.5 × 2.5 = 3.75 m/s [M]. Phase 2 (split_through): linear penetration; spinDelta = −50 rad/s; linearImpulse = 1400 eu; knockbackImpulse = 12000 eu (ring-out priority); dmgMult 1.55×; burstBonus +8%. Self-cost −150 spinDelta (rubber tip drain at BeySpirit speed). QTE "Bullet Split" 200 ms (J): success → knockbackImpulse 14000 eu; miss → 12000 eu. Cooldown 5500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: knockbackImpulse 12000–14000 eu is highest ring-out threat in CS13; rubber driver spin drain is the limiting mechanic.

---

### [Case 799 — [COMBO] Chain Dispel: Burning Cerberus Chain Spin-Reset (3-key: KK↑)](./13%20case%20study.md#case-799)

**Category**: Combo — chain retraction defensive spin-reset  
**Sequence**: defense → defense → moveUp  
**Key Physics**: Burning Cerberus retracts all 8 chains via double-K guard brace, then uses the angular momentum conservation spin-up (+6.2% ω per retraction, Case 788) to escape while simultaneously dispersing an applied debuff. Double-K retracts chains twice: first KK triggers chain retraction ×2 → ω boost +(2 × 6.2%) = +12.4%; moveUp exits the zone. Primary effect: cleanse one active debuff (chain retraction dispersal — anime: chains physically throw off energy fields). No direct damage output. Cost 0 (free), universal. selfSpinGain +15 (from double retraction momentum).  
**Engine Note**: combo debuff-cleanse mechanic; no damage output; spin-up only; free utility combo.

---

### [Case 800 — [GIMMICK] Hazard Kerbeus 7 Atomic — 7 Forge Disc Dual-Spin and Atomic Rubber Bearing Orbit](./13%20case%20study.md#case-800)

**Category**: Gimmick — dual-spin layer + Atomic bearing-rubber tip hybrid orbit  
**Parts**: Hazard Kerbeus 7 Atomic [M] — Hazard Kerbeus DB Core + 7 Forge Disc + Atomic driver  
**Key Physics**: Hazard Kerbeus layer [M]: aggressive 3-head Kerbeus geometry; dual-spin compatible (mode-switch for CW or CCW). 7 Forge Disc [M]: 7-wing disc; m ≈ 10.5 g [M]; I ≈ 1.2×10⁻⁶ kg·m² [M]. Atomic driver [M]: bearing inner race (low friction r_bearing ≈ 2 mm, μ ≈ 0.015 [M]) + rubber outer ring (r_rubber ≈ 6 mm, μ_rubber ≈ 0.80 [M]); outer ring only engages on high orbital force. At low force: bearing mode → near-ES spin endurance; at high force: rubber mode → aggressive orbit. dω/dt_bearing ≈ −0.85 rad/s² [M] (bearing only). Assembly [M]: m ≈ 34.0 g; I ≈ 9.8×10⁻⁶ kg·m²; ω₀ = 650 rad/s; KE₀ ≈ 2.072 J.  
**Engine Note**: Atomic dual-mode tip; bearing mode stamina vs rubber mode orbit; mode auto-switches by applied lateral force.

---

### [Case 801 — [SPECIAL MOVE] Chain Counter: Hikaru Hizashi / Hazard Kerbeus 7 Atomic](./13%20case%20study.md#case-801)

**Category**: Special Move — counter-spin absorption burst  
**Bey / Blader**: Hikaru Hizashi / Hazard Kerbeus 7 Atomic  
**Franchise Move**: Kerbeus switches spin direction mid-flight and intercepts an incoming attack, absorbing the opponent's own momentum and firing it back.  
**Key Physics**: Trigger condition: opponent special move or combo attack in active window (1200 ms). Phase 1 (counter_stance 1200 ms): bearing mode locks Kerbeus stable; BeySpirit spin-direction flip queued. On trigger: Phase 2 (absorption_flip): dual-spin mode switches; opponent impulse absorbed: spinGain = clamp(0.35 × opponentImpulse_eu / 100, 20, 80) [M]; reflected burst: spinDelta_opponent = −(80 + 0.40 × absorbed_spinGain × 2); linearImpulse_reflected = 1.8 × opponent_linearImpulse (capped 3500 eu); dmgMult 1.75×. Self-cost −45 (absorbed energy offsets most drain). Timeout (no trigger): selfCost −160. QTE "Counter Flip" 150 ms. Cooldown 6000 ms. powerCost 100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: reactive trigger (requires opponent attack); spinGain absorption formula; reflected linearImpulse × 1.8 factor (counter-amplification).

---

### [Case 802 — [COMBO] Atomic Rebound: 7 Disc Bearing-Mode Spin Steal (3-key: K↑K)](./13%20case%20study.md#case-802)

**Category**: Combo — bearing-mode spin steal approach  
**Sequence**: defense → moveUp → defense  
**Key Physics**: Kerbeus enters bearing mode (K brace — Atomic outer rubber disengaged), advances silently (↑ — low orbit friction in bearing mode), double-braces at close range (K). Second K applies Atomic bearing coupling at near-zero closing speed: spinSteal = +22 rad/s (WD-style coupling). spinDelta_opponent = −22 rad/s. Minimal damage: dmgMult 1.05×; lockMs 30. Cost 0 (free), stamina type.  
**Engine Note**: Atomic bearing coupling model same as WD spin-theft (Case 834 WD); free stamina combo; ceiling: 1.05× ≤ 1.5×; 22 ≤ 50; 30 ms ≤ 300 ms.

---

### [Case 803 — [SPECIAL MOVE] Dual Phantom: Aiger Akabane / Venom/Erase Devolos (DB alt assembly)](./13%20case%20study.md#case-803)

**Category**: Special Move — triple-phantom orbital illusion  
**Bey / Blader**: Aiger Akabane / Venom Erase Devolos (BeySpirit resonance form)  
**Franchise Move**: Devolos generates three phantom copies at orbital resonance positions; the real Devolos is hidden among them. The opponent cannot identify the real bey.  
**Key Physics**: 4-fold symmetry equivalent at 3 phantoms: CFF f_apparent = ω × 3 / (2π) = 650 × 3 / 6.28 = 310.5 Hz >> 60 Hz [M]. All 3 phantoms + real strike from 3 directions simultaneously. Per-phantom hit (3 total): spinDelta = −45 rad/s; linearImpulse = 600 eu; dmgMult 1.40×. One randomly designated real hit: burstBonus +22% (BeySpirit concentration). Phantom confusion debuff 1000 ms: opponentBurstGuardWindow × 0.50. Self-cost −80. QTE "Phantom Lock" 200 ms (J × 3 taps, same as Crazy Monkey): 3/3 → all full; partial → glancing on missed phantoms. Cooldown 5500 ms. powerCost 100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: 3-source spinDelta (45 each, ≤ 50 individually per source — BeySpirit allows); phantom confusion debuff same model as Case 838.

---

### [Case 804 — [SPECIAL MOVE] Clone Cannon: Aiger Akabane / Venom/Erase Devolos](./13%20case%20study.md#case-804)

**Category**: Special Move — clone-barrage multi-hit burst  
**Bey / Blader**: Aiger Akabane / Venom/Erase Devolos  
**Franchise Move**: Five rapid clone projections each strike the opponent in sequence — a clone barrage.  
**Key Physics**: 5 rapid clone hits, 80 ms between each. Per hit: spinDelta = −35 rad/s; linearImpulse = 500 eu; dmgMult 1.35×; burstBonus +5%. QTE "Cannon" — 5× tap J (80 ms window each). Hit all 5 QTE: bonus 6th hit: spinDelta −60, linearImpulse 900 eu, dmgMult 1.65×. Cumulative 5/5 QTE + bonus: spinDelta −235; linearImpulse 3400 eu. Self-cost −90. Cooldown 6000 ms. powerCost 100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: 5-hit rapid barrage — each hit ≤ 50 spinDelta and ≤ 50 rad/s individually; 6th bonus hit only on 5/5 QTE.

---

### [Case 805 — [COMBO] Clone Impact: Devolos Clone-Step Lateral Strike (3-key: →↑J)](./13%20case%20study.md#case-805)

**Category**: Combo — clone-step feint into lateral contact  
**Sequence**: moveRight → moveUp → attack  
**Key Physics**: Devolos flickers a brief phantom image right (→ — creates visual ambiguity), approaches center-forward (↑), delivers Venom/Erase blade contact (J). The phantom flicker is visual-only (not a real second hit) but suppresses opponent K-guard for 80 ms during the advance window. On J hit: spinDelta = −44 rad/s; dmgMult 1.32×; lockMs 50. Cost 15, universal.  
**Engine Note**: phantom flicker suppresses guard-input for 80 ms (visual tell suppression — partial, not invulnerability); 44 ≤ 50; 1.32× ≤ 1.5×; 50 ms ≤ 300 ms.

---

### [Case 806 — [GIMMICK] Strata Dragoon S — Rushing Boar AR and Neo SG Flat Base](./13%20case%20study.md#case-806)

**Category**: Gimmick — Rushing Boar AR aggressive smash + Neo SG Flat drift  
**Parts**: Strata Dragoon S, Plastic Gen — Rushing Boar AR + Ten Heavy WD + Neo Right SG + Flat Base  
**Key Physics**: Rushing Boar AR [M]: boar-tusk shaped smash contacts; 2 primary forward-facing tusks at r ≈ 20 mm [M]; C_smash ≈ 0.85 [M] (forward tusk efficiency — highest AR C_smash in CS13 gimmick assemblies). WD: Ten Heavy ≈ 14.0 g [M]. Flat Base: μ = 0.30 [M]; r_tip = 3 mm [M]. Assembly [M]: m ≈ 29.5 g; I ≈ 5.8×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 1.044 J. dω/dt_flat ≈ −73.3 rad/s² [M].  
**Engine Note**: C_smash 0.85 tusk geometry; flat-base orbit drift; short match window (Flat tip decay rate).

---

### [Case 807 — [SPECIAL MOVE] Co-Ring Cutter: Daichi Sumeragi / Strata Dragoon S (V-Force early)](./13%20case%20study.md#case-807)

**Category**: Special Move — dual-bey linked AR cutter  
**Bey / Blader**: Daichi Sumeragi / Strata Dragoon S (Beyblade V-Force, early arc)  
**Franchise Move**: Strata Dragoon S locks its AR against an ally's AR to create a spinning cutter ring; the combined assembly fires as a single high-speed disc. Requires a second friendly bey in the same match.  
**Key Physics**: If ally bey present and within 30 px: Phase 1 (AR_lock 400 ms): Dragoon S AR + Ally AR merge via BeySpirit coupling; combined effective radius r_cutter = r_AR + r_ally [M] ≈ 42 mm; I_cutter = I_AR + I_ally; ω maintained by BeySpirit. Phase 2 (cutter_disc): spinDelta = −250 rad/s; linearImpulse = 4000 eu; dmgMult 2.10×; burstBonus +20%. If no ally: reduced single-bey mode (spinDelta −120, impulse 2000 eu, dmgMult 1.65×). Self-cost −150; ally-cost −80. QTE "Cutter Lock" 250 ms (hold J). Cooldown 7000 ms. powerCost 100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: ally-dependent power scaling; requires 2-player cooperative context; no ally → reduced mode automatically.

---

### [Case 808 — [COMBO] Ring Slash: Rushing Boar AR Tusk Drive (3-key: JJ↑)](./13%20case%20study.md#case-808)

**Category**: Combo — double tusk forward drive  
**Sequence**: attack → attack → moveUp  
**Key Physics**: Two rapid Rushing Boar tusk contacts (JJ) then forward push (↑ — sustaining tusk drive direction). Hit 1: spinDelta = −42 rad/s; dmgMult 1.30×; lockMs 30. Hit 2 (reduced efficiency after first): spinDelta = −28 rad/s; dmgMult 1.20×; lockMs 20. Forward push ↑: additionalLockMs = 35. Each hit ≤ 50 individually; combined lock 85 ms ≤ 300. Cost 25, universal (C_smash 0.85 tusk justifies cost tier).  
**Engine Note**: two-source spinDelta (42 + 28, each ≤ 50); combined lock 85 ms; cost-25 double-hit tier (matches Rock Smash Case 860 pattern).

---

### [Case 809 — [GIMMICK] Cosmic Pegasus F:D — Final Drive Tip and BeySpirit Speed Transcendence](./13%20case%20study.md#case-809)

**Category**: Gimmick — F:D Final Drive mode-change + Super Cosmic Nova BeySpirit platform  
**Parts**: Cosmic Pegasus F:D [M] — Cosmic Pegasus MFB wheel + 100 track + F:D Final Drive tip  
**Key Physics**: Cosmic Pegasus wheel [M]: m ≈ 30.0 g; I ≈ 8.5×10⁻⁶ kg·m². F:D Final Drive [M]: two positions — Defense mode (sharp center, μ ≈ 0.03) → Attack mode (flat outer ring, μ ≈ 0.40) activated by centrifugal force at ω ≥ ω_switch ≈ 300 rad/s [M]. At high spin: defense mode (spin preservation); at low spin: attack mode (aggressive orbit). Assembly [M]: m ≈ 34.5 g; I ≈ 9.0×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 1.620 J. BeySpirit amplification for Gingka Hagane (Super Cosmic form) A_world = 10.0× [M] (unique case — extraordinary tier).  
**Engine Note**: F:D centrifugal mode switch at ω threshold; A_world = 10.0× applies only to Super Cosmic Nova; all other Pegasus specials use standard blader tier.

---

### [Case 810 — [SPECIAL MOVE] Super Cosmic Nova: Gingka Hagane / Cosmic Pegasus F:D](./13%20case%20study.md#case-810)

**Category**: Special Move — world-BeySpirit ultimate single-target devastation  
**Bey / Blader**: Gingka Hagane / Cosmic Pegasus F:D (Metal Fury, final arc)  
**Franchise Move**: Cosmic Pegasus condenses all the BeySpirit energy of the world into a single orbital approach — riders' spirits globally converge on Gingka. The most powerful single-target special in CS13. A_world = 10.0×.  
**Key Physics**: Phase 1 (world_spirit_gather 1222 ms): beyTiltAngle → 0° (perfectly upright, maximum gyroscopic stability). Phase 2 (nova_strike): v_approach_phys ≈ 2.5 m/s → v_approach_anime = 2.5 × 10.0 = 25.0 m/s [M]; p = 0.0345 × 25.0 = 0.8625 N·s; linearImpulse = 0.8625 / 7.6×10⁻⁵ ≈ 11349 eu (capped at engine ceiling 6000 eu — world BeySpirit burst; cap applied). spinDelta = −600 rad/s (ceiling). dmgMult = 2.5× (ceiling). knockbackImpulse = 15000 eu. burstBonus +35%. Self-cost −300 spinDelta. QTE "Nova" 200 ms (J): miss → 70% all values. Invulnerability during gather 1222 ms. Cooldown 10000 ms (longest in CS13). powerCost 100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: A_world = 10.0× unique to Super Cosmic Nova; engine caps applied (6000 eu, 600 rad/s, 2.5×); 10000 ms cooldown as game ceiling; single-use special in narrative terms.

---

### [Case 811 — [COMBO] Final Drive Surge: F:D Mode-Shift Attack (3-key: →↑J)](./13%20case%20study.md#case-811)

**Category**: Combo — F:D mode-shift charge strike  
**Sequence**: moveRight → moveUp → attack  
**Key Physics**: Combo expression of Case 809 F:D centrifugal mode-switch. If ω ≥ 300 rad/s at combo trigger: defense mode → combo begins in defensive posture; approach (→↑) at low friction; J contact fires as F:D switches to attack mode during impact. spinDelta = −44 rad/s; dmgMult 1.35×; lockMs 50. If ω < 300 rad/s: attack mode already active; standard flat-tip orbit; spinDelta = −35 rad/s; dmgMult 1.25×; lockMs 40. Cost 15, balanced.  
**Engine Note**: F:D mode state at combo trigger determines stat tier; centrifugal threshold mechanic expressed at combo scale.

---

### [Case 812 — [GIMMICK] Storm Spriggan Double Gyro — Dual Counter-Spin Core and Auto-Balance](./13%20case%20study.md#case-812)

**Category**: Gimmick — dual counter-spin gyroscopic stabilization + auto-balance  
**Parts**: Storm Spriggan Double Gyro (Burst BU system) — Spriggan Requiem layer + forge disc + driver  
**Key Physics**: Storm Spriggan dual-spin core: inner and outer rotor spin in opposite directions. Counter-rotation cancels net angular momentum: L_net = I_inner × ω_inner − I_outer × ω_outer ≈ 0 when balanced [M]. Effect: near-zero precession — Spriggan remains perfectly upright indefinitely (self-correcting tilt). At impact: inner/outer momentum asymmetry generates Counter Break torque. Assembly [M]: m ≈ 36.0 g; I_total ≈ 1.05×10⁻⁵ kg·m²; ω₀_outer = 650 rad/s; KE₀ ≈ 2.216 J.  
**Engine Note**: L_net ≈ 0 zero-precession; Counter Break exploits asymmetric momentum at impact; auto-balance mechanic = beyTiltAngle self-corrects each tick.

---

### [Case 813 — [SPECIAL MOVE] Counter Break: Free de la Hoya / Storm Spriggan Double Gyro](./13%20case%20study.md#case-813)

**Category**: Special Move — counter-rotation burst reversal  
**Bey / Blader**: Free de la Hoya / Storm Spriggan Double Gyro (Burst BU)  
**Franchise Move**: When struck, Storm Spriggan's counter-spin core amplifies the incoming impact and fires it back in the opposite direction.  
**Key Physics**: Trigger: opponent attack ≥ 400 eu during 1500 ms window. On trigger: absorbed spinGain = 0.40 × opponent_spinDelta_delivered [M]; Counter Break: spinDelta_opponent = −(100 + absorbed_spinGain); linearImpulse_reflected = 2.0 × opponent_linearImpulse (capped 3500 eu); dmgMult 1.85×; burstBonus +20%. Timeout (no attack): selfCost −180 (sustained dual-spin drain). QTE "Counter" 150 ms J. Self-cost (on trigger): −30. Cooldown 5500 ms. powerCost 100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: reactive trigger mechanic; reflected impulse ×2.0; absorbed spinGain adds to counter spinDelta.

---

### [Case 814 — [COMBO] Quick Counter: Spriggan Dual-Spin Lateral Deflect (3-key: KJ↑)](./13%20case%20study.md#case-814)

**Category**: Combo — guard-then-counter directional strike  
**Sequence**: defense → attack → moveUp  
**Key Physics**: K brace: counter-rotation absorbs incoming impulse (−20% incoming damage partial reduction); J fires immediately during rebound; ↑ exits away. spinDelta = −38 rad/s; dmgMult 1.28×; lockMs 45; spinGain +12 (counter-rotation energy recovery). Cost 15, universal.  
**Engine Note**: K guard partial DR −20%; spinGain +12 from dual-spin absorption; 38 ≤ 50; 1.28× ≤ 1.5×; 45 ms ≤ 300 ms.

---

### [Case 815 — [LAUNCH] Crux Boost: Storm Spriggan Double Gyro Launch QTE](./13%20case%20study.md#case-815)

**Category**: Launch-phase special — dual-spin counter-charge launch  
**Bey / Blader**: Free de la Hoya / Storm Spriggan Double Gyro  
**Franchise Move**: Storm Spriggan is launched with inner and outer rotors pre-synchronized to opposing max spin; the dual-spin gyroscopic stabilization kicks in immediately at launch.  
**Key Physics**: LaunchPhase only — no powerCost, no cooldown. Launch QTE "Crux": hold J during launch charge to sync dual-spin; release on "Synced" indicator. Full sync (QTE hit): launchPower = 150% + dual-spin stabilization → initial beyTiltAngle = 0° (perfect upright); ω₀ bonus +8% (counter-spin resonance adds energy at launch). Partial sync (QTE miss): launchPower 100%; normal tilt variance. No in-match power cost — this is launch-phase only.  
**Compatible beys**: Storm Spriggan Double Gyro only.  
**Engine Note**: [LAUNCH] type — LaunchPhase only; no powerCost/cooldown; modifies launchPower and initial beyTiltAngle only.

---

### [Case 816 — [GIMMICK] Rock Zurafa R145WB — R145 Rubber Rim and WB Water Bottle Tip](./13%20case%20study.md#case-816)

**Category**: Gimmick — R145 rubber rim lateral protection + WB wandering orbit  
**Parts**: Rock Zurafa R145WB [M] — Rock fusion wheel + R145 track + WB tip  
**Key Physics**: Rock wheel [M]: circular, dense; m ≈ 30.0 g [M]; I ≈ 8.4×10⁻⁶ kg·m² [M]; C_deflect ≈ 0.42 [M] (smooth rounded deflect type). R145 (Rubber Ring 145) [M]: height 14.5 mm; rubber-rim outer ring at r_ring ≈ 10 mm; k_R145 ≈ 0.60 [M] (40% lateral impulse absorbed by rubber rim — similar to ED145 mechanism). WB (Water Bottle) [M]: hollow spherical bottom; μ_WB ≈ 0.15 [M]; erratic orbit pattern from spherical contact geometry. Assembly [M]: m ≈ 36.0 g; I ≈ 9.5×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 1.710 J.  
**Engine Note**: R145 rubber rim 40% impulse absorption; WB erratic orbit; stamina-capable despite erratic movement.

---

### [Case 817 — [SPECIAL MOVE] Crushing Blast: Reiji Mizuchi / Rock Zurafa R145WB](./13%20case%20study.md#case-817)

**Category**: Special Move — gravity slam mass-impact  
**Bey / Blader**: Reiji Mizuchi / Rock Zurafa R145WB  
**Franchise Move**: Rock Zurafa uses its massive neck (giraffe BitBeast) to drive down onto the opponent from above.  
**Key Physics**: Phase 1 (neck_rise 600 ms): beyTiltAngle → 40°; WB wobble amplifies. Phase 2 (gravity_slam): BeySpirit ×2.0 [M]; v_slam = 5.0 m/s [M]; p = 0.036 × 5.0 = 0.180 N·s; linearImpulse ≈ 2370 eu ≈ 2200 eu [M]; spinDelta = −130 rad/s; dmgMult 1.70×; burstBonus +12%. R145 ring absorbs 40% recoil → self-cost −70 (reduced by rubber rim). QTE "Crush" 200 ms (J). Cooldown 5500 ms. powerCost 100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: R145 ring self-recoil absorption model; gravity-slam BeySpirit ×2.0 mid-tier; same vertical impulse approach as Colossus Hammer but non-ground-knock.

---

### [Case 818 — [COMBO] Rock Slam: R145 Rubber Rim Brace Strike (3-key: K↑J)](./13%20case%20study.md#case-818)

**Category**: Combo — rim-brace approach then smash  
**Sequence**: defense → moveUp → attack  
**Key Physics**: K brace: R145 rubber rim absorbs incoming (−40% impulse); ↑ advances behind the brace; J delivers Rock wheel deflect smash. spinDelta = −36 rad/s; dmgMult 1.28×; lockMs 45; spinGain +8 (R145 rubber rebound recovery). Cost 15, defense.  
**Engine Note**: R145 rim −40% DR on K brace; +8 spin recovery from rubber rebound; 36 ≤ 50; 1.28× ≤ 1.5×.

---

### [Case 819 — [GIMMICK] Rock Crow 125FS — Crow AR Wind Barrier and FS Flat Sharp Orbit](./13%20case%20study.md#case-819)

**Category**: Gimmick — Crow AR aerodynamic wind barrier + FS orbital attack  
**Parts**: Rock Crow 125FS [M] — Rock wheel (custom Crow AR for plastic-gen) or Rock MFB wheel + 125 track + FS tip  
**Key Physics**: Crow AR [M]: 4-wing crow-feather shaped contacts at r ≈ 20 mm [M]; C_smash ≈ 0.72 [M]. At ω ≥ 400 rad/s: aerodynamic wind barrier effect — incoming attacks within 15px radius deflected with k_wind ≈ 0.30 [M] (30% force reduction from wind pressure). 125 track [M]: moderate height 12.5 mm. FS tip [M]: μ_FS ≈ 0.25 [M]; r_eff ≈ 2.5 mm [M]. Assembly [M]: m ≈ 34.0 g; I ≈ 9.0×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 1.620 J.  
**Engine Note**: aerodynamic wind barrier active at ω threshold; k_wind = 0.30 passive deflection; FS moderate orbit.

---

### [Case 820 — [SPECIAL MOVE] Crow Crusher [JOINT]: both players' Crow-type specials within 200 ms server window](./13%20case%20study.md#case-820)

**Category**: Special Move — joint cooperative smash (first joint special in CS13)  
**Bey / Blader**: Tsubasa Otori / Rock Crow 125FS + Kenta Yumiya / Flame Sagittario (co-bladers)  
**Franchise Move**: Both bladers simultaneously fire their Crow special — Crow Crusher activates only when both specialTap inputs arrive within the 200 ms server window. Combined crow-spirit energy multiplies the impact. First joint special in CS13.  
**Key Physics**: Server joint detection: both player specialTap ∈ [t, t+200ms]. Phase 1 (crow_convergence 800 ms): both beys approach target from opposite vectors; BeySpirit crow spirits merge. Phase 2 (crusher_impact): combined hit. Player 1: spinDelta = −200 rad/s; linearImpulse = 3500 eu; dmgMult 2.00×. Player 2: same values applied simultaneously. burstBonus +30% per source (two simultaneous burst vectors — highest burstBonus in any CS13 case). Self-cost each: −120. If joint window missed (only one fires): each fires solo at 60% values. Cooldown 7000 ms per player. powerCost 100 each.  
**Compatible beys**: Any beyblade.  
**Engine Note**: joint special requires both specialTap within 200 ms server window; first joint mechanic in CS13; +30% burstBonus per source is special-move-only.

---

### [Case 821 — [COMBO] Crow Dive: Rock Crow Wing Dive Strike (3-key: ↑↑J)](./13%20case%20study.md#case-821)

**Category**: Combo — double-advance wing dive  
**Sequence**: moveUp → moveUp → attack  
**Key Physics**: Double advance into orbital approach; Crow AR wing contact at apex. Wind barrier active during approach (−30% incoming damage for 200 ms approach phase). J delivers wing smash. spinDelta = −40 rad/s; dmgMult 1.30×; lockMs 45. Cost 15, universal.  
**Engine Note**: wind barrier partial DR −30% during approach phase only (200 ms); 40 ≤ 50; 1.30× ≤ 1.5×.

---

### [Case 822 — [GIMMICK] Flash Leopard 2 — AR Stinger Geometry and Cross Fire BeySpirit Charge](./13%20case%20study.md#case-822)

**Category**: Gimmick — aggressive stinger AR + stacked-fire special platform  
**Parts**: Flash Leopard 2 [M] — Flash Leopard 2 AR + heavy WD + Neo Right SG + Flat Base  
**Key Physics**: Flash Leopard 2 AR [M]: leopard-claw and fang multi-contact attack ring; 3 stinger contacts at r ≈ 20 mm [M]; C_smash ≈ 0.80 [M]; additional spike contact (C_spike ≈ 0.92 [M] — narrow point concentration). Assembly [M]: m ≈ 28.0 g; I ≈ 5.5×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 0.990 J. BeySpirit amplification ×2.2 [M] (Robert Jurgens, European champion-tier blader).  
**Engine Note**: spike contact C = 0.92 is highest single-contact C value in plastic-gen assemblies; stacked-fire two-special assembly (Cross Fire + Blaze Cross).

---

### [Case 823 — [SPECIAL MOVE] Cross Fire: Robert Jurgens / Flash Leopard 2](./13%20case%20study.md#case-823)

**Category**: Special Move — X-pattern crossing strike  
**Bey / Blader**: Robert Jurgens / Flash Leopard 2 (original anime, European Championship arc)  
**Franchise Move**: Two Leopard energy projections cross through the opponent from two perpendicular directions simultaneously.  
**Key Physics**: Phase 1 (cross_charge 500 ms): BeySpirit splits into two streams; cross pattern forms. Phase 2 (cross_strike): two perpendicular hits. Horizontal: spinDelta = −80 rad/s; linearImpulse = 1200 eu; dmgMult 1.65×. Vertical (simultaneous): spinDelta = −60 rad/s; linearImpulse = 900 eu; dmgMult 1.55×. Combined: spinDelta −140; burst from both vectors +14% each = effectively harder to guard. Self-cost −130. QTE "Cross" — two simultaneous ← and J (50 ms window — precision). Cooldown 6000 ms. powerCost 100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: two perpendicular simultaneous hits; each spinDelta source checked individually (80 and 60, each ≤ 50 fails — BeySpirit override for special-move); combined burst.

---

### [Case 824 — [COMBO] Blaze Cross: Flash Leopard 2 Spike Lateral (3-key: →J←)](./13%20case%20study.md#case-824)

**Category**: Combo — lateral cross-step spike  
**Sequence**: moveRight → attack → moveLeft  
**Key Physics**: Combo expression of Case 822 spike contact C = 0.92. Right-to-left sweeping contact — spike catches at lateral approach. spinDelta = −46 rad/s; dmgMult 1.38×; lockMs 40. Cost 0 (free), universal (spike geometry enables free-tier efficiency).  
**Engine Note**: spike C = 0.92 delivers free-combo efficiency; 46 ≤ 50; 1.38× ≤ 1.5×; free tier justified by AR spike geometry.

---

### [Case 825 — [GIMMICK] Hell Crown 130FB — Hell Crown AR Burst-Pressure Design and FB Flat Ball Tip](./13%20case%20study.md#case-825)

**Category**: Gimmick — Hell Crown AR burst-pressure contacts + FB Flat Ball orbit  
**Parts**: Hell Crown 130FB [M] — Hell Crown AR + 130 track + FB Flat Ball tip  
**Key Physics**: Hell Crown AR [M]: dark crown-themed AR with 6 pressure contacts designed to simultaneously engage multiple burst tabs; unusual geometry maximizes burst probability at expense of spinDelta efficiency. C_burst_pressure ≈ 0.40 [M] (low smash but high burst-tab engagement probability). 130 track [M]: height 13.0 mm, mid-range. FB (Flat Ball) [M]: spherical flat; μ_FB ≈ 0.30 [M]; r_eff ≈ 4 mm [M]; intermediate between Flat and semi-flat orbit behavior. Assembly [M]: m ≈ 29.5 g; I ≈ 6.5×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 1.170 J.  
**Engine Note**: AR optimized for burstBonus at expense of spinDelta; 6-contact geometry; FB mid-tier orbit.

---

### [Case 826 — [SPECIAL MOVE] Crimson Flash: Kira Hayama / Hell Crown 130FB](./13%20case%20study.md#case-826)

**Category**: Special Move — defense-pierce single burst-pressure spike  
**Bey / Blader**: Kira Hayama / Hell Crown 130FB  
**Franchise Move**: Hell Crown fires a single burst-piercing crimson energy spike that completely bypasses the opponent's defensive posture — defense-pierce mechanic: damageReduction = 0 on QTE hit.  
**Key Physics**: Phase 1 (crown_charge 600 ms): BeySpirit condenses all 6 AR contacts into one focused spike. Phase 2 (crimson_pierce): spinDelta = −150 rad/s; linearImpulse = 2500 eu; dmgMult 2.00×; burstBonus +35%. Defense-pierce on QTE hit: damageReduction = 0 (first defense-pierce mechanic in CS13 — opponent's defense stat irrelevant). QTE "Crimson" 150 ms (J): miss → no defense-pierce, burstBonus +15% standard. Self-cost −110. Cooldown 6000 ms. powerCost 100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: defense-pierce (damageReduction = 0) on QTE hit is special-move-only; first CS13 example; miss → standard hit without pierce.

---

### [Case 827 — [COMBO] Scarlet Charge: Hell Crown Multi-Tab Press (3-key: JKJ)](./13%20case%20study.md#case-827)

**Category**: Combo — burst-tab press with guard suppression  
**Sequence**: attack → defense → attack  
**Key Physics**: Hell Crown 6-contact geometry at combo scale. J hits, K braces (−20% incoming DR during K phase), J re-hits. Hit 1 (J): spinDelta = −30 rad/s; dmgMult 1.20×; lockMs 25; burstBonus +8% (burst-tab pressure geometry). Hit 2 (J after K): spinDelta = −28 rad/s; dmgMult 1.20×; lockMs 25; burstBonus +10%. Total: −58 spinDelta combined (each ≤ 50 individually); combined lock 50 ms; cost 25, attack.  
**Engine Note**: two-source (30 + 28, each ≤ 50); burstBonus above standard combo but justified by AR geometry; defense brace between hits.

---

### [Case 828 — [GIMMICK] Dead Phoenix 10 Friction — Dead Rubber Disc and Friction Driver Orbit](./13%20case%20study.md#case-828)

**Category**: Gimmick — Dead rubber outer ring + Friction driver aggressive orbit  
**Parts**: Dead Phoenix 10 Friction [M] — DB Core Phoenix + Dead Disc + Friction driver  
**Key Physics**: Dead Disc [M]: rubber outer ring at r_ring ≈ 12 mm [M]; k_dead ≈ 0.65 [M] (35% impulse absorbed by rubber ring). Friction driver [M]: pyramid/cone shaped contact; r_tip ≈ 3 mm; μ_Friction ≈ 0.60 [M]; extremely aggressive lateral orbit at all spin levels. dω/dt_Friction ≈ −165 rad/s² [M] (very high decay — Friction driver is aggressive-orbit priority). Assembly [M]: m ≈ 32.0 g; I ≈ 8.5×10⁻⁶ kg·m²; ω₀ = 650 rad/s; KE₀ ≈ 1.796 J.  
**Engine Note**: Dead Disc 35% rubber ring absorption; Friction driver highest spin-decay standard driver in Burst DB era.

---

### [Case 829 — [SPECIAL MOVE] Dead Stinger: Phi / Dead Phoenix 10 Friction](./13%20case%20study.md#case-829)

**Category**: Special Move — rubber-disc sting burst injection  
**Bey / Blader**: Phi / Dead Phoenix 10 Friction (Burst DB era)  
**Franchise Move**: Dead Phoenix drives its rubber-tipped disc directly into the opponent's burst tab with precision — the rubber absorbs resistance, allowing the disc to inject force precisely at the burst unlock angle.  
**Key Physics**: Phase 1 (disc_align 400 ms): Dead Disc angle set to opponent burst-tab axis. Phase 2 (stinger_inject): Dead Disc rubber ring concentrates at burst-tab point; spinDelta = −80 rad/s; linearImpulse = 1800 eu; burstBonus +40% (rubber precision injection bypasses burst defense geometry — highest single-hit burstBonus in CS13); dmgMult 1.70×. Self-cost −90. QTE "Sting" 200 ms (J). Cooldown 5500 ms. powerCost 100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: +40% burstBonus from rubber disc precision model is highest single-hit burstBonus in CS13; not defense-pierce — it is burst-specific.

---

### [Case 830 — [COMBO] Phoenix Kick: Dead Disc Orbit Kick (3-key: ↑J↓)](./13%20case%20study.md#case-830)

**Category**: Combo — Dead Disc arc kick  
**Sequence**: moveUp → attack → moveDown  
**Key Physics**: Upward approach arc (↑); J delivers Dead Disc rubber-ring contact at peak; downward carry-through (↓). Dead Disc rubber ring absorbs 35% recoil → self-cost recovery. spinDelta = −38 rad/s; dmgMult 1.28×; lockMs 45; burstBonus +12% (burst-tab efficiency); selfSpinGain +8 (Dead ring rebound). Cost 15, universal.  
**Engine Note**: Dead ring rebound spinGain +8; burstBonus +12% from rubber injection geometry at combo scale; 38 ≤ 50.

---

### [Case 831 — [GIMMICK] Twin Noctemis 3Hit Jaggy — Colossus Mode Layer Lock and Burst-Stopper Tilt Geometry](./13%20case%20study.md#case-831)

**Category**: Gimmick — Colossus mode mass-lock + 3Hit Jaggy contact geometry  
**Parts**: Twin Noctemis 3Hit Jaggy [M] — Twin Noctemis DB Core (dual-body) + 3Hit Forge Disc + Jaggy driver  
**Key Physics**: Twin Noctemis layer: two independent bodies — standard (I = 8.95×10⁻⁶ kg·m², KE₀ = 1.611 J, C_smash 0.69) vs Colossus Mode (bodies lock together, I = 9.87×10⁻⁶ kg·m², ω_factor × 0.799, KE = 1.135 J, C_smash 0.95). Mode trigger: ω ≥ 480 rad/s OR inbound impulse ≥ 1222 eu; BeySpirit can force-lock at any ω. Mode exit: ω < 350 rad/s. 3Hit Jaggy disc [M]: 3-Hit protrusions; Jaggy driver [M]: jagged edge contact; aggressive orbit erratic orbit. Assembly fully documented in Case 831 colossusModeTrigger() function.  
**Engine Note**: colossusModeTrigger(ω, impulse, currentMode, specialOverride) as documented; I swap formula; BeySpirit specialOverride forces Colossus regardless of ω.

---

### [Case 832 — [SPECIAL MOVE] Colossus Hammer: Norman Tarver / Twin Noctemis 3Hit Jaggy](./13%20case%20study.md#case-832)

**Category**: Special Move — aerial crush + ground-knock debuff  
**Bey / Blader**: Norman Tarver / Twin Noctemis 3Hit Jaggy (Burst Surge)  
**Franchise Move**: While in Colossus Mode, Noctemis executes a descending aerial crush that drives the opponent onto its side. First ground-knock debuff in CS13.  
**Key Physics**: Phase 1 (force_colossus_lock): BeySpirit forces Colossus Mode regardless of ω (specialOverride = true). Phase 2 (aerial_crush): v_approach_anime = 3.5 × 2.5 = 8.75 m/s [M] (BeySpirit ×2.5); crush angle 60°; linearImpulse ≈ 3200 eu [M]. QTE "Colossus" hold J ≥ 400 ms: full power — spinDelta −200; linearImpulse 3200 eu; dmgMult 1.85×; burstBonus +18%; groundKnock true (beyTiltAngle_opponent → 70°; spinDecayRate ×2.0 for 2000 ms). Partial (tap < 200 ms): spinDelta −130; imp 2000; dmgMult 1.50×; burstBonus +8%; groundKnock false. Self-cost full −110, partial −80. powerCost 100; cooldown 5500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: groundKnock debuff — tiltAngle 70°→0° linear recovery over 2000 ms; spinDecayRate ×2.0→1.0 linear recovery; first ground-knock in CS13.

---

### [Case 833 — [COMBO] Colossus Press: Twin Noctemis Brief Colossus Downward Strike (3-key: ↓J↓)](./13%20case%20study.md#case-833)

**Category**: Combo — brief Colossus-lock press with tilt debuff  
**Sequence**: moveDown → attack → moveDown  
**Key Physics**: Noctemis briefly engages Colossus lock at J impact moment. ↓ retraction extends contact. spinDelta = −44 rad/s; dmgMult 1.38×; lockMs 80 (extended); tiltDebuff +12° on opponent for 800 ms (partial ground-press, no spinDecayRate multiplier). Cost 25, defense.  
**Engine Note**: brief Colossus lock at combo scale; tiltDebuff +12° partial (no spinDecay multiplier — insufficient force for full ground-knock); lockMs 80 ≤ 300.

---

### [Case 834 — [GIMMICK] Earth Eagle 145WD — Wing Deflection, Spin Theft, and Counter Stance Passive](./13%20case%20study.md#case-834)

**Category**: Gimmick — Earth wheel passive deflection counter + WD spin theft  
**Parts**: Earth Eagle 145WD [M] — Earth wheel + 145 track + WD tip  
**Key Physics**: Earth wheel [M]: m ≈ 28.0 g; I ≈ 8.18×10⁻⁶ kg·m²; δ_earth ≈ 0.22 (22% incoming lateral impulse returned as counter-impulse to attacker) when spin ≥ 55% maxSpin AND inbound ≥ 500 eu [M]. WD tip [M]: μ ≈ 0.08; r_tip ≈ 6 mm; spin-theft θ = 0.07 per 200 ms contact at closing speed ≤ 1.5 m/s. Assembly [M]: m ≈ 35.0 g; I ≈ 9.33×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 1.679 J; dω/dt ≈ −17.7 rad/s² [M]. Counter Stance passive always-on; counter_impulse_eu = inbound × 0.22 on qualifying hits.  
**Engine Note**: earthWheelDeflectionCounter() function documented; counter_impulse not a separate hit for burst purposes; WD wdSpinTheft() model same as Case 800.

---

### [Case 835 — [SPECIAL MOVE] Counter Smash: Tsubasa Otori / Earth Eagle 145WD](./13%20case%20study.md#case-835)

**Category**: Special Move — dual-mode: proactive charge (Mode A) or reactive counter stance (Mode B)  
**Bey / Blader**: Tsubasa Otori / Earth Eagle 145WD (MFB Metal Masters / Metal Fury)  
**Franchise Move**: Eagle condenses purple BeySpirit energy field; Mode A = forward charge; Mode B = waits for opponent strike and reflects amplified.  
**Key Physics**: Mode selection: tap J < 400 ms → Mode A; hold J ≥ 400 ms → Mode B. Mode A QTE hit: spinDelta −160; linearImpulse 2200 eu; dmgMult 1.75×; spinGain +30; self −85. Mode A miss: ×0.60 all values. Mode B (3000 ms window): opponent strike ≥ 600 eu triggers; absorbed spinGain = clamp(40 + (imp − 600)×0.04, 40, 80); reflected spinDelta −170 to −220; reflected impulse 2800–3600 eu ×1.25 QTE reflect → dmgMult 2.00× (+18% burst) / miss → 1.65× (+12%); self −35/−55. Timeout: spinDelta −100; imp 1500; dmgMult 1.50×; self −120. powerCost 100; cooldown 6000 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: Mode B reactive counter; counterSmashModeB() function documented; timeout penalty is heaviest self-drain in CS13 combo specials.

---

### [Case 836 — [COMBO] Eagle Strike: Earth Wheel Deflect-and-Strike (3-key: K←J)](./13%20case%20study.md#case-836)

**Category**: Combo — guard-deflect into wing arc counter  
**Sequence**: defense → moveLeft → attack  
**Key Physics**: K guard step: Earth wheel deflect angle −20% incoming damage (100 ms partial frame on non-attack phase). ← sweep: wide lateral arc. J: Earth wing contact. spinDelta = −40 rad/s; dmgMult 1.38×; lockMs 55; spinGain +22. Cost 15, balanced.  
**Engine Note**: K guard partial −20% DR on non-damage phase; spinGain +22 from Earth deflection coupling; 40 ≤ 50; 1.38× ≤ 1.5×.

---

### [Case 837 — [GIMMICK] Kevin's Galman — 4-Fold AR Symmetry and Phantom Resonance Condition](./13%20case%20study.md#case-837)

**Category**: Gimmick — 4-fold AR optical illusion phantom system  
**Parts**: Kevin's Galman [M] — Galman AR + 8 Heavy WD + Semi-Flat blade base  
**Key Physics**: Galman AR [M]: 4-fold C₄ symmetry; I_AR = 1.508×10⁻⁶ kg·m²; C_smash ≈ 0.72 [M]; f_CFF = ω × 4 / (2π) = 381.7 Hz >> 60 Hz → always-visible 4 phantoms at launch spin. Phantom orbital resonance (BeySpirit): T_orbit_res = 8π/ω; v_res = 17.98 m/s [M]; physical v_orbit ≈ 1.5 m/s → ampFactor × 12.0 [M]. Assembly [M]: m ≈ 25.5 g; I ≈ 3.922×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 0.706 J; dω/dt ≈ −95.6 rad/s² [M].  
**Engine Note**: galmanPhantomCondition() function documented; 4-fold CFF threshold always exceeded at launch spin; resonance condition requires BeySpirit for v_orbit amplification.

---

### [Case 838 — [SPECIAL MOVE] Crazy Monkey Attack: Kevin / Galman (Beyblade original series)](./13%20case%20study.md#case-838)

**Category**: Special Move — 4-phantom orbit multi-hit with guard-timing suppression  
**Bey / Blader**: Kevin / Galman (original Beyblade anime, White Tigers, plastic gen)  
**Franchise Move**: 4-fold AR + BeySpirit resonance creates 4 phantom copies; opponent cannot identify real Galman; strikes from all 4 directions.  
**Key Physics**: Phase 1 (phantom_gen 400 ms): v_orbit_anime = 18.0 m/s [M]; T_orbit 0.0419 s; 4 positions 10.5 ms apart. PhantomConfusion debuff 1222 ms: opponentBurstGuardWindow × 0.50. Phase 2 (4× strikes): QTE "Monkey" — 4 × tap J, 150 ms each, hits 36 ms apart. Per hit (QTE hit): spinDelta −55; impulse 700 eu; dmgMult 1.40×; burstBonus +10%. Per hit (miss): spinDelta −30; impulse 400 eu; dmgMult 1.20×. One random phantom: +25% burstBonus. Cumulative all-4 hit: −220 spinDelta; 2800 eu. selfCost −70; powerCost 100; cooldown 5000 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: phantomConfusionDebuff() and crazyMonkeyAttack() functions documented; 4-source spinDelta (55 each ≤ 50 — fails individually; BeySpirit override); burstGuardWindow × 0.50.

---

### [Case 839 — [COMBO] Monkey Rush: Galman AR Side-Weave Strike (3-key: ←J→)](./13%20case%20study.md#case-839)

**Category**: Combo — side-weave wing contact  
**Sequence**: moveLeft → attack → moveRight  
**Key Physics**: Left-to-right sweep; Galman AR 4-fold geometry ensures wing contact at any spin phase (no dead spot). spinDelta = −32 rad/s; dmgMult 1.25×; lockMs 40. Cost 0 (free), universal.  
**Engine Note**: 4-fold symmetry eliminates dead-spot in contact geometry; free combo; 32 ≤ 50; 1.25× ≤ 1.5×; 40 ms ≤ 300 ms.

---

### [Case 840 — [GIMMICK] Suoh Genji's Heat Salamander 12 Operate — Hybrid Attack/Defense Layer and Operate Driver Mode-Change System](./13%20case%20study.md#case-840)

**Category**: Gimmick — hybrid blade/deflect AR + Operate mode-change driver  
**Parts**: Heat Salamander 12 Operate [M] — Heat Salamander energy layer + 12 forge disc + Operate driver + chip  
**Key Physics**: Heat Salamander layer [M]: 4 blade contacts (C_smash 0.68, θ 25°) + 4 deflector contacts (C_absorb 0.45, θ 65°); C_eff = 0.565 weighted [M]; I_layer = 4.932×10⁻⁶ kg·m². 12 disc [M]: I = 1.160×10⁻⁶ kg·m². Operate driver: Attack mode (r_tip 3 mm, μ 0.30, dω/dt −45.8 rad/s²) vs Defense mode (r_tip 6 mm, μ 0.08, dω/dt −24.4 rad/s²); endurance ratio 1.88× in Defense mode. Assembly [M]: m ≈ 35.0 g; I_total = 6.742×10⁻⁶ kg·m²; ω₀ = 650 rad/s; KE₀ ≈ 1.424 J. Mode set pre-launch; impact ≥ mode-lock threshold can shift modes.  
**Engine Note**: operateDriverStats() function documented; Crimson Lotus Blaze requires Defense Mode at activation — only CS13 special with driver-mode pre-condition.

---

### [Case 841 — [SPECIAL MOVE] Crimson Lotus Blaze: Suoh Genji / Heat Salamander 12 Operate](./13%20case%20study.md#case-841)

**Category**: Special Move — Defense-Mode-conditional dual-buff tornado (first dual-buff in CS13)  
**Bey / Blader**: Suoh Genji / Heat Salamander 12 Operate (Burst X era)  
**Franchise Move**: While in Defense Mode, BeySpirit spins Salamander to tornado speed generating a crimson aura that simultaneously boosts attack and defense — first dual-buff special in CS13.  
**Key Physics**: Activation requirement: Operate driver in Defense Mode (only CS13 pre-condition special; if Attack Mode, input ignored, cooldown not consumed). Phase 1 (spin_up 600 ms): α_spinup = +350 rad/s² [M]; Δω = +210 rad/s; ω_tornado = 650 rad/s. Tornado aura v_tang = 52.0 m/s [M]. Phase 2 (dual_buff 2000 ms): (a) attackBuff +1.45× additive; (b) defenseBuff damageReduction +0.20 additive — simultaneous. Phase 3 QTE "Hellfire" (hold J; full ≥ 1000 ms, medium 500–999 ms, quick < 500 ms): Full: spinDelta −100; impulse 1350 eu; dmgMult 1.70×; burstBonus +15%. Medium: −65; 850 eu; 1.55×; +8%. Quick: −35; 500 eu; 1.35×; 0%. selfCost −55; powerCost 110; cooldown 6500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: tornadoAuraDualBuff() and crimsonLotusBlaze() functions documented; dual-buff (attack + defense simultaneously) is special-move-only; Defense Mode pre-condition is unique to this case.

---

### [Case 842 — [COMBO] Salamander Surge: Heat Salamander Charge-and-Brace (3-key: ↑JK)](./13%20case%20study.md#case-842)

**Category**: Combo — attack-then-defend Operate-lock sequence  
**Sequence**: moveUp → attack → defense  
**Key Physics**: Salamander charges (↑), delivers blade contact (J), then K triggers Operate Lock post-strike. J hit: spinDelta = −38 rad/s; dmgMult 1.30×; lockMs 60. Operate Lock (J hit + K confirmed): incomingDamageReduction +12% for 500 ms (partial DR, not invulnerability). K miss → no Operate Lock. Cost 15, universal.  
**Engine Note**: Operate Lock secondary effect conditional on both J and K confirming; +12% DR 500 ms is partial buff; salamanderSurgeCombo() function documented; 38 ≤ 50.

---

### [Case 843 — [GIMMICK] Chao Xin's Poison Virgo ED145ES — ED145 Eternal Defense Ring and ES Bearing Spin Isolation](./13%20case%20study.md#case-843)

**Category**: Gimmick — ED145 free-rotating burst-absorption ring + ES bearing near-zero spin decay  
**Parts**: Chao Xin's Poison Virgo ED145ES [M] — Poison fusion wheel + ED145 track + ES tip  
**Key Physics**: Poison wheel [M]: asymmetric irregular profile; I = 8.220×10⁻⁶ kg·m²; C_deflect ≈ 0.40 [M]. ED145 [M]: freely rotating ring; k_ED = 0.55 (55% impulse to body, 45% to ring); I_ring independent = 1.500×10⁻⁷ kg·m². ES tip [M]: bearing-decoupled; μ_ES ≈ 0.005; r_tip = 0.5 mm; dω/dt = −0.106 rad/s² [M]; vs Sharp −4.24 rad/s²; endurance ratio 40× lower decay. Assembly [M]: m ≈ 38.0 g; I ≈ 8.795×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 1.583 J; theoretical t_spin to ω_min = 4717 s.  
**Engine Note**: ed145RingAbsorption() and virgoAssemblyStats() documented; ES 40× endurance vs Sharp; oscillation undamped basis for Left Right Reverse Wheeling Forearm.

---

### [Case 844 — [SPECIAL MOVE] Left Right Reverse Wheeling Forearm: Chao Xin / Poison Virgo ED145ES](./13%20case%20study.md#case-844)

**Category**: Special Move — undamped resonant oscillation AoE sweep (confirmed tag-battle multi-target)  
**Bey / Blader**: Chao Xin / Poison Virgo ED145ES (MFB Metal Masters)  
**Franchise Move**: ES undamped oscillation driven by BeySpirit resonance reaches 240 mm amplitude — sweeps entire arena width, hitting all opponents simultaneously (confirmed: Sophie + Wales tag battle).  
**Key Physics**: Phase 1 (buildup 1800 ms): A₀ = 10 mm; β = 1.77 rad/s; A(t) = A₀ × e^(βt); at 1222 ms: A ≈ 82 mm (CFF images begin); at 1800 ms: A = 240 mm → v_sweep = 8.40 m/s → 3 after-image copies. AoE: all opponents in arena. Phase 2 QTE "Forearm" (← or →, 200 ms): correct direction: main spinDelta −65; impulse 700 eu; dmgMult 1.55×; burstBonus +10%; wrong/no input: −40; 500 eu; 1.35×. Plus 3 after-image chips each: −12 spinDelta, 180 eu, 1.15×. Cumulative correct: −101 spinDelta; 1240 eu. selfCost −85; powerCost 100; cooldown 5500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: wheelingOscillationBuild() and leftRightReverseWheelingForearm() documented; first confirmed 2-target AoE in CS13 (Sophie + Wales); AoE hits ALL opponents; ES undamped oscillation as physics basis.

---

### [Case 845 — [COMBO] Eternal Counter: ED145 Ring Brace + Virgo Counter (3-key: ↑KJ)](./13%20case%20study.md#case-845)

**Category**: Combo — ED145 ring brace then counter-strike  
**Sequence**: moveUp → defense → attack  
**Key Physics**: Advance (↑); K brace presents ED145 ring to incoming attack (k_ED = 0.55 applied if opponent strikes during K window); spinSteal +18 on K contact; J counter: spinDelta = −35 rad/s; dmgMult 1.25×; lockMs 45. Cost 15, stamina.  
**Engine Note**: eternalCounter() documented; ED145 ring k_ED 0.55 on K timing; spinSteal +18 independent of J hit; 35 ≤ 50; 1.25× ≤ 1.5×.

---

### [Case 846 — [GIMMICK] Bel Daizora's Destruction Belfyre Nexus Venture-2 — Destruction Blade Geometry and Venture-2 Rubber Wall-Orbit Driver](./13%20case%20study.md#case-846)

**Category**: Gimmick — Destruction Blade slash/ram dual-contact + Venture-2 rubber wall-orbit  
**Parts**: Destruction Belfyre Nexus Venture-2 [M] — Destruction Belfyre blade + Nexus core + Venture-2 driver + chip  
**Key Physics**: Destruction Blade [M]: 3 contacts — slash face C_smash_slash = 0.82, θ = 20° (burst focus); ram face C_ram = 0.35, θ = 80° (ring-out focus); I_blade = 5.780×10⁻⁶ kg·m². Venture-2 [M]: rubber flat; Attack mode r_tip = 5 mm, μ = 0.85; Balance mode r_tip = 2 mm, μ = 0.60. dω/dt_atk = −200.0 rad/s² [M] — fastest-decaying driver in CS13 (t_useful = 2.75 s). Wall-orbit: v_orbit_phys = 1.5 m/s; BeySpirit 3 laps → v_BS = 4.5 m/s (×3.0); KE_orbit = 0.365 J. Assembly [M]: m ≈ 36.0 g; I = 7.504×10⁻⁶ kg·m²; ω₀ = 650 rad/s; KE₀ ≈ 1.584 J.  
**Engine Note**: ventureWallOrbit() and destructionBladesStats() documented; fastest-decay driver constrains match window; slash vs ram delivery choice maps to Daring Flash QTE mode.

---

### [Case 847 — [SPECIAL MOVE] Daring Flash: Bel Daizora / Destruction Belfyre Nexus Venture-2](./13%20case%20study.md#case-847)

**Category**: Special Move — 3-lap wall-orbit then slash/ram delivery mode select  
**Bey / Blader**: Bel Daizora / Destruction Belfyre Nexus Venture-2 (Burst DB era)  
**Franchise Move**: Belfyre wall-orbits at BeySpirit speed (v = 4.5 m/s) for 3 laps, then fires toward target. QTE hold duration selects Slash (burst) or Ram (ring-out).  
**Key Physics**: Phase 1 (3 laps 1222 ms): invulnerable during wall-orbit. Phase 2: QTE "Venture" — hold J; ≥700 ms → Ram (spinDelta −50; impulse 2100 eu; knockbackImpulse 9000 eu; dmgMult 1.55×; burstBonus +8%); < 700 ms → Slash (spinDelta −90; impulse 1400 eu; knockback 0; dmgMult 1.80×; burstBonus +22%). selfCost −95; powerCost 110; cooldown 6000 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: daringFlash() function documented; invulnerable during wall-orbit phase only; knockbackImpulse 9000 eu Ram mode highest ring-out threat in this assembly.

---

### [Case 848 — [COMBO] Flash Charge: Destruction Belfyre Approach Strike (3-key: →↑J)](./13%20case%20study.md#case-848)

**Category**: Combo — strafe-approach Destruction Blade contact  
**Sequence**: moveRight → moveUp → attack  
**Key Physics**: Strafe right (→), surge forward (↑), Destruction Blade at approach apex (J). On J hit: carry-through 80 px post-impact (rubber momentum). spinDelta = −45 rad/s; dmgMult 1.35×; lockMs 50; carryThroughPx 80. Cost 15, universal.  
**Engine Note**: flashChargeCombo() documented; carry-through 80 px is positional (not invulnerability); 45 ≤ 50; 1.35× ≤ 1.5×.

---

### [Case 849 — [GIMMICK] Lee's Galeon Attacker — Flat-Tip Orbit and Galeon BitBeast Lightning Aura](./13%20case%20study.md#case-849)

**Category**: Gimmick — Galeon AR 4-wing attack + internally stored lightning BitBeast  
**Parts**: Lee's Galeon Attacker [M] — Galeon AR + 8 Heavy WD + Flat base  
**Key Physics**: Galeon AR [M]: 4 wing contacts; I = 1.624×10⁻⁶ kg·m²; C_smash ≈ 0.75 [M]. 8 Heavy WD [M]: m ≈ 14.0 g; I = 2.044×10⁻⁶ kg·m². Flat base [M]: μ = 0.35; r_tip = 3 mm. Assembly [M]: m ≈ 26.5 g; I ≈ 4.418×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 0.795 J; dω/dt ≈ −61.9 rad/s² [M]. BitBeast lightning stored internally in AR — no external tell; 4 discharge max per activation; 120 ms recharge gap between discharges.  
**Engine Note**: galeonAttackerStats() documented; internal lightning aura — no visual tell in Phase 1 (opponent cannot detect); reactive AoE triggered by opponent contact.

---

### [Case 850 — [SPECIAL MOVE] Dark Lightning: Lee / Galeon Attacker (original Beyblade anime)](./13%20case%20study.md#case-850)

**Category**: Special Move — reactive contact AoE discharge (first reactive AoE in CS13)  
**Bey / Blader**: Lee / Galeon Attacker (original Beyblade anime, plastic gen)  
**Franchise Move**: Lightning charge stored invisibly in AR; any contact during active window triggers electrical repulsion discharge. 4 max discharges. Countered by attacking during the 120 ms recharge gap.  
**Key Physics**: Phase 1 (charge 1222 ms): no visible tell. Phase 2 (active 2000 ms): per contact — outwardImpulse 3500 eu radial; galeonSpinBoost +45 rad/s; targetSpinDelta −55 rad/s; dmgMult 1.50×. Max 4 discharges; 120 ms recharge gap. Counter-play: opponent attacks during 120 ms gap → no discharge, standard contact. selfCost −80; powerCost 115; cooldown 7000 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: darkLightningContact() documented; reactive trigger only (no Lee QTE); opponent counter-play gap is core anti-abuse mechanic; DARK_LIGHTNING constants as documented.

---

### [Case 851 — [COMBO] Lion Rush: Galeon AR Double-Sprint Strike (3-key: ↑↑J)](./13%20case%20study.md#case-851)

**Category**: Combo — double-advance flat-orbit sprint strike  
**Sequence**: moveUp → moveUp → attack  
**Key Physics**: Double advance at flat-tip aggressive orbit; Galeon AR wing contact. spinDelta = −34 rad/s; dmgMult 1.22×; lockMs 35. Cost 0 (free), universal.  
**Engine Note**: lionRushCombo() documented; free combo; flat-tip fast orbit; 34 ≤ 50; 1.22× ≤ 1.5×.

---

### [Case 852 — [GIMMICK] Doji's Dark Wolf DF145FS — DF145 Downforce Track and FS Semi-Flat Tip](./13%20case%20study.md#case-852)

**Category**: Gimmick — DF145 aerodynamic downforce grounding + FS dual-geometry orbit  
**Parts**: Doji's Dark Wolf DF145FS [M] — Dark Wolf fusion wheel + DF145 track + FS tip  
**Key Physics**: Dark Wolf wheel [M]: m ≈ 28.0 g; I = 6.860×10⁻⁶ kg·m²; C_smash ≈ 0.62 [M]. DF145 [M]: 4 fins A_fin = 1.2×10⁻⁴ m²; F_down ≈ 4.47 mN [M] at 600 rad/s; extra spin drain contribution −0.38 rad/s² [M]. FS tip [M]: r_eff ≈ 2.5 mm; μ ≈ 0.25. Assembly [M]: m ≈ 33.5 g; I ≈ 7.360×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 1.325 J; dω/dt_total ≈ −28.3 rad/s² [M]. BeySpirit DF amplification during Darkness Howling Blazer: F_down_BS = 26.8 mN (×6).  
**Engine Note**: darkWolfAssemblyStats() documented; DF downforce adds small real spin drain; BeySpirit ×6 downforce during special prevents displacement.

---

### [Case 853 — [SPECIAL MOVE] Darkness Howling Blazer: Doji / Dark Wolf DF145FS](./13%20case%20study.md#case-853)

**Category**: Special Move — dark-energy smash with 35% FusionWheel Damage permanent debuff chance  
**Bey / Blader**: Doji / Dark Wolf DF145FS (MFB Metal Fusion)  
**Franchise Move**: Dark Wolf avatar howls; dark red energy charges the wheel; smash physically cracks the opponent's fusion wheel (FW_Damage debuff: permanent for match).  
**Key Physics**: Phase 1 (howl 800 ms): DF downforce BeySpirit ×6 = 26.8 mN — grounded, cannot be displaced. Phase 2 QTE "Blaze" (tap J 150 ms): hit — spinDelta −90; impulse 1500 eu; dmgMult 1.80×; burstBonus +18%; FW_Damage 35% chance (C_smash_opponent × 0.85 for match remainder, PRNG seeded). Miss — spinDelta −50; impulse 900; dmgMult 1.50×; burstBonus +8%; no FW damage. selfCost −70; powerCost 105; cooldown 5500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: darknessHowlingBlazer() and fusionWheelDamageMult() documented; FW_Damage permanent stat reduction is special-move-only; PRNG-seeded (match-seed deterministic).

---

### [Case 854 — [COMBO] Wolf Pounce: Dark Wolf DF Anchor Bounce Strike (3-key: ↓↑J)](./13%20case%20study.md#case-854)

**Category**: Combo — DF anchor crouch-pounce smash  
**Sequence**: moveDown → moveUp → attack  
**Key Physics**: ↓ drops and DF anchors; ↑ springs up; J rising smash. spinDelta = −42 rad/s; dmgMult 1.30×; lockMs 55; dfAnchorMs 400 (post-hit reduced drift — DF grounding, not invulnerability). Cost 15, balanced.  
**Engine Note**: wolfPounceCombo() documented; DF anchor is positional stability only; 42 ≤ 50; 1.30× ≤ 1.5×.

---

### [Case 855 — [GIMMICK] Takanosuke Shishiya's Archer Griffin C145S — C145 Claw Track and Penalty Pocket Acceleration](./13%20case%20study.md#case-855)

**Category**: Gimmick — C145 extending claw track + Sharp tip + pocket-bounce acceleration  
**Parts**: Archer Griffin C145S [M] — Archer 4D wheel + C145 track + S tip  
**Key Physics**: Archer wheel [M]: m ≈ 32.0 g; I = 8.528×10⁻⁶ kg·m²; C_smash ≈ 0.82 [M]; θ ≈ 15°. C145 [M]: cylinder height = 14.5 mm (1.45 cm); **3 triangular claws** (not 4), C₃ symmetry, spacingDeg: 120 — each claw is a WingDef with movementType: "deployable_individual", pivoting on its own fixed axis (rivet) built into the cylinder body. Claws pivot **back and forth around their fixed pivot axis** when struck by an opponent — they do NOT extend centrifugally outward. The pivot has a limited angular range (not full 360° rotation). On contact: struck claw rotates away on its pivot, absorbing ~48% of incoming force (k_claw = 0.52 deflect factor); returns to rest position after deflect via pivot friction over ~350 ms. Each claw pivots independently — one claw can be deflected while the other two remain at rest. S tip [M]: μ = 0.08; r_tip = 1 mm; dω/dt = −3.50 rad/s² [M]. Pocket bounce: 3 pockets; v₁ = 1.16, v₂ = 1.30, v₃ = 1.42 m/s [M] (e = 0.88; slope gain 0.28 per bounce); BeySpirit v_strike = 6.53 m/s (×4.6). Assembly [M]: m ≈ 41.0 g; I ≈ 9.178×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 1.652 J.  
**Engine Note**: C145 = fixed cylinder (height_cm: 1.45) + 3 WingDefs (count: 3, spacingDeg: 120, shape: "triangle", movementType: "deployable_individual", perWingIndependent: true, deployThreshold_N: contact-driven not centrifugal, returnTimeMs: ~350). Claws deflect 48% at track height (contactDeflect mechanic). NOT centrifugal extension — pivot is contact-triggered, not spin-speed-triggered. pocketBounceVelocity() and archerGriffinStats() documented; pocket v-gains allow BeySpirit ×4.6 amplification.

---

### [Case 856 — [SPECIAL MOVE] Delta Slash: Takanosuke Shishiya / Archer Griffin C145S](./13%20case%20study.md#case-856)

**Category**: Special Move — triangular 3-pocket QTE tap rising smash  
**Bey / Blader**: Takanosuke Shishiya / Archer Griffin C145S (MFB 4D / Metal Fury)  
**Franchise Move**: Griffin circuits 3 penalty pockets in triangle; BeySpirit rises at final pocket for aerial upper smash.  
**Key Physics**: Phase 1 (1600 ms, 3 pockets): invulnerable between pockets. QTE "Delta" — 3 × tap J at pockets (at 400/900/1400 ms; 180 ms window each). Phase 2 (rising_smash): tiltBurstTarget +20° on target (full 3 QTE). 3/3 taps: spinDelta −85; impulse 1100 eu; dmgMult 1.75×; burstBonus +14%; tilt +20°. 2/3: −60; 800 eu; 1.55×; +9°; tilt +10°. 0–1: −35; 500 eu; 1.35×; +4°; tilt 0°. selfCost −55; powerCost 105; cooldown 5500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: deltaSlash() documented; tiltBurstTarget is 2.5D engine beyTiltAngle applied to target; 3-pocket QTE tier system.

---

### [Case 857 — [COMBO] Claw Dive: C145 Pocket-Slope Contact (3-key: ↓J↑)](./13%20case%20study.md#case-857)

**Category**: Combo — single-pocket slope contact  
**Sequence**: moveDown → attack → moveUp  
**Key Physics**: Pocket slope dip (↓); J claw-catch contact at slope bounce point; ↑ carry up slope. spinDelta = −38 rad/s; dmgMult 1.28×; lockMs 45; slopePop +50 eu upward velocity to target. Cost 15, universal.  
**Engine Note**: clawDiveCombo() documented; slopePop 50 eu minimal tilt push (not full tiltBurst); 38 ≤ 50.

---

### [Case 858 — [GIMMICK] Crusher's Gigars — AR Smash Geometry and BitBeast Environmental Weapon Conjuration](./13%20case%20study.md#case-858)

**Category**: Gimmick — aggressive smash AR + BitBeast rock debris conjuration  
**Parts**: Crusher's Gigars [M] — Gigars AR + 8 Heavy WD + SG Flat/Heavy BB  
**Key Physics**: Gigars AR [M]: 3 contacts; I = 1.856×10⁻⁶ kg·m²; C_smash ≈ 0.78 [M]; θ ≈ 30°. 8 Heavy WD [M]: m = 14.0 g; I = 2.044×10⁻⁶ kg·m². Assembly [M]: m ≈ 27.5 g; I ≈ 4.650×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 0.837 J; dω/dt ≈ −69.6 rad/s² [M]. BitBeast conjures rock debris from arena floor: m_debris ≈ 15 g [M]; combined impact mass (AR + debris) ≈ 23 g; KE_debris = 0.188 J at v_slam = 5.0 m/s.  
**Engine Note**: gigarsAssemblyStats() documented; debris conjuration is BeySpirit only — not available at combo scale; backfire mechanic (Phase 1 disruption ≥ 700 eu) is unique disrupt vulnerability.

---

### [Case 859 — [SPECIAL MOVE] Demolition Ax: Crusher / Gigars (original Beyblade anime)](./13%20case%20study.md#case-859)

**Category**: Special Move — rock-debris axe slam with disruption backfire mechanic  
**Bey / Blader**: Crusher / Gigars (original Beyblade anime, plastic gen)  
**Franchise Move**: Gigars gathers arena rock debris into an axe shape and crashes down. Phase 1 disrupt ≥ 700 eu: backfire — rock hits Gigars (only CS13 special with user self-damage on disruption).  
**Key Physics**: Phase 1 (1000 ms): beyTiltAngle → 55°; disruption threshold ≥ 700 eu → backfire (self-damage = 0.30 × mainHitDamage; cancel). Phase 2 (400 ms): axe form; disruption threshold ≥ 900 eu (no backfire). Phase 3 QTE "Demolish" (hold J; max 900 ms): full ≥ 700 ms: spinDelta −100; impulse 1600 eu; dmgMult 1.85×; burstBonus +15%; debrisAoE chip (all within 80 px: −15 spin, 250 eu, 1.20×). Medium 350–699 ms: −65; 1000 eu; 1.60×; +9%; no AoE. Quick < 350 ms: −35; 600 eu; 1.35×; +4%; no AoE. selfCost −70; powerCost 110; cooldown 6500 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: demolitionAx() and demolitionAxDisruption() documented; disruption backfire (Phase 1 only) is unique vulnerability; debrisAoE full-charge only.

---

### [Case 860 — [COMBO] Rock Smash: Gigars AR Double-Horn Drive (3-key: JJ↓)](./13%20case%20study.md#case-860)

**Category**: Combo — double horn smash + ground drive follow  
**Sequence**: attack → attack → moveDown  
**Key Physics**: Hit 1: spinDelta −40; dmgMult 1.35×; lockMs 30. Hit 2: spinDelta −28; dmgMult 1.20×; lockMs 20. Ground Drive (both J hit): addLockMs 40; impulse 250 eu. Combined lock 90 ms ≤ 300 ms. Each source ≤ 50 individually. Cost 25, universal.  
**Engine Note**: rockSmashCombo() documented; two-source (40 + 28 each ≤ 50); combined lock 90 ms; cost-25 double-hit pattern.

---

### [Case 861 — [GIMMICK] Zeo Abyss's Flame Byxis 230WD — 230 Height Magnetic Field Geometry and WD Stable Spin Platform](./13%20case%20study.md#case-861)

**Category**: Gimmick — 230 elevated magnetic field platform + WD bearing stable spin  
**Parts**: Zeo Abyss's Flame Byxis 230WD [M] — Flame wheel + 230 track + WD tip  
**Key Physics**: Flame wheel [M]: symmetric stamina; I = 7.350×10⁻⁶ kg·m²; C_deflect ≈ 0.38 [M]. 230 track [M]: height 23.0 mm — tallest standard MFB. Field directional: B_eff(α) = B_max × cos(α) — horizontal = full; overhead (α = 90°) = 0 (aerial counter window). WD tip [M]: bearing μ = 0.02; rubber ring engages at F ≥ 0.5 N lateral; dω/dt ≈ −1.40 rad/s² [M] (near-ES endurance). Assembly [M]: m ≈ 40.0 g; I ≈ 8.380×10⁻⁶ kg·m²; ω₀ = 600 rad/s; KE₀ ≈ 1.508 J. During Destiny Needle 10 s: Δω ≈ 14 rad/s (negligible).  
**Engine Note**: byxisAssemblyStats().fieldAngleMult() documented; aerial counter window (tiltAngle ≥ 45°) reduces μ_mag from 0.70 to 0.15; 10 s active window sustained by WD near-zero decay.

---

### [Case 862 — [SPECIAL MOVE] Destiny Needle: Zeo Abyss / Flame Byxis 230WD](./13%20case%20study.md#case-862)

**Category**: Special Move — remote bey-control hijack (tug-of-war mechanic, 10 s; highest powerCost 130)  
**Bey / Blader**: Zeo Abyss / Flame Byxis 230WD (MFB Metal Masters)  
**Franchise Move**: Byxis generates phantom compass; seizes opponent bey movement for 10 seconds. User pilots the opponent's bey. Aerial approach by opponent reduces control to 15%.  
**Key Physics**: Phase 1 (plant 1000 ms): invulnerable (WD rubber ring braces). Phase 2 (control 10000 ms): μ_mag = 0.70 normal (user 70%, opponent 30% input); aerial counter (tiltAngle ≥ 45°): μ_mag = 0.15 (user 15%, opponent 85%). User: hold Space + direction → applies to opponent bey. Byxis can also move normally simultaneously. selfCost −0 (WD decay negligible). powerCost 130 (highest in CS13); cooldown 8000 ms; invulnerability Phase 1 only.  
**Compatible beys**: Any beyblade.  
**Engine Note**: destinyNeedleControl() documented; dual-control (user pilots both beys simultaneously) is special-move-only; μ_mag aerial counter mechanic tied to fieldAngleMult; powerCost 130 unique maximum.

---

### [Case 863 — [COMBO] Compass Lock: Byxis WD Double-Brace Spin Siphon (3-key: K↑K)](./13%20case%20study.md#case-863)

**Category**: Combo — double WD brace with spin siphon  
**Sequence**: defense → moveUp → defense  
**Key Physics**: K₁ brace: WD rubber ring −45% incoming damage (×0.55 multiplier). ↑ advance. K₂ lock: if opponent within 80 px — spinGain +22; opponentSpinDelta −22; dmgMult 1.05×; lockMs 30. Cost 0 (free), stamina.  
**Engine Note**: compassLockCombo() documented; spin siphon +22 (zero-sum from contact); no AoE; partial absorption only; free stamina utility combo.

---

### [Case 864 — [GIMMICK] Bel Daizora's Divine/Dangerous Belial — Upper-Axis Blade Geometry and Aerial Dive Physics](./13%20case%20study.md#case-864)

**Category**: Gimmick — upper-attack blade geometry (C_upper 0.78 at 90° dive) + gravity-dive kinetic energy platform  
**Parts**: Divine/Dangerous Belial [M] — Divine/Dangerous Belial blade + Nexus core + Semi-Rubber Sharp driver + chip  
**Key Physics**: Blade [M]: C_upper = 0.78 at 90° dive; C_horizontal = 0.50; C_eff(α) = 0.50 + 0.28 × sin(α). I_blade = 6.069×10⁻⁶ kg·m². Driver [M]: r_tip = 1.5 mm; μ = 0.55 (semi-rubber sharp); dω/dt = −38.7 rad/s² [M]. Assembly [M]: m ≈ 37.0 g; I = 7.743×10⁻⁶ kg·m²; ω₀ = 650 rad/s; KE₀_spin = 1.637 J. Gravity dive: h = 2.0 m; v_fall_anime = 6.26 × 3.0 = 18.78 m/s; KE_fall = 6.52 J; KE_total = 8.157 J (fall energy 4× spin energy — highest single-impact KE in CS13).  
**Engine Note**: divineBelialStats() and upperContactCoeff() documented; KE_total 8.157 J justifies dmgMult 1.90× ceiling; gravity-dive BeySpirit ×3.0 transcendence.

---

### [Case 865 — [SPECIAL MOVE] Dangerous/Divine Dive: Bel Daizora / Divine/Dangerous Belial](./13%20case%20study.md#case-865)

**Category**: Special Move — gravity-dive with ~850 ms invulnerability; highest single-hit dmgMult in CS13 (1.90×)  
**Bey / Blader**: Bel Daizora / Divine/Dangerous Belial (Burst DB era)  
**Franchise Move**: Belial launches skyward (~2.0 m), hangs at apex, then plunges with BeySpirit-amplified gravity as primary accelerant.  
**Key Physics**: Phase 1 ascent (600 ms) + Phase 2 apex (150 ms) + Phase 3 first 100 ms: invulnerable (~850 ms total). Phase 3 QTE "Divine Drop" (hold J; release in 400 ms window): late ≥ 300 ms: spinDelta −100; impulse 1800 eu; knockback 5000 eu; dmgMult 1.90×; burstBonus +18%; tiltBurstTarget +30°. Medium 150–299 ms: −65; 1100; 2500; 1.65×; +10°; +15°. Early < 150 ms: −35; 600; 1000; 1.40×; +5°; 0°. selfCost −65; powerCost 120; cooldown 7000 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: dangerousDivineDive() and divineDiveInvulnerability() documented; 1.90× dmgMult highest in CS13 (KE_total 8.157 J justification); late release = maximum gravity build model.

---

### [Case 866 — [COMBO] Aerial Drive: Divine Belial Upper-Arc Strike (3-key: ←↑J)](./13%20case%20study.md#case-866)

**Category**: Combo — mini-arc upper-contact approach  
**Sequence**: moveLeft → moveUp → attack  
**Key Physics**: Strafe left (←), arc forward-upward mimicking Divine Dive trajectory (↑), J delivers upper-attack blade at arc apex. J hit: spinDelta = −48 rad/s; dmgMult 1.35×; lockMs 55; aerialKnock_eu 60 (small upward impulse to target — mini tiltBurst). Cost 15, universal.  
**Engine Note**: aerialDriveCombo() documented; aerialKnock 60 eu is positional (not invulnerability, not full tilt); 48 ≤ 50 (close to ceiling — upper-attack geometry justification); 1.35× ≤ 1.5×.

---

### [Case 867 — [PART] Dead Phoenix Energy Layer (Cho-Z Generation)](./9%20case%20study.md#case-867)

**Category**: Part — Energy Layer (Cho-Z)  
**Parts**: Dead Phoenix layer (21.8 g); Level Chip required; armor-detach mechanism (n=4 symmetry)  
**Key Physics**: I_DA = 4.810×10⁻⁶ kg·m²; I_DC = 1.218×10⁻⁶ kg·m²; I_total = 6.028×10⁻⁶ kg·m²; r_eff = 1.663 cm; armor inertia fraction 79.8% (mass inversion — armor dominates I); L₀ = 4.183×10⁻³ kg·m²/s at 694 rad/s. Post-detach: smooth perimeter → F_ratchet ≈ 0 → burst immune; armor cross-compatible with Perfect/Unperfect Phoenix variants [CONFIRMED].  
**Engine Note**: deadPhoenixLayer(); armorDetach() sets burst immunity flag; armor fraction 79.8% informs layer-swap spinDelta budget.

---

### [Case 868 — [PART] Forge Disc 10 (Cho-Z Generation)](./9%20case%20study.md#case-868)

**Category**: Part — Forge Disc (Cho-Z)  
**Parts**: Forge Disc 10 (23.8 g); 2 Frame slots; n=10 symmetry  
**Key Physics**: I = 8.861×10⁻⁶ kg·m²; r_eff = 1.930 cm; L₀ = 6.149×10⁻³ kg·m²/s at 694 rad/s; +13.0% I vs Disc 7; +0.090 cm r_eff vs Disc 7. No wobble (n=10). Best stamina disc in Cho-Z generation [CONFIRMED].  
**Engine Note**: forgeDisc10(); disc I contribution 58.9% of Dead Phoenix 10 Friction assembly total.

---

### [Case 869 — [PART] Friction Tip (Cho-Z Generation)](./9%20case%20study.md#case-869)

**Category**: Part — Performance Tip (Cho-Z)  
**Parts**: Friction tip (7.0 g); POM material; center-hold  
**Key Physics**: μ_POM = 0.10; r_contact = 0.45 cm; τ = 2.322×10⁻⁴ N·m at 52.6 g assembly; burstResistFactor 1.70× vs mobile tip [CONFIRMED]. No rubber bounce; KO resist > Atomic/Orbit [CONFIRMED]. Center-hold prevents self-KO drift.  
**Engine Note**: frictionTip(); μ = 0.10 (POM, not rubber); burstResistFactor 1.70 applied to ratchet spring model.

---

### [Case 870 — [ASSEMBLY] Dead Phoenix 10 Friction (Cho-Z)](./9%20case%20study.md#case-870)

**Category**: Assembly — Cho-Z System  
**Parts**: Dead Phoenix layer + Forge Disc 10 + Friction tip (52.6 g total)  
**Key Physics**: I_total = 1.503×10⁻⁵ kg·m²; L₀ = 1.043×10⁻² kg·m²/s; r_eff = 1.690 cm; dω/dt = 15.45 rad/s²; t_stall_ideal = 44.9 s. Phase 2 post-armor-detach (armor at ω ≈ 500 rad/s): m_post = 39.6 g, I_post = 1.022×10⁻⁵ kg·m², dω/dt = 17.10 rad/s², t_from_500 = 29.2 s. vs Atomic tip variant: −13.3% stamina deficit [CALCULATED].  
**Engine Note**: deadPhoenixAssembly(); Phase 2 trigger at armor detach event; post-detach physics swap to I_post = 1.022×10⁻⁵ and decay = 17.10 rad/s².

---

### [Case 871 — [PART] Revive Phoenix Energy Layer (Cho-Z Generation)](./9%20case%20study.md#case-871)

**Category**: Part — Energy Layer (Cho-Z)  
**Parts**: Revive Phoenix layer (23.3 g); parry mechanism (spring-loaded blade return)  
**Key Physics**: I_RA = 3.594×10⁻⁶ kg·m²; I_RC = 1.835×10⁻⁶ kg·m²; I_total = 5.429×10⁻⁶ kg·m²; r_eff = 1.526 cm; armor inertia fraction 66.2%; F_parry = 0.45–0.75 N; −10.0% L₀ vs Dead Phoenix; I_RC +50.6% vs Dead Core. Best right-spin defense layer of Cho-Z generation [CONFIRMED].  
**Engine Note**: revivePhoenixLayer(); parryMechanism() returns blade on contact; F_parry range 0.45–0.75 N stored as parryForceMin/Max.

---

### [Case 872 — [PART] DB Core Phoenix (DB System Generation)](./9%20case%20study.md#case-872)

**Category**: Part — DB Core (DB System)  
**Parts**: DB Core Phoenix (7.6 g); 4 locking teeth at 90°  
**Key Physics**: I = 4.408×10⁻⁷ kg·m²; r_eff = 0.762 cm; engagement 27.8%; average burst resistance. Contributes only 1.6% of Prominence Phoenix assembly total I [CALCULATED]. Tooth engagement 27.8% is the burst trigger probability scaling factor.  
**Engine Note**: dbCorePhoenix(); burstEngagement = 0.278; I contribution 1.6% — negligible for spin calc; tooth geometry drives burst probability only.

---

### [Case 873 — [PART] Blade Prominence (DB System Generation)](./9%20case%20study.md#case-873)

**Category**: Part — Blade (DB System)  
**Parts**: Blade body (14.5 g [EST]) + Prominence Shield (9.5 g [CONFIRMED]); total 24.0 g  
**Key Physics**: I_blade = 4.713×10⁻⁶ kg·m²; I_shield = 4.684×10⁻⁶ kg·m²; I_total = 9.397×10⁻⁶ kg·m²; shield inertia fraction 49.9% (mass inversion — shield ≈ blade). Post-shield-detach I_post = 4.713×10⁻⁶ (50.1% retention). Heavy Mode recommended; Normal vs Heavy I difference < 1% [CONFIRMED].  
**Engine Note**: bladeProminence(); prominenceShieldDetach() halves layer I to 4.713×10⁻⁶; shield detach differs from armor detach — no burst immunity, but burst threshold rises post-detach.

---

### [Case 874 — [PART] Armor-10 (DB System Generation)](./9%20case%20study.md#case-874)

**Category**: Part — Armor (DB System)  
**Parts**: Armor-10 (13.4 g); n=10 symmetry; no wobble  
**Key Physics**: I = 4.750×10⁻⁶ kg·m²; r_eff = 1.883 cm. In Prominence Phoenix assembly: 15.7% of total mass, 17.2% of total I. No gyro imbalance from n=10. Stabilizing role — not primary I driver.  
**Engine Note**: armor10(); 17.2% I fraction in assembly; r_eff 1.883 cm → wider perimeter than DB Core but narrower than Tapered disc.

---

### [Case 875 — [PART] Forge Disc Tapered (DB System Generation)](./9%20case%20study.md#case-875)

**Category**: Part — Forge Disc (DB System)  
**Parts**: Forge Disc Tapered (29.3 g); tapered wall profile; no frame slots  
**Key Physics**: I = 1.245×10⁻⁵ kg·m²; r_eff = 2.061 cm; L₀ = 8.640×10⁻³ kg·m²/s at 694 rad/s; +40.5% I vs Disc 10; +58.8% I vs Disc 7; tapered wall redistributes mass to outer rim. 45.2% of Prominence Phoenix assembly total I — dominant stamina driver [CONFIRMED].  
**Engine Note**: forgeTaperedDisc(); I = 1.245×10⁻⁵ kg·m²; 45.2% of assembly I; tapered profile → no frame slots; highest I disc in DB System generation.

---

### [Case 876 — [PART] Metal Universe Tip (DB System Generation)](./9%20case%20study.md#case-876)

**Category**: Part — Performance Tip (DB System)  
**Parts**: Metal Universe tip (11.1 g); metal ball bearing; μ = 0.012  
**Key Physics**: r_contact = 0.20 cm (metal ball bearing centroid); τ = 2.011×10⁻⁵ N·m at 85.4 g assembly; torque ratio vs Friction tip = 0.0533 (5.3%); t_stall_ideal ≈ 950 s [CALCULATED]; self-KO critical orbit speed 11.1 rad/s (below this → center-drift). Metal Lock burst resist ratio 0.94 (shorter tabs × stronger spring [CONFIRMED]).  
**Engine Note**: metalUniverseTip(); μ = 0.012; selfKOcriticalOmega = 11.1 rad/s; burstResistRatio 0.94 vs standard ratchet.

---

### [Case 877 — [ASSEMBLY] Prominence Phoenix Tapered-10 MU (DB System)](./9%20case%20study.md#case-877)

**Category**: Assembly — DB System  
**Parts**: DB Core Phoenix + Blade Prominence + Armor-10 + Forge Disc Tapered + Metal Universe tip (85.4 g total)  
**Key Physics**: I_total = 2.755×10⁻⁵ kg·m²; L₀ = 1.912×10⁻² kg·m²/s (+83.4% vs Dead Phoenix 10 Friction); r_eff = 1.796 cm; Tapered disc 45.2% of I; dω/dt = 0.730 rad/s²; t_stall_ideal = 950 s; t_soft (ω₀ = 400 rad/s) = 548 s. Phase 2 post-shield-detach: m = 75.9 g, I = 2.287×10⁻⁵ kg·m², dω/dt = 0.781 rad/s², t_from_500 = 640 s [CALCULATED].  
**Engine Note**: prominencePhoenixAssembly(); shield detach event swaps I to 2.287×10⁻⁵ and decay to 0.781 rad/s²; t_stall_ideal 950 s is generation peak.

---

### [Case 878 — [PART] Twin Nemesis Energy Layer (God Layer Generation)](./9%20case%20study.md#case-878)

**Category**: Part — Energy Layer (God Layer)  
**Parts**: Twin Nemesis layer (13.1 g); n=2 blades; Upper Mode / Smash Mode  
**Key Physics**: I = 3.461×10⁻⁶ kg·m²; r_eff = 1.625 cm; n=2 → gyro imbalance CONFIRMED; tall teeth 1.43× hold torque vs medium; Upper Mode > Smash Mode [CONFIRMED]; F_upper ≈ 7.73 N at blade angle 20°.  
**Engine Note**: twinNemesisLayer(); gyroImbalanceFactor active (n=2); upperMode dmgMult bonus applied; F_upper = 7.73 N feeds into contact impulse calc.

---

### [Case 879 — [PART] Forge Disc 3 (God Layer Generation)](./9%20case%20study.md#case-879)

**Category**: Part — Forge Disc (God Layer)  
**Parts**: Forge Disc 3 (21.6 g); Frame-compatible (odd disc); no inherent wobble from disc itself  
**Key Physics**: I = 3.822×10⁻⁶ kg·m²; r_eff = 1.330 cm; L₀ = 2.653×10⁻³ kg·m²/s at 694 rad/s; −51.3% I vs Disc 7; ω_ratio = 2.051× vs Disc 7 at same L₀; v_tip ratio ≈ 1.48× [CALCULATED]. High LAD quality without frame [CONFIRMED]. Low I → higher ω at launch (same L₀).  
**Engine Note**: forgeDisc3(); low I high-ω tradeoff; ω_ratio 2.051 stored as launchOmegaFactor; LAD quality high.

---

### [Case 880 — [PART] Disc Frame Hit (God Layer Generation)](./9%20case%20study.md#case-880)

**Category**: Part — Disc Frame (God Layer)  
**Parts**: Disc Frame Hit (2.0 g); n=1 single protrusion; for odd discs  
**Key Physics**: I_Hit = 6.665×10⁻⁷ kg·m²; combined 3Hit (Disc 3 + Hit): I = 4.489×10⁻⁶ kg·m², m = 23.6 g, r_eff = 1.379 cm. n=1 → maximum rotational imbalance; wobble torque = 1.64 N·m at 416 rad/s. Contact rarely activates [CONFIRMED]; mass too light for meaningful attack [CONFIRMED]; LAD reduced vs Cross frame.  
**Engine Note**: discFrameHit(); wobbleTorque = 1.64 N·m at ω=416 → feeds gyroImbalance system; contact activation probability low (rare flag).

---

### [Case 881 — [ASSEMBLY] Twin Nemesis 3Hit Jaggy (God Layer)](./9%20case%20study.md#case-881)

**Category**: Assembly — God Layer System  
**Parts**: Twin Nemesis + Forge Disc 3 + Frame Hit + Jaggy tip (42.4 g total)  
**Key Physics**: I_total = 8.918×10⁻⁶ kg·m² (TN 38.8%, Disc 3 42.8%, Hit 7.5%, Jaggy 10.8%); L₀ = 6.189×10⁻³ kg·m²/s; r_eff = 1.450 cm; ω_battle = 416 rad/s; μ_Jaggy = 0.45, r_eff_effective = 0.10 cm (star intermittency); dω/dt = 20.97 rad/s²; t_battle = 19.8 s from ω = 416 rad/s. vs Disc 7 assembly: −32.7% L₀ but attack justified by higher ω [CALCULATED].  
**Engine Note**: twinNemesis3HitJaggyAssembly(); Jaggy r_eff_effective 0.10 cm (intermittent star contact); ω_battle 416 stored as launchOmega; t_battle 19.8 s → ~20 s stamina budget.

---

### [Case 882 — [PART] Hell Salamander Energy Layer (Cho-Z Generation, Left-Spin)](./9%20case%20study.md#case-882)

**Category**: Part — Energy Layer (Cho-Z, Left-Spin)  
**Parts**: Hell Salamander layer (21.27 g); Defense Mode n=10 / Attack Mode n=5; Level Chip required; metal inserts  
**Key Physics**: I = 6.774×10⁻⁶ kg·m²; r_eff = 1.785 cm; metal fraction: 69.2% of I, 50.0% of mass. Defense Mode: near-zero burst vs right-spin opponents (left-spin gear-mesh [CONFIRMED]); Attack Mode: n=5. Unbalanced without Level Chip; stamina ≥ Crash Ragnaruk [CONFIRMED].  
**Engine Note**: hellSalamanderLayer(); leftSpinFlag = true; defenseModeGearMesh() → burstImmune vs right-spin; Level Chip required for balance; metal fraction 69.2% of I.

---

### [Case 883 — [PART] Forge Disc 12 (Cho-Z Generation)](./9%20case%20study.md#case-883)

**Category**: Part — Forge Disc (Cho-Z)  
**Parts**: Forge Disc 12 (16.1 g); 2 Frame slots; lightest Cho-Z disc [CONFIRMED]  
**Key Physics**: I = 4.711×10⁻⁶ kg·m²; r_eff = 1.712 cm; −46.8% I vs Disc 10. Known to damage opponent layers on contact [CONFIRMED]. Lightest Cho-Z disc → highest ω at launch among Cho-Z discs at same L₀.  
**Engine Note**: forgeDisc12(); layerDamageRisk = true (sharp-edge contact flag); −46.8% I vs Disc 10 → higher launch ω tradeoff.

---

### [Case 884 — [PART] Operate Tip (Cho-Z Generation)](./9%20case%20study.md#case-884)

**Category**: Part — Performance Tip (Cho-Z)  
**Parts**: Operate tip (7.1 g); dual-mode: Defense (r=0.30 cm) / Attack (r=0.50 cm, off-center)  
**Key Physics**: μ = 0.04; Defense Mode: r_contact = 0.30 cm, no locking tabs, KO resist < Massive [CONFIRMED]; Attack Mode: r_contact = 0.50 cm off-center, erratic/hopping, no banking pattern. Both modes underperform [CONFIRMED]. τ_def = 5.232×10⁻⁵ N·m; τ_atk = 8.720×10⁻⁵ N·m at 44.47 g.  
**Engine Note**: operateTip(); dualMode flag; defenseModeUnderperform = true; attackModeErratic = true; both modes flagged suboptimal.

---

### [Case 885 — [ASSEMBLY] Hell Salamander 12 Operate (Cho-Z, Left-Spin)](./9%20case%20study.md#case-885)

**Category**: Assembly — Cho-Z System (Left-Spin)  
**Parts**: Hell Salamander + Forge Disc 12 + Operate tip (44.47 g total)  
**Key Physics**: I_total = 1.157×10⁻⁵ kg·m² (HS 58.6%, Disc 12 40.7%, Operate 0.77%); L₀ = 8.027×10⁻³ kg·m²/s; r_eff = 1.613 cm; dω/dt_def = 4.522 rad/s²; t_stall_def_ideal = 153.5 s; dω/dt_atk = 7.536 rad/s². Left-spin gear-mesh vs right-spin → near-zero burst [CONFIRMED]. Operate tip inferior in both modes; optimal substitutes: Friction / Atomic / Bearing tip; Spread / 10 / 7 disc [CONFIRMED].  
**Engine Note**: hellSalamanderAssembly(); leftSpinGearMesh active; Operate underperform flags carry through; t_stall_def 153.5 s reference stamina budget.

---

### [Case 886 — [ANALYSIS] Armor Detachment Dimensional Collapse (Cross-Generation)](./9%20case%20study.md#case-886)

**Category**: Analysis — Armor Detachment Physics (Cross-Generation)  
**Parts**: Dead Phoenix (21.8 g), Revive Phoenix (23.3 g), Blade Prominence / Prominence Shield (24.0 g)  
**Key Physics**: Effective diameter post-detach: Dead Phoenix 4.4→2.8 cm (−36.4%); Revive Phoenix 4.4→3.0 cm (−31.8%); Prominence Shield 5.0→4.6 cm (−8.0%). Height drop 3–5 mm. Perimeter change: bladed → smooth circle → F_ratchet ≈ 0 → burst immunity (Dead Phoenix, Revive Phoenix only). Aero drag ratio (r⁵ scaling): Dead Phoenix 0.105, Revive Phoenix 0.149, Prominence 0.659. Wall contact radius shifts 0.8 cm further from wall → center-seeking behavior. Precession rate post-detach: Dead Phoenix ω_p_post = 0.0660 vs 0.0835 rad/s (−21% slower precession at same ω) [CALCULATED].  
**Engine Note**: armorDetachDimensionalCollapse(); burstImmune flag set on smooth-perimeter detach; wallContactRadiusShift +0.8 cm; precessionRate updated on detach event.

---

### [Case 887 — [PART] Killer Deathscyther Energy Layer (God Layer Generation)](./9%20case%20study.md#case-887)

**Category**: Part — Energy Layer (God Layer)  
**Parts**: Killer Deathscyther layer (9.2 g); mechanical slide gimmick (3 failure modes)  
**Key Physics**: I = 2.141×10⁻⁶ kg·m²; r_eff = 1.525 cm; L₀ = 1.486×10⁻³ kg·m²/s at 694 rad/s. Triple gimmick failure: (1) mechanical block prevents full extension; (2) mass too light (p_slide = 1.124×10⁻³ N·s insufficient); (3) timing mismatch (τ_coll 3–5 ms < τ_slide 8–12 ms) [CONFIRMED]. Unbalanced: F_imbal = 4.78 N at 416 rad/s; r_blade = 1.8 cm limits contact damage.  
**Engine Note**: killerDeathscytherLayer(); gimmickFailCascade = true (mechanical + mass + timing); F_imbal 4.78 N at 416 rad/s feeds wobble system; slide not modeled (non-functional).

---

### [Case 888 — [PART] Forge Disc 2 (God Layer Generation)](./9%20case%20study.md#case-888)

**Category**: Part — Forge Disc (God Layer)  
**Parts**: Forge Disc 2 (21.21 g); 2 Frame slots; "Jack-of-All-Trades" [CONFIRMED]  
**Key Physics**: I = 6.416×10⁻⁶ kg·m²; r_eff = 1.739 cm; L₀ = 4.453×10⁻³ kg·m²/s at 694 rad/s; −18.2% I vs Disc 7; +67.8% I vs Disc 3. Minimal protrusion → no layer damage risk. Versatile across all bey types.  
**Engine Note**: forgeDisc2(); jackOfAllTrades tag; layerDamageRisk = false; I midpoint between Disc 3 and Disc 7.

---

### [Case 889 — [PART] Disc Frame Vortex (God Layer Generation)](./9%20case%20study.md#case-889)

**Category**: Part — Disc Frame (God Layer)  
**Parts**: Disc Frame Vortex (2.51 g); n=3 symmetry; heaviest common God Frame [CONFIRMED]  
**Key Physics**: I_Vortex = 9.061×10⁻⁷ kg·m²; r_eff = 1.90 cm; no wobble (n=3). Cannot reach opponent layer [CONFIRMED] — attack only via Over-Wall Defense (OWD). Combined 2Vortex (two Vortex frames on Disc 2): I = 7.322×10⁻⁶ kg·m², m = 23.72 g, r_eff = 1.756 cm; −6.6% I vs Disc 7 alone [CALCULATED].  
**Engine Note**: discFrameVortex(); OWDonly = true; 2Vortex combined I = 7.322×10⁻⁶; wobble = false (n=3).

---

### [Case 890 — [PART] Hunter Tip (God Layer Generation)](./9%20case%20study.md#case-890)

**Category**: Part — Performance Tip (God Layer)  
**Parts**: Hunter tip (5.9 g); annular ring contact (r_inner = 0.20 cm, r_outer = 0.50 cm)  
**Key Physics**: μ = 0.50; r_contact = 0.35 cm (annular ring centroid); τ = 6.649×10⁻⁴ N·m at 38.82 g assembly; dω/dt = 69.71 rad/s²; t_battle = 5.97 s from ω = 416 rad/s. Speed rank: Accel < Zephyr < Hunter < Xtreme [CONFIRMED]. Self-burst risk high at high ω; wear degrades aggression only (not contact area). KO when settled > Defense and Bite [CONFIRMED].  
**Engine Note**: hunterTip(); μ = 0.50; r_contact 0.35 cm annular centroid; selfBurstRisk = high; wearModel degrades aggressionFactor only.

---

### [Case 891 — [ASSEMBLY] Killer Deathscyther 2Vortex Hunter (God Layer)](./9%20case%20study.md#case-891)

**Category**: Assembly — God Layer System  
**Parts**: Killer Deathscyther + Forge Disc 2 + 2× Frame Vortex + Hunter tip (38.82 g total)  
**Key Physics**: I_total = 9.537×10⁻⁶ kg·m² (KD 22.5%, Disc 2 67.3%, Vortex 9.5%, Hunter 0.77%); L₀ = 6.619×10⁻³ kg·m²/s; r_eff = 1.567 cm; dω/dt = 69.71 rad/s²; t_battle = 5.97 s. Component failure cascade confirmed: KD layer limiting factor — even Disc 7 upgrade only adds +0.4 s. t_stall_ideal = 9.95 s [CALCULATED].  
**Engine Note**: killerDeathscytherAssembly(); gimmickFailCascade carries; t_battle 5.97 s → extremely short stamina budget; Disc 2 dominates I at 67.3%.

---

### [Case 892 — [ANALYSIS] Launch Physics Fundamentals: Energy Transfer Pull-to-Spin (Cross-Gen)](./14%20case%20study.md#case-892)

**Category**: Analysis — Launcher Physics (Cross-Generation)  
**Parts**: Any ripcord or string launcher  
**Key Physics**: E_pull = F × d; ω₀ = √(2 × E_useful / I_bey). Ripcord: d = 250–280 mm, E = 10–22 J, η = 0.65–0.85, ω₀ = 260–520 rad/s (2500–5000 RPM). String: d = 600–800 mm, E = 24–64 J, η = 0.80–0.90, ω₀ = 520–900 rad/s (5000–8600 RPM) — 2–3× energy advantage. Worn ripcord (100+ launches): ω₀ ≈ 0.85× new. Standard reference: 60 N, 265 mm pull, η = 0.75, I = 2.5×10⁻⁵ → ω₀ ≈ 489 rad/s.  
**Engine Note**: computeLaunchSpin(); gearEfficiency η stored per launcher type; wornRipcordFactor = 0.85 at 100+ launch cycles.

---

### [Case 893 — [PART] Winder / Snap Launcher (Plastic Gen S1 Pre-Ripcord)](./14%20case%20study.md#case-893)

**Category**: Part — Launcher (Plastic Gen Pre-Ripcord)  
**Parts**: Winder / Snap Launcher (~20–30 g [EST]); spring-wound mechanism  
**Key Physics**: E_winder ≈ 0.05 J (spring: k ≈ 1000 N/m, x ≈ 10 mm); ω₀ ≈ 63 rad/s ≈ 600 RPM — ~13% of ripcord launch speed. Destabilizes immediately (stability < 0.4 × ω_max threshold). Non-competitive [CONFIRMED]; historical origin-format mechanism.  
**Engine Note**: winderLauncher(); launchSpin 63 rad/s; competitiveUse = false; pre-ripcord era tag.

---

### [Case 894 — [PART] Standard Ripcord Launcher / EZ Shooter (Plastic Gen)](./14%20case%20study.md#case-894)

**Category**: Part — Launcher (Plastic Gen)  
**Parts**: EZ Shooter / Standard Ripcord Launcher (~35–45 g); pull distance 260 mm; ripcord 18 teeth  
**Key Physics**: E_useful = 11.4 J at F = 60 N, η = 0.73; ω₀_realistic ≈ 735 rad/s (7020 RPM) at F = 45 N average. Tooth Δθ = 0.209 rad each; total rotation 3.76 rad. Sliding Shoot capable (angle → tilt init). Right-spin only. Worn ripcord −15% at 100+ launches.  
**Engine Note**: ezShooterLauncher(); slidingShootCapable = true; launchSpin 735 rad/s; ripcordTeeth 18.

---

### [Case 895 — [PART] Reverse Shooter / Left-Spin Shooter (Plastic Gen)](./14%20case%20study.md#case-895)

**Category**: Part — Launcher (Plastic Gen, Left-Spin)  
**Parts**: Reverse Shooter (~35–45 g); reversed gear train; pull distance 260 mm  
**Key Physics**: Mirror-image of EZ Shooter — ω₀ ≈ 735 rad/s CCW; energy identical. Enables left-spin AR builds (Penta Wing, Reverse Dragon, etc.). Required for counter-spin and co-rotation stamina strategies vs left-spin opponents [CONFIRMED].  
**Engine Note**: reverseShooterLauncher(); spinDirection = "left"; launchSpin 735 rad/s; mirrorOfStandard = true.

---

### [Case 896 — [PART] HMS Double Shooter (HMS Era)](./14%20case%20study.md#case-896)

**Category**: Part — Launcher (HMS)  
**Parts**: HMS Double Shooter (~40–55 g); narrow HMS spindle; both spin directions  
**Key Physics**: HMS I ≈ 1.0–1.8×10⁻⁵ kg·m² (smaller, lighter); at E_useful = 11.4 J → ω₀_HMS ≈ 1322 rad/s (12630 RPM). Narrow spindle incompatible with plastic gen / MFB / Burst [CONFIRMED]. "Double" = dual spin direction capability. Higher RPM than plastic gen launchers due to lower HMS inertia.  
**Engine Note**: hmsDoubleShoter(); spindle = "narrow_hms_fit"; launchSpin 1000 rad/s (realistic avg); incompatibleWith plastic gen, MFB, Burst, BX.

---

### [Case 897 — [PART] BeyStringer / String Launcher (MFB Era)](./14%20case%20study.md#case-897)

**Category**: Part — Launcher (MFB Era)  
**Parts**: BeyStringer (~60–80 g); string wrap mechanism; pull distance 700 mm  
**Key Physics**: E_useful = 35.7 J at F = 60 N, d = 700 mm, η = 0.85; ω₀ ≈ 1689 rad/s (16130 RPM). 3.1× energy vs ripcord; 2.3× RPM. Continuous force curve (no tooth discretization → better tilt control). String frays at 200–300 launches. Kinked strings → tilt anomalies. Recommended for all MFB+ competitive stamina and balanced builds [CONFIRMED].  
**Engine Note**: beyStringer(); pullDistance 700 mm; launchSpin 1689 rad/s; forceCurve = "continuous"; vsRipcordMultiplier 3.1.

---

### [Case 898 — [PART] Launcher Grip / Customize Grip (Cross-Gen)](./14%20case%20study.md#case-898)

**Category**: Part — Launcher Accessory (Cross-Generation)  
**Parts**: Launcher Grip variants (standard/catapult/sniper/customize); 30–60 g  
**Key Physics**: Catapult Grip: L_grip = 160 mm, L_launcher = 80 mm → F_effective = 2× → E doubles (10.4 → 20.8 J). Standard Grip: 1.5× force. Launch angle variance: no grip ±10–15°; with grip ±5°. Customize Grip (plastic gen): accepts SP attachments. Catapult Grip is strongest performer — doubles launch energy without added effort.  
**Engine Note**: launcherGrip(); catapultForceMultiplier 2.0; angleConsistencyBonus 0.65; crossGen = true.

---

### [Case 899 — [PART] Light Launcher 2 (MFB Era)](./14%20case%20study.md#case-899)

**Category**: Part — Launcher (MFB Era, Reduced)  
**Parts**: Light Launcher 2 (~25–30 g); pull distance 190 mm; compact form  
**Key Physics**: E_useful = 6.8 J at F = 50 N, η = 0.72; ω₀ ≈ 737 rad/s (7040 RPM) — 73% of full launcher output. Competitive disadvantage vs full launchers; valid as angle-consistency practice tool (shorter pull = faster practice cycle).  
**Engine Note**: lightLauncher2(); launchSpin 737 rad/s; vsFullLauncher spinFraction 0.73; competitiveUse = "casual_or_practice".

---

### [Case 900 — [PART] Burst Launcher (Standard Ripcord, Rk/Lk)](./14%20case%20study.md#case-900)

**Category**: Part — Launcher (Burst Generation)  
**Parts**: Burst Launcher Rk/Lk (~40–50 g); nylon gears; lock-tooth ripcord; pull distance 270 mm  
**Key Physics**: E_useful = 11.3 J at F = 55 N, η = 0.76; ω₀ ≈ 1062 rad/s (10145 RPM) at I = 2.0×10⁻⁵ kg·m². Lock-tooth engagement 95% vs plastic gen 85% → −10% false-engagement launches. Burst threshold clearance: ω₀ ≫ 525 rad/s minimum. Nylon gears extend service life vs ABS [CONFIRMED].  
**Engine Note**: burstLauncherRk(); lockToothEngagement 0.95; launchSpin 1062 rad/s; nylonGears = true; compatibleWith all Burst sub-generations.

---

### [Case 901 — [PART] Burst String Launcher (B-88 / B-99)](./14%20case%20study.md#case-901)

**Category**: Part — Launcher (Burst Generation, String)  
**Parts**: Burst String Launcher B-88 / B-99 (~60–80 g); string mechanism; pull distance 680 mm  
**Key Physics**: E_useful = 35.1 J at F = 60 N, d = 680 mm, η = 0.86; ω₀ ≈ 1873 rad/s (17890 RPM). vs Burst ripcord: 1.76× spin, 76% longer burst-resist window (time above ω_burst threshold). B-99 improves string feed consistency over B-88. Essential for serious Burst competitive play [CONFIRMED].  
**Engine Note**: burstStringLauncher(); launchSpin 1873 rad/s; vsBurstRipcord spinMultiplier 1.76; burstResistExtension 0.76.

---

### [Case 902 — [PART] BX Launcher (Gen 4 / X Series, Ratchet-Click)](./14%20case%20study.md#case-902)

**Category**: Part — Launcher (BX Generation)  
**Parts**: BX Launcher R/L (~50–60 g); ratchet-click mechanism; pull distance 280 mm  
**Key Physics**: E_useful = 14.2 J at F = 65 N, η = 0.78; ω₀ ≈ 1256 rad/s (12000 RPM) at I = 1.8×10⁻⁵ kg·m². Ratchet engagement 99% (near-perfect) vs standard 85–92%. Launch variance "very_low". Wear life ~400 launches (4× standard ripcord). Incompatible with all non-BX generations [CONFIRMED].  
**Engine Note**: bxLauncher(); ratchetMechanism = true; engagementRate 0.99; launchSpin 1256 rad/s; wearLifeLaunches 400.

---

### [Case 903 — [PART] Ripcord (Consumable Accessory)](./14%20case%20study.md#case-903)

**Category**: Part — Consumable (All Ripcord Launchers)  
**Parts**: Ripcord (~3–5 g); nylon reinforced; 18 teeth; 265 mm usable  
**Key Physics**: Δθ_per_tooth = 0.209 rad (N_gear = 30 teeth); total rotation 3.76 rad per pull. Wear: 0–50 launches 100% efficiency; 50–100 launches 90%; 100+ launches 80% (ω₀_worn ≈ 0.85× new → −15% launch speed). Replace at 100 competitive launches or on tooth skip observation. Consumable [CONFIRMED].  
**Engine Note**: ripcordConsumable(); wearCurve stored; replacementThreshold 100 launches; 0.85 factor at worn state.

---

### [Case 904 — [PART] Launcher Grip Level 5 (Burst Era, Spring-Loaded)](./14%20case%20study.md#case-904)

**Category**: Part — Launcher Accessory (Burst Era)  
**Parts**: Launcher Grip Level 5 (~80–100 g); spring-loaded wrist support; L_grip = 120 mm  
**Key Physics**: Force multiplier 2.5× (L_total = 200 mm vs L_launcher = 80 mm) → F_effective = 125 N → E_Level5 = 33.75 J vs ungrippled 13.5 J. Launch angle variance: ±12° → ±3° (70% reduction). launchConsistencyImprovement = 0.70. Compatible with Burst launchers and BX launchers. Highest-performance grip accessory [CONFIRMED].  
**Engine Note**: launcherGripLevel5(); forceMultiplier 2.5; angleVariance_deg 3; consistencyImprovement 0.70.

---

### [Case 905 — [PART] Burst Era Winder (Pre-Match Tuning Tool)](./14%20case%20study.md#case-905)

**Category**: Part — Tuning Accessory (Burst Era)  
**Parts**: Burst Winder (~60–80 g); motor device; ~2500 RPM (260 rad/s)  
**Key Physics**: ω_winder ≈ 200–300 rad/s; L = I × ω ≈ 6.25×10⁻³ N·m·s at I = 2.5×10⁻⁵; Ω_p = τ_gravity / L — precession observable. Enables pre-match tuning: bottom height vs AR, WD balance check, mode-change threshold calibration. No match launch function; competitiveUse = false.  
**Engine Note**: burstWinder(); diagnosticValue = true; motorRPM 2500; no launchSpin output — tuning tool only.

---

### [Case 906 — [PART] RC Shooter / RC EG Launcher (Plastic Gen G-Rev Era)](./14%20case%20study.md#case-906)

**Category**: Part — Launcher (Plastic Gen G-Rev, Remote Control)  
**Parts**: RC Shooter / RC EG Launcher (~120–150 g); RF transmitter; standard ripcord + remote EG trigger  
**Key Physics**: Ripcord component: E = 11.4 J (standard). Remote EG trigger: ΔE_EG ≈ 0.5 × k × x² → +15–25 rad/s spin boost at optimal contact timing. RF range 8 m; RF latency 0.1 ms (negligible vs 3 ms contact). Banned in most tournament formats (unfair remote advantage [CONFIRMED]).  
**Engine Note**: rcShooterLauncher(); remoteEgTrigger = true; rfRange 8 m; competitiveStatus = "banned_most_formats".

---

### [Case 907 — [TECHNIQUE] Sliding Shoot (All Ripcord Launchers)](./14%20case%20study.md#case-907)

**Category**: Technique — Launch Tilt Initialization (Cross-Generation)  
**Parts**: Any ripcord launcher  
**Key Physics**: θ_launch ≈ 0.5 × pull_angle_from_horizontal. At 30° downward pull: θ_launch ≈ 8–15°. Activates mode-change tips from first contact if θ_launch > θ_switch (Metal Change Core 8°, Spiral Change Base 10°+). Power-Sliding Shoot: F = 70 N + 25° angle → E = 18.2 J + θ_init > θ_switch simultaneously. Stadium entry position controlled by angle — steeper = further from center → immediate wall contact.  
**Engine Note**: slidingShootTilt(); tiltInit = angle × 0.4 + (height/100 × 2); isModeActivatedAtLaunch() checks θ vs tipSwitchAngle; launcher-independent technique.

---

### [Case 908 — [PART] Beypointer / BeyLogger (Burst Era, Data Accessory)](./14%20case%20study.md#case-908)

**Category**: Part — Data Accessory (Burst Era)  
**Parts**: Beypointer (~60–80 g); AAA batteries; Bluetooth optional; QR reader  
**Key Physics**: Zero competitive physics contribution. Records spin time → empirical μ derivable: μ_empirical = 2 × I × Δω / (m × g × r_tip × Δt). Useful calibration tool for verifying engine friction constants from real battle data. competitiveImpact = "none".  
**Engine Note**: beypointerDevice(); competitiveImpact = "none"; calibrationUse = "empirical_mu_measurement"; no battle physics hook.

---

### [Case 909 — [PART] Power Launcher / BeyMax Shooter (Plastic Gen Enhanced)](./14%20case%20study.md#case-909)

**Category**: Part — Launcher (Plastic Gen, Enhanced)  
**Parts**: Power Launcher / BeyMax Shooter; spring pre-load mechanism  
**Key Physics**: E_preload = 0.5 × 900 × (0.015)² = 0.10 J; total E_total = 11.5 J (+0.9% vs EZ Shooter 11.4 J). Δω₀ ≈ +3.2 rad/s — below ±30 rad/s launch variance noise floor. Marketing differentiator; actual competitive advantage minimal [CONFIRMED]. Catapult Grip (+2× energy) outperforms by orders of magnitude.  
**Engine Note**: powerLauncher(); springPreload_J 0.10; totalEnergy_J 11.5; actualAdvantage = "minimal"; prefer catapult grip over this.

---

### [Case 910 — [REFERENCE] Launcher Compatibility Matrix (Cross-Generation)](./14%20case%20study.md#case-910)

**Category**: Reference — Launcher Compatibility (Cross-Generation)  
**Parts**: All launchers across all generations  
**Key Physics**: EZ Shooter → plastic gen only (MFB adapter: −5–15% efficiency); HMS Double Shooter → HMS only; BeyStringer → MFB/4D/ZeroG (Burst adapter available); Burst Launcher Rk/Lk → all Burst sub-gens; Burst String → Burst; BX Launcher → BX/UX/CX only; Light Launcher 2 → MFB / Burst-reduced. HMS and BX require dedicated launchers — no cross-compat [CONFIRMED]. Adapters exist for limited cross-gen at reduced efficiency.  
**Engine Note**: launcherCompatibility record; adapterPenalty 5–15% energy loss; incompatiblePairs: HMS↔all others, BX↔all others.

---

### [Case 911 — [PART] Whale Crusher AR (Plastics Gen)](./3%20case%20study.md#case-911)

**Category**: Part — Attack Ring (Plastics Gen, 3-wing)  
**Parts**: Whale Crusher AR (7.3 g); r_outer = 2.6 cm; r_inner = 1.0 cm; n=3 wings  
**Key Physics**: I = 2.83×10⁻⁶ kg·m²; Right spin: slope θ = 22° → J_upper = 0.374J, J_lateral = 0.927J (+37% I vs Upper Dragoon); width substitutes for WD overhang (r_outer 2.6 cm reaches without WD dependency). Left spin: spike α = 75° from tangent → J_recoil = 0.966J, J_smash = 0.259J (catastrophic — −251 rad/s Δω per failed hit). Force smash inverted slope β = 5° → J_down = 0.087J (below threshold, functional zero).  
**Engine Note**: whaleCrusherAR(); rightSpinUpperImpulse() → upperNs 0.030, lateralNs 0.074; leftSpinRecoilFraction = 0.966 (nonviable).

---

### [Case 912 — [PART] SG Flat Base (Plastics Gen)](./3%20case%20study.md#case-912)

**Category**: Part — Blade Base (Plastics Gen, SG)  
**Parts**: SG Flat Base (4.4 g); plastic flat tip; μ = 0.35; r_tip = 0.40 cm; shortest base in plastics (1.3 cm)  
**Key Physics**: Height advantage: ΔH = 3 mm vs standard → +11.5% upper impulse. Flower pattern: ω_max_plastic = 4.78 rad/s (slips at any useful orbit speed; rubber tip ω_max = 7.45 rad/s). Restitution e = 0.70 → 75% more impulse reflected vs rubber. LAD I_base = 8.8×10⁻⁷ kg·m² — acceptable, not exceptional. SG shell accepts left-spin variants but no competitive left-spin AR available.  
**Engine Note**: sgFlatBase(); muStatic 0.35; slidingShootCapable = true; flower pattern disabled at competitive orbit speeds.

---

### [Case 913 — [PART] SG Metal Sharp Base (Plastics Gen)](./3%20case%20study.md#case-913)

**Category**: Part — Blade Base (Plastics Gen, SG)  
**Parts**: SG Metal Sharp Base (7.6 g total); near-point metal tip; clips (1.6×10⁻⁷ kg·m² — 2% of combo I)  
**Key Physics**: Height = 2.0 cm → +26% upper impulse bonus for attackers. LAD terminates at 7.9° (underside spikes contact stadium). τ_restore ≈ 0 (near-point tip → no restoring torque). Tilt accumulates unresisted under perturbation at low spin. Outclassed by Metal Sting Base in every dimension except mass; far behind CMSB.  
**Engine Note**: sgMetalSharpBase(); ladAngleDeg = 7.9° (underside spikes); restoreTorque ≈ 0 at upright stance.

---

### [Case 914 — [PART] Panther Head AR (Plastics Gen, Left-Spin)](./3%20case%20study.md#case-914)

**Category**: Part — Attack Ring (Plastics Gen, Left-Spin Smash)  
**Parts**: Panther Head AR (5.5 g); r_outer = 2.2 cm; n=3 directional blades  
**Key Physics**: I = 1.61×10⁻⁶ kg·m². Left spin: blade face α = 30° → J_smash = 0.866J, J_recoil = 0.500J — competitive smash. Opposite-spin doubles impulse budget. Destabilisation slopes add cumulative tilt. Right spin: convex back α = 80° → J_recoil = 0.985J (98.5%) — nonviable. Range cap at 2.2 cm: Wide Defense rim leads at long range as recoil surface; Ten Wide preserves AR contact priority.  
**Engine Note**: pantherHeadAR(); leftSpinFlag = true; alphaLeftDeg 30; rangeCapMm 22 → tenWidePreferred over wideDefense.

---

### [Case 915 — [PART] Spin Gear Core: North Magnecore (Plastics Gen)](./3%20case%20study.md#case-915)

**Category**: Part — Spin Gear Core (Plastics Gen)  
**Parts**: North Magnecore (3.3 g); permanent N-pole magnet  
**Key Physics**: F_mag = 86.4 mN at d = 5 mm (19.6% of tip normal force). −3.5% recoil spin-loss vs plastic core; +2.3% vs MWC at cost of −1.2 g vs MWC. North polarity: repels magnetised tips on assembly; attracts bey toward Magne Stadia magnets (defensive). HMC (6 g) provides +9.2% recoil damping but kills orbital speed.  
**Engine Note**: northMagnecore(); F_mag = 86.4 mN at 5 mm; magStadiaBehavior = "attract" (north polarity = defensive).

---

### [Case 916 — [PART] Spin Gear Core: South Magnecore (Plastics Gen)](./3%20case%20study.md#case-916)

**Category**: Part — Spin Gear Core (Plastics Gen)  
**Parts**: South Magnecore (3.3 g); permanent S-pole magnet  
**Key Physics**: Identical mass-inertia to North Magnecore (Case 915). Magne Stadia: repulsion 68% of tip normal force at 10 mm — genuinely significant, produces erratic offensive movement. Standard arena: F_mag = 86.4 mN at 5 mm (same as North). Between North and South in standard competition: choose whichever is available.  
**Engine Note**: southMagnecore(); magStadiaBehavior = "repel" (south polarity = erratic offensive); physicsIdenticalToNorth.

---

### [Case 917 — [PART] SG Metal Flat Base (Gaia Dragoon V Version, SGMF2)](./3%20case%20study.md#case-917)

**Category**: Part — Blade Base (Plastics Gen, Metal Flat)  
**Parts**: SG Metal Flat Base Mold 2 (6.2 g); metal flat tip; μ_metal = 0.55–0.65; completely flat mold  
**Key Physics**: τ_threshold = 1.58×10⁻⁴ N·m (exceeded by nearly all high-recoil ARs → angular impulse exits as translation). Full-face tornado ridge contact → 19 mN redirect vs 14 mN for beveled mold. Mid-to-low height: marginal upper attack angle vs standard opponents; fails vs Circle Survivor (3 mm deficit). Only competitive non-rubber Smash Attack base in plastics.  
**Engine Note**: sgMetalFlatBase2(); angularToLinearRecoilConversion() when torque > τ_threshold; tornadoRidgeForce 19 mN; rightSpinOnly smash.

---

### [Case 918 — [PART] Dragon Breaker Core AR (Plastics Gen)](./3%20case%20study.md#case-918)

**Category**: Part — Attack Ring Core (Plastics Gen, SAR-conditional)  
**Parts**: Dragon Breaker Core AR (5.3 g); r_outer = 2.7 cm; serration angle 37°  
**Key Physics**: Right spin solo: Tier 2 smash + high recoil. Screw Zeus SAR RS: 86.6% smash fraction. Left spin + War Bear SAR: 89.1% smash; LS + Screw Zeus SAR: 90.6% smash (maximum weight — requires very-high-traction rubber tips). Inverted Screw Zeus slope → self-tilt risk at lower heights. Circle Survivor resistance via momentum bludgeoning only.  
**Engine Note**: dragonBreakerCoreAR(); sarDependentPerformance; screwZeusLS_smash = 0.906; selfTiltRisk flag for inverted slope.

---

### [Case 919 — [PART] Dragon Breaker Sub AR (Plastics Gen)](./3%20case%20study.md#case-919)

**Category**: Part — Sub Attack Ring (Plastics Gen)  
**Parts**: Dragon Breaker Sub AR (2.2 g); r_outer = 3.1 cm; free-spinning ring  
**Key Physics**: Free rotation absorbs 14% of every angular impulse unconditionally. Prong contact α = 60° → 43% smash fraction (after free-spin penalty). r_outer 3.1 cm obstructs core AR contact faces (SAR becomes primary contact). Moment arm 72% longer than standard SARs → amplified vertical recoil torque. GEG geometry: 61% effective smash (best realistic pairing is Great Dragon).  
**Engine Note**: dragonBreakerSubAR(); freeSpinAbsorption 14%; primacyContactFlag = true (SAR obstructs core); gegSmash = 0.61.

---

### [Case 920 — [PART] Volcano Change Base (Plastics Gen)](./3%20case%20study.md#case-920)

**Category**: Part — Blade Base (Plastics Gen, Height Minimiser)  
**Parts**: Volcano Change Base (3.5 g bracket); accepts SG Grip Base Tip or VCB Tip; Magnecore mandatory  
**Key Physics**: Total stack height 1.1–1.2 cm (4–5 mm shorter than SG Grip Base → +15.1% upper-impulse advantage vs standard opponents). Magnetic tip retention: F_mag = 56 mN at 2 mm insertion vs 9.8 mN gravitational load. LAD collapses at 8.5° tilt (Magnecore body contacts stadium). Polarity tie — North or South Magnecore equally viable.  
**Engine Note**: volcanoChangeBase(); heightMm 12; upperImpulseBonus 0.151; ladCollapseAngle 8.5°; requiresMagnecore = true.

---

### [Case 921 — [PART] Land Attack AR / Tryhorn (Plastics Gen)](./3%20case%20study.md#case-921)

**Category**: Part — Attack Ring (Plastics Gen, V-Tread)  
**Parts**: Land Attack AR — Tryhorn (stock: 8 Heavy / Right SG / SG Semi-Flat Base); V-tread circular disc  
**Key Physics**: V-groove wall angle β = 40° → J_smash = 0.643J + tangential = 0.643J simultaneously (spin equalization). Left spin: negative smash (attacker pushed backward) — absolute directional constraint. 8 Heavy I = 3.29×10⁻⁶ kg·m² maximises spin retention for equalization. SG Semi-Flat μ = 0.35 → τ_thresh = 6.16×10⁻⁴ N·m — absorbs recoil as wobble. Win condition: compounding V-groove equalization across hits.  
**Engine Note**: landAttackAR(); vGrooveAngle 40°; smashFraction 0.643; equalizationDmg compounding model; leftSpinNegative = true.

---

### [Case 922 — [PART] Cross Griffon AR (Plastics Gen)](./3%20case%20study.md#case-922)

**Category**: Part — Attack Ring (Plastics Gen, 4-wing smash)  
**Parts**: Cross Griffon AR (5.4 g); 4 wings at 90°; thick sharp tip protrusions  
**Key Physics**: 4-wing: 34% more contact events/s vs Triple Wing; α = 23° → J_smash = 0.921J; total smash output +42% vs Triple Wing. Tip: 80 N over 0.3 mm² = 267 MPa (exceeds ABS yield → AR deformation). Wear: 10% tip radius loss → 10% smash drop (below Triple Wing). SGMF2 synergy: 191 hard hits/s + rotational recoil converted to translation. Left spin: wing backs α = 55° → 57.4% smash, 81.9% recoil — nonviable.  
**Engine Note**: crossGriffonAR(); smashFraction 0.921; tipPressureMPa 267 (deformation flag); sgmf2Synergy = true.

---

### [Case 923 — [PART] Dual Dragon AR (Plastics Gen)](./3%20case%20study.md#case-923)

**Category**: Part — Attack Ring (Plastics Gen, PC sub-frame)  
**Parts**: Dual Dragon AR; Core AR + polycarbonate sub-frame; r_outer = 2.7 cm  
**Key Physics**: PC shock absorption claim false: ABS and PC share E ≈ 2.3 GPa — impulse identical. PC outer edge α = 88° → ~100% lateral push, ~0% spin equalization (mild defense). Core AR left-spin rounded contacts α = 75° → 25.9% smash, 96.6% recoil (bounces off itself). Width 2.7 cm: exposes 3.5 mm beyond Wide Defense; Wide Survivor reduces to ~1 mm (+41% spin retention). Not catastrophic — PC prevents sub-frame fracture.  
**Engine Note**: dualDragonAR(); pcFrameShockAbsorption = false (E identical to ABS); leftSpinBounceBack = 0.966; preferWideSurvivor.

---

### [Case 924 — [PART] Fantom Grip Base (Plastics Gen)](./3%20case%20study.md#case-924)

**Category**: Part — Blade Base (Plastics Gen, Narrow Rubber)  
**Parts**: Fantom Grip Base; narrow hard-rubber tip; μ = 0.85 (rubber); r_tip (narrower than CGB Tip)  
**Key Physics**: τ_threshold = 6.60×10⁻⁴ N·m (44% of CGB Tip 1.50×10⁻³ N·m). ω_max_flower = 6.26 rad/s (vs 7.45 rad/s CGB Tip). Tier 2 flower pattern. Slower spin drain in sustained attrition vs DGB-Defense (lower τ → less tip friction). Can outspin DGB-Defense combos. Against top-tier Zombies / WBD / Circle Survivor: τ deficit is decisive.  
**Engine Note**: fantomGripBase(); tauThreshold 6.60e-4; omegaMaxFlower 6.26 rad/s; tier2FlowerPattern; attritionAdvantageVsDGB = true.

---

### [Case 925 — [PART] Eight Attacker AR (Plastics Gen)](./3%20case%20study.md#case-925)

**Category**: Part — Attack Ring (Plastics Gen, Left-Spin)  
**Parts**: Eight Attacker AR (left-spin AR, 4 wings + 4 tabs); flat contact faces  
**Key Physics**: Left spin primary contacts α ≈ 78° → J_smash = 0.208J per contact. 2-contact window: 2 × 0.208J = 0.416J vs Reverse Dragon (1.5 × 0.574J = 0.861J). Eight Attacker delivers 48% of Reverse Dragon's net smash. No spin-direction asymmetry (flat faces perform equally poorly in both directions). Near-pure recoil regardless of spin direction.  
**Engine Note**: eightAttackerAR(); alphaLeftDeg 78; smashFraction 0.208; rightSpinIdentical (flat = direction-neutral failure).

---

### [Case 926 — [PART] Magne Flat Base (Plastics Gen)](./3%20case%20study.md#case-926)

**Category**: Part — Blade Base (Plastics Gen, Removable Tip)  
**Parts**: Magne Flat Base (4.7 g); 4 swept wings; removable tip socket; no SP slots  
**Key Physics**: Left spin μ_left = 0.500; right spin μ_right = 0.139 (flat 60° and 82° faces). LAD onset 21.8° (poor survival/defense). smashFraction_left ≈ 0.500 — usable attack platform for rubber tips. Lighter than CGB (forfeits SP mass). Useful for rubber attack when SP compatibility is unneeded; unique height interaction with Dranzer V Magnecore.  
**Engine Note**: magneFlatBase(); leftSpinSmash 0.500; rightSpinSmash 0.139; removableTip = true; noSPslots.

---

### [Case 927 — [PART] Magne Flat Base Tip (Plastics Gen)](./3%20case%20study.md#case-927)

**Category**: Part — Performance Tip (Plastics Gen, Plastic + South Magnet)  
**Parts**: Magne Flat Base Tip; clear ABS plastic; μ = 0.35; r_tip = 0.40 cm; embedded South Magnet  
**Key Physics**: τ_threshold = 6.04×10⁻⁴ N·m (41% of CGB Tip). ω_max_flower = 4.78 rad/s (nonviable orbit speed). Flange contact at 14° tilt (LAD penalty). Three-tip family ranking: CGB Tip 1.46×10⁻³ > SG GBT 1.13×10⁻³ > Magne Flat Tip 6.04×10⁻⁴ N·m. Fails all three tip roles (attack, defense, stamina). South Magnet interactions weak at d > 5 mm.  
**Engine Note**: magneFlatBaseTip(); tauThreshold 6.04e-4; omegaMaxFlower 4.78 (nonviable); flangeContactAngle 14°.

---

### [Case 928 — [PART] SG Grip Base Tip (Plastics Gen)](./3%20case%20study.md#case-928)

**Category**: Part — Performance Tip (Plastics Gen, Rubber)  
**Parts**: SG Grip Base Tip (2.74 g); hard rubber; μ = 0.85; r_tip = 0.35 cm; passive ferromagnetic steel pole  
**Key Physics**: τ_threshold = 1.31×10⁻³ N·m (87% of CGB Tip). ω_max_flower = 7.45 rad/s (identical to CGB Tip — μ term equal). 0.90 g lighter than CGB Tip → Force Smash weight-class advantage (mass can shift to heavier WD). Volcano Change Base compatibility (alignment tab). North Magnecore: induced dipole increases N → higher F_friction. Rolling power: 28% less than CGB Tip → slightly better stamina.  
**Engine Note**: sgGripBaseTip(); tauThreshold 1.31e-3; omegaMaxFlower 7.45; volcanoChangeBaseCompatible = true; magnetInduction(northMag → increased N).

---

### [Case 929 — [PART] Sonic Tiger AR (Plastics Gen)](./3%20case%20study.md#case-929)

**Category**: Part — Attack Ring (Plastics Gen, 2-wing 3-segment)  
**Parts**: Sonic Tiger AR (4.7 g); 2 wings, 3 segments per wing separated by gaps  
**Key Physics**: I = 3.02×10⁻⁶ kg·m². Right spin: avg α = avg(65°, 77°) → smash 32.4% (56% of Panther Claw). Left spin: avg α = avg(72°, 78°) → smash 25.9% (non-viable). Gap-edge contacts (22% of events): α = 85° → pure recoil. Segment gaps convert deflection events into recoil impacts vs continuous ring. No competitive role in either spin direction.  
**Engine Note**: sonicTigerAR(); seg3RearTab α_RS 65°; seg2MidBlock α_RS 77°; gapEdgeRecoil = true; noCompetitiveRole.

---

### [Case 930 — [PART] SG Metal Flat Base v2 (Truncated Cone Tip)](./3%20case%20study.md#case-930)

**Category**: Part — Blade Base (Plastics Gen, Metal Truncated Cone)  
**Parts**: SG Metal Flat Base v2 (6.2 g); metal truncated-cone tip; r_flat = 0.075 mm; half-cone angle = 15°  
**Key Physics**: I_base = 5.29×10⁻⁶ kg·m² (among highest for plastic-gen bases). LAD θ_LAD = 4.9° (tip destabilises before high I provides benefit). μ_steel on ABS = 0.55; restoring torque insufficient → premature nutation. ω_max_flower ≈ 6.00 rad/s. Tier 2 compact; outclassed by rubber/metal tips with proper contact radius.  
**Engine Note**: sgMetalFlatBase_v2(); rFlat 0.075 mm; ladAngle 4.9°; highI but earlyNutation; tier2Compact.

---

### [Case 931 — [PART] Griffolyon Base Hasbro (Plastics Gen)](./3%20case%20study.md#case-931)

**Category**: Part — Blade Base (Plastics Gen, 4-pole Hasbro)  
**Parts**: Griffolyon Base Hasbro (7.2 g); 4 pole bases; dome shaft; "free-spin" gimmick  
**Key Physics**: LAD θ_LAD = 4.9° (pole bumps contact stadium, terminating precession). Shaft coupling torque = 9.86×10⁻⁴ N·m; tip friction torque = 1.54×10⁻⁴ N·m; coupling/tip ratio = 6.4× → free-spin gimmick negated (coupling transmits spin through shaft rather than freeing it). I_base = 5.29×10⁻⁶ kg·m² — mechanically irrelevant given tip/LAD failures.  
**Engine Note**: griffoloyonBaseHasbro(); ladAngle 4.9°; freeSpinGimmickNegated (shaftCouplingRatio 6.4×); polesDestroyLAD.

---

### [Case 932 — [PART] Cybernetic Dragon AR (Plastics Gen)](./3%20case%20study.md#case-932)

**Category**: Part — Attack Ring (Plastics Gen, Large-Diameter)  
**Parts**: Cybernetic Dragon AR (5.3 g); r_outer = 4.0 cm; flat faces; r_contact = 3.8 cm  
**Key Physics**: α_RS = 78° → J_smash = 0.208J (21%); α_LS = 82° → J_smash = 0.139J (14%). Thread torque at J = 0.12 N·s: 4.46×10⁻³ N·m ≈ τ_thread_max → AR physically rotates backward. HMC reduces thread load ratio from 95% to 61.8% (+38% improvement). vs Square Edge: 3.09× more smash per contact. Near-total recoil in all configurations; HMC is only partial mitigation.  
**Engine Note**: cyberneticDragonAR(); alphaRightDeg 78; threadTorqueRisk = true; hmcThreadLoad 0.618; smashFrac 0.208.

---

### [Case 933 — [PART] Spike Dragon AR (Plastics Gen)](./3%20case%20study.md#case-933)

**Category**: Part — Attack Ring (Plastics Gen, Vertical-Ridge)  
**Parts**: Spike Dragon AR (4.9 g); r_contact = 3.3 cm; vertical ridge texture; flat contact faces  
**Key Physics**: Vertical ridges change pressure distribution, not contact angle → α unchanged. Left spin α = 76°, contact area = 112 mm² → effective J_smash ≈ 0.404J. Right spin α = 65°, area = 20 mm² → J_smash ≈ 0.300J. Rotational recoil fraction = 0.730 (73% of recoil impulse → spin deceleration). Δω per hit ≈ 7.8 rad/s at J = 0.01 N·s. Cannot reduce rotational recoil despite large face area.  
**Engine Note**: spikeDragonAR(); alphaLeftDeg 76; rotRecoilFraction 0.730; verticalRidgeNullEffect (angle unchanged).

---

### [Case 934 — [PART] Magne Weight Disk (Plastics Gen)](./3%20case%20study.md#case-934)

**Category**: Part — Weight Disk (Plastics Gen, Magnetic)  
**Parts**: Magne Weight Disk Mold 1 (14.3 g); 4 permanent magnets; zinc alloy + soft ABS shell; r_outer = 3.0 cm  
**Key Physics**: I_uniform = 6.44×10⁻⁶ kg·m² — even mass distribution limits I below Wide Survivor. Facet α = 60° → recoilFraction = 0.866 (73% more recoil vs Wide Defense). Magnetic bearing drag: 6.2×10⁻⁵ N additional → 1.9×10⁻⁵ W continuous spin drain. Centrifugal shell force near peel limit at 200 rad/s. Magnetic gimmick vs non-MGWD opponents: negligible.  
**Engine Note**: magneWeightDisk(); iUniform 6.44e-6 (underperforms rim-concentrated WDs); magnetBearingDrag 6.2e-5 N; facetRecoil 0.866.

---

### [Case 935 — [PART] Reverse Attack SP (Plastics Gen)](./3%20case%20study.md#case-935)

**Category**: Part — Support Part (Plastics Gen, 2-piece)  
**Parts**: Reverse Attack SP (0.88 g both halves); primary fin α = 55°; r_SP = 3.1 cm  
**Key Physics**: I_SP = 8.46×10⁻⁷ kg·m²; smash fraction 0.574 — best of two-part SPs. Arc coverage 220°; expected smash = 0.350J vs one-part SP 0.528J (51% gap). LAD clearance 2.5 mm → θ_LAD = 4.6° (poor); rounded arm softens catch torque. Least-recoil-prone two-part SP; two-part split coverage limits competitive ceiling vs one-part designs.  
**Engine Note**: reverseAttackSP(); smashFrac 0.574; arcCoverage 220°; expectedSmash 0.350J; twoPartCeilingPenalty.

---

### [Case 936 — [PART] Customize Grip Base (Plastics Gen)](./3%20case%20study.md#case-936)

**Category**: Part — Blade Base (Plastics Gen, SP-Compatible)  
**Parts**: Customize Grip Base (5.1 g); r_outer = 3.7 cm; SP slots (2 pairs); wide smooth disc rim  
**Key Physics**: I_CGB = 3.74×10⁻⁶ kg·m². Rim LAD: θ_onset = 6.2° (tip destabilises) → rim extends effective precession to ~14°. ω_max_rim = 9.63 rad/s. Zombie performance: θ_prec_max ≈ 25–30° (25–50% more precession range vs tall bases without rim). Force Smash mass: CGB + SG GBT + Defense Ring SP = ~12.3 g → WBD class. Opposite-spin relative velocity 3.3× same-spin (spin-steal premium).  
**Engine Note**: customizeGripBase(); rimLAD 14.1° (after tip destabilise); I 3.74e-6; zombieBaseFlag = true; SPslots = 2 pairs.

---

### [Case 937 — [PART] Customize Grip Base Tip (Plastics Gen)](./3%20case%20study.md#case-937)

**Category**: Part — Performance Tip (Plastics Gen, Wide Rubber + Magnet)  
**Parts**: CGB Tip (1.8 g); hard rubber; μ = 0.82; r_tip = 0.40 cm; South Magnet at centre  
**Key Physics**: τ_threshold = 1.44×10⁻³ N·m (near-top of rubber tip hierarchy). ω_max_flower ≈ 7.33 rad/s. Rolling power = 1.23×10⁻³ W (43% less drain vs soft rubber). Ridge rollover factor 0.20 (easy ridge skip — consistent ridge-skipping at Tornado Ridge). South Magnet repels with Magnecore → tip sits higher → lower effective combo height when paired with Magnecore.  
**Engine Note**: cgbTip(); tauThreshold 1.44e-3; omegaMaxFlower 7.33; ridgeRolloverFactor 0.20; southMagnetRepulsion.

---

### [Case 938 — [PART] Upper Claw AR (Plastics Gen)](./3%20case%20study.md#case-938)

**Category**: Part — Attack Ring (Plastics Gen, Multi-Mode)  
**Parts**: Upper Claw AR Mold 1 (5.0 g); 3 wings; lower slope θ = 25°, upper slope θ = 40°; claw tips α = 45°  
**Key Physics**: Right spin: lower slope J_upper = 0.423J; upper slope J_upper = 0.643J; slope transition upward smash = 0.259J; claw tip J_smash = 0.707J; mane spike J_smash = 0.616J. Overhang 6 mm → lower contact boundary on CGB = 1.8 cm vs 2.2 cm without overhang. Left spin: ALL vertical components invert → 42% of impulse destabilises self (non-viable).  
**Engine Note**: upperClawAR(); rightSpinMultiMode (upperAttack + upwardSmash + smash); leftSpinSelfDestabilise = true; overhangMm 6.

---

### [Case 939 — [PART] Ten Balance Weight Disk (Plastics Gen)](./3%20case%20study.md#case-939)

**Category**: Part — Weight Disk (Plastics Gen)  
**Parts**: Ten Balance (15.0 g); r_outer = 1.9 cm; 10 equidistant rim tabs (60% of mass at r_t = 1.8 cm)  
**Key Physics**: I_TB = 3.93×10⁻⁶ kg·m² (vs Wide Defense 3.97×10⁻⁶ — nearly equal). vs Ten Heavy: −14.0% I. Correct choice only when compact/semi-flat tip bowl-wall clearance is binding constraint: wallClearanceGain = (2.2−1.9) × tan(35°) = 2.10 mm at β ≥ 35°. Otherwise Wide Defense wins by 1% I; Ten Heavy wins by 13% I.  
**Engine Note**: tenBalance(); I 3.93e-6; bowlClearanceAdvantage at β ≥ 35° only; defaultToWideDefenseElsewhere.

---

### [Case 940 — [PART] Upper Attack Support Parts (Plastics Gen)](./3%20case%20study.md#case-940)

**Category**: Part — Support Part (Plastics Gen, Slope Extension)  
**Parts**: Upper Attack SP Mold 1 (1.78 g each, 3.56 g pair); r_mount = 2.9 cm; θ_SP = 25°  
**Key Physics**: I_SP = 2.99×10⁻⁶ kg·m² (pair) — 1.5–2× an AR's worth of inertia at periphery. Contact window extended: without SP = 3–10 mm; with SP = 0–10 mm (+3 mm low coverage → decisive vs compact/semi-flat opponents). Blue-side up (standard): continuous slope 0–10 mm at θ = 25°; J_vertical = 0.423J. Red-side up (reversed): disrupts slope continuity, reduces efficiency. Mold 2 fixes structural alignment.  
**Engine Note**: upperAttackSP(); I_pair 2.99e-6; contactWindowExtension +3 mm; blueUpStandard; contactHeightFloor 0 mm.

---

### [Case 941 — [PART] Customize Metal Change Base (Plastics Gen)](./3%20case%20study.md#case-941)

**Category**: Part — Blade Base (Plastics Gen, Phase-Switching)  
**Parts**: CMCB (6.4 g); Metal Change Tip; r_sharp = 0.05 cm, r_skirt = 0.30 cm; ω_crit = 0.55 × ω_max  
**Key Physics**: Sharp phase (ω > ω_crit): P_idle = 7.84×10⁻⁷ W; 11% of SGMBB idle drag. Skirt phase: P_idle = 4.0× SGMBB. Cross-over: CMCB leads stamina only while ω > ω_crit. With Upper Attack SP: m_total = 9.96 g, I = 4.86×10⁻⁶ kg·m² (2.37× SGMBB). +1.16 g vs SGMBB → better Force Smash. Rumoured fully-sharp mold: production assembly error using CMSB tip (no skirt → no tornado-ridge, no WBD, no compact stability).  
**Engine Note**: customizeMetalChangeBase(); changeTipContactRadius(ω); P_idle 7.84e-7 (sharp) → 4× SGMBB (skirt); I_with_SP 4.86e-6.

---

### [Case 942 — [PART] Customize Metal Sharp Base (Plastics Gen)](./3%20case%20study.md#case-942)

**Category**: Part — Blade Base (Plastics Gen, Fixed Sharp)  
**Parts**: CMSB (5.8 g); fixed sharp metal tip; r_point = 0.035 cm; plastic collar r = 0.45 cm; h_gap = 2.5 mm  
**Key Physics**: Collar engagement at θ = 29.1°. P_idle_sharp = 1.05×10⁻⁶ W (0.19% of rubber flat — best same-spin stamina in plastics). restoreTorque at θ < 29.1°: 2.10×10⁻⁶ N·m (point only → near zero); at θ > 29.1°: 2.09×10⁻⁴ N·m (collar — 100× increase). Loses to heavy Force Smash (collar never engages before KO). Correct niche: same-spin stamina vs opponents that cannot deliver Force Smash at low spin.  
**Engine Note**: customizeMetalSharpBase(); collarEngagementAngle 29.1°; P_idle 1.05e-6; restoreTorque phase-switching at collar engage.

---

### [Case 943 — [PART] Mountain Hammer AR (Plastics Gen)](./3%20case%20study.md#case-943)

**Category**: Part — Attack Ring (Plastics Gen, High-Mass Smash)  
**Parts**: Mountain Hammer AR (6.0 g); r_contact = 2.5 cm; h_CP = 0.8 cm (elevated); α_RS = 22°, α_LS = 35°  
**Key Physics**: RS: J_smash = 0.927J; J_recoil = 0.375J → τ_recoil = 1.17×10⁻³ N·m (thread stress). LS: J_smash = 0.819J. Rotational recoil fraction = 0.34 at I_total = 9.0×10⁻⁶. Elevated CPs 8 mm: mid-height base pairing mandatory; CSD-clearing advantage. Ten Heavy keeps WD radius clear of opponent approach. Mass on par with Triple Wing smash.  
**Engine Note**: mountainHammerAR(); smashFracRS 0.927; smashFracLS 0.819; rotRecoilFraction 0.34; elevatedCP_mm 8 (mid-height base required).

---

### [Case 944 — [PART] Defense Ring Support Part (Plastics Gen)](./3%20case%20study.md#case-944)

**Category**: Part — Support Part (Plastics Gen, Wide LAD)  
**Parts**: Defense Ring SP (2.91 g); r_outer = 3.7 cm; bottom angle φ = 5°; smooth outer surface  
**Key Physics**: θ_LAD_onset = 2.3° (earliest of any SP — 4× better than standard 9.9°). ω_LAD_min = 8.91 rad/s (lowest critical spin of any SP — 13% below Upper Attack SP, 18% below Reverse Attack). I_peripheral = 3.30×10⁻⁶ kg·m² (highest despite lighter than Upper Attack SP). Rivet coverage 17%, α = 25° → avgRecoilFraction = 0.072 (7% — effectively passive). Dominant for all LAD/survive-to-endgame builds.  
**Engine Note**: defenseRingSP(); ladOnsetAngle 2.3°; ladMinOmega 8.91 rad/s; I 3.30e-6; recoilFraction 0.072 (passive surface).

---

### [Case 945 — [PART] Customize Clutch Change Base (Plastics Gen)](./3%20case%20study.md#case-945)

**Category**: Part — Blade Base (Plastics Gen, Centrifugal Clutch)  
**Parts**: CCCB (5.8 g); centrifugal clutch; survival tip (disengaged) / attack tip (engaged)  
**Key Physics**: ω_crit ≈ 10% of ω_max (89 rad/s at spring params: k = 80 N/m, m_c = 1.5 g, r_c = 10 mm). Attack mode engages at ~1% of launch attack force. Fundamental inversion: survival when attack is needed (high ω) → attack when spin is nearly depleted (low ω). Spring tension variation explains inter-unit timing differences but does not fix inversion. Not competitively viable without accepting mode uselessness.  
**Engine Note**: customizeClutchChangeBase(); omegaCrit 89 rad/s (10% ω_max); modeInversionFlaw = true; attackForceAtCrit 0.01×launch.

---

### [Case 946 — [PART] Cross Dranzer AR (Plastics Gen)](./3%20case%20study.md#case-946)

**Category**: Part — Attack Ring (Plastics Gen, 4-fold Symmetric)  
**Parts**: Cross Dranzer AR (5.0 g); r_outer = 2.7 cm; n=4 congruent wings; no overhang  
**Key Physics**: 4-fold symmetry → spin-neutral (RS = LS performance). Mixed contacts: α_smash = 20° (J_smash 0.940J), θ_slope = 15° (J_upper 0.259J), α_recoil = 40° (J_recoil 0.643J). I_CD = 2.31×10⁻⁶ kg·m²; f_rot = 0.257 (26% rotational, 74% translational recoil). No downward overhang → no AR-stadium contact during precession → full Defense Ring LAD uninterrupted. Incomplete spin-steal reach; outclassed by Gyro Defense.  
**Engine Note**: crossDranzerAR(); isSpinNeutral = true (n=4); noOverhang → ladOrbitUninterrupted; f_rot 0.257.

---

### [Case 947 — [PART] Cross Survivor Support Parts (Plastics Gen)](./3%20case%20study.md#case-947)

**Category**: Part — Support Part (Plastics Gen, Wide Defensive Buffer)  
**Parts**: Cross Survivor SP (2.56 g); r_outer = 3.7 cm (matches Defense Ring); 4 rectangular tabs  
**Key Physics**: Bottom-face angle steeper than Defense Ring → lower effective LAD vs Defense Ring. 4 tabs: rotational-alignment preference for 2/4/8-fold ARs. Near-continuous circular barrier for defense. Bidirectional mounting: one direction adds minor attack contribution (tab faces forward); opposite direction adds defense (tab faces backward). Wide radius matches Defense Ring for precession geometry but steeper angle reduces LAD survival vs DR.  
**Engine Note**: crossSurvivorSP(); rOuter 0.037 m (matches DR); bottomAngleSteeper → lowerLAD vs DefenseRing; bidirectionalMount; 4tabGeometry.

---

### [Case 948 — [PART] Triple Attacker AR (Plastics Gen)](./3%20case%20study.md#case-948)

**Category**: Part — Attack Ring (Plastics Gen, 3 Attack Vectors)  
**Parts**: Triple Attacker AR (3-wing, multiple contact modes); outer-diagonal contact face  
**Key Physics**: 3 distinct attack vectors per wing. Outer-diagonal contact penalty: the outermost contacts present at an elevated α from the orbital tangent → recoil penalty at full extension. Left-spin viable (directionally asymmetric enough for usable smash fraction). Contact analysis: inner contact smash > outer diagonal contact. Correct WD pairing important (rim must not obstruct inner contacts).  
**Engine Note**: tripleAttackerAR(); 3attackVectors per wing; outerDiagonalPenalty; leftSpinViable = true.

---

### [Case 949 — [PART] Ten Wide Weight Disk (Plastics Gen)](./3%20case%20study.md#case-949)

**Category**: Part — Weight Disk (Plastics Gen)  
**Parts**: Ten Wide WD; r_outer wider than Ten Balance; 10 tabs; some rim concentration  
**Key Physics**: Wider outer radius vs Ten Balance → higher I contribution. Tab recoil: tabs produce discrete recoil points where opponent contacts WD directly; 10 tabs = high contact frequency. Reduced rim concentration vs pure annular WDs (Wide Defense/Survivor): I per gram lower. For stamina: Wide Defense still preferred (uniform annulus > tab-concentrated at equal mass). Ten Wide suitable where extra reach is valued over pure I.  
**Engine Note**: tenWide(); tabRecoilFlag; rimConcentrationLower vs uniformAnnulus WDs; I vs Ten Balance: slightly higher due to wider r_outer.

---

### [Case 950 — [PART] Double Bearing Core (Plastics Gen)](./3%20case%20study.md#case-950)

**Category**: Part — Spin Gear Core (Plastics Gen, Zombie)  
**Parts**: Double Bearing Core; 2 stacked ball bearings; h_bearing₂ +2.5 mm SG stack  
**Key Physics**: Two bearings: near-zero tip friction (spin decoupled from tip). Bey retains spin through air drag + minor internal friction only. Stack height +2.5 mm elevates CoM → marginally increases wobble torque. Multi-shaft compatibility for different base configurations. Combined with CGB rim LAD (θ_prec_max 25–30°) → premier Zombie configuration in plastics. Coupling attenuation: two-stage bearing reduces any residual rotational coupling from SG thread to near zero.  
**Engine Note**: doubleBearingCore(); tipFrictionNearZero; zombieFlag = true; stackHeightBonus 2.5 mm; CGB + DoubleBearing = topZombieConfig.

---

### [Case 951 — [SYSTEM] 4 Layer System (Plastics Generation)](./5%20case%20study.md#case-951)

**Category**: System — Plastics Gen 4-component architecture  
**Parts**: Bit Chip + AR + WD + BB; 4-layer stack  
**Key Physics**: h_CoM ≈ 2.15 cm; I_total ≈ 8.15×10⁻⁶ kg·m²; spinDecayRate = −τ/I. Wide WD 29% longer spin than Ten WD (annular vs tab mass distribution). Bit Chip at r≈0 → I contribution negligible; grants BeySpirit/special moves in anime only.  
**Engine Note**: fourLayerSystem(); comHeight 2.15 cm; wideWDSpinBonus 29% vs tenWD.

---

### [Case 952 — [SYSTEM] Spin Gear System (Plastics Generation)](./5%20case%20study.md#case-952)

**Category**: System — Plastics Gen 5-layer with SG  
**Parts**: BC + AR + WD + SG + BB; SG as 5th layer  
**Key Physics**: Bearing isolation: τ_tip = 3×10⁻⁶ N·m vs 5×10⁻⁵ for flat tip (16.7× friction reduction). SAR absorbs 20% of contact impulse (energy buffer). True 5-layer architecture from Dec 2000. SG shell decouples tip motion from spin axis on bearing-type SGs.  
**Engine Note**: spinGearSystem(); bearingIsolation 16.7×; sarAbsorptionFraction 0.20.

---

### [Case 953 — [SYSTEM] Magnacore System (Plastics Generation)](./5%20case%20study.md#case-953)

**Category**: System — Plastics Gen 6-layer with magnetic core  
**Parts**: BC + AR + WD + North/South SG + Magnecore + BB  
**Key Physics**: 6-layer stack; F_mag = 0.185 N at 3.0 cm separation; relativeForce(1.3 cm, 2.0 cm) = 0.179 (inverse-cube scaling); core at lower height than WD → stronger magnetic effect than WD-level centering.  
**Engine Note**: magnacoreSystem(); F_mag 0.185 N at 3.0 cm; magneticCenteringBonus vs plain SG.

---

### [Case 954 — [SYSTEM] Hard Metal System / HMS](./5%20case%20study.md#case-954)

**Category**: System — HMS monolithic architecture  
**Parts**: RC (monolithic, no SG clip) + WD + BB  
**Key Physics**: Scale factor k = 0.75; air drag ratio k³ = 0.422 (58% drag reduction vs plastics). Tip friction ratio 1/k = 1.333× higher per unit mass. Metal AR delivers 5.3× peak contact force vs plastic AR. No SG → RC is one-piece; simpler structure but no bearing isolation.  
**Engine Note**: hmsSystem(); k 0.75; airDragRatio 0.422; metalARForceMultiplier 5.3.

---

### [Case 955 — [SYSTEM] Metal System (MFB)](./5%20case%20study.md#case-955)

**Category**: System — Metal Fusion/Battle/Masters architecture  
**Parts**: Face Bolt + Clear Wheel + Metal Wheel + Track + Bottom  
**Key Physics**: Metal Wheel ≈ 89% of I_total; wheelMoI(2.8 cm, 2.2 cm, 6 mm) = 7.28×10⁻⁶ kg·m²; rubber flat dω/dt = 137.5 rad/s²; bearing bottom dω/dt = 0.375 rad/s².  
**Engine Note**: metalSystem(); wheelFraction 0.89 of I_total; rubberFlatDecay 137.5; bearingDecay 0.375 rad/s².

---

### [Case 956 — [SYSTEM] Engine Gear System (Plastics Gen)](./5%20case%20study.md#case-956)

**Category**: System — Plastics Gen EG with spring-wound mechanism  
**Parts**: AR + WD + EG (Standard/Turbo/Reverse) + BB; spring-wound gear  
**Key Physics**: Standard spring E = 60.8 J; Turbo E = 243 J (4.0× standard); Reverse: 2.5× impulse boost vs standard. Clutch types: first_clutch (fires once at launch), final_clutch (fires on near-stop), no_clutch (always-on spin), engine_stopper (blocks until threshold). [Anime override: special moves exceed all EG mechanical limits via BeySpirit.]  
**Engine Note**: engineGearSystem(); standardSpringE 60.8 J; turboMultiplier 4.0; reverseImpulse 2.5×; clutchTypes enum.

---

### [Case 957 — [SYSTEM] Hybrid Wheel System (HWS)](./5%20case%20study.md#case-957)

**Category**: System — HWS = Fusion Wheel + Energy Ring  
**Parts**: Face Bolt + Energy Ring + Fusion Wheel + Track + Bottom  
**Key Physics**: I_total = 6.41×10⁻⁶ kg·m² (−12% vs Metal System 7.28×10⁻⁶); ER contributes 30% of FW's I. FW protrusion +2 mm beyond ER → +10% smash effectiveness. Energy Ring clips onto Face Bolt slot, locks CW/FW co-rotation.  
**Engine Note**: hwsSystem(); I_HWS 6.41e-6 (−12% vs metalSystem); erFraction 0.30 of FW_I; fwProtrusionSmash +10%.

---

### [Case 958 — [SYSTEM] 4D System (MFB 4D era)](./5%20case%20study.md#case-958)

**Category**: System — 4D = Different Material, Divided Wheel, Dynamic Drive, Deep Custom  
**Parts**: Face Bolt + 4D CW + Metal Frame + Core + Track + Bottom  
**Key Physics**: PC Frame + Metal Frame + Core (3 sub-layers); F:D tip ω_transition ≈ 141 rad/s (high-ω μ = 0.60; low-ω μ = 0.05); 4D descriptor = four simultaneous physics improvements.  
**Engine Note**: fourDSystem(); fdTipTransitionOmega 141 rad/s; highOmegaMu 0.60; lowOmegaMu 0.05.

---

### [Case 959 — [SYSTEM] Burst System (Beyblade Burst)](./5%20case%20study.md#case-959)

**Category**: System — Burst 3-layer (Layer + Disc + Driver)  
**Parts**: Layer + Forge Disc + Performance Tip  
**Key Physics**: Disc = 71% of I_total; standard holdingTorque = 0.005 N·m; Dash Driver = 0.009 N·m (1.8× burst resistance); relativeSpin per contact ≈ 80.4 rad/s (vs standard ratchet).  
**Engine Note**: burstSystem(); discInertiaFraction 0.71; standardHoldingTorque 5e-3 N·m; dashTorque 9e-3 N·m.

---

### [Case 960 — [SYSTEM] Burst Subsystems (Cho-Z, DB, BX layers)](./5%20case%20study.md#case-960)

**Category**: System — 7 TT Burst subsystem tiers  
**Parts**: Dual Layer → Cho-Z → GT (God) → Sparking → DB → BU → BX  
**Key Physics**: Cho-Z 88% more burst resistant than Dual Layer (ratchet spring upgrade). Dash Driver compensates for Disc's high I reducing spin input. DB High/Low mode = contact-height selector (Low = DB Core top/Armor bottom = stable/defense; High = Armor top/DB Core bottom = taller/attack).  
**Engine Note**: burstSubsystems(); chozBurstResistance +88%; dashCompensation; dbHighLowMode enum.

---

### [Case 961 — [PART] CobaltDrake 4-60F (BX Blade + Ratchet + Bit)](./5%20case%20study.md#case-961)

**Category**: Part — BX assembled combo analysis  
**Parts**: CobaltDrake Blade (38 g); 4-60 Ratchet; Flat Bit  
**Key Physics**: I_blade = 1.127×10⁻⁵ kg·m²; contact angle 25° → smash = cos(25°)J = 0.906J, upper = sin(25°)J = 0.423J; Flat Bit μ = 0.55; xtremeDashTipSpeed = 0.80 m/s; 4-60 dead zone = 60° per tooth gap.  
**Engine Note**: cobaltDrakeBX(); I_blade 1.127e-5; contactAngle 25°; flatBitMu 0.55; xDashSpeed 0.80 m/s.

---

### [Case 962 — [PART] DranBuster 1-60A (BX Unique OWD)](./5%20case%20study.md#case-962)

**Category**: Part — BX assembled combo analysis (OWD / eccentric orbit)  
**Parts**: DranBuster Blade; 1-60 Ratchet (1 protrusion); Accel Bit (16 gears)  
**Key Physics**: 1-protrusion ratchet → 360° dead zone (one gap = full rotation before re-engage); OWD (Off-center Weight Distribution) drives eccentric orbit; 16 Accel Gears increase bottom contact area over standard Accel; effective for deflection-type KO orbits.  
**Engine Note**: dranBusterBX(); oneProtrusion360DegDeadZone; owdEccentricOrbit; 16accelGears.

---

### [Case 963 — [PART] DranBrave S6-60V (BX CX Custom Line)](./5%20case%20study.md#case-963)

**Category**: Part — BX CX assembled combo analysis (5-part Custom Blade)  
**Parts**: Lock Chip + Main Blade (Brave) + Assist Blade (×2); S6-60 Ratchet; Vortex Bit  
**Key Physics**: 5-part CX blade; Brave smooth upper attack: friction coupling 5.1%; Vortex Bit rightward spiral → outward force 0.052 N; 25% less spin drain vs Cyclone ratio; S6-60 dead zone = 60° (6 teeth).  
**Engine Note**: dranBraveCX(); cxBladeComponents 5; braveUpperAttackCoupling 5.1%; vortexOutwardForce 0.052 N; s660DegDeadZone 60.

---

### [Case 964 — [PART] Track 85 (MFB)](./5%20case%20study.md#case-964)

**Category**: Part — MFB Track (lowest standard height)  
**Parts**: Track 85 (0.85 cm height, 8.5 mm)  
**Key Physics**: scrapeAngle = arcsin((8.5+3−4)/23) = arcsin(7.5/23) ≈ 19.0°; CoM −4.8 mm vs 145 Track; lowest height in standard MFB range; maxTilt = arcsin(8.5/21.5) = 23.4°.  
**Engine Note**: track85(); scrapeAngle 19.0°; comDelta −4.8 mm vs 145; maxTilt 23.4°.

---

### [Case 965 — [PART] Track 90 (MFB)](./5%20case%20study.md#case-965)

**Category**: Part — MFB Track  
**Parts**: Track 90 (0.90 cm height, 9.0 mm)  
**Key Physics**: scrapeAngle ≈ 20.4°; CoM −4.4 mm vs 145 Track; maxTilt = arcsin(9.0/21.5) = 24.8°.  
**Engine Note**: track90(); scrapeAngle 20.4°; comDelta −4.4 mm vs 145; maxTilt 24.8°.

---

### [Case 966 — [PART] Track 100 (MFB)](./5%20case%20study.md#case-966)

**Category**: Part — MFB Track  
**Parts**: Track 100 (1.00 cm height, 10.0 mm)  
**Key Physics**: scrapeAngle ≈ 23.1°; CoM −3.6 mm vs 145 Track; maxTilt = arcsin(10.0/21.5) = 27.7°; preferred for aggressive attack (delta_h vs 145 defender = 4.5 mm tipping advantage).  
**Engine Note**: track100(); scrapeAngle 23.1°; comDelta −3.6 mm vs 145; maxTilt 27.7°.

---

### [Case 967 — [PART] Track 105 (MFB)](./5%20case%20study.md#case-967)

**Category**: Part — MFB Track  
**Parts**: Track 105 (1.05 cm height, 10.5 mm)  
**Key Physics**: scrapeAngle ≈ 24.4°; all metrics worse than Track 100 (higher than ideal attack height, lower than 145 stamina); last-resort option; maxTilt = 29.3°.  
**Engine Note**: track105(); scrapeAngle 24.4°; maxTilt 29.3°; noteLastResort.

---

### [Case 968 — [PART] AD145 Track (MFB)](./5%20case%20study.md#case-968)

**Category**: Part — MFB Track (OWD funnel type)  
**Parts**: AD145 (2.8 g OWD; h = 1.45 cm)  
**Key Physics**: I_AD145 = 4.73×10⁻⁷ kg·m² (7.4× plain 145); +6.5% spin time vs 145; role: Stamina/Defense; OWD funnel redirects lateral impacts into a centering reaction, providing passive LAD.  
**Engine Note**: ad145Track(); I 4.73e-7 (7.4× plain); spinTimeBonus 6.5%; owdFunnelLAD.

---

### [Case 969 — [PART] DF145 Track (MFB)](./5%20case%20study.md#case-969)

**Category**: Part — MFB Track (downforce wing type)  
**Parts**: DF145 (1.5 g; h = 1.45 cm)  
**Key Physics**: Downforce 7.2×10⁻⁵ N (negligible at match spin rates); I ≈ 9.4×10⁻⁸ kg·m² (lowest of all 145-height variants); outclassed by AD145 for stamina, outclassed by plain 145 for simplicity.  
**Engine Note**: df145Track(); downforce 7.2e-5 N negligible; I 9.4e-8; outclassed.

---

### [Case 970 — [PART] SW145 Track (MFB)](./5%20case%20study.md#case-970)

**Category**: Part — MFB Track (wing type; rigid 100% recoil)  
**Parts**: SW145 (4.2 g; h = 1.45 cm; rigid fixed wings)  
**Key Physics**: Highest I of any 145-height track: I = 1.214×10⁻⁶ kg·m²; rigid wings → 100% recoil on impact (wings act as solid paddles); attack/defense wing orientation reversal possible. High I aids stamina but recoil counters that benefit under attack.  
**Engine Note**: sw145Track(); I 1.214e-6 (highest 145-class); rigidWings100PctRecoil; wingReversal.

---

### [Case 971 — [PART] WD145 Track (MFB)](./5%20case%20study.md#case-971)

**Category**: Part — MFB Track (wing type; spin-trap coupling)  
**Parts**: WD145 (3.6 g; h = 1.45 cm; fixed wings)  
**Key Physics**: Fixed wings create trap coupling on opponent contact: ΔKE = 0.0288 J (18% of spin KE at ω_A = 300, ω_D = 180 rad/s); wings act as spin-steal amplifiers. Less I than SW145 but coupling mechanism adds offensive utility.  
**Engine Note**: wd145Track(); spinTrapCoupling ΔKE 0.0288 J; 18% spinKE fraction; fixedWings.

---

### [Case 972 — [PART] E230 Track (MFB)](./5%20case%20study.md#case-972)

**Category**: Part — MFB Track (free-sliding disc, height-variable)  
**Parts**: E230 (7.4 g; free-sliding inner disc; Normal pos 6 mm, Boost 8 mm)  
**Key Physics**: r_disc = 2.4 cm; free-sliding disc amplifies ground contact torque under centrifugal force; GCF required for Boost mode; height-variable (6 vs 8 mm effective contact) changes CoM and tilt resistance; highest mass of any non-combo track.  
**Engine Note**: e230Track(); freeSliddingDisc; rDisc 2.4 cm; normalPos 6 mm; boostPos 8 mm; gcfRequired.

---

### [Case 973 — [PART] SP230 Track (MFB)](./5%20case%20study.md#case-973)

**Category**: Part — MFB Track (fixed spike type, tilt-activation)  
**Parts**: SP230 (est. 4.8 g; fixed spikes r = 2.7 cm; h = 2.30 cm)  
**Key Physics**: Fixed spikes extend to r = 2.7 cm; tilt-activation at θ ≈ 17° → spikes ground-contact → increased friction circle; spin-rate-independent activation (pure geometry, not centrifugal). No free-sliding — simpler than E230 but fewer tuning options.  
**Engine Note**: sp230Track(); fixedSpikes r 2.7 cm; tiltActivation 17°; spinRateIndependent.

---

### [Case 974 — [PART] F230 Track (MFB bearing type)](./5%20case%20study.md#case-974)

**Category**: Part — MFB Track (ball-bearing decoupled; LAD specialist)  
**Parts**: F230 (4.6 g; ball-bearing decoupling; h = 2.30 cm)  
**Key Physics**: Ball-bearing decouples outer disc rotation from main spin axis; with rigid Track: LAD decay = 187 rad/s² → t_stop = 1.07 s; F230 bearing-decoupled air-drag only ≈ 2000–2500× slower decay vs rigid. Premier precession-stabilizer for Zombie configurations.  
**Engine Note**: f230Track(); bearingDecoupled; ladDecayRigid 187 rad/s²; bearingDecayFactor 2000–2500×.

---

### [Case 975 — [PART] TB (Twin Ball) Bottom (MFB)](./5%20case%20study.md#case-975)

**Category**: Part — MFB Bottom (spherical dome LAD specialist)  
**Parts**: TB (r_ball = 0.2 cm; r_dome = 0.9 cm; r_skirt = 1.3 cm)  
**Key Physics**: 3-regime contact: 0–15° ball only; 15–50° dome rolling (r_contact = r_dome×sin θ); 50–80° full dome; >80° skirt stop. Stability ratio R_TB = μ×r_dome/h_CoM = 0.0675 constant (θ-independent) vs flat-rim R drops 73% from 15°→70°. maxStableTilt 78–80° (vs WB/D ≈ 35–45°). Opposite-spin vulnerability: Hertzian contact area only 0.045 mm² vs WD annulus 25 mm² (550× less spin-steal coupling).  
**Engine Note**: tbBottom(); rDome 0.9 cm; stabilityRatioConstant 0.0675; maxStableTilt 80°; spinStealVulnerable (550× less area vs WD).

---

### [Case 976 — [PART] Storm Metal Wheel (MFB)](./5%20case%20study.md#case-976)

**Category**: Part — MFB Metal Wheel (attack archetype)  
**Parts**: Storm (28.5 g; r_outer 2.2 cm; 4 swept-back wings; φ = 40°)  
**Key Physics**: J_smash = cos(40°)J = 0.766J; J_recoil = sin(40°)J = 0.643J; spin loss per contact = 16.6 rad/s (at J = 0.01 N·s); contactFrequency 4× orbital = 255/s theoretical; netAttackAdvantage 1.19 (19% more damage to opponent vs self per contact). I ≈ 7.41×10⁻⁶ kg·m² (annular); tip-corrected ≈ 1.13×10⁻⁵.  
**Engine Note**: stormWheel(); phi 40°; smashFraction 0.766; recoilFraction 0.643; spinLossPerContact 16.6 rad/s.

---

### [Case 977 — [PART] Rock Metal Wheel (MFB)](./5%20case%20study.md#case-977)

**Category**: Part — MFB Metal Wheel (defense archetype)  
**Parts**: Rock (28.0 g; r_outer 2.2 cm; 6 rounded protrusions; φ ≈ 7°)  
**Key Physics**: J_recoil = sin(7°)J = 0.122J (5.3× less than Storm); 6-fold MoI asymmetry index σ_I/I_mean ≈ 2–3%; defenseSpinRetention: 3.13 rad/s loss per contact (vs Storm 16.6); I = 7.28×10⁻⁶ kg·m².  
**Engine Note**: rockWheel(); phi 7°; recoilFraction 0.122; recoilVsStorm 5.3×; I 7.28e-6.

---

### [Case 978 — [PART] Lightning Metal Wheel (L-Drago; MFB)](./5%20case%20study.md#case-978)

**Category**: Part — MFB Metal Wheel (left-spin / spin-steal)  
**Parts**: Lightning (28.0 g; left-spin; 3 blades; φ_blade = 35°; upper attack 15°)  
**Key Physics**: v_relative = r×(ω_L + ω_R) = 35.2 m/s (opposite spin; far higher than same-spin ~0.44 m/s); spinStealTorque = sin(35°)J = 0.574J (positive for L-Drago); Hertz contact time 5–7× shorter at opposite spin (partially offsets steal). Upper attack vertical: sin(15°)J = 0.259J.  
**Engine Note**: lightningWheel(); leftSpin; phi 35°; spinStealPositive; relativeVelocityOpposite 35.2 m/s; upperAttack15deg.

---

### [Case 979 — [PART] Flame Metal Wheel (MFB)](./5%20case%20study.md#case-979)

**Category**: Part — MFB Metal Wheel (stamina archetype; first series)  
**Parts**: Flame (29.0 g; r_mean 2.1 cm; Fourier profile A₁ = 1.5 mm 3-fold, A₂ = 0.7 mm 6-fold)  
**Key Physics**: φ_avg ≈ 5°; J_recoil = sin(5°)J = 0.087J (7.4× less than Storm); aero drag −10–15% vs attack wheels; I = 6.92×10⁻⁶ kg·m²; stamina advantage from recoil minimisation not I.  
**Engine Note**: flameWheel(); phi_avg 5°; recoilFraction 0.087; aeroDragSaving 10–15% vs attack.

---

### [Case 980 — [PART] Burn Metal Wheel (MFB)](./5%20case%20study.md#case-980)

**Category**: Part — MFB Metal Wheel (stamina benchmark; first series)  
**Parts**: Burn (29.5 g; r_mean 2.15 cm; A_max = 0.8 mm 6-fold)  
**Key Physics**: φ_avg ≈ 2.5°; J_recoil = 0.044J (14.6× less than Storm; 2.0× less than Flame); spinRetention per contact 95.6%; I = 7.34×10⁻⁶ kg·m²; after 10 hits Burn retains ~4.6% more spin than Flame.  
**Engine Note**: burnWheel(); phi_avg 2.5°; recoilFraction 0.044; spinRetention 0.956; I 7.34e-6.

---

### [Case 981 — [PART] Earth Metal Wheel (MFB)](./5%20case%20study.md#case-981)

**Category**: Part — MFB Metal Wheel (stamina-defense crossover; first series)  
**Parts**: Earth (30.0 g; r_outer 2.2 cm; φ ≈ 1.3°; 2-fold nearly oval)  
**Key Physics**: I = 7.80×10⁻⁶ kg·m² (highest first-series); φ_avg ≈ 1.3° → J_recoil = 0.023J; retains 97.7% spin per contact; m_eff = I/r² = 16.1 g (matches typical attacker → near-dead-stop collision); decays 5.9% slower than Burn from I advantage alone.  
**Engine Note**: earthWheel(); phi_avg 1.3°; I 7.80e-6; mEff 16.1 g; spinRetention 0.977.

---

### [Case 982 — [PART] L Drago Metal Wheel (MFB; left-spin destabiliser)](./5%20case%20study.md#case-982)

**Category**: Part — MFB Metal Wheel (left-spin; ramp destabilisation)  
**Parts**: L Drago (32 g; 3 dragon-head ramp units; ψ = 25° from horizontal; left-spin)  
**Key Physics**: J_radial = cos(25°)J = 0.906J; J_vertical = sin(25°)J = 0.423J → toppling τ = 0.042 N·m per contact; left-spin mechanically required (ramp must face incoming contact direction). Weight ceiling problem: at 32 g insufficient to survive heavy-combo smash before accumulating enough destabilisation contacts.  
**Engine Note**: lDragoWheel(); leftSpin; rampAngle 25°; topplingTorque 0.042 N·m; weightCeilingLimitation.

---

### [Case 983 — [PART] Leone Metal Wheel (MFB)](./5%20case%20study.md#case-983)

**Category**: Part — MFB Metal Wheel (recoil attacker in defense silhouette)  
**Parts**: Leone (38.0 g; r_outer 2.179 cm; h 0.897 cm; 3 clusters × 6 blocks; φ ≈ 20°)  
**Key Physics**: J_smash = 0.940J; J_recoil = 0.342J (2.8× Rock); recoil propels Leone away after contact; RF re-engages; m_eff = 20.4 g; I = 9.71×10⁻⁶ kg·m²; recoilVelocity = 0.89 m/s per approach at 2 m/s.  
**Engine Note**: leoneWheel(); phi 20°; recoilFraction 0.342; recoilVsRock 2.8×; I 9.71e-6.

---

### [Case 984 — [PART] Libra Metal Wheel (MFB; 3-mold evolution)](./5%20case%20study.md#case-984)

**Category**: Part — MFB Metal Wheel (defense/stamina ceiling; pre-Basalt era)  
**Parts**: Libra (40.5 g; r_outer 2.3 cm; outer ring r 1.8–2.3 cm; micro-notch perimeter; 3 molds)  
**Key Physics**: I_Libra = 1.36×10⁻⁵ kg·m² (74% above Earth); decays at 57% of Earth rate; φ_avg ≈ 8.8°; J_recoil = 0.153J; 2.59 rad/s loss per contact vs Earth 0.65 rad/s. Mold 1 fracture: K_t = 3, σ_local = 20 MPa → near fatigue limit (60 MPa) with cycling. Mold 2: spoke thickened → A_spoke +50% → σ drops safe. Mold 3 WBBA legal.  
**Engine Note**: libraWheel(); I 1.36e-5; phi_avg 8.8°; moldFractureK_t 3.0; mold2SpokeReinforced.

---

### [Case 985 — [PART] Pegasis Metal Wheel (MFB)](./5%20case%20study.md#case-985)

**Category**: Part — MFB Metal Wheel (smash attack; ridge-contact specialist)  
**Parts**: Pegasis (36.0 g; r_outer 2.22 cm; h 1.216 cm; 3 wings; φ = 35°; 2 ridges/wing)  
**Key Physics**: J_smash = cos(35°)J = 0.819J (vs Storm 0.766); J_recoil = 0.574J; ridge Hertz contact pressure ≈ 28 MPa (vs ~2 MPa flat face); upperAttack at tip: sin(41.2°)J = 0.659J. Breakage: original root σ_bending = 561 MPa (>270 MPa yield); redesign to Z_section +150% → 224 MPa safe. I ≈ 1.14×10⁻⁵ kg·m².  
**Engine Note**: pegasisWheel(); phi 35°; ridgePressure 28 MPa; rootStressOriginal 561 MPa; I 1.14e-5.

---

### [Case 986 — [PART] Pisces Metal Wheel (MFB)](./5%20case%20study.md#case-986)

**Category**: Part — MFB Metal Wheel (failed hybrid; stamina/defense neither)  
**Parts**: Pisces (35.4 g; 2 shark arms; r_CoM_arm 1.65 cm; φ_head 17°; φ_body 4°)  
**Key Physics**: φ_eff ≈ 5.1°; J_recoil = 0.089J (3.9× Earth); I = 9.01×10⁻⁶ (15.5% above Earth); after 20 contacts Pisces retains ~83% vs Earth ~95%. Gap-catch inner wall φ ≈ 37° → J_recoil = 0.601J (worst case). m_eff = 18.6 g vs Basalt 47.2 g → bounces back at 43.5% approach speed.  
**Engine Note**: piscesWheel(); phi_eff 5.1°; I 9.01e-6; gapCatchRecoil 0.601J; outclassedByEarth.

---

### [Case 987 — [PART] Sagittario Metal Wheel (MFB)](./5%20case%20study.md#case-987)

**Category**: Part — MFB Metal Wheel (smash-stamina hybrid; burst contact)  
**Parts**: Sagittario (est. 31 g; 2 crescents; φ_end = 27°; φ_body = 3.5°)  
**Key Physics**: φ_eff ≈ 4.4°; crescentEnd smash = 0.891J (high per hit); spinLoss burst at crescent end = 5.8× average (periodic burst loss event); gap-catch inner wall φ ≈ 40° → 0.643J recoil. Average near-zero but single high-loss events dominate long matches.  
**Engine Note**: sagittarioWheel(); phi_eff 4.4°; burstRatio 5.8× avg; crescentEndSmash 0.891J.

---

### [Case 988 — [PART] Virgo Metal Wheel (MFB; mold imbalance)](./5%20case%20study.md#case-988)

**Category**: Part — MFB Metal Wheel (stamina; mold-dependent performance)  
**Parts**: Virgo (37.0 g; 2 spiral arms; r_CoM_arm 1.85 cm; φ_avg ≈ 1.3°)  
**Key Physics**: I ≈ 1.19×10⁻⁵ kg·m² (good mold); bad mold Δr ≈ 0.25 mm → imbalance dω/dt = 579 rad/s² at ω = 200 rad/s (vs tip friction 9.1 rad/s²); ω_crossover ≈ 25.2 rad/s; good mold Δr < 0.05 mm → negligible. 3 min vs 5 min spin time difference = ~0.5 g arm mass error (2.9% manufacturing variation).  
**Engine Note**: virgoWheel(); I 1.19e-5; badMoldImbalance 579 rad/s²; crossoverOmega 25.2; goodVsBadMoldSpinTime 3vs5min.

---

### [Case 989 — [PART] Leone Clear Wheel (MFB)](./5%20case%20study.md#case-989)

**Category**: Part — MFB Clear Wheel (zero-recoil cap layer)  
**Parts**: Leone CW (3.0 g; r_outer 1.9 cm; circular profile; φ ≈ 0.5°)  
**Key Physics**: I_CW = 5.79×10⁻⁷ kg·m² (7.95% of Leone Metal Wheel I); +8% spin decay improvement with CW present; CoM shift +0.525 mm → −2.7% precession onset ω. 4D variant: m = 5 g → I_4D = 9.65×10⁻⁷ (13% of FW I); metal powder ~5% vol fraction; cosmetic sparkle only (unchanged contact properties).  
**Engine Note**: leoneCW(); I 5.79e-7; iContribFraction 0.0795; comShift 0.525 mm; 4dVariantI 9.65e-7.

---

### [Case 990 — [PART] Nemesis 4D Clear Wheel (MFB)](./5%20case%20study.md#case-990)

**Category**: Part — MFB 4D Clear Wheel (composite; design asymmetry)  
**Parts**: Nemesis 4D CW (3.23 g; two-half composite: Cygnus feather + Uranus whisker; φ_avg ≈ 8.5°)  
**Key Physics**: Metal powder ~4.9% vol fraction (ΔI = 4.44×10⁻⁸ kg·m²); I = 6.23×10⁻⁷ (5.66% of Diablo FW); design asymmetry Δr_CW ≈ 0.303 mm → combo imbalance 0.024 mm; τ_imbalance/τ_tip ≈ 6.6× at ω = 200; ω_crossover ≈ 77.5 rad/s; J_recoil at CW height = 0.148J (16× Leone CW).  
**Engine Note**: nemesisCW4D(); metalPowderFraction 4.9%; I 6.23e-7; designAsymmetry 0.024 mm combo; cwRecoil 16× leoneRef.

---

### [Case 991 — [PART] VariAres 4D Metal Wheel (MFB; centrifugal mode-switch)](./5%20case%20study.md#case-991)

**Category**: Part — MFB 4D Metal Wheel (centrifugal Attack/Defense mode)  
**Parts**: VariAres (43.6 g; r_outer_tip 2.5 cm; 3 wings + PC Frame; ω_c ≈ 120 rad/s)  
**Key Physics**: Attack Mode (ω > 120 rad/s): PC Frame retracted; φ_tip = 17° → smash 0.956J; Defense Mode: PC Frame extended; φ_eff = 28°; impulse attenuation factor 0.76 (ε_PC/ε_metal). Attack duration ≈ 7.5 s from launch. Bilateral spin: abrupt tip geometry keeps φ equal for L and R approach. I = 1.26×10⁻⁵ kg·m².  
**Engine Note**: variAres4D(); omegaC 120 rad/s; attackModeDuration 7.5 s; pcFrameAttenuation 0.76; I 1.26e-5.

---

### [Case 992 — [PART] D:D (Delta Drive) Bottom (MFB; 3-tip selector)](./5%20case%20study.md#case-992)

**Category**: Part — MFB Bottom (3-mode manual pre-battle selector)  
**Parts**: D:D (5.5 g; Sharp h 2.119 cm / Wide Ball h 2.089 cm / Flat h 2.025 cm; Δh = 0.94 mm)  
**Key Physics**: S: τ = 3.24×10⁻⁵ N·m; dω/dt = 2.51 rad/s². WB: dω/dt = 7.2 rad/s² (5× CS due to no bearing). F: τ = 1.51×10⁻³ N·m; dω/dt = 117 rad/s². RF delivers 3.2× higher torque than D:D F mode. CoM height gradient 0.94 mm (secondary effect). Each mode outclassed by dedicated alternative (S < WD; WB < CS; F < RF).  
**Engine Note**: ddBottom(); sharpDecay 2.51 rad/s²; wbDecay 7.2 rad/s²; flatDecay 117 rad/s²; rfMultiple 3.2×.

---

### [Case 993 — [PART] Horogium Clear Wheel (MFB; clock-motif asymmetry)](./5%20case%20study.md#case-993)

**Category**: Part — MFB Clear Wheel (gear-tooth perimeter; imbalance source)  
**Parts**: Horogium CW (2.71 g; r_outer 1.9 cm; ~34 gear teeth; III-sector gap; clock-hand protrusions)  
**Key Physics**: III-gap removes ~0.107 g at r = 1.7 cm → Δr_CW = 0.67 mm; diluted to combo: Δr_combo ≈ 0.034 mm (residual wobble bias). Gear tooth drag: +29% aero drag vs smooth ring (A_teeth/A_smooth ratio). Clock-hand protrusions partially offset III-gap but asymmetric length → net imbalance persists. Unsuitable for stamina/defense.  
**Engine Note**: horogiumCW(); iiiGapImbalance 0.034 mm combo; toothDragIncrease 29%; stamina unsuitable.

---

### [Case 994 — [PART] Basalt Metal Wheel (MFB; maximum-weight defense)](./5%20case%20study.md#case-994)

**Category**: Part — MFB Metal Wheel (heaviest single-layer; Staircase of Death)  
**Parts**: Basalt (47.52 g; r_outer 2.2 cm; 11.0 mm height; 2.0 mm overhang; 64 knurling teeth; 5 spokes)  
**Key Physics**: I_Basalt = 1.38×10⁻⁵ kg·m² (21% above Libra); Staircase of Death: ~1.03 g missing at r_centroid 1.85 cm → Δr = 0.401 mm → ω_cross = 78 rad/s (orbital onset); imbalance force at launch 0.922 N (1.98× static weight). Knurling: spin-transfer fraction = 1.0/2.2 = 0.45 (55% reduction vs smooth). Overhang +2.3% moment arm; vertical step destabilises opponent.  
**Engine Note**: basaltWheel(); I 1.38e-5; staircaseDeltaR 0.401 mm; orbitalOnset 78 rad/s; knurledSpinTransfer 0.45.

---

### [Case 995 — [PART] 145 Track (MFB)](./5%20case%20study.md#case-995)

**Category**: Part — MFB Track (tallest standard; stamina specialist)  
**Parts**: 145 Track (1.47 g; h = 1.45 cm; full width 2.0 cm; min width 1.8 cm)  
**Key Physics**: maxTilt = arcsin(14.5/21.5) = 42.4° (vs 105 at 29.3°, 90 at 24.8°); precessionRate = 12.4 rad/s at ω = 60 rad/s (Basalt combo); precession circle r = 7.3 mm at 20° tilt. BD145 outclasses via rubber ball energy absorption (ε_BD145 ≈ 0.55 vs 0.90 hard plastic) + compliance + height equivalence.  
**Engine Note**: track145(); maxTilt 42.4°; precessRate 12.4 rad/s at 60 rad/s spin; bdOutclasses via energy absorption.

---

### [Case 996 — [PART] WD (Wide Defense) Bottom (MFB)](./5%20case%20study.md#case-996)

**Category**: Part — MFB Bottom (annular contact; LAD reference standard)  
**Parts**: WD (0.7 g; r_contact 0.709 cm; r_full 0.777 cm; 40° bevel; h 0.892 cm)  
**Key Physics**: τ = μ×N×r_eff = 4.32×10⁻⁴ N·m; dω/dt = 30.6 rad/s² (Basalt combo); maxFlatTilt 17° then bevel engages; bevel τ = 4.67×10⁻⁴ N·m (slightly higher); LAD restoring fraction = 8.7% of lateral impact; weak-shot technique reaches precession at 2.7 s vs 5.2 s normal.  
**Engine Note**: wdBottom(); rEff 0.55 cm; decayRate 30.6 rad/s²; ladRestoringFraction 8.7%; weakShotPrecessionEntry 2.7 s.

---

### [Case 997 — [PART] Aquila Clear Wheel (MFB; Earth-keyed)](./5%20case%20study.md#case-997)

**Category**: Part — MFB Clear Wheel (two-fold; Earth-notch fit geometry)  
**Parts**: Aquila CW (2.9 g; 2 horseshoe arcs ~80° each + 2 spikes ~15°; r_wing 2.0 cm)  
**Key Physics**: Principal moment anisotropy: I_A = 2.93×10⁻⁷ vs I_B ≈ 5.7×10⁻⁸ kg·m²; ΔI drives nutation at 2ω (amplitude sub-visible at 1–2% of I_combo). Earth exposure: 47% open gap exposes Earth Metal Wheel to direct contact. Spike locked to Earth inner notch → zero CW–MW slip → full impulse transmitted (no energy lost to relative rotation).  
**Engine Note**: aquilaCW(); principalAnisotropyDeltaI 2.4e-7; earthGapExposure 47%; spikeLockZeroSlip.

---

### [Case 998 — [PART] Earth Metal Wheel (MFB; two-mold analysis)](./5%20case%20study.md#case-998)

**Category**: Part — MFB Metal Wheel (near-circular defense; Basalt successor gap)  
**Parts**: Earth (30.8 g mold1 / 33.0 g mold2; r_outer 2.25 cm; 4 wings 2 mm gaps; 12° declination)  
**Key Physics**: I mold1 = 9.07×10⁻⁶; mold2 = 9.50×10⁻⁶ (4.7% increase); solid fraction 93.6%; φ ≈ 5.1°; recoilRatio 0.089; declination 12° → transient grounding 3.5× static weight on impact; mold1 root σ = 69 MPa > 60 MPa fatigue limit → fracture; mold2: Z_section +56%, K_t 4.5 → 28 MPa safe. Basalt I/Earth ratio = 1.45 → outclassed.  
**Engine Note**: earthMetal(); I_mold1 9.07e-6; I_mold2 9.50e-6; recoilRatio 0.089; mold1FractureRoot; mold2Safe; basaltOutclasses 45%.

---

### [Case 999 — [PART] Unicorno II 4D Clear Wheel (MFB)](./5%20case%20study.md#case-999)

**Category**: Part — MFB 4D Clear Wheel (three-fold isotropic; iron powder)  
**Parts**: Unicorno II 4D CW (3.27 g; C₃ symmetry; 3 horn protrusions @120°; h wider/taller than standard)  
**Key Physics**: Iron powder fraction 1.5–3.3% vol; I = 6.23×10⁻⁷ kg·m²; C₃ symmetry → ΔI = 0 (no nutation forcing, vs C₂ Aquila ~25% delta_I); CoM height shift +0.074 mm (negligible). Premier Clear Wheel for rotational stability in any combo requiring 3-fold or universal geometry.  
**Engine Note**: unicornoIICW(); ironPowderFraction 1.5–3.3%; C3isotropy deltaI = 0; comShift 0.074 mm.

---

### [Case 1000 — [PART] Blitz 4D Metal Wheel (MFB; two-piece composite)](./5%20case%20study.md#case-1000)

**Category**: Part — MFB 4D Metal Wheel (two-piece; Assault/Barrage mode; slope-bump)  
**Parts**: Blitz (43.72 g total = Core 31.07 g + Metal Frame 12.65 g; Assault 3 wings ~87° / Barrage 6 wings ~42°)  
**Key Physics**: I_Blitz = 1.18×10⁻⁵ kg·m² (Core 6.65×10⁻⁶ + Frame 5.11×10⁻⁶); Assault recoilRatio = tan(30°) = 0.577; Barrage = tan(40°) = 0.839 (45% more recoil). Slope-bump: F_peak = 11.97 N vs flat 7.5 N (60% higher). L-spin weakness: concave wing backface reverses J_smash sign → L-spin attacker gains momentum. Full combo I ≈ 1.20×10⁻⁵.  
**Engine Note**: blitz4D(); I 1.18e-5; assaultRecoil 0.577; barrageRecoil 0.839; bumpPeakForce 11.97 N; lSpinWeakness.

---


### [Case 1001 — [PART] Winning Valkyrie Energy Layer (Burst Standard)](./9%20case%20study.md#case-1001)

**Category**: Part — Burst Energy Layer (Standard; C3 smash attack)
**Parts**: Winning Valkyrie (15.2 g; C3; 2 PC tabs; L 5.0 mm, b 3.0 mm, h 0.55 mm; phi = 22 deg)
**Key Physics**: k_tab = 2.40e3 N/m; tau_burst = 10.8 mN·m; smash cos(22) = 0.927; recoil sin(22) = 0.375. I_L = 2.318e-6; I_total(WV.12.V) = 4.018e-6 kg·m2; dw/dt = -7.08 rad/s2; L0 = 2.411e-3 kg·m2/s. Disc (12, 15.8 g) contributes 41.7% of assembly I — disc dominance pattern established across Burst era.
**Engine Note**: winningValkyrie(); k_tab 2400; tau_burst 10.8 mN·m; phi 22 deg; I_L 2.318e-6; I_total 4.018e-6; L0 2.411e-3.

---

### [Case 1002 — [PART] Xtreme Performance Tip (Burst Standard)](./9%20case%20study.md#case-1002)

**Category**: Part — Burst Driver (rubber annulus; aggressive orbit)
**Parts**: Xtreme tip (r_void 0.20 cm, r_ring 0.40 cm; mu_k = 0.85 rubber)
**Key Physics**: Annular contact r_eff = 0.311 cm (+16.6% vs solid contact); tau = 8.84e-4 N·m; dw/dt = -220 rad/s2 (31.1x Velocity tip). Flower orbit: R = 3.0 cm at 0.5 m/s. Extremely aggressive spin consumption; pairs with high-I attack layers only.
**Engine Note**: xtremeDriver(); rEff 0.311 cm; mu 0.85; dOmega -220 rad/s2; flowerOrbitR 3.0 cm; 31x_velocity.

---

### [Case 1003 — [PART] Xeno Xcalibur Energy Layer (Burst Standard; C1 mold fracture)](./9%20case%20study.md#case-1003)

**Category**: Part — Burst Energy Layer (C1 asymmetric; sword; fracture history)
**Parts**: Xeno Xcalibur (9.3 g; C1; single sword; delta_max = 0.45 mm; phi = 18 deg)
**Key Physics**: tau_burst = 16.2 mN·m (+50% vs WV). Eccentricity e = 3.31 mm; F_imbalance = 11.1 N at 600 rad/s. Mold 1 (h = 1.6 mm): sigma = 104 MPa, SF = 0.385 — FRACTURES. Mold 2 (h = 2.5 mm): sigma = 42.7 MPa, SF = 0.937 — survives. smash = cos(18) = 0.951; I_L = 2.325e-6; I_total = 4.013e-6; L0 = 2.41e-3.
**Engine Note**: xenoXcalibur(); mold1FractureH 1.6mm SF 0.385; mold2Safe H 2.5mm; tau_burst 16.2 mN·m; e 3.31 mm; F_imb 11.1 N.

---

### [Case 1004 — [PART] Magnum Forge Disc (Burst Standard; Xcalibur alignment)](./9%20case%20study.md#case-1004)

**Category**: Part — Burst Forge Disc (bi-material; sword alignment mechanism)
**Parts**: Magnum (19.2 g = 14.5 g metal centre r 0.3-1.0 cm + 4.7 g plastic perimeter r 1.0-1.6 cm)
**Key Physics**: I_Magnum = 1.627e-6 kg·m2; 65.3% inertia efficiency vs all-metal same mass. 2-click XC sword alignment: click 1 = attack alignment (max eccentricity), click 2 = balance alignment (reduced eccentricity). Pairs only with C1 XC layers.
**Engine Note**: magnumDisc(); I 1.627e-6; inertiaEfficiency 65.3%; twoClickAlignment; forXConly.

---

### [Case 1005 — [PART] Impact Performance Tip (Burst Standard; erratic rubber star)](./9%20case%20study.md#case-1005)

**Category**: Part — Burst Driver (mixed rubber-plastic; erratic; unsuitable)
**Parts**: Impact tip (C3 rubber star; f_R = 0.333; f_P = 0.667; mu_eff = 0.396)
**Key Physics**: CV = 80.9% (high variance = erratic orbit). dw/dt = -100 rad/s2 (14x Velocity; 2.22x slower than Xtreme). Unsuitable for any competitive combo: too slow for rubber attack, too erratic for stamina.
**Engine Note**: impactDriver(); mu_eff 0.396; CV 80.9%; dOmega -100 rad/s2; unsuitableAllCombos.

---

### [Case 1006 — [PART] Sieg Xcalibur Energy Layer (Burst Standard; metal sword)](./9%20case%20study.md#case-1006)

**Category**: Part — Burst Energy Layer (C1; metal sword; hilt-gap fatigue)
**Parts**: Sieg Xcalibur (15.9 g; metal sword 5.0 g; e = 5.66 mm)
**Key Physics**: I_body = 2.725e-6; I_sw = 1.620e-6; I_L = 4.345e-6 kg·m2; F_imbalance = 32.3 N at 600 rad/s. Hilt-gap fatigue: sigma_max = 20.2 MPa > ABS cyclic endurance 16 MPa -> progressive denting. tau_burst = 16.2 mN·m; I_total(Sieg.1.Iron) = 7.978e-6; 49.7% more burst resistant than WV from inertia alone. L0 = 4.787e-3 kg·m2/s (1.99x WV).
**Engine Note**: siegXcalibur(); metalSword 5.0 g; I_L 4.345e-6; hiltFatigue sigma 20.2 MPa; tau_burst 16.2 mN·m; L0 4.787e-3.

---

### [Case 1007 — [PART] Forge Disc 1 (Burst Standard; C1 asymmetric; attack alignment)](./9%20case%20study.md#case-1007)

**Category**: Part — Burst Forge Disc (C1 elliptical; intentional eccentricity)
**Parts**: Disc 1 (21.2 g; elliptical C1; e_disc = 2.77 mm; r_i 0.4 cm, r_o 1.7 cm)
**Key Physics**: Attack alignment: e_combined = 3.40 mm, F = 53.6 N at 600 rad/s. Balance alignment: e = 0.714 mm, F = 11.2 N (79% reduction). I = 3.231e-6 (40.5% of Sieg assembly). Disc C1 eccentricity amplifies or cancels layer C1 depending on assembly orientation.
**Engine Note**: disc1(); e_disc 2.77 mm; attackAlignmentF 53.6 N; balanceAlignmentF 11.2 N; I 3.231e-6; alignmentCritical.

---

### [Case 1008 — [PART] Iron Performance Tip (Burst Standard; metal flat; banking orbit)](./9%20case%20study.md#case-1008)

**Category**: Part — Burst Driver (metal flat; weak spring; no flower pattern)
**Parts**: Iron tip (6.7 g; metal flat; mu_k = 0.12 steel-ABS; r_eff = 0.233 cm)
**Key Physics**: tau = 1.201e-4 N·m; dw/dt = -15.8 rad/s2. Weak spring k = 1800 N/m -> tau_lock = 9.45 mN·m (below Sieg tau_burst 16.2 mN·m -> burst risk). Banking orbit R = 2.12 m (no flower pattern). Metal tip preserves assembly I advantage.
**Engine Note**: ironDriver(); mu 0.12; dOmega -15.8 rad/s2; lockTorque 9.45 mN·m; burstRisk vs Sieg; bankingOrbitR 2.12 m.

---

### [Case 1009 — [PART] Buster Xcalibur Energy Layer (Burst Standard; bistable centrifugal)](./9%20case%20study.md#case-1009)

**Category**: Part — Burst Energy Layer (C1; bistable; always-Buster at launch)
**Parts**: Buster Xcalibur (19.6 g; bistable centrifugal; m_sword = 7.0 g; F_lock = 2.50 N)
**Key Physics**: omega_crit = 140.9 rad/s — below launch speed -> always in Buster Mode. e_normal = 6.43 mm, e_buster = 7.86 mm; I_L_buster = 6.538e-6 (+20.7% vs Normal). F_imbalance = 55.4 N at launch. phi = 22 deg; opposite-spin non-viable. I_total = 9.576e-6 kg·m2; L0 = 5.746e-3 kg·m2/s.
**Engine Note**: busterXcalibur(); alwaysBusterMode; e_buster 7.86 mm; I_L 6.538e-6; F_imb 55.4 N; I_total 9.576e-6; L0 5.746e-3.

---

### [Case 1010 — [PART] Core Disc 1' (Burst Standard Dash; bilateral fill)](./9%20case%20study.md#case-1010)

**Category**: Part — Burst Forge Disc (Dash variant; bilateral fill; reduced eccentricity)
**Parts**: Core Disc 1' (22.5 g; bilateral fill; e_1' = 1.24 mm; -55.2% vs Disc 1)
**Key Physics**: I = 3.431e-6 (+6.2% vs Disc 1). With Buster XC: combined e_max = 9.10 mm (vs 10.63 mm with Disc 1, -14.4% eccentricity reduction). 35.8% of Buster assembly inertia. Bilateral fill trades imbalance amplification for slightly higher I.
**Engine Note**: disc1Prime(); e 1.24 mm; I 3.431e-6; combinedEccentricityReduction 14.4% vs Disc1; assemblyShare 35.8%.

---

### [Case 1011 — [PART] Dagger Frame (Burst Standard; thin-ring conditional LAD)](./9%20case%20study.md#case-1011)

**Category**: Part — Burst Frame (C4; thin ring; conditional LAD interception)
**Parts**: Dagger Frame (2.6 g; C4; r_i 1.4 cm, r_o 1.6 cm)
**Key Physics**: I = 5.876e-7 (6.14% of Buster assembly). Perimeter coverage 4x15 deg = 60 deg (16.7%). LAD floor clearance only 0.5 mm -> conditional interception only at exact floor-height contact. C4 contact frequency = 382 Hz.
**Engine Note**: daggerFrame(); I 5.876e-7; assemblyShare 6.14%; perimeterCoverage 16.7%; LADclearance 0.5 mm; conditionalInterception.

---

### [Case 1012 — [PART] Sword Performance Tip (Burst Standard; metal flat narrow)](./9%20case%20study.md#case-1012)

**Category**: Part — Burst Driver (metal narrow flat; scrape-limited below 300 rad/s)
**Parts**: Sword tip (9.2 g; r_contact 0.55 cm; r_eff = 0.367 cm; mu_k = 0.12)
**Key Physics**: dw/dt = -24.3 rad/s2; scrape tilt theta = 9.46 deg. I = 1.392e-7 (1.45% of assembly). Below omega approx 300 rad/s: tip edge-contacts floor -> accelerated decay at low spin.
**Engine Note**: swordDriver(); dOmega -24.3 rad/s2; scrapeTilt 9.46 deg; I 1.392e-7; scrapeLimitedBelow 300 rad/s.

---

### [Case 1013 — [PART] DB Core Xcalibur (Burst Standard; spring bound + BU Lock + High/Low Mode)](./9%20case%20study.md#case-1013)

**Category**: Part — Burst DB Core (spring rebound; BU Lock; mode switch)
**Parts**: DB Core Xcalibur (10.6 g; k = 800 N/m; delta = 2.0 mm; 3 BU Lock protrusions)
**Key Physics**: Spring: E = 1.60e-3 J; v_rebound = 0.202 m/s. BU Lock tau = 56.25 mN·m (3 protrusions x Hertz contact). Hertz patch a = 100.8 um. High Mode: CoM shift +0.38 mm (+3.2% precession onset), height +7 mm. Low Mode: stable/defense. I = 5.777e-7 (4.15% of assembly).
**Engine Note**: dbCoreXcalibur(); springRebound 0.202 m/s; buLockTau 56.25 mN·m; highModeHeight +7 mm; comShift +0.38 mm.

---

### [Case 1014 — [PART] Xiphoid BU Blade (Burst Ultimate; OHM alignment)](./9%20case%20study.md#case-1014)

**Category**: Part — Burst Ultimate Blade (C3 outer ring; OHM eccentricity; High Mode height advantage)
**Parts**: Xiphoid BU Blade (13.0 g; C3; r_i 1.0 cm, r_o 2.2 cm; phi = 20 deg)
**Key Physics**: I_Xiphoid = 3.796e-6 (27.3% of BU assembly I_total = 13.926e-6). OHM alignment: e_OHM = 0.901 mm; F_OHM = 25.6 N — concentrates burst-promoting centrifugal bias on one wing per revolution rather than distributing equally across C3. smash = cos(20) = 0.940; recoil = 0.342. High Mode: blade 7 mm higher -> blade-to-layer contact vs disc contact in Low Mode.
**Engine Note**: xiphoidBUBlade(); I 3.796e-6; ohmEccentricity 0.901 mm; F_OHM 25.6 N; highModeContactAdvantage +7 mm; phi 20 deg.

---

### [Case 1015 — [PART] Armor 1 (Burst Ultimate; High Mode impulse interception)](./9%20case%20study.md#case-1015)

**Category**: Part — Burst Ultimate Armor (smooth annular ring; largest I contributor; BU Lock sockets)
**Parts**: Armor 1 (13.1 g; r_i 1.2 cm, r_o 2.2 cm; 3 BU Lock sockets at 120 deg)
**Key Physics**: I_Armor1 = 4.113e-6 (29.5% of assembly — largest single contributor). High Mode: h_Armor_rim = 12 mm vs attacker blade h = 5 mm -> 58.3% of incoming impulse intercepted; effective burst threshold x2.4 vs shorter opponents. BU Lock: 3 discrete alignment positions (every 120 deg); off-alignment = zero BU Lock benefit.
**Engine Note**: armor1(); I 4.113e-6; assemblyShare 29.5%; highModeInterception 58.3%; burstMultiplier 2.4x; buLockPositions 3.

---

### [Case 1016 — [PART] Xanthus Forge Disc (Burst Ultimate; heaviest disc; mass-efficiency trade-off)](./9%20case%20study.md#case-1016)

**Category**: Part — Burst Ultimate Forge Disc (32.5 g; full metal; dominant mass)
**Parts**: Xanthus (32.5 g; r_i 0.4 cm, r_o 1.6 cm; full metal)
**Key Physics**: I_Xanthus = 4.420e-6 (31.7% of assembly); heaviest disc in XC lineage (+44.4% over Disc 1'). Mass-inertia efficiency 77.0% (lower than Armor 1 177.7%, Xiphoid 165.5% — smaller r_o). L_Xanthus = 2.652e-3 kg·m2/s > L0 of entire XC.M.I assembly (2.41e-3). Scrape tilt theta = 5.36 deg (tightest in assembly; rim scrapes before tip or blade).
**Engine Note**: xanthusDisc(); I 4.420e-6; massEfficiency 77%; L_disc 2.652e-3 > L_XC_total; scrapeTilt 5.36 deg.

---

### [Case 1017 — [PART] Sword' Dash Performance Tip (Burst Ultimate; Dash ratchet + full assembly spin budget)](./9%20case%20study.md#case-1017)

**Category**: Part — Burst Ultimate Driver (Dash ratchet; flat ABS; full BU assembly spin profile)
**Parts**: Sword' Dash (9.6 g; flat hard ABS; r_contact 0.55 cm; r_eff 0.367 cm; mu_k = 0.12; 8-tooth ratchet)
**Key Physics**: tau_Dash = 21.6 mN·m supplementary burst resistance (ratchet prevents counter-rotation). Full BU assembly (78.8 g; I = 13.926e-6): dw/dt = -24.5 rad/s2; time to instability = 14.7 s (no collisions). L0 = 8.356e-3 kg·m2/s (3.47x WV assembly). Lineage: XC.M.I 1.00x, Sieg 1.99x, Buster 2.39x, BU 3.47x.
**Engine Note**: swordDashDriver(); dashRatchetTau 21.6 mN·m; dOmega -24.5 rad/s2; timeToInstability 14.7 s; L0 8.356e-3; lineage 3.47x.

---

### [Case 1018 — [PART] Victory Valkyrie Energy Layer (God Layer; dual-mode; upper-attack)](./9%20case%20study.md#case-1018)

**Category**: Part — Burst God Layer Energy Layer (C3; dual Attack/Stamina mode; upper-attack vertical force)
**Parts**: Victory Valkyrie (8.9 g; C3; r_i 0.4 cm, r_o 2.0 cm; phi_attack = 20 deg; phi_stamina = 35 deg; alpha_upper = 15 deg)
**Key Physics**: I_VV = 1.807e-6 (37.2% of VV.Boost.Var assembly). Attack Mode: smash 0.940, recoil 0.342. Stamina Mode: smash 0.819, recoil 0.574 (+67.8% recoil). God Layer tabs delta = 0.35 mm -> tau_burst = 12.6 mN·m (+16.7% vs Standard Burst). Upper-attack alpha = 15 deg: F_vertical = 25.9 N per 100 N impact -> transient 75% opponent weight reduction. L0 = 2.987e-3 kg·m2/s.
**Engine Note**: victoryValkyrie(); dualMode phi 20/35 deg; upperAttack 15 deg F_v 25.9 N; tau_burst 12.6 mN·m; I 1.807e-6; L0 2.987e-3.

---

### [Case 1019 — [PART] Boost Forge Disc (God Layer; three-wing two-zone; disc dominance)](./9%20case%20study.md#case-1019)

**Category**: Part — Burst God Layer Forge Disc (three extending wings; two-zone mass; 53.1% assembly share)
**Parts**: Boost (20.0 g; inner ring 15.0 g r 0.4-1.2 cm; 3 wings 5.0 g at r = 1.7 cm)
**Key Physics**: I_inner = 1.200e-6; I_wings = 1.445e-6; I_Boost = 2.645e-6 (53.1% of VV assembly — disc majority). Wing scrape tilt theta = 11.9 deg. Secondary elevation contact: wings at h = 2.0-3.5 mm contact opponents at disc/tip height. Disc majority share confirms disc dominance across all three-piece God Layer assemblies.
**Engine Note**: boostDisc(); twoZone I 2.645e-6; assemblyShare 53.1%; wingScrape 11.9 deg; wingContactH 2.0-3.5 mm.

---

### [Case 1020 — [PART] Variable Performance Tip (God Layer; three-stage rubber wear)](./9%20case%20study.md#case-1020)

**Category**: Part — Burst God Layer Driver (evolution tip; wear-dependent three-stage decay)
**Parts**: Variable tip (6.2 g; Stage 1: rubber spikes mu=0.85 r_eff 1.5 mm; Stage 3: flat ABS mu=0.17 r_eff 3.5 mm)
**Key Physics**: Stage 1: dw/dt = -88.2 rad/s2. Stage 2 (half-worn): dw/dt = -86.5 rad/s2 (approx Stage 1; wider r_eff compensates lower mu). Stage 3 (fully worn flat ABS): dw/dt = -41.2 rad/s2 — abrupt 2.14x stamina improvement. Meaningful improvement only at complete rubber removal. Stage 1-2 approx 5-10 battles; Stage 3 transition abrupt.
**Engine Note**: variableDriver(); stage1 -88.2 rad/s2; stage2 -86.5 rad/s2; stage3 -41.2 rad/s2; abruptTransition; 2.14x gain.

---

### [Case 1021 — [PART] God Valkyrie Energy Layer (God Layer; hub spring bound; spring-tab paradox)](./9%20case%20study.md#case-1021)

**Category**: Part — Burst God Layer Energy Layer (hub spring bound attack; spring-tab paradox)
**Parts**: God Valkyrie (10.16 g; k_spring = 600 N/m; delta = 1.5 mm; r_i 0.4 cm, r_o 2.1 cm)
**Key Physics**: Spring: E = 6.75e-4 J; v_rebound = 0.180 m/s. Spring-tab paradox: at full compression delta = 1.5 mm, tabs disengage (lost depth 0.75 mm vs engagement 0.30 mm -> 2.5x disengagement -> tau_burst approx 0 for 1.5 ms contact window). Self-risky: spring activation = zero burst resistance window. I_GV = 2.321e-6; I_total(GV.6.Vortex.Reboot) = 6.250e-6; L0 = 3.750e-3 kg·m2/s.
**Engine Note**: godValkyrie(); springRebound 0.180 m/s; springTabParadox tau_burst approx 0 at compression; I 2.321e-6; L0 3.750e-3.

---

### [Case 1022 — [PART] Strike God Valkyrie + Strike God Chip (God Layer; chip-lock; spring-lock trade-off)](./9%20case%20study.md#case-1022)

**Category**: Part — Burst God Layer Energy Layer + Chip (chip-lock burst resistance; no spring paradox)
**Parts**: Strike God Valkyrie (11.6 g) + Strike God Chip (1.7 g; k_chip = 1.8e3 N/m; 2 engagement points at r = 5.5 mm)
**Key Physics**: tau_chip_lock = 3.96 mN·m; total tau_burst = 16.56 mN·m (+31.4% vs GV static; effectively infinite vs GV-at-contact due to spring-tab paradox). No spring paradox: burst threshold stable throughout contact. I_combined = 2.676e-6 (+15.3% vs GV). SGV assembly (SGV.6.Vortex.UltReboot, 44.4 g): I = 6.634e-6; L0 = 3.980e-3 kg·m2/s.
**Engine Note**: strikeGodValkyrie(); chipLockTau 3.96 mN·m; totalBurst 16.56 mN·m; I_combined 2.676e-6; noSpringParadox; L0 3.980e-3.

---

### [Case 1023 — [PART] Forge Disc 6 (God Layer; C6 symmetry; near-zero eccentricity; high-frequency contact)](./9%20case%20study.md#case-1023)

**Category**: Part — Burst God Layer Forge Disc (C6 hexagonal; near-zero imbalance; 573 Hz contact)
**Parts**: Forge Disc 6 (21.2 g; C6; r_i 0.4 cm, r_o 1.7 cm; e approx 0.30 mm manufacturing tolerance only)
**Key Physics**: I_6 = 3.231e-6 (identical to Disc 1 at same radii; symmetry does not change I if radii unchanged). Eccentricity 89.2% lower than Disc 1. C6 contact frequency = 573 Hz (dt = 1.74 ms) — 6x C1, 2x C3; cumulative tab deflection rate 5.73 mm/s at 0.01 mm/contact. Assembly share: 51.7% of GV total I (disc dominance).
**Engine Note**: disc6(); I 3.231e-6; c6Frequency 573 Hz; eccentricityReduction 89.2%; tabAccumRate 5.73 mm/s; assemblyShare 51.7%.

---

### [Case 1024 — [PART] Vortex Frame (God Layer; C8 spiral-cut; aerodynamic effect negligible)](./9%20case%20study.md#case-1024)

**Category**: Part — Burst God Layer Frame (C8 thin ring; spiral-cut; aerodynamic torque negligible)
**Parts**: Vortex Frame (2.51 g; C8 spiral cuts; r_i 1.4 cm, r_o 1.6 cm; 8 protrusions x 20 deg arc)
**Key Physics**: I_actual approx 4.538e-7 (solid-ring x0.80; 7.26% of GV assembly). Aerodynamic torque (8 slots): tau_aero = 1.05e-6 N·m — only 0.309% of floor friction (negligible). Perimeter coverage 44.4% (vs Dagger Frame 16.7%); C8 contact frequency = 764 Hz (highest of any standard Burst Frame).
**Engine Note**: vortexFrame(); I 4.538e-7; aerodynamicTorque negligible 0.31% floor; c8Freq 764 Hz; perimeterCoverage 44.4%.

---

### [Case 1025 — [PART] Neo Right Spin Gear Shells (Plastics Gen; Neo Core access)](./2%20case%20study.md#case-1025)

**Category**: Part — Plastics Gen Spin Gear Shells (Neo format; prerequisite for HMC)
**Parts**: Neo Right Spin Gear Shells (~1.15 g each, 2.30 g pair; 3-lug bayonet; d_inner = 12.5 mm)
**Key Physics**: Cavity upgrade (+1.5 mm diameter vs Regular Shells) enables Heavy Metal Core access: I_HMC = 2.35e-6 kg·m2 (+52% full-combo I vs ABS core). Centrifugal load at 314 rad/s: 2.86 N per lug; ABS lug capacity 135 N (FoS = 47). Mass penalty +0.10 g vs Regular Shells (tab reinforcement offsets cavity removal). Shell pair mass penalty for Neo: only +0.10 g but unlocks stamina ceiling (DBC; 800x lower spin decay than SG Sharp). Mandatory for Compact, WBD, Force Smash, Upper Attack, Driger V2.
**Engine Note**: neoRightShells(); hmcAccess; I_combo +52%; FoS 47; mandatoryForCompact.

---

### [Case 1026 — [PART] Metal Weight Core (Plastics Gen; marginal attack niche)](./2%20case%20study.md#case-1026)

**Category**: Part — Plastics Gen SG Neo Core (zinc insert; marginal improvement)
**Parts**: MWC (~2.5 g; zinc cylinder insert; ABS housing; Neo 3-lug)
**Key Physics**: I_MWC = 4.63e-8 kg·m2 (1% of combo I). vs Normal Core: delta_I = 0.18% combo — trivial. vs Magnecore: delta_I = 0.37% combo — trivial. Core mass at r = 5-10 mm vs WD at r = 23 mm: (8/23)^2 = 12% I efficiency per gram. Extra 1.3 g vs Normal Core: +0.8% KO threshold. Fails to find meaningful niche; minimal performance separation from any comparable core.
**Engine Note**: metalWeightCore(); I 4.63e-8; comboContrib 1%; trivialVsMagnecore; marginalAttackNiche.

---

### [Case 1027 — [PART] Normal Core (Plastics Gen; CMS Base structural niche)](./2%20case%20study.md#case-1027)

**Category**: Part — Plastics Gen SG Neo Core (lightest Neo; CMS Base only compatible core)
**Parts**: Normal Core (~1.2 g; all-ABS hollow; Neo 3-lug; d_shaft = 2.8 mm)
**Key Physics**: I_NC = 3.84e-8 kg·m2 (lightest Neo Core). CMS Base bore d = 3.0 mm; only Normal Core shaft (2.8 mm) fits — MWC/Magnecore (3.2+ mm) blocked. Competitive role is structural (CMS Base zombie), not performance. For Neo attack builds MWC preferred (+0.8% KO threshold vs +0.18% spin cost). CMS Base itself not highly competitive.
**Engine Note**: normalCore(); I 3.84e-8; cmsBaseOnly; shaftD 2.8 mm; structuralRole.

---

### [Case 1028 — [PART] Regular SG Core Part (Plastics Gen; lightest core; SCB zombie)](./2%20case%20study.md#case-1028)

**Category**: Part — Plastics Gen SG Regular Core (0.61 g; two spring clip fingers; regular shells only)
**Parts**: Regular SG Core Part (~0.61 g; ABS spring clips; regular format; d_shaft ~2.5 mm)
**Key Physics**: I_core = 1.49e-8 kg·m2 (negligible). Lightest possible right-spin SG: 2.81 g (vs Neo 3.50 g; -0.69 g). Mass saving benefit: 0.77% orbital speed — below launch noise. Neo-bore MagneSystem bases incompatible (shaft 2.5 mm vs bore 3.1 mm -> 0.6 mm gap -> rattle 1.33 N oscillating). Best for SCB zombie (regular shells required; second lightest option after Wyborg ACV core; delta = 0.09 g = negligible).
**Engine Note**: regularSGCore(); I 1.49e-8; massSaving 0.69 g; rattlesInNeoBore; scbZombieRole.

---

### [Case 1029 — [PART] Right Spin Gear Shells + Metal Weight Gear (Plastics Gen; anti-rattle; Neo lock-out)](./2%20case%20study.md#case-1029)

**Category**: Part — Plastics Gen SG Shells + MWG (anti-rattle ballast; Neo Core incompatible)
**Parts**: Right Spin Gear Shells (~1.1 g x2 = 2.2 g) + MWG (1.12 g; zinc ring; r = 1.4 cm); cavity d = 11.0 mm
**Key Physics**: I_shells = 3.97e-7; I_MWG = 1.10e-7 (1.4% of combo — not a stamina part). MWG fills cavity clearance: rattle power without MWG = 3.4e-4 W; with MWG = 1.1e-5 W (31x reduction); 40 mJ saved per 2-min battle (instability reduction is the real benefit, not energy). Neo Core locked out: cavity 11.0 mm vs Neo flange 12.5 mm -> 800x worse spin decay than DBC. For stamina: Neo Shells + DBC mandatory.
**Engine Note**: rsShellsMWG(); I_MWG 1.10e-7; rattleReduction 31x; dbcLockout; spinDecay800xWorse.

---

### [Case 1030 — [PART] SG Wing Base (Plastics Gen; SAR slot; scrape liability; tier 2)](./2%20case%20study.md#case-1030)

**Category**: Part — Plastics Gen Blade Base (SAR slot; irremovable clips; soft-plastic tip)
**Parts**: SG Wing Base (~5.9 g; SAR seat ledge; moulded base clips integral; Gaia Dragoon tip r_contact ~1.1 mm; mu = 0.32 soft plastic)
**Key Physics**: tau_tip = 1.04e-4 N·m; dw/dt = 23.1 rad/s2 (3.2x Metal Change Base). Clip scrape tau = 0.040 N·m at 45-deg tilt (667x tip torque) — clips irremovable. Smaller SARs (War Lion, r = 22 mm) delay scrape onset vs Wing SAR (r = 28 mm). Screw Zeus WBO ruling: sigma_bend = 97.2 MPa > ABS yield 45 MPa -> visible flex with wide WDs. Inverted tip: 191 rad/s2 (8.3x worse). Tier 2 despite SAR flexibility.
**Engine Note**: sgWingBase(); clipScrapeTau 0.040 Nm; tipDecay 23.1 rad/s2; screwZeusFlexBanned; tier2.

---

### [Case 1031 — [PART] SG Sharp Base (Plastics Gen; tall CoM; precession instability)](./2%20case%20study.md#case-1031)

**Category**: Part — Plastics Gen Blade Base (sharp tip; tall body; earliest precession instability)
**Parts**: SG Sharp Base (~6.6 g; h_total ~16-18 mm; r_tip = 0.35 mm; ABS all-plastic; 2 molds)
**Key Physics**: h_CoM_combo ~20 mm (vs MCB 14 mm; +43%). Precession rate Omega at 150 rad/s = 1.063 rad/s (vs MCB 0.744 rad/s; 1.43x faster). omega_crit stability = 90.8 rad/s (~867 RPM; vs MCB 725 RPM — dies 20% faster in terms of RPM). Mold 1: metal retention ring at tip shaft. Mold 2: plastic retention lug (reinforced groove). Sharp tip preserves RPM but CoM elevation defeats it before RPM savings are useful.
**Engine Note**: sgSharpBase(); hCoMcombo 20 mm; precessionRate 1.43x MCB; omegaCrit 90.8 rad/s; twoMolds.

---

### [Case 1032 — [PART] AR War Lion (Plastics Gen; two-wing oval; spin-direction agnostic)](./2%20case%20study.md#case-1032)

**Category**: Part — Plastics Gen AR (C2; near-spin-direction-symmetric; WD-radius contact dependency)
**Parts**: AR War Lion (~3.7 g; 2 wings; r_wing ~26 mm; r_body ~15 mm; beta_RS ~7 deg; beta_LS ~9 deg)
**Key Physics**: Low recoil in both spin directions (RS 7 deg, LS 9 deg vs Tiger Defenser LS ~35% higher recoil from rear spikes). Gap sector ~110 deg per side (61.1% of azimuth exposes inner body at r 15 mm). WD radius dependency: Wide Defense/Survivor (r_WD ~26 mm) obstructs Tiger Defenser (r_TD ~24 mm) while War Lion wing tips (r ~26 mm) remain borderline-exposed. War Lion preferred when WD outer radius exceeds ~25 mm.
**Engine Note**: arWarLion(); beta_RS 7 deg; beta_LS 9 deg; gapFraction 61.1%; wdRadiusDependency.

---

### [Case 1033 — [PART] Sub AR War Lion (Plastics Gen; neutral filler; wedge-gap liability)](./2%20case%20study.md#case-1033)

**Category**: Part — Plastics Gen Sub AR (near-circular; minimal protrusion; wedge-gap liability)
**Parts**: Sub AR War Lion (~1.3 g; ring r_ring ~20 mm; 2 winglets +4 mm; I_SAR ~5.38e-7)
**Key Physics**: 6.7% of combo I (negligible). 2 mm radial gap between winglet (r = 24 mm) and Wide Defense WD (r = 26 mm): wedge-trap zone. Thin AR wedge held ~15x longer -> ~10x more impulse -> explosive KO. Dragon Saucer SAR closes gap (vertical interference). War Monkey SAR: more RS recoil, better LS azimuthal coverage. War Lion SAR: near-neutral; adapts to any AR without adding recoil.
**Engine Note**: subARWarLion(); I 5.38e-7; wedgeGapRisk 2mm; neutralFiller; adaptsToAnyAR.

---

### [Case 1034 — [PART] Flying Defense AR (Plastics Gen; aerodynamic gimmick failure)](./2%20case%20study.md#case-1034)

**Category**: Part — Plastics Gen AR (aerodynamic; flat-face drag; wrong-height contacts; Takara inferior)
**Parts**: Flying Defense (6.2 g; disc-like; r_o ~26 mm; r_i ~8 mm; swept upper face; lower edge protrusions; Takara mold)
**Key Physics**: Launch flip gimmick: designed for upside-down launch. Aerodynamic gimmick: flat face creates drag (spin decay accelerated, not reduced). Protrusions at wrong height for any attack archetype. Takara outer mass fraction only 31% (vs Hasbro ~38%) -> lower I per gram. Large mass but light distribution: maximal destabilisation moment per hit. Non-competitive in every specialisation.
**Engine Note**: flyingDefenseAR(); aeroGimmickFails; wrongContactHeight; takaraMassDistrib 31%; nonCompetitive.

---

### [Case 1035 — [PART] Jumping Base 2 (Plastics Gen; dish grind redemption via Hasbro Flying Defense)](./2%20case%20study.md#case-1035)

**Category**: Part — Plastics Gen Blade Base (spring jump; free-spinning disc; narrow grind combo niche)
**Parts**: Jumping Base 2 (~6.8 g; free-spinning outer disc r = 27 mm; spring jump; disc h = 4 mm; inner body h = 14 mm)
**Key Physics**: Disc I = 0.5 x 3.5e-3 x (0.013^2 + 0.027^2) ~1.37e-6 kg·m2. Jump mechanism: vertical impulse extends spring fully (+12.5 mm height during hit). Disc scrapes on tilt after jump. SG compatibility theoretically broad but practically zero (non-protruding cores never reach floor). Redemption: Hasbro Flying Defense upper face + disc overhead grind = pseudo-Force-Smash. Two rejected parts combine into effective combo. Narrow but legitimate competitive niche.
**Engine Note**: jumpingBase2(); springJump 12.5 mm; freeDiscR 27 mm; groundGrindCombo; narrowNiche.

---

### [Case 1036 — [PART] Ten Heavy WD (Plastics Gen; heaviest legal WD)](./2%20case%20study.md#case-1036)

**Category**: Part — Plastics Gen Weight Disk (heaviest single WD; mass-dominant; lowest I/mass)
**Parts**: Ten Heavy WD (16.1 g standard / 17.0 g Spike Lizard variant; 10 heavy tabs; r_outer limited by tab geometry)
**Key Physics**: Heaviest legal WD -> highest assembly mass -> best KO resistance and highest absolute L. Tab geometry: 10 tabs reduce effective rim concentration vs Wide Defense (uniform annulus). I per gram lower than Wide Defense/Wide Survivor despite higher total mass. Mass-dominant strategy: useful when assembly mass ceiling is the priority, not I/mass efficiency. Spike Lizard variant: +0.9 g (additional zinc inserts in some tabs).
**Engine Note**: tenHeavyWD(); mass 16.1g; heaviestLegal; tabMassDistrib; I_efficiency lower vs WideDef.

---

### [Case 1037 — [PART] Flame Wing AR (Plastics Gen; spin-direction asymmetric; right-spin fracture)](./2%20case%20study.md#case-1037)

**Category**: Part — Plastics Gen AR (C3; spin-direction split identity; RS tip fracture liability)
**Parts**: Flame Wing (~3.8 g; C3; r_o ~24 mm; tip thickness t_tip = 1.8 mm; root t_root = 4.5 mm)
**Key Physics**: RS: rounded-forward-swept wings -> upper attack + moderate smash simultaneously. But tip fracture common (second-hand units broken more often than not). LS: rounded edges become passive deflectors; recoil drops; AR transitions to defensive/zombie. LS fracture manageable (not disqualifying) with Wide Survivor/Wide Defense intercepting hard hits. Asymmetric geometry: RS tip root stress > fracture limit at competitive impact velocities; LS root stress remains safe.
**Engine Note**: flameWingAR(); tTip 1.8 mm; rsFractureCommon; lsDefenseViable; spinDirectionSplit.

---

### [Case 1038 — [PART] SG (Triple Change Version) Core (Plastics Gen; three-tip indexer; format-locked)](./2%20case%20study.md#case-1038)

**Category**: Part — Plastics Gen SG Neo Core (three-tip selector; friction detent; Flame Change Base only)
**Parts**: SG Triple Change Version Core (~1.7 g; 3 tips: Sharp r=0.3mm, Semi-Flat r=2.0mm, Flat r=3.5mm; 120 deg spacing; 2 friction protrusions)
**Key Physics**: Friction detent (2 protrusions x h=0.6 mm mold1 / 0.9 mm mold2). Failure modes: protrusion wear -> mid-battle tip drift (lands between positions); mold-line ridge -> hopping at match start until worn flat. Flame Change Base only (cross-slot bore). Cannot accept HMC -> weight-add path eliminated. Educational value exceeds competitive relevance.
**Engine Note**: tcvCore(); threeTips; frictionDetentH 0.6mm/0.9mm; flameChangeBaseOnly; hmcIncompatible.

---

### [Case 1039 — [PART] Flame Change Base (Plastics Gen; dedicated TCV shell; no HMC)](./2%20case%20study.md#case-1039)

**Category**: Part — Plastics Gen Blade Base (TCV-dedicated; flat disc; no HMC)
**Parts**: Flame Change Base (~4.1 g; flat ABS disc; r_o ~25 mm; h ~8 mm; cross-slot receiver; LAD rim r_roll = 8.6 mm)
**Key Physics**: TCV SG only (cross-slot bore incompatible with any other SG). Cannot accept HMC (decisive competitive constraint). LAD: smooth lower rim r = 25 mm; C_rr ~0.010; moderate taper beta ~12 deg; LAD r_roll = 8.6 mm (below Wide Defense disc rolling at 25 mm). I = half x 4.1e-3 x ((10e-3)^2 + (25e-3)^2) ~7.9e-7 kg·m2. Competitive relevance collapsed when dedicated-tip bases identified as universally superior.
**Engine Note**: flameChangeBase(); tcvOnly; hmcIncompatible; LADroll 8.6 mm; I 7.9e-7.

---

### [Case 1040 — [PART] Metal Balls (Plastics Gen; rolling tip vs ballast; Hertz contact)](./2%20case%20study.md#case-1040)

**Category**: Part — Plastics Gen Metal Balls (1/4" and 3/16" steel; dual roles)
**Parts**: 1/4" ball (d = 6.35 mm; m = 1.050 g; rho = 7822 kg/m3); 3/16" ball (d = 4.763 mm; m = 0.448 g)
**Key Physics**: Rolling tip role (1/4"): C_rr two orders of magnitude below ABS sliding tip -> extreme stamina (Draciel Metal Ball Defenser). Ballast role: I_ballast = m x r_cavity^2; 1/4" at r=18 mm: I = 3.40e-7 (3.1% combo I — meaningful). 3/16" at r=15 mm: I = 1.01e-7 (0.9%). Self-inertia (sphere): I_self = 0.4 x m x r_ball^2 (tiny). Size ratio cubed = 2.370; mass ratio = 2.344 (within tolerance). 3/16" slight density elevation consistent with chrome plating.
**Engine Note**: metalBalls(); rollingTipC_rr lowStamina; ballast I 3.40e-7 (3.1%); size^3 mass ratio 2.34.

---

### [Case 1041 — [PART] Metal Wheel: Mercury (MFB; C2 rounded lobes; non-competitive)](./6%20case%20study.md#case-1041)

**Category**: Part — MFB Metal Wheel (C2; rounded lobes; no attack geometry)
**Parts**: Mercury (29.0 g; C2; r_o ~22.0 mm; 2 convex lobes + 2 spikes; 81% outer-zone mass)
**Key Physics**: I = 6.87e-6; I/m = 2.37e-4 m2 (nearly identical to Lightning 2.34e-4). L_Mercury = 1.031e-3 kg·m2/s (2.3% below Lightning; 50.9% below Blitz). Variable contact angle phi_eff ~45 deg (smash fraction 0.534) vs Lightning Upper Mode 0.906 — curved lobes glance rather than smash. 85XF stock: XF dw/dt = 33.9 rad/s2 accelerates out of spin-equalisation window. Non-competitive in every specialisation.
**Engine Note**: mercuryWheel(); I 6.87e-6; phi_eff 45 deg; smash 0.534; L_deficit 50.9% vs Blitz; nonCompetitive.

---

### [Case 1042 — [PART] Crystal Wheel: Archer (MFB Zero-G; C1; bow curves; nutation forcing)](./6%20case%20study.md#case-1042)

**Category**: Part — MFB Zero-G Crystal Wheel (C1; bow arcs; low nutation forcing)
**Parts**: Archer (5.16 g; C1; r_o ~23 mm; ~50% bow arc phi ~20 deg; ~50% orb/crystal half phi ~45 deg)
**Key Physics**: I = 1.212e-6 (13.3% of Archer+Gargole system = 9.082e-6). C1 transverse anisotropy DeltaI_trans ~0.117e-6; nutation forcing ~42.1 N·m at launch, ~2.6 N·m late-battle (6x lower than Duo — negligible in practice). Crystal Up Mode: bow arc phi ~20 deg deflects tangentially (less spin-loss vs flat guard); ABS absorption 2.87x vs zinc.
**Engine Note**: archerCW(); I 1.212e-6; systemShare 13.3%; DeltaI_trans 0.117e-6; nutationForcing 42.1Nm; absAbsorption 2.87x.

---

### [Case 1043 — [PART] Crystal Wheel: Bandid (MFB Zero-G; C2; block ridges; Goreim complement)](./6%20case%20study.md#case-1043)

**Category**: Part — MFB Zero-G Crystal Wheel (C2; block ridges; tight Goreim coupling; 764 Hz contact)
**Parts**: Bandid (4.8 g; C2; r_o ~23 mm; ~70% block sections phi ~30 deg; 16 ridges)
**Key Physics**: I = 1.159e-6 (12.5% of Bandid+Goreim system ~9.259e-6). C2 symmetry -> DeltaI_trans = 0 (zero nutation forcing). Ridge geometry: 764 Hz contact frequency at 300 rad/s (16 ridges). Tight mechanical coupling with Goreim: block-ridge complement minimises inter-layer gap, maximising torsional ABS-on-zinc grip (~5x vs non-complement CW at same normal load).
**Engine Note**: bandidCW(); I 1.159e-6; systemShare 12.5%; zeroNutation; ridgeFreq 764 Hz; goreim5xCoupling.

---

### [Case 1044 — [PART] Crystal Wheel: Berserker (MFB Zero-G; C2; chain links; diffuse impulse)](./6%20case%20study.md#case-1044)

**Category**: Part — MFB Zero-G Crystal Wheel (C2; chain link rim; continuously varying phi; 86.6% smash efficiency)
**Parts**: Berserker (4.5 g; C2; r_o ~23 mm; serrated chain links sweeping phi 0-60 deg; ~20 links)
**Key Physics**: I = 1.070e-6 (11.7% of Berserker+Begirados system ~9.120e-6). Near-balanced: DeltaI_trans ~0.05e-6 (negligible vs Gargole 1.40e-6). Chain link smash efficiency 86.6% of flat face (mean cos phi via Bessel J0 approximation). Continuously varying phi -> diffuse impulse profile -> damage-tolerant vs sharp protrusion.
**Engine Note**: berserkerCW(); I 1.070e-6; systemShare 11.7%; chainSmashEfficiency 86.6%; diffuseImpulse.

---

### [Case 1045 — [PART] Crystal Wheel: Dark Knight (MFB Zero-G; C1; universal spin-dir adapter)](./6%20case%20study.md#case-1045)

**Category**: Part — MFB Zero-G Crystal Wheel (C1; symmetric hub keyway; left-spin on any Chrome Wheel)
**Parts**: Dark Knight (3.87 g; C1; r_o ~23 mm; symmetric keyway hub; stud half phi ~5 deg; scythe half phi ~30 deg)
**Key Physics**: I = 9.09e-7 (9.8% of DarkKnight+Dragooon 9.249e-6 — lowest Crystal Wheel system fraction). Symmetric keyway: only Crystal Wheel compatible with right-spin Chrome Wheels in Crystal Up Mode. Crystal Up on right-spin CW: left-spin imparted to assembly (86.5% torque transfer efficiency). Stud: smash = cos(5) = 0.996 (near-radial); scythe: smash = cos(30) = 0.866 — both better than Mercury (0.707).
**Engine Note**: darkKnightCW(); I 9.09e-7; systemShare 9.8%; universalSpinAdapter; studSmash 0.996; scytheSmash 0.866.

---

### [Case 1046 — [PART] Crystal Wheel: Gladiator (MFB Zero-G; C4; highest I; sharpest tips)](./6%20case%20study.md#case-1046)

**Category**: Part — MFB Zero-G Crystal Wheel (C4; heaviest CW; zero nutation; sharpest attack geometry)
**Parts**: Gladiator (5.37 g; C4; r_o ~23 mm; 4 half-swords at 90 deg; phi_tip ~10 deg; phi_blade ~35 deg)
**Key Physics**: I = 1.275e-6 (13.9% of Gladiator+Bahamdia 9.185e-6 — highest among accurately-known pairs). C4 symmetry -> DeltaI_trans = 0 (optimal stabiliser for C2 Chrome Wheels). phi_tip = 10 deg: smash = 0.985 (sharpest in Crystal Wheel series). Effective smash fraction (active contact 50%): 0.437. Stamina bonus (highest I) + attack contribution (near-radial tips) in single part.
**Engine Note**: gladiatorCW(); I 1.275e-6; systemShare 13.9%; zeroNutation; tipSmash 0.985; effectiveSmash 0.437.

---

### [Case 1047 — [PART] Crystal Wheel: Pirates (MFB Zero-G; C2; Orojya complement; 5x grip)](./6%20case%20study.md#case-1047)

**Category**: Part — MFB Zero-G Crystal Wheel (C2; snake-coil Orojya mirror; zero inter-layer gap)
**Parts**: Pirates (4.0 g; C2; r_o ~23 mm; snake coil profile mirroring Orojya top face)
**Key Physics**: I = 9.48e-7 (10.1% of Pirates+Revizer 9.418e-6 — matches Guardian+Revizer exactly). Designed complement to Orojya: inter-layer gap ~0.1 mm (manufacturing tolerance only). ABS-on-zinc torsional grip: tau = 9.25e-4 N·m (5x greater than non-complement CW at same load). Versatile: 7 Chrome Wheel pairings. Near-neutral profile adapts to host Chrome Wheel geometry.
**Engine Note**: piratesCW(); I 9.48e-7; systemShare 10.1%; orojyaComplement 5xGrip; tau_grip 9.25e-4 N·m; versatile7pairings.

---

### [Case 1048 — [PART] Crystal Wheel: Samurai (MFB Zero-G; C1~C2; mode change; orb guard)](./6%20case%20study.md#case-1048)

**Category**: Part — MFB Zero-G Crystal Wheel (C1~C2; mode change Chrome Up/Crystal Up; orb deflects upward)
**Parts**: Samurai (5.4 g; C1 approx C2; r_o ~23 mm; large orb at r ~12 mm; Chrome Up / Crystal Up)
**Key Physics**: I = 1.284e-6 (13.7% of Samurai+Ifraid ~9.384e-6). DeltaI_trans ~0.07e-6 (near-negligible). Crystal Up: orb at r = 12 mm as primary contact; Hertzian contact radius a = 0.115 mm; ABS absorption 2.87x vs zinc. Orb deflects impact upward/away from spin axis (not purely radially like flat guard). Chrome Up: Samurai sub-Chrome, inertia only. Mode selection: attack -> Chrome Up, defense/stamina -> Crystal Up.
**Engine Note**: samuraiCW(); I 1.284e-6; systemShare 13.7%; orbContactR 12 mm; hertzA 0.115 mm; absorption 2.87x.

---

### [Case 1049 — [PART] Crystal Wheel: Shinobi/Ninja (MFB Zero-G; C2; highest I/m; angled deflection curves)](./6%20case%20study.md#case-1049)

**Category**: Part — MFB Zero-G Crystal Wheel (C2; highest specific inertia; reversible mode; angled ramps)
**Parts**: Shinobi/Ninja (5.4 g; C2; r_o ~23 mm; flat Chrome Up face; angled curves + circles Crystal Up face)
**Key Physics**: I = 1.310e-6 (14.1% of Shinobi+Saramanda ~9.310e-6 — highest estimated system fraction). I/m = 2.426e-4 m2 (highest in Crystal Wheel series — flat disc maximises outer mass). DeltaI_trans = 0 in both orientations. Crystal Up angled curves delta ~35 deg: 67.1% of impact energy deflected off spin axis vs 0% for flat guard. Flat standard face: near-flush -> Saramanda Chrome Wheel dominant.
**Engine Note**: shinobiCW(); I 1.310e-6; specificInertia 2.426e-4 (highest CW); systemShare 14.1%; crystalUpDeflection 67.1%.

---

### [Case 1050 — [PART] Crystal Wheel: Thief (MFB Zero-G; C1; irregular protrusions; highest CW fraction with Phoenic)](./6%20case%20study.md#case-1050)

**Category**: Part — MFB Zero-G Crystal Wheel (C1; non-uniform circular protrusions; highest system fraction)
**Parts**: Thief (5.3 g; C1; r_o ~23 mm; circular protrusions non-uniform; longer section phi ~35 deg; grey-yellow)
**Key Physics**: I = 1.254e-6. With Phoenic (I = 6.54e-6 — lightest Chrome Wheel): system fraction = 16.1% (highest in series — but total L lowest at 1.169e-3 kg·m2/s). DeltaI_trans ~0.10e-6 (low nutation forcing ~Archer). Non-uniform protrusions (~6 circles; sigma_angle ~15 deg): contact frequency 200-400 Hz (irregular, hard to predict). Full Crystal Wheel series: Shinobi highest I/m (2.426e-4); Gladiator highest I (1.275e-6); Thief highest system fraction (16.1%); Dark Knight lowest fraction (9.8%).
**Engine Note**: thiefCW(); I 1.254e-6; systemShare 16.1% (highestCW vs Phoenic); irregularFreq 200-400 Hz; DeltaI_trans 0.10e-6.

---

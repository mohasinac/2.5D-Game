# BEYBLADE CASE STUDY INDEX — Part D (Cases 1601–2092)
> Phase 0 audit complete · All geometry in cm · PX_PER_CM = 24
> True case count: 2008 unique numbered cases · Highest: 2092 · Next Available: 2093

## CS13/CS14 Overflow — Cases 1601–1785 {#cs13-overflow}
Source: `13 case study.md` (check case_audit_raw.txt for exact file)

---

### [Case 1601 — Vice Leopard 12Lift Destroy — Fang-Layer Capture Geometry and Orbital Hammer-Throw Mechanics](./13%20case%20study.md#case-1601)

**System**: Burst / Gatinko Layer  
**Mechanism**: Fang-arc protrusions on the Vice Leopard layer clamp the opponent's layer at orbital radius r_orbit ≈ 4.0 cm; centripetal force to hold captured bey: F_centripetal ≈ 120 N [M]. Physical fang friction 0.3–0.6 N — three orders of magnitude below; full orbital capture is BeySpirit-sustained. At orbital release: v_orbit ≈ 11.72 m/s → impact KE ≈ 2.40 J. v_release = 11.72 m/s gives near-instant ring-out toward boundary (~0.034 s) if aimed correctly.  
**Gimmick**: Orbital capture + hammer-throw tangential release → MechanicRegistry: orbital_capture  
**Engine Note**: Capture and throw sequence must model orbital pre-build timer and tangential release vector

---

### [Case 1602 — Vice Leopard 12Lift Destroy — Howling Bite](./13%20case%20study.md#case-1602)

**System**: Burst / Gatinko Layer  
**Blader**: Laban Vanot  
**Special Move**: Howling Bite — two-phase: (1) fang-lock initiation QTE, (2) orbital cyclone build + directed throw  
**Mechanism**: biteCapture → cycloneBuildMs (max 600ms) → targetType (floor/wall/opponent) → throw release. dmgMult 1.55×–1.85× [M full cyclone]; ringOutBonus up to 0.65 (floor); chainBonus up to 0.50 (wall-rebound chain). powerCost: 105.  
**Compatible beys**: Any layer with prominent fang-arc protrusions; full orbital BeySpirit lock specific to Laban Vanot / Vice Leopard big-cat BeySpirit

---

### [Case 1603 — Vice Leopard 12Lift Destroy — Fang Rush](./13%20case%20study.md#case-1603)

**System**: Burst / Gatinko Layer  
**Mechanism**: COMBO — Fang Rush. Sequence: moveRight → attack → jump (→ K J). Cost: 35. Type: attack. Compresses Howling Bite into 3-key burst; → aligns fang arc at hook geometry rather than face-on; K triggers fang contact (~40 ms); J fires throw release. dmgMult 1.42× (approachAngleCorrect) ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Fang-layer capture (Case 1601) → MechanicRegistry: combo_strike

---

*(Cases 1604–1609: confirmed gap — not present in source files)*

---

### [Case 1610 — Crash Roktavor 11Reach Wedge — Reach Frame Dual-Angle Spike Counter-Deflection](./13%20case%20study.md#case-1610)

**System**: Burst / Dual Layer  
**Geometry**: Reach disc frame spikes at r_spike ≈ 2.2 cm from axis; h_spike ≈ 0.4 cm total vertical extent (±0.2 cm above/below equatorial plane); spike chamfer δ_spike ≈ 30° from vertical  
**Mechanism**: Intercepts both low and high attacks (within ±0.2 cm of equatorial). Attacker at v_atk = 2.0 m/s: p_atk = 0.070 N·s; deflected sideways 0.035 N·s; counter-reactive 0.061 N·s toward attacker. Torque on Roktavor: τ_counter ≈ 0.268 N·m (5 ms contact). BeySpirit counter-flash [M].  
**Gimmick**: Counter-deflection spike → MechanicRegistry: spike_counter

---

### [Case 1611 — Crash Roktavor 11Reach Wedge — Hurricane Counter](./13%20case%20study.md#case-1611)

**System**: Burst / Dual Layer  
**Blader**: Ranjiro Kiyama  
**Special Move**: Hurricane Counter — activates when opponent approaching at v ≥ 1.0 m/s. attackAngle: equatorial = full spike (spinDelta −45, dmgMult 1.45×); low/high = 85% coverage (spinDelta ~−38, dmgMult 1.20×–1.45×); lockMs 60; powerCost 100; ringOutBonus 0.08.  
**Compatible beys**: Any bey with Reach disc frame (h_spike ≥ 0.3 cm); BeySpirit counter-flash specific to Ranjiro

---

### [Case 1612 — Crash Roktavor 11Reach Wedge — Spike Parry](./13%20case%20study.md#case-1612)

**System**: Burst / Dual Layer  
**Mechanism**: COMBO — Spike Parry. Sequence: moveDown → attack → moveUp (↓ K ↑). Cost: 15. Type: defense or balanced. Compresses Hurricane Counter brace-and-counter into 3-key burst. dmgMult 1.28× (lowApproachBrace) ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Reach frame spike counter (Case 1610)

---

### [Case 1613 — Wild Wyvron Vertical-Orbit / Tempest Wyvron 4Glaive Atomic — Wall-Climb and Stadium-Rim Gravity-Dive](./13%20case%20study.md#case-1613)

**System**: Burst / Dual/God Layer  
**Geometry**: Stadium B-200 outer rim height h_rim ≈ 4.5 cm; stadium radius r_stadium ≈ 19.5 cm  
**Material**: Atomic driver: free-spinning outer ring; μ wall-contact ≈ low (nearly zero spin loss on wall)  
**Mechanism**: Wall-climb to rim → gravity-dive. E_pot = 0.0177 J; v_gravity ≈ 0.939 m/s; v_orbital ≈ 1.225 m/s; v_impact = √(1.225² + 0.939²) ≈ 1.56 m/s (calculated). "Hyper" BeySpirit amplification provides the dramatic crash force.  
**Gimmick**: Wall-ride + gravity-dive → MechanicRegistry: wall_climb_dive  
**Engine Note**: Arena must support wall-height z tracking for rim-climb detection

---

### [Case 1614 — Wild Wyvron / Tempest Wyvron 4Glaive Atomic — Hyper Shield Crash](./13%20case%20study.md#case-1614)

**System**: Burst / Dual/God Layer  
**Blader**: Wakiya Murasaki  
**Special Move**: Hyper Shield Crash — rimClimbed + heightNorm (0–1, max 9.0 cm game-px). dmgMult 1.40×–1.80× [M full rim]; spinDelta −40 to −75; ringOutBonus 0.10–0.30; powerCost 100.  
**Compatible beys**: Any wall-riding tip (Atomic, Orbit, Variable, free-spinning outer ring); Hyper BeySpirit specific to Wakiya / Wyvron constellation

---

### [Case 1615 — Wild Wyvron / Tempest Wyvron 4Glaive Atomic — Rim Rush](./13%20case%20study.md#case-1615)

**System**: Burst / Dual/God Layer  
**Mechanism**: COMBO — Rim Rush. Sequence: moveUp → moveUp → attack (↑ ↑ K). Cost: 25. Type: stamina or defense. Double ↑ achieves ~70% rim height (h ≈ 3.15 cm); v_gravity ≈ 0.78 m/s. dmgMult 1.40× (doubleClimbCompleted) ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Wall-climb gravity-dive (Case 1613)

---

### [Case 1616 — Dragoon V (Dragoon Victory) / Dragoon V2 — Dragoon Wing AR Multi-Vortex Rotating Wake Generation](./13%20case%20study.md#case-1616)

**System**: Plastic Generation / Magnetic Core  
**Geometry**: Wing AR outer tip radius r_AR ≈ 2.2 cm; launch spin ω_launch ≈ 523.6 rad/s (≈ 5,000 RPM); 4–5 wing protrusions  
**Mechanism**: v_tip = 11.5 m/s; Γ = 1.59 m²/s; ΔP_core ≈ 79.4 Pa. v_θ(2.5 cm) ≈ 10.1 m/s > 8.28 m/s ejection threshold — physical ring-out capability without BeySpirit. Sub-vortex shedding frequency ≈ 417 Hz creating helical multi-vortex wake. [M]: tornado cloaking visual; multi-opponent effect; tornado propulsion direction.  
**Gimmick**: Vortex wake generation → MechanicRegistry: rankine_vortex

---

### [Case 1617 — Dragoon V (Dragoon Victory) — Victory Tornado](./13%20case%20study.md#case-1617)

**System**: Plastic Generation  
**Blader**: Tyson Granger  
**Special Move**: Victory Tornado — launchSpin × spinFactor: dmgMult 1.50×–1.80×; spinDelta −50 to −80; ringOutBonus 0.35–0.60 (physical above ejection threshold at peak spin); aoeRadius 60px (multiVortexMode [M]); powerCost 100.  
**Compatible beys**: Wing-profile AR ≥ 4 protrusions at r_AR ≥ 2.0 cm, ω ≥ 450 rad/s; multi-vortex + multi-target requires Tyson's Dragoon BeySpirit

---

### [Case 1618 — Dragoon V (Dragoon Victory) — Twister Rush](./13%20case%20study.md#case-1618)

**System**: Plastic Generation  
**Mechanism**: COMBO — Twister Rush. Sequence: attack → moveUp → jump (K ↑ J). Cost: 15. Type: attack or balanced. K initial wing-tip contact (Γ_combo ≈ 0.48 m²/s, ~30% of full); ↑ spiral ascent; J strike at apex. dmgMult 1.35× (wingContactConfirmed) ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Dragoon wing AR vortex (Case 1616)

---

### [Case 1619 — Dragoon V2 — Dragoon V2 Enhanced Wing AR Hyper-Vortex Amplification](./13%20case%20study.md#case-1619)

**System**: Plastic Generation  
**Geometry**: Enhanced AR r_AR_V2 ≈ 2.5 cm (+3 mm vs Dragoon V's 2.2 cm)  
**Mechanism**: v_tip_V2 = 13.1 m/s (+13.9%); Γ_V2 = 2.06 m²/s (+29.6%); ΔP_V2 ≈ 103.0 Pa (+29.7%); v_θ(2.5 cm) ≈ 13.1 m/s; F_aero ≈ 0.257 N (67% stronger than V). [M] — Red-glow BeySpirit surge (higher activation tier). Physical upgrade (+29%) is foundation; "Hyper" = BeySpirit ×1.20 multiplier.  
**Gimmick**: Enhanced vortex amplification → MechanicRegistry: rankine_vortex (V2 variant)

---

### [Case 1620 — Dragoon V2 — Hyper Victory Tornado](./13%20case%20study.md#case-1620)

**System**: Plastic Generation  
**Blader**: Tyson Granger  
**Special Move**: Hyper Victory Tornado — hyperCharge (red-glow BeySpirit ×1.20): dmgMult up to 2.0×; spinDelta −55 to −108 [M]; ringOutBonus up to 0.90; powerCost 120 (hyperCharge) / 105. Used against Ozuma (Flash Leopard), Cyber Dragoon, Burning Cerberus.  
**Compatible beys**: Dragoon V2 Enhanced AR (r_AR ≥ 2.4 cm) at plastic-gen speeds; red-glow BeySpirit specific to Tyson's Dragoon V2 bond

---

### [Case 1621 — Dragoon V2 — Hyper Twister](./13%20case%20study.md#case-1621)

**System**: Plastic Generation  
**Mechanism**: COMBO — Hyper Twister. Sequence: moveRight → moveUp → jump (→ ↑ J). Cost: 25. Type: attack. Diagonal → ↑ compound approach with V2 larger wing surface. dmgMult 1.45× (diagonalApproach) ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Dragoon V2 enhanced vortex (Case 1619)

---

### [Case 1622 — Jade Jupiter S130RB — Jupiter Fusion Wheel Macro-Vortex and Beast-Summoned Electromagnetic Spin Drain](./13%20case%20study.md#case-1622)

**System**: Metal Fight Beyblade (MFB) 4D  
**Geometry**: Jupiter Fusion Wheel r_Jupiter ≈ 3.8 cm; m_JJ ≈ 52 g total assembly  
**Material**: RB = Rubber Ball tip — full rubber sphere, μ ≈ 0.40–0.50, maintains stadium-centre position  
**Mechanism**: At ω = 293 rad/s: v_tip = 11.1 m/s; Γ_JJ = 2.65 m²/s; ΔP ≈ 74.0 Pa; v_θ(2.5 cm) ≈ 16.9 m/s >> 8.28 m/s. F_aero ≈ 0.43 N — physical ring-out without BeySpirit. Phase 2: Jupiter Beast [M]; Phase 3: blue lightning spin drain [M] (eddy-current basis; BeySpirit scale reduces 600 rad/s → 0 in ~0.5 s).  
**Gimmick**: Macro-vortex + electromagnetic spin drain → MechanicRegistry: rankine_vortex + spin_drain

---

### [Case 1623 — Jade Jupiter S130RB — Grand Lightning](./13%20case%20study.md#case-1623)

**System**: MFB 4D  
**Blader**: Dynamis  
**Special Move**: Grand Lightning — beastSummoned (Phase 2): spinDelta up to −195 [M spin-to-zero]; dmgMult up to 2.0×; lockMs 200 (Beast grip); ringOutBonus up to 0.65; powerCost 120 (Beast) / 105. Anime: purple cyclone spirals to outer space; Jupiter Beast summons blue lightning depleting opponent spin entirely.  
**Compatible beys**: Large-radius fusion wheel r_wheel ≥ 3.5 cm, Γ ≥ 2 m²/s; Beast emergence and spin-zero lightning specific to Dynamis / god-of-planet BeySpirit

---

### [Case 1624 — Jade Jupiter S130RB — Jupiter Strike](./13%20case%20study.md#case-1624)

**System**: MFB 4D  
**Mechanism**: COMBO — Jupiter Strike. Sequence: moveDown → attack → jump (↓ K J). Cost: 35. Type: stamina. ↓ → RB stable centre approach; K lightning-contact (mini spin drain ~35 units); J radial push. dmgMult 1.48× (centrePositionHeld) ≤ 1.5 ✓; lockMs 160 ≤ 300 ✓.  
**Gimmick**: Parent: Jupiter macro-vortex + spin drain (Case 1622)

---

### [Case 1625 — Evil Gemios DF145FS — DF145 Defense Frame Counter-Deflection Sword Strike](./13%20case%20study.md#case-1625)

**System**: Metal Fight Beyblade (MFB) / Metal Masters  
**Geometry**: DF145 defense ring at r_DF ≈ 2.0 cm, h_DF = 1.45 cm; defense ring chamfer δ_DF ≈ 25° from vertical; Gemios AR twin-blade protrusions at r_blade ≈ 2.2 cm, angled ~25° from vertical  
**Material**: FS tip (Flat Sharp) — Flat mode: r_contact ≈ 0.4 cm, μ ≈ 0.35  
**Mechanism**: m_EG ≈ 37 g. Attacker p_atk = 0.076 N·s; p_side = 0.032 N·s; p_counter = 0.069 N·s (toward attacker). Above-equatorial contact engages upper layer (upper smash KE / Burst tab compression). BeySpirit: icy blue crackle energy [M].  
**Gimmick**: Above-equatorial counter-deflection → MechanicRegistry: spike_counter (above-equatorial variant)

---

### [Case 1626 — Evil Gemios DF145FS — Icicle Edge](./13%20case%20study.md#case-1626)

**System**: MFB / Metal Masters  
**Blader**: Evil Gemios (Ice Twin)  
**Special Move**: Icicle Edge — counter mode (contactInitiatedByOpponent required). contactHeight "upper" (h = 1.45 cm): dmgMult 1.61× [M]; equatorial: 1.40×; lower: 1.19×. spinDelta −41 to −55; lockMs 70; powerCost 100.  
**Compatible beys**: DF145 track + twin-face AR at r_blade ≥ 2.0 cm; full BeySpirit counter requires Evil Gemios dark energy

---

### [Case 1627 — Evil Gemios DF145FS — Ice Counter](./13%20case%20study.md#case-1627)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Ice Counter. Sequence: moveLeft → attack → attack (← K K). Cost: 15. Type: defense or balanced. ← positions DF145 defense face; K1 = first sword counter (DF145 deflect + 0.069 N·s); K2 = second blade sweep follow-through. dmgMult 1.32× (dfContactFirst) ≤ 1.5 ✓; lockMs 90 ≤ 300 ✓.  
**Gimmick**: Parent: DF145 counter-deflection (Case 1625)

---

### [Case 1628 — Command Dragon Ignition' (also Master Dragon Ignition') — Ignition' Driver Spring-Clutch Progressive Acceleration and Direction-Reversal](./13%20case%20study.md#case-1628)

**System**: Burst / GT Layer  
**Mechanism**: Ignition' tip spring-clutch engages at ω_threshold ≈ 220 rad/s; k_spring ≈ 0.45 N/mm; at ω = 400 rad/s: F_thrust ≈ 0.086 N → a_boost ≈ 1.32 m/s² → Δv ≈ 0.40 m/s over 0.3 s. At peak ω = 630 rad/s: a_boost ≈ 2.08 m/s². Direction-reversal: contact ring detaches at ω_release ≈ 180 rad/s, re-engages reversed in ~0.10–0.15 s. [M] amplifies beyond spring limits.  
**Gimmick**: Spring-clutch acceleration + direction reversal → MechanicRegistry: ignition_clutch  
**Engine Note**: Must support bey translational velocity boost and direction-flip mechanic

---

### [Case 1629 — Command Dragon Ignition' / Master Dragon Ignition' — Ignition Force (Ignition Boost)](./13%20case%20study.md#case-1629)

**System**: Burst / GT Layer  
**Blader**: Dante Koryu  
**Special Move**: Ignition Force — mode "boost": dmgMult 1.35×–1.80× [M]; ringOutBonus 0.12–0.30; velocityBoost up to 40 px/s; powerCost 100. mode "reversal": dmgMult 1.25×; lockMs 120 (direction-flip grip); velocityBoost −30 (direction reversed); powerCost 100.  
**Compatible beys**: Any Ignition' performance tip; BeySpirit surge specific to Dante Koryu's Dragon bond

---

### [Case 1630 — Command Dragon Ignition' / Master Dragon Ignition' — Ignition Dash](./13%20case%20study.md#case-1630)

**System**: Burst / GT Layer  
**Mechanism**: COMBO — Ignition Dash. Sequence: moveRight → moveUp → attack (→ ↑ K). Cost: 15. Type: attack or balanced. → pre-loads Ignition' clutch (~40 ms); ↑ replicates direction-reversal re-engage on new vector; K fires compound diagonal strike. dmgMult 1.36× (clutchPreloaded) ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Ignition' spring-clutch (Case 1628)

---

### [Case 1631 — Scythe Kronos T125EDS — Scythe Fusion Wheel Macro-Vortex Ring Wall and Outward-Push Defense](./13%20case%20study.md#case-1631)

**System**: MFB 4D  
**Geometry**: Scythe Fusion Wheel r_Scythe ≈ 4.2 cm; m_Scythe_metal ≈ 37.8 g; I_coupled = 3.418×10⁻⁵ kg·m²  
**Material**: EDS tip (Eternal Defense Sharp): free-spinning outer ring, spin-absorbed during contact  
**Mechanism**: At ω = 314 rad/s: v_tip = 13.2 m/s; Γ_SK = 3.48 m²/s; v_θ(2.5 cm) ≈ 22.1 m/s. F_aero ≈ 0.734 N (7.1× friction threshold). Physical ring-out at close proximity without [M]. Defensive headwind: F_headwind = 0.734 N decelerates 2.0 m/s attacker to 0 in ~0.10 s. [M]: stadium-wide vortex columns.  
**Gimmick**: Macro-vortex ring wall + attack deflection → MechanicRegistry: rankine_vortex + deflect_field

---

### [Case 1632 — Scythe Kronos T125EDS — Iron Wall Fist](./13%20case%20study.md#case-1632)

**System**: MFB 4D  
**Blader**: Aguma  
**Special Move**: Iron Wall Fist — defensiveStance (deflect mode): deflectBonus 0.30–0.70, minimal dmg; outward push mode: dmgMult 1.20×–1.80× [M]; ringOutBonus up to 0.80; powerCost 105. Physical vortex at close range grounded; stadium-wide push is [M].  
**Compatible beys**: Fusion Wheel r_wheel ≥ 3.5 cm, F_aero ≥ 0.30 N at proximity; stadium-wide storm specific to Aguma / Scythe Kronos BeySpirit. Similar in principle to Dashan Wang's Solid Iron Wall.

---

### [Case 1633 — Scythe Kronos T125EDS — Stone Cyclone](./13%20case%20study.md#case-1633)

**System**: MFB 4D  
**Mechanism**: COMBO — Stone Cyclone. Sequence: moveUp → attack → moveDown (↑ K ↓). Cost: 25. Type: stamina or defense. ↑ orbital approach (Γ_combo ≈ 1.05 m²/s, ~30% of full); K vortex-push contact; ↓ post-contact return. dmgMult 1.38× (orbitalArcPreloaded) ≤ 1.5 ✓; lockMs 130 ≤ 300 ✓; deflectBonus 0.12.  
**Gimmick**: Parent: Scythe macro-vortex (Case 1631)

---

*(Cases 1634–1642: confirmed gap — not present in source files)*

---

### [Case 1643 — Rock Leone 145WB — Leone Metal Wheel Rankine Vortex + WB Tip Dynamics (Leone Tornado Baseline)](./13%20case%20study.md#case-1643)

**System**: Metal Fight Beyblade (MFB) / Metal Fusion  
**Geometry**: Leone metal wheel: m_L = 34 g, r_L = 2.3 cm, three major asymmetric fang protrusions at ~120° spacing; Rock clear wheel: m_R = 3 g; 145 spin track: h = 1.45 cm; I ≈ 1.35×10⁻⁵ kg·m²; m_total = 42 g  
**Material**: WB (Wide Ball) tip — rubber hemisphere r_WB = 1.1 cm, μ_WB ≈ 0.45 (rubber-on-ABS)  
**Spin Coupling**: rigid  
**Mechanism**: ω₀ = 250 rad/s (≈ 2,388 RPM); v_tip = 5.75 m/s; Γ = 0.831 m²/s. v_θ_max = 5.75 m/s < 8.0 m/s ring-out threshold — physical vortex cannot ring-out. [M] factor needed: ≥ 1.39×. Debris lift requires [M] ≈ 3.85×. WB spin decay: dω/dt = −151 rad/s²; time to 50% spin ≈ 0.83 s.  
**Gimmick**: Rankine vortex baseline → MechanicRegistry: rankine_vortex (Leone foundation; referenced by Cases 1644–1660)  
**Engine Note**: This is the baseline case for all Kyoya Leone tornado moves

---

### [Case 1644 — Rock Leone 145WB — Lion 100 Fang Fury](./13%20case%20study.md#case-1644)

**System**: MFB / Metal Fusion  
**Blader**: Kyoya Tategami  
**Special Move**: Lion 100 Fang Fury — second special move (rock-debris tornado). [M] = 3.85× → v_θ_debris = 22.1 m/s; rock fragment v_projectile ≈ 7.4 m/s; F_debris ≈ 222 N per rock [M]. stadiumHasDebris: dmgMult 1.65× base, spinDelta −65 × spin; lockMs 220; aoePushRadius 0.18 m. powerCost 75. Minimal effect vs Dark Wolf (defensive advantage overcomes debris); significant effect vs Earth Eagle, Damian.  
**Compatible beys**: Leone wheel or wide metal wheel with equivalent circulation

---

### [Case 1645 — Rock Leone 145WB — Fang Cyclone](./13%20case%20study.md#case-1645)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Fang Cyclone. Sequence: moveDown → moveRight → attack (↓ → K). Cost: 25. Type: attack. ↓ orbital approach (v_θ_combo ≈ 1.8 m/s); → angles fang flank contact; K at orbital apex. dmgMult 1.42× (approachArcComplete) ≤ 1.5 ✓; lockMs 160 ≤ 300 ✓.  
**Gimmick**: Parent: Rock Leone vortex baseline (Case 1643)

---

### [Case 1646 — Rock Leone 145WB — Ballistic Tornado-Cocoon Trajectory + Steerable Multi-Pass (King Lion Furious Blast Shot Mechanism)](./13%20case%20study.md#case-1646)

**System**: MFB / Metal Fusion  
**Mechanism**: Bey-as-projectile inside self-generated vortex cocoon. Physical Magnus lift insufficient (F_Magnus = 0.138 N vs weight 0.412 N). [M] = 3.0× required for levitation. Airborne at v_0 ≈ 6 m/s at θ = 45°: range R ≈ 3.67 m; flight time ≈ 0.864 s; h_max ≈ 0.92 m. Multi-pass steering via BeySpirit lateral impulse; each pass J_impact ≈ 0.231 N·s [M]; 3-pass total ≈ 0.589 N·s.  
**Gimmick**: Ballistic launch + aerial multi-pass → MechanicRegistry: ballistic_launch  
**Engine Note**: Must support airborne bey trajectory arc and multi-pass re-direction

---

### [Case 1647 — Rock Leone 145WB — King Lion Furious Blast Shot](./13%20case%20study.md#case-1647)

**System**: MFB / Metal Fusion  
**Blader**: Kyoya Tategami  
**Special Move**: King Lion Furious Blast Shot — passCount (1–3): dmgMult up to 2.20× (capped); ringOutForce 0.62× spinRatio × passMulti; lockMs 300; powerCost 120. 3 passes total impulse ≈ 0.589 N·s [M]. Visual: white-green aerial tornado reaching several metres. Used against Ryuga's dark powered form.  
**Compatible beys**: Leone-type bey; [M] BeySpirit provides vortex-cocoon lift, steerable heading correction, cocoon integrity

---

### [Case 1648 — Rock Leone 145WB — Blast Rush](./13%20case%20study.md#case-1648)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Blast Rush. Sequence: moveDown → moveDown → attack (↓ ↓ K). Cost: 35. Type: attack. Double ↓ run-up → launch-ramp velocity v_approach ≈ 2.1 m/s; K fires upward-angled impact. dmgMult 1.48× (doubleDownComplete) ≤ 1.5 ✓; lockMs 200 ≤ 300 ✓; ringOutBonus 0.18.  
**Gimmick**: Parent: Ballistic tornado-cocoon (Case 1646)

---

### [Case 1649 — Rock Leone 145WB — Triple Vortex Superposition via Leone 3-Fold Fang Symmetry + Orbit Ejection (King Lion Tearing Blast Mechanism)](./13%20case%20study.md#case-1649)

**System**: MFB / Metal Fusion  
**Mechanism**: Three fang protrusions at ~120° spacing generate co-rotating vortex triplets. Γ_vane = 0.277 m²/s each; Ω_triplet ≈ 125.2 rad/s. Physical triple-contact: J_total ≈ 0.603 N·s. [M] = 1.4× → v_θ = 8.05 m/s ≥ ring-out threshold. 5-mobile-tornado True version = fang-tip vortex shedding at higher spin (see Case 1652).  
**Gimmick**: Triple vortex superposition + orbit ejection → MechanicRegistry: multi_vortex

---

### [Case 1650 — Rock Leone 145WB — King Lion Tearing Blast](./13%20case%20study.md#case-1650)

**System**: MFB / Metal Fusion  
**Blader**: Kyoya Tategami  
**Special Move**: King Lion Tearing Blast — vortexCount (3 base / 5 True), mobile (True version). [M] J_total ≈ 0.844 N·s → v_eject ≈ 18.8 m/s for 45 g opponent; dmgMult up to 2.50× (True/mobile); lockMs 350; powerCost 100; aoeCount = vortexCount. First used in "Heated Battle! Gingka Versus Kyoya"; upgraded to True (5 mobile tornadoes) in "Eternal Rivals."  
**Compatible beys**: Leone-type bey with 3-fold fang geometry; True version requires Kyoya's advanced BeySpirit training

---

### [Case 1651 — Rock Leone 145WB — Tearing Surge](./13%20case%20study.md#case-1651)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Tearing Surge. Sequence: attack → moveRight → attack (K → K). Cost: 35. Type: attack. K→K two-strike around lateral arc: first K blade hit + vortex pre-load; → arc maintains blade contact (~60 ms); second K re-strikes fresh face. Combined two-hit total spinDelta ~1.65× single hit. dmgMult 1.47× (arcComplete) ≤ 1.5 ✓; lockMs 190 ≤ 300 ✓.  
**Gimmick**: Parent: Triple vortex superposition (Case 1649)

---

### [Case 1652 — Rock Leone 145WB — Quintet Vortex Lattice + Mobile Vortex Steering (True King Lion Tearing Blast Mechanism)](./13%20case%20study.md#case-1652)

**System**: MFB / Metal Fusion  
**Mechanism**: Two additional vortex filaments from edge-shedding at elevated [M] spin (ω_[M] > 350 rad/s). 3 tip vortices (Γ = 0.277 m²/s each) + 2 edge-shed (0.139 m²/s each) + 1 central merger (0.208 m²/s) = 5 total. Γ_total = 1.317 m²/s (1.58× triple-vortex). Mobile tracking: BeySpirit provides vortex-steering at tracking speed up to 20 m/s [M]. "Learned how a tornado is created and mastered it completely."  
**Gimmick**: Quintet vortex lattice → MechanicRegistry: multi_vortex (quintet variant)

---

### [Case 1653 — Rock Leone 145WB — True King Lion Tearing Blast](./13%20case%20study.md#case-1653)

**System**: MFB / Metal Fusion  
**Blader**: Kyoya Tategami  
**Special Move**: True King Lion Tearing Blast — 5 mobile tornadoes. activeVortices (1–5): dmgMult up to 2.80×; spinDelta up to −100 × vMult; lockMs 400; powerCost 130; ringOutForce 0.92 × vMult. J_quintet_[M] ≈ 2.00 N·s. First used in "Eternal Rivals." Kyoya's BeySpirit provides quintet shedding, active tracking, and independent vortex control.  
**Compatible beys**: Rock Leone 145WB only (requires Kyoya's specific mastery level)

---

### [Case 1654 — Rock Leone 145WB — True Storm](./13%20case%20study.md#case-1654)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — True Storm. Sequence: moveRight → attack → moveRight (→ K →). Cost: 35. Type: attack. → pre-loads edge vortex (Γ_edge_combo ≈ 0.08 m²/s); K fires primary blade hit; second → generates trailing shed vortex ring curving back ~120 ms later (secondary push "mobile" effect). dmgMult up to 1.50× ≤ 1.5 ✓; lockMs up to 300 ≤ 300 ✓.  
**Gimmick**: Parent: Quintet vortex lattice (Case 1652)

---

### [Case 1655 — Rock Leone 145WB / Fang Leone 130W2D — Inverted Gyroscope CW Vortex + Counter-Spin Torque + Vertical Drop Strike](./13%20case%20study.md#case-1655)

**System**: MFB / Metal Fusion + Metal Fury  
**Mechanism**: Leone flips upside down (angular impulse ΔL = 6.75×10⁻³ kg·m²/s; [M] = 10× torque for t_flip = 0.16 s). Inverted CW vortex vs CCW opponent: v_θ_effective = 11.75 m/s (additive CW-on-CCW) > 8.0 m/s ring-out threshold WITHOUT [M]. Counter-spin torque: Δω_opp = 1062 rad/s² (near-instant spin kill). Drop from h_apex = 2.0 m [M]: v_impact = 6.95 m/s; J_drop = 0.268 N·s.  
**Gimmick**: Inversion + CW counter-vortex → MechanicRegistry: counter_spin_inversion  
**Engine Note**: Must support bey inversion state, CW/CCW spin interaction, and z-axis drop impact

---

### [Case 1656 — Rock Leone 145WB / Fang Leone 130W2D — King Lion Reverse Wind Strike](./13%20case%20study.md#case-1656)

**System**: MFB / Metal Fusion + Metal Fury  
**Blader**: Kyoya Tategami  
**Special Move**: King Lion Reverse Wind Strike — inversionComplete + cwVortexEngaged: spinDelta up to −110 × spinRatio; dmgMult up to 2.30×; lockMs 320; powerCost 110; counterSpinBonus 0.85. CW counter-spin torque physically real (no [M] needed for spin-kill); only inversion and levitated drop require BeySpirit. First used in "The Shocking Wild Fang" (defeat Salhan). Strongest Leone move before King Lion Crushing Fang.  
**Compatible beys**: Leone-type (both Rock Leone 145WB and Fang Leone 130W2D)

---

### [Case 1657 — Rock Leone 145WB / Fang Leone 130W2D — Reverse Fang](./13%20case%20study.md#case-1657)

**System**: MFB / Metal Fusion + Metal Fury  
**Mechanism**: COMBO — Reverse Fang. Sequence: moveUp → attack → moveUp (↑ K ↑). Cost: 25. Type: attack. ↑ sets ~30° overhead approach angle (no full inversion); K contact from above; second ↑ retreat. F_z_combo = 0.085 N downward component destabilizes opponent balance. dmgMult 1.42× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓; destabilizeBonus 0.35.  
**Gimmick**: Parent: Inverted CW vortex (Case 1655)

---

### [Case 1658 — Fang Leone 130W2D — Funnel Vortex Updraft Capture + Vertical Lift + Overhead Plunge Impact Explosion](./13%20case%20study.md#case-1658)

**System**: MFB / Metal Fury  
**Geometry**: 130 track: h = 1.30 cm; W2D tip: r_W2D ≈ 1.3 cm, μ ≈ 0.20; m_FL ≈ 42 g  
**Mechanism**: Phase 1 — funnel updraft lifts opponent ([M] = 19× to achieve v_z = 13.1 m/s for F_lift = 0.412 N). Phase 2 — Leone ascends inside funnel to apex h = 2.0 m [M]. Phase 3 — drop from h_apex = 0.5 m above lifted opponent: v_drop = 3.13 m/s; F_impact = 131.5 N; BeySpirit explosion disperses tornado.  
**Gimmick**: Funnel capture + overhead plunge → MechanicRegistry: funnel_capture_slam  
**Engine Note**: Requires lifted-opponent z-state and explosion-radius dispersion mechanic

---

### [Case 1659 — Fang Leone 130W2D — King Lion Crushing Fang](./13%20case%20study.md#case-1659)

**System**: MFB / Metal Fury  
**Blader**: Kyoya Tategami  
**Special Move**: King Lion Crushing Fang — funnelCapture: dmgMult up to 3.0×; spinDelta up to −130; lockMs 500; powerCost 150; ringOutForce 1.10; explosionRadius 0.25 m. Direct charge (no funnel): dmgMult up to 2.20×; lockMs 280; powerCost 150. Ultimate move; BeySpirit provides ×19 updraft, levitation, and terminal explosion.  
**Compatible beys**: Fang Leone 130W2D primary; Rock Leone 145WB for simplified direct charge variant

---

### [Case 1660 — Fang Leone 130W2D — Crushing Descent](./13%20case%20study.md#case-1660)

**System**: MFB / Metal Fury  
**Mechanism**: COMBO — Crushing Descent. Sequence: moveUp → moveUp → attack (↑ ↑ K). Cost: 35. Type: attack. ↑↑ steepens to ~45° approach; K overhead contact with F_z_combo = 0.131 N downward; overheadBonus 0.20 ring-out force. dmgMult 1.49× ≤ 1.5 ✓; lockMs 210 ≤ 300 ✓.  
**Gimmick**: Parent: Funnel vortex overhead plunge (Case 1658)

---

### [Case 1661 — Vanish Fafnir Tapered Kick-3 — Kick Driver Spring-Disc Upper-Attack + Gyroscopic Heading Change](./13%20case%20study.md#case-1661)

**System**: Burst / Sparking  
**Geometry**: Kick-3 driver spring disc r_disc = 1.8 cm; k ≈ 1,200 N/m; x₀ = 0.25 cm; E_spring = 3.75×10⁻³ J  
**Mechanism**: Upper attack impulse: J_z = 0.0162 N·s; v_z_opponent = 0.427 m/s; h = 9.3 mm [physical]. [M] → v_z up to 3–5 m/s (airborne). Gyroscopic heading change: δφ = 10.4° per trigger [physical] → up to 90° with BeySpirit [M]. Contact time t_c ≈ 10.8 ms (spring-mass half-period).  
**Gimmick**: Spring-disc upper attack + heading change → MechanicRegistry: spring_disc_kick

---

### [Case 1662 — Vanish Fafnir Tapered Kick-3 — Kick Counter](./13%20case%20study.md#case-1662)

**System**: Burst / Sparking  
**Blader**: Free De La Hoya  
**Special Move**: Kick Counter — springPreloaded + counterTriggered: dmgMult 1.85×; spinDelta −50; lockMs 180; powerCost 70; headingChangeDeg 75. Physical: J_z = 0.0162 N·s, δφ = 10.4°. BeySpirit scales both effects to anime-visible levels. Counter-activated (opponent must initiate contact).  
**Compatible beys**: Any bey with Kick driver (Kick-3, Kick); direction-change most effective on stamina/balanced beys

---

### [Case 1663 — Vanish Fafnir Tapered Kick-3 — Spring Kick](./13%20case%20study.md#case-1663)

**System**: Burst / Sparking  
**Mechanism**: COMBO — Spring Kick. Sequence: moveUp → attack → moveRight (↑ K →). Cost: 15. Type: defense or stamina. ↑ elevates to ideal spring-disc angle; K spring contact (J_z_combo ≈ 0.011 N·s); → exits with ~5.2° heading change. dmgMult 1.38× (contactAngleCorrect) ≤ 1.5 ✓; lockMs 120 ≤ 300 ✓; headingChangeDeg 12.  
**Gimmick**: Parent: Kick driver spring disc (Case 1661)

---

### [Case 1664 — Wind Aquario 100HF/S — HF/S Dual-Mode Rapid Direction Switch: Multi-Apparent-Position Illusion + BeySpirit Wave](./13%20case%20study.md#case-1664)

**System**: MFB / Metal Fusion  
**Material**: HF (Hole Flat) mode: annular r_inner ≈ 0.2 cm, r_outer ≈ 0.8 cm, erratic path r_path ≈ 2.0–3.5 cm; S (Spike) mode: r_contact ≈ 0.1 cm, stable centre  
**Mechanism**: HF erratic path: v_lateral_max ≈ 0.369 m/s; r_path_physical ≈ 1.8 cm. Ghost illusion: [M] = 41× required (N_apparent_physical = 0.17 vs N_ghost = 7–8). Sunlight counter: glint detection reveals true bey position (physical distinction — Gingka's countermeasure). Wave component: Water-element BeySpirit [M].  
**Gimmick**: Dual-mode illusion + wave → MechanicRegistry: dual_mode_illusion

---

### [Case 1665 — Wind Aquario 100HF/S — Infinite Assault](./13%20case%20study.md#case-1665)

**System**: MFB / Metal Fusion  
**Blader**: Hikaru Hasama  
**Special Move**: Infinite Assault — ghostCount (1–8) + waveCharged + opponentSeesThrough. confusionMult = 1 + ghostCount×0.08 (or 0.6 if seen through); dmgMult 1.75× (wave + max ghosts); spinDelta −55; lockMs 200; evasionBonus ghostCount×0.12; powerCost 85. [M]: ×41 ghost-image projection; Water-element wave entirely [M].  
**Compatible beys**: Wind Aquario 100HF/S only; Water BeySpirit (Hikaru) provides wave component

---

### [Case 1666 — Wind Aquario 100HF/S — Ghost Rush](./13%20case%20study.md#case-1666)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Ghost Rush. Sequence: moveRight → moveLeft → attack (→ ← K). Cost: 25. Type: stamina. →← rapid reversal in HF mode creates ~180 ms position ambiguity; K from ambiguous zone reduces opponent dodge probability. dmgMult 1.40× (hfModeActive) ≤ 1.5 ✓; lockMs 140 ≤ 300 ✓; evasionNegate 0.35.  
**Gimmick**: Parent: HF/S dual-mode erratic path (Case 1664)

---

### [Case 1667 — Infinite Achilles Dimension' 1B — Infinite Ring Attack Mode: 4-Blade Sequential Impulse Train](./13%20case%20study.md#case-1667)

**System**: Burst / DB  
**Geometry**: Infinite Ring Attack Mode: 4 Infinite Sword blades at 90° spacing, r_blade ≈ 3.8 cm; h_blade ≈ 0.5 cm; A_blade ≈ 4×10⁻⁵ m²; m_Achilles ≈ 66 g; I ≈ 2.1×10⁻⁵ kg·m²  
**Mechanism**: At ω = 320 rad/s: v_blade = 12.16 m/s. Single blade J₁ = 0.404 N·s (v_rel = 10.16 m/s). 4-blade diminishing train: J_total ≈ 0.562 N·s; Δω_opp = 865 rad/s [physical, above launch spin of most beys — physically capable of stopping opponent without [M]].  
**Gimmick**: 4-blade impulse train → MechanicRegistry: impulse_train_burst

---

### [Case 1668 — Infinite Achilles Dimension' 1B — Infinite Breaker](./13%20case%20study.md#case-1668)

**System**: Burst / DB  
**Blader**: Aiger Akabane  
**Special Move**: Infinite Breaker — bladeCount (1–4): dmgMult up to 2.60×; spinDelta up to −120 × spinRatio × bladeMult; lockMs 350; powerCost 110; burstBonus up to 0.45. Physical J_total = 0.562 N·s; [M] flames ×1.5 → J_[M] = 0.843 N·s. Peak iteration of Z/Turbo/Unison Breaker lineage.  
**Compatible beys**: Infinite Achilles Dimension' 1B or Master Dragon Ignition'; [M] fire-element BeySpirit (Aiger)

---

### [Case 1669 — Infinite Achilles Dimension' 1B — Quad Blade](./13%20case%20study.md#case-1669)

**System**: Burst / DB  
**Mechanism**: COMBO — Quad Blade. Sequence: moveRight → moveRight → attack (→ → K). Cost: 25. Type: attack. →→ double-advance aligns leading blade face perpendicular to target; K fires single first-blade contact (~85% of J₁ = 0.343 N·s); ~40% of full Δω_opp. dmgMult 1.46× (alignmentCorrect) ≤ 1.5 ✓; lockMs 185 ≤ 300 ✓; burstBonus 0.25.  
**Gimmick**: Parent: Infinite Ring 4-blade impulse train (Case 1667)

---

### [Case 1670 — Infinite Achilles Dimension' 1B — Infinite Ring Defense Mode: Infinite Shield Short-Edge Deflection + Return Damage](./13%20case%20study.md#case-1670)

**System**: Burst / DB  
**Geometry**: Defense Mode: ring rotated to short-edge profile; r_shield = 4.0 cm; e_shield ≈ 0.80 (near-elastic); A_shield ≈ 6×10⁻⁵ m²  
**Mechanism**: J_atk = 0.20 N·s (moderate attack); J_reflected = 0.160 N·s back to attacker; Δω_atk_return = 271 rad/s; Achilles loses only 76.2 rad/s. Exchange ratio: 3.56:1 in Achilles' favour [physical]. [M] e_shield → 0.95: ratio ≈ 5.7:1.  
**Gimmick**: Elastic shield reflection + return damage → MechanicRegistry: shield_reflect

---

### [Case 1671 — Infinite Achilles Dimension' 1B — Infinite Guard](./13%20case%20study.md#case-1671)

**System**: Burst / DB  
**Blader**: Aiger Akabane  
**Special Move**: Infinite Guard — shieldActive: dmgReturn 1.60×; achillesSpinDelta −(incomingImpulse×1800); attackerSpinDelta −(j_ret×21000); lockMs 200; powerCost 80. Physical 3.56:1 exchange ratio fully real; BeySpirit elevates e_shield → near 0.95. Peak defensive form of Z/Turbo/Unison Defense lineage.  
**Compatible beys**: Infinite Achilles Dimension' 1B; Defense Mode must be active

---

### [Case 1672 — Infinite Achilles Dimension' 1B — Shield Return](./13%20case%20study.md#case-1672)

**System**: Burst / DB  
**Mechanism**: COMBO — Shield Return. Sequence: attack → attack → moveRight (K K →). Cost: 25. Type: defense. K1 = passive brace (shield face presented); K2 = active return pulse (reflects absorbed impulse); → = rebound carry-through. achillesSpinDelta −12 (shieldFacePresented); attackerSpinDelta −40; dmgReturn 1.38× ≤ 1.5 ✓; lockMs 130 ≤ 300 ✓.  
**Gimmick**: Parent: Infinite Shield deflection (Case 1670)

---

### [Case 1673 — Death Quetzalcoatl 125RDF — RDF Rubber-Flat Spin Acceleration + Quetzalcoatl Beast Counter-Endurance Dual Mode](./13%20case%20study.md#case-1673)

**System**: MFB / Metal Masters  
**Geometry**: Death Quetzalcoatl wheel: r_DQ = 2.2 cm, m_DQ ≈ 35 g; 125 track: h = 1.25 cm; RDF tip: r_inner ≈ 0.3 cm, r_outer ≈ 0.9 cm, μ_RDF ≈ 0.65; m_total = 40 g; I ≈ 1.2×10⁻⁵ kg·m²  
**Mechanism**: RDF traction acceleration: F_traction = 0.0222 N; a_orbital = 0.556 m/s²; v_orb: 1.5 → 2.06 m/s over 1s pre-charge. J_impact_physical = 0.128 N·s. Beast endurance: f_abs = 0.30 [M]; Beast counter: Δω_DQ = +40 rad/s [M].  
**Gimmick**: RDF traction + Beast dual-mode → MechanicRegistry: rubber_traction_counter

---

### [Case 1674 — Death Quetzalcoatl 125RDF — Ishtar Impact](./13%20case%20study.md#case-1674)

**System**: MFB / Metal Masters  
**Blader**: Tithi  
**Special Move**: Ishtar Impact — speedBuilt + beastManifestation + incomingAttack: dmgMult up to 2.10×; spinDelta −65 × speedBonus; lockMs 250; powerCost 90; absorbFraction 0.38 (counter mode); spinBoost +35 rad/s on hit. "Endure damage and counter-attack causing extra damage." Yellow aura encircles bey.  
**Compatible beys**: Death Quetzalcoatl 125RDF; RDF rubber tip essential; Tithi's Light/Air BeySpirit powers Beast dual-mode

---

### [Case 1675 — Death Quetzalcoatl 125RDF — Solar Counter](./13%20case%20study.md#case-1675)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Solar Counter. Sequence: moveRight → attack → moveLeft (→ K ←). Cost: 25. Type: balanced. → brief RDF traction run (Δv_orbital ≈ +0.033 m/s); K impact at end; ← exit using collision energy for controlled redirect. Counter-hit window (opponent also strikes during →): dmgMult 1.48× ≤ 1.5 ✓; lockMs 145 ≤ 300 ✓; counterBonus 0.18.  
**Gimmick**: Parent: RDF traction speed-build (Case 1673)

---

### [Case 1676 — Ray Gil 100RSF — Ray Energy Ring Multi-Rib Sequential Contact + RSF Rubber Spin-Leech Coupling](./13%20case%20study.md#case-1676)

**System**: MFB / Metal Masters (Team Garcia)  
**Geometry**: Gil metal wheel: m_Gil ≈ 33 g, r_Gil = 2.3 cm; Ray energy ring ("bone exterior"): rib protrusions r_Ray = 2.6 cm, 4 ribs at 90°, h_rib ≈ 0.2 cm; 100 track: h = 1.0 cm (low, aggressive contact angle); RSF tip: rubber outer annulus r_outer = 0.7 cm, μ_RSF ≈ 0.62; m_total = 37 g; I ≈ 1.1×10⁻⁵ kg·m²  
**Mechanism**: At ω = 310 rad/s: v_rib = 8.06 m/s; contact frequency 197.4 Hz (matches canon "creaking sounds"). Single rib J_rib = 0.197 N·s; J_total/rev = 0.710 N·s [physical]. RSF spin-leech during press: Δω_opp/dt = 120.8 rad/s per second sustained contact.  
**Gimmick**: Rib barrage + RSF spin-leech → MechanicRegistry: rib_barrage_leech

---

### [Case 1677 — Ray Gil 100RSF — Keel Strangler](./13%20case%20study.md#case-1677)

**System**: MFB / Metal Masters  
**Blader**: Argo Garcia  
**Special Move**: Keel Strangler — revolutionCount (1–5): dmgMult up to 2.40×; spinDelta up to −85 × spinRatio × revMult; lockMs 380; powerCost 105; leechPerMs 0.120 rad/s. Physical: J_barrage (3 rev) = 2.13 N·s — substantial without [M]. [M] Ray Beast ×1.8 → J_[M] = 3.83 N·s. "Keel" = Ray rib structure; "strangle" = RSF sustained spin drain.  
**Compatible beys**: Ray Gil 100RSF; RSF rubber tip essential; Argo's Marine/Beast BeySpirit manifests Ray beast

---

### [Case 1678 — Ray Gil 100RSF — Rib Lock](./13%20case%20study.md#case-1678)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Rib Lock. Sequence: attack → moveLeft → attack (K ← K). Cost: 35. Type: stamina. K1 = first rib contact; ← holds RSF press for ~60 ms (Δω_leech = 7.25 rad/s); K2 = second rib hit on fresh face. Combined ≈ one full revolution of Keel Strangler. dmgMult 1.50× ≤ 1.5 ✓; lockMs 260 ≤ 300 ✓; leechBonus 0.18.  
**Gimmick**: Parent: Energy Ring rib contact + RSF leech (Case 1676)

---

### [Case 1679 — Zeus (Plastic Generation) — Zeus AR Barrage Impulse Train + Brooklyn BeySpirit Darkness Field](./13%20case%20study.md#case-1679)

**System**: Plastic Generation  
**Geometry**: Zeus AR: m_AR ≈ 14 g, r_AR ≈ 2.8 cm, 4 primary protrusions; m_Zeus ≈ 36 g; I ≈ 7.5×10⁻⁶ kg·m²  
**Mechanism**: ω₀ = 280 rad/s; v_AR = 7.84 m/s; 4-strike barrage J_barrage = 0.609 N·s [physical]. Final Zeus Beast smash: J_smash_[M] = 2.13 N·s (×3.5 BeySpirit). Darkness field: anti-light BeySpirit phenomenon — reduces opponent dodge probability [M]. Brooklyn stated to have overwhelming innate BeySpirit surpassing Tyson.  
**Gimmick**: AR barrage + darkness field → MechanicRegistry: barrage_darkness_field

---

### [Case 1680 — Zeus (Plastic Generation) — King of Darkness](./13%20case%20study.md#case-1680)

**System**: Plastic Generation  
**Blader**: Brooklyn  
**Special Move**: King of Darkness — brooklynSpiritLevel (0–1): dmgMult up to 3.20×; spinDelta up to −110 × spiritScale; lockMs 450; powerCost 140; darknessField active at spiritLevel ≥ 0.50; finalSmash 2.13 N·s terminal impulse. Physical AR barrage above ring-out threshold. Anime: darkness appears, Zeus Beast emerges, Brooklyn becomes one with Zeus.  
**Compatible beys**: Zeus (Brooklyn) only; darkness field specific to Brooklyn's overwhelming BeySpirit

---

### [Case 1681 — Zeus (Plastic Generation) — Dark Strike](./13%20case%20study.md#case-1681)

**System**: Plastic Generation  
**Mechanism**: COMBO — Dark Strike. Sequence: moveDown → attack → moveDown (↓ K ↓). Cost: 35. Type: attack. ↓K↓ descending arc replicates downward falling-strike trajectory; F_z_combo = J×sin(20°) ≈ 0.34 N downward component. No darkness field (no BeySpirit basis in combo). dmgMult 1.49× ≤ 1.5 ✓; lockMs 200 ≤ 300 ✓; downwardBonus 0.17.  
**Gimmick**: Parent: Zeus AR barrage impulse train (Case 1679)

---

### [Case 1682 — Variares D:D — Variares 4D Metal Wheel Blade-Protrusion Rake Geometry + D:D Left-Spin Orbital Contact](./13%20case%20study.md#case-1682)

**System**: MFB 4D  
**Geometry**: Variares 4D Metal Wheel: 4 sword-profile blade protrusions in 2-fold symmetry, r_blade = 3.8 cm; m_total = 48.5 g; I_total = 3.498×10⁻⁵ kg·m²; ω₀ = 630 rad/s  
**Material**: D:D (Duo Drive) — attack end: r_att = 0.6 cm, μ = 0.22; defense end: r_def = 0.3 cm, μ = 0.08  
**Mechanism**: Left-spin attack: rake angle φ_blade = 42°; v_slash = 16.02 m/s; J_slash = 0.522 N·s; Δv_EE = 11.35 m/s > 8 m/s ring-out ✓ (physically achievable). Right-spin: φ_RS = 12°, v_slash_RS = 4.98 m/s — insufficient. Left-spin exclusivity mechanically enforced by blade geometry.  
**Gimmick**: Left-spin blade rake → MechanicRegistry: spin_direction_rake

---

### [Case 1683 — Variares D:D — King of Thunder Sword](./13%20case%20study.md#case-1683)

**System**: MFB 4D  
**Blader**: King  
**Special Move**: King of Thunder Sword — leftSpinActive required; beySpirit > 0.80 activates Mars lightning (rakeBonus 1.85×). J_[M] = 2.5 × J_phys = 1.305 N·s; Δv_[M] = 28.37 m/s [M] (conclusive defeat of Earth Eagle 145WD). Full KE_rotational = 6.942 J channeled through blade rake [M]. Used against Earth Eagle (defeated).  
**Compatible beys**: Variares D:D with D:D in attack-end orientation operated in left-spin; primarily King's Variares

---

### [Case 1684 — Variares D:D — Thunder Blade](./13%20case%20study.md#case-1684)

**System**: MFB 4D  
**Mechanism**: COMBO — Thunder Blade. Sequence: moveLeft → attack → jump (← K J). Cost: 25. Type: attack. ← builds CCW orbital momentum aligning blade at φ = 42° rake; K fires concentrated slash; J exits cleanly preventing blade wedge. dmgMult 1.44× (orbitalAligned) ≤ 1.5 ✓; lockMs 190 ≤ 300 ✓.  
**Gimmick**: Parent: Variares 4D blade rake (Case 1682)

---

### [Case 1685 — Ray Striker D125CS — CS Tip Single-Point Pressure Concentration](./13%20case%20study.md#case-1685)

**System**: MFB / Metal Masters  
**Geometry**: CS ("Coat Sharp") tip: r_tip = 0.015 cm contact radius; A_CS = 7.069×10⁻⁸ m²; rubber-coated. Ray Striker: m_total = 32.2 g; I_total = 2.191×10⁻⁵ kg·m²; Striker horn at r_horn = 2.8 cm; ω₀ = 660 rad/s  
**Material**: CS rubber coating: e_CS ≈ 0.55 (vs pure Sharp e_S ≈ 0.40)  
**Mechanism**: Pressure ratio CS vs WF = 2844×. At F_n = 1.5 N: P_CS = 21.2 MPa (near ABS yield 40 MPa — significant surface deformation). v_approach = 21.78 m/s; J_CS = 0.616 N·s; Δv_opp = 14.67 m/s > 8 m/s ring-out ✓ [physical]. Horn F_yield = 1131 N; at [M]: F_[M] = 3696 N → horn fracture.  
**Gimmick**: Single-point pressure concentration → MechanicRegistry: point_concentration_strike

---

### [Case 1686 — Ray Striker D125CS — Lightning Sword Flash](./13%20case%20study.md#case-1686)

**System**: MFB / Metal Masters  
**Blader**: Masamune Kadoya  
**Special Move**: Lightning Sword Flash — beySpirit + trainingLevel (1–5): convergence multiplier up to 2.0; dmgMult up to ~7×; spinDelta up to −110; powerCost 100; hornBreak at convergence > 1.4 [M]. Physical J_CS = 0.616 N·s already achieves ring-out. [M] KE full-convergence J_[M] = 3.696 N·s. Training progression improves BeySpirit convergence efficiency throughout Metal Masters series.  
**Compatible beys**: CS or equivalent sharp-coated tip; primarily Ray Striker D125CS (Masamune Kadoya)

---

### [Case 1687 — Ray Striker D125CS — Striker Point](./13%20case%20study.md#case-1687)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Striker Point. Sequence: jump → moveRight → attack (J → K). Cost: 25. Type: universal. J pre-positions at upper arc reducing approach angle to <10° (nearly perpendicular); → builds approach speed; K fires when perpendicular to target. All gain from approach geometry optimization — no BeySpirit required. dmgMult 1.42× (perpendicularApproach) ≤ 1.5 ✓; lockMs 170 ≤ 300 ✓.  
**Gimmick**: Parent: CS tip perpendicular approach focus (Case 1685)

---

### [Case 1688 — Rock Leone 145WB — Rock Leone WB Centrifugal Vortex Barrier (Lion Gale Force Wall Mechanism)](./13%20case%20study.md#case-1688)

**System**: MFB / Metal Fusion  
**Geometry**: Rock Metal Wheel r_Rock = 3.8 cm; WB rolling contact: μ_roll = 0.012; m_total = 37.2 g; I = 4.031×10⁻⁵ kg·m²; ω₀ = 630 rad/s  
**Mechanism**: Stationary barrier (vs Lion 100 Fang Fury offensive vortex). Γ_base = 0.831 m²/s; v_θ_physical(9.0 cm) = 1.469 m/s; F_barrier = 5.99 mN — deflects slow approach, cannot eject without [M]. [M] for ring-out: 5.44×. True LGFW (Madoka: "158% more powerful" → 2.58× total): Γ_True = 2.145 m²/s; v_θ_True(9 cm) = 3.793 m/s; [M] remaining for ring-out = 2.11×.  
**Gimmick**: Stationary centrifugal barrier → MechanicRegistry: centrifugal_barrier

---

### [Case 1689 — Rock Leone 145WB / Fang Leone 130W2D — Lion Gale Force Wall](./13%20case%20study.md#case-1689)

**System**: MFB / Metal Fusion → Metal Masters → Metal Fury  
**Blader**: Kyoya Tategami  
**Special Move**: Lion Gale Force Wall — beySpirit + trueVersion + fangLeone. Base LGFW: [M] 2.30× → v_θ_[M](9 cm) = 3.379 m/s (barrier but not guaranteed ring-out — consistent with debut loss to Gingka). True (Metal Masters, [M] 5.44×): v_θ_[M] ≈ 8.0 m/s (at ring-out threshold for any standard opponent). Metal Fury Fang Leone: r_Fang ≈ 4.0 cm > r_Rock → ring-out at lower [M] multiplier. dmgMult up to ~6× (true + fang + full BeySpirit); powerCost 100.  
**Compatible beys**: Rock or Fang Leone Metal Wheel (r_outer ≥ 3.8 cm, ≥ 4 blade protrusions) on WB or equivalent

---

### [Case 1690 — Rock Leone 145WB — Gale Wall Hold](./13%20case%20study.md#case-1690)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Gale Wall Hold. Sequence: defense → moveUp → defense (K ↑ K). Cost: 0. Type: universal. K enters centre-spin vortex posture; ↑ repositions to intercept primary attack vector; K restores barrier. Physical: F_barrier = 5.99 mN (genuine aerodynamic redirect). damageReduction 22% (vortexSustained); spinDelta +4 (WB rolling efficiency gain); lockMs 0; no BeySpirit needed.  
**Gimmick**: Parent: Rock Leone WB centrifugal vortex barrier (Case 1688)

---

### [Case 1691 — Rock Leone 145WB — Rock Leone Precessional Orbit + Kármán Vortex Shedding (Lion Wild Wind Fang Dance Mechanism)](./13%20case%20study.md#case-1691)

**System**: MFB / Metal Fusion  
**Mechanism**: Mobile traveling vortex (vs LGFW stationary). WB precessional orbit at 50% spin: active attack phase r_orbit = 5.0 cm, Ω_orbit = 3.0 rad/s, v_orbital = 0.150 m/s. Kármán shedding: f_K = 0.3947 Hz; λ_K = 0.380 m (single dominant shed vortex per orbit). Γ_compound = 0.855 m²/s (marginally above LGFW). Key advantage over LGFW: REACH — mobile vortex sweeps full arena and can target wall-adjacent opponents.  
**Gimmick**: Mobile vortex sweep → MechanicRegistry: mobile_vortex

---

### [Case 1692 — Rock Leone 145WB — Lion Wild Wind Fang Dance](./13%20case%20study.md#case-1692)

**System**: MFB / Metal Fusion  
**Blader**: Kyoya Tategami  
**Special Move**: Lion Wild Wind Fang Dance — beySpirit + orbitRadius: [M] r_orbit → r_arena = 22.5 cm; Ω_orbit → 12 rad/s; v_orbital_[M] = 2.70 m/s; f_K_[M] = 7.105 Hz (arena-filling vortex train). dmgMult up to ~3.8× (dancing + full BS); areaFactor = orbitRadius × beySpirit; powerCost 100. Vortex columns visible citywide. "Dancing" character = BeySpirit-modulated non-uniform orbit.  
**Compatible beys**: Rock Leone 145WB on WB or equivalent wide-ball tip; Kyoya's BeySpirit drives orbital expansion

---

### [Case 1693 — Rock Leone 145WB — Wind Fang Sweep](./13%20case%20study.md#case-1693)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Wind Fang Sweep. Sequence: moveUp → attack → moveDown (↑ K ↓). Cost: 15. Type: universal. ↑ upper orbital arc (maximum approach speed); K at tangent apex; ↓ follow-through sweeps lower arc. Replicates LWWFD orbital pass within physics limits. dmgMult 1.38× (arcCompleted) ≤ 1.5 ✓; lockMs 160 ≤ 300 ✓.  
**Gimmick**: Parent: Precessional orbit sweeping vortex (Case 1691)

---

### [Case 1694 — Lost Lúinor Nine Spiral — Spiral Tip Speed-Phase Transition + LS-RS Additive Burst Contact](./13%20case%20study.md#case-1694)

**System**: Burst / Sparking  
**Geometry**: Lost Lúinor layer m_LL = 15.3 g; Nine Forge Disc m_Nine = 20.4 g, r_Nine = 4.0 cm; Spiral Tip m_Spiral = 6.2 g; m_total = 41.9 g; I_total = 1.850×10⁻⁵ kg·m²  
**Material**: Spiral tip: high-speed phase (ω > 200 rad/s) discrete ridge contact r_eff = 0.1 cm, μ = 0.10; low-speed full cone r_cone = 0.2 cm, μ = 0.12  
**Mechanism**: t_high_phase = 234.0 s; t_low_phase = 37.5 s; t_total = 271.5 s (strong stamina). LS-RS additive: v_rel = 57.6 m/s → J_head-on = 1.904 N·s → τ_burst = 30.5× threshold → near-certain burst + ring-out both physically achievable. Nine disc: 9 tab positions at 40° spacing (dense burst arrangement).  
**Gimmick**: LS-RS head-on + spiral phase transition → MechanicRegistry: ls_rs_additive_burst

---

### [Case 1695 — Lost Lúinor Nine Spiral — Lost Spiral](./13%20case%20study.md#case-1695)

**System**: Burst / Sparking  
**Blader**: Lui Shirosagi  
**Special Move**: Lost Spiral — leftSpinActive + speedPhaseActive + beySpirit: dmgMult up to ~6.6× [M full dark]; burstBonus up to 0.75; spinDelta up to −80 × (1 + dark×0.5); powerCost 100. Physical J = 1.904 N·s already sufficient for burst + ring-out. [M] darkside BeySpirit (Lui's dark aura) ×3: J_[M] = 5.712 N·s, τ_burst = 91.4× threshold — instant burst regardless of defensive stats.  
**Compatible beys**: Burst-format left-spin bey with Nine Forge Disc + Spiral tip; primarily Lost Lúinor Nine Spiral (Lui Shirosagi)

---

### [Case 1696 — Lost Lúinor Nine Spiral — Death Spiral Rush](./13%20case%20study.md#case-1696)

**System**: Burst / Sparking  
**Mechanism**: COMBO — Death Spiral Rush. Sequence: moveUp → moveUp → attack (↑ ↑ K). Cost: 25. Type: universal. ↑↑ maximum linear approach velocity along straight-line trajectory — replicates "speeding up" phase; maximises head-on LS-RS additive component. dmgMult max 1.48× (straightApproach + leftSpinBonus) ≤ 1.5 ✓; lockMs 180 ≤ 300 ✓; burstBonus 0.35 (LS vs RS).  
**Gimmick**: Parent: Spiral tip LS-RS head-on contact (Case 1694)

---

### [Case 1697 — Air Knight 12Expand Eternal — Air Knight Wing Aerodynamic Lift + Eternal Tip Zero-Floor Aerial Spin Preservation](./13%20case%20study.md#case-1697)

**System**: Burst / Sparking  
**Geometry**: Air Knight layer: 4 swept-back wing protrusions; A_wing_total = 11.52 cm²; l_wing = 1.8 cm span; c_wing = 1.6 cm chord. m_total = 41.6 g; I_total = 3.002×10⁻⁵ kg·m²; Eternal tip: μ_bearing ≈ 0.002  
**Mechanism**: F_lift(ω₀) = 0.422 N vs W = 0.408 N at ω₀ = 720 rad/s (+0.014 N, borderline). ω_liftoff = 707 rad/s (98% of ω₀). Liftoff requires opponent attack impulse when spin decayed. Aerial spin preservation: τ_floor ≈ 4.083×10⁻⁶ N·m (bearing) vs opponent τ_floor ≈ 1.3×10⁻³ N·m; over 1.8 s aerial: opponent loses 99 rad/s while Air Knight loses ~0%.  
**Gimmick**: Wing lift + aerial stamina trap → MechanicRegistry: aerial_stamina_trap  
**Engine Note**: Must support airborne bey state with separate spin-decay rates

---

### [Case 1698 — Air Knight 12Expand Eternal / Whirl Knight Tapered-Q Jaggy-Q+Bounce-2 — Knight Flyer](./13%20case%20study.md#case-1698)

**System**: Burst / Sparking  
**Blader**: Kit Lopez  
**Special Move**: Knight Flyer — launchedByAttack + bounceDriver + beySpirit: spinDelta +beySpirit×8 (gain from aerial no-friction); dmgMult 1.0 + beySpirit×0.4 (re-entry); aerialMs up to 2300 ms [M]; opponentSpinDrain up to 0.18 × liftBonus; powerCost 100. Stamina-drain mechanic physically grounded (Eternal zero-friction aerial). "Can even climb up in mid-air" [M only]. Whirl Knight Bounce-2 driver adds spring-generated vertical impulse for more aggressive jump-off.  
**Compatible beys**: Air Knight or Whirl Knight on any large-wing setup with free-spin/low-friction tip (Eternal, Bearing, Bounce)

---

### [Case 1699 — Air Knight 12Expand Eternal — Knight Glide](./13%20case%20study.md#case-1699)

**System**: Burst / Sparking  
**Mechanism**: COMBO — Knight Glide. Sequence: jump → jump → moveUp (J J ↑). Cost: 15. Type: universal. JJ achieves aerial phase near ω_liftoff; ↑ sustains upward bias. Denies contact + asymmetric stamina drain (Air Knight on Eternal ≈ 0 τ vs opponent τ_floor ≈ 1.3×10⁻³ N·m). opponentSpinDrain 12%; aerialMs 1800 (liftedOff). No damage dealing — stamina denial mechanic. No BeySpirit override needed for drain mechanic.  
**Gimmick**: Parent: Wing lift + aerial spin preservation (Case 1697)

---

### [Case 1700 — Dark Bull H145SD — Bull Metal Wheel Horn-Protrusion Impact + H145 CoM Elevation Orbital Aggressiveness](./13%20case%20study.md#case-1700)

**System**: MFB / Metal Fusion  
**Geometry**: Bull Metal Wheel: two large curved horn protrusions, r_horn = 3.6 cm, m_horns ≈ 22.0 g; I_total = 3.377×10⁻⁵ kg·m²; H145 track: h = 1.45 cm (raises CoM 0.75 cm above 70 reference → faster precession orbit); SD tip: r_SD ≈ 0.5 cm, μ_SD ≈ 0.18; m_total = 37.7 g; ω₀ = 630 rad/s  
**Mechanism**: v_horn = 22.68 m/s; J_Bull = 0.603 N·s; Δv_Leone = 16.21 m/s > 8 m/s ring-out ✓ [physical, achieved against Rock Leone 145WB in anime "The Deck is Stacked!"]. H145: enables equatorial-plane contact for full radial impulse.  
**Gimmick**: Curved horn concentrated impact → MechanicRegistry: horn_protrusion_strike

---

### [Case 1701 — Dark Bull H145SD — Maximum Stampede](./13%20case%20study.md#case-1701)

**System**: MFB / Metal Fusion  
**Blader**: Benkei Hanawa  
**Special Move**: Maximum Stampede — fire/golden Bull Beast armor ignites; J_[M] = 2.293 N·s; dmgMult up to ~6×; lockMs 450; powerCost 100; ringOutForce 0.95. "Used only once" — depletes full BeySpirit reserve on activation.  
**Compatible beys**: Dark Bull H145SD (primary — horn protrusion geometry + H145 elevation required); any MFB Metal Wheel with dual-horn contact geometry

---

### [Case 1702 — Dark Bull H145SD — Bull Charge](./13%20case%20study.md#case-1702)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Bull Charge. Sequence: moveDown → moveRight → defense (↓ → K). Cost: 25. Type: attack. equatorialAligned: dmgMult 1.47×; lockMs 150. Horn protrusion charges along equatorial band, K brace converts momentum → direct ram. dmgMult 1.47× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Horn-protrusion impact (Case 1700)

---

### [Case 1703 — Vulcan Horuseus 145D — Vulcan Wheel Centrifugal Air-Curtain + D Tip Spin Endurance](./13%20case%20study.md#case-1703)

**System**: MFB / Metal Fusion  
**Geometry**: Vulcan Metal Wheel: near-disc profile, r_rim = 3.7 cm; I_total ≈ 2.80×10⁻⁵ kg·m²; D tip: r_D ≈ 0.2 cm, μ_D ≈ 0.05; m_total ≈ 43.5 g; ω₀ = 780 rad/s  
**Mechanism**: Rim contact barrier: Δv_opp = 3.78 m/s (physical close-range push). Spin endurance τ_D = 77.3 s (D tip low friction). Air-curtain Rankine vortex from near-disc profile at ω = 780 rad/s: v_rim = 28.86 m/s → ΔP = 511 Pa.  
**Gimmick**: Centrifugal air-curtain rim barrier → MechanicRegistry: air_curtain_rim

---

### [Case 1704 — Vulcan Horuseus 145D — Mystic Zone](./13%20case%20study.md#case-1704)

**System**: MFB / Metal Fusion  
**Blader**: Hyoma  
**Special Move**: Mystic Zone — Egyptian Horus BeySpirit field; physicalRadius 55 px; bsRadius 250 px [M]; −0.25%/tick spin drain [M] on all opponents in field; dmgMult 1.80× for any contact inside zone; powerCost 100; lockMs 0 (field effect, not single-hit lock).  
**Compatible beys**: Vulcan Horuseus 145D (primary — Vulcan near-disc air curtain + Horus BeySpirit field required); any Horuseus-series bey

---

### [Case 1705 — Vulcan Horuseus 145D — Seal Pulse](./13%20case%20study.md#case-1705)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Seal Pulse. Sequence: moveDown → defense → defense (↓ K K). Cost: 15. Type: stamina. D tip minimal-friction orbi-stance: KK double-brace absorbs incoming impulse → brief air-curtain release pulse pushes opponents back. dmgMult 1.15×; lockMs 60. dmgMult 1.15× ≤ 1.5 ✓; lockMs 60 ≤ 300 ✓.  
**Gimmick**: Parent: Vulcan wheel centrifugal air-curtain (Case 1703)

---

### [Case 1706 — Driger MS — HMS Tiger-Claw Single-Point Pressure](./13%20case%20study.md#case-1706)

**System**: Plastic / HMS (Hard Metal System)  
**Geometry**: Attack Ring Driger MS: cat-claw geometry; A_claw = 2.0 mm²; r_claw = 2.3 cm; I_total ≈ 1.50×10⁻⁵ kg·m²; m_total ≈ 32.0 g; ω₀ = 900 rad/s  
**Mechanism**: P_claw = 40.9 MPa (91% ABS yield at single-point contact); J_claw = 0.1635 N·s; Δv_opp = 4.09 m/s (physical, near ring-out). HMS metal AR gives true Hertzian concentration unlike plastic-era.  
**Gimmick**: Single-point Hertzian pressure concentration → MechanicRegistry: single_point_pressure

---

### [Case 1707 — Driger MS — Mountain Sage's White Tiger Strike](./13%20case%20study.md#case-1707)

**System**: Plastic / HMS  
**Blader**: Ray Kon (Master Tao lineage)  
**Special Move**: Mountain Sage's White Tiger Strike — [M] ×3.5; J_[M] = 0.5723 N·s; dmgMult ~4.2×; powerCost 100; "1/100th of Master Tao's technique" confirmed physically (Δv_opp = 14.31 m/s [M] vs Master Tao Δv ≈ 1431 m/s theoretical). BeySpirit tiger claw manifests, amplifying single-point pressure to near-yield of metal substrate.  
**Compatible beys**: Driger MS (primary — HMS metal AR claw geometry required); any HMS bey with claw-type AR; Driger series across generations

---

### [Case 1708 — Driger MS — Tiger Fang Press](./13%20case%20study.md#case-1708)

**System**: Plastic / HMS  
**Mechanism**: COMBO — Tiger Fang Press. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 25. Type: attack. clawAligned: dmgMult 1.42×; lockMs 120. ↑ aligns claw face tangentially; → pre-loads approach vector; A fires at minimal A_claw contact point for maximum Hertz pressure. dmgMult 1.42× ≤ 1.5 ✓; lockMs 120 ≤ 300 ✓.  
**Gimmick**: Parent: HMS tiger-claw single-point pressure (Case 1706)

---

### [Case 1709 — Galux — Bowl-Wall Launch Arc Gravitational PE → Impact KE Conversion](./13%20case%20study.md#case-1709)

**System**: Plastic / Original  
**Geometry**: Galux AR (cat paw): r_AR = 2.8 cm; Six Wide WD: r = 1.8 cm; I_total = 1.107×10⁻⁵ kg·m²; m_total = 43.0 g; tip: r = 0.4 cm, μ = 0.15; ω₀ = 120 rad/s  
**Mechanism**: Bowl-wall launch arc h_max = 0.312 m (physical); v_strike = 4.173 m/s; J_drop = 0.134 N·s; Δv_opp = 3.35 m/s (below ring-out). [M] h = 8 m BeySpirit: J_[M] = 0.416 N·s; Δv_[M] = 10.4 m/s → ring-out ✓.  
**Gimmick**: Gravitational PE → combined descent + rotational KE strike → MechanicRegistry: aerial_drop_strike

---

### [Case 1710 — Galux — Mountain Cat Attack](./13%20case%20study.md#case-1710)

**System**: Plastic / Original  
**Blader**: Mariah  
**Special Move**: Mountain Cat Attack — physical h = 0.312 m bowl-wall launch; J = 0.134 N·s; [M] h = 8 m BeySpirit mountain-leap: J_[M] = 0.416 N·s; dmgMult up to ~3.6× full BS; ringOutBoost 0.35 at beySpirit > 0.75; powerCost 85. BeySpirit overrides physical bowl-wall height limit (0.31 m → 8 m).  
**Compatible beys**: Any plastic-era bey (physical 0.31 m bowl-wall arc); [M] mountain-leap requires Galux as used by Mariah (cat BeySpirit height extension)

---

### [Case 1711 — Galux — Cat Pounce](./13%20case%20study.md#case-1711)

**System**: Plastic / Original  
**Mechanism**: COMBO — Cat Pounce. Sequence: moveUp → jump → attack (↑ J A). Cost: 15. Type: universal. ↑ drives Galux up bowl wall slope; J releases at arc apex (physical h ≈ 0.10–0.15 m); A fires on descent — two-component impact: v_strike ≈ 3.78 m/s; J_combo ≈ 0.121 N·s; Δv_opp ≈ 3.0 m/s. arcAchieved: dmgMult 1.28×; lockMs 65. No BeySpirit override. dmgMult 1.28× ≤ 1.5 ✓; lockMs 65 ≤ 300 ✓.  
**Gimmick**: Parent: Bowl-wall launch arc drop strike (Case 1709)

---

### [Case 1712 — Mirage Fafnir Nothing 2S — Nothing Driver Rubber Bearing Free-Spin Differential + Mirage Ring Rubber-Claw Geometry](./13%20case%20study.md#case-1712)

**System**: Burst / Sparking  
**Geometry**: Mirage Ring: r = 4.0 cm; Nothing 2S disc: r = 3.15 cm; Nothing driver rubber rim: r = 0.95 cm; I_total = 3.406×10⁻⁵ kg·m²; m_total = 60.8 g; ω₀ = 800 rad/s  
**Mechanism**: Bearing α_free ≈ 0.4 rad/s² (vs 8.0/s² flat tip) → 20× theoretical endurance extension (8× practical). Rubber claw (μ_k = 0.65): J_rubber = 0.0624 N·s per claw contact; up to 6 contacts/rev → cumulative Δv_opp up to 6.12 m/s. LS-RS spin drain/boost: Δω_opp = ±73.4 rad/s per contact.  
**Gimmick**: Bearing free-spin differential + rubber claw passive contact → MechanicRegistry: bearing_free_spin / rubber_claw_contact

---

### [Case 1713 — Mirage Fafnir Nothing 2S — Mirage Claw](./13%20case%20study.md#case-1713)

**System**: Burst / Sparking  
**Blader**: Free De La Hoya  
**Special Move**: Mirage Claw — spin accumulation via free-spin bearing; single 45° rubber claw swipe; physical Δv = 0.737 m/s; [M] ×10.3 → Δv = 7.58 m/s (ring-out capable); [M] Δω = −543 rad/s opponent drain; black afterimage (physically real: 41.0°/ms angular velocity smearing > 25°/ms perception threshold). powerCost 100; 18% spin expended.  
**Compatible beys**: Mirage Fafnir Nothing 2S (primary); any Fafnir-series bey with rubber-rim layer; any bey with Nothing / Nothing 2 / Nothing 2S driver

---

### [Case 1714 — Mirage Fafnir Nothing 2S — Shadow Claw](./13%20case%20study.md#case-1714)

**System**: Burst / Sparking  
**Mechanism**: COMBO — Shadow Claw. Sequence: moveLeft → moveRight → attack (← → A). Cost: 15. Type: universal. Feint-diagonal approach at Nothing driver momentum-neutral angle; rake with rubber rim claw edge. dmgMult 1.28×; lockMs 80; opponent spin drain (LS-RS directional: 6% or 2.5%); partial spin recovery. dmgMult 1.28× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Nothing driver rubber-claw geometry (Case 1712)

---

### [Case 1715 — Storm Pegasus 105RF — RF Rubber Flat Tip Ballistic Traction + 105 Track Mid-Height Stadium Bounce Arc](./13%20case%20study.md#case-1715)

**System**: MFB / Metal Fusion  
**Geometry**: Pegasus Metal Wheel: r = 3.7 cm; Storm Energy Ring: r = 3.8 cm; I_total = 2.739×10⁻⁵ kg·m²; m_total = 46.0 g; RF tip: r = 0.6 cm rubber, μ_k = 0.85; ω₀ = 900 rad/s  
**Mechanism**: RF traction: F = 0.384 N, a = 8.35 m/s²; v_impact = 2.002 m/s (240 mm run). Bowl-wall bounce: h_max = 0.191 m; J_strike = 0.184 N·s; Δv_opp = 4.00 m/s (near ring-out). [M] h = 8.48 m → J = 1.187 N·s; Δv_opp = 25.8 m/s (stadium-clearing).  
**Gimmick**: RF ballistic traction + bowl-wall bounce arc → MechanicRegistry: rf_ballistic_traction

---

### [Case 1716 — Storm Pegasus 105RF — Meteor Shower Attack](./13%20case%20study.md#case-1716)

**System**: MFB / Metal Fusion  
**Blader**: Gingka Hagane  
**Special Move**: Meteor Shower Attack — self-launch from bowl wall (v_exit = 2.002 m/s) OR deflection-recovery redirect (v_y up to 3.5 m/s); [M] h = 8.48 m Pegasus BeySpirit ascent; v_descent_[M] = 12.90 m/s; Δv_opp_[M] = 12.92 m/s (stadium-clearing ring-out); RF tip wear +30% (single-use degradation). powerCost 100. Two trigger modes supported.  
**Compatible beys**: Storm Pegasus 105RF (primary); Galaxy Pegasus W105R²F; any Pegasus-series bey with RF / R²F / LRF tip

---

### [Case 1717 — Storm Pegasus 105RF — Pegasus Dive](./13%20case%20study.md#case-1717)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Pegasus Dive. Sequence: moveUp → jump → attack (↑ J A). Cost: 15. Type: attack. ↑ + J generates upward-bias arc; A fires on descent — RF traction dive strike. dmgMult 1.32×; lockMs 90; knockback bonus if triggered post-enemy-deflect. No BeySpirit override. dmgMult 1.32× ≤ 1.5 ✓; lockMs 90 ≤ 300 ✓.  
**Gimmick**: Parent: RF ballistic traction + bowl-wall bounce arc (Case 1715)

---

### [Case 1718 — Earth Eagle 145WD — WD Wide Defense Gyroscopic Stabilization + 145 High-Track Tornado Stall Geometry](./13%20case%20study.md#case-1718)

**System**: MFB / Metal Fusion  
**Geometry**: Eagle Metal Wheel: r = 3.8 cm; Earth Energy Ring: r = 3.85 cm; I_total = 3.104×10⁻⁵ kg·m²; m_total = 49.2 g; WD tip: r = 0.7 cm concave, passive self-righting; ω₀ = 750 rad/s  
**Mechanism**: WD gyroscopic self-centering: Ω_prec = 2.61 rad/s from 10° tilt (recovers in ~2.4 s); τ_correct = 1.055×10⁻⁴ N·m restorative. Rankine vortex: v_rim = 28.5 m/s, ΔP = 498 Pa (invisible physically; [M] ΔP = 6.098 kPa, visible purple tornado). Orbit strike J = 0.123 N·s; Δv_opp = 2.50 m/s physical; [M] ×3.5 → 8.75 m/s ring-out.  
**Gimmick**: WD gyroscopic stabilization + Rankine tornado → MechanicRegistry: gyroscopic_stabilize / rankine_vortex

---

### [Case 1719 — Earth Eagle 145WD — Metal Wing Smash](./13%20case%20study.md#case-1719)

**System**: MFB / Metal Fusion  
**Blader**: Tsubasa Otori  
**Special Move**: Metal Wing Smash — two variants: aerial (Eagle BeySpirit lift h = 3.5 m [M], J_aerial = 0.408 N·s, Δv = 8.29 m/s ring-out) and head-on (J_[M] = 0.4305 N·s, Δv = 8.75 m/s ring-out). Tornado AoE: F_vortex = 21.8 N [M]; secondary Δv up to 22.2 m/s AoE ring-out. Purple Rankine ΔP = 498 Pa (physically real). powerCost 100.  
**Compatible beys**: Earth Eagle 145WD (primary); Rock Eagle 90WD; any Eagle-series bey with WD / WB / EWD tip

---

### [Case 1720 — Earth Eagle 145WD — Eagle Gust](./13%20case%20study.md#case-1720)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Eagle Gust. Sequence: defense → moveRight → attack (K → A). Cost: 15. Type: defense. WD gyroscopic absorption; redirects absorbed momentum into lateral Eagle-wing smash. dmgMult 1.25×; lockMs 110; partial spin recovery from WD shock absorption. dmgMult 1.25× ≤ 1.5 ✓; lockMs 110 ≤ 300 ✓.  
**Gimmick**: Parent: WD gyroscopic stabilization + Rankine tornado (Case 1718)

---

### [Case 1721 — Draciel S — Ball Bearing Spin Gear Low-Friction Endurance + Shield Attack Ring Rebound](./13%20case%20study.md#case-1721)

**System**: Plastic / Original  
**Geometry**: Shield AR: r = 3.5 cm; Wide WD: r = 3.2 cm; Ball Bearing Spin Gear + Flat Base: r = 0.4–0.6 cm; I_total = 1.583×10⁻⁵ kg·m²; m_total = 36.8 g; ω₀ = 700 rad/s  
**Mechanism**: Ball bearing α_BB = 0.0217 rad/s² (vs α_flat = 18.27 rad/s²) → theoretical 32,258 s endurance (practical ~800 s vs ~38.3 s flat) → 20.9× practical advantage. Shield AR e = 0.65 (deflection) → opponent v_post = −1.625 m/s; Draciel barely moves.  
**Gimmick**: Ball bearing minimal-friction endurance + high-COR shield deflection → MechanicRegistry: bearing_endurance / shield_deflect

---

### [Case 1722 — Draciel S — Metal Ball Defense](./13%20case%20study.md#case-1722)

**System**: Plastic / Original  
**Blader**: Max Tate  
**Special Move**: Metal Ball Defense — defense shell (2.5 s); per hit physical: Draciel spin loss 5.28 rad/s (5% through bearing), opponent spin loss 56.8 rad/s; 104 hits before stall at 2 hits/s = 52 s endurance. [M] e_shield = 0.92; Draciel ≈ 0% spin loss per hit; opponent −149 rad/s per hit (4 hits → near stall). powerCost 100. Shell deactivates at spin < 25% maxSpin.  
**Compatible beys**: Draciel S (primary); Draciel V2; Draciel MS; Draciel G; any plastic-era bey with Ball Bearing Spin Gear

---

### [Case 1723 — Draciel S — Shield Rebound](./13%20case%20study.md#case-1723)

**System**: Plastic / Original  
**Mechanism**: COMBO — Shield Rebound. Sequence: defense → defense → moveRight (K K →). Cost: 0 (free). Type: defense. Requires recent incoming hit (< 300 ms). Ball bearing spin recovery 4%; Shield AR rebound push 1.8 m/s. dmgMult 1.18×; lockMs 50. dmgMult 1.18× ≤ 1.5 ✓; lockMs 50 ≤ 300 ✓.  
**Gimmick**: Parent: Ball bearing endurance + shield deflect (Case 1721)

---

### [Case 1724 — Air Knight 12Expand Eternal — Eternal Driver Bearing Free-Spin + 12Expand Disc Wide-Area Orbital Air Field](./13%20case%20study.md#case-1724)

**System**: Burst / Sparking  
**Geometry**: Air Knight Layer: r = 3.8 cm; 12Expand disc + frame: r = 3.8 cm; Eternal driver pinpoint: r = 0.45 cm; I_total = 3.946×10⁻⁵ kg·m²; m_total = 64.5 g; ω₀ = 750 rad/s  
**Mechanism**: Eternal α = 0.35 rad/s² (practical); τ_endurance ≈ 900 s. 12Expand wide disc (r = 3.8 cm): ΔP = 498 Pa; F_lift = 2.26 N; [M] F_suction = 36.2 N → orbital capture r_capture within 200 px. Physical suction at r = 10 cm: F_radial = 0.326 N (5.43 m/s² inward pull on 60 g opponent).  
**Gimmick**: Eternal bearing free-spin + 12Expand orbital suction field → MechanicRegistry: bearing_free_spin / orbital_field

---

### [Case 1725 — Air Knight 12Expand Eternal — Mega Knight Blow](./13%20case%20study.md#case-1725)

**System**: Burst / Sparking  
**Blader**: Kit Lopez  
**Special Move**: Mega Knight Blow — Phase 1 orbital capture (r = 200 px [M]); v_orbit_[M] = 1.65 m/s; orbit period 0.852 s; drain 3.5 rad/s/orbit [M]. Phase 2 wall smash: J_wall_[M] = 0.099 N·s; Δω_wall = 101.9 rad/s spin loss on impact. Physical F_suction = 0.326 N at r = 100 mm (real). powerCost 100.  
**Compatible beys**: Air Knight 12Expand Eternal (primary); any Knight-series bey with Eternal / Bearing driver; any Burst bey with Expand frame; Mirage Fafnir Nothing 2S (reduced range)

---

### [Case 1726 — Air Knight 12Expand Eternal — Orbit Drag](./13%20case%20study.md#case-1726)

**System**: Burst / Sparking  
**Mechanism**: COMBO — Orbit Drag. Sequence: moveDown → defense → attack (↓ K A). Cost: 25. Type: stamina. 12Expand wide suction pulls opponent (orbital drag −0.8 m/s opponent speed); K orbital-lock; A contact-smash. dmgMult 1.35×; lockMs 130; opponent speed reduction from suction field. dmgMult 1.35× ≤ 1.5 ✓; lockMs 130 ≤ 300 ✓.  
**Gimmick**: Parent: Eternal bearing free-spin + 12Expand orbital suction field (Case 1724)

---

### [Case 1727 — Flame Byxis 230WD — 230 Extreme-Height Track CoM Elevation + WD Precession Compass-Needle Orientation Lock](./13%20case%20study.md#case-1727)

**System**: MFB / Metal Fusion  
**Geometry**: Byxis Metal Wheel: r = 3.65 cm; Flame Energy Ring: r = 3.75 cm; 230 track: h = 2.30 cm (tallest in MFB library); h_CoM ≈ 4.01 cm; I_total = 2.596×10⁻⁵ kg·m²; WD tip; m_total = 46.4 g; ω₀ = 700 rad/s  
**Mechanism**: Ω_prec = 0.0876 rad/s (stable at ω = 700 rad/s). Compass-needle peak: at ω = 16 rad/s → Ω_prec = 4.408 rad/s (visual nutation wobble = 100% biometric exhaustion cue). KE = 6.362 J; [M] KE_blast = 916 J (×144); v_blast_[M] = 198.6 m/s radial.  
**Gimmick**: 230 extreme-height gyroscopic compass-needle orientation lock → MechanicRegistry: extreme_height_compass

---

### [Case 1728 — Flame Byxis 230WD — Magnetic Needle Storm](./13%20case%20study.md#case-1728)

**System**: MFB / Metal Fusion  
**Blader**: Zeo Abyss  
**Special Move**: Magnetic Needle Storm — self-exhausting; activatable only at ≤40% spin; compass needle phase: Ω_prec = 4.408 rad/s at ω = 16 rad/s; 100% biometric energy release: ~1000 J [M]; F_radial = 398 N at stadium edge [M]; v_blast = 198.6 m/s [M]; all opponents spin → 0 (magnetic nullification). After: Byxis.spin = 0, Zeo.power = 0, player fainted flag set. powerCost 100.  
**Compatible beys**: Flame Byxis 230WD (primary); Thermal Byxis 230WD; Storm Byxis 230MB; any Byxis-series bey with 230WD configuration

---

### [Case 1729 — Flame Byxis 230WD — Needle Burst](./13%20case%20study.md#case-1729)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Needle Burst. Sequence: moveDown → moveDown → attack (↓ ↓ A). Cost: 35. Type: stamina. Only activatable at ≤50% spin (compass buildup state). Focused directional burst (single target, no AoE). dmgMult 1.45×; lockMs 200; opponent spin drain 8%. dmgMult 1.45× ≤ 1.5 ✓; lockMs 200 ≤ 300 ✓.  
**Gimmick**: Parent: 230 compass-needle orientation lock (Case 1727)

---

### [Case 1730 — Lost Lúinor Nine Spiral — Nine Disc Asymmetric Mass Distribution + Spiral Driver Friction-Burst Launch Coupling](./13%20case%20study.md#case-1730)

**System**: Burst / Evolution  
**Geometry**: Lúinor Layer: r = 3.95 cm; Nine disc (asymmetric, heavy lobe at r = 3.3 cm): e_cm = 3.27 mm eccentricity; I_total = 3.666×10⁻⁵ kg·m²; Spiral driver: r = 0.55 cm turbine-grooved; m_total = 63.2 g; ω₀ = 850 rad/s  
**Mechanism**: Imbalance force: F_imbalance = 56.9 N at ω = 850 rad/s; 7.09 N at 300 rad/s. Launch coupling: 1.9% efficiency → +134.9 rad/s (full spin); +67.5 rad/s (half-spin/Evolution variant). KE_post = 17.77 J (+34.2% from baseline).  
**Gimmick**: Nine disc asymmetric imbalance pulse + Spiral driver launch coupling → MechanicRegistry: asymmetric_imbalance / launch_coupling

---

### [Case 1731 — Lost Lúinor Nine Spiral — Nightmare Boost](./13%20case%20study.md#case-1731)

**System**: Burst / Evolution  
**Blader**: Lui Shirosagi  
**Special Move**: Nightmare Boost — launch-phase only (valid during 'launching' status). Burst variant: +134.9 rad/s physical (+34.2% KE); [M] 18% coupling efficiency → +1,269.5 rad/s → ω_[M] = 2,120 rad/s; KE_[M] = 82.38 J. Evolution variant: +67.5 rad/s physical; [M] +634.7 rad/s. Nightmare visual at launch. powerCost 100.  
**Compatible beys**: Lost Lúinor Nine Spiral (primary); Lúinor Nine Iron; any Lúinor-series bey with Spiral / Destroy / Jolt driver; any bey with Spiral driver

---

### [Case 1732 — Lost Lúinor Nine Spiral — Dark Drive](./13%20case%20study.md#case-1732)

**System**: Burst / Evolution  
**Mechanism**: COMBO — Dark Drive. Sequence: dodge → attack → attack (E A A). Cost: 25. Type: attack. Nine disc imbalance lobe timed to contact: E aligns heavy lobe toward target; AA double-strike catches imbalance pulse at peak centrifugal force. imbalanceBonus ×1.6 if opponent spin < 40%. dmgMult 1.42×; lockMs 140. dmgMult 1.42× ≤ 1.5 ✓; lockMs 140 ≤ 300 ✓.  
**Gimmick**: Parent: Nine disc asymmetric imbalance pulse (Case 1730)

---

### [Case 1733 — Wolborg 4 — Ball Bearing Spin Gear Centrifugal Air-Pump Vortex + Cyber Attack Ring Shock-Absorb Profile](./13%20case%20study.md#case-1733)

**System**: Plastic / G-Revolution  
**Geometry**: Cyber AR: r = 3.5 cm; Wide WD: r = 3.2 cm; BB Spin Gear (precision); I_total = 1.675×10⁻⁵ kg·m²; m_total = 38.6 g; ω₀ = 720 rad/s  
**Mechanism**: BBSG centrifugal air-pump: ΔP = 1.273 Pa, ΔT ≈ 0.001°C (physically negligible; freeze is [M]). Cyber AR e = 0.72 (convex) → J_impact = 0.0845 N·s; Δv both beys ≈ 2.1–2.2 m/s (symmetric rebound). BBSG endurance ~760 s practical (20× over flat shaft).  
**Gimmick**: BBSG centrifugal vortex + Cyber AR high-COR rebound → MechanicRegistry: bearing_endurance / high_cor_deflect

---

### [Case 1734 — Wolborg 4 — Novae Rog](./13%20case%20study.md#case-1734)

**System**: Plastic / G-Revolution  
**Blader**: Tala  
**Special Move**: Novae Rog — Phase 1: [M] arctic freeze encapsulation (T_freeze = −100°C [M]; opponent spin → 0, locked 1.8 s). Phase 2: frozen-bey smash; physical Δv_opp = 4.825 m/s (ring-out); [M] v_Wolborg = 7.5 m/s → J = 0.579 N·s → Δv = 14.48 m/s (ice shatters). Physical centrifugal cooling = 0.001°C (real but imperceptible). powerCost 100.  
**Compatible beys**: Wolborg 4 (primary); Wolborg MS; Dranzer G (heat variant); any plastic-era bey with Ball Bearing Spin Gear

---

### [Case 1735 — Wolborg 4 — Arctic Pulse](./13%20case%20study.md#case-1735)

**System**: Plastic / G-Revolution  
**Mechanism**: COMBO — Arctic Pulse. Sequence: defense → defense → attack (K K A). Cost: 15. Type: defense. KK cold-zone hold; opponent spin chill −3%/hit (aerodynamic drag); Cyber AR deflect push. Requires opponent within 120 px. dmgMult 1.22×; lockMs 70. dmgMult 1.22× ≤ 1.5 ✓; lockMs 70 ≤ 300 ✓.  
**Gimmick**: Parent: BBSG centrifugal vortex + Cyber AR high-COR rebound (Case 1733)

---

### [Case 1736 — Dragoon F — Flat SG Base High-Speed Orbital Mechanics + Dragoon AR Aerodynamic Wake Vortex Chain](./13%20case%20study.md#case-1736)

**System**: Plastic / G-Revolution  
**Geometry**: Dragoon AR: r = 3.6 cm; Wide WD: r = 3.2 cm; Flat SG Base: r = 0.5 cm, μ = 0.65; I_total = 1.647×10⁻⁵ kg·m²; m_total = 36.5 g; ω₀ = 720 rad/s  
**Mechanism**: F_traction = 0.233 N; v_impact = 1.750 m/s (240 mm run). Wake vortex shedding: f_s = 1296 Hz (audible whirring). Physical clone count: 0.35–0.70 (below distinct threshold). [M] v_orbit = 10 m/s → 6 apparent positions (manga: ~6 visible images).  
**Gimmick**: Flat SG orbital speed + Dragoon AR aerodynamic wake vortex chain → MechanicRegistry: orbital_clone_vortex

---

### [Case 1737 — Dragoon F — Phantom Hurricane](./13%20case%20study.md#case-1737)

**System**: Plastic / G-Revolution  
**Blader**: Tyson Granger  
**Special Move**: Phantom Hurricane — clone misdirection (6 apparent positions [M]); tracking accuracy 16.7% [M]; defense penalty −83% [M]. Strike: physical J = 0.083 N·s, Δv = 2.075 m/s (needs 3–4 hits for ring-out via defense penalty); [M] v = 10 m/s → J = 0.4745 N·s → Δv = 11.86 m/s single-hit ring-out. Tala "cuts through" clones = clone detection confirmation in canon. powerCost 100.  
**Compatible beys**: Dragoon F (primary); Dragoon V2; any Dragoon-series bey with flat/semi-flat SG base; Storm Pegasus 105RF (reduced clone count)

---

### [Case 1738 — Dragoon F — Hurricane Dash](./13%20case%20study.md#case-1738)

**System**: Plastic / G-Revolution  
**Mechanism**: COMBO — Hurricane Dash. Sequence: moveUp → dodge → attack (↑ E A). Cost: 15. Type: universal. ↑ charges approach run; E redirect-dodge; A strike. trackingPenalty active on target: dmgMult 1.30× base → 1.45× confusion bonus. lockMs 80. dmgMult ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Flat SG orbital + Dragoon AR wake vortex (Case 1736)

---

### [Case 1739 — Prime Apocalypse 0Dagger Ultimate Reboot' — Reboot' Driver Spring-Loaded Tip Retraction + Rubber-to-Plastic Friction Mode Switch](./13%20case%20study.md#case-1739)

**System**: Burst / Rise  
**Geometry**: Apocalypse Layer: r = 3.8 cm; 0Dagger disc + frame: r = 3.0 cm; Ultimate Reboot' driver: pre-retract r = 0.5 cm plastic (μ = 0.12), post-retract r = 0.8 cm rubber (μ = 0.80); I_total = 3.056×10⁻⁵ kg·m²; m_total = 60.6 g; ω₀ = 800 rad/s  
**Mechanism**: Spring k = 4500 N/m, F_spring = 13.5 N at Δx = 3 mm. Post-retract ΔF = 0.404 N → Δa = 6.67 m/s²; v_post = 5.0 m/s (vs 3.0 m/s pre) → J_post = 0.364 N·s; Δv_opp = 7.91 m/s (ring-out physically). [M] μ = 2.8 → v_[M] = 11.24 m/s → Δv_opp_[M] = 17.76 m/s.  
**Gimmick**: Dual-mode spring-loaded tip retraction → MechanicRegistry: mode_switch_tip

---

### [Case 1740 — Prime Apocalypse 0Dagger Ultimate Reboot' — Prime Reboot](./13%20case%20study.md#case-1740)

**System**: Burst / Rise  
**Blader**: Arthur Peregrine  
**Special Move**: Prime Reboot — spring retraction trigger mid-battle; physical post-retract Δv_opp = 7.91 m/s (ring-out without BeySpirit); [M] μ_eff = 2.8; v_attack_[M] = 11.24 m/s; Δv_opp_[M] = 17.76 m/s; tipRetracted flag set for 3 s (enhanced traction period). powerCost 100.  
**Compatible beys**: Prime Apocalypse 0Dagger Ultimate Reboot' (primary); any Apocalypse-series bey with Reboot / Reboot' driver; Dynamite Belial Nexus Venture-2 (similar dual-mode concept)

---

### [Case 1741 — Prime Apocalypse 0Dagger Ultimate Reboot' — Reboot Rush](./13%20case%20study.md#case-1741)

**System**: Burst / Rise  
**Mechanism**: COMBO — Reboot Rush. Sequence: dodge → attack → attack (E A A). Cost: 25. Type: attack. E aligns at plastic-tip approach angle; first A triggers retraction; second A fires at rubber-tip speed. If tipRetracted already: dmgMult 1.50× (ceiling exact); else 1.40×; lockMs 120. dmgMult ≤ 1.50 ✓; lockMs 120 ≤ 300 ✓.  
**Gimmick**: Parent: Dual-mode spring-loaded tip retraction (Case 1739)

---

### [Case 1742 — Prominence Phoenix Tapered Metal Universe-10 — Metal Universe Driver Metal-Ball Pivot Free-Direction Redirect + Tapered Disc Gyroscopic Center-Weight](./13%20case%20study.md#case-1742)

**System**: Burst X  
**Geometry**: Phoenix Layer: r = 3.8 cm; Tapered disc + 10: r = 2.8 cm; Metal Universe driver ball: r = 0.2 cm, μ_ball = 0.005; I_total = 2.729×10⁻⁵ kg·m²; m_total = 58.8 g; ω₀ = 750 rad/s  
**Mechanism**: Pivot torque = 2.88×10⁻⁶ N·m (negligible); full KE retained through 90° direction change (lossless pivot). Counter-attack: J_counter = 0.2794 N·s (e_MU = 0.90) > J_incoming = 0.138 N·s → equal-or-exceeds physically real. Δv_attacker = 6.07 m/s (ring-out physically).  
**Gimmick**: Metal ball free-pivot lossless momentum redirect → MechanicRegistry: metal_ball_pivot

---

### [Case 1743 — Prominence Phoenix Tapered Metal Universe-10 — Prominence Counter](./13%20case%20study.md#case-1743)

**System**: Burst X  
**Blader**: Phelix Payne  
**Special Move**: Prominence Counter — J_counter_phys = 0.2794 N·s > J_in = 0.138 N·s (physically equal-exceeds attacker, anime accurate); Δv_attacker = 6.07 m/s (ring-out physically); [M] J_counter = 0.978 N·s → Δv_[M] = 21.26 m/s. Phoenix recoil reduced by pivot efficiency. powerCost 100.  
**Compatible beys**: Prominence Phoenix Tapered Metal Universe-10 (primary); any Phoenix-series bey with Metal Universe / Bearing driver; Savior Valkyrie Shot-7; any Burst X bey with Metal Universe driver

---

### [Case 1744 — Prominence Phoenix Tapered Metal Universe-10 — Prominence Shaker](./13%20case%20study.md#case-1744)

**System**: Burst X  
**Blader**: Phelix Payne  
**Special Move**: Prominence Shaker — Prominence Shield e_wall = 0.85 (vs standard ~0.65); bounce chain: v₁ = 2.125 m/s → J₁ = 0.212 N·s → Δv₁ = 4.62 m/s (ring-out first hit physically); cumulative 3 hits: Δv = 11.89 m/s total. [M] v₀ = 8.75 m/s → J₁_[M] = 0.874 N·s → Δv_[M] = 19.0 m/s; 4 guided bounces. powerCost 100.  
**Compatible beys**: Prominence Phoenix (primary); any Phoenix-series shield-layer bey; Rock Leone 145WB; Meteo L-Drago LW105LF

---

### [Case 1745 — Prominence Phoenix Tapered Metal Universe-10 — Phoenix Pivot](./13%20case%20study.md#case-1745)

**System**: Burst X  
**Mechanism**: COMBO — Phoenix Pivot. Sequence: dodge → defense → attack (E K A). Cost: 25. Type: defense. E pivot-align (MU metal ball); K brace-absorb; A counter-redirect. Close range (< 80 px): dmgMult 1.45×; else 1.38×; lockMs 100. dmgMult ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Metal ball free-pivot lossless redirect (Case 1742)

---

### [Case 1746 — Poseidon — Sea-Surge Attack Ring + Wide WD High-Orbit Momentum Retention](./13%20case%20study.md#case-1746)

**System**: Plastic / G-Revolution  
**Geometry**: Sea-Surge AR: r = 3.6 cm; Wide WD: r = 3.2 cm; Flat SG Base: r = 0.55 cm, μ = 0.65; I_total = 1.699×10⁻⁵ kg·m²; m_total = 37.6 g; ω₀ = 720 rad/s  
**Mechanism**: v_impact = 1.749 m/s; Sea-Surge wave-crest e = 0.68 → J_wave = 0.1105 N·s; Δv_opp = 2.91 m/s (borderline ring-out). [M] ×50 BeySpirit Javelin: v_[M] = 87.5 m/s → J_[M] = 3.29 N·s → Δv_[M] = 86.6 m/s (matches "meteor" anime hyperbole).  
**Gimmick**: Wave-crest high-COR contact → MechanicRegistry: wave_crest_strike

---

### [Case 1747 — Poseidon — Ocean Javelin](./13%20case%20study.md#case-1747)

**System**: Plastic / G-Revolution  
**Blader**: Mystel  
**Special Move**: Ocean Javelin — water tornado [M]: v_rim_[M] = 324 m/s (vs physical 25.92 m/s); trident projectile [M] v = 87.5 m/s (×50 BeySpirit); J = 3.29 N·s → Δv_opp = 86.6 m/s (catastrophic). Anime "meteorite speed" = 87.5 m/s at ×50 (anime hyperbole, not literal 20 km/s). powerCost 100.  
**Compatible beys**: Poseidon (primary — Poseidon bit beast + Sea-Surge AR required); plastic-era water/sea beys with Poseidon bit chip; Draciel S/V2/MS (water-defense bit beast, reduced javelin)

---

### [Case 1748 — Poseidon — Sea Surge](./13%20case%20study.md#case-1748)

**System**: Plastic / G-Revolution  
**Mechanism**: COMBO — Sea Surge. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 15. Type: attack. ↑ orbital spiral; → wall-catch outer arc; A wave-edge strike. Outer-radius bonus (r > 70% arena): +0.4 m/s push. dmgMult 1.26×; lockMs 75. dmgMult 1.26× ≤ 1.5 ✓; lockMs 75 ≤ 300 ✓.  
**Gimmick**: Parent: Sea-Surge wave-crest contact (Case 1746)

---

### [Case 1749 — Thermal Lacerta WA130HF — HF High-Speed Flat Rubber Traction + WA130 Wide-Attack Track Horizontal Contact Plane](./13%20case%20study.md#case-1749)

**System**: MFB / Metal Masters  
**Geometry**: Lacerta Metal Wheel: r = 3.6 cm; Thermal Energy Ring: r = 3.8 cm; WA130 track: h = 1.30 cm, wide flange +12% contact; I_total = 2.662×10⁻⁵ kg·m²; HF tip: r = 0.8 cm rubber, μ = 0.82; m_total = 47.0 g; ω₀ = 850 rad/s  
**Mechanism**: F_traction = 0.3783 N; v_impact = 1.966 m/s (240 mm). WA130 +12% → J = 0.1347 N·s. Head-on counter (v_rel = 4.466 m/s): Δv each = 2.94 m/s. White trail glow: v_rim = 6.80 m/s > 5 m/s threshold (physically real). [M] v = 8.85 m/s → Δv_opp = 13.15 m/s ring-out.  
**Gimmick**: HF maximum rubber traction + WA130 wide-flange contact plane → MechanicRegistry: hf_ballistic_traction

---

### [Case 1750 — Thermal Lacerta WA130HF — Piercing Brink Strike](./13%20case%20study.md#case-1750)

**System**: MFB / Metal Masters  
**Blader**: Chiyun Li  
**Special Move**: Piercing Brink Strike — head-on counter; physical: J = 0.1353 N·s; Δv each = 2.88–2.94 m/s; Lacerta retains −0.914 m/s reversal momentum (sets up Diving Crush follow-up). [M] v = 8.85 m/s → J = 0.605 N·s → Δv_opp = 13.15 m/s; reversal momentum = −4.02 m/s. White trail physically real (v_rim = 6.80 m/s). powerCost 100.  
**Compatible beys**: Thermal Lacerta WA130HF (primary); Fang Leone 130W²D; any Lacerta-series bey with HF / RF / R²F tip; Storm Pegasus 105RF

---

### [Case 1751 — Thermal Lacerta WA130HF — Brink Rush](./13%20case%20study.md#case-1751)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Brink Rush. Sequence: moveRight → attack → attack (→ A A). Cost: 25. Type: attack. → approach run; AA double-strike. Head-on bonus: relSpeed > 4 m/s → dmgMult = min(1.50, 1.38 × 1.10) = 1.48×; else 1.38×; lockMs 100. dmgMult ≤ 1.50 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: HF ballistic traction + WA130 wide-flange contact plane (Case 1749)

---

### [Case 1752 — Ninja Salamander SW145SD — SW145 Synchronized Wide Track Triple-Wing Vortex + SD Semi-Defense Tip Orbital Lock](./13%20case%20study.md#case-1752)

**System**: MFB / Metal Masters  
**Geometry**: Ninja Metal Wheel: r = 3.5 cm; SW145 track: 3 counter-rotating wings, r_tip = 1.45 cm; I_total = 2.329×10⁻⁵ kg·m²; SD tip: r = 0.5 cm, μ = 0.25; m_total = 44.1 g; ω₀ = 780 rad/s  
**Mechanism**: Wing counter-rotation ω_wing = 103.4 rad/s (v_orbit-driven); Strouhal shedding 300 Hz (3 wings); physical clone count ≈ 2.7 apparent positions (flickering). [M] v_orbit = 8 m/s → 5 apparent positions. SD axial decay τ = 33.5 s.  
**Gimmick**: SW145 dual-vortex clone multi-position effect → MechanicRegistry: sw145_dual_vortex

---

### [Case 1753 — Ninja Salamander SW145SD — Phantom Fire Shot](./13%20case%20study.md#case-1753)

**System**: MFB / Metal Masters  
**Blader**: Shinobu Hiryūin  
**Special Move**: Phantom Fire Shot — [M] 5 apparent positions (v_orbit = 8 m/s); tracking accuracy 20% [M]; defense penalty −80% [M]. Central converge strike: physical J = 0.086 N·s; Δv_phys = 1.87 m/s per hit (3 passes cumulative 5.61 m/s ring-out); [M] J = 0.459 N·s → Δv_[M] = 9.98 m/s single-hit ring-out. powerCost 100.  
**Compatible beys**: Ninja Salamander SW145SD (primary — SW145 counter-rotating wings required); any MFB bey with SW145 track

---

### [Case 1754 — Ninja Salamander SW145SD — Smoke Screen](./13%20case%20study.md#case-1754)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Smoke Screen. Sequence: dodge → attack → attack (E A A). Cost: 15. Type: universal. E repositions to confusion blind-spot; AA double-strike exploits trackingPenalty. base dmgMult 1.25×; +0.20 if trackingPenalty active → 1.45×; lockMs 85. dmgMult ≤ 1.5 ✓; lockMs 85 ≤ 300 ✓.  
**Gimmick**: Parent: SW145 dual-vortex clone effect (Case 1752)

---

### [Case 1755 — Atlas Anubion Yell Orbit — Yell Forge Disc Wide-Diameter Gyroscopic Angular Momentum + Orbit Driver Pinpoint Ultra-Low Friction Orbital Stability](./13%20case%20study.md#case-1755)

**System**: Burst / GT  
**Geometry**: Anubion Layer: r = 3.8 cm; Yell disc (widest in GT, r = 4.0 cm); Orbit driver pinpoint: r = 0.3 cm, μ = 0.02; I_total = 4.258×10⁻⁵ kg·m²; m_total = 64.3 g; ω₀ = 700 rad/s  
**Mechanism**: L = 2.981×10⁻² kg·m²/s (one of highest in GT); Ω_prec = 0.0332 rad/s (extremely stable). Orbit α = 0.1480 rad/s² → τ_endurance = 4,730 s theoretical (~1500 s practical). Centrifugal attack: F_cf = 2.143 N → cumulative 4-hit Δv_total = 2.796 m/s; [M] F_cf = 43.35 N → Δv_[M] = 14.13 m/s per hit.  
**Gimmick**: Yell wide-disc L-storage + Orbit ultra-low friction → MechanicRegistry: yell_disc_orbit_stability

---

### [Case 1756 — Atlas Anubion Yell Orbit — Perfect Circle](./13%20case%20study.md#case-1756)

**System**: Burst / GT  
**Blader**: Akira Yamatoga  
**Special Move**: Perfect Circle — defense orbit phase (J_att absorbed → only 4.7° precession); [M] L-redirect attack: J_per_opp = L/r_orbit × 4.5 [M] → Δv = 5.40 m/s per opponent (ring-out); simultaneous multi-target strike. Physical centrifugal cumulative Δv = 2.796 m/s. powerCost 100; spin cost ×0.78.  
**Compatible beys**: Atlas Anubion Yell Orbit (primary); Venom Devolos Hold Universe; any GT bey with Yell disc; Fafnir F4 10Glaive Nothing

---

### [Case 1757 — Atlas Anubion Yell Orbit — Orbit Crush](./13%20case%20study.md#case-1757)

**System**: Burst / GT  
**Mechanism**: COMBO — Orbit Crush. Sequence: defense → moveUp → attack (K ↑ A). Cost: 25. Type: stamina. K defense-orbit; ↑ spiral-tighten; A L-redirect release smash. Only at spin ≥ 55% (Yell disc L requirement). dmgMult 1.40×; lockMs 150. dmgMult 1.40× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Yell disc orbital L-storage (Case 1755)

---

### [Case 1758 — Breaker Xcalius 1'Dagger Sword — 1'Dagger Disc 5-Point Contact Geometry + Sword Driver Blade-Tip Multi-Contact Strike](./13%20case%20study.md#case-1758)

**System**: Burst / Evolution  
**Geometry**: Xcalius Layer: r = 3.8 cm (sword blade); 1' disc + Dagger frame: r = 2.8 cm; Sword driver 3-blade: r = 0.4 cm; I_total = 2.887×10⁻⁵ kg·m²; m_total = 60.4 g; ω₀ = 830 rad/s  
**Mechanism**: 5 contact points: 1 layer sword (v = 31.54 m/s) + 1 Dagger frame (v = 23.24 m/s) + 3 Sword driver blades (v = 3.32 m/s). 5-point anti-deflection efficiency ×1.32; J_penta = 0.2631 N·s; Δv_opp = 5.72 m/s (ring-out physically). [M] v = 10.5 m/s → J = 0.837 N·s → Δv = 18.2 m/s.  
**Gimmick**: 5-point simultaneous contact anti-deflection geometry → MechanicRegistry: penta_contact_strike

---

### [Case 1759 — Breaker Xcalius 1'Dagger Sword — Penta Saber](./13%20case%20study.md#case-1759)

**System**: Burst / Evolution  
**Blader**: Xavier Bogard  
**Special Move**: Penta Saber — physical 5-point simultaneous contact J = 0.2631 N·s → Δv = 5.72 m/s (ring-out without BeySpirit); [M] BeySpirit perfect sub-ms alignment × 3.5 → J = 0.837 N·s → Δv = 18.2 m/s. powerCost 100; spin cost ×0.82.  
**Compatible beys**: Breaker Xcalius 1'Dagger Sword (primary); any Xcalius-series bey with Sword driver + Dagger frame; Judgement Joker 00Cross Flash; Slash Valkyrie 6Vortex Reboot

---

### [Case 1760 — Breaker Xcalius 1'Dagger Sword — Blade Cross](./13%20case%20study.md#case-1760)

**System**: Burst / Evolution  
**Mechanism**: COMBO — Blade Cross. Sequence: moveRight → jump → attack (→ J A). Cost: 35. Type: attack. → charge approach; J jump-align blade angle; A penta-contact smash. dmgMult 1.45×; lockMs 160. dmgMult 1.45× ≤ 1.5 ✓; lockMs 160 ≤ 300 ✓.  
**Gimmick**: Parent: 5-point contact anti-deflection geometry (Case 1758)

---

### [Case 1761 — Apollon — Dual-Head Attack Ring Twin-Contact Strike + Flash-Point Frictional Vaporization](./13%20case%20study.md#case-1761)

**System**: Plastic / G-Revolution  
**Geometry**: Apollon AR (dual-head): r = 3.6 cm (180° spacing); Wide WD: r = 3.2 cm; I_total = 1.732×10⁻⁵ kg·m²; m_total = 38.1 g; ω₀ = 750 rad/s  
**Mechanism**: v_rim = 27.0 m/s (highest plastic-era); contact ΔT = 1,273°C (above ABS vaporization, physically real); blackbody radiance = 5.36 W/sr (above involuntary blink threshold physically). Dual-head simultaneous: J_dual = 0.1782 N·s; Δv_opp = 4.68 m/s (ring-out physically). [M] ×8.5 → ΔT = 10,821°C; Δv = 39.9 m/s.  
**Gimmick**: Dual-head twin-contact + contact-flash vaporization → MechanicRegistry: dual_head_contact / contact_flash

---

### [Case 1762 — Apollon — Radiant Thunder](./13%20case%20study.md#case-1762)

**System**: Plastic / G-Revolution  
**Blader**: Garland Siebald  
**Special Move**: Radiant Thunder — Phase 1: [M] arc-flash 857.6 W/sr (retinal injury level); neural shock causes Tala-coma level trauma. Phase 2: ΔT = 10,821°C (alloy-melting [M]). Phase 3: J_dual_[M] = 1.519 N·s → Δv = 39.9 m/s. Total E_[M] = 73.1 J (173.6× physical). Physical ring-out capable (4.68 m/s) and eye-flinch (5.36 W/sr) WITHOUT BeySpirit. powerCost 100.  
**Compatible beys**: Apollon (primary); Cyber Dragoon (reduced flash); any G-Revolution BEGA-tier bey with solar/lightning-type Bit Beast

---

### [Case 1763 — Apollon — Thunder Cross](./13%20case%20study.md#case-1763)

**System**: Plastic / G-Revolution  
**Mechanism**: COMBO — Thunder Cross. Sequence: moveLeft → moveRight → attack (← → A). Cost: 25. Type: attack. ← → crossing path sets up dual-head simultaneous contact; contact spark flash (+0.15 trackingPenalty 300 ms — physical, not blinding). dmgMult 1.44×; lockMs 145. dmgMult 1.44× ≤ 1.5 ✓; lockMs 145 ≤ 300 ✓.  
**Gimmick**: Parent: Dual-head twin-contact + contact-flash (Case 1761)

---

### [Case 1764 — Raid Lúinor Destroy' 3A (Rage Longinus Destroy' 3A) — Rage Ring Upper-Type Blade + 3A Chassis Triple-Blade Mass Distribution](./13%20case%20study.md#case-1764)

**System**: Burst / Sparking  
**Geometry**: Rage Ring: r = 4.4 cm, swept blade φ = 40°; 3A Chassis: r = 4.4 cm, 120° spacing (70.4% optimal-contact probability); I_total = 3.594×10⁻⁵ kg·m²; m_total = 68.2 g; Destroy' rubber driver; ω₀ = 800 rad/s  
**Mechanism**: v_rim = 35.2 m/s (highest in Burst Sparking standard library). J_total = 0.2986 N·s; J_h = 0.2287 N·s (ring-out); J_v = 0.1920 N·s → Δv_v = 4.17 m/s → h_aerial = 0.886 m (physically). L = 2.875×10⁻² kg·m²/s; Ω_prec_recoil = 0.457 rad/s (barely deflects from own uppercut).  
**Gimmick**: Upper-blade simultaneous ring-out + aerial launch → MechanicRegistry: upper_blade_aerial

---

### [Case 1765 — Raid Lúinor Destroy' 3A — Raid Upper](./13%20case%20study.md#case-1765)

**System**: Burst / Sparking  
**Blader**: Lui Shirosagi  
**Special Move**: Raid Upper — physical Δv_total = 6.49 m/s + h = 0.886 m (ring-out without BeySpirit). [M] v = 15.75 m/s → J_h = 1.029 N·s → Δv_h = 22.4 m/s; Δv_v = 18.8 m/s → h_[M] = 18.0 m (stadium-clearing aerial). powerCost 100.  
**Compatible beys**: Raid/Rage Lúinor Destroy' 3A (primary); any Longinus-series bey with Rage/Raid Ring; Buster Xcalius 1'Dagger Sword'; Bloody Longinus 13 Jolt

---

### [Case 1766 — Raid Lúinor Destroy' 3A — Blitz Upper](./13%20case%20study.md#case-1766)

**System**: Burst / Sparking  
**Mechanism**: COMBO — Blitz Upper. Sequence: moveUp → attack → attack (↑ A A). Cost: 25. Type: attack. ↑ surge approach; first A blade contact; second A 3A chassis follow-through. dmgMult 1.42×; lockMs 140; vertical knockback +1.2 m/s (upper-blade geometry, no [M]). dmgMult 1.42× ≤ 1.5 ✓; lockMs 140 ≤ 300 ✓.  
**Gimmick**: Parent: Upper-blade aerial launch (Case 1764)

---

### [Case 1767 — Heat Salamander 12 Operate — Crystal Blade AR Upward-Redirect + Operate Driver Rubber-Free-Spin Dual-Mode Endurance](./13%20case%20study.md#case-1767)

**System**: Burst / GT  
**Geometry**: Salamander Ring (crystal blades): r = 3.8 cm, θ_redirect = 55°; Forge Disc 12: r = 2.5 cm; Operate driver rubber outer: r = 0.7 cm, μ = 0.75; I_total = 1.985×10⁻⁵ kg·m²; m_total = 51.4 g; ω₀ = 730 rad/s  
**Mechanism**: Crystal blade redirect: v_y = 1.966 m/s upward (from 3.0 m/s incoming); h_apex = 0.197 m (physical). Operate bearing: α_bearing = 0.20 rad/s² in air (spin fully preserved). Landing ΔT = 1,927°C (fire-orange glow physically real).  
**Gimmick**: Crystal blade upward-redirect + Operate dual-mode endurance → MechanicRegistry: crystal_redirect_aerial

---

### [Case 1768 — Heat Salamander 12 Operate — Rain of Swordfire](./13%20case%20study.md#case-1768)

**System**: Burst / GT  
**Blader**: Suoh Genji  
**Special Move**: Rain of Swordfire — triggered by incoming hit; physical flip h = 0.197 m, drop Δv = 2.97 m/s (sub-ring-out). [M] h = 1.281 m (×6.5); drop J = 0.348 N·s; spin-energy conversion [M] +0.382 N·s; total J = 0.730 N·s → Δv_opp = 15.9 m/s ring-out. Fire glow landing: ΔT = 1,927°C (physically real). powerCost 100.  
**Compatible beys**: Heat/Hell Salamander 12 Operate (primary); Ninja Salamander SW145SD (reduced); any Salamander-series crystal/blade-layer bey; Storm Pegasus 105RF (similar aerial arc)

---

### [Case 1769 — Heat Salamander 12 Operate — Sword Drop](./13%20case%20study.md#case-1769)

**System**: Burst / GT  
**Mechanism**: COMBO — Sword Drop. Sequence: moveDown → jump → attack (↓ J A). Cost: 15. Type: attack. ↓ low-approach; J aerial arc (self-initiated, no hit required); A drop-strike. base dmgMult 1.30×; +0.15 reactive if hit within 500 ms → 1.45×; lockMs 85. dmgMult ≤ 1.5 ✓; lockMs 85 ≤ 300 ✓.  
**Gimmick**: Parent: Crystal blade upward-redirect (Case 1767)

---

### [Case 1770 — Dark Bull H145SD — H145 Horn Track Low-Tilt Strike + SD Stadium-Scrape Approach](./13%20case%20study.md#case-1770)

**System**: MFB / Metal Fusion  
**Geometry**: Dark Metal Wheel: r = 3.8 cm; H145 track horn: r_horn = 1.45 cm, φ = 55° upward; I_total = 3.377×10⁻⁵ kg·m²; m_total = 39.0 g; ω₀ = 750 rad/s  
**Mechanism**: Tilt θ = 18° → horn 2.05 mm above floor (below opponent AR lower edge at 6–8 mm). v_horn = 10.875 m/s. Upward impulse: J_v = 0.1083 N·s → Δv_v = 2.35 m/s → h_aerial = 0.281 m (physically real). J_h = 0.075 N·s → Δv_h = 1.63 m/s. [M] v = 15 m/s → h_[M] = 9.30 m; Δv_h_[M] = 9.49 m/s.  
**Gimmick**: H145 horn underside tilted strike → MechanicRegistry: horn_underside_upper

---

### [Case 1771 — Dark Bull H145SD — Red Horn Uppercut](./13%20case%20study.md#case-1771)

**System**: MFB / Metal Fusion  
**Blader**: Benkei Hanawa  
**Special Move**: Red Horn Uppercut — tilted below-AR approach (h_horn = 2.05 mm floor height, physically real); physical Δv_v = 2.35 m/s → h = 0.281 m aerial. [M] v = 15 m/s → h_[M] = 9.30 m; Δv_h = 9.49 m/s ring-out. "Digs underground" = severe tilt positioning horn at floor level — physically confirmed. powerCost 100.  
**Compatible beys**: Dark Bull H145SD (primary); Rock Bull 145WD; any MFB bey with H145 track (horn geometry required)

---

### [Case 1772 — Dark Bull H145SD — Horn Rush](./13%20case%20study.md#case-1772)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Horn Rush. Sequence: moveDown → moveRight → attack (↓ → A). Cost: 15. Type: attack. ↓ bowl-wall low-position; → bowl-sweep below opponent AR; A upward horn strike. dmgMult 1.33×; lockMs 95; vertical knockback +0.8 m/s. dmgMult 1.33× ≤ 1.5 ✓; lockMs 95 ≤ 300 ✓.  
**Gimmick**: Parent: H145 horn underside tilted strike (Case 1770)

---

### [Case 1773 — Spryzen Requiem 0 Zeta — Dual-Spin Rubber Layer Spin-Equalization Torque + 0 Disc Center-Weight + Zeta Driver Orbital Lock](./13%20case%20study.md#case-1773)

**System**: Burst / Burst God SwitchStrike  
**Geometry**: Spriggan Requiem Layer (RS+LS): r = 3.8 cm; 0 Disc: r = 2.0 cm (center-weight); Zeta driver: r = 0.35 cm sharp; I_total = 2.719×10⁻⁵ kg·m²; m_total = 46.05 g; ω₀ = 650 rad/s  
**Mechanism**: 4 rubber pads (r = 3.6 cm, μ = 0.65): τ_eq = 0.2808 N·m; Δω_drain = 82.6 rad/s per contact; practical ±41.3 rad/s per contact. Metal axe (LS mode): P_contact = 159 MPa (3.53× ABS yield) → local yielding. Zeta α = 0.928 rad/s².  
**Gimmick**: Rubber pad spin-equalization + dual-spin mode-change + metal axe critical → MechanicRegistry: spin_equalize / mode_change_layer / metal_axe_strike

---

### [Case 1774 — Spryzen Requiem 0 Zeta — Requiem Spin](./13%20case%20study.md#case-1774)

**System**: Burst / Burst God  
**Blader**: Shu Kurenai  
**Special Move**: Requiem Spin — same-spin drain: physical −41.3 rad/s/contact (opponent stalls in 14.5 s at 1/s); [M] −82.6 rad/s/contact (100% coupling); [M] opponent stalls in 4.84 s at 3/s. Counter-spin overload [M]: +82.6 rad/s injected INTO opponent → overclock → nutation → ring-out at ω > 1.5×ω₀. Works in both RS and LS. powerCost 100.  
**Compatible beys**: Spryzen Requiem 0 Zeta (primary); Astral Spryzen Over Quattro-0; Mirage Fafnir Nothing 2S (same-spin only); Vanish Fafnir Tapered Kick-3

---

### [Case 1775 — Spryzen Requiem 0 Zeta — Requiem Whip](./13%20case%20study.md#case-1775)

**System**: Burst / Burst God  
**Blader**: Shu Kurenai  
**Special Move**: Requiem Whip — LS attack mode (CCW); metal axe P_contact = 159 MPa (3.53× ABS yield); physical J = 0.1658 N·s → Δv = 3.60 m/s (approaching ring-out + material damage). [M] v = 12 m/s → J = 0.663 N·s → Δv = 14.4 m/s; P_[M] = 636 MPa (steel yield approached); structuralDamage += 0.25 per hit. powerCost 100.  
**Compatible beys**: Spryzen Requiem 0 Zeta (primary); Astral Spryzen Over Quattro-0; any Spryzen-series bey with LS axe blade

---

### [Case 1776 — Spryzen Requiem 0 Zeta — Requiem Dash](./13%20case%20study.md#case-1776)

**System**: Burst / Burst God  
**Mechanism**: COMBO — Requiem Dash. Sequence: moveRight → defense → attack (→ K A). Cost: 15. Type: stamina. LS mode: Zeta driver orbital orbit → dmgMult 1.37×; lockMs 60. RS mode: rubber pad drain active → dmgMult 1.22× + 5% spin drain on contact. dmgMult 1.37× ≤ 1.5 ✓; lockMs 60 ≤ 300 ✓.  
**Gimmick**: Parent: Dual-spin rubber drain + Zeta orbital (Case 1773)

---

### [Case 1777 — Revive Phoenix 10 Friction — Detachable Revive Armor Ricochet System](./13%20case%20study.md#case-1777)

**System**: Burst / Cho-Z  
**Geometry**: Revive Phoenix layer total: m_total = 56.0 g; m_armor = 13.8 g detachable armor ring; r_armor ≈ 3.7 cm; Friction driver: r_rubber = 0.7 cm, μ = 0.85  
**Mechanism**: Latch shear threshold impulse = 0.168 N·s. On sufficient impact: armor ejects at v_eject = 51.1 m/s (≈183 km/h) [M]; ricochet velocity off stadium wall = 43.4 m/s. Underlying Phoenix layer exposes raised wing contact points. Physical ejection: friction fit breaks at ~40 N impact (no single-contact physical force reaches this; armor does NOT physically detach in game without BeySpirit). t_cross stadium after ricochet ≈ 4.6 ms.  
**Gimmick**: Detachable armor burst → ricochet projectile + layer exposure → MechanicRegistry: armor_eject

---

### [Case 1778 — Revive Phoenix 10 Friction — Revive Crush](./13%20case%20study.md#case-1778)

**System**: Burst / Cho-Z  
**Blader**: Free De La Hoya  
**Special Move**: Revive Crush — two-stage impact: (1) armor ejection ricochet (v = 43.4 m/s → Δv_opp = 21.5 m/s [M]); (2) direct Phoenix wing strike (Δv = 3.55 m/s physical → [M] v_phoenix = 8.2 m/s). Physical Δv_total = 25.1 m/s; conservative ring-out threshold 4.54 m/s — physical wing strike alone borderline. [M] Δv = 135 m/s combined; ×29.7 amplification. Contact heat: armor edge ΔT = 2,318°C (ablative edge effect [M] — armor edge vaporizes on impact). powerCost 100.  
**Compatible beys**: Revive Phoenix 10 Friction (primary); any Cho-Z bey with armor tab and prominent wing contact points

---

### [Case 1779 — Revive Phoenix 10 Friction — Phoenix Pincer](./13%20case%20study.md#case-1779)

**System**: Burst / Cho-Z  
**Mechanism**: COMBO — Phoenix Pincer. Sequence: moveRight → defense → moveUp (→ K ↑). Cost: 15. Type: attack. → circles to opponent flank; K raises armor tab pre-stress (armorTabStress builds, < 1.0 for partial buildup only); ↑ wing strike from above. dmgMult 1.35×; lockMs 80. dmgMult 1.35× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Detachable armor ricochet system (Case 1777)

---

### [Case 1780 — Rock Orso D125B — Multi-Claw Energy Ring + D125 Defense Track](./13%20case%20study.md#case-1780)

**System**: MFB / Metal Fusion  
**Geometry**: Rock Orso layer: 4 claw protrusions at 90° spacing; claw contact φ = 30° from horizontal; r_claw ≈ 2.25 cm; D125 track: h = 1.25 cm; Ball tip: r_ball = 0.2 cm; I_total = 4.07×10⁻⁵ kg·m²; m_total = 39.2 g; ω₀ = 650 rad/s  
**Mechanism**: At ω₀ = 650 rad/s, t_between claws = 2.42 ms (sequential impact). D125 track: deflection angle 15° → lateral recoil rather than energy absorption. Ball tip endurance: 172 s stable spin before tip drag becomes significant. Hertz contact pressure p₀ = 2.98 MPa (well below ABS yield ~60 MPa → elastic deformation only). Claw geometry φ = 30° splits reaction: 0.866 radial + 0.5 tangential.  
**Gimmick**: Multi-claw sequential strike + D125 lateral deflection → MechanicRegistry: sequential_claw / track_deflect

---

### [Case 1781 — Rock Orso D125B — Russian Bear Hook](./13%20case%20study.md#case-1781)

**System**: MFB / Metal Fusion  
**Blader**: Benkei Hanawa  
**Special Move**: Russian Bear Hook — 3-contact claw sequence: J_total = 0.2759 N·s physical; Δv_opp = 5.99 m/s (ring-out physically). D125 lateral deflection included in chain. [M] 6-contact sequence: v_rel = 16.8 m/s → Δv_opp = 71.9 m/s; ×12 amplification. Surface ΔT ≈ 129°C (ABS surface softening, not vaporization). powerCost 100.  
**Compatible beys**: Rock Orso D125B (primary); Dark Bull H145SD (H145 horn shares similar sequential geometry)

---

### [Case 1782 — Rock Orso D125B — Bear Claw Counter](./13%20case%20study.md#case-1782)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Bear Claw Counter. Sequence: moveDown → moveRight → attack (↓ → A). Cost: 0. Type: universal. ↓ low-ball positioning; → sweep to flank; A 2-contact chain (D125 disk deflection 15° + claw hook). dmgMult 1.28×; lockMs 60. dmgMult 1.28× ≤ 1.5 ✓; lockMs 60 ≤ 300 ✓.  
**Gimmick**: Parent: Multi-claw + D125 deflect (Case 1780)

---

### [Case 1783 — Wonder Valtryek V3 Wing Accel' — Rush Launch Mechanics](./13%20case%20study.md#case-1783)

**System**: Burst / God Layer  
**Geometry**: Wonder Valtryek V3 layer: r = 3.25 cm; Wing disc: r = 3.05 cm; Accel' driver: r_tip = 0.15 cm (sharp); I_total = 1.131×10⁻⁵ kg·m²; m_total = 34.2 g  
**Mechanism**: Standard launch ω₀ = 650 rad/s; Rush launch ω₀ = 720 rad/s (+10.8%). v_center after 7.0 cm bowl descent = 2.761 m/s. Tilt at bowl center ≈ 64.6° from vertical; critical floor-scrape angle θ_c = 21° (below this → Accel' tip contacts floor → 20% spin penalty). Precession rate Ω = 0.206 rad/s at θ = 10°. Applies to all Valt-series Valtryeks and Saviour Valtryek Shot-7.  
**Gimmick**: Rush launch ω boost + steep tilt trajectory + critical scrape threshold → MechanicRegistry: launch_boost / tilt_launch

---

### [Case 1784 — Wonder Valtryek V3 Wing Accel' — Rush Launch](./13%20case%20study.md#case-1784)

**System**: Burst / God Layer  
**Blader**: Valt Aoi  
**Special Move**: Rush Launch — 2-contact barrage: J_total = 0.3758 N·s physical; Δv_opp = 8.17 m/s (ring-out physically achieved). [M] 6-contact: v_rel = 27.81 m/s → Δv_opp = 110.3 m/s. Floor scrape penalty: if launchAngle < 21° → −20% spin applied to Valtryek at match start. powerCost 100.  
**Compatible beys**: Wonder Valtryek V3 Wing Accel' (primary); Saviour Valtryek Shot-7; any Valt Aoi Valtryek-series bey

---

### [Case 1785 — Wonder Valtryek V3 Wing Accel' — Rush Drive](./13%20case%20study.md#case-1785)

**System**: Burst / God Layer  
**Mechanism**: COMBO — Rush Drive. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 0. Type: universal. ↑ bowl-wall high-position (h = 4.0 cm above floor); → descend sweep (+0.886 m/s from 40 mm descent); A wing strike at v_total = 3.007 m/s; J = 0.09145 N·s. dmgMult 1.40×; lockMs 45. dmgMult 1.40× ≤ 1.5 ✓; lockMs 45 ≤ 300 ✓.  
**Gimmick**: Parent: Rush launch mechanics (Case 1783)

---

## CS15 — Cases 1786–2092 {#cs15}
Source: `15 case study.md` (use FIRST occurrence only — duplicates start at ~line 21449)

---

### [Case 1786 — Regalia Genesis Hybrid — Motorized Stamina Fortress with Mugen Lock](./15%20case%20study.md#case-1786)

**System**: Burst / Cho-Z Gatinko (Turbo era)  
**Geometry**: Regalia Genesis Ring: r = 3.1 cm; Bigbang Armor: r_contact = 3.1 cm (6 protrusions, φ = 20°); Hybrid driver (motorized); m_total = 69.0 g; I_total = 5.075×10⁻⁵ kg·m²; ω₀ = 650 rad/s  
**Mechanism**: Mugen Lock burst threshold τ ≥ 240 mN·m (vs. 10–30 mN·m standard 3-tab); P_burst (Bigbang Armor) = 0.025. Hybrid motor fires once at ω_trigger = 382 rad/s → +69.4 rad/s boost; ΔKE = 1.344 J. High I (2nd in all Burst): Δω_Genesis per contact = 159 rad/s — absorbs ~2.8 full Royal Scream contacts before motor trigger.  
**Gimmick**: Motor-stamina fortress + near-burst-immune Mugen Lock → MechanicRegistry: motor_stamina / mugen_lock

---

### [Case 1787 — Regalia Genesis Hybrid — Royal Scream](./15%20case%20study.md#case-1787)

**System**: Burst / Cho-Z Gatinko  
**Blader**: Gwyn Reynolds  
**Special Move**: Royal Scream — Bigbang Armor contact strike: physical v_rel = 4.17 m/s → J = 0.1841 N·s → Δv_opp = 4.00 m/s (ring-out threshold exactly). Genesis spin drop only 112 rad/s per contact (vs. 381 rad/s for typical attack bey). [M] 4 simultaneous contacts, v_rel × 5.0 → J_total = 3.683 N·s → Δv_opp = 80.1 m/s; ×20.0 amplification. powerCost 100.  
**Compatible beys**: Royal Genesis Hybrid / Regalia Genesis Hybrid (primary); Perfect Genesis Hybrid

---

### [Case 1788 — Regalia Genesis Hybrid — Royal Eclipse](./15%20case%20study.md#case-1788)

**System**: Burst / Cho-Z Gatinko  
**Blader**: Gwyn Reynolds  
**Special Move**: Royal Eclipse — motor-boosted counter-burst: motor fires at ω = 382 rad/s (+69.4 rad/s boost); e_eclipse = 0.653 (boosted COR); J_counter = 0.1214 N·s → Δv_att = 3.19 m/s; burst torque on attacker τ = 2428 mN·m (>> 734 mN·m Cho-Z centripetal threshold → any attacker bursts). [M] ×8.0 → τ_[M] = 19,424 mN·m; Δv_[M] = 25.5 m/s. Motor fires once per match. powerCost 100.  
**Compatible beys**: Royal Genesis Hybrid / Perfect Genesis Hybrid (Hybrid motor driver required)

---

### [Case 1789 — Regalia Genesis Hybrid — Genesis Overload](./15%20case%20study.md#case-1789)

**System**: Burst / Cho-Z Gatinko  
**Mechanism**: COMBO — Genesis Overload. Sequence: defense → attack → defense (K A K). Cost: 0. Type: universal. K1: absorb fraction f = 0.772 (Genesis high-I momentum buffer); A: counter strike J = 0.08838 N·s; dmgMult 1.45×; K2: return-to-center lock. lockMs 100. dmgMult 1.45× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Motorized fortress + Mugen Lock (Case 1786)

---

### [Case 1790 — Kinetic Satomb 2Glaive Loop / Curse Satomb Hurricane Universe 1D — Roller Drift System](./15%20case%20study.md#case-1790)

**System**: Burst / God Layer (Kinetic); DB (Curse)  
**Geometry**: Kinetic Satomb: 3 spherical roller bumpers at r = 2.0 cm (ball-socket, e = 0.78); Loop driver: r_roller = 1.5 cm; φ_critical (drift onset) = 7.66°; I_total = 1.36×10⁻⁵ kg·m²; m_total = 45.2 g. Curse Satomb: Universe driver μ_bearing ≈ 0.005.  
**Mechanism**: Loop drift mode τ_drift = 3.33×10⁻⁵ N·m → t_drift = 265 s (vs. t_upright = 39.8 s; 6.66× longer). Bumper ball-socket deflects attacker laterally: J_lateral = 0.0965 N·s at θ_att = 40°; only 2.81% of normal force transmitted to Satomb body.  
**Gimmick**: Peripheral roller drift + spherical bumper deflection → MechanicRegistry: roller_drift / bumper_deflect

---

### [Case 1791 — Kinetic Satomb 2Glaive Loop — Roller Drift](./15%20case%20study.md#case-1791)

**System**: Burst / God Layer  
**Blader**: Silas Karlisle  
**Special Move**: Roller Drift — post-tilt drift counterattack: Ω_prec = 0.326 rad/s at φ = 30°; bowl slope assist +1.085 m/s → v_strike = 2.605 m/s; J_counter = 0.09508 N·s → Δv_opp = 2.07 m/s (knockback). Spin preserved: only 6.12 rad/s lost over 2.5 s drift (vs. 40.8 rad/s tip friction). [M] v_strike × 7.0 → Δv_opp = 14.5 m/s; ×7.0 amplification. powerCost 100.  
**Compatible beys**: Kinetic Satomb 2Glaive Loop; any bey with peripheral-roller Loop-type driver

---

### [Case 1792 — Kinetic/Curse Satomb — Roller Defense](./15%20case%20study.md#case-1792)

**System**: Burst / God Layer + DB  
**Blader**: Silas Karlisle  
**Special Move**: Roller Defense — spherical bumper lateral deflect: Δv_attacker_lateral = 2.54 m/s at θ_att = 40°; Satomb body Δv = 0.559 m/s; Δω_Satomb = 37.2 rad/s (vs. 181 rad/s flat-ABS → 79% spin-loss reduction). Curse Satomb variant: Universe driver τ_decay ≈ 0 → near-infinite stamina. [M] e_bumper × 3.0 → Δv_lateral = 8.48 m/s (attacker ring-out from own hit); ×3.34 amplification. powerCost 100.  
**Compatible beys**: Kinetic Satomb 2Glaive Loop; Curse Satomb Hurricane Universe 1D; any Satomb layer with spherical roller bumpers

---

### [Case 1793 — Kinetic/Curse Satomb — Roller Counter](./15%20case%20study.md#case-1793)

**System**: Burst / God Layer + DB  
**Mechanism**: COMBO — Roller Counter. Sequence: defense → moveRight → moveUp (K → ↑). Cost: 0. Type: universal. K: bumper lateral redirect → v_lateral = 2.134 m/s; →: drift boost +1.5 m/s; ↑: counterattack J = 0.1327 N·s → Δv_opp = 2.88 m/s. dmgMult 1.38×; lockMs 70. dmgMult 1.38× ≤ 1.5 ✓; lockMs 70 ≤ 300 ✓.  
**Gimmick**: Parent: Roller drift + bumper deflect (Case 1790)

---

### [Case 1794 — Roar Balkesh Giga Moment-10 — Moment Driver Traction-Switch System](./15%20case%20study.md#case-1794)

**System**: Burst / DB (Dynamite Battle)  
**Geometry**: Giga disc: r = 3.0 cm, 32.8 g; Armor 10: r = 2.8 cm, 15.5 g; Moment driver: outer rubber ring r = 1.8 cm (μ = 0.08), crown teeth r = 1.2 cm (μ = 0.45); I_total = 2.782×10⁻⁵ kg·m²; m_total = 79.7 g  
**Mechanism**: Glide mode t = 16.0 s; crash mode t = 4.28 s. Traction-switch: 12 tooth engagements over 180 ms → course change Δθ = 5.32°–10.6°. Speed retention after 12 switches: v_post ≈ 3.0 m/s from v_orbital = 3.5 m/s.  
**Gimmick**: Traction-switch course change + mass-backed crash → MechanicRegistry: traction_switch / course_redirect

---

### [Case 1795 — Roar Balkesh Giga Moment-10 — Ringing Crash](./15%20case%20study.md#case-1795)

**System**: Burst / DB  
**Blader**: Bashara Suiro  
**Special Move**: Ringing Crash — Moment driver course-change ambush: physical v_impact = 3.326 m/s after 10.6° redirect; J = 0.1582 N·s → Δv_opp = 3.44 m/s (ring-out threshold at v ≥ 3.6 m/s achievable late match). [M] 90° instant redirect; v_impact × 7.0 = 21.0 m/s; J = 1.000 N·s → Δv_opp = 21.7 m/s; ×6.3 amplification. powerCost 100.  
**Compatible beys**: Roar Balkesh Giga Moment-10 (Moment driver required); any DB bey with Moment Performance Tip

---

### [Case 1796 — Roar Balkesh Giga Moment-10 — Moment Dash](./15%20case%20study.md#case-1796)

**System**: Burst / DB  
**Mechanism**: COMBO — Moment Dash. Sequence: moveRight → moveUp → attack (→ ↑ A). Cost: 0. Type: universal. →: v_right = 1.50 m/s; ↑: Moment teeth pivot (ΔF = 0.289 N → v_up = 0.0544 m/s); A: strike at redirected heading with +20% contact efficiency → J = 0.08567 N·s → Δv_opp = 1.862 m/s. dmgMult 1.35×; lockMs 60. dmgMult 1.35× ≤ 1.5 ✓; lockMs 60 ≤ 300 ✓.  
**Gimmick**: Parent: Traction-switch course redirect (Case 1794)

---

### [Case 1797 — Shelter Regulus 5Star Tower — Claw Retraction & Tower Elevation System](./15%20case%20study.md#case-1797)

**System**: Burst / God Layer (B-69)  
**Geometry**: Shelter Regulus layer: r_ext = 3.8 cm (extended), r_ret = 2.3 cm (retracted); m_claw = 4.5 g; 5 disc: r = 3.0 cm; Tower driver: r_tip = 0.25 cm (rubber); I_ext = 3.490×10⁻⁵ kg·m²; I_ret = 3.078×10⁻⁵ kg·m²; m_total = 43.3 g  
**Mechanism**: Claw retraction (angular momentum conserved): ω: 650 → 736.9 rad/s (+86.9 rad/s, +13.4%); ΔKE = 0.985 J. Tower elevation: Δh = 1.5 cm → h_CoM = 2.7 cm → Ω_prec = 0.506 rad/s (vs. 0.225 rad/s standard; 2.25× tighter orbit). τ_Tower = 5.85×10⁻⁴ N·m; t_spin = 38.8 s.  
**Gimmick**: Claw-retract angular momentum boost + Tower height gyroscopic precession enhancement → MechanicRegistry: claw_retract / height_elevation

---

### [Case 1798 — Shelter Regulus 5Star Tower — Shelter Defense](./15%20case%20study.md#case-1798)

**System**: Burst / God Layer  
**Blader**: Ren Wu Sun  
**Special Move**: Shelter Defense — two-phase: (1) claw retract ω: 650 → 736.9 rad/s; (2) Tower-elevated deflection: J_n = 0.07888 N·s → attacker Δv = −1.578 m/s (79% speed reduction), Satomb Δω = 61.5 rad/s; downward component Δv_down = 0.290 m/s (floor traction strip). [M] ×5.0 → Δv = 7.9 m/s (ring-out). 1.5 s invulnerability window. powerCost 100.  
**Compatible beys**: Any bey with retractable-claw layer + Tower tip; standard: Shelter Regulus 5Star Tower

---

### [Case 1799 — Shelter Regulus 5Star Tower — Shell Guard](./15%20case%20study.md#case-1799)

**System**: Burst / God Layer  
**Mechanism**: COMBO — Shell Guard. Sequence: defense → dodge → defense (K E K). Cost: 15. Type: defense. Partial claw pulse: +30 rad/s spin (⅓ of full Δω = 86.9 rad/s); re-extension snap-back counter dmgMult 1.20×; lockMs 0 (pure parry). dmgMult 1.20× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Claw retraction + Tower elevation (Case 1797)

---

### [Case 1800 — Wild/Tempest Wyvron — Free-Spin Ring & Bowl Trajectory System](./15%20case%20study.md#case-1800)

**System**: Burst (Standard); Burst / God Layer (Tempest)  
**Geometry**: Tempest Wyvron 4Glaive Atomic: I_body = 1.531×10⁻⁵ kg·m²; m_total = 40.05 g; Atomic driver r_tip = 0.6 cm, μ = 0.70; bowl wall φ = 35°; Δh = 5.5 cm  
**Mechanism**: Free-spin ring absorbs 85% burst torque (RS) / 60% (LS); e_ring = 0.35. Post-impact: v_entry_bowl = 2.873 m/s; wall friction W = 0.02157 J; v_crash = 2.470 m/s at base.  
**Gimmick**: Free-ring burst absorption + bowl-wall kinematic crash → MechanicRegistry: free_ring_absorb / bowl_crash

---

### [Case 1801 — Wild/Tempest Wyvron — Shield Crash](./15%20case%20study.md#case-1801)

**System**: Burst / God Layer  
**Blader**: Wakiya Murasaki  
**Special Move**: Shield Crash — free-ring absorption redirects to bowl crash: J_received = 0.07506 N·s → v_entry = 2.873 m/s; v_crash = 2.470 m/s; J_crash = 0.09065 N·s → Δv_target = 1.813 m/s; Wyvron spin drain Δω = 165.8 rad/s (74.5% retained). [M] ×5.5 → Δv = 10.0 m/s (ring-out guaranteed). powerCost 100.  
**Compatible beys**: Wild Wyvron Vertical Orbit; Tempest Wyvron 4Glaive Atomic; any bey with free-spin ring ER redirectable via bowl wall

---

### [Case 1802 — Wild/Tempest Wyvron — Bowl Rider](./15%20case%20study.md#case-1802)

**System**: Burst / God Layer  
**Mechanism**: COMBO — Bowl Rider. Sequence: dodge → moveDown → attack (E ↓ A). Cost: 15. Type: balance. E: ring decouple absorb; ↓: redirect toward bowl slope; A: partial crash strike dmgMult 1.30× (+30% downhill momentum); lockMs 80. dmgMult 1.30× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Free-ring bowl trajectory (Case 1800)

---

### [Case 1803 — Erase Devolos Vanguard Bullet — Dual Phantom Chip Separation & Pincer Geometry](./15%20case%20study.md#case-1803)

**System**: Burst / GT Gatinko (LS)  
**Geometry**: GT Chip: m = 14.0 g, r = 0.8 cm, I_chip = 4.48×10⁻⁷ kg·m²; main layer: m = 52.5 g; I_total = 9.846×10⁻⁶ kg·m²; ω₀ = 650 rad/s LS  
**Mechanism**: Chip separates axially → both spin at 650 rad/s LS; pincer approach 180° apart. J_chip = 0.0350 N·s; J_main = 0.08195 N·s; τ_burst_combined = 1579 mN·m (31–79× standard threshold → instant burst any 3-click bey); net Δv = 0.939 m/s; Δω_target = 126.4 rad/s (−19.4%).  
**Gimmick**: Chip separation pincer + guaranteed burst torque → MechanicRegistry: chip_separate / pincer_burst

---

### [Case 1804 — Erase Devolos Vanguard Bullet — Shining Crux](./15%20case%20study.md#case-1804)

**System**: Burst / GT Gatinko (LS)  
**Blader**: Delta Zakuro  
**Special Move**: Shining Crux (Shining Cross) — requires Dual Phantom active (chip separated); simultaneous cross-impact: τ_burst = 1579 mN·m (guaranteed burst any standard bey without [M]); Δω_target = −126.4 rad/s; net Δv = 0.939 m/s. [M] ×8.0 → Δv = 7.5 m/s (ring-out + burst simultaneously). powerCost 100.  
**Compatible beys**: Erase Devolos Vanguard Bullet (Dual Phantom prerequisite required); any Gatinko bey with separable GT Chip (reduced amplitude)

---

### [Case 1805 — Erase Devolos Vanguard Bullet — Dual Slash](./15%20case%20study.md#case-1805)

**System**: Burst / GT Gatinko (LS)  
**Mechanism**: COMBO — Dual Slash. Sequence: moveLeft → attack → moveRight (← A →). Cost: 25. Type: attack. Double feint cross: ← approach J₁/2 = 0.0175 N·s + → main strike J₂ = 0.0820 N·s; Δω_drain = 65 rad/s (half pincer). dmgMult 1.45×; lockMs 150. dmgMult 1.45× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Chip separation pincer geometry (Case 1803)

---

### [Case 1806 — Earth Eagle 145WD — Earth Wheel Aerodynamic Lift & Vortex Focus System](./15%20case%20study.md#case-1806)

**System**: MFB / Metal Masters  
**Geometry**: Earth FW: r_outer = 4.0 cm, r_inner = 1.2 cm, 32.5 g; I_total = 2.970×10⁻⁵ kg·m²; m_total = 37.4 g; ω₀ = 700 rad/s; WD tip: r = 0.2 cm, μ = 0.25  
**Mechanism**: Aerodynamic lift F_lift = 0.604 N > W = 0.367 N at ω₀ → Eagle airborne at launch. ω_liftoff = 545.8 rad/s. Rankine vortex Γ = 0.7433 m²/s; F_aero = 0.01722 N on central opponent. t_spin (WD) = 113.2 s.  
**Gimmick**: Aerodynamic liftoff + vortex drag → MechanicRegistry: aero_lift / vortex_drag

---

### [Case 1807 — Earth Eagle 145WD — Shining Tornado Buster](./15%20case%20study.md#case-1807)

**System**: MFB / Metal Masters  
**Blader**: Tsubasa Otori  
**Special Move**: Shining Tornado Buster — aerial liftoff + tornado crash: J_contact = 0.07276 N·s + J_aero = 0.02460 N·s → J_total = 0.09736 N·s → Δv_target = 1.947 m/s; tornado vortex pierces 50% defense buff. Requires ω > 545.8 rad/s for liftoff. [M] ×7.0 → Δv = 13.6 m/s (Dark Eagle form; all defense buffs pierced). powerCost 100.  
**Compatible beys**: Earth Eagle 145WD; Galaxy Pegasus W105R2F (same RF/R2F orbital drive)

---

### [Case 1808 — Earth Eagle 145WD — Eagle Drive](./15%20case%20study.md#case-1808)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Eagle Drive. Sequence: jump → moveUp → attack (J ↑ A). Cost: 15. Type: stamina. J: aerodynamic liftoff; ↑: updraft ascent; A: descending strike. dmgMult 1.30×; lockMs 80. dmgMult 1.30× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Earth wheel aero lift + vortex (Case 1806)

---

### [Case 1809 — Samurai Ifrit W145CF — Wing-Assisted Bowl Exit & Sky Drop System](./15%20case%20study.md#case-1809)

**System**: MFB / Zero-G (Shogun Steel)  
**Geometry**: Ifrit Warrior Wheel: r = 3.8 cm, 29.0 g; W145 track: 3 wings at r = 1.2 cm; CF tip: r = 0.2 cm; I_total = 2.275×10⁻⁵ kg·m²; m_total = 35.8 g; ω₀ = 680 rad/s; Zero-G bowl φ = 60°  
**Mechanism**: W145 wing lift F = 7.843×10⁻³ N (+0.047 m/s vertical boost over climb). Bowl exit v_z = 1.779 m/s → h_peak = 16.1 cm. Sky drop impact: v_total = 2.039 m/s at θ = 60.6° below horizontal (targets Face Bolt).  
**Gimmick**: Bowl-exit sky drop + center-face strike geometry → MechanicRegistry: sky_drop / face_bolt_strike

---

### [Case 1810 — Samurai Ifrit W145CF — Shooting Star Crush](./15%20case%20study.md#case-1810)

**System**: MFB / Zero-G  
**Blader**: Zyro Kurogane  
**Special Move**: Shooting Star Crush — sky drop aerial attack: h_peak = 16.1 cm; v_impact = 2.039 m/s (θ = 60.6°); J = 0.06592 N·s → |Δv| = 1.320 m/s (Δv_vertical = 1.150 m/s targeting Face Bolt + floor compression Δω_floor = 3.1 rad/s). [M] ×7.0 → Δv = 9.2 m/s (ring-out + face-bolt burst). powerCost 100.  
**Compatible beys**: Any Zero-G / Shogun Steel bey with W145 Spin Track; standard: Samurai Ifrit W145CF

---

### [Case 1811 — Samurai Ifrit W145CF — Meteor Drop](./15%20case%20study.md#case-1811)

**System**: MFB / Zero-G  
**Mechanism**: COMBO — Meteor Drop. Sequence: moveUp → jump → moveDown (↑ J ↓). Cost: 15. Type: balanced. 40% partial sky drop: h_partial = 6.44 cm; v_impact = 1.380 m/s; dmgMult 1.30×; lockMs 100. dmgMult 1.30× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Bowl-exit sky drop kinematics (Case 1809)

---

### [Case 1812 — Storm Pegasus 105RF — RF Tip Orbital Drive & Storm Wheel Vortex](./15%20case%20study.md#case-1812)

**System**: MFB / Metal Fusion  
**Geometry**: Storm FW: r = 2.8 cm, 28.0 g; RF tip: r = 0.35 cm, μ = 0.55; I_total = 2.384×10⁻⁵ kg·m²; m_total = 33.6 g; ω₀ = 650 rad/s  
**Mechanism**: RF slip ratio 0.65 → v_orbital = 1.479 m/s; τ_RF = 6.34×10⁻⁴ N·m; t_spin = 24.5 s. Rankine vortex Γ = 0.7433 m²/s → F_aero = 0.01722 N on central opponent (v_s = 4.730 m/s at r_s = 2.5 cm).  
**Gimmick**: RF orbital drive + Rankine vortex aerodynamic drag → MechanicRegistry: rf_orbital / vortex_aero

---

### [Case 1813 — Storm Pegasus 105RF — Storm Bringer](./15%20case%20study.md#case-1813)

**System**: MFB / Metal Fusion  
**Blader**: Gingka Hagane  
**Special Move**: Storm Bringer — vortex destabilize + orbital dive: F_aero = 0.01722 N tangential (3 laps); J_contact = 0.04832 N·s → Δv_opp = 1.150 m/s; Δω_Pegasus = 44.6 rad/s (93.1% retained). [M] ×6.0 → Δv = 6.9 m/s (ring-out). powerCost 100.  
**Compatible beys**: Storm Pegasus 105RF; Galaxy Pegasus W105R2F (same RF/R2F orbital drive)

---

### [Case 1814 — Storm Pegasus 105RF — Storm Spiral](./15%20case%20study.md#case-1814)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Storm Spiral. Sequence: moveLeft → moveUp → attack (← ↑ A). Cost: 15. Type: attack. RF re-engagement reconverts orbital momentum: +35 rad/s spin. Elevated approach angle +11.5° → dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: RF orbital + vortex (Case 1812)

---

### [Case 1815 — Rock Zurafa R145WB — Rubber Wing Absorption & WB Tip Stability](./15%20case%20study.md#case-1815)

**System**: MFB / Metal Masters  
**Geometry**: Rock FW: r = 3.0 cm, 33.0 g; Zurafa ER rubber protrusions at r = 2.4 cm; R145 rubber balls; WB tip: r = 0.8 cm, μ_WB = 0.18; I_total = 3.209×10⁻⁵ kg·m²; m_total = 40.0 g; ω₀ = 650 rad/s  
**Mechanism**: Rubber wing e_rubber = 0.40 (vs. e_metal ≈ 0.75): J_absorb = 0.05737 N·s → Δv_att = 1.366 m/s (68% absorbed); Δω_Zurafa = 42.9 rad/s. ΔKE_absorbed = 0.01652 J. t_spin (WB) = 36.9 s.  
**Gimmick**: Rubber wing kinetic absorption + elastic counter → MechanicRegistry: rubber_absorb / elastic_counter

---

### [Case 1816 — Rock Zurafa R145WB — Storm Surge](./15%20case%20study.md#case-1816)

**System**: MFB / Metal Masters  
**Blader**: Dashan Wang  
**Special Move**: Storm Surge — rubber absorption + Beast elastic counter: Phase 1 absorbs Δv_att = 1.366 m/s; Phase 2 spring-back counter J = 0.05737 N·s → Δv_counter = 1.366 m/s (net reversal from v_in = 2.0 m/s to v_out = 0.502 m/s). [M] ×5.0 → Δv_counter = 6.8 m/s (ring-out). powerCost 100.  
**Compatible beys**: Rock Zurafa R145WB; any bey with rubber/soft ER protrusions (e < 0.55 at outer zone)

---

### [Case 1817 — Rock Zurafa R145WB — Surge Counter](./15%20case%20study.md#case-1817)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Surge Counter. Sequence: moveDown → defense → attack (↓ K A). Cost: 15. Type: balanced. Rubber elastic recovery η = 0.583: +25 rad/s spin; spring-back counter dmgMult 1.25×; lockMs 200. dmgMult 1.25× ≤ 1.5 ✓; lockMs 200 ≤ 300 ✓.  
**Gimmick**: Parent: Rubber wing absorption (Case 1815)

---

### [Case 1818 — Earth Eagle 145WD — Wing-Edge Contact Shockwave](./15%20case%20study.md#case-1818)

**System**: MFB / Metal Fusion + Metal Fury  
**Geometry**: Earth FW blade tip: A_contact = 3.0×10⁻⁶ m²; r_blade = 2.9 cm; v_wing_tip = 20.3 m/s; F_blade = 132.9 N per quadrant; P_blade = 44.3 MPa (0.739× PC yield — stress wave, no fracture); WD tip r = 0.55 cm; v_orbital_WD = 1.20 m/s; t_spin = 68.8 s  
**Mechanism**: Stress wave Δω_shockwave = 23.1 rad/s (supplemental spin drain); ΔKE = 6.645×10⁻³ J propagated as vibration through opponent layer.  
**Gimmick**: Wing-edge stress wave shockwave + WD aerial orbital → MechanicRegistry: blade_shockwave / wbd_aerial

---

### [Case 1819 — Earth Eagle 145WD — Stream Slash](./15%20case%20study.md#case-1819)

**System**: MFB / Metal Fusion + Metal Fury  
**Blader**: Tsubasa Otori  
**Special Move**: Stream Slash — aerial wing-edge slash: h_liftoff = 3.0 cm; v_impact = 1.424 m/s; J_slash = 0.05070 N·s → Δv_opp = 1.207 m/s + Δω_shockwave = 23 rad/s spin drain. Eagle retains 94.6% spin (Δω = 37.5 rad/s). [M] ×6.0 → Δv = 7.2 m/s (ring-out). powerCost 100.  
**Compatible beys**: Earth Eagle 145WD; any MFB bey with metal wing-edge FW (P ≥ 40 MPa at ω₀)

---

### [Case 1820 — Earth Eagle 145WD — Wing Rise](./15%20case%20study.md#case-1820)

**System**: MFB / Metal Fusion + Metal Fury  
**Mechanism**: COMBO — Wing Rise. Sequence: moveRight → attack → moveUp (→ A ↑). Cost: 15. Type: attack. WD bearing re-engagement: +20 rad/s spin. Elevated aerial approach 1.25× dmgMult; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Wing-edge shockwave + WD orbital (Case 1818)

---

### [Case 1821 — Falborg 2 — AR Blade Tip Contact Pressure & Pierce Condition](./15%20case%20study.md#case-1821)

**System**: Plastic Gen / G-Revolution  
**Geometry**: Falborg 2 AR claw-blades: A_tip = 7.5×10⁻⁷ m² (0.5 × 1.5 mm); r_AR = 3.3 cm; v_tip = 23.1 m/s; 10-Wide WD: r = 3.4 cm, 15.0 g; I_total = 3.302×10⁻⁵ kg·m²; m_total = 36.5 g; ω₀ = 700 rad/s  
**Mechanism**: F_centripetal = 226.4 N; P_contact = 301.8 MPa (5.03× ABS yield → layer pierce condition). Orbital J_pierce = 0.03984 N·s → Δv_opp = 0.948 m/s + Δω_drain = 52.6 rad/s.  
**Gimmick**: Blade-tip pierce condition + centripetal pressure concentration → MechanicRegistry: blade_pierce / cp_pressure

---

### [Case 1822 — Falborg 2 — Stroblitz Attack](./15%20case%20study.md#case-1822)

**System**: Plastic Gen / G-Revolution  
**Blader**: Bryan Kuznetsov  
**Special Move**: Stroblitz Attack — white-beam blade-tip pierce: P_contact = 301.8 MPa (5.03× yield); J_pierce = 0.03984 N·s → Δv_opp = 0.948 m/s + Δω_drain = 52.6 rad/s; 40% defense bypass. [M] ×8.0 → Δv = 7.6 m/s (ring-out/shattering). powerCost 100.  
**Compatible beys**: Falborg 2 (AR blade tip A ≤ 1 mm², ω₀ ≥ 700 rad/s required for pierce condition)

---

### [Case 1823 — Falborg 2 — Blitz Pierce](./15%20case%20study.md#case-1823)

**System**: Plastic Gen / G-Revolution  
**Mechanism**: COMBO — Blitz Pierce. Sequence: jump → attack → moveDown (J A ↓). Cost: 15. Type: attack. Blade snap-back reconversion: +30 rad/s spin. Elevated dive angle +15° → dmgMult 1.35×; lockMs 0. dmgMult 1.35× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: AR blade-tip pierce condition (Case 1821)

---

### [Case 1824 — Cosmic Pegasus F:D — F:D Dual-Mode Tip & Atmospheric Trajectory](./15%20case%20study.md#case-1824)

**System**: MFB / Metal Fury  
**Geometry**: Cosmic FW: r = 2.9 cm, 32.0 g; F:D tip: r_inner = 0.15 cm (high-spin), r_outer = 1.0 cm (low-spin, μ = 0.55); ω_transition = 300 rad/s; I_total = 2.904×10⁻⁵ kg·m²; m_total = 42.5 g; ω₀ = 680 rad/s  
**Mechanism**: v_orbital_charge (BeySpirit full) = 5.440 m/s; bowl exit Δh = 7.0 cm; v_impact = 5.564 m/s. t_spin constrained by outer ring τ.  
**Gimmick**: F:D dual-mode drive + atmospheric bowl-exit dive → MechanicRegistry: fd_dual_mode / atmo_dive

---

### [Case 1825 — Cosmic Pegasus F:D — Super Cosmic Nova](./15%20case%20study.md#case-1825)

**System**: MFB / Metal Fury  
**Blader**: Gingka Hagane  
**Special Move**: Super Cosmic Nova — atmospheric charged dive: v_orbital_charge = 5.440 m/s; v_impact = 5.564 m/s; J_nova = 0.2251 N·s → Δv_opp = 5.002 m/s (ring-out physically). Δω_Pegasus = 185.9 rad/s (72.7% retained). [M] ×10.0 → Δv = 50.0 m/s (combined world BeySpirit). powerCost 100.  
**Compatible beys**: Cosmic Pegasus F:D (F:D tip + Cosmic FW required); active only when world BeySpirit channels

---

### [Case 1826 — Cosmic Pegasus F:D — Cosmic Drive](./15%20case%20study.md#case-1826)

**System**: MFB / Metal Fury  
**Mechanism**: COMBO — Cosmic Drive. Sequence: moveUp → moveDown → attack (↑ ↓ A). Cost: 25. Type: attack. F:D tip-mode transition (outer→inner): +23 rad/s spin. Bowl-wall approach angle +10.3° → dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: F:D dual-mode + atmospheric trajectory (Case 1824)

---

### [Case 1827 — Super Hyperion Xceed 1A — X-Line Rail Acceleration & Xceed Driver](./15%20case%20study.md#case-1827)

**System**: Beyblade X  
**Geometry**: Super Hyperion Blade: r = 3.0 cm, 14.6 g; 1-60 Ratchet: r = 2.2 cm, 18.0 g; Xceed Bit: r = 0.4 cm, μ = 0.55; I_total = 2.190×10⁻⁵ kg·m²; m_total = 35.6 g; ω₀ = 750 rad/s  
**Mechanism**: X-Line rail: 2 passes → v_attack = 2.000 m/s (from v₀ = 1.0 m/s). τ_Xceed = 7.685×10⁻⁴ N·m; t_spin = 21.4 s. Each rail pass Δω_drain ≈ 20 rad/s.  
**Gimmick**: X-Line centripetal acceleration + Xceed spin-to-speed conversion → MechanicRegistry: x_rail_accel / xceed_drive

---

### [Case 1828 — Super Hyperion Xceed 1A — Super Strike](./15%20case%20study.md#case-1828)

**System**: Beyblade X  
**Blader**: Hyuga Hizashi  
**Special Move**: Super Strike — 2 X-Line rail passes → v_attack = 2.000 m/s; J_strike = 0.06782 N·s → Δv_opp = 1.696 m/s; Δω_Hyperion = 68.1 rad/s (90.9% retained). [M] ×6.0 → Δv = 10.2 m/s (ring-out). powerCost 100.  
**Compatible beys**: Super Hyperion Xceed 1A (Xceed Bit + X-Line BX Arena required); any BX blade with Xceed-type Bit

---

### [Case 1829 — Super Hyperion Xceed 1A — X-Rail Rush](./15%20case%20study.md#case-1829)

**System**: Beyblade X  
**Mechanism**: COMBO — X-Rail Rush. Sequence: moveRight → moveRight → moveUp (→ → ↑). Cost: 15. Type: attack. Partial rail pass +0.5 m/s → +13 rad/s spin reconversion. Elevated ramp exit angle +8° → dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: X-Line rail + Xceed drive (Case 1827)

---

### [Case 1830 — Tempest Wyvron 4Glaive Atomic — Atomic Tip Wall-Bounce Drive](./15%20case%20study.md#case-1830)

**System**: Burst / GT (God Layer)  
**Geometry**: Atomic Bit: r = 0.4 cm, μ_bearing = 0.04; Glaive frame: r = 3.2 cm; I_total = 1.531×10⁻⁵ kg·m²; m_total = 40.05 g; ω₀ = 650 rad/s  
**Mechanism**: τ_Atomic = 6.290×10⁻⁵ N·m; t_spin = 158.2 s (≈6.4× standard). v_wall = 2.496 m/s; e_wall = 0.78 → v_post_bounce = 1.947 m/s (inward attack).  
**Gimmick**: Bearing wall-ride + elastic wall-bounce redirect → MechanicRegistry: bearing_wall_ride / wall_bounce

---

### [Case 1831 — Tempest Wyvron 4Glaive Atomic — Super Tempest Attack](./15%20case%20study.md#case-1831)

**System**: Burst / GT  
**Blader**: Wakiya Murasaki  
**Special Move**: Super Tempest Attack — Atomic wall-ride + elastic bounce attack: v_wall = 2.496 m/s → v_bounce = 1.947 m/s; J_tempest = 0.06816 N·s → Δv_opp = 1.704 m/s; Δω_Wyvron = 106.8 rad/s (83.6% retained). [M] ×5.5 → Δv = 9.4 m/s (ring-out). powerCost 100.  
**Compatible beys**: Tempest Wyvron 4Glaive Atomic (Atomic tip + BX/Burst Beystadium wall required); any bey with bearing-tip wall-ride capability

---

### [Case 1832 — Tempest Wyvron 4Glaive Atomic — Glaive Bounce](./15%20case%20study.md#case-1832)

**System**: Burst / GT  
**Mechanism**: COMBO — Glaive Bounce. Sequence: moveRight → defense → moveUp (→ K ↑). Cost: 15. Type: balanced. Atomic wall-press elastic recovery: +9 rad/s spin; elevated bounce exit dmgMult 1.20×; lockMs 150 (wall dwell). dmgMult 1.20× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Atomic bearing wall-bounce (Case 1830)

---

### [Case 1833 — Heat Salamander 12 Operate — Operate Tip Defense Mode & Ten-Blade Vortex](./15%20case%20study.md#case-1833)

**System**: MFB / Metal Fury  
**Geometry**: Heat/Hell FW: r = 3.0 cm, 34.0 g; Track 12: r = 1.2 cm; Operate tip: r_def = 0.3 cm (bearing), r_atk = 1.0 cm (flat); I_total = 3.370×10⁻⁵ kg·m²; m_total = 44.0 g; ω₀ = 650 rad/s  
**Mechanism**: Defense mode τ_OP_def = 1.037×10⁻⁴ N·m → t_spin = 211.3 s; Ω_prec = 0.295 rad/s. Track 12 vortex Γ = 0.5881 m²/s; F_updraft = 7.742×10⁻² N (keeps bey centered).  
**Gimmick**: Operate dual-mode tip + Track 12 centrifugal updraft vortex → MechanicRegistry: dual_mode_tip / centrifugal_vortex

---

### [Case 1834 — Heat Salamander 12 Operate — Swirling Inferno](./15%20case%20study.md#case-1834)

**System**: MFB / Metal Fury  
**Blader**: Suoh Genji  
**Special Move**: Swirling Inferno — ten-blade tornado + dual buff + strike: F_updraft = 0.07742 N; F_tornado_opp = 4.220×10⁻³ N; J_inferno = 0.02837 N·s → Δv_opp = 0.675 m/s; self-buff dmgMult += 0.20, dmgReduction −0.10 for 2.0 s; Δω = 18.5 rad/s (97.2% retained). [M] ×5.0 → Δv = 3.4 m/s + sustained dual buff. powerCost 100.  
**Compatible beys**: Heat Salamander 12 Operate; any MFB bey with Operate tip + Track 12 (or ≥10 mm track)

---

### [Case 1835 — Heat Salamander 12 Operate — Inferno Shell](./15%20case%20study.md#case-1835)

**System**: MFB / Metal Fury  
**Mechanism**: COMBO — Inferno Shell. Sequence: defense → moveDown → defense (K ↓ K). Cost: 15. Type: defense. Dual Operate tip retraction pulse: +7 rad/s spin (2 × 3.66 rad/s); hardened shell counter dmgMult 1.15×; lockMs 200 (defense dwell). dmgMult 1.15× ≤ 1.5 ✓; lockMs 200 ≤ 300 ✓.  
**Gimmick**: Parent: Operate dual-mode + vortex (Case 1833)

---

### [Case 1836 — Variares D:D — D:D Dual-Spin Tip & Left-Spin Mode](./15%20case%20study.md#case-1836)

**System**: MFB / Metal Fury  
**Geometry**: Variares FW: r = 3.1 cm, 36.0 g; D:D track: r = 0.8 cm, dual bearing shells; I_total = 3.715×10⁻⁵ kg·m²; m_total = 44.5 g; ω₀ = 650 rad/s (RS or LS)  
**Mechanism**: Right-spin contact edge v = 15.6 m/s; Left-spin Sword of Ares: v_blade = 20.15 m/s; F_centripetal = 471.5 N; P_blade = 471.5 MPa (7.86× ABS yield → deep pierce). Counter-rotation v_rel = 31.25 m/s (vs. RS opponent at 600 rad/s). D:D bearing absorbs 80% recoil. τ_DD = 6.995×10⁻⁵ N·m; t_spin = 345.2 s.  
**Gimmick**: D:D free-spin counter-rotation + deep blade pierce → MechanicRegistry: counter_spin_pierce / dd_bearing

---

### [Case 1837 — Variares D:D — Sword of Ares](./15%20case%20study.md#case-1837)

**System**: MFB / Metal Fury  
**Blader**: King  
**Special Move**: Sword of Ares — left-spin counter-rotation blade pierce: v_rel = 31.25 m/s; J_sword = 0.1205 N·s → Δv_opp = 2.869 m/s; 50% defense bypass. D:D bearing absorbs 80% recoil → Δω = 16.2 rad/s (97.5% retained). [M] ×7.0 → Δv = 20.1 m/s (divine god-of-war force; shatter opponent special). powerCost 100.  
**Compatible beys**: Variares D:D (D:D bearing + left-spin mode required); any bey with D:D track and LS capability

---

### [Case 1838 — Variares D:D — Ares Counter](./15%20case%20study.md#case-1838)

**System**: MFB / Metal Fury  
**Mechanism**: COMBO — Ares Counter. Sequence: attack → defense → moveRight (A K →). Cost: 25. Type: balanced. A: blade contact → recoil; K: D:D bearing stores 80% recoil (J_stored = 0.01780 N·s); →: bearing re-couples → +12 rad/s spin + 1.30× lateral counter-strike. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: D:D dual-spin + bearing (Case 1836)

---

### [Case 1839 — Storm Capricorn M145Q — Q Tip Aerial Bounce & M145 Gyro Platform](./15%20case%20study.md#case-1839)

**System**: MFB / Metal Fusion  
**Geometry**: Storm FW: r = 2.8 cm, 28.0 g; Capricorn ER; Q tip: r = 0.35 cm (convex dome); M145: h = 14.5 mm; I_total = 2.421×10⁻⁵ kg·m²; m_total = 35.5 g; ω₀ = 650 rad/s  
**Mechanism**: Q bounce: F_N = 52.5 N; J_vertical = 0.158 N·s → v_vertical = 4.44 m/s → h_apex = 1.005 m (≈1 m). M145 magnetic stabilization suppresses nutation at apex. v_horn_tip = 14.95 m/s. τ_Q = 4.268×10⁻⁴ N·m; t_spin = 36.9 s.  
**Gimmick**: Q tip quake aerial launch + M145 gyro platform stabilization → MechanicRegistry: quake_bounce / gyro_platform

---

### [Case 1840 — Storm Capricorn M145Q — Spin Screwdriver](./15%20case%20study.md#case-1840)

**System**: MFB / Metal Fusion  
**Blader**: Tobio Oike  
**Special Move**: Spin Screwdriver — Q tip aerial launch (h_apex = 1.005 m) + screwdriver dive: v_impact = 6.279 m/s; J_screw = 0.2061 N·s → Δv_opp = 5.153 m/s (ring-out physically achieved); Δω_Capricorn = 187.2 rad/s (71.2% retained). [M] ×5.0 → Δv = 25.8 m/s (theoretical — never achieved in-series). powerCost 100.  
**Compatible beys**: Storm Capricorn M145Q (Q tip + M145 required for aerial guidance); any bey with Q tip and track h ≥ 130

---

### [Case 1841 — Storm Capricorn M145Q — Horn Whip](./15%20case%20study.md#case-1841)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Horn Whip. Sequence: jump → moveUp → defense (J ↑ K). Cost: 15. Type: attack. Partial Q bounce (Δh = 15 cm, 15% of full): arc-to-spin reconversion η = 0.75 → +16 rad/s; horn-whip apex strike dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Q tip aerial bounce + M145 platform (Case 1839)

---

### [Case 1842 — Bandit Genbu F230TB — F230 Under-Attack Platform & TB Tip Dual Drive](./15%20case%20study.md#case-1842)

**System**: MFB / Metal Fury  
**Geometry**: Bandit FW: r = 2.9 cm, 26.0 g; F230 track: h = 23.0 mm; TB tip: r = 0.4 cm (ball μ = 0.25 / cylinder μ = 0.55); I_total = 2.590×10⁻⁵ kg·m²; m_total = 39.0 g; ω₀ = 650 rad/s  
**Mechanism**: F230 height differential Δh = 13.0 mm vs. std opponent → θ_down = 28.4°; F_down fraction = 0.476 (presses opponent into floor). TB cylinder v_orbital = 1.430 m/s. t_spin (ball) = 43.9 s.  
**Gimmick**: F230 tall-track under-attack downward geometry + TB dual-mode drive → MechanicRegistry: under_attack / tall_track

---

### [Case 1843 — Bandit Genbu F230TB — Spinning Shell Smash](./15%20case%20study.md#case-1843)

**System**: MFB / Metal Fury  
**Blader**: Genjuro Kamegaki  
**Special Move**: Spinning Shell Smash — TB cylinder drive + Genbu beast smoke-burst leap (Δh = 4.0 cm): v_impact = 1.682 m/s; J_smash = 0.05645 N·s → Δv_opp_horiz = 1.241 m/s (outward) + Δv_opp_down = 0.672 m/s (floor press). [M] ×6.5 → Δv = 8.1 m/s (rocket ring-out). powerCost 100.  
**Compatible beys**: Bandit Genbu F230TB (F230 + TB required); any MFB bey with F230 track vs. short-track opponent

---

### [Case 1844 — Bandit Genbu F230TB — Shell Slam](./15%20case%20study.md#case-1844)

**System**: MFB / Metal Fury  
**Mechanism**: COMBO — Shell Slam. Sequence: moveDown → attack → defense (↓ A K). Cost: 15. Type: attack. Bowl-bottom F230 height advantage maximized; TB rebound retraction: +9 rad/s spin; downward strike θ = 28.4° dmgMult 1.20×; lockMs 100 (opponent floor-pressed). dmgMult 1.20× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: F230 under-attack + TB dual mode (Case 1842)

---

### [Case 1845 — Twisted Tempo 145WD — Twisted ER Centrifugal Air Barrier & WD Gyroscopic Stamina](./15%20case%20study.md#case-1845)

**System**: MFB / Metal Masters  
**Geometry**: Tempo FW: r = 3.1 cm, 34.0 g; Twisted ER: r = 2.5 cm (Roman numeral clock face); WD tip: r = 0.6 cm, μ = 0.15; I_total = 3.523×10⁻⁵ kg·m²; m_total = 40.7 g; ω₀ = 650 rad/s  
**Mechanism**: Air barrier: v_rim = 16.25 m/s; q_rim = 161.8 Pa. Suction zone: F_suction = 0.2034 N inward → opponent drawn from r = 8.0 cm to contact; v_approach = 0.880 m/s. t_spin (WD) = 63.8 s; Ω_prec = 0.261 rad/s.  
**Gimmick**: Centrifugal air barrier + suction black hole → MechanicRegistry: air_barrier / suction_field

---

### [Case 1846 — Twisted Tempo 145WD — Spiral Dimension](./15%20case%20study.md#case-1846)

**System**: MFB / Metal Masters  
**Blader**: Faust  
**Special Move**: Spiral Dimension — centrifugal suction + dimensional collapse: F_suction = 0.2034 N; v_approach = 0.880 m/s; J_spiral = 0.03274 N·s → Δv_opp = 0.779 m/s; Twisted Tempo Δω = 20.4 rad/s (96.9% retained). [M] ×7.0 → Δv = 5.5 m/s (all opponents ejected). powerCost 100.  
**Compatible beys**: Twisted Tempo 145WD (Twisted ER r ≥ 2.2 cm + heavy Tempo wheel required); defense archetype with wide annular ER

---

### [Case 1847 — Twisted Tempo 145WD — Vortex Guard](./15%20case%20study.md#case-1847)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Vortex Guard. Sequence: moveLeft → defense → moveLeft (← K ←). Cost: 15. Type: defense. Suction reaction transfer: +7 rad/s spin; vortex-assisted lateral deflection dmgMult 1.15×; lockMs 200 (suction dwell). dmgMult 1.15× ≤ 1.5 ✓; lockMs 200 ≤ 300 ✓.  
**Gimmick**: Parent: Centrifugal air barrier + suction (Case 1845)

---

### [Case 1848 — Dranzer MS — Dranzer S Wing Aerodynamics & MS Tip Stamina](./15%20case%20study.md#case-1848)

**System**: Plastic Gen / G-Revolution  
**Geometry**: Dranzer S AR: 4 swept phoenix wings, r = 3.3 cm, 14.0 g; 10-Wide WD: r = 3.5 cm, 18.0 g; MS tip: r = 0.3 cm, μ = 0.08 (metal); I_total = 3.748×10⁻⁵ kg·m²; m_total = 37.5 g; ω₀ = 710 rad/s  
**Mechanism**: Wing F_lift = 0.02906 N (7.9% of weight W = 0.368 N — BeySpirit required for full liftoff). τ_MS = 8.831×10⁻⁵ N·m; t_spin = 301.3 s. Self-burst risk: τ_self = 0.908 N·m (2.27× burst threshold — phoenix burns own life force).  
**Gimmick**: Wing-assisted aerial liftoff + MS maximum stamina + self-damage burst risk → MechanicRegistry: wing_liftoff / self_damage

---

### [Case 1849 — Dranzer MS — Spiral Fireball](./15%20case%20study.md#case-1849)

**System**: Plastic Gen / G-Revolution  
**Blader**: Kai Hiwatari  
**Special Move**: Spiral Fireball — mutual-sacrifice phoenix dive: h = 8.0 cm; v_impact = 2.360 m/s; J_fireball = 0.08238 N·s → Δv_opp = 2.168 m/s; self-damage Δω = 54.9 rad/s + τ_self = 0.908 N·m (2.27× burst threshold). [M] ×9.0 → Δv_opp = 19.5 m/s; Δω_self = 494 rad/s (near-total spin loss — phoenix self-destruction). powerCost 100.  
**Compatible beys**: Dranzer MS (Dranzer S wings + MS tip required); self-damage mechanic applies to any mutual-impulse dive bey

---

*(Cases 1851–1854: confirmed gap — CS9 HMS session conflict, not in source file)*

---

### [Case 1850 — Dranzer MS — Phoenix Dive](./15%20case%20study.md#case-1850)

**System**: Plastic Gen / G-Revolution  
**Mechanism**: COMBO — Phoenix Dive. Sequence: jump → moveRight → attack (J → A). Cost: 15. Type: attack. Partial wing-lift Δh = 2.0 cm: +24 rad/s spin (η = 0.45); angled descent θ = 20.2° dmgMult 1.35×; lockMs 0. dmgMult 1.35× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Dranzer S wing aerodynamics + MS stamina (Case 1848)

---

### [Case 1855 — Galeon 2 — Blade Sweep Plasma Vortex & SFC Tip Orbital Drive](./15%20case%20study.md#case-1855)

**System**: Plastic Gen / G-Revolution  
**Geometry**: Galeon 2 AR: 6 lion-thunder blades, r = 3.2 cm; 10-Wide WD: r = 3.5 cm; SFC tip: r = 0.4 cm, μ = 0.30; I_total = 3.780×10⁻⁵ kg·m²; m_total = 39.0 g; ω₀ = 710 rad/s  
**Mechanism**: v_tip = 22.72 m/s; q_tip = 316.7 Pa; f_blade = 677.8 Hz. Accumulated blade sweep over 2.0 s: J_radial_eff = 3.400×10⁻³ N·s → opponent displaced 89.5 mm outward (near wall). τ_SFC = 4.590×10⁻⁴ N·m; t_spin = 58.5 s; v_orbital = 1.50 m/s (peak).  
**Gimmick**: 6-blade sweep plasma wake disorient + SFC orbital → MechanicRegistry: blade_sweep / plasma_disorient

---

### [Case 1856 — Galeon 2 — Spiral Lightning](./15%20case%20study.md#case-1856)

**System**: Plastic Gen / G-Revolution  
**Blader**: Lee  
**Special Move**: Spiral Lightning — 2 s blade-sweep disorient + orbital crash: opponent displaced 89.5 mm; J_crash = 0.05198 N·s → Δv_opp = 1.368 m/s (ring-out — opponent at wall). Δω_G2 = 34.4 rad/s (95.2% retained). [M] ×6.0 → Δv = 8.2 m/s. powerCost 100.  
**Compatible beys**: Galeon 2 (6+ blade AR at v_tip ≥ 20 m/s + SFC tip required); any G-Rev plastic bey with high-blade AR

---

### [Case 1857 — Galeon 2 — Thunder Arc](./15%20case%20study.md#case-1857)

**System**: Plastic Gen / G-Revolution  
**Mechanism**: COMBO — Thunder Arc. Sequence: moveRight → dodge → attack (→ E A). Cost: 15. Type: attack. Partial blade sweep (81 passes, 0.12 s) + arc flash spin reconversion η = 0.60: +23 rad/s spin; arc-amplified strike dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Blade sweep plasma vortex + SFC (Case 1855)

---

### [Case 1858 — Ace Dragon Sting Charge Zan — Sting Disc Spring-Wall Ricochet & Zephyr Tip Orbital Drive](./15%20case%20study.md#case-1858)

**System**: Burst / Rise  
**Geometry**: Ace Dragon layer: r = 2.7 cm, 21.0 g; Sting disc: r = 2.2 cm, spring k = 75 N/m, x_max = 4 mm, PE = 6.00×10⁻⁴ J; Zephyr driver: r_sharp = 0.5 cm / r_flat = 0.5 cm; I_total = 1.900×10⁻⁵ kg·m²; m_total = 31.0 g; ω₀ = 630 rad/s  
**Mechanism**: Wall bounce: v_wall = 1.800 m/s; spring adds Δv = 0.394 m/s (×2 protrusions) → v_post = 1.690 m/s; KE_gain = 0.01822 J. Zephyr v_orbital_flat = 1.103 m/s; t_spin = 78.7 s.  
**Gimmick**: Spring-loaded wall ricochet KE boost + Zephyr variable-friction drive → MechanicRegistry: spring_ricochet / variable_friction

---

### [Case 1859 — Ace Dragon Sting Charge Zan — Spring Cannon / Bound Stinger](./15%20case%20study.md#case-1859)

**System**: Burst / Rise  
**Blader**: Dante Koryu  
**Special Move**: Spring Cannon (JP: Bound Stinger) — wall-ricochet spring boost attack: v_post = 1.690 m/s; J_cannon = 0.04653 N·s → Δv_opp = 1.454 m/s; parry variant: J_parry = 0.07959 N·s (at v_rel = 2.890 m/s). Δω_AD = 49.0 rad/s (92.2% retained). [M] ×5.5 → Δv = 8.0 m/s (dragon spring-cannon blast). powerCost 100.  
**Compatible beys**: Ace Dragon Sting Charge Zan; Glyph Dragon Sting Charge Zan; Rock Dragon Sting Charge Zan

---

### [Case 1860 — Ace Dragon Sting Charge Zan — Sting Rush](./15%20case%20study.md#case-1860)

**System**: Burst / Rise  
**Mechanism**: COMBO — Sting Rush. Sequence: moveRight → defense → attack (→ K A). Cost: 15. Type: attack. Sting spring-load at wall (75% compression PE = 3.375×10⁻⁴ J): Δv_spring = 0.209 m/s; v_attack = 1.312 m/s; Zephyr flat-contact reconversion η = 0.55: +24 rad/s spin; spring-boosted dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Sting disc spring ricochet (Case 1858)

---

### [Case 1861 — Galaxy Pegasus W105R2F — W105 Wing Aerodynamic Lift Platform & R2F Orbital Burst Drive](./15%20case%20study.md#case-1861)

**System**: MFB / Metal Masters (BB-70)  
**Geometry**: Galaxy FW: r = 3.0 cm, 30.0 g; Pegasus II ER: r = 2.4 cm, 4.0 g; W105 track: r = 2.0 cm, 2.5 g (wing blades A_wing = 7.5×10⁻⁵ m², C_L = 0.55); R2F tip: r = 0.6 cm, μ = 0.80; I_total = 3.034×10⁻⁵ kg·m²; m_total = 38.5 g; ω₀ = 680 rad/s  
**Mechanism**: W105 wings: v_wing = 13.60 m/s; F_lift_total = 1.049×10⁻² N (2 wings, 2.8% of weight); F_thrust = 3.588×10⁻³ N tangential. R2F: τ = 1.817×10⁻³ N·m; t_spin = 11.4 s; v_orbital = 3.264 m/s (highest of all Pegasus variants). R2F aggressive orbital drive — fastest attack-mode tip in MFB Metal Masters.  
**Gimmick**: W105 wing aerodynamic lift platform + R2F rubber orbital burst drive → MechanicRegistry: wing_liftoff / rubber_orbital

---

### [Case 1862 — Galaxy Pegasus W105R2F — Starbooster Attack](./15%20case%20study.md#case-1862)

**System**: MFB / Metal Masters  
**Blader**: Gingka Hagane  
**Special Move**: Starbooster Attack (JP: Stargazer) — 2-circle orbital liftoff dive: v_orbital = 3.264 m/s; wing impulse v_z_wing = 0.210 m/s; η_liftoff = 0.35; v_z_total = 1.352 m/s; h_apex = 9.32 cm; v_impact = 3.533 m/s; J_booster = 1.248×10⁻¹ N·s → Δv_opp = 3.120 m/s. Δω_GP = 102.8 rad/s (84.9% retained). [M] ×8.0 → Δv = 24.96 m/s (star velocity). powerCost 100. Galaxy vs Storm Pegasus: v_orbital 3.264 vs 2.040 m/s (Galaxy 60% faster).  
**Compatible beys**: W105 Spin Track + R2F driver (v_orbital ≥ 3 m/s for wing-lift stadiumcircle liftoff); standard: Galaxy Pegasus W105R2F (Gingka Hagane, Metal Masters)

---

### [Case 1863 — Galaxy Pegasus W105R2F — Orbit Crash](./15%20case%20study.md#case-1863)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Orbit Crash. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 15. Type: attack. ↑ high orbital arc at v = 2.2 m/s; → redirect to approach vector; A orbital strike: Δω = +35 rad/s (R2F rubber arc redirect η = 0.50); dmgMult 1.35× (combined arc approach); lockMs 0. dmgMult 1.35× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: W105 wing lift + R2F orbital drive (Case 1861)

---

### [Case 1864 — Storm Pegasus 105RF — RF Tip Orbital-to-Liftoff Aerodynamic Launch](./15%20case%20study.md#case-1864)

**System**: MFB / Metal Fusion (BB-28)  
**Mechanism**: GIMMICK(2) — RF orbital-to-vertical liftoff (GIMMICK(1) in Case 1812). v_orbital = 2.040 m/s; η_launch = 0.30; v_z_self = 0.612 m/s; h_apex_self = 1.91 cm. Knock-up assisted (J_up = 0.02 N·s): v_z_total = 1.153 m/s; h_apex_knockup = 6.78 cm. Self-launch gives voluntary Starblast; knock-up gives harder dive variant.  
**Gimmick**: RF orbital momentum → vertical liftoff transition → MechanicRegistry: orbital_liftoff

---

### [Case 1865 — Storm Pegasus 105RF — Starblast Attack](./15%20case%20study.md#case-1865)

**System**: MFB / Metal Fusion  
**Blader**: Gingka Hagane  
**Special Move**: Starblast Attack (JP: Shooting Star Attack) — nose-dive crash; self-launch: h = 1.91 cm, v_impact = 2.130 m/s; knock-up: h = 6.78 cm, v_impact = 2.344 m/s; J_starblast = 7.901×10⁻² N·s → Δv_opp = 2.079 m/s (knockup); Δω_SP = 71.0 rad/s (89.6% retained). [M] ×7.0 → Δv = 14.6 m/s (shooting star). powerCost 100. Cosmic Pegasus F:D also compatible.  
**Compatible beys**: RF driver (v_orbital ≥ 1.8 m/s, η_launch ≥ 0.30); knock-up variant accessible to any bey that can redirect upward impact; standard: Storm Pegasus 105RF (Metal Fusion); also: Cosmic Pegasus F:D

---

### [Case 1866 — Storm Pegasus 105RF — Star Dive](./15%20case%20study.md#case-1866)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Star Dive. Sequence: moveUp → attack → moveDown (↑ A ↓). Cost: 15. Type: attack. ↑ self-launch liftoff (h = 1.91 cm, v_z = 0.612 m/s); A nose-dive at apex (v_impact = 2.130 m/s); ↓ RF landing reconversion η = 0.55: +11 rad/s spin; dmgMult 1.20× (vertical strike vector); lockMs 0. dmgMult 1.20× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: RF orbital liftoff transition (Case 1864)

---

*(Cases 1867–1873: confirmed gap — CS9 HMS session conflict #8; CS9 Round Shell MS/Samurai Changer MS blocks overlap with CS15 Cases 1865–1866)*

---

### [Case 1874 — Galaxy Pegasus W105R2F — R2F Warm-Up Friction Increase & Space-Launch Altitude](./15%20case%20study.md#case-1874)

**System**: MFB / Metal Masters  
**Mechanism**: GIMMICK(2) — R2F rubber warm-up friction gain (GIMMICK(1) in Cases 1861–1862). Cold μ = 0.80 → warm μ = 0.95 after ΔQ = 1.901 J (4 circuits, t_warmup = 1.538 s). v_orbital_warm = 3.878 m/s (+18.75%). η_mastered = 0.50 (vs 0.35 cold); v_z_wing_extended = 0.419 m/s (vs 0.210 m/s); v_z_total = 2.358 m/s; h_apex = 28.34 cm (vs 9.32 cm Starbooster). Stardust Driver uses full warm-up; Starbooster does not.  
**Gimmick**: R2F thermal warm-up friction increase → elevated apex height → MechanicRegistry: rubber_warmup / extended_liftoff

---

### [Case 1875 — Galaxy Pegasus W105R2F — Stardust Driver](./15%20case%20study.md#case-1875)

**System**: MFB / Metal Masters  
**Blader**: Gingka Hagane  
**Special Move**: Stardust Driver (JP: Star Dust Driver) — warm-rubber space-altitude dive: μ = 0.95, 4 circuits; h_apex = 28.34 cm; v_impact = 4.539 m/s; J_stardust = 1.602×10⁻¹ N·s → Δv_opp = 4.005 m/s (28.4% stronger than Starbooster at physical level). Δω_GP = 132.0 rad/s (80.6% retained). [M] ×9.0 → Δv = 36.0 m/s (star-speed warm-rubber mastered crash). powerCost 100. Defeated Julian Konzern (Black Excalibur) and Damian Hart (Hades Gate).  
**Compatible beys**: W105 + R2F where blader allows ≥ 1.538 s arena run-in for full warm-up (ΔQ ≥ 1.9 J); standard: Galaxy Pegasus W105R2F (Gingka Hagane, Metal Masters)

---

### [Case 1876 — Galaxy Pegasus W105R2F — Dust Rush](./15%20case%20study.md#case-1876)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Dust Rush. Sequence: dodge → moveUp → attack (E ↑ A). Cost: 15. Type: attack. E inner arc at v_orbital_cold = 3.264 m/s; ↑ partial cold liftoff η_combo = 0.25: h = 3.39 cm; A cold aerial dive v_impact = 3.364 m/s; landing reconversion Δω = +32 rad/s (η_land = 0.30); dmgMult 1.25× (partial cold liftoff aerial orbital); lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: R2F warm-up + liftoff system (Case 1874)

---

### [Case 1877 — Grand Capricorn 145D — Horn Tip Contact Pressure & Red Tornado Vortex](./15%20case%20study.md#case-1877)

**System**: MFB / Metal Masters (BB-73)  
**Geometry**: Grand FW: r = 3.1 cm, 35.0 g; Capricorn ER: r = 2.4 cm, 4.0 g; 145 track: 1.5 g; D tip: r = 0.5 cm, μ = 0.15; I_total = 3.602×10⁻⁵ kg·m²; m_total = 41.5 g; ω₀ = 680 rad/s  
**Mechanism**: v_horn = 21.08 m/s; horn contact stress P = 51.9 MPa (0.94× ABS yield — near-yield elastic). Rankine vortex: Γ = 4.108 m²/s; v_vortex(r=4.5 cm) = 14.54 m/s; F_suction = 0.1627 N inward. D tip: τ = 3.053×10⁻⁴ N·m; t_spin = 80.2 s; v_patrol = 0.510 m/s.  
**Gimmick**: Near-yield horn elastic contact + Rankine vortex inward suction → MechanicRegistry: horn_protrusion_strike / vortex_suction

---

### [Case 1878 — Grand Capricorn 145D — Steel Darkness](./15%20case%20study.md#case-1878)

**System**: MFB / Metal Masters  
**Blader**: Klaus  
**Special Move**: Steel Darkness (JP: Eisenschwarz) — red tornado suction draw + point-blank horn ram: F_suction = 0.1627 N draws opponent Δr = 1.4 cm; v_approach = 0.346 m/s; v_rel = 0.856 m/s; J_steel = 2.970×10⁻² N·s → Δv_opp = 0.782 m/s; Δω_GC = 20.6 rad/s (97.0% retained). [M] horn snap angular→linear Δv_kick = 1.78 m/s; ×7.0 → Δv = 5.5 m/s. powerCost 100.  
**Compatible beys**: Grand FW (horn protrusions at r ≥ 2.8 cm, v_tip ≥ 18 m/s) + D or wide low-friction tip; standard: Grand Capricorn 145D (Klaus, Metal Masters)

---

### [Case 1879 — Grand Capricorn 145D — Iron Ram](./15%20case%20study.md#case-1879)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Iron Ram. Sequence: defense → dodge → defense (K E K). Cost: 15. Type: defense. K₁ vortex dwell 0.10 s: J_suction = 1.627×10⁻² N·s → v_approach = 0.428 m/s; E D-tip pivot to contact; K₂ re-contact reconversion: Δω = +14 rad/s (η = 0.50); dmgMult 1.20×; lockMs 150 (suction vortex dwell). dmgMult 1.20× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Horn contact pressure + vortex suction (Case 1877)

---

### [Case 1880 — Dragoon Storm — Upper Dragoon Blade Lift & Vertical Vortex Column](./15%20case%20study.md#case-1880)

**System**: Plastic Gen / Bakuten Shoot  
**Geometry**: Upper Dragoon AR: 4 upward-angled blades, r = 3.2 cm, 14.0 g; 10 Wide WD: r = 3.5 cm, 18.0 g; SG Sharp BB: r = 0.3 cm, μ = 0.08; I_total = 3.657×10⁻⁵ kg·m²; m_total = 37.5 g (Bit Chip ~1 g at r ≈ 0 excluded); ω₀ = 700 rad/s  
**Mechanism**: v_blade = 22.40 m/s; F_lift_total = 4.796×10⁻² N (4 blades, C_L = 0.65, 13.0% of weight). Rankine vortex column: Γ = 4.500 m²/s; v_column(r=5.0 cm) = 14.32 m/s; F_eject = F_barrier = 0.1582 N. Sharp tip: τ = 8.831×10⁻⁵ N·m; t_spin = 290.1 s (near-stationary for Storm Attack).  
**Gimmick**: 4-blade rotor lift + Rankine vortex ejection/barrier → MechanicRegistry: rotor_lift / vortex_eject

---

### [Case 1881 — Dragoon Storm — Storm Attack](./15%20case%20study.md#case-1881)

**System**: Plastic Gen / Bakuten Shoot  
**Blader**: Tyson Granger  
**Special Move**: Storm Attack — vortex column barrier + upward ejection: F_barrier absorbs 2.1% of incoming attack speed; F_eject = 0.1582 N × 0.5 s → J_eject = 7.910×10⁻² N·s → Δv_opp = 2.082 m/s (upward ring-out); Δω_DS = 54.1 rad/s (92.3% retained). Dragoon becomes stationary (SG Sharp t_spin = 290.1 s). [M] ×8.0 → Δv = 16.7 m/s (full-stadium storm ejection, Dragoon BitBeast materialises). powerCost 100.  
**Compatible beys**: 4+ upward-blade AR (C_L ≥ 0.50, v_blade ≥ 20 m/s) + Sharp/Metal Sharp BB for near-stationary vortex platform; standard: Dragoon Storm (Tyson Granger, Bakuten Shoot)

---

### [Case 1882 — Dragoon Storm — Tornado Guard](./15%20case%20study.md#case-1882)

**System**: Plastic Gen / Bakuten Shoot  
**Mechanism**: COMBO — Tornado Guard. Sequence: defense → moveUp → defense (K ↑ K). Cost: 15. Type: defense. K₁ stationary vortex column (t = 0.15 s): J_partial = 2.373×10⁻² N·s; ↑ orbital arc redirects column exit direction; K₂ sharp tip re-contact: Δω = +10 rad/s (η = 0.60); dmgMult 1.20× (directed partial vortex blast); lockMs 250 (column dwell K₁ + ↑ phase). dmgMult 1.20× ≤ 1.5 ✓; lockMs 250 ≤ 300 ✓.  
**Gimmick**: Parent: Upper Dragoon blade lift + vortex column (Case 1880)

---

### [Case 1883 — Flash Leopard — Aerodynamic Drag Heating & Hot Wind Vortex](./15%20case%20study.md#case-1883)

**System**: Plastic Gen / Bakuten Shoot V-Force  
**Geometry**: Flash Leopard AR: 4 angular blades, r = 3.2 cm, 14.0 g; 10 Wide WD: r = 3.5 cm, 18.0 g; SG Flat BB: r = 0.5 cm, μ = 0.15; I_total = 3.680×10⁻⁵ kg·m²; m_total = 38.0 g (Bit Chip excluded); ω₀ = 700 rad/s  
**Mechanism**: v_tip = 22.40 m/s; P_aero = 1.983 W; P_fric = 0.1957 W; P_heat = 2.179 W; ΔT_AR = 0.556 K (5 s). Rankine hot wind vortex: Γ = 4.500 m²/s; F_wind = 0.1580 N (outward repulsion). t_spin = 92.1 s; v_orbital = 0.5250 m/s. BeySpirit: true sacred fire plasma.  
**Gimmick**: Aerodynamic drag heating + hot wind Rankine vortex → MechanicRegistry: aero_heat / vortex_eject

---

### [Case 1884 — Flash Leopard — Sacred Fire](./15%20case%20study.md#case-1884)

**System**: Plastic Gen / Bakuten Shoot V-Force  
**Blader**: Ozuma  
**Special Move**: Sacred Fire — hot wind vortex blast + heated AR orbital contact: F_wind = 0.1580 N × 0.5 s → J_wind = 7.900×10⁻² N·s → Δv_wind = 2.079 m/s; J_contact = 1.646×10⁻² N·s → Δv_contact = 0.433 m/s; Δv_total = 2.512 m/s. Δω_FL = 11.2 rad/s (98.4% retained). [M] Leopard spirit: P_aero = 1.983 W → sacred plasma; ×7.0 → Δv = 14.6 m/s. powerCost 100.  
**Compatible beys**: 4+ angular blade AR (P_aero ≥ 1.5 W, v_blade ≥ 20 m/s) + Flat/Semi-Flat BB (μ ≥ 0.12, r ≥ 0.4 cm) for vortex refresh; standard: Flash Leopard (Ozuma, Bakuten Shoot V-Force)

---

### [Case 1885 — Flash Leopard — Ember Strike](./15%20case%20study.md#case-1885)

**System**: Plastic Gen / Bakuten Shoot V-Force  
**Mechanism**: COMBO — Ember Strike. Sequence: attack → defense → attack (A K A). Cost: 15. Type: attack. A₁ orbital contact J₁ = 1.646×10⁻² N·s; K AR thermal dwell 0.15 s (ΔQ = 0.327 J); A₂ thermal-primed second contact; total rebound Δω = +9 rad/s (SG Flat η = 0.40); dmgMult 1.20×; lockMs 150 (thermal dwell). dmgMult 1.20× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Aerodynamic drag heating + hot wind vortex (Case 1883)

---

### [Case 1886 — Salvage Valtryek Shot-7 — Shot Driver Spring Jump & Salvage Blade Dual Rubber-Metal Contact](./15%20case%20study.md#case-1886)

**System**: Burst / DB (Dynamite Battle)  
**Geometry**: Salvage blade: 3 metal + 3 rubber blades, r = 2.8 cm, 16.0 g; Valtryek DB Core: 7.5 g; Armor: 13.5 g; 7-60 Ratchet: r = 2.2 cm, 18.0 g; Shot driver: k = 800 N/m, x = 5 mm, r = 0.5 cm, μ = 0.20; I_total = 2.686×10⁻⁵ kg·m²; m_total = 61.0 g; ω₀ = 680 rad/s  
**Mechanism**: PE_spring = 1.000×10⁻² J; v_z_jump = 0.573 m/s; h_jump = 1.67 cm. v_orbital = 0.680 m/s; v_impact = 0.889 m/s. e_eff = 0.625 (3×metal e=0.75 + 3×rubber e=0.50 whip-snap). t_spin = 30.5 s.  
**Gimmick**: Spring-loaded vertical jump attack + dual rubber-metal whip blade → MechanicRegistry: spring_jump / rubber_metal_whip

---

### [Case 1887 — Salvage Valtryek Shot-7 — Salvage Whip (Savior Slash)](./15%20case%20study.md#case-1887)

**System**: Burst / DB  
**Blader**: Valt Aoi / Rashad Goodman  
**Special Move**: Salvage Whip (JP: Savior Slash) — Shot spring jump aerial 6-blade strike: v_impact = 0.889 m/s, e_eff = 0.625; J_salvage = 3.490×10⁻² N·s → Δv_opp = 0.873 m/s; Δω_SV = 32.5 rad/s (95.2% retained). [M] Valt + Rashad co-blader dual Valtryek spirit fusion ×8.0 → Δv = 7.0 m/s (dual Savior Slash). powerCost 100.  
**Compatible beys**: Salvage blade (3+ metal + 3+ rubber blades, r ≥ 2.6 cm) + Shot driver (k ≥ 600 N/m, h_jump ≥ 1.2 cm); standard: Salvage Valtryek Shot-7 (Valt Aoi and Rashad Goodman, Burst DB)

---

### [Case 1888 — Salvage Valtryek Shot-7 — Salvage Rush](./15%20case%20study.md#case-1888)

**System**: Burst / DB  
**Mechanism**: COMBO — Salvage Rush. Sequence: attack → moveUp → attack (A ↑ A). Cost: 15. Type: attack. A₁ orbital contact J₁ = 2.670×10⁻² N·s; ↑ Shot spring jump (h = 1.67 cm, v_z = 0.573 m/s); A₂ aerial 6-blade dive J₂ = 3.490×10⁻² N·s; Shot rubber spring rebound Δω = +11 rad/s (η = 0.35); dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Shot spring jump + dual blade whip (Case 1886)

---

### [Case 1889 — Wyborg — Sand Vortex Inward Suction & SG Hole Flat Attack Mode](./15%20case%20study.md#case-1889)

**System**: Plastic Gen / Bakuten Shoot V-Force  
**Geometry**: Wyborg AR: 3 serpentine blades, r = 3.2 cm, 14.0 g; 10 Wide WD: 18.0 g; SG Hole Flat BB: μ_HF = 0.35, r = 0.5 cm (attack), μ_sharp = 0.08, r = 0.3 cm (defense); I_total = 3.679×10⁻⁵ kg·m²; m_total = 37.5 g; ω₀ = 700 rad/s  
**Mechanism**: Rankine sand vortex: Γ = 4.500 m²/s; F_bind = 0.1580 N (inward suction). HF mode: τ = 6.44×10⁻⁴ N·m; t_spin = 40.0 s; v_orbital = 1.225 m/s. Sharp mode: τ = 8.831×10⁻⁵ N·m (conserves spin before attack phase).  
**Gimmick**: Inward sand vortex suction + HF attack mode → MechanicRegistry: vortex_suction / hf_attack_mode

---

### [Case 1890 — Wyborg — Sand Bind](./15%20case%20study.md#case-1890)

**System**: Plastic Gen / Bakuten Shoot V-Force  
**Blader**: Ian Papov  
**Special Move**: Sand Bind (JP: 砂蛇縛撃) — sand vortex draw + HF high-speed contact: F_bind = 0.1580 N × 0.20 s → J_bind = 3.160×10⁻² N·s → v_approach = 0.832 m/s; v_rel = 2.057 m/s; J_sandbind = 6.210×10⁻² N·s → Δv_opp = 1.634 m/s. Δω_W = 42.2 rad/s (94.0% retained). [M] serpent spirit constriction ×7.0 → Δv = 11.4 m/s. powerCost 100.  
**Compatible beys**: 3+ blade AR (r ≥ 3.0 cm, Γ ≥ 4.0 m²/s) + Hole Flat/Wide Flat BB (μ ≥ 0.30, r ≥ 0.4 cm); standard: Wyborg (Ian Papov, Bakuten Shoot V-Force)

---

### [Case 1891 — Wyborg — Sand Fang](./15%20case%20study.md#case-1891)

**System**: Plastic Gen / Bakuten Shoot V-Force  
**Mechanism**: COMBO — Sand Fang. Sequence: defense → attack → dodge (K A E). Cost: 15. Type: attack. K sharp-tip mode saves Δω = +2.3 rad/s; A partial sand bind (0.10 s) + HF: v_rel = 1.641 m/s; J_combo = 4.954×10⁻² N·s; E HF rubber rebound Δω = +11.8 rad/s; total +14 rad/s; dmgMult 1.20×; lockMs 150 (sharp-tip dwell). dmgMult 1.20× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Sand vortex + HF mode (Case 1889)

---

### [Case 1892 — Dark Gasher CH120SF — CH120 Height Extension & Six-Prong Upper-Level AR Contact](./15%20case%20study.md#case-1892)

**System**: MFB / Metal Fusion  
**Geometry**: Dark FW: 6 prong protrusions, r = 2.8 cm, 30.0 g; Gasher/Cancer ER: r = 2.3 cm, 3.8 g; CH120 track (extended 145 mm): Δh = 2.5 cm, 2.7 g; SF tip: r = 0.4 cm, μ = 0.12; I_total = 2.593×10⁻⁵ kg·m²; m_total = 37.3 g; ω₀ = 650 rad/s  
**Mechanism**: Δh = 2.5 cm; PE_CH = 9.141×10⁻³ J; v_dive = 0.700 m/s; v_orbital_SF = 0.312 m/s; v_impact = 0.767 m/s. v_prong = 18.20 m/s. τ_SF = 1.756×10⁻⁴ N·m; t_spin = 95.9 s.  
**Gimmick**: CH120 height extension gravity dive + 6-prong upper AR contact → MechanicRegistry: height_extension / top_down_peck

---

### [Case 1893 — Dark Gasher CH120SF — Six Crab Shake](./15%20case%20study.md#case-1893)

**System**: MFB / Metal Fusion  
**Blader**: Tetsuya Watarigani  
**Special Move**: Six Crab Shake (JP: Shikkusu Kurabu Sheikingu) — CH145 gravity dive 6-prong sequential peck: v_impact = 0.767 m/s; J_sixcrab = 2.454×10⁻² N·s (J_per_peck = 4.090×10⁻³ per prong) → Δv_opp = 0.646 m/s. Δω_DG = 23.7 rad/s (96.4% retained). [M] crab claws × 6 count ×6.0 → Δv = 3.9 m/s. powerCost 100.  
**Compatible beys**: CH120/130/145 Spin Track + FW with 6+ symmetric protrusions at r ≥ 2.6 cm; standard: Dark Gasher CH120SF (Tetsuya Watarigani, Metal Fusion)

---

### [Case 1894 — Dark Gasher CH120SF — Crab Peck](./15%20case%20study.md#case-1894)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Crab Peck. Sequence: moveDown → attack → attack (↓ A A). Cost: 15. Type: attack. ↓ CH145 position primed (h = 2.5 cm); A₁ full peck v_impact = 0.767 m/s → J₁ = 2.454×10⁻² N·s; A₂ partial-height recovery peck (h₂ = 1.25 cm, v = 0.585 m/s) → J₂ = 1.871×10⁻² N·s; SF double-peck rebound Δω = +13 rad/s (η = 0.30); dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: CH120 height extension + 6-prong contact (Case 1892)

---

### [Case 1895 — Ray Gasher M145Q — M145 Mid-Height Stabiliser & Q-Tip Rubber Bounce Drill](./15%20case%20study.md#case-1895)

**System**: MFB / Metal Fusion  
**Geometry**: Ray FW: swept blades, r = 2.8 cm, 27.5 g; Gasher ER: r = 2.3 cm, 3.8 g; M145: 2.5 g; Q tip: r = 0.35 cm, μ = 0.20, k = 1200 N/m, x = 6 mm; I_total = 2.383×10⁻⁵ kg·m²; m_total = 35.0 g; ω₀ = 650 rad/s  
**Mechanism**: PE_Q = 2.160×10⁻² J; v_vert = 1.111 m/s; h_apex = 6.29 cm. v_orbital_Q = 0.455 m/s; v_impact = 1.201 m/s. Drill vortex: Γ = 3.205 m²/s; F_drill = 0.07983 N. τ_Q = 2.401×10⁻⁴ N·m; t_spin = 64.5 s.  
**Gimmick**: Q rubber bounce drill launch + drill-vortex overhead smash → MechanicRegistry: bounce_launch / drill_vortex

---

### [Case 1896 — Ray Gasher M145Q — Slumdog Driver](./15%20case%20study.md#case-1896)

**System**: MFB / Metal Fusion  
**Blader**: Enso Garcia / Selen  
**Special Move**: Slumdog Driver (JP: Suramu Doggu Doraibā) — Q bounce drill overhead smash: h = 6.29 cm; v_impact = 1.201 m/s; J_slumdog = 3.829×10⁻² N·s → Δv_opp = 1.008 m/s. Δω_RG = 40.1 rad/s (93.8% retained). [M] co-blader Double Slumdog ×8.0 → Δv = 8.1 m/s (twin-drill). powerCost 100. Compatible with standard and Double Slumdog (both Enso + Selen).  
**Compatible beys**: Q tip (k ≥ 900 N/m, x ≥ 5 mm, h ≥ 5.0 cm) + swept smash FW (r ≥ 2.6 cm) + M145+ track; standard: Ray Gasher M145Q (Enso Garcia and Selen, Metal Fusion)

---

### [Case 1897 — Ray Gasher M145Q — Tornado Dash](./15%20case%20study.md#case-1897)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Tornado Dash. Sequence: moveUp → attack → moveUp (↑ A ↑). Cost: 15. Type: attack. ↑₁ Q bounce (h = 6.29 cm, v_vert = 1.111 m/s); A aerial drill smash J = 3.829×10⁻² N·s; ↑₂ Q dome recompression rebound Δω = +12 rad/s (η = 0.30); dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Q bounce drill + drill vortex (Case 1895)

---

### [Case 1898 — Storm Capricorn M145Q — M145 Targeting Stance & Q Horizontal Dash Release](./15%20case%20study.md#case-1898)

**System**: MFB / Metal Fusion  
**Geometry**: Storm FW: r = 2.8 cm, 28.0 g; Capricorn ER: r = 2.3 cm (horn r_tip = 0.15 cm), 3.8 g; M145: 2.5 g; Q tip: k = 1200 N/m, x = 6 mm, r = 0.35 cm; I_total = 2.423×10⁻⁵ kg·m²; m_total = 35.5 g; ω₀ = 650 rad/s  
**Mechanism**: Q horizontal spring release: PE_Q = 2.160×10⁻² J; v_dash = 1.103 m/s. ER horn point: P = 150.2 MPa (2.73× ABS yield — penetrates movable walls). v_horn_tip = 14.95 m/s. This case: Sniper Shot horizontal dash (distinct from Case 1839–1841 vertical Spin Screwdriver bounce).  
**Gimmick**: Q spring horizontal dash + ER Capricorn horn bullet-point strike → MechanicRegistry: spring_dash / horn_point_strike

---

### [Case 1899 — Storm Capricorn M145Q — Sniper Shot](./15%20case%20study.md#case-1899)

**System**: MFB / Metal Fusion  
**Blader**: Tobio Oike  
**Special Move**: Sniper Shot — Q horizontal dash + Capricorn horn precision strike (QTE multi-target): v_dash = 1.103 m/s; J_base = 3.542×10⁻² N·s; QTE lock-on +20%: J_QTE = 4.250×10⁻² N·s → Δv = 1.118 m/s (QTE) / 0.932 m/s (base). Δω_SC = 43.8 rad/s QTE (93.3% retained). [M] ×7.0 → Δv = 7.8 m/s (sniper through-wall). powerCost 100. QTE fires when ≥ 2 opponents present.  
**Compatible beys**: Q tip (horizontal release, k ≥ 900 N/m) + ER horn point (r_horn ≤ 0.2 cm, P ≥ 2.5× ABS yield) + M145+; standard: Storm Capricorn M145Q (Tobio Oike, Metal Fusion)

---

### [Case 1900 — Storm Capricorn M145Q — Sniper Charge](./15%20case%20study.md#case-1900)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Sniper Charge. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 15. Type: attack. ↑ partial Q compression (x = 3 mm): v_partial = 0.552 m/s; → targeting alignment + v_orbital = 0.455 m/s; A combined v_impact = 0.715 m/s → J = 2.296×10⁻² N·s; Q dome rebound Δω = +7 rad/s (η = 0.30); dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Q horizontal dash + horn point strike (Case 1898)

---

### [Case 1901 — Flame Libra T125ES — T125 Arena Vibration & ES Sustained Acoustic Vortex](./15%20case%20study.md#case-1901)

**System**: MFB / Metal Fusion  
**Geometry**: Flame FW: r = 2.7 cm, 27.0 g; Libra ER: r = 2.4 cm, 4.2 g; T125: 3 triangular fins, r = 0.6 cm, 1.7 g; ES tip: r = 0.15 cm, μ = 0.04; I_total = 2.217×10⁻⁵ kg·m²; m_total = 34.4 g; ω₀ = 650 rad/s  
**Mechanism**: T125: f_vib = 310.4 Hz; A_vib = 2.155 μm → arena sand mode (Δμ = +0.15, τ_sand_drain = 2.796×10⁻⁴ N·m on opponent). Acoustic vortex: Γ = 2.977 m²/s; F_sonic = 0.06913 N (outward). ES: τ = 2.024×10⁻⁵ N·m; t_spin = 712 s (~11.9 min sustained). Case covers Sonic Buster baseline; Sonic Wave resonance in Cases 1904–1906.  
**Gimmick**: T125 arena vibration + Rankine acoustic vortex stamina → MechanicRegistry: arena_vibration / acoustic_vortex

---

### [Case 1902 — Flame Libra T125ES — Sonic Buster](./15%20case%20study.md#case-1902)

**System**: MFB / Metal Fusion  
**Blader**: Yu Tendo  
**Special Move**: Sonic Buster — T125 arena sand destabilization + acoustic wave ejection: f_vib = 310.4 Hz → sand zone (τ_drain on opponent); F_sonic = 0.06913 N × 0.5 s → J_sonic = 3.457×10⁻² N·s → Δv_opp = 0.910 m/s. Δω_L = 39.0 rad/s (94.0% retained). [M] Libra bit-beast arena-collapse shockwave ×7.0 → Δv = 6.4 m/s. powerCost 100.  
**Compatible beys**: 3+ fin Spin Track (f ≥ 300 Hz) + smooth FW (Γ ≥ 2.5 m²/s) + bearing/ES tip (t_spin ≥ 600 s); standard: Flame Libra T125ES (Yu Tendo, Metal Fusion)

---

### [Case 1903 — Flame Libra T125ES — Sound Burst](./15%20case%20study.md#case-1903)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Sound Burst. Sequence: attack → moveUp → attack (A ↑ A). Cost: 15. Type: attack. A₁ partial wave (0.20 s) J₁ = 1.383×10⁻² N·s; ↑ T125 height axis raise (×1.25 factor); A₂ height-boosted wave J₂ = 1.729×10⁻² N·s; ES bearing recoil Δω = +12 rad/s (η = 0.35); dmgMult 1.20×; lockMs 0. dmgMult 1.20× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: T125 arena vibration + acoustic vortex (Case 1901)

---

### [Case 1904 — Flame Libra T125ES — Resonance Amplification & Arena-Wide Sonic Collapse](./15%20case%20study.md#case-1904)

**System**: MFB / Metal Fusion  
**Mechanism**: GIMMICK(2) — T125 resonance amplification (GIMMICK(1) in Case 1901). Q_factor = 10; A_resonance = 21.55 μm (vs A_vib = 2.155 μm baseline); full-arena fluidisation at r_wave = 15.0 cm. σ_cyclic = 1.596 MPa at ω₀ (SF = 34.5 — structurally safe). Amplitude scales as ω² — safe at all spin levels. Risk: pure spin drain from extended acoustic output.  
**Gimmick**: T125 resonance build-up → full-arena sand collapse → MechanicRegistry: arena_resonance

---

### [Case 1905 — Flame Libra T125ES — Sonic Wave](./15%20case%20study.md#case-1905)

**System**: MFB / Metal Fusion  
**Blader**: Yu Tendo  
**Special Move**: Sonic Wave — full-arena resonance sand collapse + extended acoustic vortex: Q=10, A_resonance = 21.55 μm → sand at r = 15.0 cm; F_sonic × 1.0 s → J = 6.913×10⁻² N·s → Δv_opp = 1.819 m/s; Δω_L = 78.0 rad/s (88.0% retained; doubled to 156.0 rad/s if below 40% spin). [M] ×7.0 → Δv = 12.7 m/s (arena-wide collapse). powerCost 100. Stronger than Sonic Buster; first used vs Gingka Metal Fusion battle 2.  
**Compatible beys**: Same as Sonic Buster (Case 1902) + sustained ω₀ ≥ 600 rad/s for ≥ 1.0 s to develop resonance; standard: Flame Libra T125ES (Yu Tendo, Metal Fusion)

---

### [Case 1906 — Flame Libra T125ES — Resonant Strike](./15%20case%20study.md#case-1906)

**System**: MFB / Metal Fusion  
**Mechanism**: COMBO — Resonant Strike. Sequence: defense → attack → attack (K A A). Cost: 15. Type: attack. K resonance prime (Q: 3→6, A_prime = 12.93 μm); A₁ primed partial wave (0.15 s) J₁ = 1.037×10⁻² N·s; A₂ ×1.5 buildup J₂ = 1.556×10⁻² N·s; ES bearing recoil Δω = +10 rad/s (η = 0.35); dmgMult 1.20×; lockMs 150. dmgMult 1.20× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: T125 resonance amplification (Case 1904)

---

### [Case 1907 — Vortex Ape — Flat Tip Charge Sprint & Triboelectric Spark Shield](./15%20case%20study.md#case-1907)

**System**: Plastic Gen / Bakuten Shoot  
**Geometry**: Vortex Ape AR: 6 swept protrusions, r = 3.2 cm, 15.0 g; 10-Wide WD: r = 3.5 cm, 18.0 g; Flat BB: r = 0.3 cm, μ = 0.35; I_total = 4.093×10⁻⁵ kg·m²; m_total = 38.5 g (Bit Chip excluded); ω₀ = 700 rad/s  
**Mechanism**: Sprint: a = 3.434 m/s²; v_charge = 1.015 m/s (over r = 15.0 cm). Triboelectric spark: σ_e = 1.735×10⁻⁶ C/m²; V_spark = 1175 V; E_spark = 3.424×10⁻⁷ J; e_base = 0.65 → e_eff = 0.78 (+20% spark restitution). t_spin = 72.0 s.  
**Gimmick**: Flat tip sprint + triboelectric spark restitution boost → MechanicRegistry: sprint_charge / spark_restitution

---

### [Case 1908 — Vortex Ape — Spark Hammer](./15%20case%20study.md#case-1908)

**System**: Plastic Gen / Bakuten Shoot  
**Blader**: Dunga  
**Special Move**: Spark Hammer (JP: Supaaku Hanmaa) — flat tip sprint + spark-enhanced AR smash: v_charge = 1.015 m/s; e_eff = 0.78 (spark +20%); J_spark = 3.456×10⁻² N·s → Δv_opp = 0.909 m/s. Δω_VA = 25.3 rad/s (96.4% retained). [M] Ape spirit electric storm ×7.0 → Δv = 6.4 m/s. powerCost 100.  
**Compatible beys**: Flat BB (μ ≥ 0.30) + 6+ protrusion AR (r ≥ 3.0 cm, V_spark ≥ 300 V at v_tip ≥ 20 m/s); standard: Vortex Ape (Dunga, Bakuten Shoot)

---

### [Case 1909 — Vortex Ape — Electric Charge](./15%20case%20study.md#case-1909)

**System**: Plastic Gen / Bakuten Shoot  
**Mechanism**: COMBO — Electric Charge. Sequence: moveRight → jump → attack (→ J A). Cost: 15. Type: attack. → partial sprint (r = 7.5 cm) v_partial = 0.718 m/s; J flat hop h = 4.4 mm; A combined v_impact = 0.776 m/s; J_elec = 2.640×10⁻² N·s; flat rebound Δω = +5 rad/s (η = 0.28); dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Flat sprint + triboelectric spark (Case 1907)

---

### [Case 1910 — Dranzer F — Wing AR Lift & Aerial Overhead Descent Strike](./15%20case%20study.md#case-1910)

**System**: Plastic Gen / Bakuten Shoot  
**Geometry**: Dranzer AR: 4 swept phoenix wings, r = 3.2 cm (C_L = 0.6, A_wing = 1.2×10⁻⁴ m²), 14.0 g; Circle Balance WD: r = 3.4 cm, 14.0 g; Flat BB: r = 0.3 cm, μ = 0.35; I_total = 3.405×10⁻⁵ kg·m²; m_total = 33.5 g; ω₀ = 700 rad/s  
**Mechanism**: F_lift = 8.871×10⁻² N (27% of weight); g_eff = 7.165 m/s²; bowl-wall launch (60°): v_z = 1.273 m/s; h_apex = 11.31 cm; v_descent = 1.490 m/s; v_impact = 1.661 m/s. τ_flat = 3.461×10⁻⁴ N·m; t_spin = 68.9 s.  
**Gimmick**: 4-wing lift (27%) + bowl-wall vertical launch + overhead aerial smash → MechanicRegistry: wing_liftoff / bowl_launch

---

### [Case 1911 — Dranzer F — Spin Fire](./15%20case%20study.md#case-1911)

**System**: Plastic Gen / Bakuten Shoot  
**Blader**: Kai Hiwatari  
**Special Move**: Spin Fire — bowl-wall wing-lift aerial overhead phoenix descent: h_apex = 11.31 cm; v_impact = 1.661 m/s; J_spinfire = 5.174×10⁻² N·s → Δv_opp = 1.361 m/s. Δω_D = 45.6 rad/s (93.5% retained). [M] Kai Dranzer phoenix fire spirit ×8.0 → Δv = 10.9 m/s. powerCost 100. Similar to Mountain Cat Attack (high-angle bowl launch) but W105 wing lift extends h_apex.  
**Compatible beys**: Flat BB (μ ≥ 0.30) + 4+ wing AR (r ≥ 3.0 cm, F_lift ≥ 0.06 N) + 50–70° bowl wall; standard: Dranzer F (Kai Hiwatari, Bakuten Shoot)

---

### [Case 1912 — Dranzer F — Flame Dive](./15%20case%20study.md#case-1912)

**System**: Plastic Gen / Bakuten Shoot  
**Mechanism**: COMBO — Flame Dive. Sequence: moveUp → attack → defense (↑ A K). Cost: 15. Type: attack. ↑ partial bowl launch (v_partial = 0.368 m/s) with g_eff: h = 2.83 cm; A partial aerial dive v_impact = 0.831 m/s → J = 2.588×10⁻² N·s; K wing-guard deflection recoil Δω = +7 rad/s (η_wing = 0.30); dmgMult 1.25×; lockMs 100 (wing guard hold). dmgMult 1.25× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Wing lift + bowl-wall aerial smash (Case 1910)

---

### [Case 1913 — Thermal Lacerta WA130HF — WA130 Wing-Arm Sweep & HF Aggressive Orbit](./15%20case%20study.md#case-1913)

**System**: MFB / Metal Masters  
**Geometry**: Thermal FW: r = 2.8 cm, 29.0 g; Lacerta ER: r = 2.4 cm, 4.0 g; WA130: 2 lateral arms (L_arm = 2.0 cm, A_arm = 1.6×10⁻⁴ m², r_arm_tip = 4.8 cm), 3.5 g; HF tip: r = 0.35 cm, μ = 0.30; I_total = 2.580×10⁻⁵ kg·m²; m_total = 37.4 g; ω₀ = 650 rad/s  
**Mechanism**: v_arm = 31.20 m/s; F_sweep = 0.2289 N; J_sweep = 4.578×10⁻⁴ N·s (per arm, t_c = 2 ms). HF: v_orbital = 0.6825 m/s; v_impact ≈ 0.683 m/s; τ_HF = 3.858×10⁻⁴ N·m; t_spin = 43.5 s.  
**Gimmick**: WA130 lateral wing-arm tail sweep + HF aggressive orbit → MechanicRegistry: wing_arm_sweep / hf_orbit

---

### [Case 1914 — Thermal Lacerta WA130HF — Tempestuous Whirlwind Sword](./15%20case%20study.md#case-1914)

**System**: MFB / Metal Masters  
**Blader**: Chiyun Li  
**Special Move**: Tempestuous Whirlwind Sword (JP: Shippū Jinrai Ken) — WA130 tail-slash + HF orbital slam: v_combined = 0.683 m/s; J_whirlwind = 2.253×10⁻² N·s → Δv_opp = 0.593 m/s. Δω_TL = 21.8 rad/s (96.6% retained). [M] Lacerta pink tempest aura ×7.0 → Δv = 4.2 m/s. powerCost 100. Used to counter Tsubasa's Diving Crush.  
**Compatible beys**: WA130+ track (arm extension ≥ 1.5 cm, A_arm ≥ 1.2×10⁻⁴ m², F_sweep ≥ 0.15 N) + HF/aggressive flat tip (μ ≥ 0.25); standard: Thermal Lacerta WA130HF (Chiyun Li, Metal Masters)

---

### [Case 1915 — Thermal Lacerta WA130HF — Lacerta Slash](./15%20case%20study.md#case-1915)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Lacerta Slash. Sequence: moveRight → moveUp → attack (→ ↑ A). Cost: 15. Type: attack. → HF orbit v = 0.478 m/s; ↑ WA130 height focus (×1.15); A wing sweep + orbital J = 1.579×10⁻² N·s; HF rebound Δω = +4 rad/s (η = 0.28); dmgMult 1.20×; lockMs 0. dmgMult 1.20× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: WA130 wing-arm sweep + HF orbit (Case 1913)

---

### [Case 1916 — Dranzer MF (Wing Attacker CWD) — CWD Wide-Wing Aerodynamic Amplification & Phoenix Fire Column](./15%20case%20study.md#case-1916)

**System**: Plastic Gen / Bakuten Shoot manga finale  
**Geometry**: Dranzer MS MAR: r = 3.3 cm, 16.0 g; Wing Attacker CWD: r = 3.8 cm, 4 wings (A_wing = 2.0×10⁻⁴ m²), 22.0 g; SG Metal: 4.5 g; Metal Flat BB: r = 0.3 cm, μ = 0.35; I_total = 5.398×10⁻⁵ kg·m²; m_total = 45.5 g; ω₀ = 700 rad/s  
**Mechanism**: F_lift_CWD = 0.2080 N (46.6% of weight); g_eff = 5.239 m/s²; bowl-wall launch (65°): v_z = 1.577 m/s; h_apex = 23.73 cm; v_descent = 2.157 m/s; v_impact = 2.279 m/s. τ_MFB = 4.698×10⁻⁴ N·m; t_spin = 80.4 s.  
**Gimmick**: Wing Attacker CWD 46.6% lift + 65° bowl launch → apex 23.73 cm → MechanicRegistry: wing_liftoff / bowl_launch

---

### [Case 1917 — Dranzer MF (Wing Attacker CWD) — The End of Fire](./15%20case%20study.md#case-1917)

**System**: Plastic Gen / Bakuten Shoot manga finale  
**Blader**: Kai Hiwatari  
**Special Move**: The End of Fire (JP: Bakufū Engeki) — CWD wing-lift phoenix ascent + catastrophic fire-column descent: h_apex = 23.73 cm; v_impact = 2.279 m/s; J_endfire = 8.495×10⁻² N·s → Δv_opp = 2.235 m/s. Δω_DMF = 55.1 rad/s (92.1% retained). [M] Kai + Dranzer ultimate dual-spirit manga finale ×9.0 → Δv = 20.1 m/s (phoenix fire annihilation). powerCost 100.  
**Compatible beys**: Wing Attacker CWD (r ≥ 3.6 cm, 4+ wings, F_lift ≥ 0.18 N, lift ≥ 40%) + Flat Metal BB + bowl wall θ ≥ 60°; standard: Dranzer MF with Wing Attacker CWD (Kai Hiwatari, Bakuten Shoot manga finale)

---

### [Case 1918 — Dranzer MF (Wing Attacker CWD) — Ash Rise](./15%20case%20study.md#case-1918)

**System**: Plastic Gen / Bakuten Shoot manga  
**Mechanism**: COMBO — Ash Rise. Sequence: moveUp → moveUp → attack (↑ ↑ A). Cost: 35. Type: attack. ↑₁ partial ascent h = 5.93 cm; ↑₂ second-stage h = 11.85 cm; A combined descent v_impact = 1.693 m/s → J = 6.311×10⁻² N·s; CWD rebound Δω = +13 rad/s (η_CWD = 0.32); dmgMult 1.40×; lockMs 200 (fire column dwell). dmgMult 1.40× ≤ 1.5 ✓; lockMs 200 ≤ 300 ✓.  
**Gimmick**: Parent: Wing Attacker CWD lift + bowl launch (Case 1916)

---

### [Case 1919 — Dragoon GT & Strata Dragoon MS (HMS) — Phase-Locked Dual Rankine Tornado](./15%20case%20study.md#case-1919)

**System**: Plastic Gen / G-Revolution HMS  
**Geometry**: Dragoon GT HMS: MAR r = 3.2 cm, 11.0 g; Semi-Flat RC: μ = 0.35, r = 0.4 cm; I_DGT = 1.406×10⁻⁵ kg·m²; m_DGT = 22.5 g. Strata Dragoon MS: MAR r = 3.0 cm, 10.5 g; I_SDM = 1.155×10⁻⁵ kg·m²; m_SDM = 21.5 g. Both ω₀ = 750 rad/s (HMS lighter Al alloy).  
**Mechanism**: Both v_orbital = 1.050 m/s (equal rate → phase lock). Γ_DGT = 4.825 m²/s; Γ_SDM = 4.241 m²/s; Γ_combined = 9.066 m²/s; F_twin(r=7.5cm) = 0.2850 N (sync factor ≈ 2.0× vs non-sync sum 0.1431 N). Phase-lock collapse → each vortex falls to individual output.  
**Gimmick**: Phase-locked dual Rankine vortex constructive interference → MechanicRegistry: dual_vortex_sync

---

### [Case 1920 — Dragoon GT & Strata Dragoon MS — Twin Tornado Attack](./15%20case%20study.md#case-1920)

**System**: Plastic Gen / G-Revolution HMS  
**Blader**: Tyson Granger + Daichi Sumeragi (co-blader)  
**Special Move**: Twin Tornado Attack (JP: Tsuin Torunēdo Atakku) — phase-locked dual tornado strike: F_twin = 0.2850 N × 0.30 s → J = 8.550×10⁻² N·s → Δv_opp = 2.250 m/s; DGT Δω = 76.0 rad/s (89.9%); SDM Δω = 92.5 rad/s (87.7%). [M] Tyson + Daichi dual Dragoon spirit ×8.0 → Δv = 18.0 m/s. powerCost 100. Phase-lock critical — breaks down to F_SDM = 0.062 N if sync lost.  
**Compatible beys**: HMS pair (r_MAR ≥ 2.8 cm, Γ ≥ 3.5 m²/s each, identical flat RC v_orbital ±5%); standard: Dragoon GT + Strata Dragoon MS (Tyson + Daichi, G-Revolution)

---

### [Case 1921 — Dragoon GT — Cyclone Spiral](./15%20case%20study.md#case-1921)

**System**: Plastic Gen / G-Revolution HMS  
**Mechanism**: COMBO — Cyclone Spiral. Sequence: moveRight → moveUp → attack (→ ↑ A). Cost: 15. Type: attack. → v_orbital = 1.050 m/s; ↑ bowl-wall 45° launch: h = 5.62 cm; A descent v_impact = 1.485 m/s → J = 3.673×10⁻² N·s; Semi-Flat RC metal rebound Δω = +18 rad/s (η = 0.28); dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Phase-locked dual Rankine vortex (Case 1919)

---

### [Case 1922 — Blizzard Orthrus 145D (Metal Fury) — Dual-Spin Crystalline Freeze Ring](./15%20case%20study.md#case-1922)

**System**: MFB / Metal Fury 4D  
**Geometry**: Orthrus ER: r = 3.8 cm (crystalline ridges), 3.5 g; Blizzard FW: 2 blades, r = 3.5 cm, 28.5 g; 145 track: 4.0 g; D tip: r = 0.4 cm, μ_standard = 0.08, μ_freeze = 0.13; I_total = 4.044×10⁻⁵ kg·m²; m_total = 40.0 g; ω₀ = 600 rad/s  
**Mechanism**: v_tip = 21.00 m/s; F_blade_total = 3.894×10⁻² N (2 blades). Freeze aura: μ_D_freeze = 0.13; τ_D_freeze = 2.043×10⁻⁴ N·m; t_spin = 119 s. Freeze doubles opponent tip friction upon contact.  
**Gimmick**: Dual blade contact + freeze-aura friction amplification → MechanicRegistry: freeze_drain / blade_contact

---

### [Case 1923 — Blizzard Orthrus 145D — Twin Spire](./15%20case%20study.md#case-1923)

**System**: MFB / Metal Fury 4D  
**Blader**: Gordo  
**Special Move**: Twin Spire — freeze-drain blade contact + tip immobilization: v_rel = 3.00 m/s; J_twinspire = 1.005×10⁻¹ N·s → Δv_opp = 2.645 m/s; freeze drain Δω_opp = 34.7 rad/s (0.8 s dwell, μ_opp×2). Δω_O = 86.9 rad/s (85.5% retained). [M] dual Orthrus ice-twin spirits ×7.0 → Δv = 18.5 m/s (glacial prison). powerCost 100.  
**Compatible beys**: High-mass FW (≥ 26 g, dual blade r ≥ 3.3 cm) + D/low-friction tip (μ ≤ 0.15) + crystalline ER for freeze stiction; standard: Blizzard Orthrus 145D (Gordo, Metal Fury)

---

### [Case 1924 — Blizzard Orthrus 145D — Ice Spire Lock](./15%20case%20study.md#case-1924)

**System**: MFB / Metal Fury 4D  
**Mechanism**: COMBO — Ice Spire Lock. Sequence: defense → attack → defense (K A K). Cost: 15. Type: stamina. K₁ freeze-aura blade posture; A twin-blade smash at v_rel = 2.55 m/s → J = 8.549×10⁻² N·s; K₂ freeze-lock dwell Δω_own = +1 rad/s (D-tip μ_freeze = 0.13, t = 0.15 s); dmgMult 1.20×; lockMs 150 (freeze-lock dwell). dmgMult 1.20× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Dual blade + freeze-aura (Case 1922)

---

### [Case 1925 — Rapid Eagle H145F (Metal Masters) — Dual Saber-Blade Aerial Dive](./15%20case%20study.md#case-1925)

**System**: MFB / Metal Masters  
**Geometry**: Rapid FW: 2 saber blades (C_L = 0.70, A_saber = 1.0×10⁻⁴ m²), r = 3.3 cm, 24.0 g; Eagle ER: r = 3.7 cm, 3.5 g; H145: 3.5 g; F tip: r = 0.3 cm, μ = 0.40; I_total = 3.131×10⁻⁵ kg·m²; m_total = 34.5 g; ω₀ = 630 rad/s  
**Mechanism**: F_lift_saber = 3.714×10⁻² N (11% of weight); g_eff = 8.733 m/s²; bowl-wall launch (55°): v_z = 1.080 m/s; h_apex = 6.68 cm; v_descent = 1.145 m/s; v_impact = 1.372 m/s. τ_F = 4.073×10⁻⁴ N·m; t_spin = 48.4 s.  
**Gimmick**: Dual saber-blade lift (11%) + bowl-wall aerial dive → MechanicRegistry: wing_liftoff / bowl_launch

---

### [Case 1926 — Rapid Eagle H145F — Twin Saber (Killer Eagle)](./15%20case%20study.md#case-1926)

**System**: MFB / Metal Masters  
**Blader**: Claude  
**Special Move**: Twin Saber (also Killer Eagle) — saber lift aerial eagle stoop: h_apex = 6.68 cm; v_impact = 1.372 m/s; J_twinsaber = 4.316×10⁻² N·s → Δv_opp = 1.136 m/s. Δω_E = 45.5 rad/s (92.8% retained). [M] Claude eagle spirit razor-wing stoop ×7.0 → Δv = 7.95 m/s. powerCost 100. Used vs Rock Bison.  
**Compatible beys**: Flat tip (μ ≥ 0.35) + FW with 2+ cambered blades at r ≥ 3.0 cm (F_lift ≥ 0.03 N) + 45–65° bowl wall; standard: Rapid Eagle H145F (Claude, Metal Masters)

---

### [Case 1927 — Rapid Eagle H145F — Eagle Dive Strike](./15%20case%20study.md#case-1927)

**System**: MFB / Metal Masters  
**Mechanism**: COMBO — Eagle Dive Strike. Sequence: moveUp → dodge → attack (↑ E A). Cost: 15. Type: attack. ↑ partial ascent h = 2.02 cm; E banking arc; A partial saber dive v_impact = 0.755 m/s → J = 2.374×10⁻² N·s; saber edge rebound Δω = +6 rad/s (η = 0.25); dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Dual saber lift + bowl aerial dive (Case 1925)

---

### [Case 1928 — Z Achilles 11 Xtend+ (Burst Cho-Z) — Turbo Awakening Dual-Blade Extension](./15%20case%20study.md#case-1928)

**System**: Burst / Cho-Z (Burst Turbo)  
**Geometry**: Z Achilles layer: r_base = 3.3 cm, r_turbo = 3.7 cm (+4 mm deployment), 24.5 g; 11 disc: r = 2.6 cm, 12.0 g; Xtend+ driver: r = 0.5 cm, μ = 0.30; I_total = 3.654×10⁻⁵ kg·m²; m_total = 41.0 g; ω₀ = 580 rad/s  
**Mechanism**: Turbo Awakening: v_tip_turbo = 21.46 m/s (+12.1% vs 19.14 m/s retracted); Δv_tip = 2.32 m/s. v_contact = 2.65 m/s (vs right-spin opp at 570 rad/s). Burst Stopper: blades block Disc Stoppers preventing burst. τ_Xt = 6.031×10⁻⁴ N·m; t_spin = 35.2 s.  
**Gimmick**: Turbo Awakening blade deployment (+12.1% tip speed) + Burst Stopper → MechanicRegistry: turbo_awakening / burst_stopper

---

### [Case 1929 — Z Achilles / Turbo Achilles — Turbo Whip (Super Z Slash)](./15%20case%20study.md#case-1929)

**System**: Burst / Cho-Z  
**Blader**: Aiger Akabane  
**Special Move**: Turbo Whip (JP: Super Z Slash) — Turbo Awakening head-on dual-blade slash: v_contact = 2.65 m/s; J_turbowhip = 8.694×10⁻² N·s → Δv_opp = 2.174 m/s; Δω_Z = 88.0 rad/s (84.8% retained — Burst Stopper prevents burst). [M] Achilles Cho-Z Z-power ×7.5 → Δv = 16.3 m/s. powerCost 100. Upgraded from Z Whip; first used Champion Carnival. Also compatible with Turbo Achilles 00 Dimension.  
**Compatible beys**: Burst-era layer with deployable Turbo Blades (r_base ≥ 3.0 cm → r_turbo ≥ 3.4 cm) + Burst Stopper function; standard: Z Achilles 11 Xtend+ / Turbo Achilles 00 Dimension (Aiger Akabane, Burst Turbo)

---

### [Case 1930 — Z Achilles / Turbo Achilles — Z Slash Drive](./15%20case%20study.md#case-1930)

**System**: Burst / Cho-Z  
**Mechanism**: COMBO — Z Slash Drive. Sequence: moveRight → moveRight → attack (→ → A). Cost: 15. Type: attack. →→ double-dash: v_charge = 1.40 × 0.870 = 1.218 m/s; A dual-blade contact v_contact = 2.00 m/s → J = 6.561×10⁻² N·s; Burst Stopper rebound Δω = +13 rad/s (η_bs = 0.20); dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Turbo Awakening blade extension + Burst Stopper (Case 1928)

---

### [Case 1931 — Turbo Valtryek Z.Ev (Burst Cho-Z) — Wall-Rebound Turbo Awakening Launch](./15%20case%20study.md#case-1931)

**System**: Burst / Cho-Z (Burst Turbo)  
**Geometry**: Turbo Valtryek layer: r = 3.3 cm, 22.0 g; Z disc: r = 2.5 cm, 11.0 g; Evolve driver: r = 0.6 cm, μ_Ev = 0.15, 4.0 g; I_total = 3.098×10⁻⁵ kg·m²; m_total = 37.0 g; ω₀ = 580 rad/s  
**Mechanism**: Evolve free-spin tip τ = 3.264×10⁻⁴ N·m → t_spin = 55.1 s. v_orbital = 0.522 m/s + v_charge = 0.600 → v_approach = 1.122 m/s. Bowl wall rebound θ=55°, e_wall=0.87: v_post = 1.027 m/s. Turbo Awakening snap η=0.20 → v_snap = 0.464 m/s. v_total = 1.491 m/s.  
**Gimmick**: Bowl-wall elastic rebound + Turbo Awakening snap → MechanicRegistry: wall_rebound / turbo_awakening

---

### [Case 1932 — Valt Aoi / Turbo Valtryek — Turbo Winged Launch (Super Jet Shoot)](./15%20case%20study.md#case-1932)

**System**: Burst / Cho-Z  
**Blader**: Valt Aoi  
**Special Move**: Turbo Winged Launch (JP: Super Jet Shoot) — wall rebound e_wall=0.87 v_post=1.027 + Turbo snap v_snap=0.464 → v_total=1.491 m/s; m_eff=1.922×10⁻² kg; J=4.728×10⁻² N·s → Δv_opp=1.182 m/s; Δω_V=56.5 rad/s (90.3% retained). [M] Valt wing-spirit ×8.0 → Δv=9.46 m/s. powerCost 100.  
**Compatible beys**: Burst-era layer with Turbo Awakening (Δr ≥ 3 mm at ω₀ ≥ 550 rad/s) + free-spin driver (μ ≤ 0.20, r ≥ 5 mm) + hard-wall stadium (e_wall ≥ 0.80); standard: Turbo Valtryek Z.Ev (Valt Aoi, Burst Turbo)

---

### [Case 1933 — Valt Aoi / Turbo Valtryek — Zenith Rebound Strike](./15%20case%20study.md#case-1933)

**System**: Burst / Cho-Z  
**Mechanism**: COMBO — Zenith Rebound Strike. Sequence: moveRight → moveUp → attack (→ ↑ A). Cost: 15. Type: attack. Partial wall-rebound approach: v_total_partial=1.044 m/s → J=3.311×10⁻² N·s; Turbo Blade recoil Δω=+12 rad/s (η_turboblade=0.30); dmgMult 1.25×; lockMs 0. dmgMult 1.25× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Wall-rebound Turbo Awakening (Case 1931)

---

### [Case 1934 — Turbo Spryzen 0Wall Zeta' (Burst Cho-Z) — Left-Spin Defense + Zeta' Reversal Upper Strike](./15%20case%20study.md#case-1934)

**System**: Burst / Cho-Z (Burst Turbo)  
**Geometry**: Turbo Spryzen layer: r = 3.4 cm, 23.0 g; 0 disc: r = 2.3 cm, 9.5 g; Wall frame: r = 2.9 cm, 3.5 g; Zeta' driver: r = 0.5 cm, μ = 0.35, 5.0 g; I_total = 3.468×10⁻⁵ kg·m²; m_total = 41.0 g; ω₀ = 580 rad/s (left-spin)  
**Mechanism**: Zeta' clutch reversal pulse ω_pulse=100 rad/s → v_driver_reversal=0.500 m/s. v_orbital=1.015 + v_reversal=0.500 → v_total=1.515 m/s. Upper-attack α=25°: v_H=1.373, v_V=0.641 m/s. τ_Zeta=7.038×10⁻⁴ N·m; t_spin=28.6 s.  
**Gimmick**: Zeta' spin-reversal clutch + upper-angled contact (α=25°) → MechanicRegistry: spin_reversal / upper_attack

---

### [Case 1935 — Shu Kurenai / Turbo Spryzen — Turbo Upper Launch (Super Upper Shoot)](./15%20case%20study.md#case-1935)

**System**: Burst / Cho-Z  
**Blader**: Shu Kurenai  
**Special Move**: Turbo Upper Launch (JP: Super Upper Shoot) — Zeta' reversal v_total=1.515 m/s, α_upper=25°; m_eff=2.025×10⁻² kg; J=5.063×10⁻² N·s → Δv=1.266 m/s (H=1.147 + V=0.535); Δω_S=49.6 rad/s (91.5% retained). [M] Shu dual-spin spirit ×8.0 → Δv=10.1 m/s pillar-of-fire ring-out. powerCost 100.  
**Compatible beys**: Burst-era Zeta'/clutch-reversal driver (ω_pulse ≥ 80 rad/s) + Turbo Awakening layer with α_upper ≥ 20° CPs + wide Frame (r ≥ 2.6 cm); standard: Turbo Spryzen 0Wall Zeta' (Shu Kurenai, Burst Turbo)

---

### [Case 1936 — Shu Kurenai / Turbo Spryzen — Spryzen Upper Guard](./15%20case%20study.md#case-1936)

**System**: Burst / Cho-Z  
**Mechanism**: COMBO — Spryzen Upper Guard. Sequence: moveUp → defense → attack (↑ K A). Cost: 15. Type: attack. Partial Zeta' reversal upper: v_partial=0.985 m/s → J=3.291×10⁻² N·s; 0Wall frame recoil Δω=+8 rad/s (η_0Wall=0.25); dmgMult 1.20×; lockMs 100. dmgMult 1.20× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Zeta' reversal upper + 0Wall guard (Case 1934)

---

### [Case 1937 — Turbo Achilles 00 Dimension (Burst Cho-Z) — Single Turbo Blade Undercut](./15%20case%20study.md#case-1937)

**System**: Burst / Cho-Z (Burst Turbo)  
**Geometry**: Turbo Achilles layer: r = 3.4 cm, 24.5 g; 00 disc: r = 2.7 cm, 14.0 g; Dimension driver: r = 0.5 cm, μ = 0.35, 5.0 g; I_total = 3.865×10⁻⁵ kg·m²; m_total = 43.5 g; ω₀ = 580 rad/s  
**Mechanism**: Turbo Awakening to r_turbo=3.7 cm → v_tip_turbo=21.46 m/s. v_rel=2.65 m/s vs right-spin opp. Single-blade undercut α=30°: v_H=2.295, v_V=1.325 m/s. τ_Dim=7.463×10⁻⁴ N·m; t_spin=30.0 s. 00 disc (14.0 g) highest Cho-Z forged disc.  
**Gimmick**: Single Turbo Blade undercut (α=30°) → MechanicRegistry: turbo_awakening / upper_attack

---

### [Case 1938 — Aiger Akabane / Turbo Achilles 00 Dimension — Turbo Upper (Super Z Upper)](./15%20case%20study.md#case-1938)

**System**: Burst / Cho-Z  
**Blader**: Aiger Akabane  
**Special Move**: Turbo Upper (JP: Super Z Upper) — single blade undercut α=30°; v_rel=2.65 m/s; m_eff=2.084×10⁻² kg; J=8.947×10⁻² N·s → Δv=2.237 m/s (H=1.937 + V=1.119); Δω_A=85.6 rad/s (85.2% retained — Burst Stopper prevents burst). [M] Aiger Z-power lance ×7.5 → Δv=16.8 m/s. powerCost 100.  
**Compatible beys**: Burst Turbo Awakening layer with single deployable blade (r_turbo ≥ 3.4 cm) + heavy disc (≥ 12 g, r ≥ 2.5 cm) + sufficient blader sync; standard: Turbo Achilles 00 Dimension (Aiger Akabane, Burst Turbo)

---

### [Case 1939 — Aiger Akabane / Turbo Achilles 00 Dimension — Achilles Upper Drive](./15%20case%20study.md#case-1939)

**System**: Burst / Cho-Z  
**Mechanism**: COMBO — Achilles Upper Drive. Sequence: moveDown → moveUp → attack (↓ ↑ A). Cost: 15. Type: attack. Partial single-blade undercut: v_rel_partial=1.855 m/s → J=6.262×10⁻² N·s; Burst Stopper recoil Δω=+12 rad/s (η_bs=0.20); dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Single Turbo Blade undercut (Case 1937)

---

### [Case 1940 — Turbo Achilles 00 Dimension — Burst Stopper Blade Power Channeling](./15%20case%20study.md#case-1940)

**System**: Burst / Cho-Z (Burst Turbo)  
**Geometry**: See Case 1937 (m=43.5 g, I=3.865×10⁻⁵ kg·m², ω₀=580 rad/s)  
**Mechanism**: Burst Stopper blade L=1.2 cm, w=0.4 cm; t_blade_pass=4.5 ms at v_rel=2.65 m/s. BeySpirit pre-contact sync pulse ω_boost=+10 rad/s → ω_sword=590 rad/s → v_tip_sword=21.83 m/s → v_rel_sword=3.02 m/s (+14% vs standard 2.65 m/s). Power channeling increases blade contact by Δv_rel=0.37 m/s.  
**Gimmick**: Pre-contact spin boost + extended blade arc contact (4.5 ms) → MechanicRegistry: power_channel / blade_strike

---

### [Case 1941 — Aiger Akabane / Turbo Achilles 00 Dimension — Turbo Sword (Super Z Sword)](./15%20case%20study.md#case-1941)

**System**: Burst / Cho-Z  
**Blader**: Aiger Akabane  
**Special Move**: Turbo Sword (JP: Super Z Sword) — power-channel ω_boost=10 rad/s → v_rel_sword=3.02 m/s; blade arc=4.5 ms; m_eff=2.084×10⁻² kg; J=1.020×10⁻¹ N·s → Δv=2.550 m/s; Δω_A=97.7 rad/s (83.2% retained — Burst Stopper prevents burst). [M] Aiger power-channeled longsword ×7.5 → Δv=19.1 m/s. powerCost 100.  
**Compatible beys**: Burst Turbo Awakening layer with long Burst Stopper blades (L ≥ 1.0 cm, r_turbo ≥ 3.4 cm) + sync-pulse boost capability + heavy disc (≥ 12 g); standard: Turbo Achilles 00 Dimension (Aiger Akabane, Burst Turbo)

---

### [Case 1942 — Aiger Akabane / Turbo Achilles 00 Dimension — Z Sword Cross](./15%20case%20study.md#case-1942)

**System**: Burst / Cho-Z  
**Mechanism**: COMBO — Z Sword Cross. Sequence: moveRight → moveLeft → attack (→ ← A). Cost: 15. Type: attack. Lateral direction-reversal momentum: v_lateral_reversal=1.435 m/s combined with v_rel_sword=3.02 → v_contact=2.228 m/s → J=7.522×10⁻² N·s; Burst Stopper recoil Δω=+14 rad/s (η_bs=0.20); dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Power-channeled blade strike (Case 1940)

---

### [Case 1943 — Z Achilles 11 Xtend+ — Gyroscopic Shield + Combined Crush Approach](./15%20case%20study.md#case-1943)

**System**: Burst / Cho-Z (Burst Turbo)  
**Geometry**: See Case 1928 (m=41.0 g, I=3.654×10⁻⁵ kg·m², ω₀=580 rad/s, r_turbo=3.7 cm)  
**Mechanism**: Gyroscopic rigidity G_gyro=I×ω₀²=12.29 N·m; F_threshold=1.211 N — below threshold hits fully deflected. Combined crush: v_orbital=0.870 m/s (μ_Xt=0.30) + v_rel_blades=2.65 → v_crush_total=3.52 m/s.  
**Gimmick**: Gyroscopic shield (precession deflection) + orbital+blade crush approach → MechanicRegistry: gyro_shield / crush_attack

---

### [Case 1944 — Aiger Akabane / Z Achilles 11 Xtend+ — Turbo Crush (Super Z Press)](./15%20case%20study.md#case-1944)

**System**: Burst / Cho-Z  
**Blader**: Aiger Akabane  
**Special Move**: Turbo Crush (JP: Super Z Press) — gyro shield G=12.29 N·m → v_crush_total=3.52 m/s; m_eff=2.025×10⁻² kg; e=0.55; J=1.105×10⁻¹ N·s → Δv=2.763 m/s; Δω_Z=111.9 rad/s (80.7% retained — Burst Stopper prevents burst). [M] Aiger shield-fortress crush ×7.5 → Δv=20.7 m/s. powerCost 100.  
**Compatible beys**: Burst-era variable-height driver (Xtend+ defense height) + Turbo Awakening layer + blader able to sustain gyro shield before crush; standard: Z Achilles 11 Xtend+ (Aiger Akabane, Burst Turbo)

---

### [Case 1945 — Aiger Akabane / Z Achilles 11 Xtend+ — Achilles Press](./15%20case%20study.md#case-1945)

**System**: Burst / Cho-Z  
**Mechanism**: COMBO — Achilles Press. Sequence: defense → defense → attack (K K A). Cost: 15. Type: attack. KK shield phase: gyroscopic spin retention → v_crush_partial=2.288 m/s → J=7.181×10⁻² N·s; Δω=+11 rad/s (η_gyro=0.15); dmgMult 1.35×; lockMs 50. dmgMult 1.35× ≤ 1.5 ✓; lockMs 50 ≤ 300 ✓.  
**Gimmick**: Parent: Gyroscopic shield + crush approach (Case 1943)

---

### [Case 1946 — Triumph Dragon Charge Metal 1A (Burst Sparking) — Triumph Ring Spring-Blade Awakening](./15%20case%20study.md#case-1946)

**System**: Burst / Sparking (Burst Surge)  
**Geometry**: Triumph Dragon blade (with Triumph Ring): r = 3.2 cm, 45.0 g; 1A ratchet: r = 2.2 cm, 22.0 g; Charge Metal bit: r = 0.6 cm, 10.9 g; I_total = 5.712×10⁻⁵ kg·m²; m_total = 77.9 g; ω₀ = 700 rad/s  
**Mechanism**: Triumph Ring carries 3 spring blades (k=100 N/m, x=6 mm each → PE=1.800×10⁻³ J per blade; PE_total=5.400×10⁻³ J). Deployment v_spring_eff=0.368 m/s (η=0.75). Awakened v_tip=22.40 m/s; v_rel_blade=3.08 vs opp → v_contact=3.448 m/s. τ_CM=1.375×10⁻³ N·m; t_spin=29.1 s. Mass 77.9 g = 1.84× heavier than std Sparking.  
**Gimmick**: Spring-blade Awakening deployment + mass-amplified contact → MechanicRegistry: spring_blade / awakening

---

### [Case 1947 — Dante Koryu / Triumph Dragon — Triumph Break (Tempest Break)](./15%20case%20study.md#case-1947)

**System**: Burst / Sparking  
**Blader**: Dante Koryu  
**Special Move**: Triumph Break (JP: Tempest Break) — Awakened spring blades PE=5.400×10⁻³ J, v_spring=0.368 m/s; v_contact=3.448 m/s; m_eff=2.643×10⁻² kg; J=1.503×10⁻¹ N·s → Δv=3.758 m/s; Δω_D=84.2 rad/s (88.0% retained). [M] Dante tempest-wing eruption ×7.5 → Δv=28.2 m/s. powerCost 100.  
**Compatible beys**: Burst Sparking layer with 3+ spring blades (PE ≥ 1.0×10⁻³ J each, r ≥ 2.8 cm) + Ratchet+Bit ≥ 30 g mass; standard: Triumph Dragon Charge Metal 1A (Dante Koryu, Burst Surge)

---

### [Case 1948 — Dante Koryu / Triumph Dragon — Triumph Guard](./15%20case%20study.md#case-1948)

**System**: Burst / Sparking  
**Mechanism**: COMBO — Triumph Guard. Sequence: jump → attack → defense (J A K). Cost: 15. Type: attack. Partial Awakened spring-blade: v_partial=2.241 m/s → J=9.773×10⁻² N·s; spring-guard blade-fold Δω=+8 rad/s (η_spring=0.15); dmgMult 1.35×; lockMs 100. dmgMult 1.35× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Triumph Ring spring-blade Awakening (Case 1946)

---

### [Case 1949 — Curse Satomb Hurricane Universe 1D (Burst Sparking) — Three-Ring Deflection System](./15%20case%20study.md#case-1949)

**System**: Burst / Sparking (Burst Surge)  
**Geometry**: SK Chip: r=0.4 cm, 2.9 g; Curse Ring (3 rubber rollers): r=3.0 cm, 8.6 g; 1D chassis: r=2.0 cm, 11.4 g; Hurricane disc (free-spin): r=2.8 cm, 9.5 g; Universe bit: r=0.5 cm, 8.7 g; I_total=1.999×10⁻⁵ kg·m²; m=41.1 g; ω₀=700 rad/s  
**Mechanism**: Layer 1 — Curse Ring 3 rubber rollers (r=3.0 cm, e_roller=0.30, η_roller=0.40). Layer 2 — Hurricane Disc free-spin decoupling η_decouple=0.65 (absorbs 65% tangential impulse). Layer 3 — Universe Driver curved deflection β=35°: v_def_normal=0.819×v_in, v_def_tan=0.574×v_in (attacker redirected outward).  
**Gimmick**: Three-layer defense (roller spin-transfer + free-spin decoupling + curved deflection) → MechanicRegistry: roller_absorb / free_spin / curved_deflect

---

### [Case 1950 — Silas Karlisle / Curse Satomb — Triple Spin (Triple Twister)](./15%20case%20study.md#case-1950)

**System**: Burst / Sparking  
**Blader**: Silas Karlisle  
**Special Move**: Triple Spin (JP: Triple Twister) — 3-ring defense: v_rel=1.68 m/s; J_roller=4.427×10⁻² N·s (e=0.30); Δω_Satomb=+26.6 rad/s spin gain; F_redirect=5.082 N; Δv_att=0.906 m/s at β=35°. Hurricane disc η_decouple=0.65 absorbs 2.878×10⁻² N·s. [M] Silas triple-ring deflection ×6.5 → Δv_att=5.89 m/s. powerCost 100.  
**Compatible beys**: Burst-era blade with ≥3 free-spinning rubber rollers (r ≥ 2.8 cm) + free-spinning disc (η_decouple ≥ 0.50) + curved-edge driver (β ≥ 25°); standard: Curse Satomb Hurricane Universe 1D (Silas Karlisle, Burst Surge)

---

### [Case 1951 — Silas Karlisle / Curse Satomb — Satomb Reflect](./15%20case%20study.md#case-1951)

**System**: Burst / Sparking  
**Mechanism**: COMBO — Satomb Reflect. Sequence: defense → attack → defense (K A K). Cost: 15. Type: defense. Roller reflect: v_combo=1.008 m/s → J=2.656×10⁻² N·s; Hurricane disc Δω=+8 rad/s (η_decouple=0.20); dmgMult 1.25×; lockMs 150. dmgMult 1.25× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Three-ring deflection system (Case 1949)

---

### [Case 1952 — Rock Orso D125B ×3 (MFB) — Coordinated Three-Bear Surround Push](./15%20case%20study.md#case-1952)

**System**: Metal Fusion (MFB)  
**Geometry**: Rock FW: r=2.9 cm, 30.0 g; Orso ER: r=3.3 cm, 7.0 g; D125 ST: r=1.5 cm; B tip: r=0.1 cm, μ_B=0.05; I_single=3.388×10⁻⁵ kg·m²; m=46.0 g; ω₀=580 rad/s  
**Mechanism**: 3 Orso beys at 120° spacing, r_surround=80 mm. v_per_bey=0.028+0.25=0.28 m/s (Ball wander + blader guidance). m_eff_each=2.140×10⁻² kg; e=0.55; J_per_hit=9.288×10⁻³ N·s; J_total=3×=2.786×10⁻² N·s → Δv_opp=0.697 m/s net toward nearest wall.  
**Gimmick**: Coordinated 3-bey surround at 120° → net radial push geometry → MechanicRegistry: multi_bey_surround

---

### [Case 1953 — Kumade Brothers / Rock Orso D125B ×3 — Triple Orso Step](./15%20case%20study.md#case-1953)

**System**: Metal Fusion (MFB)  
**Bladers**: Kumasuke, Kumata, Kumaji Kumade (joint special)  
**Special Move**: Triple Orso Step — 3-bey surround J_total=2.786×10⁻² N·s; 2 push cycles (η_push=0.80): Δv_1=0.557 + Δv_2=0.390 → Δv_total=0.947 m/s > ring-out escape threshold 0.60 m/s. [M] three bear-spirits ×5.5 → Δv=5.21 m/s. powerCost 100. Joint move — requires all 3 brothers' beys simultaneously. First used vs Tsubasa Earth Eagle 145WD.  
**Compatible beys**: MFB wide flat-contact FW (r_CoM ≥ 2.7 cm) + Ball/wandering tip (μ ≤ 0.10) in 3-bey 120° formation; standard: Rock Orso D125B ×3 (Kumade brothers, Metal Fusion). Joint move.

---

### [Case 1954 — Kumade Brothers / Rock Orso D125B — Orso Triangle](./15%20case%20study.md#case-1954)

**System**: Metal Fusion (MFB)  
**Mechanism**: COMBO — Orso Triangle. Sequence: moveRight → moveUp → moveLeft (→ ↑ ←). Cost: 15. Type: attack. Triangular arc: v_arc_bonus=0.0503 m/s; v_contact=0.300 m/s → J=9.951×10⁻³ N·s; Ball orbital Δω≈+1 rad/s minimum; dmgMult 1.20×; lockMs 0. dmgMult 1.20× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Three-bear surround geometry (Case 1952)

---

### [Case 1955 — Blade Sharks Formation (Plastic Gen) — Triangle Attack Geometry](./15%20case%20study.md#case-1955)

**System**: Plastic Generation (Bakuten Shoot / G-Revolution)  
**Geometry**: Representative sharp-attack bey: AR r=3.5 cm, 9.0 g; WD r=2.6 cm, 14.0 g; Flat Base r=0.2 cm, μ_flat=0.70; I_single=2.097×10⁻⁵ kg·m²; m=35.0 g; ω₀=500 rad/s  
**Mechanism**: 3 beys equilateral triangle, r_formation=70 mm, θ=90°/210°/330°. Flat Base v_attack=0.700 m/s. e_sharp=0.70; J_per_hit=2.222×10⁻² N·s; J_triangle=3×=6.666×10⁻² N·s → Δv_opp=1.667 m/s net radial.  
**Gimmick**: Coordinated 3-bey triangle simultaneous strike → MechanicRegistry: multi_bey_triangle

---

### [Case 1956 — Blade Sharks ×3 — Triangle Attack](./15%20case%20study.md#case-1956)

**System**: Plastic Generation  
**Bladers**: Blade Sharks gang members (3, joint special)  
**Special Move**: Triangle Attack — 3-bey simultaneous three-point strike J_triangle=6.666×10⁻² N·s; at 30mm offset: J_net=5.999×10⁻² N·s → Δv_net=1.500 m/s. Each bey Δω=37.1 rad/s drain (92.6% retained). [M] Blade Sharks predator shark-spirit ×4.5 → Δv=6.75 m/s. powerCost 100. Joint move — requires all 3 beys simultaneously. First used vs Tsubasa Earth Eagle.  
**Compatible beys**: Plastic-gen sharp/wide AR (r ≥ 3.2 cm, e ≥ 0.60) + Flat Base (μ ≥ 0.50) in 3-bey triangle formation; standard: Blade Sharks attack-type beys ×3 (Blade Sharks gang, Bakuten Shoot). Joint move.

---

### [Case 1957 — Blade Sharks / Plastic Attack Bey — Shark Triangle](./15%20case%20study.md#case-1957)

**System**: Plastic Generation  
**Mechanism**: COMBO — Shark Triangle. Sequence: moveUp → moveDown → attack (↑ ↓ A). Cost: 15. Type: attack. Feint-snap: v_approach=0.700 + v_pullback=0.350 → v_snap=1.050 m/s → J=3.333×10⁻² N·s; Flat Base Δω≈+3 rad/s (η_flat=0.05); dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Triangle formation geometry (Case 1955)

---

### [Case 1958 — Mad Gasher CH120FS (MFB) — CH Track Height-Change Mechanism](./15%20case%20study.md#case-1958)

**System**: Metal Fusion (MFB)  
**Geometry**: Mad FW: r=2.9 cm, 29.0 g; Gasher ER: r=3.3 cm, 7.0 g; CH120 ST: r=1.5 cm, 5.0 g; FS tip: r=0.15 cm, μ_flat=0.50 (high spin) / μ_sharp=0.05 (low spin); I_total=3.315×10⁻⁵ kg·m²; m=45.5 g; ω₀=580 rad/s  
**Mechanism**: CH120 telescopes 120 mm→145 mm (Δh=2.5 cm). ΔPE=1.116×10⁻² J → v_drop=0.700 m/s (φ=40.7°: v_lat=0.531, v_vert=0.457 m/s). Contact height shifts 80mm→105mm. τ_flat=3.347×10⁻⁴ N·m; t_spin=57.4 s. Only other known MFB height-change tracks: TH170 (Beat Lynceus); Burst-era: Dimension driver.  
**Gimmick**: CH height-drop → additional contact velocity (v_lat stacks on blade contact) → MechanicRegistry: height_change / drop_strike

---

### [Case 1959 — Tetsuya Watarigani / Mad Gasher — Track Change](./15%20case%20study.md#case-1959)

**System**: Metal Fusion (MFB)  
**Blader**: Tetsuya Watarigani  
**Special Move**: Track Change — CH120→145 Δh=2.5 cm, v_drop=0.700 m/s, φ=40.7° → v_lat=0.531 m/s; v_contact=2.04+0.531=2.571 m/s; m_eff=2.129×10⁻² kg; e=0.60; J=8.759×10⁻² N·s → Δv=2.190 m/s (+v_vert=0.457 upward); Δω_MG=87.1 rad/s (85.0% retained). [M] Tetsuya crab height-drop claw ×6.0 → Δv=13.1 m/s. powerCost 100. IRL requires assembly mode-change; in-game fires instantaneously. Used vs Gingka and vs Kyoya. Known height-change move alongside TH170/Beat Lynceus (Metal Fury).  
**Compatible beys**: MFB height-change ST (CH120, CH145, or TH170, Δh≥20mm) + wide-face FW (r ≥ 2.6 cm, e ≥ 0.50); standard: Mad Gasher CH120FS (Tetsuya Watarigani, Metal Fusion)

---

### [Case 1960 — Tetsuya Watarigani / Mad Gasher — Track Drop](./15%20case%20study.md#case-1960)

**System**: Metal Fusion (MFB)  
**Mechanism**: COMBO — Track Drop. Sequence: moveDown → attack → moveDown (↓ A ↓). Cost: 15. Type: attack. Mid-drop at 65% travel: v_drop_combo=0.455 m/s → v_contact=2.385 m/s → J=8.124×10⁻² N·s; CH retraction spring-back Δω=+8 rad/s (η_CH=0.10); dmgMult 1.25×; lockMs 50. dmgMult 1.25× ≤ 1.5 ✓; lockMs 50 ≤ 300 ✓.  
**Gimmick**: Parent: CH height-drop mechanism (Case 1958)

---

### [Case 1961 — Storm Pegasus 105RF (MFB) — RF Orbital Vortex Generation](./15%20case%20study.md#case-1961)

**System**: Metal Fusion (MFB)  
**Geometry**: Storm FW: r=2.9 cm, 28.0 g; Pegasus ER: r=3.3 cm, 7.0 g; 105 ST: r=1.2 cm; RF tip: r=0.2 cm, μ_RF=0.85; I_total=3.162×10⁻⁵ kg·m²; m=43.0 g; ω₀=580 rad/s  
**Mechanism**: RF orbital: v_orbital=0.986 m/s; r_orbit=35.0 cm; t_orbit=2.230 s. Rankine vortex: r_c=2.9 cm, v_core=16.82 m/s, Γ=3.063 m²/s; v_wind=2.437 m/s at r=20.0 cm. F_drag=4.834×10⁻³ N; J_wind=9.668×10⁻³ N·s over 2 orbits.  
**Gimmick**: Rankine vortex from Storm Wheel + RF orbital drive → MechanicRegistry: rankine_vortex / orbital_drive

---

### [Case 1962 — Gingka Hagane / Storm Pegasus — Tornado Wing](./15%20case%20study.md#case-1962)

**System**: Metal Fusion (MFB)  
**Blader**: Gingka Hagane  
**Special Move**: Tornado Wing (JP: Tornado Wing) — two-phase: wind sweep J_wind=9.668×10⁻³ N·s (Γ=3.063 m²/s, 2 orbits) + RF ejection J_eject=3.779×10⁻² N·s (e_RF=0.85, v_orbital=0.986 m/s); J_total=4.746×10⁻² N·s → Δv=1.186 m/s; Δω_P=34.7 rad/s (94.0% retained). [M] Gingka Pegasus storm spirit ×8.0 → Δv=9.49 m/s. powerCost 100. Predecessor of Storm Bringer (lower J). Used vs Tetsuya (ep "Vengeful Gasher") and vs Yu (Battle Bladers R1).  
**Compatible beys**: MFB Storm FW (r ≥ 2.7 cm) + RF/rubber-flat tip (μ ≥ 0.75, v_orbital ≥ 0.90 m/s) → Γ ≥ 2.5 m²/s; standard: Storm Pegasus 105RF (Gingka Hagane, Metal Fusion)

---

### [Case 1963 — Gingka Hagane / Storm Pegasus — Tornado Circuit](./15%20case%20study.md#case-1963)

**System**: Metal Fusion (MFB)  
**Mechanism**: COMBO — Tornado Circuit. Sequence: moveUp → attack → moveDown (↑ A ↓). Cost: 15. Type: attack. Arc peak +50%: v_arc_peak=1.479 m/s; v_contact=0.961 m/s → J=3.683×10⁻² N·s; RF arc-rebound Δω=+3 rad/s (η_RF=0.10); dmgMult 1.25×; lockMs 100. dmgMult 1.25× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: RF orbital vortex (Case 1961)

---

### [Case 1964 — Driger V + Dragoon V (Plastic Gen) — Joint Tornado + Claw Mechanism](./15%20case%20study.md#case-1964)

**System**: Plastic Generation (Bakuten Shoot / V-Force manga)  
**Geometry**: Driger V: Fang Tiger AR r=3.5 cm 8.5 g; WD r=2.6 cm 14.0 g; I_Driger=2.043×10⁻⁵ kg·m², m=34.0 g. Dragoon V: Upper Dragon AR r=3.3 cm 7.5 g; WD r=2.6 cm 14.0 g; I_Dragoon=1.815×10⁻⁵ kg·m², m=32.5 g. Both ω₀=500 rad/s  
**Mechanism**: Dragoon V tornado: Γ=3.420 m²/s; v_wind=2.720 m/s at r=20.0 cm; F_drag=6.023×10⁻³ N; J_wind=6.023×10⁻³ N·s (1 orbit). Driger V claw through vortex: v_rel_claw=2.80 m/s; e_claw=0.68; J_claw=8.646×10⁻² N·s.  
**Gimmick**: Tornado generation (Dragoon V) + claw strike (Driger V) joint mechanism → MechanicRegistry: joint_tornado_claw

---

### [Case 1965 — Ray Kon + Tyson Granger / Driger V + Dragoon V — Tornado Claw](./15%20case%20study.md#case-1965)

**System**: Plastic Generation  
**Bladers**: Ray Kon + Tyson Granger (joint special)  
**Special Move**: Tornado Claw (JP: 竜巻連射爪) — J_wind=6.023×10⁻³+J_claw=8.646×10⁻² → J_total=9.248×10⁻² N·s → Δv=2.312 m/s; Δω_D=148.1 rad/s Driger (70.4%); Dragoon spin mostly preserved. [M] Ray White Tiger + Tyson Blue Dragon dual V-Force spirit ×7.5 → Δv=17.3 m/s. powerCost 100. Manga ch.22 V-Force. Joint move — requires both beys simultaneously.  
**Compatible beys**: Plastic-gen pair: wide-round AR (r ≥ 3.0 cm) for tornado + hard claw AR (r ≥ 3.2 cm, e ≥ 0.60) for strike; standard: Dragoon V (Tyson) + Driger V (Ray), V-Force manga. Joint move.

---

### [Case 1966 — Ray Kon / Driger V — Tornado Claw Circuit](./15%20case%20study.md#case-1966)

**System**: Plastic Generation  
**Mechanism**: COMBO — Tornado Claw Circuit. Sequence: moveLeft → moveRight → attack (← → A). Cost: 15. Type: attack. Cross-whip reversal: v_snap=0.878 m/s → v_contact=0.790 m/s → J=2.440×10⁻² N·s; Fang Tiger claw Δω=+10 rad/s (η_claw=0.13, V-Type Base torque coupling); dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Fang Tiger claw joint mechanism (Case 1964)

---

### [Case 1967 — Dark Bull H145SD (MFB) — Bull-Rush Uppercut Trajectory](./15%20case%20study.md#case-1967)

**System**: Metal Fusion (MFB)  
**Geometry**: Dark FW: r=2.9 cm, 28.0 g; Bull ER: r=3.3 cm, 7.0 g; H145 ST: r=1.5 cm, 4.5 g; SD tip: r=0.1 cm, μ=0.45, 1.0 g; I_total=3.219×10⁻⁵ kg·m²; m=41.5 g; ω₀=580 rad/s  
**Mechanism**: Bull-rush v_rush_total=0.60 m/s (μ_SD=0.45 + guided 0.35 m/s). H145 elevated uppercut α=35°: v_upper=0.856 m/s → J_upper=2.877×10⁻² N·s (J_lat=2.356×10⁻²+J_vert=1.651×10⁻²). Follow-through (Bull stays under opponent): J_follow=8.270×10⁻³ N·s. J_total=3.704×10⁻² N·s → Δv=0.926 m/s. h_apex=8.7 mm.  
**Gimmick**: H145 elevated uppercut + follow-through (distinct from Red Horn Uppercut: Bull tracks opponent upward) → MechanicRegistry: upper_attack / follow_through

---

### [Case 1968 — Benkei Hanawa / Dark Bull — Tornado Bull Uppercut](./15%20case%20study.md#case-1968)

**System**: Metal Fusion (MFB)  
**Blader**: Benkei Hanawa  
**Special Move**: Tornado Bull Uppercut (JP: Tornado Bull Upper) — H145 elevated uppercut α=35°; J_upper=2.877×10⁻²+J_follow=8.270×10⁻³ → J_total=3.704×10⁻² N·s → Δv=0.926 m/s (v_vert=0.413+v_lat=0.589); Δω_B=33.4 rad/s (94.2%). [M] Benkei raging bull follow-through ×7.0 → Δv=6.48 m/s. powerCost 100. Bull stays under opponent (vs Red Horn Uppercut which launches away). Sometimes used in tag-team to boost teammate dive-bomb.  
**Compatible beys**: MFB high ST (H145+, Δh ≥ 45 mm above std) + forward-impact FW (r ≥ 2.7 cm, e ≥ 0.60) + moderate-friction directional tip; standard: Dark Bull H145SD (Benkei Hanawa, Metal Fusion)

---

### [Case 1969 — Benkei Hanawa / Dark Bull — Bull Rocket](./15%20case%20study.md#case-1969)

**System**: Metal Fusion (MFB)  
**Mechanism**: COMBO — Bull Rocket. Sequence: moveDown → moveUp → attack (↓ ↑ A). Cost: 15. Type: attack. Pullback snap: v_pullback=0.261 + arc_bonus=0.157 → v_contact=0.757 m/s → J=2.544×10⁻² N·s; SD directional coupling + H145 leverage Δω=+7 rad/s (η_SD=0.12); dmgMult 1.35×; lockMs 150. dmgMult 1.35× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: H145 uppercut trajectory (Case 1967)

---

### [Case 1970 — Thunder Pegasus 105R²F (Plastic Gen G-Revolution) — Electric Spin Boost Mechanism](./15%20case%20study.md#case-1970)

**System**: Plastic Generation (G-Revolution)  
**Geometry**: Thunder Pegasus AR r=3.3 cm, 7.5 g; Round Heavy WD r=2.4 cm, 14.5 g; R²F BB r=0.2 cm, μ=0.80, 5.0 g; I_total=1.705×10⁻⁵ kg·m²; m=33.0 g; ω₀=500 rad/s  
**Mechanism**: R²F orbital v_R²F=0.800 m/s. Triboelectric accumulation V=2500 V; C=5.014×10⁻¹¹ F; E=1.566×10⁻⁴ J. Electric boost: e_boost=0.125 (e_base=0.65 → e_eff=0.775). J_TLF=2.567×10⁻² N·s → Δv=0.642 m/s.  
**Gimmick**: Rubber-ring triboelectric charge → restitution boost at contact → MechanicRegistry: triboelectric / electric_boost

---

### [Case 1971 — Julia Fernandez / Thunder Pegasus — Toda La Fuerza](./15%20case%20study.md#case-1971)

**System**: Plastic Generation (G-Revolution)  
**Blader**: Julia Fernandez  
**Special Move**: Toda La Fuerza (Spanish: "All the Force") — R²F triboelectric boost e_base=0.65 → e_eff=0.775 (+0.125); J_TLF=2.567×10⁻² N·s → Δv=0.642 m/s; Δω=49.7 rad/s (90.1%). [M] Julia thunder lightning spirit ×7.0 → Δv=4.49 m/s. powerCost 100. G-Revolution ep 22 "Sibling Rivalry". First use.  
**Compatible beys**: Plastic-gen high-friction rubber BB (μ ≥ 0.70) + smooth wide AR (r ≥ 3.0 cm) for uniform discharge; standard: Thunder Pegasus 105R²F (Julia Fernandez, G-Revolution S3)

---

### [Case 1972 — Julia Fernandez / Thunder Pegasus — Fuerza Charge](./15%20case%20study.md#case-1972)

**System**: Plastic Generation (G-Revolution)  
**Mechanism**: COMBO — Fuerza Charge. Sequence: moveRight → moveRight → attack (→ → A). Cost: 15. Type: attack. Double-arc orbital: v_arc2=0.920 → v_contact=0.782 m/s; e_eff_combo=0.750 (+80% electric boost); J=2.475×10⁻² N·s; R²F double-arc Δω=+10 rad/s (η_R²F=0.12); dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: R²F triboelectric boost (Case 1970)

---

### [Case 1973 — Driger F (Plastic Gen) — Ricochet Attack + Electric Fang Contact](./15%20case%20study.md#case-1973)

**System**: Plastic Generation (Bakuten Shoot)  
**Geometry**: Fang Tiger AR r=3.5 cm, 10.0 g; Heavy WD r=2.8 cm, 18.0 g; Sharp BB r=0.2 cm, μ=0.05; I_total=2.686×10⁻⁵ kg·m²; m=40.0 g; ω₀=500 rad/s. Note: Also applicable to Driger Fang.0.Xt (Beyblade X sequel)  
**Mechanism**: 45° ricochet approach: v_total_in=0.450 m/s, e_wall=0.85 → v_post_bounce=0.417 m/s. Electric discharge V=800 V; e_boost=0.096 (e_base=0.70 → e_eff=0.80). J_TF=1.502×10⁻² N·s → Δv=0.376 m/s.  
**Gimmick**: Wall-ricochet precision approach + electric fang discharge → MechanicRegistry: wall_ricochet / electric_bite

---

### [Case 1974 — Ray Kon / Driger F — Tiger Fang](./15%20case%20study.md#case-1974)

**System**: Plastic Generation  
**Blader**: Ray Kon  
**Special Move**: Tiger Fang (JP: 白虎牙撃) — 45° ricochet (e_wall=0.85, v_in=0.450 → v_post=0.417 m/s); electric discharge V=800V raises e 0.70→0.80; J_TF=1.502×10⁻² N·s → Δv=0.376 m/s; Δω=19.6 rad/s (96.1%). [M] Ray White Tiger lightning ×8.0 → Δv=3.01 m/s. powerCost 100. GBA Medium Finish Lv.30. Also Driger Fang.0.Xt (BX sequel).  
**Compatible beys**: Plastic-gen hard claw AR (r ≥ 3.2 cm, e ≥ 0.65) + Sharp BB (μ ≤ 0.10) for precision 45° ricochet; standard: Driger F (Ray Kon, Bakuten Shoot); Driger Fang.0.Xt (BX)

---

### [Case 1975 — Ray Kon / Driger F — Tiger Ricochet](./15%20case%20study.md#case-1975)

**System**: Plastic Generation  
**Mechanism**: COMBO — Tiger Ricochet. Sequence: moveLeft → moveLeft → attack (← ← A). Cost: 15. Type: attack. Double-wall ricochet θ=40°: v_contact=0.384 m/s → J=1.305×10⁻² N·s; Fang Tiger low-loss Δω=+8 rad/s (η_claw=0.15, Sharp BB); dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Ricochet + electric bite (Case 1973)

---

### [Case 1976 — Driger S (Plastic Gen) — Multi-Strike Claw Slash + Electric Flash Spin Boost](./15%20case%20study.md#case-1976)

**System**: Plastic Generation (Bakuten Shoot). Note: Lee/Galeon Attacker also uses Tiger Claw  
**Geometry**: Tiger Defenser AR r=3.5 cm 9.5 g; Wide WD r=2.6 cm 14.0 g; Sharp BB r=0.2 cm μ=0.05 0.5 g; I_total=2.376×10⁻⁵ kg·m²; m=30.0 g; ω₀=500 rad/s  
**Mechanism**: Electric flash boost V=600 V → Δω_flash=+15 rad/s (ω_boosted=515 rad/s). Multi-hit pass: v_approach=0.452 m/s; v_hit=0.316 m/s; e_glance=0.55; J_per_hit=8.399×10⁻³ N·s; N_hits=3 → J_total=2.520×10⁻² N·s → Δv=0.630 m/s. Net ω_remain=477.8 rad/s.  
**Gimmick**: Electric flash pre-boost + 3-hit glancing claw rake → MechanicRegistry: electric_flash / multi_strike

---

### [Case 1977 — Ray Kon / Driger S — Tiger Claw](./15%20case%20study.md#case-1977)

**System**: Plastic Generation  
**Blader**: Ray Kon (also Lee / Galeon Attacker)  
**Special Move**: Tiger Claw (JP: 白虎爪撃) — electric flash Δω=+15 rad/s (V=600V); 3-hit glancing claw rake: J_total=2.520×10⁻² N·s → Δv=0.630 m/s; ω_remain=477.8 rad/s. [M] Ray White Tiger lightning ×8.0 → Δv=5.04 m/s. powerCost 100. GBA Weak Finish Lv.10. Lee/Galeon Attacker also compatible.  
**Compatible beys**: Plastic-gen wide multi-claw AR (r ≥ 3.2 cm, N_claws ≥ 3) + Sharp/low-friction BB (μ ≤ 0.10) for high-speed dash-through sweep; standard: Driger S (Ray Kon, Bakuten Shoot); Driger F (Ray); Galeon Attacker (Lee). GBA: Weak Finish Lv.10.

---

### [Case 1978 — Ray Kon / Driger S — Tiger Scratch](./15%20case%20study.md#case-1978)

**System**: Plastic Generation  
**Mechanism**: COMBO — Tiger Scratch. Sequence: attack → defense → attack (A K A). Cost: 15. Type: attack. Two-hit sequence: J_hit1=8.399×10⁻³+J_hit2=6.676×10⁻³ → J_combo=1.507×10⁻² N·s; partial electric recharge + claw recoil Δω=+5 rad/s (conservative K-interrupt reduction); dmgMult 1.20×; lockMs 50. dmgMult 1.20× ≤ 1.5 ✓; lockMs 50 ≤ 300 ✓.  
**Gimmick**: Parent: Multi-hit claw + electric flash (Case 1976)

---

### [Case 1979 — Thermal Lacerta WA130HF (MFB) — WA130 Deflect-Hook Mechanism](./15%20case%20study.md#case-1979)

**System**: Metal Masters (MFB)  
**Geometry**: Thermal FW: r=2.9 cm, 27.0 g; Lacerta ER: r=3.3 cm, 7.0 g; WA130 ST: r_arm=4.0 cm, 5.5 g; HF tip: r=0.2 cm, μ=0.70, 2.5 g; I_total=3.843×10⁻⁵ kg·m²; m=43.0 g; ω₀=580 rad/s  
**Mechanism**: WA130 arm v_arm=23.20 m/s (r=4.0 cm — highest contact speed of any MFB ST). Deflect-hook φ=135°: e_WA=0.60 → Δv_redirect=0.743 m/s. Hook impulse J_hook=9.554×10⁻² N·s; η_throw=0.10 → J_redirect=9.554×10⁻³ N·s. Combined Δv=0.48 m/s. Works like ED145.  
**Gimmick**: WA130 arm hook deflect (135°) + redirect throw → MechanicRegistry: arm_hook / deflect_throw

---

### [Case 1980 — Chiyun Li / Thermal Lacerta — Thunder Sword Waltz](./15%20case%20study.md#case-1980)

**System**: Metal Masters (MFB)  
**Blader**: Chiyun Li  
**Special Move**: Thunder Sword Waltz — WA130 arm r=4.0 cm, v=23.20 m/s; J_hook=9.554×10⁻²; η_throw=0.10 → J_redirect=9.554×10⁻³ N·s; combined Δv=0.48 m/s; ω_remain≈565 rad/s (97.4% retained — arm rebounds 85%). [M] Chiyun Lacerta blade-dance waltz ×7.0 → Δv=3.36 m/s. powerCost 100. Defense type. Used vs Tsubasa repeatedly. Deflect type like ED145.  
**Compatible beys**: MFB WA130 ST (r_arm ≥ 3.5 cm, deflect ≥ 120°) + HF/high-friction tip (μ ≥ 0.70) for evasive arc; standard: Thermal Lacerta WA130HF (Chiyun Li, Metal Masters)

---

### [Case 1981 — Chiyun Li / Thermal Lacerta — Sword Waltz](./15%20case%20study.md#case-1981)

**System**: Metal Masters (MFB)  
**Mechanism**: COMBO — Sword Waltz. Sequence: defense → moveLeft → defense (K ← K). Cost: 15. Type: defense. HF evasive arc v=0.812 m/s positions arm; partial hook J_combo=4.777×10⁻² N·s (50% of full waltz); Δω=+8 rad/s (η_arm=0.85 + HF traction); dmgMult 1.20×; lockMs 150. dmgMult 1.20× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: WA130 deflect-hook mechanism (Case 1979)

---

### [Case 1982 — Driger MS (HMS G-Revolution) — Massive Power Channel + Electric Radiation Slash](./15%20case%20study.md#case-1982)

**System**: Hard Metal System (HMS, G-Revolution)  
**Geometry**: MS AR r=3.0 cm, 12.0 g; CWD r=2.6 cm, 16.0 g; Spike Base r=0.15 cm, μ=0.04, 5.0 g; I_total=2.163×10⁻⁵ kg·m²; m=39.0 g; ω₀=520 rad/s  
**Mechanism**: Magnetic core channel η=1.15 → ω_eff=598 rad/s; ΔKE=9.510×10⁻⁴ J; J_channel_bonus=6.129×10⁻³ N·s. Electric radiation V=1500 V (metal core) → e_metal=0.80 + boost=0.129 → e_eff=0.93. Combined: J_TS=2.234×10⁻²+J_channel=6.129×10⁻³ → J_total=2.847×10⁻² N·s → Δv=0.712 m/s. Post-slash ω_remain=558.5 rad/s (still exceeds ω₀).  
**Gimmick**: Magnetic core spin amplification + electric radiation boost → MechanicRegistry: power_channel / electric_radiation

---

### [Case 1983 — Ray Kon / Driger MS — Thunder Slash](./15%20case%20study.md#case-1983)

**System**: HMS (G-Revolution)  
**Blader**: Ray Kon  
**Special Move**: Thunder Slash (JP: サンダースラッシュ) — magnetic channel η=1.15 → ω_eff=598 rad/s; electric V=1500V; e_eff=0.93; J_total=2.847×10⁻² N·s → Δv=0.712 m/s; ω_remain=558.5 rad/s (still > ω₀ post-slash). [M] Ray White Tiger HMS lightning ×8.0 → Δv=5.70 m/s. powerCost 100. First used vs Crusher's Gigars.  
**Compatible beys**: HMS metal AR (r ≥ 2.8 cm, e ≥ 0.75, metal body) + Spike/low-friction BB (μ ≤ 0.10) + pre-contact power channel; standard: Driger MS (Ray Kon, G-Revolution HMS)

---

### [Case 1984 — Ray Kon / Driger MS — Thunder Channel](./15%20case%20study.md#case-1984)

**System**: HMS (G-Revolution)  
**Mechanism**: COMBO — Thunder Channel. Sequence: defense → defense → attack (K K A). Cost: 15. Type: attack. K-K channel: ω_K1=559→ω_K2=598 rad/s (full channel achieved). J_combo=2.845×10⁻² N·s (channel + electric); residual channel Δω=+10 rad/s (η_residual=0.15); dmgMult 1.35×; lockMs 0. dmgMult 1.35× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Magnetic channel + electric radiation (Case 1982)

---

### [Case 1985 — Strata Dragoon MS (HMS G-Revolution) — Ground-Burst Launch + Flaming Rock Projectile](./15%20case%20study.md#case-1985)

**System**: Hard Metal System (HMS, G-Revolution)  
**Geometry**: MS Strata Dragoon AR r=3.0 cm, 13.0 g (serrated saw-edge); CWD r=2.5 cm, 15.0 g; Flat Base HMS r=0.2 cm, μ=0.80, 5.0 g; I_total=2.148×10⁻⁵ kg·m²; m=39.0 g; ω₀=520 rad/s  
**Mechanism**: Ground burst: F_ground=0.306 N×t=0.050s → J_ground=1.531×10⁻² N·s → v_burst_up=0.393 m/s. Flaming rock (m_rock=20g): v_rock=0.786 m/s; J_rock=1.467×10⁻² N·s. Thermal saw (T=450°C, α=1.2×10⁻⁵): v_thermal=0.084 m/s; v_saw_total=1.309 m/s; e_saw=0.75; J_saw=4.524×10⁻² N·s. J_total=5.991×10⁻² N·s → Δv=1.498 m/s.  
**Gimmick**: Ground-burst vertical launch + flaming rock projectile + friction-heated serrated saw contact → MechanicRegistry: ground_burst / projectile / thermal_saw

---

### [Case 1986 — Daichi Sumeragi / Strata Dragoon MS — Spike Saw](./15%20case%20study.md#case-1986)

**System**: HMS (G-Revolution)  
**Blader**: Daichi Sumeragi  
**Special Move**: Spike Saw (JP: 爆狂刃断) — ground burst v_up=0.393 m/s; flaming rock J_rock=1.467×10⁻² N·s (e=0.40, crumbles); thermal saw T=450°C, v=1.309 m/s, e=0.75 → J_saw=4.524×10⁻²; J_total=5.991×10⁻² N·s → Δv=1.498 m/s; Δω=63.2 rad/s (87.8%). [M] Daichi earth-dragon fire-saw ×7.5 → Δv=11.2 m/s. powerCost 100. HMS serrated circular-contact saw profile. "Burning hot saw glowing red" description.  
**Compatible beys**: HMS serrated-edge metal AR (r ≥ 2.8 cm, e ≥ 0.70, continuous circular edge) + Flat HMS BB (μ ≥ 0.70) for ground-burst + orbital crash; standard: Strata Dragoon MS (Daichi Sumeragi, G-Revolution HMS)

---

### [Case 1987 — Daichi Sumeragi / Strata Dragoon MS — Spike Burst](./15%20case%20study.md#case-1987)

**System**: HMS (G-Revolution)  
**Mechanism**: COMBO — Spike Burst. Sequence: moveDown → moveUp → defense (↓ ↑ K). Cost: 15. Type: attack. Ground-burst apex saw-hold: v_combo=0.892+0.050=0.942 m/s → J=3.256×10⁻² N·s; serrated-saw-hold Δω=+8 rad/s (η_saw=0.12+Flat Base torque); dmgMult 1.30×; lockMs 100. dmgMult 1.30× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Ground-burst flaming saw (Case 1985)

---

### [Case 1988 — Ultimate Valtryek Legacy Variable'-9 (Burst DB/BU) — Hybrid Stadium Wall-Ride + Crimson Blade Dive](./15%20case%20study.md#case-1988)

**System**: Burst / DB / BU (Burst DB/BU)  
**Geometry**: Ultimate Valtryek blade: r=3.2 cm, 28.0 g; Variable' ratchet: r=2.0 cm, 6.0 g; 9 bit: r=0.4 cm, 5.0 g; I_total=3.115×10⁻⁵ kg·m²; m=39.0 g; ω₀=700 rad/s  
**Mechanism**: Hybrid Stadium wall-ride: v_entry=1.50 m/s → h_wall=8.0 cm → v_apex=0.825 m/s (energy-conserved: v_contact=1.50 m/s). Crimson blade η=1.10 → ω_blade=770 rad/s; ΔKE=1.603×10⁻³ J; J_crimson=7.957×10⁻³ N·s. J_dive_base=5.184×10⁻²; J_total=5.980×10⁻² N·s → Δv=1.495 m/s.  
**Gimmick**: Hybrid Stadium wall-ride + crimson energy blade activation + gravity dive → MechanicRegistry: wall_ride / energy_blade / gravity_dive

---

### [Case 1989 — Valt Aoi / Ultimate Valtryek — Ultimate Dive](./15%20case%20study.md#case-1989)

**System**: Burst / DB/BU  
**Blader**: Valt Aoi  
**Special Move**: Ultimate Dive (JP: アルティメットダイブ) — Hybrid Stadium wall h=8.0 cm; crimson blade η=1.10 ω_blade=770 rad/s; v_contact=1.50 m/s; J_total=5.980×10⁻² N·s → Δv=1.495 m/s; ω_remain=708.6 rad/s (92.0% of boosted). [M] Valt crimson Valtryek spirit ×8.0 → Δv=11.96 m/s. powerCost 100. Requires Hybrid Stadium.  
**Compatible beys**: Burst DB/BU layer (r ≥ 3.0 cm) + h_wall ≥ 6.0 cm angled stadium + BeySpirit energy blade (η ≥ 1.05); standard: Ultimate Valtryek Legacy Variable'-9 (Valt Aoi, Burst DB/BU)

---

### [Case 1990 — Valt Aoi / Ultimate Valtryek — Crimson Wall Dive](./15%20case%20study.md#case-1990)

**System**: Burst / DB/BU  
**Mechanism**: COMBO — Crimson Wall Dive. Sequence: moveUp → moveDown → attack (↑ ↓ A). Cost: 15. Type: attack. Partial wall approach 80% → h_combo=6.24 cm → v_contact=1.106 m/s; partial crimson blade 50% → J_crimson_combo=5.627×10⁻³; J_combo=4.375×10⁻² N·s; blade recharge Δω=+10 rad/s (η_blade=0.12); dmgMult 1.35×; lockMs 100. dmgMult 1.35× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Hybrid Stadium wall-ride + crimson blade (Case 1988)

---

### [Case 1991 — Strike Valtryek 6Vortex Ultimate Reboot (Burst Surge) — Stadium Groove-Rail Speed Build](./15%20case%20study.md#case-1991)

**System**: Burst / Sparking (Burst Surge)  
**Geometry**: Strike Valtryek layer: r=3.2 cm, 28.0 g; 6Vortex disc: r=2.5 cm, 14.0 g; Ultimate Reboot driver: r_outer=0.7 cm, μ_outer=0.50, 7.0 g; I_total=3.749×10⁻⁵ kg·m²; m=49.0 g; ω₀=700 rad/s  
**Mechanism**: GT/Surge stadium groove rail: v_orbital_free=2.450 m/s; groove constraint η_groove=1.35 → v_groove_peak=3.30 m/s. 90° trajectory change exit; m_eff=2.202×10⁻² kg; e=0.72; J_UFL=1.250×10⁻¹ N·s → Δv=3.124 m/s.  
**Gimmick**: Groove-rail orbital speed amplification + trajectory change exit → MechanicRegistry: groove_rail / trajectory_change

---

### [Case 1992 — Valt Aoi / Strike Valtryek — Ultimate Flash Launch](./15%20case%20study.md#case-1992)

**System**: Burst / Sparking (Surge)  
**Blader**: Valt Aoi  
**Special Move**: Ultimate Flash Launch (JP: アルティメットフラッシュシュート) — groove rail η=1.35 → v_groove=3.30 m/s; 90° redirect; J_UFL=1.250×10⁻¹ N·s → Δv=3.124 m/s; Δω=106.7 rad/s (84.8%). [M] Valt flash-speed groove spirit ×8.0 → Δv=24.99 m/s. powerCost 100. Requires groove-track stadium.  
**Compatible beys**: Burst Surge wide attack layer (r ≥ 2.8 cm) + rubber-ring driver (r_outer ≥ 5 mm, μ ≥ 0.40) in groove-track stadium (η ≥ 1.20); standard: Strike Valtryek 6Vortex Ultimate Reboot (Valt Aoi, Burst Surge)

---

### [Case 1993 — Valt Aoi / Strike Valtryek — Flash Groove](./15%20case%20study.md#case-1993)

**System**: Burst / Sparking (Surge)  
**Mechanism**: COMBO — Flash Groove. Sequence: moveRight → moveRight → attack (→ → A). Cost: 15. Type: attack. Double groove arc: v_arc2=2.940 → v_contact=3.381 m/s; Reboot rubber groove-exit Δω=+10 rad/s (η_Reboot=0.10); dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Stadium groove-rail speed build (Case 1991)

---

### [Case 1994 — Ultimate Valtryek Legacy Variable'-9 — Variable' Driver Speed Surge](./15%20case%20study.md#case-1994)

**System**: Burst / DB/BU  
**Geometry**: See Case 1988 (m=39.0 g, I=3.115×10⁻⁵ kg·m², ω₀=700 rad/s)  
**Mechanism**: Variable' mode transition: Mode 1 μ=0.35 r=4mm v=0.980 m/s → Mode 2 μ=0.70 r=5mm v=2.450 m/s. Δv_Variable=1.470 m/s (speed surge). Full-force Ultimate Blade charge: e=0.75; J_UFV=8.468×10⁻² N·s → Δv=2.117 m/s.  
**Gimmick**: Variable' mode switch (low→high friction) speed surge → MechanicRegistry: driver_mode_switch / speed_surge

---

### [Case 1995 — Valt Aoi / Ultimate Valtryek — Ultimate Flash V](./15%20case%20study.md#case-1995)

**System**: Burst / DB/BU  
**Blader**: Valt Aoi  
**Special Move**: Ultimate Flash V (JP: アルティメットフラッシュV) — Variable' Δv_surge=1.470 m/s → v_charge=2.450 m/s; J_UFV=8.468×10⁻² N·s → Δv=2.117 m/s; Δω=87.0 rad/s (87.6%). [M] Valt V-flash Variable' spirit ×8.0 → Δv=16.94 m/s. powerCost 100. Distinct from Ultimate Dive (wall-ride) and Ultimate Flash Launch (groove).  
**Compatible beys**: Burst DB/BU mode-switch driver (Δv ≥ 1.0 m/s transition) + wide attack Blade (r ≥ 3.0 cm, e ≥ 0.70); standard: Ultimate Valtryek Legacy Variable'-9 (Valt Aoi, Burst DB/BU)

---

### [Case 1996 — Valt Aoi / Ultimate Valtryek — V-Surge Strike](./15%20case%20study.md#case-1996)

**System**: Burst / DB/BU  
**Mechanism**: COMBO — V-Surge Strike. Sequence: moveLeft → moveRight → attack (← → A). Cost: 15. Type: attack. Feint-snap Variable' surge: v_snap=2.450+0.588=3.038 → v_contact=2.673 m/s → J=9.238×10⁻² N·s; Variable' reversion Δω=+10 rad/s (η_var=0.10); dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Variable' mode-switch speed surge (Case 1994)

---

### [Case 1997 — Genesis/Strike Valtryek 6Vortex Ultimate Reboot (Burst Surge) — In-Battle Tip Change Speed Surge](./15%20case%20study.md#case-1997)

**System**: Burst / Sparking (Burst Surge)  
**Geometry**: See Case 1991 (m=49.0 g, I=3.749×10⁻⁵ kg·m², ω₀=700 rad/s)  
**Mechanism**: Ultimate Reboot two-mode tip: bearing mode μ≈0 r=3mm → ω_reboot=690 rad/s (η=0.986); flat-ring mode μ=0.50 r=10mm → v_ring=3.450 m/s. Δv_reboot=3.450 m/s (from near-zero). Contact e=0.72; J_UGR=1.307×10⁻¹ N·s → Δv=3.268 m/s. Trajectory reversal triggers tip mode switch.  
**Gimmick**: In-battle bearing→flat ring tip mode switch → massive speed surge → MechanicRegistry: tip_mode_switch / reboot

---

### [Case 1998 — Valt Aoi / Genesis Valtryek — Ultimate Genesis Reboot](./15%20case%20study.md#case-1998)

**System**: Burst / Sparking (Surge)  
**Blader**: Valt Aoi  
**Special Move**: Ultimate Genesis Reboot (JP: アルティメットジェネシスリブート) — bearing→flat ring transition ω_reboot=690 rad/s → v_contact=3.450 m/s; J_UGR=1.307×10⁻¹ N·s → Δv=3.268 m/s; ω_remain=578.4 rad/s (83.8% — tip reverts to bearing post-contact). [M] Valt genesis spirit ×8.0 → Δv=26.14 m/s. powerCost 100. Resembles Gingka's Final Drive Mode (bearing→flat). Distinct from Genesis Reboot (standard Reboot) and Ultimate Flash Launch.  
**Compatible beys**: Burst Surge Ultimate Reboot or dual-mode bearing+flat driver (r_flat ≥ 8 mm, μ ≥ 0.45) + wide attack layer (r ≥ 2.8 cm, e ≥ 0.70); standard: Genesis Valtryek 6Vortex Ultimate Reboot (Valt Aoi, Burst Surge)

---

### [Case 1999 — Valt Aoi / Genesis Valtryek — Genesis Surge](./15%20case%20study.md#case-1999)

**System**: Burst / Sparking (Surge)  
**Mechanism**: COMBO — Genesis Surge. Sequence: defense → attack → defense (K A K). Cost: 15. Type: attack. Bearing hold K₁ → ring surge A (88% efficiency: v=3.036 m/s → J=1.150×10⁻¹ N·s) → bearing re-engage K₂ Δω=+15 rad/s (η_reboot=0.13); dmgMult 1.35×; lockMs 100. dmgMult 1.35× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Ultimate Reboot in-battle tip change (Case 1997)

---

### [Case 2000 — Dragoon MS Ultimate Version (HMS G-Revolution manga) — Elemental Tornado Vortex](./15%20case%20study.md#case-2000)

**System**: Hard Metal System (HMS, G-Revolution manga)  
**Geometry**: Dragoon Wing AR r=2.4 cm, 18.0 g; Circle Wide CWD r=3.0 cm (tungsten alloy), 13.0 g; Magnacore HMC r=0.4 cm, 5.0 g; Semi-flat tip r=0.35 cm, μ=0.40, 5.0 g; I_total=2.209×10⁻⁵ kg·m²; m=41.0 g; ω₀=520 rad/s  
**Mechanism**: Rankine vortex: r_c=1.44 cm, v_tip=12.48 m/s, Γ=0.6210 m²/s; v_wind=2.471 m/s at r=4.0 cm. Sky η=1.50 → v_sky=3.706 m/s; Water η=1.80; Fire η=1.65. J_wind_eff=3.350×10⁻² N·s (5.0s). Tornado dive h=25.0 cm → v_dive=2.214 m/s; e_Wing=0.78; J_dive=7.980×10⁻² N·s. J_total=1.133×10⁻¹ N·s → Δv=2.833 m/s.  
**Gimmick**: Elemental attribute tornado (Sky/Water/Fire) + diving crash → MechanicRegistry: elemental_tornado / gravity_dive

---

### [Case 2001 — Tyson Granger / Dragoon MS Ultimate Version — Ultimate Storm (Manga)](./15%20case%20study.md#case-2001)

**System**: HMS (G-Revolution manga)  
**Blader**: Tyson Granger  
**Special Move**: Ultimate Storm (JP: アルティメットストーム) — elemental vortex Γ=0.6210 m²/s; Sky η=1.50 v=3.706 m/s; Water η=1.80 v=4.448 m/s; Fire η=1.65 (Kai's Dranzer MS version); J_wind_eff=3.350×10⁻²; tornado dive h=25.0 cm v=2.214 m/s J_dive=7.980×10⁻²; J_total=1.133×10⁻¹ N·s → Δv=2.833 m/s (Water: 3.001 m/s); Δω=123.2 rad/s (76.3%). [M] Tyson sky-wind spirit ×8.0 → Δv=22.66 m/s. powerCost 100. Vortex stationary (distinct from Ultimate Storm Attack). Elemental attribute from Bit-Beast Sky/Water/Fire.  
**Compatible beys**: HMS wide metal AR (r ≥ 2.0 cm) + Magnacore/elemental resonance; standard: Dragoon MS Ultimate Version (Tyson Granger, G-Revolution HMS manga)

---

### [Case 2002 — Tyson Granger / Dragoon MS — Tornado Crash](./15%20case%20study.md#case-2002)

**System**: HMS (G-Revolution)  
**Mechanism**: COMBO — Tornado Crash. Sequence: moveUp → moveDown → attack (↑ ↓ A). Cost: 15. Type: attack. Partial vortex + dive: J_wind_combo=1.564×10⁻²+J_dive_combo=6.182×10⁻² → J=7.746×10⁻² N·s; tornado rebound Δω=+8 rad/s (η_vortex=0.10); dmgMult 1.30×; lockMs 50. dmgMult 1.30× ≤ 1.5 ✓; lockMs 50 ≤ 300 ✓.  
**Gimmick**: Parent: Elemental tornado vortex (Case 2000)

---

### [Case 2003 — Dragoon MS / Metal Storm (HMS anime) — Moving Storm Vortex](./15%20case%20study.md#case-2003)

**System**: Hard Metal System (HMS, G-Revolution anime)  
**Geometry**: See Case 2000 (m=41.0 g, I=2.209×10⁻⁵ kg·m², ω₀=520 rad/s)  
**Mechanism**: Moving vortex (storm travels with bey): η_moving=2.00 → v_wind_moving=4.942 m/s; J_wind_moving=4.469×10⁻² N·s. Direct contact at end: v_contact=2.924 m/s (semi-flat μ=0.40 + v_orbital=2.30 m/s); J_contact=1.054×10⁻¹ N·s. J_total_USA=1.501×10⁻¹ N·s → Δv=3.752 m/s. Distinct from manga Ultimate Storm (stationary vortex).  
**Gimmick**: Moving vortex follows bey orbit + direct contact strike → MechanicRegistry: moving_vortex / orbital_contact

---

### [Case 2004 — Tyson Granger / Dragoon MS — Ultimate Storm Attack (Anime)](./15%20case%20study.md#case-2004)

**System**: HMS (G-Revolution anime)  
**Blader**: Tyson Granger  
**Special Move**: Ultimate Storm Attack (JP: アルティメットストームアタック) — moving vortex η_moving=2.00 v_wind=4.942 m/s J_wind=4.469×10⁻²; direct contact v=2.924 m/s J_contact=1.054×10⁻¹; J_total=1.501×10⁻¹ N·s → Δv=3.752 m/s; Δω=163.2 rad/s (68.6% — most spin-expensive Dragoon move). [M] Tyson Dragoon sky-wind spirit ×8.0 → Δv=30.0 m/s. powerCost 100. Storm moves with bey (distinct from manga Ultimate Storm which is stationary). Evolved from Dragoon S's Storm Attack.  
**Compatible beys**: HMS wide metal AR + orbital speed sufficient to carry moving vortex (v_orbital ≥ 2.0 m/s); standard: Dragoon MS / Metal Storm (Tyson Granger, G-Revolution anime)

---

### [Case 2005 — Tyson Granger / Dragoon MS — Storm Follow](./15%20case%20study.md#case-2005)

**System**: HMS (G-Revolution)  
**Mechanism**: COMBO — Storm Follow. Sequence: moveUp → moveUp → attack (↑ ↑ A). Cost: 15. Type: attack. Double-arc moving storm build + contact: J_wind_arc1=2.680×10⁻²+J_wind_arc2=4.021×10⁻²+J_contact_combo=8.957×10⁻² → J_combo=1.298×10⁻¹ N·s; moving-storm orbital rebound Δω=+8 rad/s (η_orbit=0.08); dmgMult 1.30×; lockMs 50. dmgMult 1.30× ≤ 1.5 ✓; lockMs 50 ≤ 300 ✓.  
**Gimmick**: Parent: Moving storm vortex (Case 2003)

---

### [Case 2006 — Storm Spryzen Knuckle Unite — Stadium Groove Speed Build + Heavy Contact](./15%20case%20study.md#case-2006)

**System**: Burst God / SuperKing (3-part)  
**Blader**: Shu Kurenai  
**Geometry**: m=52.0 g; Storm Spryzen layer r=3.3 cm; Knuckle disc r=2.6 cm; Unite driver r_outer=0.9 cm; I_total=4.292×10⁻⁵ kg·m²; ω₀=700 rad/s  
**Mechanism**: Unite outer rubber ring (μ=0.52, r=9 mm) engages groove wall → v_orbital_free=3.276 m/s → η_groove=1.35 → v_groove_peak=4.423 m/s. Counter strike at groove exit: m_eff=2.261×10⁻² kg; e=0.73; J_UCB=1.730×10⁻¹ N·s → Δv_opp=4.325 m/s.  
**Gimmick**: Groove-rail speed build + counter attack strike → MechanicRegistry: groove_counter

---

### [Case 2007 — Shu Kurenai / Storm Spryzen Knuckle Unite — Ultra Counter Break](./15%20case%20study.md#case-2007)

**System**: Burst God / SuperKing  
**Blader**: Shu Kurenai  
**Special Move**: Ultra Counter Break (JP: Turū Kauntā Bureiku — True Counter Break) — groove rail η=1.35 v_groove=4.423 m/s; J_UCB=1.730×10⁻¹ N·s → Δv=4.325 m/s; Δω_drain=133.0 rad/s (81.0% retained). [M] Shu Spryzen counter-fire ×8.0 → Δv=34.60 m/s. powerCost 100. Groove rail mechanism: same as Ultimate Flash Launch but Unite outer ring μ=0.52 r=9mm on heavier 52.0g assembly. Distinct from Counter Break (standard, no groove).  
**Compatible beys**: Burst God/SuperKing rubber-ring variable driver (outer ring r ≥ 7 mm, μ ≥ 0.45) + wide reinforced layer (r ≥ 3.0 cm, e ≥ 0.70) in stadium with circular groove rail (η_groove ≥ 1.20); standard: Storm Spryzen Knuckle Unite (Shu Kurenai, Burst God/SuperKing)

---

### [Case 2008 — Shu Kurenai / Storm Spryzen Knuckle Unite — Counter Groove](./15%20case%20study.md#case-2008)

**System**: Burst God / SuperKing  
**Mechanism**: COMBO — Counter Groove. Sequence: moveRight → moveRight → attack (→ → A). Cost: 15. Type: attack. Double-arc groove: v_arc2=3.931 m/s → v_combo_contact=4.521 m/s (η_partial=1.15); J_combo=1.768×10⁻¹ N·s; Unite rubber rebound Δω=+12 rad/s (η_Unite=0.09); dmgMult 1.35×; lockMs 0. dmgMult 1.35× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Groove speed build (Case 2006)

---

### [Case 2009 — Emperor Forneus — Outer Rim Drift Trajectory Change](./15%20case%20study.md#case-2009)

**System**: Burst Cho-Z (3-part)  
**Blader**: Free de la Hoya  
**Geometry**: m=49.0 g; Emperor Forneus layer r_rim=3.8 cm; Disc 0 r=1.6 cm; Atomic driver r=0.4 cm (bearing); I_total=4.094×10⁻⁵ kg·m²; ω₀=700 rad/s  
**Mechanism**: Standard bearing orbit v_orbital=0.224 m/s (μ=0.08). Outer rim tangential velocity v_rim_tang=26.60 m/s (ω₀×r_rim=700×0.038); glancing approach φ_drift=30°; η_rim=0.16; v_rim_eff=2.128 m/s; v_contact_drift=2.352 m/s. Counter strike: m_eff=2.202×10⁻² kg; e=0.72; J_UED=8.908×10⁻² N·s → Δv_opp=2.227 m/s.  
**Gimmick**: Outer rim drift trajectory change → MechanicRegistry: rim_drift_redirect

---

### [Case 2010 — Free de la Hoya / Emperor Forneus — Ultra Emperor Drift](./15%20case%20study.md#case-2010)

**System**: Burst Cho-Z  
**Blader**: Free de la Hoya  
**Special Move**: Ultra Emperor Drift (JP: Arutimetto Enperā Dorifuto) — outer rim r_rim=3.8 cm; v_rim_tang=26.60 m/s; φ_drift=30°; η_rim=0.16; v_rim_eff=2.128 m/s; v_contact_drift=2.352 m/s; J_UED=8.908×10⁻² N·s → Δv=2.227 m/s; Δω_drain=82.6 rad/s (88.2% retained). [M] Free de la Hoya Forneus drift ×7.5 → Δv=16.70 m/s. powerCost 100. Outer rim redirects glancing approach to direct contact (analogous to Counter Break groove-speed trajectory redirect). Distinct from groove mechanisms.  
**Compatible beys**: Burst Cho-Z extended outer rim layer (r_rim ≥ 3.4 cm, φ_drift ≥ 20°; v_rim_eff ≥ 1.5 m/s) + low-friction bearing driver; standard: Emperor Forneus (Free de la Hoya, Burst Cho-Z)

---

### [Case 2011 — Free de la Hoya / Emperor Forneus — Emperor Drift](./15%20case%20study.md#case-2011)

**System**: Burst Cho-Z  
**Mechanism**: COMBO — Emperor Drift. Sequence: moveLeft → moveRight → attack (← → A). Cost: 15. Type: attack. Drift snap reversal: v_drift_combo=1.873 m/s + v_snap=0.157 m/s = v_combo_contact=2.030 m/s; J_combo=7.689×10⁻² N·s; rim drift rebound Δω=+8 rad/s (η_drift_rebound=0.11); dmgMult 1.30×; lockMs 0. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Outer rim drift (Case 2009)

---

### [Case 2012 — Union Achilles Convert Xtend+ Retsu — Stadium Wall-Ride + Xtend+ Tip Switch Dive](./15%20case%20study.md#case-2012)

**System**: Burst GT (3-part)  
**Blader**: Aiger Akabane  
**Geometry**: m=48.0 g; Union Achilles layer r=3.3 cm; Convert disc r=2.3 cm; Xtend+ driver r_point=0.3 cm; I_total=3.917×10⁻⁵ kg·m²; ω₀=700 rad/s  
**Mechanism**: Point-mode wall climb (μ=0.15, r=3mm): v_entry=2.00 m/s; h_wall=9.0 cm; Xtend+ mode switch at apex η_switch=1.04 → v_contact=2.080 m/s. Dive strike: m_eff=2.182×10⁻² kg; e=0.76; J_UD_U=7.987×10⁻² N·s → Δv_opp=2.00 m/s; Δω_drain=67.3 rad/s (90.4% retained).  
**Gimmick**: Point-mode wall climb + tip switch dive → wall-ride-and-fall family (Z Dive / Turbo Dive / Ultimate Dive / Unison Dive)

---

### [Case 2013 — Aiger Akabane / Union Achilles Convert Xtend+ Retsu — Unison Dive](./15%20case%20study.md#case-2013)

**System**: Burst GT  
**Blader**: Aiger Akabane  
**Special Move**: Unison Dive (JP: Yunion Daibu) — GT wall h=9.0 cm; Xtend+ point→flat tip switch η=1.04; v_contact=2.080 m/s; J_UD_U=7.987×10⁻² N·s → Δv=2.00 m/s; Δω_drain=67.3 rad/s (90.4% retained — Xtend+ flat→point reversion post-dive). [M] Aiger Achilles divine drive ×7.5 → Δv=15.00 m/s. powerCost 100. Xtend+ point-mode preserves spin during wall climb. Wall-ride-and-fall family consistent with Z Dive, Turbo Dive, Ultimate Dive.  
**Compatible beys**: Burst GT/SuperKing variable-mode driver (point/flat switch, Xtend+ or equivalent) + wide attack layer (r ≥ 3.0 cm, e ≥ 0.72) in GT stadium (h_wall ≥ 7.0 cm); standard: Union Achilles Convert Xtend+ Retsu (Aiger Akabane, Burst GT)

---

### [Case 2014 — Aiger Akabane / Union Achilles Convert Xtend+ Retsu — Union Ascent](./15%20case%20study.md#case-2014)

**System**: Burst GT  
**Mechanism**: COMBO — Union Ascent. Sequence: moveRight → moveUp → attack (→ ↑ A). Cost: 15. Type: attack. Wall climb + dive: v_combo_entry=1.500 m/s; h_combo=h_wall=9.0 cm; v_combo_contact=1.329 m/s (no η_switch in combo); J_combo=5.104×10⁻² N·s; Xtend+ point re-engage Δω=+6 rad/s (η=0.13); dmgMult 1.30×; lockMs 100. dmgMult 1.30× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Wall-ride Xtend+ dive (Case 2012)

---

### [Case 2015 — Victory Valtryek Boost Variable — Stadium Outer Rim Variable Speed Surge](./15%20case%20study.md#case-2015)

**System**: Burst God (3-part)  
**Blader**: Valt Aoi  
**Geometry**: m=44.0 g; Victory Valtryek layer r=3.2 cm; Boost disc r=2.2 cm; Variable driver r_stable=0.4 cm, r_boost=0.5 cm; I_total=3.361×10⁻⁵ kg·m²; ω₀=700 rad/s  
**Mechanism**: Variable stable mode v_mode1=0.980 m/s (μ=0.35); outer rim triggers boost mode: μ=0.70 r=5mm → v_rim_base=2.450 m/s; η_rim_outer=1.50 → v_outer_rim_peak=3.675 m/s (3.75× stable). First hit: J_first=1.340×10⁻¹ N·s Δv=3.350 m/s; lap follow-up η=0.60 → J_lap=8.040×10⁻²; J_total_UFL=2.144×10⁻¹ N·s → Δv_total=5.360 m/s.  
**Gimmick**: Variable driver outer rim exponential speed surge + lap multi-hit → MechanicRegistry: outer_rim_surge. Compatible also: Genesis Valtryek 6Vortex Reboot (same v_rim_peak via Reboot rubber ring, cross-ref Case 1991)

---

### [Case 2016 — Valt Aoi / Victory Valtryek Boost Variable — Ultra Flash Launch](./15%20case%20study.md#case-2016)

**System**: Burst God / Surge  
**Blader**: Valt Aoi  
**Special Move**: Ultra Flash Launch (JP: Shin Furasshu Shūto — True Flash Shoot) — Variable outer rim η_rim_outer=1.50; v_outer_rim_peak=3.675 m/s (3.75× stable, described as "exponential"); J_first=1.340×10⁻¹ N·s; lap η=0.60 follow-up; J_total=2.144×10⁻¹ N·s → Δv_total=5.360 m/s; Δω_drain=204.2 rad/s (70.8% retained — two-hit). [M] Valt Valtryek flash-drive ×8.0 → Δv_total=42.88 m/s. powerCost 100. Genesis Valtryek 6Vortex Reboot achieves same outer rim peak (cross-ref Case 1991). Evolved from Flash Launch (stable-mode only). Distinct from Ultimate Flash Launch (inner groove η=1.35) and Ultimate Flash V (Variable' mode switch).  
**Compatible beys**: Burst God/Surge Variable driver (r_boost ≥ 4 mm, μ_boost ≥ 0.60) or rubber-ring equivalent in stadium with raised outer rim lip (η_rim_outer ≥ 1.40); standard: Victory Valtryek Boost Variable and Genesis Valtryek 6Vortex Reboot (Valt Aoi, Burst God/Surge)

---

### [Case 2017 — Valt Aoi / Victory Valtryek Boost Variable — Flash Rim](./15%20case%20study.md#case-2017)

**System**: Burst God  
**Mechanism**: COMBO — Flash Rim. Sequence: moveRight → moveRight → attack (→ → A). Cost: 15. Type: attack. Double outer rim arc: v_arc1=2.573 m/s (70% peak), v_arc2=3.234 m/s (88% peak); J_combo=1.179×10⁻¹ N·s; Variable rim rebound Δω=+11 rad/s (η_var_rim=0.10); dmgMult 1.40×; lockMs 0. dmgMult 1.40× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Outer rim Variable surge (Case 2015)

---

### [Case 2018 — Dragoon V2 — Extreme Sprint Wall-Launch + 270° Flanking Arc](./15%20case%20study.md#case-2018)

**System**: Plastic-gen V-Force (5-part)  
**Blader**: Tyson Granger  
**Geometry**: m=39.0 g; Upper Dragoon AR r=2.8 cm; Wide Survivor WD r=3.0 cm; Customize Grip Base r_BB=0.5 cm; I_total=2.353×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Extreme sprint: μ_vanish=0.80 → v_sprint=2.000 m/s (1.78× standard flat); wall-launch h_wall=6.0 cm; 270° in-air flanking arc η_arc=0.95 lands behind opponent; rear approach: v_contact_rear=v_sprint+v_opp_drift=2.000+0.300=2.300 m/s (drift adds); m_eff=1.975×10⁻² kg; e=0.78; J_VA=8.086×10⁻² N·s → Δv_opp=2.022 m/s.  
**Gimmick**: Extreme sprint rear-flanking approach → MechanicRegistry: vanish_flank

---

### [Case 2019 — Tyson Granger / Dragoon V2 — Vanishing Attack](./15%20case%20study.md#case-2019)

**System**: Plastic-gen V-Force  
**Blader**: Tyson Granger  
**Special Move**: Vanishing Attack — flat-tip extreme sprint μ=0.80 v_sprint=2.000 m/s (1.78× standard); wall-launch h=6.0 cm; 270° in-air flanking arc; rear attack v_contact_rear=2.300 m/s (opponent drift adds +0.300 m/s); J_VA=8.086×10⁻² N·s → Δv=2.022 m/s; Δω_drain=96.2 rad/s (80.8% retained). [M] Tyson Dragoon vanishing-speed ×8.0 → Δv=16.18 m/s. powerCost 100. Force applied from behind target. Rear-attack flanking bonus exclusive to 270° approach trajectory.  
**Compatible beys**: Plastic-gen flat-type Blade Base (r ≥ 4 mm, μ_peak ≥ 0.70; v_sprint ≥ 1.80 m/s) in standard plastic-gen stadium (h_wall ≥ 5.0 cm); standard: Dragoon V2 (Tyson Granger, Bakuten Shoot V-Force)

---

### [Case 2020 — Tyson Granger / Dragoon V2 — Phantom Flank](./15%20case%20study.md#case-2020)

**System**: Plastic-gen V-Force  
**Mechanism**: COMBO — Phantom Flank. Sequence: dodge → moveLeft → attack (E ← A). Cost: 15. Type: attack. Vanish sprint 80% + flank arc 90% + rear drift 80%: v_contact_rear_combo=1.680 m/s; J_combo=5.906×10⁻² N·s; sprint arc reversion Δω=+8 rad/s (η_sprint=0.12); dmgMult 1.30×; lockMs 0. Force applied from behind target. dmgMult 1.30× ≤ 1.5 ✓; lockMs 0 ≤ 300 ✓.  
**Gimmick**: Parent: Extreme sprint rear flank (Case 2018)

---

### [Case 2021 — Venus — Temptation Resonance Field + Bit-Beast Venus Full Manifestation](./15%20case%20study.md#case-2021)

**System**: Plastic-gen G-Revolution (5-part)  
**Blader**: Ming-Ming  
**Geometry**: m=35.0 g; Venus Bloom AR r=2.6 cm; Round Heavy WD r=2.8 cm; Venus Sharp Base r_BB=0.4 cm; I_total=1.820×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Temptation resonance field: e_tempt=0.06 (idol spirit disrupts opponent's precession damping → +6% burst compliance). Bit-Beast Venus full manifestation: v_contact_base=1.400 m/s (tip+BEGA guidance) → η_Venus_BB=1.45 → v_contact_Venus=2.030 m/s; e_eff=0.78; m_eff=1.867×10⁻² kg; J_VT=6.746×10⁻² N·s → Δv_opp=1.687 m/s. Sharp base: Bit-Beast provides primary attack force (not tip orbital speed).  
**Gimmick**: Idol resonance field + Bit-Beast manifestation strike → MechanicRegistry: temptation_resonance

---

### [Case 2022 — Ming-Ming / Venus — Venus Temptation](./15%20case%20study.md#case-2022)

**System**: Plastic-gen G-Revolution  
**Blader**: Ming-Ming  
**Special Move**: Venus Temptation — temptation resonance field e_tempt=0.06; Venus BB η=1.45; v_contact_Venus=2.030 m/s; e_eff=0.78; J_VT=6.746×10⁻² N·s → Δv=1.687 m/s; Δω_drain=96.4 rad/s (80.7% retained). [M] Ming-Ming Venus idol divine spirit ×7.5 → Δv=12.65 m/s. powerCost 100. First used vs Daichi / Strata Dragoon in Episode 43. BEGA antagonist, top-tier G-Revolution blader; stadium transforms to "happy lovely world" before BB charge. Sharp base relies on BB force not tip orbital speed.  
**Compatible beys**: Plastic-gen Bit-Beast full manifestation BB (η_BB ≥ 1.30) + precision/stamina Blade Base (r ≤ 5 mm) + temptation-field BeySpirit; standard: Venus (Ming-Ming, Bakuten Shoot G-Revolution Ep.43)

---

### [Case 2023 — Ming-Ming / Venus — Lovely Strike](./15%20case%20study.md#case-2023)

**System**: Plastic-gen G-Revolution  
**Mechanism**: COMBO — Lovely Strike. Sequence: moveDown → defense → attack (↓ K A). Cost: 15. Type: attack. Partial temptation + 80% BB: e_tempt_combo=0.03; v_combo_contact=1.624 m/s; J_combo=5.307×10⁻² N·s; BB resonance rebound Δω=+10 rad/s (η_BB_rebound=0.13); dmgMult 1.30×; lockMs 150 (lovely world mesmerize dwell). dmgMult 1.30× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Temptation resonance + BB manifestation (Case 2021)

---

### [Case 2024 — Poison Serpent SW145SD — SW145 Pendulum Energy Storage + Dark Power Rise-Strike](./15%20case%20study.md#case-2024)

**System**: MFB Metal Fusion (5-part)  
**Blader**: Reiji Mizuchi  
**Geometry**: m=33.5 g; Poison MW r=3.1 cm; Serpent CW r=3.3 cm; SW145 r_arm=2.2 cm; SD tip r=0.4 cm; I_total=2.545×10⁻⁵ kg·m²; ω₀=580 rad/s  
**Mechanism**: SW145 swing arm pendulum energy storage (θ_max=15°, m_arm≈2.5g each, 2 arms): E_pend=0.4069 J; lock-release v_rise=4.929 m/s. Dark Power amplification η_dark=1.35 → v_rise_dark=6.654 m/s (=v_strike). Contact: m_eff=1.823×10⁻² kg; e_dark=0.90 (near-perfect burst restitution — "opponent bey explodes in mid-air"); J_VS=2.305×10⁻¹ N·s → Δv_opp=5.762 m/s.  
**Gimmick**: SW145 pendulum energy storage + Dark Move rise-strike → MechanicRegistry: dark_move_rise_strike

---

### [Case 2025 — Reiji Mizuchi / Poison Serpent SW145SD — Venom Strike](./15%20case%20study.md#case-2025)

**System**: MFB Metal Fusion  
**Blader**: Reiji Mizuchi  
**Special Move**: Venom Strike (JP: Venom Genocide / Benom Jenosaido) — SW145 pendulum E_pend=0.4069 J; Dark Power η_dark=1.35; v_rise_dark=6.654 m/s; e_dark=0.90; J_VS=2.305×10⁻¹ N·s → Δv=5.762 m/s; Δω_drain=280.8 rad/s (51.6% retained). [M] Reiji Dark Power Serpent ×7.0 → Δv=40.33 m/s. powerCost 100. Dark Move classification (same family as Dragon Emperor Soaring Bite Strike). Opponent bey explodes mid-air. First used vs Hyoma/Rock Aries in Metal Fusion. Reiji's only Dark Move.  
**Compatible beys**: MFB SW145 Swing Track (r_pend ≥ 2.0 cm) + compact burst-profile MW (e_dark ≥ 0.85) + Dark Power blader (η_dark ≥ 1.25); standard: Poison Serpent SW145SD (Reiji Mizuchi, Metal Fight Beyblade Metal Fusion)

---

### [Case 2026 — Reiji Mizuchi / Poison Serpent SW145SD — Venom Coil](./15%20case%20study.md#case-2026)

**System**: MFB Metal Fusion  
**Mechanism**: COMBO — Venom Coil. Sequence: moveDown → dodge → attack (↓ E A). Cost: 15. Type: attack. Partial pendulum 60% + partial Dark Power η_dark_combo=1.15: E_pend_combo=0.2441 J; v_rise_combo=3.817 m/s; v_strike_combo=4.390 m/s; e_combo=0.76; J_combo=1.408×10⁻¹ N·s; SW145 arm rebound Δω=+17 rad/s (η_SW_rebound=0.10); dmgMult 1.35×; lockMs 80. dmgMult 1.35× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: SW145 pendulum Dark Move (Case 2024)

---

### [Case 2027 — Variant Lucifer Mobius 2D — Double Bash + 2D Barrier Pincer](./15%20case%20study.md#case-2027)

**System**: Burst DB (4-part)  
**Blader**: Lain Valhalla  
**Geometry**: m=47.0 g; Variant Lucifer blade r=3.8 cm; Mobius ratchet r=2.6 cm; 2D driver r=0.5 cm; I_total=4.583×10⁻⁵ kg·m²; ω₀=700 rad/s  
**Mechanism**: Double bash: J_bash1=6.768×10⁻² N·s (v=1.800 m/s); J_bash2=5.415×10⁻² N·s (v=1.440 m/s). Wall ram: v_ram=2.200 m/s; J_wall=7.131×10⁻² N·s. 2D barrier extension v=1.500 m/s; J_crush=5.024×10⁻² N·s. J_VEX=2.434×10⁻¹ N·s → Δv_opp=6.084 m/s. (DB Core excluded from I; r≈0.)  
**Gimmick**: Double bash + wall ram + 2D barrier pincer → MechanicRegistry: barrier_pincer_crush

---

### [Case 2028 — Lain Valhalla / Variant Lucifer Mobius 2D — Vexing Crush](./15%20case%20study.md#case-2028)

**System**: Burst DB  
**Blader**: Lain Valhalla  
**Special Move**: Vexing Crush (JP: Barianto Puresu — Variant Press) — 4-phase assault: J_bash1=6.768×10⁻²+J_bash2=5.415×10⁻²+J_wall=7.131×10⁻²+J_crush=5.024×10⁻² = J_VEX=2.434×10⁻¹ N·s → Δv=6.084 m/s; Δω_drain=201.8 rad/s (71.2% retained); lockMs=200 (barrier pincer dwell). [M] Lain Lucifer supreme pressure ×8.0 → Δv=48.67 m/s. powerCost 100. Lucius bashes twice, rams into wall, then pins opponent between 2D barrier and wall. DB-era stadium required for barrier wall range.  
**Compatible beys**: Burst DB 2D driver (v_extend ≥ 1.20 m/s) + wide high-armor blade (r ≥ 3.5 cm, e ≥ 0.70); standard: Variant Lucifer Mobius 2D (Lain Valhalla, Burst DB)

---

### [Case 2029 — Lain Valhalla / Variant Lucifer Mobius 2D — Variant Crush](./15%20case%20study.md#case-2029)

**System**: Burst DB  
**Mechanism**: COMBO — Variant Crush. Sequence: moveRight → attack → defense (→ A K). Cost: 25. Type: attack. Double bash (80/75%)+2D partial (no wall assist): J_combo_bash1=5.415×10⁻²+J_combo_bash2=4.062×10⁻²+J_barrier_combo=3.760×10⁻² → J_combo=1.324×10⁻¹ N·s; 2D barrier spring rebound Δω=+10 rad/s (η_2D=0.09); dmgMult 1.40×; lockMs 200. dmgMult 1.40× ≤ 1.5 ✓; lockMs 200 ≤ 300 ✓.  
**Gimmick**: Parent: Double bash 2D barrier (Case 2027)

---

### [Case 2030 — Dragoon V / Dragoon Victory — Multi-Vortex Storm Generation (Main + 3 Sub-Vortices)](./15%20case%20study.md#case-2030)

**System**: Plastic-gen (5-part; manga Vol.7 Ch.2 / anime / PS game)  
**Blader**: Tyson Granger  
**Geometry**: m=32.0 g; Dragon Wing AR r=2.5 cm; Ten Heavy WD r=2.6 cm; Flat Base V r_BB=0.4 cm; I_total=1.438×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Main vortex Γ_main=0.982 m²/s. 3 sub-vortices (manga/PS depiction): Γ_sub=0.295 m²/s each; Γ_total=1.866 m²/s; η_sub=1.60. Tornado-propelled approach v_base=2.400 m/s (v_tip_flat=1.100+BeySpirit surge=1.300); m_eff=1.778×10⁻² kg; e=0.74; J_VTorn=1.188×10⁻¹ N·s → Δv_opp=2.970 m/s. Spin drain 206.5 rad/s (58.7% retained).  
**Gimmick**: Multi-vortex storm (manga/PS: 3 sub-vortices; anime: single cloak rush) → MechanicRegistry: multi_vortex_storm. Debuted manga Vol.7 Ch.2 vs Ozuma/Flash Leopard

---

### [Case 2031 — Tyson Granger / Dragoon V — Victory Tornado](./15%20case%20study.md#case-2031)

**System**: Plastic-gen  
**Blader**: Tyson Granger  
**Special Move**: Victory Tornado (JP: 勝利竜巻) — multi-vortex Γ_main=0.982 m²/s, N_sub=3, Γ_total=1.866 m²/s; η_sub=1.60; v_base=2.400 m/s; J_VTorn=1.188×10⁻¹ N·s → Δv=2.970 m/s; Δω_drain=206.5 rad/s (58.7% retained). [M] Tyson Dragoon storm ×8.0 → Δv=23.76 m/s. powerCost 100. Anime=single vortex cloak rush; manga/PS=3 sub-vortices around main column (can address multiple opponents simultaneously). Debuted manga Vol.7 Ch.2 vs Ozuma/Flash Leopard.  
**Compatible beys**: Plastic-gen 4-blade AR (r ≥ 2.3 cm; Γ_main ≥ 0.85 m²/s at ω₀ ≥ 480) + flat Blade Base (μ ≥ 0.50, r ≥ 3 mm) + BeySpirit tornado amplification; standard: Dragoon V (Tyson Granger, Bakuten Shoot Beyblade)

---

### [Case 2032 — Tyson Granger / Dragoon V — Tornado Vortex](./15%20case%20study.md#case-2032)

**System**: Plastic-gen  
**Mechanism**: COMBO — Tornado Vortex. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 15. Type: attack. 2 of 3 sub-vortices active (η_sub_combo=1.40); v_combo_approach=1.800 m/s (75% base); J_combo=7.797×10⁻² N·s; sub-vortex rebound Δω=+16 rad/s (η_vortex_rebound=0.12); dmgMult 1.35×; lockMs 100. dmgMult 1.35× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Multi-vortex storm (Case 2030)

---

### [Case 2033 — Draciel V — Turtle Survivor AR Vortex Wall + Spring SG Shock Absorption](./15%20case%20study.md#case-2033)

**System**: Plastic-gen V-Force (5-part)  
**Blader**: Max Tate  
**Geometry**: m=35.5 g; Turtle Survivor AR r=2.6 cm; Eight Heavy WD r=2.8 cm; Defense Grip Base r_rubber=0.3 cm; Spring SG r=0.3 cm; I_total=1.751×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Viper storm Rankine vortex: Γ=1.062 m²/s; v_θ=3.380 m/s at r=5.0 cm; deflects incoming opponent 70.5° off attack path. Combined contact: v_eff_total=2.290 m/s; e_turtle=0.82; m_eff=1.881×10⁻² kg; J_VW=7.843×10⁻² N·s → Δv_opp=1.961 m/s. Spring SG absorbs 40%: Δω_drain=69.9 rad/s (86.0% retained vs 116.5 without — saves 9.3% spin).  
**Gimmick**: Vortex wall deflection + Spring SG shock absorption → MechanicRegistry: vortex_wall_defense

---

### [Case 2034 — Max Tate / Draciel V — Viper Wall](./15%20case%20study.md#case-2034)

**System**: Plastic-gen V-Force  
**Blader**: Max Tate  
**Special Move**: Viper Wall — defense type. Viper storm vortex: Γ=1.062 m²/s; v_θ=3.380 m/s at r=5.0 cm; incoming deflected 70.5°. Combined contact v_eff_total=2.290 m/s; e_turtle=0.82; J_VW=7.843×10⁻² N·s → Δv_opp=1.961 m/s (opponent deflected outward). Spring SG η=0.40 absorbs 40%: ω_remain=430.1 rad/s (86.0% retained). Black Turtle (Genbu) spirit entwined with serpent/viper — name references Chinese mythology. Distinct from vortex-attack moves.  
**Compatible beys**: Plastic-gen 8-wall round-bumper AR (high deflection restitution, e ≥ 0.80) + Spring SG + rubber ball/grip Blade Base; standard: Draciel V (Max Tate, Bakuten Shoot V-Force)

---

### [Case 2035 — Max Tate / Draciel V — Viper Shield](./15%20case%20study.md#case-2035)

**System**: Plastic-gen V-Force  
**Mechanism**: COMBO — Viper Shield. Sequence: defense → moveDown → defense (K ↓ K). Cost: 15. Type: defense. Partial viper storm 60% + Spring SG pre-compression: v_θ_combo=2.028 m/s; v_combo_contact=1.718 m/s; e_combo=0.74; J_combo=5.622×10⁻² N·s; Spring SG rebound Δω=+13 rad/s (η_SG_rebound=0.15); dmgMult 1.20× (outward deflection — defense focus); lockMs 200. Force applied outward from Draciel center. dmgMult 1.20× ≤ 1.5 ✓; lockMs 200 ≤ 300 ✓.  
**Gimmick**: Parent: Vortex wall defense (Case 2033)

---

### [Case 2036 — Dranzer V — Volcanic Fire Blade Ignition](./15%20case%20study.md#case-2036)

**System**: Plastic-gen V-Force (5-part)  
**Blader**: Kai Hiwatari  
**Geometry**: m=34.0 g; Volcano Blade AR r=2.7 cm; Eight WD r=2.5 cm; Spike Base r_BB=0.2 cm (needle); I_total=1.662×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Spike Base needle orbit μ_sharp=0.25 r=2mm: v_tip=0.250 m/s; Kai precision charge v_approach=1.800 m/s; v_contact_base=2.050 m/s. Volcanic fire blade coating η_volcano=1.30; m_eff=1.838×10⁻² kg; e_blade=0.76; J_VE=8.620×10⁻² N·s → Δv_opp=2.155 m/s. Spike needle: ultra-low tip friction maximizes spin retention; attack force from AR blade contact.  
**Gimmick**: Volcanic fire AR coating + precision needle approach → MechanicRegistry: volcanic_fire_blade

---

### [Case 2037 — Kai Hiwatari / Dranzer V — Volcano Emission](./15%20case%20study.md#case-2037)

**System**: Plastic-gen V-Force  
**Blader**: Kai Hiwatari  
**Special Move**: Volcano Emission — volcanic fire coating η_volcano=1.30; v_contact_base=2.050 m/s; e_blade=0.76; J_VE=8.620×10⁻² N·s → Δv=2.155 m/s; Δω_drain=140.0 rad/s (72.0% retained). [M] Kai Dranzer phoenix volcanic fire ×9.0 → Δv=19.40 m/s. powerCost 100. Creates "volcano blaze on the blade" — Dranzer V's Volcano Blade AR ignites with phoenix fire energy at moment of BeySpirit peak. Spike needle preserves spin outside strike.  
**Compatible beys**: Plastic-gen V-Force fire-type AR (r ≥ 2.5 cm, blade-edge profile, e ≥ 0.72) + sharp/needle Blade Base (r ≤ 3 mm, μ ≤ 0.30) + volcanic fire BeySpirit (η_volcano ≥ 1.20); standard: Dranzer V (Kai Hiwatari, Bakuten Shoot V-Force)

---

### [Case 2038 — Kai Hiwatari / Dranzer V — Volcano Blade](./15%20case%20study.md#case-2038)

**System**: Plastic-gen V-Force  
**Mechanism**: COMBO — Volcano Blade. Sequence: moveRight → attack → moveUp (→ A ↑). Cost: 15. Type: attack. Partial volcanic ignition η_volcano_combo=1.15; v_combo_contact=1.538 m/s; J_combo=5.721×10⁻² N·s; fire rebound Δω=+11 rad/s (η_fire_rebound=0.12); dmgMult 1.30×; lockMs 80. dmgMult 1.30× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Volcanic fire blade (Case 2036)

---

### [Case 2039 — Dranzer V2 — Explosion-Propelled Fire Projectile](./15%20case%20study.md#case-2039)

**System**: Plastic-gen V-Force (5-part; manga / anime / GBA)  
**Blader**: Kai Hiwatari  
**Geometry**: m=36.0 g; Volcano Blade V2 AR r=2.8 cm; Ten Heavy WD r=2.7 cm; Spike Base II r_BB=0.2 cm; I_total=1.989×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Explosion propulsion: η_explosion=1.60 (manga: grenade-like detonation propels bey forward); v_base=1.800 m/s → v_contact=2.880 m/s. On-impact explosive restitution e_excellent=0.88 (manga: demolishes concrete); m_eff=1.895×10⁻² kg; J_VEE=1.026×10⁻¹ N·s → Δv_opp=2.564 m/s. GBA: classified Super Finish (超必殺) — highest power tier. Debuted manga vs Leon Zagart/Burning Cerberus.  
**Gimmick**: Explosion-propelled fire projectile + on-impact detonation → MechanicRegistry: explosive_fire_launch

---

### [Case 2040 — Kai Hiwatari / Dranzer V2 — Volcano Excellent Emission](./15%20case%20study.md#case-2040)

**System**: Plastic-gen V-Force (manga / anime / GBA)  
**Blader**: Kai Hiwatari  
**Special Move**: Volcano Excellent Emission (JP: 超爆炎放射 — Chō Bakuen Hōsha) — explosion η_explosion=1.60; v_contact=2.880 m/s; e_excellent=0.88; J_VEE=1.026×10⁻¹ N·s → Δv=2.564 m/s; Δω_drain=144.4 rad/s (71.1% retained). [M] Kai Dranzer super-explosive fire ×9.0 → Δv=23.08 m/s. powerCost 100. GBA: Super Finish tier. Anime: bey engulfed in thick flames. Manga: grenade-detonation propulsion, demolishes concrete on impact. Upgrade from Volcano Emission (η_explosion vs η_volcano). Debuted manga vs Leon Zagart/Burning Cerberus.  
**Compatible beys**: Plastic-gen V-Force explosive-edge AR (r ≥ 2.6 cm; e_excellent ≥ 0.84) + explosive-charge Blade Base (η_explosion ≥ 1.40, r ≤ 3 mm) + Super Finish BeySpirit; standard: Dranzer V2 (Kai Hiwatari, Bakuten Shoot V-Force)

---

### [Case 2041 — Kai Hiwatari / Dranzer V2 — Volcano Excellent](./15%20case%20study.md#case-2041)

**System**: Plastic-gen V-Force  
**Mechanism**: COMBO — Volcano Excellent. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 25. Type: attack. Partial explosion η_explosion_combo=1.35; v_combo_contact=1.944 m/s; e_combo=0.76; J_combo=6.483×10⁻² N·s; explosion rebound Δω=+11 rad/s (η_explosion_rebound=0.12); dmgMult 1.40×; lockMs 80. dmgMult 1.40× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Explosion fire projectile (Case 2039)

---

### [Case 2042 — Driger V — Tiger Claw Rapid-Fire Shredding Barrier](./15%20case%20study.md#case-2042)

**System**: Plastic-gen V-Force (5-part)  
**Blader**: Ray Kon  
**Geometry**: m=36.0 g; Tiger Claw AR r=2.7 cm; Eight Heavy WD r=2.8 cm; Defense Ball Base r_ball=0.3 cm; I_total=1.887×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Tiger Claw rapid-fire N=4 (one strike per claw, η_decay=0.80): J_single=4.723×10⁻² N·s (v_claw=1.400 m/s, e_claw=0.78); geometric sum (N=4 η=0.80)=2.952; J_VC=1.395×10⁻¹ N·s → Δv_opp=3.487 m/s. White Tiger (Byakko 白虎) — guardian of the West; kanji name: 白虎連射爪 (Byakko Rensha Sō — White Tiger Rapid-Fire Claw). First used vs Joseph/Vanishing Moot.  
**Gimmick**: N=4 rapid-fire claw shredding barrier → MechanicRegistry: rapid_fire_claw

---

### [Case 2043 — Ray Kon / Driger V — Vulcan Claw](./15%20case%20study.md#case-2043)

**System**: Plastic-gen V-Force  
**Blader**: Ray Kon  
**Special Move**: Vulcan Claw (JP: 白虎連射爪 — Byakko Rensha Sō) — Tiger Claw N=4 rapid-fire η_decay=0.80; J_VC=1.395×10⁻¹ N·s (geometric sum=2.952) → Δv=3.487 m/s; Δω_drain=199.6 rad/s (60.1% retained). [M] Ray Driger White Tiger ×8.0 → Δv=27.90 m/s. powerCost 100. Shredding barrier = 4-claw sequential contact forming enclosing claw field. White Tiger spirit (Byakko) manifests as defensive barrier. First used vs Joseph/Vanishing Moot.  
**Compatible beys**: Plastic-gen multi-claw AR (r ≥ 2.5 cm, N_claw ≥ 3, e_claw ≥ 0.74) + metal ball/semi-flat Base (μ ≤ 0.40); standard: Driger V (Ray Kon, Bakuten Shoot V-Force)

---

### [Case 2044 — Ray Kon / Driger V — Vulcan Barrier](./15%20case%20study.md#case-2044)

**System**: Plastic-gen V-Force  
**Mechanism**: COMBO — Vulcan Barrier. Sequence: moveRight → moveUp → attack (→ ↑ A). Cost: 15. Type: attack. 3-claw rapid-fire 75% speed: J_single_combo=3.542×10⁻²; sum(N=3 η=0.80)=2.440; J_combo=8.642×10⁻² N·s; Tiger Claw rebound Δω=+14 rad/s (η_claw_rebound=0.11); dmgMult 1.35×; lockMs 120. dmgMult 1.35× ≤ 1.5 ✓; lockMs 120 ≤ 300 ✓.  
**Gimmick**: Parent: Tiger Claw rapid-fire (Case 2042)

---

### [Case 2045 — Driger V2 — Bit-Beast Upper Claw + N=6 Innumerable Claw Swipes](./15%20case%20study.md#case-2045)

**System**: Plastic-gen V-Force (5-part)  
**Blader**: Ray Kon  
**Geometry**: m=37.5 g; Tiger Defenser AR r=2.8 cm; Ten Heavy WD r=2.8 cm; Neo Right SG r=0.3 cm; Metal Ball Base V2 r=0.3 cm; I_total=2.048×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Upper attack η_upper=1.10 (10% contact boost from below) v_upper=1.760 m/s. Driger BB full manifestation η_Driger_BB=1.30. N_claw=6 (innumerable swipes) η_decay=0.75; geometric sum=3.288; J_base_single=6.130×10⁻² N·s; J_rapid=2.016×10⁻¹ N·s; J_VPC=J_rapid×η_BB=2.621×10⁻¹ N·s → Δv_opp=6.553 m/s. Extreme drain: Δω=358.3 rad/s (28.3% retained — used twice total).  
**Gimmick**: Bit-Beast full manifestation upper claw + N=6 innumerable swipes → MechanicRegistry: bb_upper_claw_swipes. Ep.40 debut; Ep.48 vs Gordo/Blizzard Orthrus

---

### [Case 2046 — Ray Kon / Driger V2 — Vulcan Power Claw](./15%20case%20study.md#case-2046)

**System**: Plastic-gen V-Force  
**Blader**: Ray Kon  
**Special Move**: Vulcan Power Claw (JP: Barucan Pawā Kurō) — upper attack η_upper=1.10; Driger BB η=1.30; N=6 innumerable swipes η_decay=0.75 sum=3.288; J_VPC=2.621×10⁻¹ N·s → Δv=6.553 m/s; Δω_drain=358.3 rad/s (28.3% retained — maximum output, used twice). [M] Ray Driger White Tiger supreme claw ×8.0 → Δv=52.42 m/s. powerCost 100. GBA: "barrier of blades + innumerable claw swipes." Ep.40 debut; Ep.48 vs Gordo/Blizzard Orthrus.  
**Compatible beys**: Plastic-gen improved multi-claw AR (r ≥ 2.6 cm, N_claw ≥ 5, e ≥ 0.78) + upper-attack trajectory (η_upper ≥ 1.08) + full BB manifestation (η_BB ≥ 1.25); standard: Driger V2 (Ray Kon, Bakuten Shoot V-Force)

---

### [Case 2047 — Ray Kon / Driger V2 — Vulcan Power Strike](./15%20case%20study.md#case-2047)

**System**: Plastic-gen V-Force  
**Mechanism**: COMBO — Vulcan Power Strike. Sequence: moveUp → attack → moveRight (↑ A →). Cost: 25. Type: attack. 4-claw + partial BB (η_BB_combo=1.15): v_upper_combo=1.320 m/s; sum(N=4 η=0.75)=2.734; J_combo=1.446×10⁻¹ N·s; Driger BB rebound Δω=+20 rad/s (η_Driger_rebound=0.10); dmgMult 1.45×; lockMs 150. dmgMult 1.45× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: BB upper claw (Case 2045)

---

### [Case 2048 — Xiphoid Xcalius Xanthus Sword' — Sword-Tip Point-Pierce Concentrated Strike](./15%20case%20study.md#case-2048)

**System**: Burst DB (5-part layered system)  
**Blader**: Xander Shakadera  
**Geometry**: m=78.8 g; Xiphoid Blade r_tip=3.3 cm; DB Core Xcalius r=1.0 cm; Armor 1 r=1.8 cm; Xanthus disc r=2.6 cm; Sword' driver r=0.5 cm; I_total=3.500×10⁻⁵ kg·m²; ω₀=700 rad/s  
**Mechanism**: Sword-tip geometry: r_tip=33mm v_tip=23.10 m/s; contact area A_tip=3.142×10⁻⁶ m² (single point); pierce: η_pierce=1.30 (reduced deformation loss); e_sword=0.88 (near-elastic hard-tip); v_approach=2.200 m/s; m_eff=3.562×10⁻² kg (78.8g vs 65g opp); J_XS=1.915×10⁻¹ N·s → Δv_opp=2.946 m/s. Contact pressure P_tip=152.4 MPa (2.77× ABS yield — massive blade damage confirmed).  
**Gimmick**: Sword-tip point-pierce concentrated strike → MechanicRegistry: point_pierce_strike. DB Core Xcalius + Xanthus (Achilles's immortal horse) disc lineage

---

### [Case 2049 — Xander Shakadera / Xiphoid Xcalius Xanthus Sword' — Xiphoid Saber](./15%20case%20study.md#case-2049)

**System**: Burst DB  
**Blader**: Xander Shakadera  
**Special Move**: Xiphoid Saber — sword-tip pierce η_pierce=1.30; v_approach=2.200 m/s; e_sword=0.88; J_XS=1.915×10⁻¹ N·s → Δv=2.946 m/s; Δω_drain=180.6 rad/s (74.2% retained); P_tip=152.4 MPa (2.77× ABS yield). [M] Xander Shakadera Xcalius sword-tip ×7.5 → Δv=22.10 m/s. powerCost 100. Direct linear charge — no arc, no tornado. All mass and spin concentrated into single-point contact. Visible deformation at contact point.  
**Compatible beys**: Burst DB pointed Blade (r_tip ≥ 3.0 cm, tip radius ≤ 1.5 mm, η_pierce ≥ 1.20) + directed sharp Driver (Sword'/Xtreme') + large-span disc (r_CoM ≥ 2.4 cm); standard: Xiphoid Xcalius Xanthus Sword' (Xander Shakadera, Burst DB)

---

### [Case 2050 — Xander Shakadera / Xiphoid Xcalius Xanthus Sword' — Xiphoid Strike](./15%20case%20study.md#case-2050)

**System**: Burst DB  
**Mechanism**: COMBO — Xiphoid Strike. Sequence: moveRight → moveUp → attack (→ ↑ A). Cost: 25. Type: attack. Partial sword pierce 75% + partial alignment η_pierce_combo=1.15: v_combo=1.650 m/s; e_combo=0.78; J_combo=1.203×10⁻¹ N·s; tip rebound Δω=+11 rad/s (η_tip_rebound=0.10); dmgMult 1.40×; lockMs 80. dmgMult 1.40× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Sword-tip point-pierce (Case 2048)

---

### [Case 2051 — Vulcan Horuseus 145D — Horuseus Wing-Beat Directed Wind Cannon](./15%20case%20study.md#case-2051)

**System**: MFB Metal Masters (5-part)  
**Blader**: Nile  
**Geometry**: m=38.5 g; Vulcan Fusion Wheel r=3.0 cm; Horuseus Energy Ring r=2.4 cm; 145 track r=0.6 cm; D tip r=0.5 cm; I_total=3.000×10⁻⁵ kg·m²; ω₀=630 rad/s  
**Mechanism**: Vulcan rim tip speed v_wing_tip=18.90 m/s (ω₀×r_FW=630×0.030). Wing-beat concentration η_wing_direct=0.50 → v_blast=9.450 m/s. Aerodynamic drag: F_blast=1.074×10⁻¹ N (A_eff=1.963×10⁻³ m²); J_single=3.221×10⁻² N·s; N=3 shots η_decay=0.90 sum=2.710; J_VC=8.729×10⁻² N·s → Δv_opp=2.267 m/s. D free-spin (μ≈0.10) maintains stable orbit between shots.  
**Gimmick**: Centrifugal wind cannon redirected by Horuseus wing-beat geometry → MechanicRegistry: wind_cannon. Horus (Egyptian falcon/sky deity) spirit

---

### [Case 2052 — Nile / Vulcan Horuseus 145D — Vulcan Cannon](./15%20case%20study.md#case-2052)

**System**: MFB Metal Masters  
**Blader**: Nile  
**Special Move**: Vulcan Cannon — no official name; activation phrase "Flap Your Wings, Horuseus." Vulcan centrifugal wind v_wing_tip=18.90 m/s; η_wing_direct=0.50; v_blast=9.450 m/s; N=3 shots η_decay=0.90; J_VC=8.729×10⁻² N·s → Δv=2.267 m/s; Δω_drain=87.3 rad/s (86.1% retained). [M] Nile Horuseus Egyptian falcon ×7.0 → Δv=15.87 m/s. powerCost 100. Fires pellets of energy / wind blasts (both descriptions produce same effect). First used vs Vridick; used in Nile vs Masamune battle.  
**Compatible beys**: MFB large smooth Fusion Wheel (r_FW ≥ 2.8 cm, v_tip ≥ 17 m/s) + wing-tip Energy Ring (N_wing ≥ 2, r_ER ≥ 2.2 cm; η_wing_direct ≥ 0.40); standard: Vulcan Horuseus 145D (Nile, Beyblade Metal Masters)

---

### [Case 2053 — Nile / Vulcan Horuseus 145D — Vulcan Shot](./15%20case%20study.md#case-2053)

**System**: MFB Metal Masters  
**Mechanism**: COMBO — Vulcan Shot. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 15. Type: attack. 2-shot 70% blast: v_combo_blast=6.615 m/s; N=2; F_combo=5.262×10⁻² N; J_combo=3.157×10⁻² N·s; wind rebound Δω=+11 rad/s (η_wind_rebound=0.35 — blast rebounds off opponent blade back to Vulcan wheel); dmgMult 1.25×; lockMs 120. dmgMult 1.25× ≤ 1.5 ✓; lockMs 120 ≤ 300 ✓.  
**Gimmick**: Parent: Wind cannon (Case 2051)

---

### [Case 2054 — Zone Lúinor Drake Spiral' Metsu — Slope-Accelerated Metal Zone Layer Base Slam](./15%20case%20study.md#case-2054)

**System**: Burst DB (5-part layered system)  
**Blader**: Lodin Haijima  
**Geometry**: m=72.0 g; Zone Lúinor Blade r=2.5 cm; Drake DB Core r=1.0 cm; Armor 2 r=1.8 cm; Spiral' disc r=2.2 cm; Metsu driver r=0.5 cm (μ≈0.75); I_total=2.635×10⁻⁵ kg·m²; ω₀=700 rad/s  
**Mechanism**: DB-era bowl wall h_wall=3.5 cm; v_base=1.800 m/s → v_contact=1.982 m/s (energy conservation 2gh=0.687 m²/s²). Metal Zone Layer Base contact ring e_metal=0.85; m_eff=3.416×10⁻² kg (72g vs 65g); J_ZS=1.253×10⁻¹ N·s → Δv_opp=1.927 m/s. Lúinor (Longinus — legendary lance) dragon spirit.  
**Gimmick**: Slope-assisted metal contact ring slam → MechanicRegistry: slope_metal_slam

---

### [Case 2055 — Lodin Haijima / Zone Lúinor Drake Spiral' Metsu — Zone Slam](./15%20case%20study.md#case-2055)

**System**: Burst DB  
**Blader**: Lodin Haijima  
**Special Move**: Zone Slam (JP: Tsuvai Sutoreeто — Zwei Straight) — Metsu slope approach v_base=1.800 m/s; h_wall=3.5 cm → v_contact=1.982 m/s; metal Zone Layer Base e_metal=0.85; J_ZS=1.253×10⁻¹ N·s → Δv=1.927 m/s; Δω_drain=118.9 rad/s (83.0% retained). [M] Lodin Lúinor dragon lance ×7.5 → Δv=14.45 m/s. powerCost 100. Japanese name: Zwei Straight (ツヴァイストレート). Bowl wall descent adds 0.687 m²/s² KE to approach.  
**Compatible beys**: Burst DB metallic Zone Layer Base ring (r_metal ≥ 2.2 cm, e_metal ≥ 0.82) + high-friction flat Driver (μ ≥ 0.70) in bowl-stadium (h_wall ≥ 2.5 cm); standard: Zone Lúinor Drake Spiral' Metsu (Lodin Haijima, Burst DB)

---

### [Case 2056 — Lodin Haijima / Zone Lúinor Drake Spiral' Metsu — Zone Charge](./15%20case%20study.md#case-2056)

**System**: Burst DB  
**Mechanism**: COMBO — Zone Charge. Sequence: moveLeft → moveUp → attack (← ↑ A). Cost: 15. Type: attack. Partial slope h_combo=2.5 cm, 75% base speed: v_combo_contact=1.521 m/s; e_combo=0.78; J_combo=9.247×10⁻² N·s; metal rebound Δω=+11 rad/s (η_metal_rebound=0.12); dmgMult 1.35×; lockMs 100. dmgMult 1.35× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Slope metal slam (Case 2054)

---

### [Case 2057 — Zone Lúinor Drake Spiral' Metsu — Drake Disc Phase Alignment: Dual Dragon-Head Hammer Extension](./15%20case%20study.md#case-2057)

**System**: Burst DB (same assembly as Case 2054; I_total=2.635×10⁻⁵ kg·m², ω₀=700 rad/s)  
**Blader**: Lodin Haijima  
**Mechanism**: Drake DB Core dragon-alignment nodes (r=1.4 cm) phase-lock into Zone Layer Base dragon-head grooves at launch → combined hammer tips r_dragon=2.6 cm + Δr_drake=2mm = r_hammer=2.8 cm; v_hammer_tip=19.60 m/s. Dual-hammer enhancement η_align=1.40 (40% impulse increase vs standard Zone metal ring); e_hammer=0.83; v_approach=1.600 m/s; m_eff=3.416×10⁻² kg; J_ZH=1.400×10⁻¹ N·s → Δv_opp=2.154 m/s. Δω_drain=148.8 rad/s (78.7% retained).  
**Gimmick**: Drake disc phase-lock creates dual dragon-head hammer contacts → MechanicRegistry: disc_phase_alignment

---

### [Case 2058 — Lodin Haijima / Zone Lúinor Drake Spiral' Metsu — Zone Hammer](./15%20case%20study.md#case-2058)

**System**: Burst DB  
**Blader**: Lodin Haijima  
**Special Move**: Zone Hammer (JP: Tsuvai Hanmā — Zwei Hammer) — Drake disc phase-alignment: r_hammer=2.8 cm; v_hammer_tip=19.60 m/s; η_align=1.40; e_hammer=0.83; J_ZH=1.400×10⁻¹ N·s → Δv=2.154 m/s; Δω_drain=148.8 rad/s (78.7% retained — higher drain than Zone Slam due to r_hammer). [M] Lodin Lúinor dragon lance ×7.5 → Δv=16.16 m/s. powerCost 100. Japanese name: Zwei Hammer (ツヴァイハンマー). Alignment set at launch — not during battle. Two hammers at 180° spacing.  
**Compatible beys**: Burst DB Blade with dragon-head protrusions (r_dragon ≥ 2.4 cm) + DB Core alignment nodes (r_drake ≥ 1.2 cm) phase-locking to r_hammer ≥ 2.7 cm (η_align ≥ 1.30); standard: Zone Lúinor Drake Spiral' Metsu (Lodin Haijima, Burst DB)

---

### [Case 2059 — Lodin Haijima / Zone Lúinor Drake Spiral' Metsu — Drake Strike](./15%20case%20study.md#case-2059)

**System**: Burst DB  
**Mechanism**: COMBO — Drake Strike. Sequence: moveRight → moveUp → attack (→ ↑ A). Cost: 15. Type: attack. Partial single-hammer alignment (one of two heads): η_combo_align=1.15; v_combo=1.120 m/s; e_combo=0.79; J_combo=7.876×10⁻² N·s; composite rebound Δω=+11 rad/s (η_drake_rebound=0.13); dmgMult 1.35×; lockMs 90. dmgMult 1.35× ≤ 1.5 ✓; lockMs 90 ≤ 300 ✓.  
**Gimmick**: Parent: Drake disc phase alignment (Case 2057)

---

### [Case 2060 — Dragoon V2 — Dual-Flank Teleport Velocity Slam](./15%20case%20study.md#case-2060)

**System**: Plastic-gen V-Force (5-part)  
**Blader**: Tyson Granger  
**Geometry**: m=36.0 g; Tornado Wing V2 AR r=2.6 cm; Ten Heavy WD r=2.7 cm; Fast Flat Base II r_BB=0.3 cm (μ≈0.75); I_total=1.785×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Wing tip speed v_tip=13.00 m/s; flat approach v_approach=2.000 m/s. Dual-flank ±45° vector decomposition: J_single=6.595×10⁻² N·s; J_WA=√2×J_single=9.327×10⁻² N·s (forward components add constructively, lateral cancel) → Δv_opp=2.332 m/s. Used only by Tyson Granger.  
**Gimmick**: Dual-flank teleport ±45° simultaneous pass → MechanicRegistry: dual_flank_slam

---

### [Case 2061 — Tyson Granger / Dragoon V2 — Wave Attack](./15%20case%20study.md#case-2061)

**System**: Plastic-gen V-Force  
**Blader**: Tyson Granger  
**Special Move**: Wave Attack — Fast Flat Base II aggressive orbit v_approach=2.000 m/s; dual-flank ±45° teleport; J_WA=9.327×10⁻² N·s → Δv=2.332 m/s; Δω_drain=135.8 rad/s (72.8% retained). [M] Tyson Dragoon V-Force dragon ×8.0 → Δv=18.66 m/s. powerCost 100. Dragoon "teleports" to opposing flanking positions left and right simultaneously. Used only by Tyson.  
**Compatible beys**: Plastic-gen swept-wing AR (r ≥ 2.4 cm, ≥3 wings) + high-friction flat Base (μ ≥ 0.70; v_approach ≥ 1.8 m/s) + Dragoon dual-teleport BeySpirit; standard: Dragoon V2 (Tyson Granger, Beyblade V-Force)

---

### [Case 2062 — Tyson Granger / Dragoon V2 — Wave Rush](./15%20case%20study.md#case-2062)

**System**: Plastic-gen V-Force  
**Mechanism**: COMBO — Wave Rush. Sequence: moveLeft → moveRight → attack (← → A). Cost: 15. Type: attack. Orbital surge to dual-flank approach: v_approach=2.000 m/s; single-arm leading edge only (one wing contacts first); J_single=6.595×10⁻² N·s; rebound Δω=+8 rad/s; dmgMult 1.25×; lockMs 140. dmgMult 1.25× ≤ 1.5 ✓; lockMs 140 ≤ 300 ✓.  
**Gimmick**: Parent: Dual-flank teleport ±45° (Case 2060)

---

### [Case 2063 — Metal Driger — Hologram Ambush](./15%20case%20study.md#case-2063)

**System**: HMS (Hard Metal System, 3-part)  
**Blader**: Ray Kon  
**Geometry**: m=24.0 g; Metal Driger AR r=2.5 cm; SG (HMS) r=1.5 cm; Metal Semi-Flat Base r_BB=0.4 cm (μ≈0.45); I_total=7.904×10⁻⁶ kg·m²; ω₀=600 rad/s  
**Mechanism**: Tip speed v_tip=15.00 m/s; orbital speed v_orbital=3.200 m/s. Rain/water-film arena creates orbital hologram copies at same tip speed v_tip=14.40 m/s (0.96×; slight diffraction loss). Three orbital copies at 120° separation; η_ambush=1.35 total combined impulse multiplier; J_WBA=6.229×10⁻² N·s. Rainstorm arena required (precipitation density ≥ moderate). HMS aluminum construction: lighter (24g), ω₀=600 rad/s, metallic AR gives e=0.88.  
**Gimmick**: Hologram ambush (rain/water-film multi-copy) → MechanicRegistry: hologram_ambush

---

### [Case 2064 — Hiro Granger / Metal Driger — Wave Buster Attack](./15%20case%20study.md#case-2064)

**System**: HMS  
**Blader**: Hiro Granger  
**Special Move**: Wave Buster Attack — Metal Driger orbital v_orbital=3.200 m/s; three hologram copies (η_ambush=1.35); primary + hologram simultaneous strike: J_WBA=6.229×10⁻² N·s → Δv=1.557 m/s (physical); Δω_drain=115.8 rad/s (80.7% retained — HMS lighter so less drain). [M] Hiro/Ray Driger white tiger ×8.0 → Δv=12.46 m/s. powerCost 100. Rain arena activates hologram orbital copies — each copy strikes from a different approach vector simultaneously. Used only by Hiro/Ray with Metal Driger.  
**Compatible beys**: HMS metallic AR (r ≥ 2.3 cm, mirror-polished ≥ 80% reflectance) + rainstorm arena condition (precipitation ≥ moderate) + white tiger BeySpirit; standard: Metal Driger (Ray Kon / Hiro Granger, HMS)

---

### [Case 2065 — Hiro Granger / Metal Driger — Wave Ambush](./15%20case%20study.md#case-2065)

**System**: HMS  
**Mechanism**: COMBO — Wave Ambush. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 15. Type: attack. Single-hologram flanking approach from upper-arc position: η_single_holo=0.45 of J_WBA=2.803×10⁻² N·s (isolated copy leading edge only); rebound Δω=+16 rad/s (HMS lighter — higher Δω per impulse); dmgMult 1.25×; lockMs 100. dmgMult 1.25× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Hologram ambush (Case 2063)

---

### [Case 2066 — Clay Aries ED145B — Free-Spin Torque Decoupling](./15%20case%20study.md#case-2066)

**System**: MFB Metal Masters (4-part)  
**Blader**: Hyoma  
**Geometry**: m=18.0 g; Clay Aries Wheel r=2.3 cm; ED145 (Electronic Defense 145) r_track=1.45 cm; Ball driver r_BB=0.4 cm; I_total=8.373×10⁻⁶ kg·m²; ω₀=640 rad/s  
**Mechanism**: Tip speed v_tip=14.72 m/s; orbital speed v_orbital=1.900 m/s. ED145 free-spinning defense disc: k_decouple=0.85 — the ED145 bearing absorbs 85% of contact torque before it reaches the Wheel; Aries retains 98.9% spin per contact. Wind field generation via orbital motion creates defensive pressure zone. v_orbit_wind=1.900 m/s. Clay Aries wins Wind Storm Assault attack from upwind position via wind-field pushing opponent out. J_WSA=2.444×10⁻² N·s.  
**Gimmick**: ED145 free-spin torque decoupling (k_decouple=0.85) + wind-field deflection → MechanicRegistry: free_spin_decoupling; wind_field_defense

---

### [Case 2067 — Hyoma / Clay Aries ED145B — Wind Storm Assault](./15%20case%20study.md#case-2067)

**System**: MFB Metal Masters  
**Blader**: Hyoma  
**Special Move**: Wind Storm Assault (JP: Gone With the Wind — Kaze to Tomoni Sarinu) — ED145 free-spin orbit v_orbital=1.900 m/s; wind-field deflection: J_WSA=2.444×10⁻² N·s → Δv=0.611 m/s (outward, repulsive — defense type); Δω_loss=16.3 rad/s (97.4% spin retained via k_decouple=0.85); **Type**: defense/stamina — force applied outward (pushes attacker away). [M] Hyoma Aries ram ×7.0 → Δv=4.277 m/s. powerCost 100. Wind-field creates no direct contact; deflection pressure only. Effective only if opponent approaches from within the wind orbit radius.  
**Compatible beys**: MFB free-spinning defense track (ED145 or equivalent, k_decouple ≥ 0.80) + Ball or semi-flat driver (v_orbital ≥ 1.7 m/s) + wind-field BeySpirit; standard: Clay Aries ED145B (Hyoma, Metal Masters)

---

### [Case 2068 — Hyoma / Clay Aries ED145B — Wind Shift](./15%20case%20study.md#case-2068)

**System**: MFB Metal Masters  
**Mechanism**: COMBO — Wind Shift. Sequence: moveUp → defense → attack (↑ K A). Cost: 15. Type: defense. ED145 free-spin bearing absorbs approach impulse; lateral redirect uses wind orbit to push opponent off-axis: J_redirect=1.100×10⁻² N·s (lateral only); Δω=+4 rad/s (returned from bearing impulse absorption); dmgMult 1.20×; lockMs 80. dmgMult 1.20× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Free-spin torque decoupling (Case 2066)

---

### [Case 2069 — Griffolyon — Spirit Feather Multi-Hit](./15%20case%20study.md#case-2069)

**System**: Plastic-gen G-Revolution (5-part)  
**Blader**: Robert Jürgens  
**Geometry**: m=32.0 g; Griffolyon AR r=2.7 cm; Ten Balance WD r=2.5 cm; Spike Base r_BB=0.5 cm (μ≈0.30); I_total=1.756×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Tip speed v_tip=13.50 m/s; orbital speed v_orbital=2.200 m/s. Spirit feather multi-hit: N=8 sequential feather contacts (Griffin wings extend and retract cycling), η_decay=0.85 per successive hit; geometric series sum S=(1−0.85⁸)/(1−0.85)=4.974; effective combined impulse J_WD=3.143×10⁻² N·s (single feather J_base=6.320×10⁻³ N·s). Each feather hit smaller than prior; total accumulated Δv_opp=0.785 m/s; Δω_drain=44.7 rad/s (91.1% retained — spike tip low friction, less orbit energy lost).  
**Gimmick**: Spirit feather N=8 η=0.85 multi-hit geometric series → MechanicRegistry: spirit_multi_hit

---

### [Case 2070 — Robert Jürgens / Griffolyon — Wing Dagger](./15%20case%20study.md#case-2070)

**System**: Plastic-gen G-Revolution  
**Blader**: Robert Jürgens  
**Special Move**: Wing Dagger — Griffin spirit feather cascade N=8 η=0.85; J_WD=3.143×10⁻² N·s → Δv=0.786 m/s (physical); Δω_drain=44.7 rad/s. [M] Robert Jürgens Griffolyon griffin ×7.0 → Δv=5.500 m/s. powerCost 100. Eight rapid feather-blade contacts in sequence; later hits reinforce earlier ones via resonance. Used only by Robert Jürgens.  
**Compatible beys**: Plastic-gen wing AR (r ≥ 2.5 cm, ≥4 blade feathers) + balanced or spike tip (μ ≤ 0.35) + griffin BeySpirit; standard: Griffolyon (Robert Jürgens, G-Revolution)

---

### [Case 2071 — Robert Jürgens / Griffolyon — Wing Rain](./15%20case%20study.md#case-2071)

**System**: Plastic-gen G-Revolution  
**Mechanism**: COMBO — Wing Rain. Sequence: moveUp → moveLeft → attack (↑ ← A). Cost: 15. Type: attack. First 3 feather contacts only (N=3 of 8): J_3=(1−0.85³)/(1−0.85)×J_base=2.473×J_base=1.563×10⁻² N·s; rebound Δω=+3 rad/s; dmgMult 1.25×; lockMs 150. dmgMult 1.25× ≤ 1.5 ✓; lockMs 150 ≤ 300 ✓.  
**Gimmick**: Parent: Spirit feather multi-hit (Case 2069)

---

### [Case 2072 — Sword Valtryek Blitz Power Retsu — Spring-Assisted Driver](./15%20case%20study.md#case-2072)

**System**: Burst Rise (4-part)  
**Blader**: Valt Aoi  
**Geometry**: m=51.0 g; Sword Valtryek blade r=3.2 cm; Blitz ratchet r=2.8 cm; Power Retsu driver r_BB=0.6 cm (retracted); k_spring=180 N/m; x_preload=3 mm=0.3 cm; E_spring=8.100×10⁻⁴ J; I_total=1.687×10⁻⁵ kg·m²; ω₀=670 rad/s  
**Mechanism**: Tip speed v_tip=21.44 m/s; Power Retsu: normal mode r_contact=0.6 cm (semi-flat μ≈0.45); spring-release mode: spring k=180 N/m compressed x=3mm, E_spring=½×180×(0.003)²=8.100×10⁻⁴ J released as kinetic energy added to contact. Combined impulse: J_WW=I_total×ω₀×e_spring_boost; e=0.85 (Burst Rise era); J_WW=1.139×10⁻¹ N·s. Spring release requires impact trigger (driver nose depresses ≥ 2mm under contact force). Δω_drain=91.6 rad/s (86.3% retained).  
**Gimmick**: Spring-assisted driver release (k=180 N/m, x=3mm, E_spring=8.100×10⁻⁴ J) → MechanicRegistry: spring_driver_burst

---

### [Case 2073 — Valt Aoi / Sword Valtryek Blitz Power Retsu — Wing Whip](./15%20case%20study.md#case-2073)

**System**: Burst Rise  
**Blader**: Valt Aoi  
**Special Move**: Wing Whip — Spring-assisted Power Retsu driver (k=180 N/m, x=3mm); J_WW=1.139×10⁻¹ N·s → Δv=2.277 m/s (physical, 50g opponent); Δω_drain=91.6 rad/s (86.3% retained). [M] Valt Valtryek dragon ×8.0 → Δv=18.22 m/s. powerCost 100. Spring fires at contact moment, adding kinetic burst to standard wing strike. Used only by Valt Aoi.  
**Compatible beys**: Burst Rise blade (r ≥ 3.0 cm) + spring-loaded tip driver (k ≥ 150 N/m, x ≥ 2.5mm) + Valtryek dragon BeySpirit; standard: Sword Valtryek Blitz Power Retsu (Valt Aoi, Burst Rise)

---

### [Case 2074 — Valt Aoi / Sword Valtryek Blitz Power Retsu — Power Rush](./15%20case%20study.md#case-2074)

**System**: Burst Rise  
**Mechanism**: COMBO — Power Rush. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 25. Type: attack. Spring pre-charge then forward surge: driver spring fires mid-orbit approach; J_PR=I_total×ω₀×0.72 (partial spring only, x=2mm sub-full compression)=8.139×10⁻² N·s; rebound Δω=+12 rad/s; dmgMult 1.40×; lockMs 80. dmgMult 1.40× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: Spring-assisted driver (Case 2072)

---

### [Case 2075 — Lycanlor — Spirit Claw Multi-Hit](./15%20case%20study.md#case-2075)

**System**: Plastic-gen G-Revolution (5-part)  
**Blader**: Lupinex  
**Geometry**: m=32.0 g; Lycanlor AR r=2.6 cm; Wide Survivor WD r=2.7 cm; Spike Base r_BB=0.5 cm (μ≈0.30); I_total=1.495×10⁻⁵ kg·m²; ω₀=500 rad/s  
**Mechanism**: Tip speed v_tip=13.00 m/s; orbital speed v_orbital=2.100 m/s. Spirit claw multi-hit: N=5 claw rakes (wolf lycanthrope claw swipes), η_decay=0.88 per hit; series sum S=(1−0.88⁵)/(1−0.88)=3.895; J_WS=3.444×10⁻² N·s (single claw J_base=8.843×10⁻³ N·s). Total Δv_opp=0.861 m/s; Δω_drain=45.6 rad/s (90.9% retained — spike base low friction).  
**Gimmick**: Spirit claw N=5 η=0.88 multi-hit geometric series → MechanicRegistry: spirit_multi_hit

---

### [Case 2076 — Lupinex / Lycanlor — Wolf Storm](./15%20case%20study.md#case-2076)

**System**: Plastic-gen G-Revolution  
**Blader**: Lupinex  
**Special Move**: Wolf Storm — Lycanlor spirit claw multi-hit N=5 η=0.88; J_WS=3.444×10⁻² N·s → Δv=0.861 m/s (physical); Δω_drain=45.6 rad/s. [M] Lupinex Lycanlor wolf lycanthrope ×7.0 → Δv=6.030 m/s. powerCost 100. Five claw rakes in rapid spiral pattern — each deeper than the last. Used only by Lupinex.  
**Compatible beys**: Plastic-gen claw AR (r ≥ 2.4 cm, ≥4 claw protrusions) + spike or flat tip (μ ≤ 0.35) + lycanthrope BeySpirit; standard: Lycanlor (Lupinex, G-Revolution)

---

### [Case 2077 — Lupinex / Lycanlor — Wolf Claw](./15%20case%20study.md#case-2077)

**System**: Plastic-gen G-Revolution  
**Mechanism**: COMBO — Wolf Claw. Sequence: moveUp → moveLeft → attack (↑ ← A). Cost: 15. Type: attack. First 3 claw contacts (N=3 of 5): J_3=(1−0.88³)/(1−0.88)×J_base=2.671×J_base=2.362×10⁻² N·s; rebound Δω=+3 rad/s; dmgMult 1.25×; lockMs 160. dmgMult 1.25× ≤ 1.5 ✓; lockMs 160 ≤ 300 ✓.  
**Gimmick**: Parent: Spirit claw multi-hit (Case 2075)

---

### [Case 2078 — Wizard Fafnir Ratchet Rise Sen — Ratchet Torque Decoupling](./15%20case%20study.md#case-2078)

**System**: Burst DB (4-part)  
**Blader**: Fumiya Kindo  
**Geometry**: m=51.0 g; Wizard Fafnir blade r=3.2 cm (left-spin); Ratchet disc r=2.4 cm; Rise driver r_BB=0.5 cm; Sen tip r=0.3 cm; I_total=1.710×10⁻⁵ kg·m²; ω₀=700 rad/s (left-spin, counter-clockwise)  
**Mechanism**: Tip speed v_tip=22.40 m/s; orbital speed v_orbital=3.200 m/s. Ratchet disc: ratchet teeth engage only vs right-spin opponents (counter-spin contact); k_ratchet=0.90 — ratchet absorbs 90% of contact torque from right-spin opponents; Fafnir retains 99.3% spin per contact (Sen tip low-friction). Ratchet is passive vs same-spin (left-spin) opponents. J_WP=I_total×ω₀×e_ratchet; e=0.80 (counter-spin contact); J_WP=7.491×10⁻² N·s.  
**Gimmick**: Ratchet disc counter-spin torque decoupling (k_ratchet=0.90, only effective vs right-spin) → MechanicRegistry: ratchet_decoupling

---

### [Case 2079 — Fumiya Kindo / Wizard Fafnir Ratchet Rise Sen — Wrench Parry](./15%20case%20study.md#case-2079)

**System**: Burst DB  
**Blader**: Fumiya Kindo  
**Special Move**: Wrench Parry (JP: Ratchet Through — Ratcheto Tsūru) — Ratchet disc counter-spin absorption (right-spin opponent only); k_ratchet=0.90; J_WP=7.491×10⁻² N·s → Δv=1.498 m/s (outward, repulsive — defense type); Δω_loss=7.5 rad/s (Fafnir retains 98.9% spin). **Type**: defense/stamina — force applied outward (repels right-spin attacker). [M] Fumiya Fafnir fox ×7.5 → Δv=11.24 m/s. powerCost 100. Effective only vs right-spin opponents; vs left-spin no ratchet engagement (passive). Used only by Fumiya Kindo.  
**Compatible beys**: Burst DB left-spin blade + ratchet disc (k_ratchet ≥ 0.85, right-spin engagement only) + low-friction Sen-type tip + fox BeySpirit; standard: Wizard Fafnir Ratchet Rise Sen (Fumiya Kindo, Burst DB)

---

### [Case 2080 — Fumiya Kindo / Wizard Fafnir Ratchet Rise Sen — Ratchet Redirect](./15%20case%20study.md#case-2080)

**System**: Burst DB  
**Mechanism**: COMBO — Ratchet Redirect. Sequence: moveRight → defense → attack (→ K A). Cost: 15. Type: defense/stamina. Partial ratchet deflect (θ=20°): v_N_combo=0.855 m/s; η_ratchet_combo=1.10; e_combo=0.84; J_combo=4.412×10⁻² N·s; ratchet spring-back Δω=+6 rad/s (η_ratchet_spin=0.12); dmgMult 1.25×; lockMs 100. dmgMult 1.25× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Ratchet torque decoupling (Case 2078)

---

### [Case 2081 — Wizard Fafnir Ratchet Rise Sen — Rise Tip Rim Friction Speed Boost](./15%20case%20study.md#case-2081)

**System**: Burst DB (4-part)  
**Blader**: Fumiya Kindo  
**Geometry**: same assembly as Case 2078; m=51.0 g; I_total=1.710×10⁻⁵ kg·m²; ω₀=700 rad/s  
**Mechanism**: Rise driver rubber outer rim r_rim=0.8 cm; μ_Rise=0.85; F_rim=μ×m×g=0.425 N; a_rim=8.33 m/s²; t_rim=0.15 s; v_boost=1.250 m/s. Stamina orbit base speed v_base=1.500 m/s; combined approach speed v_attack=2.750 m/s; e_contact=0.78; m_eff=2.550×10⁻² kg; J_WB=1.248×10⁻¹ N·s → Δv_opp=2.447 m/s. Rubber rim floor contact is a one-shot acceleration — NOT a spring mechanism. Rise returns to stamina orbit at reduced spin after attack.  
**Gimmick**: Rise tip rubber rim floor-friction speed boost (μ=0.85, t=0.15 s, v_boost=1.250 m/s) → MechanicRegistry: rubber_rim_friction_boost

---

### [Case 2082 — Fumiya Kindo / Wizard Fafnir Ratchet Rise Sen — Wizard Blow](./15%20case%20study.md#case-2082)

**System**: Burst DB  
**Blader**: Fumiya Kindo  
**Special Move**: Wizard Blow (JP: ウィザードブロー — Wizādo Burō) — Rise tip rubber rim friction floor boost (μ=0.85, t_rim=0.15 s, v_boost=1.250 m/s); v_base=1.500 m/s; v_attack=2.750 m/s; J_WB=1.248×10⁻¹ N·s → Δv=2.447 m/s; Δω_drain=189.7 rad/s (72.9% retained — r_Blade=2.6 cm). [M] Fumiya Fafnir fox ×7.5 → Δv=18.35 m/s. powerCost 100. Rim friction (NOT a spring); rubber catches the arena floor for 0.15 s converting 0.425 N friction into 1.250 m/s added velocity. Used only by Fumiya Kindo.  
**Compatible beys**: Burst DB driver with rubber outer rim (r_rim ≥ 0.6 cm, μ ≥ 0.80, a_rim ≥ 7.0 m/s², t_rim ≥ 0.10 s, v_boost ≥ 0.8 m/s) — must have floor contact capability (NOT spring mechanism); standard: Wizard Fafnir Ratchet Rise Sen (Fumiya Kindo, Burst DB)

---

### [Case 2083 — Fumiya Kindo / Wizard Fafnir Ratchet Rise Sen — Rise Rush](./15%20case%20study.md#case-2083)

**System**: Burst DB  
**Mechanism**: COMBO — Rise Rush. Sequence: moveRight → moveUp → attack (→ ↑ A). Cost: 15. Type: attack/stamina. Partial rim boost (t_rim_combo=0.10 s): v_boost_combo=0.833 m/s; v_combo=2.333 m/s; e_combo=0.76; J_combo=1.047×10⁻¹ N·s; rubber rim rebound Δω=+13 rad/s (η_rim_rebound=0.08); dmgMult 1.35×; lockMs 90. dmgMult 1.35× ≤ 1.5 ✓; lockMs 90 ≤ 300 ✓.  
**Gimmick**: Parent: Rise tip rim friction speed boost (Case 2081)

---

### [Case 2084 — World Spryzen Unite' 2B — Aerial Descent Attack-Mode Slope Slam](./15%20case%20study.md#case-2084)

**System**: Burst GT (4-part)  
**Blader**: Shu Kurenai  
**Geometry**: m=50.0 g; World Spryzen blade r=2.9 cm (Attack Mode, World Ring metallic band); 2B chassis free-spin ring r=2.4 cm; Unite' disc r=2.1 cm; Base driver r=0.5 cm; I_total=2.205×10⁻⁵ kg·m²; ω₀=670 rad/s  
**Mechanism**: 2B chassis dual-mode — Attack Mode extends World Ring to r_world=2.9 cm. Aerial launch from h_launch=5.0 cm: v_contact²=v_base²+2gh=2.200²+2×9.81×0.050=5.821 m²/s² → v_contact=2.413 m/s. World Ring metallic band e_world=0.85; m_eff=2.500×10⁻² kg; J_WW=1.116×10⁻¹ N·s → Δv_opp=2.232 m/s. Δω_drain=146.8 rad/s (78.1% retained).  
**Gimmick**: 2B dual-mode Attack Mode aerial drop (h=5.0 cm, +0.981 m²/s² KE from gravity) → MechanicRegistry: aerial_descent_attack; dual_mode_chassis

---

### [Case 2085 — Shu Kurenai / World Spryzen Unite' 2B — World Whip](./15%20case%20study.md#case-2085)

**System**: Burst GT  
**Blader**: Shu Kurenai  
**Special Move**: World Whip (JP: World Slash — Wārudo Surasshu) — 2B Attack Mode aerial descent h=5.0 cm; v_contact=2.413 m/s; World Ring e_world=0.85; J_WW=1.116×10⁻¹ N·s → Δv=2.232 m/s; Δω_drain=146.8 rad/s (78.1% retained). [M] Shu Spryzen Valkyrie ×8.0 → Δv=17.86 m/s. powerCost 100. World Ring metallic band slashes with full aerial fall velocity; sparks on contact. Attack Mode only (World Ring at r=2.9 cm). Used only by Shu Kurenai.  
**Compatible beys**: Burst GT blade with metallic contact band (r_Blade ≥ 2.5 cm, e_metal ≥ 0.82) + dual-mode chassis with Attack Mode aerial deployment (h_launch ≥ 3.5 cm, v_contact ≥ 2.1 m/s) + Valkyrie spirit; standard: World Spryzen Unite' 2B (Shu Kurenai, Burst GT)

---

### [Case 2086 — Shu Kurenai / World Spryzen Unite' 2B — World Slash](./15%20case%20study.md#case-2086)

**System**: Burst GT  
**Mechanism**: COMBO — World Slash. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 25. Type: attack. Partial aerial descent (h_combo=3.0 cm, 80% base speed): v_combo_base=1.760 m/s; v_combo=√(1.760²+2×9.81×0.030)=1.920 m/s; e_combo=0.80; J_combo=8.640×10⁻² N·s; World Ring metal rebound Δω=+11 rad/s (η_world_rebound=0.10); dmgMult 1.40×; lockMs 100. dmgMult 1.40× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Aerial descent Attack Mode (Case 2084)

---

### [Case 2087 — World Spryzen Unite' 2B (Defense Mode) — 2B Bound Free-Spin Chassis Torque Deflect](./15%20case%20study.md#case-2087)

**System**: Burst GT (4-part)  
**Blader**: Shu Kurenai  
**Geometry**: same assembly as Case 2084; m=50.0 g; I_total=2.205×10⁻⁵ kg·m²; ω₀=670 rad/s. Defense Mode active.  
**Mechanism**: 2B chassis Defense Mode: World Ring retracted; bound free-spin outer ring at r_2B=2.4 cm becomes primary contact surface. k_2B_decouple=0.82 (free-spin ring decouples 82% contact torque); θ_2B=15°; v_N=v_opp×sin(15°)=2.500×0.259=0.648 m/s; η_2B=1.15 (bound concave geometry +15%); e_bound=0.90 (high-restitution rubber); J_WS=3.539×10⁻² N·s → Δv_opp=0.708 m/s; Spryzen Δω_loss=6.9 rad/s (99.0% spin retained).  
**Gimmick**: 2B bound free-spin ring torque decoupling (k=0.82, Defense Mode) → MechanicRegistry: free_spin_decoupling; bound_deflect

---

### [Case 2088 — Shu Kurenai / World Spryzen Unite' 2B — World Spin](./15%20case%20study.md#case-2088)

**System**: Burst GT  
**Blader**: Shu Kurenai  
**Special Move**: World Spin (JP: ワールドスピン — Wārudo Supin) — 2B Defense Mode bound free-spin ring deflect; k_2B_decouple=0.82; θ_2B=15°; J_WS=3.539×10⁻² N·s → Δv=0.708 m/s (outward — defense/stamina type); Δω_loss=6.9 rad/s (99.0% spin retained). **Type**: defense/stamina — force applied outward. [M] Shu Spryzen Valkyrie ×8.0 → Δv=5.664 m/s. powerCost 100. Defense Mode only (Attack Mode uses World Whip). Bound ring gives slightly (e_bound=0.90) and concave geometry adds 15% deflect force. Used only by Shu Kurenai.  
**Compatible beys**: Burst GT dual-mode chassis with free-spin bound outer ring in Defense Mode (r_ring ≥ 2.0 cm, k_decouple ≥ 0.78, e_bound ≥ 0.85); standard: World Spryzen Unite' 2B (Shu Kurenai, Burst GT)

---

### [Case 2089 — Shu Kurenai / World Spryzen Unite' 2B — World Guard](./15%20case%20study.md#case-2089)

**System**: Burst GT  
**Mechanism**: COMBO — World Guard. Sequence: moveUp → defense → attack (↑ K A). Cost: 15. Type: defense/stamina. Shallow 2B bound deflect (θ=8°): v_N_combo=v_opp×sin(8°)=0.348 m/s; η_2B_combo=1.08; e_combo=0.86; J_combo=1.747×10⁻² N·s; bound ring spring-back Δω=+4 rad/s (η_bound_spin=0.20); dmgMult 1.15×; lockMs 80. dmgMult 1.15× ≤ 1.5 ✓; lockMs 80 ≤ 300 ✓.  
**Gimmick**: Parent: 2B bound free-spin deflect Defense Mode (Case 2087)

---

### [Case 2090 — Wonder Valtryek 12 Volcanic — Recoil-Assisted Volcanic Rim Orbital Attack](./15%20case%20study.md#case-2090)

**System**: Burst Surge/Superking (4-part)  
**Blader**: Valt Aoi  
**Geometry**: m=48.0 g; Wonder Valtryek blade r=2.4 cm; 12 disc r=2.3 cm; Volcanic driver rubber rim r_rim=0.6 cm (μ≈0.88); Wonder Base r=0.8 cm; I_total=1.791×10⁻⁵ kg·m²; ω₀=660 rad/s  
**Mechanism**: Incoming opponent attack v_opp_incoming=2.000 m/s; e_receive=0.70 (Volcanic rubber absorbs); m_eff=2.400×10⁻² kg; J_received=8.160×10⁻² N·s. Volcanic rim eccentric geometry channels η_recoil=0.55 of received impulse as orbital boost: v_boost_recoil=0.935 m/s; v_base=1.600 m/s; v_attack=2.535 m/s; e_attack=0.80; J_WFL=1.095×10⁻¹ N·s → Δv_opp=2.281 m/s. Δω_drain=146.7 rad/s (77.8% retained).  
**Gimmick**: Volcanic rubber rim recoil-redirect orbital boost (η_recoil=0.55, 55% received impulse → forward orbit) → MechanicRegistry: recoil_redirect_orbit

---

### [Case 2091 — Valt Aoi / Wonder Valtryek 12 Volcanic — Wonder Flash Launch](./15%20case%20study.md#case-2091)

**System**: Burst Surge  
**Blader**: Valt Aoi  
**Special Move**: Wonder Flash Launch (JP: Winning Rush Shoot — Uiningu Rasshu Shūto) — Volcanic rim absorbs incoming attack (e_receive=0.70); η_recoil=0.55 redirect to orbit; J_received=8.160×10⁻² N·s; v_boost=0.935 m/s; v_attack=2.535 m/s; J_WFL=1.095×10⁻¹ N·s → Δv=2.281 m/s; Δω_drain=146.7 rad/s (77.8% retained). [M] Valt Valtryek Valkyrie ×8.0 → Δv=18.25 m/s. powerCost 100. Requires incoming attack to absorb — Wonder Valtryek takes the hit, Volcanic channels 55% of opponent's own energy into the counter orbital strike. Used only by Valt Aoi.  
**Compatible beys**: Burst Surge driver with rubber raised rim (r_rim ≥ 0.5 cm, μ ≥ 0.85, η_recoil ≥ 0.45) + sustained outer-edge orbital approach (v_base ≥ 1.4 m/s) + Valkyrie spirit; standard: Wonder Valtryek 12 Volcanic (Valt Aoi, Burst Surge)

---

### [Case 2092 — Valt Aoi / Wonder Valtryek 12 Volcanic — Flash Rush](./15%20case%20study.md#case-2092)

**System**: Burst Surge  
**Mechanism**: COMBO — Flash Rush. Sequence: moveUp → moveRight → attack (↑ → A). Cost: 25. Type: attack. Wall recoil only (no incoming opponent; η_recoil_wall=0.35): v_wall_incoming=1.500 m/s; J_wall=5.940×10⁻² N·s; v_boost_wall=0.433 m/s; v_combo=2.033 m/s; e_combo=0.78; J_combo=8.686×10⁻² N·s; Volcanic rim rebound Δω=+10 rad/s (η_volcanic_rebound=0.09); dmgMult 1.35×; lockMs 100. dmgMult 1.35× ≤ 1.5 ✓; lockMs 100 ≤ 300 ✓.  
**Gimmick**: Parent: Recoil-assisted Volcanic rim orbital attack (Case 2090)

---

> *INDEX_D complete — Cases 1601–2092 fully indexed. Next available: Case 2093.*


# BEYBLADE CASE STUDY INDEX — Part A (Cases 1–523)
> Phase 0 audit complete · All geometry in cm · PX_PER_CM = 24
> True case count: 2008 unique numbered cases · Highest: 2092 · Next Available: 2093
> 132 XXXX placeholders from CS9 indexed at end of this file

---

## CS1 — Cases 1–74 {#cs1}
Source: `1 case study.md`

---

### [Case 1 — Hit to a Freely Suspended Body (at rest, in free space)](./1%20case%20study.md#case-1)

**System**: foundational physics / all generations  
**Mechanism**: Force through CoM → pure translation (Δv = F·Δt / m); force off-CoM → translation + rotation (τ = r × F, Δω = r × F·Δt / I). Impulse J splits between linear and angular components.  
**Engine Note**: Base impulse-resolution formula; underpins every collision handler.

---

### [Case 2 — Hit to a Body Already in Motion (falling / rising / diving / jumping)](./1%20case%20study.md#case-2)

**System**: foundational physics / all generations  
**Mechanism**: Velocities add as vectors. Pre-existing momentum is NOT zeroed. v_new = v_old + ΔvF. Kinetic energy: KE_new = ½m|v_new|².  
**Engine Note**: Velocity accumulation across ticks; momentum-magnitude dominance when body has high existing v₀.

---

### [Case 3 — The Body Becomes a Gyro (spinning)](./1%20case%20study.md#case-3)

**System**: foundational physics / all generations  
**Mechanism**: Angular momentum L = I·ω along spin axis. Torque → PRECESSION (not tumble) at high spin. Ω_p = τ / (I·ω). High spin = slow, stable precession; low spin = fast wobble.  
**Engine Note**: Core gyroscopic stability model; precession rate formula used in tilt-change calculations.

---

### [Case 4 — Gyro Has Contact Points, Gets Hit On One](./1%20case%20study.md#case-4)

**System**: foundational physics / all generations  
**Contact Points**: r_cp from spin axis; CP shape sets restitution μ and friction  
**Mechanism**: Flat CP → lateral rebound; angled/upper CP → upward component; rubber CP → spin-steal via friction; blade CP → high torque, thin r_cp. Per-hit: J = μ·m_rel·v_rel_normal; Δω = (r_cp × J) / I.  
**Engine Note**: CP-shape collision dispatch; spin-steal via friction coefficient; smash μ=0.85, upper μ=0.70, rubber e=0.25/μ_k=0.50, absorb μ=0.20, burst μ=0.95, blade μ=0.75.

---

### [Case 5 — Gyro + Contact Points + TILT](./1%20case%20study.md#case-5)

**System**: foundational physics / all generations  
**Mechanism**: Tilted spin axis θ → gravity torque → persistent wobble circle (Ω_wobble = m·g·r_cog·sin(θ) / (I·ω)). Hit on tilted bey changes tilt angle and direction via precession. F has components ⊥ spin axis (precession) and along axis (nutation kick).  
**Engine Note**: tiltAngle and tiltDirection update per hit; gravity wobble grows below 40% spin.

---

### [Case 6 — Per-Tick Integration (what happens every frame)](./1%20case%20study.md#case-6)

**System**: foundational physics / all generations  
**Mechanism**: 8-step tick at 60 Hz (Δt = 1/60 s): (1) forces accumulate (arena tilt, spin zones, gravity wells, gyro drag); (2) collision detection (AABB broad, circle-circle narrow, CP geometry); (3) impulse resolution; (4) position integration (semi-implicit Euler); (5) spin decay; (6) stability check / PRNG wobble below 40%; (7) arena bounds / ring-out; (8) state sync to Colyseus.  
**Engine Note**: Master game loop; spinDecayRate = 8*(1 - stamina*0.001); wobble noise seeded from matchId.

---

### [Case 7 — The Tip Hit + Gyroscopic Counter-Strike (2-Tick Cascade)](./1%20case%20study.md#case-7)

**System**: foundational physics / all generations  
**Mechanism**: Attacker hits defender at TIP (below CoM) in tick 1 → precession swings defender's TOP toward attacker → tick 2 upper-ring counter-strike with v_top = ω × r_top (2× attacker's CP velocity). Higher spin bey's counter is stronger. Attack type: devastating; Defense type: dampened; Stamina type: near-zero (tip ≈ on spin axis).  
**Engine Note**: `_pendingUpperCounter` flag set on tip hit with tiltAngle > 2°; fires next tick if target still in range.

---

### [Case 8 — Destabilization: The Unified Concept (Smash, Upper, Recoil, Ground)](./1%20case%20study.md#case-8)

**System**: foundational physics / all generations  
**Mechanism**: Tilt angle θ is master variable. Self-reinforcing loop: tilt → wider tip orbit → more ground friction torque → faster precession → more tilt. Smash = lateral impulse (ring-out threat, minimal tilt); Upper = torque ⊥ L (tilt change); Recoil = Newton 3rd on attacker's own CP; Ground friction = τ_ground = r_orbit × F_friction per tick.  
**Engine Note**: All four destabilization vectors must be modelled; ground friction increments tilt each tick proportional to sin(θ).

---

### [Case 9 — Body On The Floor: How The Floor Constraint Changes Everything](./1%20case%20study.md#case-9)

**System**: foundational physics / all generations  
**Mechanism**: Tip is pivot point. Floor normal force + friction. Hit → bey pivots around tip (not translates) if F_lateral ≤ μ_tip × m × g. τ_floor = r_tip_to_CP × F (vs r_com_to_CP for free body → floor amplifies torque). Sharp tip μ=0.17 (point contact geometry); Bearing μ=0.05 (slides, torque dissipated); Rubber μ=0.50 (pivots + absorbs).  
**Engine Note**: Tip friction threshold determines slide vs pivot; floor amplification factor critical for burst.

---

### [Case 10 — Hit Height: Upper, Equator, Lower, Axis](./1%20case%20study.md#case-10)

**System**: foundational physics / all generations  
**Mechanism**: Contact height h above tip determines precession direction. h > h_com (upper hit): τ = +Y → L rotates toward +Y → top swings AWAY from attacker → tilt increase, ring-out vector. h < h_com (lower/tip hit): top swings TOWARD attacker → counter-strike setup (Case 7). h = h_com: pure linear impulse, no tilt. Down attack amplifies floor pivot.  
**Engine Note**: contactHeightOnB vs h_com_B sign determines precession direction sign in collision resolver.

---

### [Case 11 — Tall Bey vs Short Bey: Height Mismatch Contact](./1%20case%20study.md#case-11)

**System**: foundational physics / all generations  
**Mechanism**: Tilted AR of tall bey sweeps lower as θ increases (Δh_ar = r_ar × sin(θ_A)). Contact height on short bey B determines attack type. Tall bey's tilted AR traces an ellipse from above (semi-major = r_ar / cos(θ_A), semi-minor = r_ar). Contact possible when ellipse's nearest point drops to B's height.  
**Engine Note**: Tilt-adjusted AR height calculation needed for cross-height collision detection.

---

### [Case 12 — The Full Contact System: Computing Contact Points, Torques, and Bounces](./1%20case%20study.md#case-12)

**System**: foundational physics / all generations  
**Mechanism**: 6-step collision resolution: (1) 3D contact point from spin axis vectors; (2) collision normal + effective relative velocity (includes spin contribution); (3) impulse J = -(1+μ)·v_eff·n̂ / (mass terms + r_cp²/I terms); (4) apply linear + angular impulse (tilt change via precession); (5) ground friction update per tick; (6) recoil self-torque on attacker.  
**Engine Note**: Full collision resolver pseudocode in case; r_cp_from_com sign determines precession direction.

---

### [Case 13 — Bounce Behavior: What Determines the Rebound](./1%20case%20study.md#case-13)

**System**: foundational physics / all generations  
**Mechanism**: Rebound quality depends on: (1) restitution μ (from CP types); (2) spin state (high spin → clean bounce; low spin → tumble); (3) floor grip (high grip → pivot and amplified angular response; low grip → dissipated torque). Tangential bounce component: tan(β) = (ω × r × friction) / v_approach.  
**Engine Note**: Spin-direction asymmetry in bounce angle; tip type changes collision character.

---

### [Case 14 — Off-Axis Tip: Jumping, Airborne State, and Landing Impact (Storm Capricorn M145Q)](./1%20case%20study.md#case-14)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Q tip: slanted contact edge runs from frustum tip (low, narrow) to cylinder rim (high, wide); not a horizontal ring. mountOffset ≈ 1.5 mm (mode 1) or 2.5 mm (mode 2); slantAngle ≈ 15°  
**Material**: ABS / plastic  
**Mechanism**: Slanted contact edge creates periodic height oscillation Δh = mountOffset × sin(slantAngle). One revolution = one height cycle. At oscillation peak: bey momentarily airborne → loses gyroscopic floor constraint → wobbles freely. Landing impact: concentrated impulse on re-contact.  
**Engine Note**: mountOffset and slantAngle fields on TipProfile; deltaH cam drives periodic vertical impulse.

---

### [Case 15 — Multi-Layer Tip Profile System](./1%20case%20study.md#case-15)

**System**: Metal Fight Beyblade / all post-MFB generations  
**Geometry**: TipLayer array: innerRadius · outerRadius · innerZ · outerZ · chamferAngle · material · friction · restitution. Active layer resolved per tick based on tilt angle (layer whose outer edge first reaches floor). SF layers: inner flat r=0–0.2 cm, z=0; outer cone r=0.2–0.8 cm, z=0–0.4 cm, chamfer 135°. BSF adds 8 directional vanes on outer rim.  
**Material**: plastic / rubber / metal per layer  
**Mechanism**: θ_transition = arctan(Δh / (r₂ - r₁)); below threshold = inner layer (stamina); above = outer layer (defense/attack). SF destabilizer: low track + SF triggers transition easily.  
**Engine Note**: `resolveActiveLayer(profile, tiltAngle)` determines friction and restitution per tick.

---

### [Case 16 — Metal Wheel Compliance: Partial Rotational Free-Spin (Kreis)](./1%20case%20study.md#case-16)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Metal Frame slides ±60° relative to Core in Defense Mode (hard stops at ±60°); Attack Mode: rigid coupling  
**Material**: metal frame + plastic core  
**Spin Coupling**: partial (Defense Mode: impact absorbed by frame rotation; Attack Mode: rigid)  
**Mechanism**: Defense Mode: impulse J → Metal Frame rotates (low friction slip), Core barely feels hit → low recoil. At ±60° hard stop: all KE in frame transfers to Core instantly → recoil spike. Attack Mode: no buffer, every hit goes directly to Core.  
**Gimmick**: Rotational spring-damper with end-stops → `partialFreeSpinFrame` mechanic  
**Engine Note**: φ_frame tracks frame-to-core rotation offset; hard stop check each tick.

---

### [Case 17 — Cross-Component Coupled Mechanics: Diablo + X Drive](./1%20case%20study.md#case-17)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Metal Frame: 3 detent positions at 120° intervals; X Drive: 3 tips (XF, S²D, S) selected by pin position  
**Mechanism**: ω drops → centrifugal force < detent spring → Metal Frame snaps to next detent → different pin depressed → active tip changes. Sequence: XF (high spin, attack) → S²D (mid, balance) → S (low, stamina). In Ultimate Balance Mode: impact can prematurely snap frame past detent. Snap threshold: J × r_cp / I_frame > ω_detent_threshold.  
**Gimmick**: Three-state automatic tip machine → `centrifugalDetentMachine` mechanic  
**Engine Note**: MetalFrameState tracks angle and currentDetent; snap fires tilt perturbation on bey.

---

### [Case 18 — Mass Distribution Physics + Dual Bearing Architecture (Phantom Orion B:D)](./1%20case%20study.md#case-18)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Phantom: Metal Frame 40.31 g at r≈2.2 cm, PC Core 2.48 g at r≈0.5 cm. B:D: plastic housing + Bearing 1 (housing↔casing) + metal casing + Bearing 2 (casing↔shaft) + metal shaft tip  
**Material**: metal frame / plastic core / dual bearings  
**Spin Coupling**: Three independently rotating elements (body, casing, shaft)  
**Mechanism**: Phantom I ≈ 1.95×10⁻⁵ kg·m² (1.76× solid disc of same mass). B:D upright: shaft tip contacts floor (μ≈0), near-zero friction. B:D tilted: casing base contacts floor at wide radius; casing may stop, body still spins above via Bearing 1.  
**Engine Note**: I must be computed from part mass × massRadius² (not hardcoded scalar); B:D needs three-ω tracking.

---

### [Case 19 — Active I Modulation (Jade), Track Disc Geometry (S130), Spherical Contact (RB)](./1%20case%20study.md#case-19)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Jade: 4 channels, each with 1 steel ball (~0.2 cm dia, ~0.065 g) + 1 rubber cushion. r_outer≈2.0 cm, r_inner≈1.0 cm. S130: disc at track height, r≈1.8 cm. RB: r_sphere≈0.8–1.0 cm  
**Material**: steel balls + rubber cushion / plastic S130 / rubber ball  
**Mechanism**: Jade: ω drops → centrifugal < restoring → balls migrate inward → I decreases → spin-up by I_old/I_new ratio (~1.15×). Attack Mode: balls mobile; Defense Mode: balls fixed at inner. S130: disc raises track-level I. RB: r_contact = r_sphere × sin(θ); viscoelastic rubber absorption.  
**Engine Note**: BallMigrationState per channel; angular momentum conservation spin-up when balls retract.

---

### [Case 20 — Wing Alignment Geometry: Impact Frequency vs Magnitude (Blitz)](./1%20case%20study.md#case-20)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Metal Frame: 6 alternating tabs (tall/short). Core: 3 large + 3 small wings (6-fold). Assault Attack Mode: 3 combined contacts; Barrage Attack Mode: 6 separate contacts  
**Mechanism**: Assault: 3 large hits per revolution (high impulse, low frequency). Barrage: 6 smaller hits per revolution (lower impulse, higher frequency). P_total = f × J_per_hit; tradeoff between destabilization and sustained contact. Same total power either mode.  
**Engine Note**: contactFrequency and contactMagnitude per mode; mode selector changes which frame tabs align with core wings.

---

### [Case 21 — Three-Component Composite Wheel: Viscoelastic Damping + Staged Contact (Fusion)](./1%20case%20study.md#case-21)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Metal Frame bumps (rigid) + Rubber Frame bumps (interdigitated, viscoelastic) + Core (fixed). Alternating M/R/M/R around circumference. Defense Mode: rubber outermost; Balance Mode: metal outermost  
**Material**: metal frame + rubber frame + plastic core  
**Mechanism**: Rubber bumps: viscoelastic → 70% energy destroyed as heat (not returned as recoil); soft-wall first contact. Metal bumps: elastic → ~90% returned. Staged contact: rubber first absorbs impulse, metal hard-stop if impulse large enough.  
**Gimmick**: viscoelasticAbsorption for rubber segments; e_rubber ≈ 0.30  
**Engine Note**: Segment-type lookup per contact angle; rubber segments permanently destroy energy vs elastic return.

---

### [Case 22 — Fixed Inner-Outer Stack: SWD (Sharp Wide Defense) and the No-Bearing Contrast](./1%20case%20study.md#case-22)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Inner sharp tip protrudes Δh through WD-ring hole; outer WD ring fixed (no bearing); Δh_proto controls when WD contacts floor  
**Material**: plastic (fixed)  
**Mechanism**: θ < θ_switch: sharp tip only (stamina). θ > θ_switch: WD ring contacts floor at r_WD ≈ 1.1 cm (defense/balance). SWD vs EWD: identical geometry, only difference is bearing in EWD decouples inner sharp from bey spin. Without bearing → full spin coupling → less effective LAD.  
**Engine Note**: Two-layer profile with Δh_proto threshold; θ_switch = arctan(Δh_proto / r_WD_inner).

---

### [Case 23 — Track Height as a Physics Variable: Prototype Nemesis 4D Bottom (Height 170 / 195)](./1%20case%20study.md#case-23)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Twist-lock height change: 195 (tall) or 170 (short); Δh = 2.5 mm. WD contact disc identical in both modes; only stem length changes. h = 17 cm → 19.5 cm (unit: tenths of mm in MFB notation)  
**Mechanism**: Height change shifts h_com by 2.5 mm → affects gyroscopic stability, tilt torque, and CoM height. Shorter mode: lower CoM, more stable, less aggressive tip. Taller mode: higher CoM, faster wobble, larger tilt torque τ = m×g×h_com×sin(θ).  
**Engine Note**: TipHeight field with pre-battle mode lock; all h_com-dependent quantities recompute when mode changes.

---

### [Case 24 — Energy Ring as Contact-Point Override: Gravity Destroyer (Counter / Defense Mode)](./1%20case%20study.md#case-24)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Gravity wheel: 3 jagged metal protrusions at 0°/120°/240° + 3 curved pockets. Destroyer Defense: long helmet protrusions cover jagged eyes → plastic CP override. Destroyer Counter: short protrusions expose eyes → metal CP active  
**Material**: plastic (defense mode) / metal (counter mode)  
**Mechanism**: Defense Mode: Energy Ring plastic covers Gravity's jagged faces → effective contact = smooth plastic, low restitution, deflects attacker. Counter Mode: jagged metal exposed → high restitution smash attack. Mode change is pre-battle rotation.  
**Engine Note**: cpMaterialOverride per Energy Ring mode; Energy Ring mode → effectiveContactMaterial lookup.

---

### [Case 25 — Energy Ring Coverage Spectrum: Destroyer Attack / Defense / Stamina](./1%20case%20study.md#case-25)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Coverage spectrum over Gravity's jagged eyes: Attack ~10–15% (small nubs, both modes = metal exposed); Defense ~40–60% (mode-dependent: Defense→plastic, Counter→metal); Stamina ~80–90% (all positions filled, always plastic)  
**Mechanism**: Coverage% determines effective contact material (plastic vs metal) and I contribution. Destroyer Defense is the only mode-dependent variant; Attack and Stamina are mode-independent. Coverage dictates μ and restitution.  
**Engine Note**: coveragePct field drives cpMaterial blend; three discrete Destroyer variants require separate part entries.

---

### [Case 26 — Spin Track as Active Contact Surface: Rubber 145 (R145) Wing Scraping and Sandwich Geometry](./1%20case%20study.md#case-26)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: 3 rubber wings at 120°, h_145 ≈ 1.45 cm above floor, r_wing extends outward. Two contact modes: floor scraping (θ > θ_scrape) and sandwich (attacker wheel clamped between R145 and FW)  
**Material**: hard rubber wings  
**Mechanism**: Floor scraping: wing tip contacts floor at θ > θ_scrape = arcsin(h_flat / r_outer); applies friction torque slowing bey. Sandwich: opponent AR hits wing from outside while FW closes from above → bidirectional friction trap. Same-spin optimal; opposite-spin loses through sandwich.  
**Engine Note**: WingContactState per tick; sandwich geometry requires height-range overlap check between R145 and FW.

---

### [Case 27 — Plastic Spherical Tips: Ball vs Wide Ball and the Radius–Movement Tradeoff](./1%20case%20study.md#case-27)

**System**: Metal Fight Beyblade / all generations  
**Geometry**: B: r_sphere ≈ 0.4 cm; WB: r_sphere ≈ 0.8 cm; RB: r_sphere ≈ 0.8–1.0 cm (rubber, Case 19)  
**Material**: plastic (B, WB) / rubber (RB)  
**Mechanism**: r_contact = r_sphere × sin(θ). At θ=30°: B r_contact=0.2 cm, WB r_contact=0.4 cm. τ_ground = μ × m×g × r_sphere × sin(θ). WB: 2× τ → wider precession orbit + tilt grows 2× faster → reaches 40% threshold sooner. WB: high movement, high tilt growth. B: lower movement, slower destabilization.  
**Engine Note**: Spherical contact radius formula; WB wider arc movement is a design variable, not a bug.

---

### [Case 28 — Circular Maximum-Weight Wheel + Static Imbalance: Twisted Fusion Wheel](./1%20case%20study.md#case-28)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Near-cylindrical ring, ~50–60 fine ridges (knurling) on outer face, inner "Spiral Staircase" asymmetric void. r_in/r_out ≈ 0.3; I ≈ 0.545 × m × r_out²  
**Material**: metal (dense ring)  
**Mechanism**: Near-circular → I maximisation (stamina). Spiral Staircase void = static imbalance d_offset → F_imbalance = m×d×ω² → periodic forced vibration (Twisted "Spiral Staircase of Death"). Opposite design intent: maximum I (good) + static imbalance (self-destruct).  
**Engine Note**: staticImbalanceOffset field; forced vibration applies eccentric centrifugal force each tick.

---

### [Case 29 — Jade Fusion Wheel: Dual-Element Ball Channel (Steel + Rubber)](./1%20case%20study.md#case-29)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: 4 channels at 90° intervals. Each: 1 steel ball (~0.25 cm dia, ~0.065 g) + 1 red rubber cushion. r_outer≈2.0 cm, r_inner≈1.0 cm  
**Material**: steel balls + rubber cushions + plastic housing  
**Mechanism**: Rubber cushion changes ball migration dynamics at both endpoints vs single-ball (Case 19). Outer rubber: softer deceleration at r_outer, delayed centrifugal lock. Inner rubber: delayed arrival at r_inner, slower spin-up trigger. Spring-up timing shifts: spin-up peak delayed by rubber compliance.  
**Engine Note**: Two-element channel state; rubber cushion adds compliance delay to migration endpoints.

---

### [Case 30 — Rubber Energy Ring as Spin-Steal Interface: L-Drago II and Opposite-Spin Amplification](./1%20case%20study.md#case-30)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: 3 dragon heads at 120° (plastic structural) + rubber pads between/around heads, proud of plastic surface  
**Material**: rubber pads at AR contact height  
**Spin Coupling**: partial (rubber friction steals spin from opponent)  
**Mechanism**: Relative contact velocity = v_A + v_B (opposite spin) vs v_A − v_B (same spin). Opposite spin: velocity sum amplified → more friction → more spin steal. Same spin: velocity difference, potentially near-zero → minimal steal. Rubber μ_k ≈ 0.50 drives spin transfer.  
**Engine Note**: Spin-direction check in collision handler; relative contact velocity formula for spin-steal magnitude.

---

### [Case 31 — L-Drago Energy Ring Variants: Rubber as the Entire Mechanism (Rush + Assault Falsification)](./1%20case%20study.md#case-31)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Material**: L-Drago II: rubber + plastic (both modes meaningful); Rush (red/gold): plastic only; Assault (blue): plastic only  
**Mechanism**: L-Drago Rush and Assault are plastic-only → mode change negligible (same μ, same restitution both orientations). L-Drago II rubber pads define mode difference. Proves rubber is the entire mechanism — geometry alone without rubber = no mode distinction. Control condition for Case 30.  
**Engine Note**: energyRingMaterial check; if plastic-only → mode change has no physics effect.

---

### [Case 32 — Fusion Wheel + Energy Ring as a Composite Contact System: Meteo](./1%20case%20study.md#case-32)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Meteo: 6 alternating Jaw (smooth) / Claw (textured) protrusions at 60°. L-Drago II covers 3 of 6 positions. Assault Mode: dragon heads cover Claws (expose Jaws); Rapid-Hit Mode: covers Jaws (expose Claws)  
**Material**: metal jaws (high restitution) + metal claws (higher friction) + rubber pads from L-Drago II  
**Mechanism**: Mode change selects exposed metal type. Contact frequency = 6 × ω / (2π) in both modes. Assault: exposed Jaw (deflection) + covered rubber (protected). Rapid-Hit: exposed Claw (friction) + covered rubber.  
**Engine Note**: Composite AR model; mode determines which sub-element faces opponent.

---

### [Case 33 — Wide Flat Tips: XF Contact Mechanics, Flower Pattern, Tornado Stalling, and Spin-Equalizing](./1%20case%20study.md#case-33)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: XF: 4 raised plastic tabs at 90°, r_XF ≈ 1.5 cm (maximum radius); tabs are primary floor contact; disc body behind does NOT contact floor normally  
**Material**: plastic tabs  
**Mechanism**: 4-point discrete contact at r_XF. High ω → f_contact ≈ 191/s. Flower pattern (flower-shaped orbit) vs tornado stall (center orbit): two distinct orbital regimes driven by tip width and friction. Spin-equalizing: wide low-friction tip in opposite-spin → velocity matching drains faster-spinning opponent. High μ_static for tip at rest; lower μ_kinetic when sliding.  
**Engine Note**: Orbital regime detection (flower vs tornado stall); spin-equalization applies drain proportional to velocity difference.

---

### [Case 34 — Metal Flat (MF): The Metal Friction Paradox and Tornado Stalling](./1%20case%20study.md#case-34)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Wide flat metal disc, r ≈ 1.2–1.5 cm  
**Material**: metal  
**Mechanism**: Metal friction paradox: μ_static ≈ 0.70 (high, hard to start), μ_kinetic ≈ 0.25 (low, easy once sliding). μ_ratio = 0.36 (large gap). Once sliding begins: very low resistance → extreme speed. Tornado stalling: at center, spin-driven precession builds until tip locks in tornado orbit; MF achieves near-perfect center-lock due to μ_static threshold.  
**Engine Note**: Two μ values for metal tips; static threshold determines initial movement; kinetic drives aggressiveness once moving.

---

### [Case 35 — Claw 145 (C145): Centrifugal Wing Extension and Impact-Buffered Defense](./1%20case%20study.md#case-35)

**System**: Metal Fight Beyblade / Zero-G/Shogun Steel  
**Geometry**: 3 wings at 120°, each pivoting at inner pin; free outer end. Extended at high spin (centrifugal > gravity); folded at low spin or on impact  
**Material**: plastic wings  
**Mechanism**: Wing extension: F_centrifugal = m_wing × ω² × r_cg > F_gravity_component. Impact: impulse exceeds centrifugal latch → wing folds inward → impact absorbed as wing kinetic energy. Wing re-extends when ω recovers. Impact buffer: energy goes into wing rotation, not bey destabilization. Only useful at high spin where wings stay extended.  
**Gimmick**: centrifugalWingExtension; wingFold on hit above threshold  
**Engine Note**: WingState per wing; fold/extend threshold is spin-dependent.

---

### [Case 36 — Spike (S): Minimum Friction, Maximum Instability — The Reference Destabilization Tip](./1%20case%20study.md#case-36)

**System**: Metal Fight Beyblade / all generations  
**Geometry**: Single sharp point at spin axis, r_contact ≈ 0.03–0.05 cm. Steep cone (≈20° from vertical) above point  
**Material**: plastic (hard)  
**Mechanism**: Near-zero r_contact → near-zero friction torque per tick → minimal movement. But: floor constraint (Case 9) gives full-height torque arm for any hit → massive tilt change per collision. Not a stamina tip despite low friction — falls due to tilt, not spin loss. Reference for "minimum movement" case.  
**Engine Note**: r_contact ≈ 0.035 cm; spike μ = 0.17 (kinetic); high static friction due to point geometry.

---

### [Case 37 — Wing 105 (W105): Aerodynamic Fin Track and Why Airflow Effects Are Negligible at Beyblade Scale](./1%20case%20study.md#case-37)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: 2 swept delta fins at 180° (bilateral), narrow root at hub, wide swept tip extending outward. Standard 105 handle-bars at 90° = totally different shape  
**Material**: plastic fins  
**Mechanism**: Aerodynamic lift F_lift/F_weight ≈ 0.37% at 300 rad/s → negligible. W105 is purely a mass-distribution track: fin mass at r_fin > r_105_hub → ΔI contribution from fins. No aerodynamic benefit. Superior to standard 105 only by small I increase from fin mass position.  
**Engine Note**: Aerodynamic forces disabled/negligible at all Beyblade spin rates; W105 treated as mass contribution only.

---

### [Case 38 — R²F (Right Rubber Flat): Directional Star Contact Geometry and Wear-In Profile Shift](./1%20case%20study.md#case-38)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: 6 rightward-facing rubber curves (convex edges face outward in standard CCW spin). Star profile fresh; flat disc profile worn  
**Material**: rubber  
**Mechanism**: CCW spin: convex edge contacts floor → concentrated load → aggressive movement (μ_edge ≈ 0.90). CW spin: concave face contacts → face friction (μ_face ≈ 0.85). Fresh R²F = aggressive edge. Worn R²F = flat disc (like RF). Wear-in: star edge wears to flat over several battles.  
**Engine Note**: wearState field changes contact geometry; fresh = edge contact, worn = face contact.

---

### [Case 39 — L-Drago Destructor: Rubber Core in a 4D Metal Wheel — Spin Absorption at the Core Level](./1%20case%20study.md#case-39)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Metal Frame (3 dragon heads, heavy) on top; Rubber Core (soft, deformable) below Metal Frame; spin track below Core  
**Material**: metal frame + rubber core  
**Spin Coupling**: partial (rubber core absorbs impulse after passing through metal frame)  
**Mechanism**: Impulse path: opponent CP → Metal Frame (rigid, impulse passes through) → Rubber Core interface (deforms, absorbs 60–80%) → spin axis (minimal transmission). Internal damping vs external rubber (Cases 21, 30, RF). Rubber Core NOT the contact surface — it's a shock absorber. Attack vs Absorb modes affect Metal Frame contact face.  
**Engine Note**: Two-layer impulse path; rubberCoreAbsorption factor multiplies J before it reaches spin axis.

---

### [Case 40 — L-Drago Guardian: Armor-Flat Metal Frame + Full Rubber Core — Defense Mode Architecture](./1%20case%20study.md#case-40)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Metal Frame 39.7 g (heaviest single MFB metal frame), broad flat armor face. Core mostly rubber (5.8 g). Track: S130  
**Material**: metal frame (armor) + rubber core (full cushion)  
**Mechanism**: Armor flat design: broad tangential face → contact normal shallow → most J goes sideways (ring-out force), not inward (torque on defender). Attack Mode: flat armor → tangential deflection. Absorb Mode: sharper face, μ≈0.72. Full rubber core: heavier rubber → more absorption than Destructor's partial rubber.  
**Engine Note**: Defense-type contact geometry: redirect attacker laterally via broad tangential face normal.

---

### [Case 41 — Metal Ball (MB): Metal Sphere on Metal Base — Double Metal Friction Paradox](./1%20case%20study.md#case-41)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Metal sphere r_sphere ≈ 0.65 cm + metal scalloped base ring (contacts at high tilt). r_contact = r_sphere × sin(θ)  
**Material**: metal sphere + metal base  
**Mechanism**: Double metal friction paradox: μ_static ≈ 0.70, μ_kinetic ≈ 0.25 (same as MF). Spherical contact → tilt-dependent movement (like WB but metal). Low stamina decay at low tilt (tiny contact area). But: high ring-out vulnerability when tilted (large r_contact, high speed). Scalloped base contacts at θ > 30–45°.  
**Engine Note**: Metal material overrides friction values; r_contact = sphere_r × sin(θ) same as Case 27.

---

### [Case 42 — Metal Face / Face Bolt: CoM Elevation as a Physics Variable](./1%20case%20study.md#case-42)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Face Bolt/Metal Face sits at h_face ≈ 3.8 cm above floor (top of assembly). Regular plastic: ~0.7 g; Metal Face (MF): ~2.5 g at same height. r ≈ 0 from spin axis → ΔI ≈ 0  
**Material**: plastic or metal (top cap)  
**Mechanism**: Mass at top = no I contribution (r≈0) but raises h_com. Higher h_com → larger gravity tilt torque (τ = m×g×h_com×sin(θ)) → faster precession (Ω_p = τ/(I×ω)) → faster wobble. Metal Face WORSENS stamina while adding no rotational inertia. Tradeoff: top mass at r=0 is pure CoM elevator with no I benefit.  
**Engine Note**: h_com recalculated from part mass × part height when Metal Face included.

---

### [Case 43 — Bit Chip and Face Bolt: Structural Integrity as a Match-End Trigger](./1%20case%20study.md#case-43)

**System**: all generations (Burst mechanic)  
**Mechanism**: Face Bolt/Bit Chip holds top of assembly together. Ejection → Energy Ring seat loosens → off-axis CoM → centrifugal F = m×d×ω² → resonance → instant burst. In game: burst declared when ratchet engagement counter exhausted (impulse threshold per hit accumulates). Real-world ejection extremely hard but maps to the burst point mechanic.  
**Engine Note**: Structural integrity → burst trigger; not gradual degradation but discrete threshold event.

---

### [Case 44 — Fang 4D Metal Wheel: Alternating Protrusion Width and Hollow-Face Mode Reversal](./1%20case%20study.md#case-44)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: 6 protrusions at 60°: W (wide, ≈1.2 cm face, r_cp≈2.1 cm) at 0°/120°/240°; N (narrow, ≈0.6 cm face, r_cp≈2.0 cm) at 60°/180°/300°. Defense Mode: hollow (concave) face outward; Counter Mode: solid face outward  
**Material**: metal  
**Mechanism**: Wide protrusions: larger face area → more contact frequency but slightly smaller J per hit. Narrow protrusions: smaller area → less frequency, higher J per hit. Mode reversal: hollow face (Defense) absorbs; solid face (Counter) transmits. Alternate sizes → two distinct hit magnitudes per revolution.  
**Engine Note**: Alternating wide/narrow protrusion map; mode determines which face is outward.

---

### [Case 45 — Aero Core & Aero Wing (HMS): Small-Diameter Gravitational Torque and Helicopter Vortex Drag](./1%20case%20study.md#case-45)

**System**: Hard Metal System (HMS)  
**Geometry**: HMS r_outer ≈ 1.75 cm vs MFB r_outer ≈ 2.75 cm. I_HMS ≈ 8.6×10⁻⁶ kg·m² vs I_MFB ≈ 3.4×10⁻⁵ kg·m² (4× less). Precession rate ≈ 2.46× faster than MFB at same tilt/spin. Aero Wing: helicopter blade gimmick with vortex drag penalty  
**Material**: metal/plastic (HMS construction)  
**Mechanism**: HMS small diameter → disproportionately faster precession (wobble) → tilt destabilizes earlier. Aero Wing helicopter spin → floor scraping risk at low tilt; vortex drag adds spin decay. Non-competitive due to drag penalty. HMS physics require scaled-down I and h/r ratio calculations.  
**Engine Note**: HMS I values must be scaled separately from MFB; precession rate 2.46× faster at same tilt/spin.

---

### [Case 46 — CWD Chain Attacker: Free-Spinning Weight Disk and the Self-Damage Paradox](./1%20case%20study.md#case-46)

**System**: Hard Metal System (HMS)  
**Geometry**: 9 large plastic spikes on free-spinning bearing disc at WD position, 17 g  
**Material**: plastic spikes + bearing  
**Spin Coupling**: free (bearing decoupled from bey body)  
**Mechanism**: Free-spin CPs cannot deliver full smash: ω_CWD ≠ ω_bey → v_CP_tangential reduced. In worst case, CWD nearly stopped → CP velocity ≈ opponent velocity only → minimal impulse. Self-damage: bearing drag on bey body exceeds opponent damage. CWD decelerates faster than opponent because bearing resistance is applied continuously each tick.  
**Engine Note**: freeSpin flag on WD; ω_WD tracked separately; bearing friction applied to bey body each tick.

---

### [Case 47 — Rubber Weight Core (HMS): Combined WD+RC Position, Force Smash Geometry, and Same-Spin Dependency](./1%20case%20study.md#case-47)

**System**: Hard Metal System (HMS)  
**Geometry**: Cylindrical rubber outer shell (r_rubber ≈ 1.5 cm) spanning from floor to ~1.8 cm. h_com_contribution ≈ 0.9 cm (lower than separate WD at 1.5 cm). Built-in plastic semi-flat tip  
**Material**: rubber outer + plastic core  
**Mechanism**: Combines WD+RC positions. Cylindrical rubber: not spherical, not flat → unique contact geometry per tilt. Force Smash: diagonally-angled lower rim + rubber → upward smash component. Same-spin: rubber deflects hits cooperatively. Opposite-spin: rubber deflects hits destructively. Semi-flat tip: moderate floor traction.  
**Engine Note**: CombinedWDRC layout; cylindrical rubber contact model distinct from spherical (Case 27) and disc (Case 33).

---

### [Case 48 — Advance Defenser (HMS): Metal Roller Contact Points and Rolling Friction](./1%20case%20study.md#case-48)

**System**: Hard Metal System (HMS)  
**Geometry**: 2 metal rollers at 0°/180°, diameter ≈ 0.8 cm, height ≈ 0.6 cm, axle fixed to AR, roller free to spin. 2 plastic upper-attack wings at 90°/270°  
**Material**: metal rollers + plastic wings  
**Mechanism**: Opponent hits roller → roller spins under impact (rolling, not sliding). F_roll = C_rr × N ≈ 0.002N vs F_slide = μ_kinetic × N ≈ 0.25N → rolling reduces transmitted impulse by ~125×. Plastic wings: shallow slope → upper attack component. Rollers deny grip points, wings provide limited upper attack.  
**Engine Note**: rollerCrr = 0.002 for metal-on-HMS-AR contact; rollers use C_rr not μ_kinetic.

---

### [Case 49 — Upper Fox (AR) + CWD Circle Attacker (WD) + Bunshin Core (RC): ABS Caul Ramp Blocking, Eccentric-Mass Wobble, and Spring-Actuated Two-Body Splitting](./1%20case%20study.md#case-49)

**System**: Hard Metal System (HMS)  
**Geometry**: Upper Fox: ABS caul covers lower ≈3 mm of metal upper-attack ramp → effective slope angle α_eff ≈ 18–20° (vs ~33° full ramp). CWD Circle Attacker: off-center mass (two heavy sides) → d_offset → static imbalance. Bunshin Core: splits into two independent bodies on impact above spring threshold  
**Material**: metal frame + ABS caul (Upper Fox) / eccentric metal (CWD CA) / spring-split (Bunshin)  
**Mechanism**: Upper Fox: caul reduces J_up by 40% vs full-ramp ARs. CWD CA: F_imbalance = m×d×ω² → intentional wobble for wider orbit attack coverage. Bunshin: below spring threshold → single body; above → two-body split (each with own mass, I, spin axis). Reattachment when relative ω drops.  
**Engine Note**: ABS caul geometry mask; eccentric mass field; Bunshin two-body state machine.

---

### [Case 50 — Circle Upper (HMS AR): Near-Circular Metal Frame, Full-Perimeter Upper Attack, and Mould-Dependent I](./1%20case%20study.md#case-50)

**System**: Hard Metal System (HMS)  
**Geometry**: Near-circular outer ring with 2 deep slope cuts. Mould 1 (lighter): thinner slopes; Mould 2 (heavier): reinforced slope sections  
**Material**: metal  
**Mechanism**: Near-circular → tangential deflection dominance (attackers bounce off smooth ring). Two slopes = only two upper-attack grab points per revolution. No protrusions for opponents to anchor → glancing hits everywhere else. Mould difference: reinforced slope → higher I at slope radius + better upper-attack effectiveness. Same-physics as Twisted (Case 28) but attack purpose.  
**Engine Note**: Near-circular AR: contactNormal is always glancing except at defined slope zones.

---

### [Case 51 — Spring Core (HMS RC): Spring-Actuated Launch Bounce, Gyroscopic Axis Discontinuity, and Tip Wander](./1%20case%20study.md#case-51)

**System**: Hard Metal System (HMS)  
**Geometry**: Tall two-piece RC body (~2.0 cm), coil spring k≈800 N/m inside. Semi-flat ABS tip  
**Material**: ABS + steel spring  
**Mechanism**: Spring fires at first floor contact (launch): E_spring = ½×800×0.003² = 0.0036 J → Δω ≈ 30 rad/s (negligible). After launch: spring has no further effect. Tall two-piece construction: gap between bodies → gyroscopic axis discontinuity → tip wanders off spin axis over time → static imbalance grows. Joint loosening compounds imbalance.  
**Gimmick**: launchBounce (one-shot spring); tipWander (post-launch axis drift)  
**Engine Note**: Spring effect triggers on first floor contact only; tipWanderRate grows as joint loosens.

---

### [Case 52 — Metal Spike (MS): Hertzian Contact Stress, Stadium Denting, and the WBO Ban](./1%20case%20study.md#case-52)

**System**: Metal Fight Beyblade / HMS (banned)  
**Geometry**: Single hardened metal spike, r_tip ≈ 0.03 cm  
**Material**: hardened steel tip  
**Mechanism**: Hertzian P_max ≈ 172 MPa vs ABS yield strength ≈ 40–60 MPa → permanent stadium floor deformation every contact. Stadium wears, not tip. WBO ban reason: equipment damage, not rule violation. Not relevant for digital game (no destructible stadium), but physics note: tip functions like sharp tip with no wear.  
**Engine Note**: Stadium denting modelled as environment damage (optional); tip physics = sharp tip at r≈0.

---

### [Case 53 — Hades Fusion Wheel + BD145: Geometric Complementarity, Gap-Filling, and Normal-Mode Floor Scraping](./1%20case%20study.md#case-53)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Hades: 3 wings (≈240° of metal) + 3 gaps (≈40° each). BD145: 3 prongs each spanning ≈38° at outer radius. Boost Mode: prongs fill gaps → near-solid composite disc. Normal Mode: prongs point downward → floor scraping  
**Material**: metal Hades + plastic BD145  
**Mechanism**: Boost Mode: geometric complementarity → I increased (near-full disc vs gapped wheel). Normal Mode: BD145 prongs act as floor scrapers → massive spin decay each tick → non-functional. Mode = orientation of BD145 relative to Hades.  
**Engine Note**: CompositeDisc I calculation when prongs fill gaps; normalModeFloorScrape applies large friction force each tick if prongs down.

---

### [Case 54 — Defense Spike (DS): Convex Outer Ring Always-Glancing Geometry and Compound S+D Tip](./1%20case%20study.md#case-54)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Convex outer ring (curves outward/upward, torus segment profile) + center sharp spike. Ring cross-section: circular arc, peak at outer edge. Contact normal at any ring point → tangential direction (away from center, always glancing)  
**Material**: rubber-like outer ring + plastic/metal spike  
**Mechanism**: Convex ring: contact normal always has outward + upward component → attacker redirected sideways, not reflected radially → self-recoil on DS reduced. Compound S+D: upright = spike (stamina); tilted = ring (defense). Similar to CS (Case 60) but convex vs flat.  
**Engine Note**: Convex ring normal calculation: tangent to arc surface, not radial; ring activates at θ > θ_ring.

---

### [Case 55 — L-Drago I + Lightning: Plastic Mode Selector and No-Rubber Falsification](./1%20case%20study.md#case-55)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: L-Drago I: 3 slopes (Upper Mode, 3×ω contact) or 6 blades (Rapid-Hit Mode, 6×ω contact). α_upper ≈ 25°, α_rapid ≈ 15°  
**Material**: plastic only (no rubber)  
**Mechanism**: Plastic mode change → negligible difference. Upper Mode: P = 3f × J_large. Rapid-Hit: P = 6f × J_small ≈ P_upper (same total power, different distribution). Both modes = same μ, same restitution → modes functionally identical with plastic-only wheel. Falsification of mode-change claims without rubber.  
**Engine Note**: Plastic-only AR mode change → no physics distinction; same contact parameters both modes.

---

### [Case 56 — HFS (Hard Metal System): Between-Battle Mode Change — The Fourth Timing Category](./1%20case%20study.md#case-56)

**System**: Hard Metal System (HMS)  
**Mechanism**: Four mode-change timing categories: (1) Automatic (Diablo centrifugal); (2) Per-hit (Kreis ±60°); (3) Pre-match (Gravity, Jade, P.Nemesis, Duo — no disassembly); (4) Between-battle/HFS — requires disassembly (~30–60 s), only during round break. In game: treated identically to Category 3 (fixed for each game in a series).  
**Engine Note**: modeChangeTiming enum; HFS = betweenBattle; pre-match modes lock at match start; between-battle modes can change between series games.

---

### [Case 57 — H145 (Horn 145): Hyper-Extended Contact Point Radius Beyond Wheel Perimeter](./1%20case%20study.md#case-57)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: 2 horn protrusions extending beyond FW perimeter. r_horn ≈ 2.6 cm vs r_wheel ≈ 2.3 cm. h_horn ≈ 1.45 cm above floor (same as standard 145 height)  
**Material**: plastic horns  
**Mechanism**: r_horn > r_wheel → torque arm at horn height exceeds any FW CP torque. Attacker whose AR is at h_horn hits horn BEFORE reaching the wheel. τ_horn = r_horn × J > τ_wheel = r_wheel × J. Height-denial + hyper-extended CP radius = hard-to-reach bey with high defensive torque on contact.  
**Engine Note**: Track-level CP registration; horn at r=2.6 cm overrides FW contact at that height zone.

---

### [Case 58 — GB145 (Gyro Ball 145): Ball Migration at Track Height and Height-Denial Contact Surface](./1%20case%20study.md#case-58)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: 2 steel balls at track body height. m_ball ≈ 2.5 g each. r_outer ≈ 1.4 cm, r_inner ≈ 0.6 cm. h_track = 1.45 cm above floor  
**Material**: steel balls + plastic track  
**Mechanism**: Same angular momentum conservation spin-up as Jade (Case 19): ω_new/ω_old = I_old/I_new. ΔI_GB = 5 g × (1.4²−0.6²) cm² = 8.0×10⁻³ g·cm². Steel balls heavier than Jade (5 g vs ~0.26 g total). Height-denial surface: wide track body blocks opponent attacks at track height, forcing hits above wheel.  
**Engine Note**: Two steel balls; migration formula identical to Jade; height-denial contact surface at track level.

---

### [Case 59 — D125 (Defense 125): Aerodynamic Ring as I-Modifier, Negligible Drag Claim](./1%20case%20study.md#case-59)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Wide circular disc with upward-angled outer lip. r_ring ≈ 1.8 cm. Disc mass ≈ 2.5 g  
**Material**: plastic  
**Mechanism**: Aerodynamic downforce: F_lift/F_weight ≈ 1.4% → negligible (like W105). Real function: disc ring I contribution: ΔI_D125 = 0.0025 × 1.8² cm² → mass at mid-height track radius. "Defense" name is marketing; actual function is I modifier slightly better than standard 125.  
**Engine Note**: Aerodynamic effects suppressed; ΔI_D125 calculated from ring mass × ring radius².

---

### [Case 60 — Coating Spike (CS): Binary Tilt-Threshold Tip Regime Switch](./1%20case%20study.md#case-60)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: Rubber flat outer ring (flat bottom face) + center spike protruding Δh_spike ≈ 0.15 cm below ring base. r_ring_inner ≈ 0.4 cm. θ_switch = arcsin(0.15/0.4) ≈ 22°  
**Material**: rubber ring + metal/hard plastic spike  
**Mechanism**: Step function (binary) regime switch vs SF's gradual frustum transition. θ < 22°: spike only (stamina, r≈0). θ > 22°: ring contacts floor at r≈0.4–1.0 cm (rubber μ≈0.85 → aggressive). Rubber ring adds viscoelastic absorption when tilted. Spike wear: Δh_spike decreases → θ_switch decreases → ring activates earlier.  
**Engine Note**: binaryRegimeSwitch; θ_switch = arcsin(Δh_spike / r_ring_inner); updates with wear.

---

### [Case 61 — Flash Fusion Wheel: Oval I Anisotropy and 2-Node vs 4-Node Weight Distribution](./1%20case%20study.md#case-61)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: 2 oval-head protrusions at 0°/180° (Attack Mode) or 90°/270° (Stamina Mode, frame rotated 90°). Both modes: bilateral symmetry, approximately equal I_xx ≈ I_yy  
**Material**: metal oval heads  
**Mechanism**: Mode change rotates Metal Frame 90° → ovals swap from x-axis to y-axis. I_xx ≈ I_yy → similar I both modes. Real mode difference = contact profile per mode (which face of oval faces outward). Oval I anisotropy: minor axis vs major axis contact slightly different impulse geometry.  
**Engine Note**: Mode rotates which oval face is the primary CP; I difference between modes ≈ negligible.

---

### [Case 62 — 230 Track: Extreme h/r Ratio, Structural Ribs, Height Denial, and Tall-Attack Weakness](./1%20case%20study.md#case-62)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: h_track = 2.3 cm (tallest MFB track), r_track ≈ 1.2 cm. h/r ≈ 0.618 at r_wheel = 2.75 cm (stable). 6 structural ribs prevent flex. Round smooth profile → only glancing contact normals  
**Material**: plastic  
**Mechanism**: Higher h_com (≈1.7 cm vs 1.0 cm for 85) → τ_gravity = 1.70× at same tilt → wobbles 70% faster than 85-track combo at same spin. Height denial: most attackers cannot reach FW above. Weakness: tall opposite-spin attack exploits lower-hit geometry (Case 10) → counter-strike setup unavoidable.  
**Engine Note**: h_com scales with track height; 230 = larger gravity torque, faster wobble onset.

---

### [Case 63 — Wide Defense (WD): Wide Disc Compound Tip, Balance Recovery Paradox, and Fast Movement When Unbalanced](./1%20case%20study.md#case-63)

**System**: Metal Fight Beyblade / all post-MFB generations  
**Geometry**: WD outer r ≈ 1.3 cm, inner curved holes, center sharp tip protrudes Δh ≈ 0.05 cm. θ_WD ≈ 9° (transitions early). Contact radius when disc active: r ≈ 0.3–1.3 cm  
**Material**: plastic disc + inner sharp  
**Mechanism**: Wide disc → larger r_contact → larger τ_friction → balance recovery overshoot oscillation. "Fast movement when unbalanced": large r_contact × μ drives rapid orbit when tilted. θ_WD = arctan(0.05/0.3) ≈ 9° → disc activates almost immediately at any tilt → WD always in disc-contact mode during any significant wobble.  
**Engine Note**: θ_WD ≈ 9°; overshoot oscillation model for balance recovery; WD gives attack-type combo ring-out capability via orbital speed.

---

### [Case 64 — Triple Roller 145 (TR145): Life After Death via Rolling Resistance](./1%20case%20study.md#case-64)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: 3 roller balls at wing tips, embedded. Active at θ = 90° (bey toppled). C_rr_roller ≈ 0.003–0.005 (metal ball on plastic)  
**Material**: metal roller balls + plastic wings  
**Mechanism**: LAD: toppled bey (θ=90°) rolls via rollers instead of sliding. a_roll = C_rr × g ≈ 0.039 m/s² vs a_slide = μ_k × g ≈ 4.9 m/s². Rolling bey travels 124× farther before stopping → can traverse entire stadium. Enables survival as toppled bey exits slowly rather than instantly stopping.  
**Gimmick**: lifeAfterDeath; rolling resistance replaces sliding friction at θ=90°  
**Engine Note**: At tilt≥85°: switch tip model to roller-contact (C_rr instead of μ); LAD translation continues until arena boundary.

---

### [Case 65 — Wave Wide Defense (W²D): CS-Analog Flat+Spike Compound Tip, Spike Wear Transition, and LAD Improvement](./1%20case%20study.md#case-65)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Center spike Δh_spike ≈ 0.15 cm + flat plastic disc r ≈ 1.0–1.2 cm. θ_switch ≈ 22° (same as CS). Wave profile = flat outer disc (no curved holes like WD)  
**Material**: plastic (disc + spike)  
**Mechanism**: Same binary regime as CS (Case 60) but plastic disc (μ≈0.50) vs CS rubber ring (μ≈0.85). Spike wear: Δh_spike_worn = Δh_spike × (1 - wear × 0.8) → θ_switch decreases from 22° → eventually near 0° (pure flat). LAD improvement: flat disc provides continuous floor contact when toppled (vs spike point).  
**Engine Note**: wearState drives θ_switch update; plastic μ_disc = 0.50; similar to CS but less aggressive when disc contacts.

---

### [Case 66 — Rubber Defense Flat (RDF): Three-Regime Tip with Center Protuberance, Rubber Body, and Plastic Encasing Rim](./1%20case%20study.md#case-66)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Layer 1: center protuberance r≈0.05–0.1 cm (spike-like). Layer 2: rubber flat body r≈0.4–1.0 cm. Layer 3: plastic encasing rim r≈1.1–1.3 cm. Three regime thresholds θ_1 < θ_2 < θ_3  
**Material**: hard center + rubber body + plastic rim  
**Mechanism**: θ < θ_1: protuberance only (near-stationary, spike-like). θ_1–θ_2: rubber flat (moderate μ, balanced). θ_2–θ_3: plastic rim (low μ, aggressive banking). Three distinct movement personalities as tilt grows. Rubber absorbs impact energy; plastic rim enables aggressive movement at high tilt.  
**Engine Note**: Three-layer profile; θ_1, θ_2, θ_3 thresholds from geometry; friction changes discontinuously at each.

---

### [Case 67 — Duo Fusion Wheel: Deliberate Static Imbalance as Attack Mechanism (Inverse of Twisted)](./1%20case%20study.md#case-67)

**System**: Metal Fight Beyblade / 4D System  
**Geometry**: Stamina Mode: near-complete disc (4-fold symmetric, d_offset ≈ 0 mm). Attack Mode: Metal Frame rotated → one heavy side → d_offset >> 0  
**Material**: metal frame  
**Mechanism**: Attack Mode: F_imbalance = m×d_offset×ω² → eccentric orbit → attack coverage. I_stamina ≈ 0.90 × m_frame × r_frame². Attack Mode: d_offset deliberately large. Inverse of Twisted: Twisted's imbalance is a defect; Duo's is intentional. Between-battle mode change (Category 4, Case 56).  
**Gimmick**: deliberateStaticImbalance; eccentricOrbitAttack  
**Engine Note**: d_offset field changes per mode; eccentric centrifugal force drives orbit pattern.

---

### [Case 68 — Hole Flat (HF): Annular Contact Reduces Pivot Friction, Increases Stamina vs Full Flat](./1%20case%20study.md#case-68)

**System**: Metal Fight Beyblade / all generations  
**Geometry**: Annular ring contact: r_hole ≈ 0.4 cm inner, r_outer ≈ 1.2 cm. A_contact = π×(1.2²−0.4²) ≈ 402 mm² vs Flat 452 mm² (89% reduction of 11% inner dead-zone)  
**Material**: plastic  
**Mechanism**: Removing center dead-zone (zero sliding velocity at center) redistributes normal pressure outward → smaller effective r_friction → reduced pivot torque. More stamina than Full Flat because annular contact has higher average sliding velocity → friction torque acts at larger average radius but total torque lower than solid disc due to pressure redistribution. Lower pivot friction = bey moves less, conserves spin.  
**Engine Note**: Annular contact geometry; pressure redistribution raises average r_friction slightly but reduces total torque.

---

### [Case 69 — Wing Attack 130 (WA130): Free-Spinning Wing Scrape as Spin-Loss Mechanic](./1%20case%20study.md#case-69)

**System**: Metal Fight Beyblade / Hybrid Wheel System  
**Geometry**: 130-height track with 2 aerofoil wings rotating freely around track axle. Wing tips at h≈1.2–1.4 cm above floor. θ_scrape = arcsin(h_wing_flat / r_bey) ≈ 8–12°  
**Material**: plastic free-spinning wings  
**Spin Coupling**: free (wings spin independently on axle; no torque transfer to bey body)  
**Mechanism**: Wing scrapes floor at θ > θ_scrape → friction torque on wing only (not bey body). Wing spins up/slows vs floor. No spin loss to bey from wing contact alone. However: wing floor contact adds vertical force → bey height decreases → tilt changes. Scraping at low tilt → slight tilt perturbation.  
**Engine Note**: Wings are independent free-spin physics bodies; only vertical force component transmitted to bey on scrape.

---

### [Case 70 — Under Frame (U): Downward-Angled Protrusions as Disc-to-Layer Burst Attack](./1%20case%20study.md#case-70)

**System**: Burst System (Beyblade X / all Burst generations)  
**Geometry**: Ring below disc; 4 diamond protrusions angled ≈30° downward, pointing clockwise. Contacts bottom face of opponent's Layer during disc-to-layer collision  
**Material**: ABS/plastic  
**Mechanism**: Right-spin: protrusion sweeps forward into opponent layer bottom → burst torque = J × r_p × sin(30°) = 0.5 × J × r_p. Left-spin: protrusion sweeps away → reduced recoil only. Down-angle converts lateral collision impulse into upward torque on opponent layer ratchet → burst damage. Flat disc-to-layer contact (α=0°) produces zero burst torque.  
**Gimmick**: discToLayerBurstAttack  
**Engine Note**: Protrusion contact angle α=30°; right-spin directional; burst torque formula.

---

### [Case 71 — Atomic: Wide Free-Rotating Ball + LAD Ring as Dual-Mode Stamina/Defense](./1%20case%20study.md#case-71)

**System**: Burst System (Beyblade X / all Burst generations)  
**Geometry**: Large ball tip r ≈ 1.6 cm free-rotating (bearingFriction ≈ 0.08). Four-tabbed outer ring (LAD) at fixed radius below ball  
**Material**: plastic ball + plastic ring  
**Spin Coupling**: partial (ball rotates freely under floor contact; ring fixed to bey)  
**Mechanism**: Ball: spin_steal = 0.08 × F_floor × r_tip × dt (4× less efficient than B:D but 92% better than fixed ball). Wide ball 4× stronger righting torque vs Sharp (τ_restore = m×g×r_ball×sin(φ)). Outer ring: LAD at topple angle; rolling tabs maintain contact → life-after-death gyrating roll.  
**Engine Note**: freeBallTip with bearingFriction=0.08; outerRingLAD activates at high tilt.

---

### [Case 72 — Ignition' (Disc-Integrated Driver): Impact-Activated Motor Restores Spin](./1%20case%20study.md#case-72)

**System**: Burst System (Beyblade X / GT era)  
**Geometry**: Disc + driver combined unit. Internal spring-circuit (k≈5000 N/m, x_threshold≈1 mm). LR44-powered motor. Thin plastic tip below motor  
**Material**: ABS housing + motor  
**Mechanism**: Impact J > J_trigger = 5 N·s → spring compresses → circuit closes → motor runs ~0.5–2 s → τ_motor ≈ 0.002 N·m → Δω ≈ 400 rad/s spin restoration. Hard hit required; minor bumps don't trigger. Motor reaction torque transmitted directly to bey body via disc-driver unit.  
**Gimmick**: impactActivatedMotor; spinRestoration on collision above threshold  
**Engine Note**: J_trigger threshold; motor run duration state; spin_restored += τ_motor × dt each tick while motor active.

---

### [Case 73 — Loop (Lp): Spin-Velocity-Dependent Roller Behaviour (Stabiliser at High Spin, Brake at Low Spin)](./1%20case%20study.md#case-73)

**System**: Burst System (Beyblade X / all Burst generations)  
**Geometry**: Ball tip at standard height + 4 Defense-style tabs + 2 free-spinning roller wheels draped to floor level on sides. Ball clearance ≈ 2 mm; roller contact height ≈ 0 mm  
**Material**: plastic ball + rollers  
**Mechanism**: High spin: roller contacts floor → upward normal force → righting torque τ_right = F_roller × d_roller. Low spin: roller provides additional braking (rolling resistance adds drag when bey decelerating). Two opposite functions: stabilizer at high spin, brake at low spin. Asymmetric effect based on spin phase.  
**Engine Note**: rollerContactPhase (high/low spin) determines stabilizing vs braking behavior; τ_right formula.

---

### [Case 74 — Spring Core RC (HMS): Tall CoM Height as Precession-Rate Advantage in Same-Spin Stamina](./1%20case%20study.md#case-74)

**System**: Hard Metal System (HMS)  
**Geometry**: Tall RC body ≈ 2.0 cm. Semi-flat ABS tip ≈ 0.5 cm dia. Coil spring (k ≈ 800 N/m) — launch-only effect. Mass ≈ 2 g  
**Material**: ABS + steel spring  
**Mechanism**: Spring: Δω ≈ 30 rad/s extra spin at launch (negligible). Tall CoM height → Ω_p = τ_tilt / (I × ω) decreases with taller h_com (CoM further from pivot → larger τ_tilt but I × ω dominates). In same-spin stamina: taller RC gives SLOWER precession at same spin → CoM traces smaller wobble circle → less floor friction → wins spin-out race vs shorter RC. Spring gimmick irrelevant to competitive niche.  
**Engine Note**: HMS RC CoM height is key stamina variable, not spring. Precession rate formula with h_com.

---

## CS2 — Cases 75–155 + 1088 + 1125–1126 {#cs2}
Source: `2 case study.md`

---

### [Case 75 — D Gear (Evolution Gear for Nexus): Spring-Loaded Slide Δmax≈2.5 mm, k≈1500 N/m](./2%20case%20study.md#case-75)

**System**: DB System (Dynamite Battle / Burst Ultimate)  
**Geometry**: Evolution Gear slide mechanism; δ_max ≈ 0.25 cm. Spring k ≈ 1500 N/m  
**Material**: ABS housing + metal spring  
**Mechanism**: Spring-loaded gear slider that returns stored elastic energy J_spring on impact hit. Paired with Nexus disc (Case 1088). Slide absorbs lateral impulse then restores it to counter-attack.  
**Gimmick**: springLoadedSlide; elasticEnergyReturn on hit  
**Engine Note**: δ_max = 0.025 m; k_spring = 1500 N/m; J_spring = ½k·δ² returned on release.

---

### [Case 76 — Metal Attacker AR (HMS): Lightest Competitive AR, Bounce-Back Attack](./2%20case%20study.md#case-76)

**System**: Hard Metal System (HMS)  
**Geometry**: ~14 g total; left-spin attack angle α≈35°; right-spin angle α≈15°  
**Material**: zinc-alloy  
**Mechanism**: Lightest competitive HMS AR. High restitution bounce on attack. Left-spin asymmetry produces larger upper-attack component. Lower mass → higher recoil self-deflection than heavier ARs (Δω_self ∝ 1/(I_AR + I_combo)).  
**Engine Note**: leftSpinBias; smashFraction_RS = sin(15°)=0.259; smashFraction_LS = sin(35°)=0.574.

---

### [Case 77 — Grip Flat Core RC (HMS): Rubber Flat Tip r≈2 mm, μ_rubber≈1.4, Low-Profile h≈12 mm](./2%20case%20study.md#case-77)

**System**: Hard Metal System (HMS)  
**Geometry**: ~1 g; rubber flat tip r ≈ 0.2 cm; body h ≈ 1.2 cm (low profile)  
**Material**: ABS body + rubber tip  
**Mechanism**: Primary HMS attack RC. Rubber μ≈1.4 drives aggressive floor traction and fast orbital movement. Low body height keeps CoM low. Standard competitive attack RC in HMS.  
**Engine Note**: mu_rubber = 1.4; tipRadius = 0.2 cm; low CoM h = 1.2 cm.

---

### [Case 78 — Metal Spiker AR (HMS): Spike-Tip Deflection θ≈30° vs Flat Blade θ≈10°, ~12% Less Effective](./2%20case%20study.md#case-78)

**System**: Hard Metal System (HMS)  
**Geometry**: ~14 g; spike tip deflection angle θ≈30° vs flat blade θ≈10°  
**Material**: zinc-alloy  
**Mechanism**: Same mass class as Metal Attacker (~14 g). Spike tip deflects incoming attacks at steeper angle (30°) vs flat blade (10°) → ~12% less effective attack force delivery. The spike geometry wastes contact energy into lateral deflection.  
**Engine Note**: deflectionAngle = 30°; effectiveness_vs_flatBlade = 0.88.

---

### [Case 79 — Circle Wide WD (HMS): 14 g, r_outer≈2.2 cm, Spoke-and-Rim, I≈5.33×10⁻⁶ kg·m²](./2%20case%20study.md#case-79)

**System**: Hard Metal System (HMS)  
**Geometry**: 14 g [FACT]; r_outer ≈ 2.2 cm; spoke-and-rim construction  
**Material**: metal  
**Mechanism**: HMS WD with spoke-and-rim geometry placing mass at outer radius. I ≈ 5.33×10⁻⁶ kg·m² (57% more than solid disc of same mass). Standard competitive HMS WD.  
**Engine Note**: I = 5.33e-6 kg·m²; mass concentrated at outer rim via spoke architecture.

---

### [Case 80 — Grip Flat Core Ultimate Mode (HMS): Shore A 40 Rubber, μ≈1.8, ~46% Faster Circuit Speed](./2%20case%20study.md#case-80)

**System**: Hard Metal System (HMS)  
**Geometry**: Same geometry as Grip Flat Core; softer Shore A 40 rubber compound  
**Material**: ABS body + Shore A 40 rubber tip  
**Mechanism**: Harder rubber compound replaced by softer Shore A 40 → μ≈1.8 (~2.13× standard μ). ~46% faster circuit speed vs standard Grip Flat Core. Top-tier HMS attack RC.  
**Engine Note**: mu_rubber_ultimate = 1.8; circuitSpeedMultiplier = 1.46 vs standard GFC.

---

### [Case 81 — Metal Spring AR (HMS): All-Metal Perimeter ~16 g, Mutual High-e Ping-Off, Coil Texture μ≈0.35 Spin Steal](./2%20case%20study.md#case-81)

**System**: Hard Metal System (HMS)  
**Geometry**: ~16 g; all-metal perimeter; coil texture surface  
**Material**: zinc-alloy coil texture  
**Mechanism**: All-metal perimeter → high restitution mutual ping-off (both beys rebound). Coil texture provides μ≈0.35 spin-steal per contact. High mass (16 g) reduces self-deflection vs 14 g ARs.  
**Engine Note**: e_metal = 0.90; mu_coil = 0.35; spinStealPerContact computed from coil friction.

---

### [Case 82 — Circle Heavy WD (HMS): 16 g, r_outer≈1.6 cm, Solid Ring, I≈2.34×10⁻⁶ kg·m²](./2%20case%20study.md#case-82)

**System**: Hard Metal System (HMS)  
**Geometry**: 16 g [FACT]; r_outer ≈ 1.6 cm; solid ring profile  
**Material**: metal  
**Mechanism**: Small-radius solid ring WD. I ≈ 2.34×10⁻⁶ kg·m² (2.28× less than Circle Wide despite being 2 g heavier). Mass concentrated at smaller radius → lower I per gram. Lower stamina contribution than Circle Wide.  
**Engine Note**: I = 2.34e-6 kg·m²; innerRadius ≈ 1.2 cm; compact mass distribution.

---

### [Case 83 — Wolf Crusher AR (HMS): ~20 g, 3 C-Arms at 120°, Symmetric Recoil Both Spin Directions](./2%20case%20study.md#case-83)

**System**: Hard Metal System (HMS)  
**Geometry**: ~20 g; 3 C-shaped arms at 120° spacing  
**Material**: zinc-alloy  
**Mechanism**: Three-fold symmetric C-arm geometry produces symmetric recoil in both spin directions (equal RS and LS attack output). High mass (~20 g) reduces self-deflection. No spin-direction preference.  
**Engine Note**: threeArmSymmetric; spinDirectionBias = none; self-recoilReduction from 20 g mass.

---

### [Case 84 — Bearing Core RC (HMS): ~5 g, Bearing τ≈6.6×10⁻⁷ N·m, 20–30× Slower Decay than ABS, LAD at 3° Tilt](./2%20case%20study.md#case-84)

**System**: Hard Metal System (HMS)  
**Geometry**: ~5 g; ball bearing race; plastic sharp tip r ≈ 0.1 cm  
**Material**: ABS housing + ball bearing  
**Spin Coupling**: bearing (τ_bearing ≈ 6.6×10⁻⁷ N·m)  
**Mechanism**: Ball bearing reduces floor friction τ to 6.6×10⁻⁷ N·m → 20–30× slower spin decay than ABS tip. LAD onset at θ ≈ 3° tilt (very early). Primary HMS zombie/stamina RC.  
**Gimmick**: ballBearingLAD; spinRetention  
**Engine Note**: tau_bearing = 6.6e-7 N·m; LAD_threshold_tilt = 3°; spinDecayFactor = 1/25 vs ABS.

---

### [Case 85 — Advance Balancer AR (HMS): ~15 g, Two-Layer Serrated Metal Rim + ABS Guard, Rattle Fix](./2%20case%20study.md#case-85)

**System**: Hard Metal System (HMS)  
**Geometry**: ~15 g; two-layer construction (serrated metal rim outer + ABS guard inner)  
**Material**: zinc-alloy rim + ABS caul  
**Mechanism**: Two-layer architecture: outer serrated metal rim (aggressive contact) + inner ABS guard (anti-rattle). Fixes Dragon Saucer's rattle problem (metal components shaking loose). ABS guard prevents self-oscillation during battle.  
**Engine Note**: twoLayerAR; antiRattleGuard; serrated rim provides higher friction contact μ≈0.55.

---

### [Case 86 — Circle Balance WD (HMS): ~17 g, r_outer≈1.9 cm, Thick Bridges, I≈3.5–4.0×10⁻⁶ kg·m²](./2%20case%20study.md#case-86)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g; r_outer ≈ 1.9 cm; thick bridge construction  
**Material**: metal  
**Mechanism**: Mid-range I between Circle Heavy and Circle Wide. Thick bridges distribute mass more evenly than Circle Wide's pure spoke. I ≈ 3.5–4.0×10⁻⁶ kg·m². Balance/versatile role.  
**Engine Note**: I_range = [3.5e-6, 4.0e-6] kg·m²; thickBridge geometry.

---

### [Case 87 — Metal Semi-Flat Core RC (HMS): ~3 g, Metal Tip r≈4 mm, μ_metal≈0.20, Docile Movement](./2%20case%20study.md#case-87)

**System**: Hard Metal System (HMS)  
**Geometry**: ~3 g; metal flat-dome tip r ≈ 0.4 cm  
**Material**: ABS body + metal tip  
**Mechanism**: Metal tip μ ≈ 0.20 (lower friction than rubber) → slower, docile orbital movement. Suitable for compact defense builds. Wider dome than Sharp core → more stable, less pointed. Heavier and less erratic than all-plastic flat cores.  
**Engine Note**: mu_metalFlat = 0.20; tipRadius = 0.4 cm; movementPattern = docile.

---

### [Case 88 — Seagon Attacker AR (HMS): ~21 g Heaviest HMS AR, 6 Curved Hooks, Upper + High Recoil Both Directions](./2%20case%20study.md#case-88)

**System**: Hard Metal System (HMS)  
**Geometry**: ~21 g (heaviest HMS AR); 6 curved hook contacts  
**Material**: zinc-alloy  
**Mechanism**: 6 curved hooks produce upper-attack in right-spin. Very high recoil in both spin directions due to hook geometry. Maximum AR mass in HMS → maximum momentum delivery per contact. High recoil is the key tradeoff.  
**Engine Note**: mass_g = 21; hookCount = 6; upperAttack_RS = true; recoil = very_high both directions.

---

### [Case 89 — Upper Fox AR (HMS): ~19 g, Shared Frame with Upper Dragon, Ridge Tip w≈2.2 mm (Rounded) ~9% Less Vertical Lift](./2%20case%20study.md#case-89)

**System**: Hard Metal System (HMS)  
**Geometry**: ~19 g; shared metal frame with Upper Dragon + Upper Fox caul; ridge tip width ≈ 0.22 cm (rounded)  
**Material**: zinc-alloy frame + ABS caul  
**Mechanism**: Shared metal frame with Upper Dragon but different ABS caul. Upper Fox caul's rounded ridge tip (0.22 cm) vs Dragon's sharper 0.20 cm → ~9% less vertical lift per contact. ABS caul geometry is the mode differentiator between Upper Dragon and Upper Fox.  
**Engine Note**: sharedFrameWith = upper_dragon; ridgeTip_mm = 2.2; upperLiftReduction = 9%.

---

### [Case 90 — Smash Leopard AR (HMS): ~18 g, Inner Tooth Pre-Strike + Metal Tab Follow-Through](./2%20case%20study.md#case-90)

**System**: Hard Metal System (HMS)  
**Geometry**: ~18 g; two-layer (shared metal frame + unique ABS inner)  
**Material**: zinc-alloy frame + ABS inner layer  
**Mechanism**: Two-layer contact sequence: inner ABS tooth makes pre-strike (destabilizes opponent angle), followed by metal tab follow-through (main impulse). Staged contact increases total J vs single-element ARs.  
**Engine Note**: twoStageContact; innerToothPreStrike → metalTabMainHit; J_total 30% higher than smooth AR.

---

### [Case 91 — CWD Needle Attacker (HMS): ~17 g, Free-Spinning Spike Ring 2 g, Only 12% Static AR Output](./2%20case%20study.md#case-91)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g total; free-spinning spike ring ~2 g  
**Material**: ABS body + free-spinning spike ring  
**Spin Coupling**: free (spike ring decoupled)  
**Mechanism**: Free-spinning 2 g spike ring delivers only ~12% of equivalent static AR output. Same failure mode as CWD Chain Attacker (Case 46): free rotation absorbs impact energy. Spike ring at WD position.  
**Engine Note**: freeSpin_ring; effectiveImpulseRatio = 0.12; same mechanic as Case 46.

---

### [Case 92 — CWD Mold Variation (HMS): Regular ~15 g vs Heavier ~17 g, Same Geometry, 2.7% Slower Spin Decay](./2%20case%20study.md#case-92)

**System**: Hard Metal System (HMS)  
**Geometry**: Regular ~15 g; heavier variant ~17 g; identical outer geometry  
**Material**: metal  
**Mechanism**: Two mold variants of the same CWD. Heavier mold (+2 g) → 2.7% slower spin decay at same geometry. Spin decay rate scales as 1/I ∝ 1/m·r² → same r, more m = lower dω/dt. Prefer heavier mold variant.  
**Engine Note**: moldVariant; heavier 17 g gives spinDecayFactor = 0.973 vs 15 g baseline.

---

### [Case 93 — Tornado Change Core RC (HMS): ~3 g, Centrifugal Spring Switch Sharp→Hole Flat at ω≈143 rad/s](./2%20case%20study.md#case-93)

**System**: Hard Metal System (HMS)  
**Geometry**: ~3 g; sharp tip + retracted hole-flat mode; spring mechanism  
**Material**: ABS + spring  
**Mechanism**: Centrifugal spring switch: at high spin ω > 143 rad/s, centrifugal force overcomes spring → tip retracts to hole-flat configuration. At low spin ω < 143 rad/s, spring extends tip to sharp configuration. Auto-transition between stamina (sharp high-spin) and LAD (hole-flat low-spin).  
**Gimmick**: centrifugalTipSwitch; sharp_to_holeFlat at ω_threshold = 143 rad/s  
**Engine Note**: omega_threshold = 143 rad/s; sharp when ω > threshold; hole_flat when ω < threshold.

---

### [Case 94 — Turtle Crusher AR (HMS): ~20 g, 2.5 mm Gap-Catch Between ABS Trailing and Metal Tab, J_total 30% Higher](./2%20case%20study.md#case-94)

**System**: Hard Metal System (HMS)  
**Geometry**: ~20 g; gap width 2.5 mm between ABS trailing edge and metal leading tab  
**Material**: zinc-alloy tabs + ABS gap guides  
**Mechanism**: Gap-catch geometry: 2.5 mm gap between ABS trailing edge and metal leading tab catches opponent AR edges. Trapped contact delivers higher impulse than smooth-surface contact. J_total ≈ 30% higher than comparable smooth AR via gap entrapment.  
**Engine Note**: gapCatch_mm = 2.5; J_multiplier = 1.30 vs smooth AR contact.

---

### [Case 95 — Aero Core & Aero Wing RC (HMS): ~5 g Total, Propeller r≈5.0 cm, Only 2–8% Lift, Maximum Vulnerability](./2%20case%20study.md#case-95)

**System**: Hard Metal System (HMS)  
**Geometry**: ~5 g total; propeller span r ≈ 5.0 cm  
**Material**: ABS  
**Mechanism**: Helicopter-blade propeller spanning 10 cm total. Generates only 2–8% of bey weight in lift → aerodynamic gimmick non-functional. 10 cm span = maximum vulnerability to wall and arena contact. Non-competitive (see also Case 45 for physics analysis).  
**Engine Note**: aeroLiftFraction = 0.02–0.08; propellerSpan_cm = 10.0; competitiveTier = non_competitive.

---

### [Case 96 — Rubber Weight Core RC (HMS): ~20 g Combined WD+RC, Rubber Torus r_outer≈2.0 cm, Fixed Plastic Tip](./2%20case%20study.md#case-96)

**System**: Hard Metal System (HMS)  
**Geometry**: ~20 g combined WD+RC unit; rubber torus r_outer ≈ 2.0 cm; h ≈ 3.2–3.4 cm  
**Material**: rubber torus + ABS core + plastic tip  
**Mechanism**: Combined WD+RC position unit with external rubber torus and fixed plastic tip. Rubber torus at combined-unit outer radius contacts opponents. Fixed plastic tip drains spin (no bearing isolation). High total mass (20 g) in combined unit. See also Case 47.  
**Engine Note**: combinedWDRC; rubberTorusRadius = 2.0 cm; fixedPlasticTip; mass_g = 20.

---

### [Case 97 — Samurai Upper AR (HMS): ~22 g, 3 RS Modes (Upper Attack β≈38°, Upper Smash β≈20°, Smash β≈5°), LS Smash Only](./2%20case%20study.md#case-97)

**System**: Hard Metal System (HMS)  
**Geometry**: ~22 g; shared metal frame with Death Gargoyle; 3 right-spin attack modes  
**Material**: zinc-alloy frame + ABS caul  
**Mechanism**: Three right-spin contact modes encoded in blade geometry: Upper Attack (β≈38° → strong vertical lift), Upper Smash (β_eff≈20° → combined), Smash Attack (β≈5° → near-lateral). Left-spin: only smash contact (trailing edge). High mass (22 g) reduces self-recoil.  
**Engine Note**: RS: upperAttack β=38°, upperSmash β=20°, smash β=5°; LS: smash only; sharedFrameWith = death_gargoyle.

---

### [Case 98 — Battle Change Core RC (HMS): ~11 g, Impact-Cam Mode Switch F_threshold≈1.39 N, Fires on Nearly Every Collision](./2%20case%20study.md#case-98)

**System**: Hard Metal System (HMS)  
**Geometry**: ~11 g; impact-cam tip-switch mechanism  
**Material**: ABS + spring cam  
**Mechanism**: Impact-triggered cam mechanism switches tip mode at F_threshold ≈ 1.39 N lateral force. Nearly every normal collision exceeds this threshold → tip switches on almost every hit. Heaviest HMS RC (11 g) → significant mass contribution.  
**Gimmick**: impactCamModeSwitch; F_threshold = 1.39 N  
**Engine Note**: F_trigger = 1.39 N; fires on ~95% of collisions at normal battle speed.

---

### [Case 99 — Jumping Base (Plastics BB): Hasbro k≈700 N/m h_max≈12.8 cm vs Takara k≈1100 N/m h_max≈35.8 cm](./2%20case%20study.md#case-99)

**System**: Plastics System (Gen 1)  
**Geometry**: ~9.8 g body; Hasbro spring k ≈ 700 N/m; Takara spring k ≈ 1100 N/m  
**Material**: ABS body + steel spring  
**Mechanism**: Spring-loaded jumping mechanism. Brand-dependent spring constants: Hasbro k=700 N/m → h_max≈12.8 cm; Takara k=1100 N/m → h_max≈35.8 cm. Takara spring 57% stiffer → 2.8× more jump height. Positive-feedback instability above θ_crit (Case 110).  
**Gimmick**: springJump; brandDependentK  
**Engine Note**: k_hasbro = 700 N/m; k_takara = 1100 N/m; h_max scales as k^0.5 × m^-0.5.

---

### [Case 100 — Left Spin Gear Shells (Regular): ~1.12 g each (2.24 g pair), Chirality Reversal, Incompatible with Neo Cores](./2%20case%20study.md#case-100)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~1.12 g each; 2.24 g pair; mirror-image of right-spin shells  
**Material**: ABS  
**Mechanism**: Left-spin chirality reversal for SG system. Mirror geometry of regular right-spin shells → converts right-spin SG combo to left-spin. Incompatible with Neo format cores and FLS (Free-Spinning) ARs. Regular shell format only.  
**Engine Note**: chiralityReverse; incompatibleWith = [neo_cores, FLS_ARs]; regularShellFormat.

---

### [Case 101 — Metal Change Base (Driger S BB): ~5.1 g, Metal Tip d≈1.1 mm, 30× Contact Pressure vs Flat Tip](./2%20case%20study.md#case-101)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~5.1 g total; metal tip d ≈ 0.11 cm; orbit bifurcation at launch  
**Material**: ABS body + metal sharp tip  
**Mechanism**: Metal sharp tip d=1.1 mm → 30× contact pressure vs flat tip (pressure = F/A; A_metal << A_flat). Launch-dependent orbit bifurcation: specific launch angles produce either aggressive attack orbit or centered stamina orbit. Metal tip durability advantage over plastic sharp.  
**Engine Note**: metalTip_d = 0.11 cm; P_metal = 30 × P_flat; launchOrbitBifurcation.

---

### [Case 102 — Tiger Defenser AR (Plastics): ~3.6 g, 3 Arms β≈10°, Low Right-Spin Recoil, High Left-Spin Recoil](./2%20case%20study.md#case-102)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~3.6 g; 3 arms; slope β ≈ 10° above horizontal  
**Material**: ABS, one-piece  
**Mechanism**: Three-arm AR with slope β≈10° above horizontal. Right-spin: slope presents shallow angle → low recoil. Left-spin: slope reverses (same slope faces opposite direction) → higher recoil. Asymmetric spin-direction behavior from slope geometry.  
**Engine Note**: slope_deg = 10; recoil_RS = low; recoil_LS = high (slope reversal).

---

### [Case 103 — Reverse Dragon AR (Plastics): 3.5 g Takara / 4.0 g Hasbro, Left-Spin Primary (α≈22°), 3 Molds](./2%20case%20study.md#case-103)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 3.5 g (Takara) / 4.0 g (Hasbro); left-spin α≈22° efficiency 2.47; right-spin β≈55° efficiency 0.70  
**Material**: ABS  
**Mechanism**: Strong left-spin preference: α_LS≈22° → cot(22°)=2.47 efficiency; right-spin β≈55° → cot(55°)=0.70 (very poor). 3 mold variants with different fracture thresholds. Hasbro variant 0.5 g heavier.  
**Engine Note**: primarySpin = left; eff_LS = 2.47; eff_RS = 0.70; 3 molds with fracture variation.

---

### [Case 104 — Eight Wide WD (Plastics): 12.2 g (soft) / 12.7 g (hard), Octagonal, I≈6.75×10⁻⁶ kg·m², r_outer≈3.8 cm](./2%20case%20study.md#case-104)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 12.2 g (soft-edge) / 12.7 g (hard-edge); octagonal; r_outer ≈ 3.8 cm  
**Material**: ABS, two edge variants  
**Mechanism**: Octagonal WD with r_outer≈3.8 cm → high I≈6.75×10⁻⁶ kg·m². Hard-edge variant slightly heavier. One of the widest plastics-gen WDs — dominant angular momentum contribution.  
**Engine Note**: I = 6.75e-6 kg·m²; r_outer = 3.8 cm; 8-sided octagonal geometry.

---

### [Case 105 — Storm Grip Base (Plastics BB): 4.4 g, Rubber Dome r≈4 mm, h=10 mm, Hertz Contact a≈5.1×10⁻⁴ m](./2%20case%20study.md#case-105)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.4 g; rubber dome tip r ≈ 0.4 cm; body h = 1.0 cm (low for upper attack)  
**Material**: ABS body + rubber dome tip  
**Mechanism**: Rubber dome tip with Hertzian contact half-width a ≈ 5.1×10⁻⁴ m. Low body h=10 mm keeps bey low for upper attack clearance. Inverted orientation expands contact area 78×. Standard Storm Grip Base rubber flat movement.  
**Engine Note**: rubberDome; Hertz_a = 5.1e-4 m; h_body = 1.0 cm; invertedModeExpands 78×.

---

### [Case 106 — Dragon Head AR (Plastics): ~2.6 g Lightest Competitive-Era AR, Mass Floor Problem](./2%20case%20study.md#case-106)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~2.6 g; lightest AR in competitive-era Plastics  
**Material**: ABS  
**Mechanism**: At 2.6 g, Dragon Head AR is too light for competitive use. Low AR mass → high self-recoil per hit (Δω_self ∝ 1/I_total; lighter AR = less total I = more deflection). Mass floor problem: all geometric advantages irrelevant when mass insufficient.  
**Engine Note**: massFloorProblem; mass_g = 2.6; competitive minimum AR mass ≈ 3.5–4.0 g.

---

### [Case 107 — Wide WD (Plastics): ~12.7 g, Rounded Rim 96.8% Tangential Impulse Loss, I≈2.60×10⁻⁶ kg·m²](./2%20case%20study.md#case-107)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~12.7 g; rounded rim; I ≈ 2.60×10⁻⁶ kg·m²  
**Material**: ABS  
**Mechanism**: Rounded rim geometry causes 96.8% of contact impulse to be redirected tangentially (low smash efficiency). Despite high mass, I is low due to compact radius. Heavily outclassed by Eight Wide WD. Rounded rim is the critical deficiency.  
**Engine Note**: tangentialImpulseLoss = 96.8%; I = 2.60e-6 kg·m²; roundedRim.

---

### [Case 108 — Grip Base (Plastics BB): ~6.9 g, Rubber Flat Tip μ≈1.4, 1.76× ABS Speed, Tornado Drains 3.1×](./2%20case%20study.md#case-108)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~6.9 g; rubber flat tip μ≈1.4; body h ≈ 1.0 cm  
**Material**: ABS body + rubber flat tip  
**Mechanism**: Rubber flat μ≈1.4 → 1.76× orbital speed vs ABS flat. Tornado stall mode drains spin 3.1× faster than orbital mode (high friction while stationary). Low body h=10 mm keeps combat height low.  
**Engine Note**: mu_rubber = 1.4; speedMult_vs_ABS = 1.76; tornadoStallDecayMult = 3.1.

---

### [Case 109 — SG Semi-Flat Base (Plastics BB): 4.7 g, Truncated ABS Dome, Wears Over Time, Below MCB](./2%20case%20study.md#case-109)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.7 g; truncated ABS dome tip  
**Material**: ABS  
**Mechanism**: Truncated ABS dome tip provides moderate friction. Wears over time → tip diameter grows → more friction → changed movement profile. Below Metal Change Base (Case 101) on all performance axes. No competitive niche.  
**Engine Note**: truncatedDome; wearIncreaseDiameter; competitiveTier = below_MCB.

---

### [Case 110 — Jumping Base Trygle (Plastics BB): 7.8 g, Ski Clearance h≈2 mm, θ_crit≈3.6°, Positive-Feedback Instability](./2%20case%20study.md#case-110)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 7.8 g; ski clearance h ≈ 0.2 cm; θ_crit ≈ 3.6°  
**Material**: ABS ski base  
**Mechanism**: Ski geometry enters positive-feedback instability loop above θ_crit=3.6°. τ_ski (49.9 N·m) >> τ_gyro (0.015 N·m) → once tilt exceeds 3.6° the torque from ski contact accelerates tilt faster than gyroscopic restoring → collapse within 1–2 rotational cycles.  
**Engine Note**: skiClearance = 0.2 cm; theta_crit = 3.6°; positiveFeedbackInstability above crit.

---

### [Case 111 — Triple Wing AR (Plastics): 4.4 g, α_R≈8° (eff 7.1), α_L≈13° (eff 4.3), Spin-Symmetric Dual Effectiveness](./2%20case%20study.md#case-111)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.4 g; right-spin α≈8° (cot(8°)=7.1); left-spin α≈13° (cot(13°)=4.3)  
**Material**: ABS  
**Mechanism**: Near-tangential contact geometry works effectively in both spin directions. Right-spin efficiency 7.1; left-spin efficiency 4.3 (both competitive). Spin-symmetric dual effectiveness is the key property — viable AR regardless of spin direction matchup.  
**Engine Note**: eff_RS = cot(8°) = 7.1; eff_LS = cot(13°) = 4.3; spinSymmetric = true.

---

### [Case 112 — SG (Spring Version) Core (Plastics): ~3.3 g, Spring k≈400 N/m, h_static≈11.1 mm, h_impact≈23 mm](./2%20case%20study.md#case-112)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~3.3 g; spring k ≈ 400 N/m; static h ≈ 1.11 cm; impact extended h ≈ 2.3 cm  
**Material**: ABS + spring  
**Mechanism**: Spring extends base height on impact: static h≈11.1 mm → impact height≈23 mm (doubles). Jumping Base 2 lock improves mechanism. The spring extension serves the JB height amplification gimmick (Case 99/110).  
**Gimmick**: springExtension; h_doubles on impact  
**Engine Note**: k = 400 N/m; h_static = 1.11 cm; h_impact = 2.3 cm.

---

### [Case 113 — Defense Grip Base (Plastics BB): ~6.1 g, Stepped Rubber Tip r_normal≈0.5 mm / r_attack≈4 mm, Area Ratio 59.7×](./2%20case%20study.md#case-113)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~6.1 g; Normal Mode rubber hemisphere r≈0.05 cm; Attack Mode hollow flat r≈0.4 cm; area ratio 59.7×  
**Material**: ABS + stepped rubber tip  
**Mechanism**: Stepped rubber tip with two operative radii: Normal Mode narrow hemisphere (near-stationary stamina) vs Attack Mode wide hollow flat (aggressive orbit). Area ratio 59.7× between modes → dramatically different movement. Hasbro cutaway version → hopping behavior.  
**Gimmick**: steppedTwoModeTip; normalVsAttackMode  
**Engine Note**: r_normal = 0.05 cm; r_attack = 0.4 cm; areaRatio = 59.7; hasbroCutaway → hopping.

---

### [Case 114 — Screw Zeus SAR (Plastics): 4.4 g, Dumbbell I_SAR=1.94×10⁻⁶ kg·m², Fixation Mandatory (Free-Spin → Phase-Slip Within 1 Revolution)](./2%20case%20study.md#case-114)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.4 g; dumbbell mass distribution; I_SAR ≈ 1.94×10⁻⁶ kg·m²  
**Material**: ABS  
**Spin Coupling**: fixed mandatory (free-spin causes phase-slip within 1 revolution)  
**Mechanism**: Dumbbell (Sub Attack Ring) mass distribution: I_SAR = m×r² = 1.94×10⁻⁶ kg·m². Free-spin mode causes phase-slip within 1 revolution → non-functional. SAR must be fixed (locked) for competitive use. Adds I at SAR radius when fixed.  
**Engine Note**: fixationMandatory; freeSpinPhaseslip < 1 revolution; I_SAR = 1.94e-6 kg·m².

---

### [Case 115 — Flying Defense AR (Hasbro, Plastics): 7.8 g, Circular Rim Zero Smash (α=90°), I≈6.61×10⁻⁶ kg·m² Highest Plastics AR I](./2%20case%20study.md#case-115)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 7.8 g; circular rim; contact angle α=90° (all radial impulse); I ≈ 6.61×10⁻⁶ kg·m²  
**Material**: ABS  
**Mechanism**: Circular rim with α=90° contact angle → all impulse is radial (zero smash component). Despite highest plastics AR I (6.61×10⁻⁶ kg·m²), circular rim provides no attack capability. Useful only for maximum I/stamina contribution from AR position. Aerodynamic gimmick fails (see Case 1034 for Takara variant).  
**Engine Note**: contactAngle = 90°; smashFraction = 0; I = 6.61e-6 kg·m²; circular rim.

---

### [Case 116 — Square Edge AR (Plastics): ~6.1 g, ~30 Teeth, α≈25°, Efficiency cot(25°)≈2.14, Two-Fold Symmetric](./2%20case%20study.md#case-116)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~6.1 g; ~30 teeth; α ≈ 25°; near-rectangular profile  
**Material**: ABS  
**Mechanism**: Near-rectangular profile with ~30 small teeth. α≈25° → efficiency cot(25°)=2.14. Two-fold symmetric → identical smash output RS and LS. Moderate spin-direction independence.  
**Engine Note**: toothCount = 30; alpha = 25°; eff = 2.14; spinSymmetric (two-fold).

---

### [Case 117 — SG (FAC Version) Shaft (Plastics): Flat Metal Tip r≈0.9 mm, A=2.54×10⁻⁶ m², τ_tip=4.05×10⁻⁵ N·m, Bearing Decoupling ~900× Slower Decay](./2%20case%20study.md#case-117)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: Metal flat tip r ≈ 0.09 cm; A = 2.54×10⁻⁶ m²  
**Material**: metal tip  
**Mechanism**: Full Auto Clutch shaft with flat metal tip. τ_tip = 4.05×10⁻⁵ N·m (4× lower than rubber). Bearing decoupling provides up to ~900× slower theoretical spin decay. Paired with Full Auto Clutch Base (Case 118).  
**Engine Note**: tipRadius = 0.09 cm; tau_tip = 4.05e-5 N·m; bearingDecoupling_theoretical = 900×.

---

### [Case 118 — Full Auto Clutch Base (Plastics BB): Spring-Loaded Centrifugal Clutch, ω_threshold≈170 rad/s, Fixed Shaft at High Spin → Free at Low Spin](./2%20case%20study.md#case-118)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: Spring-loaded centrifugal clutch mechanism  
**Material**: ABS + spring  
**Mechanism**: Centrifugal clutch: ω > 170 rad/s → clutch engaged → shaft fixed to body (attack mode). ω < 170 rad/s → clutch releases → shaft free-spins (stamina mode). Automatic transition from attack to stamina as spin decays.  
**Gimmick**: centrifugalClutch; fixedHigh → freeLow at omega_threshold = 170 rad/s  
**Engine Note**: omega_threshold = 170 rad/s; shaftState = fixed above, free below.

---

### [Case 119 — SG Auto Change Base (Plastics BB): 10.8 g Heaviest Plastics BB, Impact-Trigger Tip Retraction, Left-Spin Self-KO](./2%20case%20study.md#case-119)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 10.8 g (heaviest plastics BB); impact-trigger tip retraction mechanism  
**Material**: ABS  
**Mechanism**: Impact-triggered tip retraction: RS → sharp retracts to hole-flat. Left-spin: tip protrudes instead of retracting → causes self-KO hop from raised tip contact. 10.8 g heaviest plastics BB → massive I contribution from BB position.  
**Gimmick**: impactTipRetraction; leftSpinSelfKO  
**Engine Note**: RS: sharp→holeFlat on impact; LS: tipProtrusion → selfKO risk.

---

### [Case 120 — Double Snake AR (Plastics): 4.1 g, α_R≈55° (eff 0.700), Only 33% of Square Edge](./2%20case%20study.md#case-120)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.1 g; right-spin α≈55° (efficiency cot(55°)=0.700); two-fold symmetric  
**Material**: ABS  
**Mechanism**: Steep contact angle α≈55° → low efficiency (cot(55°)=0.700 = only 33% of Square Edge's 2.14). Left-spin contact mostly obstructed. Two-fold symmetric but poor performance both directions. Primary use is assembled Wyborg (Case 1126).  
**Engine Note**: alpha_RS = 55°; eff_RS = 0.700; LS contact obstructed; 33% of Square Edge eff.

---

### [Case 121 — Eight Balance WD (Plastics): 14.1 g, Octagonal n=8, r_eff_8=0.9745×r vs r_eff_10=0.9834×r, ~1% I Deficit](./2%20case%20study.md#case-121)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 14.1 g; octagonal (n=8); r_eff = 0.9745 × r_outer  
**Material**: ABS  
**Mechanism**: Octagonal WD providing 14.1 g mass. Octagonal effective radius r_eff_8 = 0.9745×r vs decagonal r_eff_10 = 0.9834×r → ~1% I deficit vs Ten Balance WD. Still competitive; 14.1 g total mass is heaviest in plastics WD lineup.  
**Engine Note**: n = 8; r_eff = 0.9745 × r_outer; I_deficit_vs_TenBalance = 1%.

---

### [Case 122 — SG (Auto Change Version) Core (Plastics): 0.57 g Lightest SG Core, h_AC≈4.2 mm 24% Shorter, SGACB-Only](./2%20case%20study.md#case-122)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 0.57 g; h_AC ≈ 0.42 cm (24% shorter than regular)  
**Material**: ABS  
**Mechanism**: Lightest SG core at 0.57 g. 24% shorter height to fit SGACB (SG Auto Change Base). SGACB-only compatibility (doesn't fit regular SG bases). I contribution negligible (0.000065% of combo). Two spring-clip tabs for SGACB engagement.  
**Engine Note**: mass_g = 0.57; h = 0.42 cm; SGACB_only; I_contribution_negligible.

---

### [Case 123 — Upper Wolf AR (Plastics): 5.0 g (M1) / 5.2 g (M2 Hasbro), α≈14°, eff 4.01 = 56% of Triple Wing](./2%20case%20study.md#case-123)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5.0 g (M1) / 5.2 g (M2 Hasbro); α_UW ≈ 14°; efficiency cot(14°)=4.01  
**Material**: ABS (Gold Plastic Syndrome on gold variant → avoid)  
**Mechanism**: Upper-attack AR with α≈14° → efficiency 4.01 = 56% of Triple Wing's 7.12. Right-spin primary. Gold plastic variant = Gold Plastic Syndrome (brittle → avoid). Two mold variants with slight mass difference.  
**Engine Note**: eff = cot(14°) = 4.01; goldPlasticWarning; M1 5.0g, M2 5.2g (Hasbro).

---

### [Case 124 — Metal Saucer AR (HMS): ~15 g, Saucer θ≈3–5° Tangent, Near-Zero Smash, Spin-Steal 0.028 rad/s per Contact](./2%20case%20study.md#case-124)

**System**: Hard Metal System (HMS)  
**Geometry**: ~15 g [EST]; saucer perimeter θ≈3–5° from tangent  
**Material**: zinc-alloy  
**Mechanism**: Near-tangent saucer perimeter → near-zero smash (α very small). Primary effect: friction spin-steal ≈ 0.028 rad/s per contact. No burst contribution. Gaia Dragoon MS / Strata Dragoon MS source bey.  
**Engine Note**: smashFraction ≈ 0; spinStealPerContact = 0.028 rad/s; saucerAngle = 3–5°.

---

### [Case 125 — Spiral Upper AR (HMS): ~20 g, Spiral Slope α≈35°, Upper-Attack Window ≈170° (Omnidirectional)](./2%20case%20study.md#case-125)

**System**: Hard Metal System (HMS)  
**Geometry**: ~20 g [EST]; continuous spiral slope α≈35°; upper-attack window ≈170°  
**Material**: zinc-alloy  
**Mechanism**: Continuous spiral slope provides ≈170° upper-attack window per revolution (vs 60–70° for straight-slope ARs). This omnidirectional upper-attack coverage is the primary competitive advantage. α≈35° → sin(35°)=0.574 upper fraction. Dranzer MS source bey.  
**Engine Note**: upperWindow_deg = 170; upperFraction = sin(35°) = 0.574; spiralContinuous.

---

### [Case 126 — Upper Dragon AR (HMS): 19 g, Shared Frame, LS Metal Smash Primary α_smash_LS≈20°, RS Upper Blocked by ABS Caul](./2%20case%20study.md#case-126)

**System**: Hard Metal System (HMS)  
**Geometry**: 19 g [FACT]; shared metal frame with Upper Fox + Devil Crusher  
**Material**: zinc-alloy frame + ABS caul  
**Mechanism**: Left-spin metal smash primary (α_smash_LS≈20°). RS upper-attack is blocked by ABS caul → only LS functional for main combat. Shared frame between Upper Dragon, Upper Fox, Devil Crusher — ABS caul is the differentiator. Dragoon MF source bey.  
**Engine Note**: primarySpin = left; alpha_smash_LS = 20°; RS_upper_blocked_by_caul; mass_g = 19.

---

### [Case 127 — Devil Crusher AR (HMS): ~19 g, Most Circular Caul, LS Defense Substitute α≈5–8°, RS Upper Weaker α≈18°](./2%20case%20study.md#case-127)

**System**: Hard Metal System (HMS)  
**Geometry**: ~19 g [EST]; shared frame; most circular caul of the shared-frame family  
**Material**: zinc-alloy frame + ABS caul  
**Mechanism**: Most circular ABS caul of the shared frame family → near-circular perimeter in most orientations. LS: contact angle ≈5–8° → defense substitute (tangential contact). RS: upper attack α≈18° (weaker than Upper Dragon). Bloody Devil MS source bey.  
**Engine Note**: circularCaul; LS α=5–8° (defense/tangential); RS α=18° (weak upper).

---

### [Case 128 — Knight Crusher AR (HMS): 19 g, Symmetric Blunt Nubs α≈90°, Equal Smash+Recoil, Non-Competitive](./2%20case%20study.md#case-128)

**System**: Hard Metal System (HMS)  
**Geometry**: 19 g [FACT]; symmetric blunt nubs at α≈90° (normal to surface)  
**Material**: zinc-alloy  
**Mechanism**: Blunt nub contact at α≈90° → all impulse normal to surface (no smash component, no upper component). Equal smash + equal recoil = both beys repelled equally. Net effect: zero combat advantage. Aero Knight MS source bey.  
**Engine Note**: nubAngle = 90°; smashFraction = 0; recoilEqual; competitiveTier = non_competitive.

---

### [Case 129 — God Smasher AR (HMS): 18 g, Shared Smash Frame with Smash Leopard + Smash Phoenix, RS Smash ≈0.330](./2%20case%20study.md#case-129)

**System**: Hard Metal System (HMS)  
**Geometry**: 18 g [FACT]; shared smash frame with Smash Leopard + Smash Phoenix  
**Material**: zinc-alloy frame + wide ABS caul  
**Mechanism**: Shared smash frame family (God Smasher, Smash Leopard, Smash Phoenix). Wide ABS caul reduces LS force smash to ≈0.281; RS smash ≈0.330. Shining God MS source bey.  
**Engine Note**: sharedSmashFrame; smash_RS = 0.330; smash_LS = 0.281; wideABScaul.

---

### [Case 130 — Smash Phoenix AR (HMS): ~18 g, Phoenix-Wing Caul, RS Contact Arc ≈80° (vs 55° Smash Leopard), RS Smash ≈0.360](./2%20case%20study.md#case-130)

**System**: Hard Metal System (HMS)  
**Geometry**: ~18 g [EST]; shared smash frame; phoenix-wing caul; RS contact arc ≈80°  
**Material**: zinc-alloy frame + ABS phoenix caul  
**Mechanism**: Shared smash frame with phoenix-wing caul giving widest RS contact arc (≈80°) in the smash family. RS smash ≈0.360 (highest in shared-frame family). Dranzer MF source bey.  
**Engine Note**: sharedSmashFrame; contactArc_RS = 80°; smash_RS = 0.360; phoenixCaul.

---

### [Case 131 — CWD God Ring (HMS): 18 g, Near-Circular, I≈3.5×10⁻⁶ kg·m², Top-Tier HMS WD](./2%20case%20study.md#case-131)

**System**: Hard Metal System (HMS)  
**Geometry**: 18 g [FACT]; near-circular; I ≈ 3.5×10⁻⁶ kg·m²  
**Material**: ABS  
**Mechanism**: Near-circular CWD at 18 g providing I≈3.5×10⁻⁶ kg·m². Top-tier HMS WD peer to CWD Defense Ring (Case 140). Universal archetype compatibility. Shining God MS source bey.  
**Engine Note**: nearCircular; I = 3.5e-6 kg·m²; universalArchetype; peerTo = cwd_defense_ring.

---

### [Case 132 — CWD Devil Saucer (HMS): ~17 g, Free-Spinning 8-Spike Ring, Opponent Damage ≈0.15 N, Host Spin Loss ≈0.30 rad/s per Orbit](./2%20case%20study.md#case-132)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g [EST]; free-spinning 8-spike ring  
**Material**: ABS body + free-spinning spikes  
**Spin Coupling**: free (spike ring)  
**Mechanism**: Free-spinning 8-spike ring at CWD position. Opponent damage ≈0.15 N (negligible). Host spin loss ≈0.30 rad/s per orbit from bearing drag. Net negative: self-damage exceeds opponent damage. Bloody Devil MS source bey.  
**Engine Note**: freeSpin_spikeRing; opponentDamage = 0.15 N; hostSpinLoss = 0.30 rad/s per orbit; net_negative.

---

### [Case 133 — Wing Attacker CWD (HMS): ~17 g, 2 Asymmetric Wings, r_tip≈2.7 cm vs Standard 2.2 cm, Smash Fraction≈0.375](./2%20case%20study.md#case-133)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g [EST]; 2 asymmetric wings; r_wing_tip ≈ 2.7 cm  
**Material**: ABS  
**Mechanism**: Two asymmetric wings extend attack reach beyond standard 22 mm AR radius to 27 mm. Smash fraction ≈0.375 from wing tips. Wobble risk at low spin from asymmetric mass. Dranzer MF source bey.  
**Engine Note**: wingTipRadius = 2.7 cm; smashFraction = 0.375; asymmetricWobbleRisk.

---

### [Case 134 — Metal Change Core RC (HMS): ~3 g, Metal Sharp Tip r≈0.2–0.3 mm (Level), Flat Metal Collar r≈3–4 mm (Tilted >8°)](./2%20case%20study.md#case-134)

**System**: Hard Metal System (HMS)  
**Geometry**: ~3 g [EST]; sharp tip r ≈ 0.02–0.03 cm (upright); flat collar r ≈ 0.3–0.4 cm (tilted >8°)  
**Material**: ABS body + metal tip/collar  
**Mechanism**: Dual-mode metal tip: upright → sharp metal tip (near-stationary); tilted >8° → flat metal collar activates (orbital drive). Flower pattern via Sliding Shoot technique. Death Gargoyle MS source bey.  
**Engine Note**: theta_switch = 8°; mode0 = metal_sharp (r=0.025 cm); mode1 = metal_flat_collar (r=0.35 cm).

---

### [Case 135 — Manual Change Core RC (HMS): ~2 g, 3-Tip Pre-Battle Selector (Flat/Sharp/Semi-Flat), μ: flat=0.40, sharp=0.10](./2%20case%20study.md#case-135)

**System**: Hard Metal System (HMS)  
**Geometry**: ~2 g [EST]; 3-position manual tip selector  
**Material**: ABS  
**Mechanism**: Pre-battle manual 3-tip selection: flat (μ=0.40, attack), sharp (μ=0.10, survival), semi-flat (μ≈0.25, balance). Selector locks before battle; no in-battle mode change. Dranzer MS source bey.  
**Engine Note**: manualPreBattle; tip_flat μ=0.40; tip_sharp μ=0.10; tip_semiflat μ=0.25; 3 positions.

---

### [Case 136 — Shooter Change Core Alpha RC (HMS): ~8 g, Spin-Direction Tip Preset (RS=Flat ABS, LS=Semi-Flat), WD-at-Bottom Architecture](./2%20case%20study.md#case-136)

**System**: Hard Metal System (HMS)  
**Geometry**: ~8 g [EST]; RS=flat ABS tip; LS=semi-flat tip; WD positioned at base bottom  
**Material**: ABS  
**Mechanism**: Spin-direction preset: RS configuration uses flat ABS tip (attack); LS uses semi-flat tip (balance). WD-at-bottom architecture → WD contact height very low (scrape risk at tilt >15°). Bloody Devil MS source bey. Improved by SCC Gamma (Case 137).  
**Engine Note**: RS_tip = flat_ABS; LS_tip = semi_flat; WD_at_bottom; scrapeRisk_tilt > 15°.

---

### [Case 137 — Shooter Change Core Gamma RC (HMS): 6 g, Improved Alpha (LS=Sharp Instead of Semi-Flat), 3× Better LS Stamina](./2%20case%20study.md#case-137)

**System**: Hard Metal System (HMS)  
**Geometry**: 6 g [FACT]; RS=flat ABS; LS=sharp (improvement over Alpha's semi-flat)  
**Material**: ABS  
**Mechanism**: Improved SCC Alpha: LS tip upgraded from semi-flat to sharp → 3× better LS stamina. Same WD-at-bottom architecture and scrape risk at tilt >15°. 2 g lighter than Alpha. Shining God MS source bey.  
**Engine Note**: LS_tip = sharp (vs Alpha semi_flat); LS_stamina_improvement = 3×; WD_at_bottom.

---

### [Case 138 — Metal Weight Grip Core RC (HMS): ~14–16 g Heaviest HMS RC, Hardened Rubber Flat, Tight Arcs, Smash-Recoil Resistance](./2%20case%20study.md#case-138)

**System**: Hard Metal System (HMS)  
**Geometry**: ~14–16 g [EST]; hardened rubber tip r ≈ 0.28 cm; internal metal weight ~8 g  
**Material**: ABS body + hardened rubber tip + internal metal ballast  
**Mechanism**: Heaviest HMS RC (~15 g). Internal metal ballast adds smash-recoil resistance (heavy RC resists angular deflection on hit). Hardened rubber (μ≈0.62) smaller tip radius → tighter arcs vs GFC. 33% lower torque vs GFC due to smaller r_tip.  
**Engine Note**: mu_rubber = 0.62; internalMetal_g = 8; tighterArcs; smashRecoilResistance.

---

### [Case 139 — Free Shaft Core RC (HMS): ~8 g, Decoupled Inner Shaft, 4.5% Less Spin Loss per Smash Hit, 40% More Spin After 20 Exchanges](./2%20case%20study.md#case-139)

**System**: Hard Metal System (HMS)  
**Geometry**: ~8 g [EST]; inner shaft mechanically decoupled from outer ABS shell; metal flat tip  
**Material**: ABS shell + decoupled metal shaft  
**Spin Coupling**: partial (shaft decoupled from shell via bearing-style free rotation)  
**Mechanism**: Shaft decoupling: smash impact torque goes to outer shell; inner shaft continues spinning undisturbed. 4.5% less spin loss per hit → 40% more spin retained after 20 smash exchanges. Metal flat tip provides erratic aggressive movement.  
**Gimmick**: passiveShaftDecoupling; spinRetention_perHit = 0.955  
**Engine Note**: spinRetained_per_hit = 0.955; cumulativeRetention_20hits = 0.40; metalFlatTip.

---

### [Case 140 — CWD Defense Ring (HMS): ~19 g, Near-Circular, I≈3.65×10⁻⁶ kg·m², Top-Tier Peer to CWD God Ring](./2%20case%20study.md#case-140)

**System**: Hard Metal System (HMS)  
**Geometry**: ~19 g [EST]; near-circular; r_outer ≈ 2.3 cm; r_inner ≈ 1.9 cm; I ≈ 3.65×10⁻⁶ kg·m²  
**Material**: ABS  
**Mechanism**: Top-tier HMS CWD. Near-circular profile (no attack protrusions) + ~19 g → maximum I in HMS CWD class. Universal archetype compatibility (attack, defense, stamina, upper). ~4% higher I than God Ring (19 g vs 18 g). Sea Dragon MS (RBA2) source bey.  
**Engine Note**: I = 3.65e-6 kg·m²; nearCircular; universalArchetype; equivalent = cwd_god_ring.

---

### [Case 141 — Metal Upper AR (HMS): ~20 g, 2 Paired Slopes, Upper Window ≈120° (vs 170° Spiral Upper), RS Primary](./2%20case%20study.md#case-141)

**System**: Hard Metal System (HMS)  
**Geometry**: ~20 g [EST]; paired slopes; RS upper window ≈120°  
**Material**: zinc-alloy  
**Mechanism**: Two paired slope faces produce 120° upper-attack window per revolution vs Spiral Upper's 170° omnidirectional. At equal weight, Spiral Upper is superior. Metal Upper is second-choice upper-attack AR. LS: trailing-edge smash fraction ≈0.259 only.  
**Engine Note**: upperWindow_RS = 120°; upperFraction = sin(30°) = 0.5; secondChoice vs spiral_upper.

---

### [Case 142 — Jiraiya Blade AR (HMS): ~22 g Heaviest HMS AR, Dual-Spin Symmetric smash ≈0.469 Each, Wear-Sensitive](./2%20case%20study.md#case-142)

**System**: Hard Metal System (HMS)  
**Geometry**: ~22 g [EST]; symmetric blade geometry; I_AR ≈ 1.06×10⁻⁵ kg·m²  
**Material**: zinc-alloy  
**Mechanism**: Heaviest HMS AR (22 g). True dual-spin symmetric: smash fraction RS = smash fraction LS = 0.469. 7.7% less self-deflection per hit vs 18 g God Smasher. Wear-sensitive: performance degrades on worn rubber RC. Jiraiya MS (MA-22) source bey.  
**Engine Note**: smash_RS = smash_LS = 0.469; spinDirectionBias = none; wearSensitive; I_AR = 1.06e-5.

---

### [Case 143 — Metal Ape AR (HMS): ~19 g, Upper-Attack Archetype, Mid-Tier; Primary Harvest = Flat Core New Revision RC](./2%20case%20study.md#case-143)

**System**: Hard Metal System (HMS)  
**Geometry**: ~19 g [EST]; upper-attack oriented; I_AR ≈ 8.4×10⁻⁶ kg·m²  
**Material**: zinc-alloy frame + ABS caul  
**Mechanism**: Mid-tier upper-attack AR at ~19 g. Lacks contact-window advantages of Spiral Upper or Samurai Upper. Primary harvest from Magical Ape MS (MA-18) is the Flat Core New Revision RC (Case 149), not this AR.  
**Engine Note**: upperAttack; mid_tier; primaryHarvest = flat_core_new_revision (Case 149).

---

### [Case 144 — Spark Dragon AR (HMS): ~14 g, Free-Spinning Plastic Shell Absorbs 90% Impact, Metal Frame Too Narrow, Non-Competitive](./2%20case%20study.md#case-144)

**System**: Hard Metal System (HMS)  
**Geometry**: ~14 g total; metal frame ~10 g at r≈1.7 cm; free-spinning plastic shell ~4 g  
**Material**: zinc-alloy narrow frame + free-spinning ABS shell  
**Spin Coupling**: free (outer plastic shell)  
**Mechanism**: Free-spinning outer plastic shell absorbs ~90% of impact energy (same failure as CWD Chain Attacker, Case 46). Narrow metal frame r≈17 mm never reaches standard AR contact radius. Spark/flint gimmick is purely decorative. Thunder Dragon (RBA1) source bey.  
**Engine Note**: freeSpin_shell; effectiveImpulse = 0.10; metalFrameRadius = 1.7 cm; competitiveTier = non_competitive.

---

### [Case 145 — CWD Free Cross (HMS): ~17 g, Four-Arm Cross Profile, I≈8.75×10⁻⁶ kg·m² (Est), Angular Asymmetry Risk](./2%20case%20study.md#case-145)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g [EST]; 4-arm cross at r_arm≈2.3 cm; I ≈ 8.75×10⁻⁶ kg·m² [EST]  
**Material**: ABS  
**Mechanism**: Four-arm cross profile places mass at outer arm tips → I higher than Defense Ring despite lower total mass efficiency. Four-fold angular asymmetry → preferred wobble directions at arm positions. Attack-supplemental role (arm tips extend effective contact reach). Jiraiya MS (MA-22) source bey.  
**Engine Note**: crossArm4; I_est = 8.75e-6 kg·m²; angularAsymmetry4fold; supersededBy = cwd_defense_ring for stamina.

---

### [Case 146 — CWD Free Survivor (HMS): ~17 g, Smooth Circular-Trend Survival Profile, Low Drag](./2%20case%20study.md#case-146)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g [EST]; smooth circular perimeter; r_mean ≈ 2.1 cm; I ≈ 7.5×10⁻⁶ kg·m² [EST]  
**Material**: ABS  
**Mechanism**: Smooth survival-oriented CWD profile. Low contact-recoil (no protrusions to catch attackers). Circular perimeter = minimal angular asymmetry. Harvest from Thunder Dragon (RBA1) alongside CWD Free Saucer (Case 147).  
**Engine Note**: smoothCircular; I_est = 7.5e-6 kg·m²; lowRecoil; rba1_harvest.

---

### [Case 147 — CWD Free Saucer (HMS): ~17 g, Saucer-Profile, Spin-Steal 0.016 rad/s per Contact (Height-Mismatch Only)](./2%20case%20study.md#case-147)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g [EST]; saucer profile; saucer angle ≈4°  
**Material**: ABS  
**Mechanism**: Saucer-profile CWD at WD position. Spin-steal only 0.016 rad/s per contact — even less than Metal Saucer AR (Case 124). Contact only during opponent height-mismatch or tilt. Sub-threshold in normal combat. Non-competitive for spin-steal builds.  
**Engine Note**: saucerAngle = 4°; spinStealPerContact = 0.016 rad/s; heightMismatchOnly.

---

### [Case 148 — Flat Core Original RC (HMS): ~1.5 g, ABS Flat Tip r≈2.2 mm, Spin Decay 132 rad/s², Baseline Aggressive](./2%20case%20study.md#case-148)

**System**: Hard Metal System (HMS)  
**Geometry**: ~1.5 g [EST]; ABS flat tip r ≈ 0.22 cm  
**Material**: ABS  
**Mechanism**: Baseline HMS flat RC from first HMS release (Gaia Dragoon MS). ABS flat μ≈0.40 → spin decay ≈132 rad/s². Aggressive but erratic movement. Superseded by New Revision (Case 149). Gaia Dragoon MS (A-123) source bey.  
**Engine Note**: mu = 0.40; tipRadius = 0.22 cm; spinDecay = 132 rad/s²; supersededBy = flat_core_new_revision.

---

### [Case 149 — Flat Core New Revision RC (HMS): ~2 g, Center Screw Reduces Tip r≈1.8 mm, Spin Decay 107 rad/s², "Strictly Better"](./2%20case%20study.md#case-149)

**System**: Hard Metal System (HMS)  
**Geometry**: ~2 g [EST]; ABS flat tip r ≈ 0.18 cm with center screw hub  
**Material**: ABS + center metal screw  
**Mechanism**: Center screw reduces effective tip radius → r=0.18 cm (vs Original 0.22 cm). Tighter movement arcs, 19% slower spin decay (107 vs 132 rad/s²). More consistent flower patterns. "Strictly better" than Original per hmsdb. Magical Ape MS (MA-18) source bey.  
**Engine Note**: tipRadius = 0.18 cm; spinDecay = 107 rad/s²; improvement_over_original = 19% slower decay; centerScrew.

---

### [Case 150 — Metal Weight Flat Core RC (HMS): ~3 g, Largest Flat Diameter r≈2.9 mm, Most Controllable, Faster Spin Decay](./2%20case%20study.md#case-150)

**System**: Hard Metal System (HMS)  
**Geometry**: ~3 g [EST]; metal-weighted ABS flat tip r ≈ 0.29 cm (largest of three flat variants)  
**Material**: ABS body + metal weight insert + flat tip  
**Mechanism**: Largest flat tip diameter → most predictable/controllable arcs but fastest spin decay (173 rad/s²) of the three flat variants. Internal metal weight adds lower-CoM stability. Most controllable but highest spin drain. Thunder Dragon (RBA1) source bey.  
**Engine Note**: tipRadius = 0.29 cm; spinDecay = 173 rad/s²; mostControllable; fastestDecay of flat variants.

---

### [Case 151 — Reverse Defenser CWD (HMS): ~17 g, Circular Smooth Profile, Defense/Stamina Role, Dranzer MF Alt-Color Variant](./2%20case%20study.md#case-151)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g [EST]; circular smooth perimeter; r_outer ≈ 2.1 cm; I ≈ 6.5×10⁻⁶ kg·m² [EST]  
**Material**: ABS  
**Mechanism**: Smooth circular defense CWD. Counterpart to Wing Attacker CWD (Case 133) from alternate Dranzer MF release variant. No protrusions → low contact recoil → defense/stamina role. 17 g (lighter than God Ring/Defense Ring top-tier).  
**Engine Note**: circularSmooth; I_est = 6.5e-6 kg·m²; lowRecoil; altColorVariant = dranzer_mf.

---

### [Case 152 — Bearing Core 2 RC (HMS): ~4 g, Rubber Tip on Bearings, Mint=Near-Stationary, Worn=Active Orbit, Taller CoM Risk](./2%20case%20study.md#case-152)

**System**: Hard Metal System (HMS)  
**Geometry**: ~4 g [EST]; rubber tip on ball bearings; taller than Bearing Core 1  
**Material**: ABS housing + rubber tip + ball bearings  
**Spin Coupling**: bearing (τ_bearing ≈ 6.6×10⁻⁷ N·m)  
**Mechanism**: Wear-dependent dual mode: Mint (r_tip≈0.5 mm, μ≈0.10) → near-stationary stamina; Worn (r_tip≈1.8 mm, μ≈0.42) → active rubber-flat orbit. Taller height than BC1 → higher CoM → more nutation susceptibility at low spin. Best used deliberately worn for active defense.  
**Gimmick**: wearDependentModeReversal; mint→stamina, worn→activeOrbit  
**Engine Note**: mint: spinDecay = 15 rad/s²; worn: spinDecay = 60 rad/s²; CoMHeightPenalty vs BC1.

---

### [Case 153 — Sharp Core RC (HMS): ~1.5 g, Hasbro Ball-Tip r≈1.5 mm / SonoKong Pointed r≈0.5 mm, Non-Competitive](./2%20case%20study.md#case-153)

**System**: Hard Metal System (HMS)  
**Geometry**: ~1.5 g [EST]; Hasbro tip r≈0.15 cm (ball-shaped); SonoKong tip r≈0.05 cm (pointed)  
**Material**: ABS  
**Mechanism**: Brand-dependent tip geometry: Hasbro = rounded ball shape (functionally semi-flat); SonoKong = more pointed. Both: non-competitive — no orbital drive for attack, insufficient spin retention for survival. Most pronounced brand mold variation in HMS RC lineup.  
**Engine Note**: hasbro_r = 0.15 cm; sonokong_r = 0.05 cm; competitiveTier = non_competitive; moldVariation.

---

### [Case 154 — Metal Sharp Core RC (HMS): ~2.5 g, Three Kingdoms Variant Has Flat Tip Despite Name, Below Competitive Threshold](./2%20case%20study.md#case-154)

**System**: Hard Metal System (HMS)  
**Geometry**: ~2.5 g [EST]; standard: metal sharp r≈0.08 cm; Three Kingdoms variant: metal flat r≈0.4 cm (flat despite name)  
**Material**: ABS + metal tip  
**Mechanism**: Standard variant: near-stationary center movement (metal sharp, μ≈0.06). Three Kingdoms variant: flat tip despite "Sharp" name → orbital drive (approximates Metal Weight Flat Core at lower mass). Both below competitive threshold. SonoKong/Korean market HMS.  
**Engine Note**: TK_variant: tipType = metal_flat (despite name); standard: tipRadius = 0.08 cm μ = 0.06; competitiveTier = non_competitive.

---

### [Case 155 — Semi-Flat Core RC (HMS): ~2 g, Launch-Dependent Behavior (Hard=Mild Orbit, Soft=Docile Center), Early Balance Archetype](./2%20case%20study.md#case-155)

**System**: Hard Metal System (HMS)  
**Geometry**: ~2 g [EST]; ABS semi-flat tip r ≈ 0.25 cm  
**Material**: ABS  
**Mechanism**: Launch-style-dependent behavior: hard launch (ω≥400 rad/s) → mild orbital movement; soft launch (ω<300 rad/s) → centered docile. First "balance" HMS RC. Distinct from Metal Semi-Flat Core (Case 87) — different bey, different tip material. Driger MS (A-124) source bey.  
**Engine Note**: launchDependent; hardLaunch → mildOrbital; softLaunch → centreDocile; distinct from Case 87.

---

### [Case 1025 — Neo Right Spin Gear Shells (Plastics): ~1.15 g Each (2.30 g Pair), Neo Cavity d≈12.5 mm, 3-Lug, HMC Access](./2%20case%20study.md#case-1025)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~1.15 g each; 2.30 g pair; Neo cavity d ≈ 1.25 cm; 3-lug interface  
**Material**: ABS  
**Mechanism**: Neo format SG shells with enlarged core cavity (d≈12.5 mm, 3-lug) enabling Heavy Metal Core access. I_HMC ≈ 2.35×10⁻⁶ kg·m². Neo cavity incompatible with regular shell cores. Enables highest-I core option in plastics-gen SG system.  
**Engine Note**: neoCavity_d = 1.25 cm; 3lug; I_HMC = 2.35e-6 kg·m²; enables HMC.

---

### [Case 1026 — Metal Weight Core (MWC) (Plastics SG): ~2.5 g, Zinc Insert 2.1 g + ABS 0.4 g, I≈4.63×10⁻⁸ kg·m², 0.37% Combo I](./2%20case%20study.md#case-1026)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~2.5 g; zinc insert 2.1 g + ABS 0.4 g; I_MWC ≈ 4.63×10⁻⁸ kg·m²  
**Material**: zinc + ABS  
**Mechanism**: Metal weight core insert for SG. I contribution = 0.37% of combo I vs Magnecore — negligible inertia contribution. Small radius means central metal mass has minimal angular momentum contribution. Primarily used for assembly weight balance.  
**Engine Note**: I = 4.63e-8 kg·m²; I_combo_fraction = 0.37%; centralMass → negligible I.

---

### [Case 1027 — Normal Core (Plastics SG): ~1.2 g, All-Plastic Hollow Neo Core, I≈3.84×10⁻⁸ kg·m², CMS Base Compatible](./2%20case%20study.md#case-1027)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~1.2 g; hollow Neo-format ABS core; shaft d ≈ 0.28 cm  
**Material**: ABS  
**Mechanism**: Lightest Neo-format core. All-plastic hollow construction. I ≈ 3.84×10⁻⁸ kg·m² (negligible). CMS Base sole-compatible (shaft d≈2.8 mm fits 3.0 mm CMS bore). Standard Neo core baseline.  
**Engine Note**: I = 3.84e-8 kg·m²; CMS_Base_compatible; Neo_format; shaft_d = 0.28 cm.

---

### [Case 1028 — Regular SG Core Part (Plastics): ~0.61 g Second-Lightest Core, Two Spring-Clip Tabs, Regular Shells Only](./2%20case%20study.md#case-1028)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~0.61 g; two spring-clip tabs  
**Material**: ABS  
**Mechanism**: Second-lightest SG core (lightest is SG Auto Change core at 0.57 g). Regular shell format only — not Neo-format compatible. Spring-clip tabs engage regular shells. Minimal I contribution.  
**Engine Note**: mass_g = 0.61; regularShellsOnly; notNeoCompatible; springClipTabs.

---

### [Case 1029 — Right Spin Gear Shells + Metal Weight Gear (Plastics): Shells 1.1 g Each, MWG 1.12 g Anti-Rattle, I_MWG≈1.10×10⁻⁷ kg·m²](./2%20case%20study.md#case-1029)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: Shells ~1.1 g each (2.2 g pair); MWG 1.12 g; I_MWG ≈ 1.10×10⁻⁷ kg·m²  
**Material**: ABS shells + metal gear  
**Mechanism**: Right-spin gear shells with Metal Weight Gear (MWG) insert. MWG provides anti-rattle function and 1.4% I contribution to combo. Neo format incompatible. Slightly lighter shells than Neo format (1.1 vs 1.15 g each).  
**Engine Note**: MWG_mass = 1.12 g; I_MWG = 1.10e-7 kg·m²; antiRattle; Neo_incompatible.

---

### [Case 1030 — SG Wing Base (Plastics BB): ~5.9 g, SAR-Accepting, Irremovable Clips Δh≈1.5–2.0 mm, Soft Plastic Tip](./2%20case%20study.md#case-1030)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~5.9 g; SAR-accepting; irremovable base clips Δh ≈ 0.15–0.20 cm below base floor  
**Material**: ABS + soft plastic tip  
**Mechanism**: Accepts Sub Attack Ring (SAR) at base. Irremovable base clips protrude 1.5–2.0 mm below base floor — creates height offset in assembled combos. Soft plastic tip produces spin deficit vs hard tips. WBO flex ruling on Screw Zeus compatibility.  
**Engine Note**: SAR_accepting; clipOverhang = 0.175 cm; softTip; WBO_flexRuling.

---

### [Case 1031 — SG Sharp Base (Plastics BB): ~6.6 g, Sharp Tip r≈0.35 mm, h_total≈16–18 mm, CoM≈19.9 mm High](./2%20case%20study.md#case-1031)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~6.6 g; sharp tip r ≈ 0.035 cm; body h ≈ 1.6–1.8 cm; CoM_combo ≈ 1.99 cm  
**Material**: ABS (M1: metal retention ring)  
**Mechanism**: Sharp tip BB with tall body (50–70% taller than compact). High CoM (19.9 mm = 43% higher than MCB) → faster precession, less stable. M1 mold has metal tip retention ring for durability. Primary use: all-range stamina via minimal friction.  
**Engine Note**: tipRadius = 0.035 cm; h_total = 1.7 cm; CoM_combo = 1.99 cm; metalRetentionRing in M1.

---

### [Case 1032 — AR War Lion (Plastics): ~3.7 g, 2 Swept Wings 180°, β_RS≈7°, β_LS≈9°, 61.1% Exposed Azimuth](./2%20case%20study.md#case-1032)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~3.7 g; 2 swept wings at 180°; tip r ≈ 2.6 cm; 2-wing gap sectors 110° each (61.1% azimuth exposed)  
**Material**: ABS  
**Mechanism**: Two swept wings with low attack angles (β_RS≈7°, β_LS≈9°) → low recoil both directions. Symmetric wing gaps create 61.1% exposed azimuth per revolution (opponent can bypass wings). Galeon bey.  
**Engine Note**: beta_RS = 7°; beta_LS = 9°; twoWingSymmetric; exposedAzimuth = 61.1%.

---

### [Case 1033 — Sub AR War Lion (Plastics): ~1.3 g, Near-Circular Ring, r_winglet≈24 mm, 2 mm Gap vs Wide Defense](./2%20case%20study.md#case-1033)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~1.3 g; near-circular ring; r_winglet ≈ 2.4 cm  
**Material**: ABS  
**Mechanism**: Near-circular SAR ring with minimal winglets. r_winglet≈24 mm leaves 2 mm gap vs Wide Defense (r_WD≈26 mm) → wedge entry failure mode when opponent AR attacks at WD height. Near-circular provides minimal smash but also minimal recoil.  
**Engine Note**: nearCircular; r_winglet = 2.4 cm; wedgeEntryFailure at WD_r = 2.6 cm.

---

### [Case 1034 — Flying Defense AR (Takara, Plastics): 6.2 g, I_Takara≈1.78×10⁻⁶ kg·m², Aerodynamic Gimmick Fails (2–8% Lift)](./2%20case%20study.md#case-1034)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 6.2 g; I_Takara ≈ 1.78×10⁻⁶ kg·m² (vs Hasbro 1.99×10⁻⁶)  
**Material**: ABS  
**Mechanism**: Takara variant of Flying Defense AR (lighter than Hasbro Case 115 at 6.2 vs 7.8 g). Lower I (1.78 vs 1.99 ×10⁻⁶ kg·m²). Aerodynamic lift gimmick generates only 2–8% of bey weight in lift → non-functional. Protrusions at wrong contact height.  
**Engine Note**: I = 1.78e-6 kg·m²; lighter than Hasbro (Case 115); aeroLift = 2–8% of weight (negligible).

---

### [Case 1035 — Jumping Base 2 (Cyber Dragoon Plastics BB): 6.8 g, Free-Spinning Disc r≈27 mm, I_total≈1.89×10⁻⁶ kg·m², Hasbro FD Combo](./2%20case%20study.md#case-1035)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 6.8 g; free-spinning disc r ≈ 2.7 cm; inner body h ≈ 1.4 cm; I_BB_total ≈ 1.89×10⁻⁶ kg·m²  
**Material**: ABS body + free-spinning disc  
**Spin Coupling**: free (outer disc)  
**Mechanism**: Wide free-spinning disc at base adds I and provides "dish grind" interaction for Hasbro Flying Defense AR combo. Inner body h=14 mm. JB2 lock feature improves Spring SG engagement (Case 112). Cyber Dragoon source bey.  
**Engine Note**: freeSpinDisc_r = 2.7 cm; I_total = 1.89e-6 kg·m²; JB2_lock; HabroFD_dishGrind.

---

### [Case 1036 — Ten Heavy WD (Plastics): 16.1 g / 17.0 g Spike Lizard, r_outer≈22.5 mm, I≈5.14–5.60×10⁻⁶ kg·m²](./2%20case%20study.md#case-1036)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 16.1 g standard / 17.0 g Spike Lizard; r_outer ≈ 2.25 cm  
**Material**: ABS / plated ABS (Spike Lizard)  
**Mechanism**: Ten-spoke WD with heavy mass. I ≈ 5.14×10⁻⁶ kg·m² (standard) / 5.60×10⁻⁶ kg·m² (Spike Lizard plated +8.9%). Ten-spoke effective radius r_eff_10 = 0.9834 × r → better than 8-spoke. Standard competitive WD.  
**Engine Note**: I_standard = 5.14e-6 kg·m²; I_spikeLizard = 5.60e-6 kg·m²; tenSpoke_r_eff = 0.9834 × r.

---

### [Case 1037 — Flame Wing AR (Plastics): 3.8 g, 3 Swept Wings with Tip Bumps, r_outer≈24 mm, RS Upper + Moderate Smash](./2%20case%20study.md#case-1037)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 3.8 g; 3 swept wings; r_outer ≈ 2.4 cm; tip bump width t_tip ≈ 0.18 cm  
**Material**: ABS  
**Mechanism**: Three swept wings with leading-edge tip bumps. RS: upper attack + moderate smash. Tip bump width ≈1.8 mm vulnerable to fracture. I_AR ≈ 1.75×10⁻⁶ kg·m². Dranzer F source bey.  
**Engine Note**: upperAttack_RS; tipBump; fractureTip_t = 0.18 cm; I_AR = 1.75e-6 kg·m².

---

### [Case 1038 — SG (Triple Change Version) Core (Plastics): 1.7 g, Neo-Format, 3-Tip Carrier (Sharp/Semi-Flat/Flat at 120°), FCB Only](./2%20case%20study.md#case-1038)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 1.7 g; Neo-format; 3 tips at 120° spacing (Sharp/Semi-Flat/Flat)  
**Material**: ABS  
**Mechanism**: Rotating tip carrier with 3 tips at 120° — one selected per battle by rotating carrier. Friction-indexed positioning. Flame Change Base only compatible. Early mold has ridge causing premature hopping.  
**Gimmick**: rotatableTipCarrier; 3 positions; sharpSemiFlatFlat  
**Engine Note**: 3tip_120deg; FCB_only; moldRidgeHopping in early mold.

---

### [Case 1039 — Flame Change Base (Plastics BB): 4.1 g, TCV-Dedicated, Cross-Slot Receiver, LAD τ≈2.95×10⁻⁵ N·m, Cannot Accept HMC](./2%20case%20study.md#case-1039)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.1 g; cross-slot TCV receiver; smooth rim  
**Material**: ABS  
**Mechanism**: Dedicated base for Triple Change Version SG core (Case 1038). Cross-slot receiver accepts TCV only. Smooth rim provides middling LAD (τ_LAD ≈ 2.95×10⁻⁵ N·m, dω/dt ≈ 2.95 rad/s²). Cannot accept Heavy Metal Core.  
**Engine Note**: TCV_dedicated; crossSlotReceiver; tau_LAD = 2.95e-5 N·m; HMC_incompatible.

---

### [Case 1040 — Metal Balls 1/4" and 3/16" Steel (Plastics Ballast): 1/4" m=1.050 g d=6.350 mm; 3/16" m=0.448 g d=4.763 mm](./2%20case%20study.md#case-1040)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 1/4" ball: m=1.050 g, d=0.635 cm. 3/16" ball: m=0.448 g, d=0.476 cm. Mass ratio 2.344  
**Material**: steel  
**Mechanism**: Steel ballast balls used as rolling tips or internal ballast. 1/4" ball at outer radius provides maximum I contribution from small mass; 3/16" ball provides minimal I. Hertzian contact model for rolling tip application.  
**Engine Note**: q_inch: m=1.050g d=0.635cm; three16_inch: m=0.448g d=0.476cm; Hertz_rolling_contact.

---

### [Case 1088 — Nexus (Nx) Disc (DB System): 30.6 g, 8 Blades (4 Upper + 4 Lower at 45° Offset), I≈2.13×10⁻⁵ kg·m²](./2%20case%20study.md#case-1088)

**System**: DB System (Dynamite Battle / Burst Ultimate)  
**Geometry**: 30.6 g; 8 blades: 4 upper + 4 lower offset at 45°; r_outer ≈ 3.6 cm  
**Material**: metal  
**Mechanism**: DB-era disc with alternating upper and lower blade arrangement creating 45° angular offset between the two sets. I ≈ 2.13×10⁻⁵ kg·m². Paired with D Gear evolution gear (Case 75) for spring-loaded counter-attack.  
**Engine Note**: bladeCount = 8 (4+4 at 45° offset); I = 2.13e-5 kg·m²; r_outer = 3.6 cm; pairedWith = D_Gear.

---

### [Case 1125 — Trygle (Assembled Bey): Triple Wing AR + Eight Wide WD + SG Spring + Jumping Base Trygle, I_total=2.314×10⁻⁵ kg·m², t_stall_real=1–3 s](./2%20case%20study.md#case-1125)

**System**: Plastics System (Gen 1, SG System, A-to-F Series)  
**Geometry**: Total 30.5 g; I_total = 2.314×10⁻⁵ kg·m²; component I: Triple Wing (40.9%), Eight Wide WD (43.1%), SG Spring Core (0.4%), JB Trygle (15.6%)  
**Material**: ABS multi-component assembly  
**Mechanism**: Stamina/Self-Destruct archetype. Eight Wide WD dominates I (43.1%) providing angular momentum. Jumping Base enters positive-feedback instability at θ_crit=3.6° (Case 110). Spring SG pre-loads instability. Theoretical t_stall=7.4 s; real ≈1–3 s due to ski collapse. No competitive viability.  
**Engine Note**: I_total = 2.314e-5 kg·m²; ski_collapse dominant; realStall = 1–3 s; competitiveTier = none.

---

### [Case 1126 — Wyborg (Assembled Bey): Double Snake AR + Eight Balance WD + SG Auto Change + SGACB, I_total=2.124×10⁻⁵ kg·m²](./2%20case%20study.md#case-1126)

**System**: Plastics System (Gen 1, SG System, A-to-F Series)  
**Geometry**: Total 29.0 g; I_total = 2.124×10⁻⁵ kg·m²; component I: Double Snake (54.5%), Eight Balance WD (28.7%), SG ACo (0.4%), SGACB (11.7%)  
**Material**: ABS multi-component assembly  
**Mechanism**: Stamina/Left-Spin Self-KO archetype. Double Snake AR recoil 1.8× higher vs left-spin opponents. Auto Change tip self-KOs vs right-spin attack above trigger threshold. Only viable scenario: same-spin outspin vs right-spin stamina opponent. t_stall=4.7–6.5 s depending on matchup.  
**Engine Note**: I_total = 2.124e-5 kg·m²; selfKO_risk = high vs RS_attack; viable = same_spin_outspin only.



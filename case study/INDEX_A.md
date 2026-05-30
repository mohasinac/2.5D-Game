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
**SAR–AR Core Compatibility**: Free-spin behavior of Screw Zeus SAR is geometry-dependent — compatibility is NOT universal across all AR Cores. With Zeus Core (native): collar gap fits Screw Zeus dumbbell geometry exactly → full free-spin rotation possible (though still non-functional due to phase-slip). With War Lion AR Core (Case 1032): collar geometry and AR slope contact surfaces create interference → SAR achieves partial movement only (neither locked nor freely spinning). The AR slopes and SAR dumbbell slopes are contact points that physically define the rotation range — which AR Core a SAR is mounted on determines whether full, partial, or no free-spin is geometrically possible. See also Case 233 (Screw Zeus SAR as standalone part), Case 1033 (Sub AR War Lion).  
**Engine Note**: fixationMandatory; freeSpinPhaseslip < 1 revolution; I_SAR = 1.94e-6 kg·m²; compatibilityGeometryDependent — fullFreeSpin only with native AR Core; partialMovement with War Lion AR Core (collar gap + slope interface defines range).

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
**SAR–AR Core Compatibility Note**: War Lion AR Core (parent AR for this Sub AR) interacts with Screw Zeus SAR (Case 114, Case 233) with only partial movement — the AR slope surfaces and collar geometry of War Lion Core create interference with Screw Zeus dumbbell slopes, restricting rotation. Contrast: Screw Zeus SAR on its native Zeus Core allows full rotational range (though still non-competitive due to phase-slip). This illustrates the general principle: SAR free-spin compatibility is determined by the physical interface between (1) the collar gap on the AR Core and (2) the slope profiles on the SAR dumbbell body. War Lion AR Core's collar and slope geometry cannot accommodate Screw Zeus geometry as freely as Zeus Core can.  
**Engine Note**: nearCircular; r_winglet = 2.4 cm; wedgeEntryFailure at WD_r = 2.6 cm; SARcompat_geometryDependent — Screw Zeus SAR gets partialMovement only (collar gap + slope interference).

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

---

## CS3 — Cases 156–187 + 911–950 {#cs3}
Source: `3 case study.md`

---

### [Case 156 — Neo SG (Double Bearing Version) Shaft: Three-Point Decoupling, Wide-Plastic Tip Stability, and CGB Precession Assist](./3%20case%20study.md#case-156)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 1.1 g shaft; r_tip_contact ≈ 0.4 cm; r_CGB_rim ≈ 2.2 cm; τ₃ = 1.6×10⁻⁷ N·m  
**Material**: metal shaft, plastic tip dome  
**Spin Coupling**: 3 free-spin stages: upper casing bearing → lower casing bearing → tip-welded bearing; τ_residual approaches zero  
**Mechanism**: Three-bearing decoupling chain. Tip width 4 mm provides 8× more restoring torque than sharp-tip zombie. CGB rim reduces LAD critical spin from 24.7 to 10.56 rad/s (57% reduction). Idle drag 3100× higher than Bearing Base Shaft — relevant only in prolonged same-spin endurance.  
**Engine Note**: rTip = 0.4 cm; ladMinOmega_tip = 24.7 rad/s; ladMinOmega_CGB = 10.56 rad/s; idleDrag_multiplier = 3100.

---

### [Case 157 — Cross Attack Support Parts: Radially Oriented Triangular Protrusions Produce Near-Zero Smash, Maximum Recoil, and No Viable LAD](./3%20case%20study.md#case-157)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 0.79 g each (1.58 g total); r_tip ≈ 2.5 cm; I = 9.88×10⁻⁷ kg·m²  
**Material**: ABS  
**Contact Points**: α ≈ 80° from orbital tangent; J_smash = 0.174J; J_recoil = 0.985J  
**Mechanism**: Radially-pointing triangular tips produce near-total recoil. No LAD: discrete point contacts cannot form precession disc (ω_LAD_min → ∞). Mid-plane symmetric — orientation labels (Smash/Spike Attack) are cosmetic only. Lowest peripheral I of any SP.  
**Engine Note**: contactAlpha = 80°; smashFraction = 0.174; noLAD = true; I = 9.88e-7 kg·m².

---

### [Case 158 — Customize Bearing Base: Smooth-Shell Stamina Platform With Three Distinct Shaft Regimes](./3%20case%20study.md#case-158)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~7.5 g base; smooth outer rim; three shaft-type compatibility classes  
**Material**: ABS housing, metal bearings  
**Spin Coupling**: External bearing in base; shaft type determines inner coupling  
**Mechanism**: SP-compatible wide-rim base providing best LAD of plastics BBs. Three shaft regimes: (1) Bearing Base Shaft — lowest friction, best zombie; (2) Neo SG DBV — mid friction, best tilt resistance; (3) standard sharp/flat tips — worst retention. CGB compatibility enables all three.  
**Engine Note**: spCompatible = true; shaftRegime determines performance tier; LAD best in class.

---

### [Case 159 — Strike Turtle: Rounded Segment Ends as a Dual Penalty on Smash Efficiency and Recoil](./3%20case%20study.md#case-159)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~5 g AR; rounded leading edge geometry  
**Material**: ABS  
**Contact Points**: Rounded ends → variable α; no optimal smash angle  
**Mechanism**: Rounded segment ends simultaneously reduce smash (no flat leading face) and increase recoil (convex surface returns impulse radially). Dual penalty: no attack merit, higher recoil than flat-face ARs. Defense use (smooth deflection) limited by insufficient mass and wrong geometry class.  
**Engine Note**: contactGeometry = rounded; dualPenalty = reducedSmash + increasedRecoil.

---

### [Case 160 — SG Bolt Base: Why Screw Ballast at Mid-Radius Fails to Compensate for Tip and LAD Deficits](./3%20case%20study.md#case-160)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: mid-radius screw ballast; lower I contribution than WD-radius mass  
**Material**: ABS with metal screw inserts  
**Mechanism**: Metal screws at mid-radius add mass but at r well inside WD rim → I contribution far below what same mass at WD radius would provide. Tip performance unchanged. LAD not rescued by mid-radius ballast. Mass penalty from screws increases KO resistance marginally but does not compensate for tip and LAD weaknesses.  
**Engine Note**: ballastRadius < WD_radius; I_contribution_suboptimal; LAD_deficit_unaddressed.

---

### [Case 161 — Double Attacker: Maximum Flat-Face Smash With Structural Recoil Liability](./3%20case%20study.md#case-161)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~6 g AR; wide flat leading faces; large outer radius  
**Material**: ABS  
**Contact Points**: Flat face α ≈ 0–15°; J_smash ≈ 0.966J; high smash efficiency  
**Mechanism**: Maximum flat-face smash: near-zero α → near-total impulse converts to smash push. Structural liability: wide flat faces crack/deform on repeated hard contacts, widening effective α over time. Best-in-class smash when intact; degrades rapidly under heavy use.  
**Engine Note**: alpha ≈ 0–15°; smashFraction ≈ 0.966; structuralDegradation = high.

---

### [Case 162 — Revolver Attack: Compact Distribution Undermined by Tab Recoil and Mass Deficit](./3%20case%20study.md#case-162)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: low mass AR; tabs at outer radius  
**Material**: ABS  
**Contact Points**: radial tabs → high recoil fraction  
**Mechanism**: Compact mass distribution adequate for KO-resistance role, but protruding tabs generate recoil on contact — same failure mode as other tab-geometry ARs (Case 949 Ten Wide WD tab recoil). Mass too low for a defensive weight contribution. Outclassed by Wide Defense in all intended applications.  
**Engine Note**: tabRecoil = high; massDeficit vs WideDefense; compactDistribution only marginal.

---

### [Case 163 — Twin Guard: Thin-Profile Bidirectionality Trades LAD Quality for Orientation Flexibility](./3%20case%20study.md#case-163)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: thin AR profile; symmetric top/bottom faces  
**Material**: ABS  
**Mechanism**: Mid-plane symmetric AR works in both left and right spin with identical geometry. Thin profile reduces LAD rim height, degrading precession endurance. Orientation flexibility useful for left-spin attack builds, but LAD quality (reduced rim area) costs against opponents relying on stamina outlasting.  
**Engine Note**: bidirectional = true; LAD_quality = reduced (thin profile); spinNeutral geometry.

---

### [Case 164 — Corona Saber: Large-Reach Upper Attack With Smash Penalty From Rotational Recoil](./3%20case%20study.md#case-164)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: large outer radius; upper-attack slope geometry  
**Material**: ABS  
**Contact Points**: Upper slope α; large r_contact → high rotational recoil torque  
**Mechanism**: Wide outer radius provides reach advantage for upper contact but large moment arm amplifies rotational recoil torque per hit (τ = J × r_contact). Net: increased tilt perturbation per collision. Upper impulse component useful; rotational recoil partially negates spin conservation advantage.  
**Engine Note**: r_contact = large; tau_recoil = J × r; upperImpulse partially offset by spin loss.

---

### [Case 165 — Triple Beak: Bevelled Triangle Edges as an Omni-Directional Smash Mechanism](./3%20case%20study.md#case-165)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 3-fold symmetric; bevelled triangle leading edges  
**Material**: ABS  
**Contact Points**: Bevelled edge α ≈ 20–35°; moderate smash fraction  
**Mechanism**: Bevelled triangle edges produce consistent smash contact across a range of approach angles (omni-directional effectiveness). Three-fold symmetry means collision frequency × 3 vs single-face ARs. Moderate α gives competitive smash with lower recoil than pure-radial protrusions.  
**Engine Note**: symmetry = 3; bevelledEdge; omniDirectionalSmash; alpha ≈ 20–35°.

---

### [Case 166 — Reverse Wolf (Hasbro): Inverted Contact Orientation Converts a Defense AR Into the Only Viable Left-Spin Compact](./3%20case%20study.md#case-166)

**System**: Plastics System (Gen 1, SG System) — Hasbro variant  
**Geometry**: same geometry as standard Wolf; contact orientation inverted  
**Material**: ABS  
**Contact Points**: Right-spin defense geometry inverted → left-spin smash contact  
**Mechanism**: Hasbro mold inverts the contact orientation relative to TT version. What is a smooth deflection surface in right spin becomes a leading smash edge in left spin. Only viable left-spin compact AR for Standard configuration. Competitive left-spin smash with compact mass distribution advantage. TT version non-viable in LS.  
**Engine Note**: hasbro_inversion = true; LSsmash viable; RSdefense geometry repurposed.

---

### [Case 167 — Wide Defense: Extreme Peripheral Concentration and Rounded Profile Produce the Most Versatile Weight Disk in the Generation](./3%20case%20study.md#case-167)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~14.7 g; maximum r_outer in plastics WD lineup; smooth rounded rim  
**Material**: ABS  
**Mechanism**: Maximum peripheral radius + smooth rounded profile: highest I contribution of any plastics WD (maximum r_outer). Rounded profile deflects contact tangentially (low recoil). Versatile: suits defense (LAD assist), stamina (inertia retention), and controlled attack (KO resistance). Outperforms all plastics WDs in most roles.  
**Engine Note**: r_outer = maximum in class; smoothRoundedRim; I = highest plastics WD; versatile.

---

### [Case 168 — Wide Survivor: Maximum Outer Radius and Smooth Profile Optimise Opposite-Spin Stamina at the Cost of Mass](./3%20case%20study.md#case-168)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: lower mass than Wide Defense; r_outer comparable; smooth profile  
**Material**: ABS (lighter formulation)  
**Mechanism**: Same outer radius as Wide Defense but lower total mass → lower I than WD despite similar r. Trade: mass savings reduce inertia but reduce tip normal force (lower spin decay from friction). Optimised for opposite-spin zombie matchups where low normal force = low spin-steal friction loss. Wide Defense outperforms in same-spin by mass; Wide Survivor by friction reduction in opp-spin.  
**Engine Note**: r_outer ≈ WideDefense; mass < WideDefense; optimised for opposite-spin stamina.

---

### [Case 169 — Spark Disk: Wide Survivor With Friction and Spark Gimmicks That Neither Add Nor Remove Competitive Value](./3%20case%20study.md#case-169)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: friction pads + spark-generating metal inserts  
**Geometry**: same outer radius as Wide Survivor; added gimmick mass  
**Material**: ABS + rubber friction pads + metal spark inserts  
**Mechanism**: Wide Survivor base geometry with two gimmick additions: friction pads (add grip during collision) and spark inserts (cosmetic). Friction pads marginally increase AR contact friction but simultaneously reduce LAD by adding drag during precession. Net: the two gimmick effects cancel in competitive play. Performance identical to Wide Survivor.  
**Engine Note**: gimmickNetEffect = zero; competitive_equivalence = Wide Survivor.

---

### [Case 170 — Star Attack: 5-Fold Symmetry Produces Severe Recoil From Star-Tip Contact Geometry, Redeemed Only By Penta Wing Alignment](./3%20case%20study.md#case-170)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5-fold symmetric; star tips at outer radius  
**Material**: ABS  
**Contact Points**: Star-tip point contacts → near-radial; J_recoil dominant  
**Mechanism**: Five star-tips point outward → high recoil fraction (similar to Cross Attack). Severe in isolation. Redeeming factor: paired with Penta Wing SP, the wing tips align with star valleys, changing effective contact to wing geometry rather than star tips — SP contact takes priority. Stand-alone Star Attack: non-viable. Penta Wing combo: redeemed.  
**Engine Note**: standalone recoil = severe; PentaWing_alignment rescues role; SPcontactPriority.

---

### [Case 171 — Wide Attack: Intermediate Distribution Fails Both Wide and Compact Roles While Adding Recoil](./3%20case%20study.md#case-171)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: intermediate r_outer (between Wide Defense and compact WDs); tab protrusions  
**Material**: ABS  
**Mechanism**: Intermediate radius provides neither the maximum I of Wide Defense nor the controlled contact of compact WDs. Tab protrusions add recoil (same failure as Revolver Attack). Cannot serve as defensive WD (lacks rim concentration) or stamina WD (lacks smooth profile). Niche: none competitive.  
**Engine Note**: intermediate_radius = fails both roles; tabRecoil added; no competitive niche.

---

### [Case 172 — Penta Wing: Left-Spin Long-Slope Upper Attack on a 5-Fold Body With RS Contact Obstruction](./3%20case%20study.md#case-172)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5-fold symmetric SP; long wing slope extending to outer radius  
**Material**: ABS  
**Contact Points**: Long slope α ≈ 15–25° (LS upper attack); RS wing back obstructs contact  
**Mechanism**: Five long wings provide excellent left-spin upper attack (slopes lead in LS). Right spin: wing backs obstruct clean contact → SP functionally inactive in RS. Best paired with Star Attack AR (Case 170) — wings align with AR valleys. Pure left-spin upper attack SP with no right-spin value.  
**Engine Note**: LS_upper_attack = viable; RS_obstructed; paired with StarAttackAR for alignment.

---

### [Case 173 — Smash Turtle Attack Ring: Force Smash Slope Geometry as a Stamina Drain Mechanism, Width-Driven Defense Tradeoffs, and Why Weight-Based Defense Is the Only Role That Fully Exploits the Part](./3%20case%20study.md#case-173)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: wide AR; downward-angled force smash slopes  
**Material**: ABS  
**Contact Points**: Downward slope → force smash (presses opponent to floor); wide profile  
**Mechanism**: Force smash slopes press opponent into arena floor, increasing normal force and floor friction → drains stamina. Width provides peripheral mass advantage. Defense role limited: wide profile increases collision cross-section. Only role that fully exploits both width AND force smash: weight-based defense (absorbs hits via inertia while force smashing opponent into passive drain).  
**Engine Note**: forceSmash = downward slope; widthAdvantage for mass; bestRole = weight_defense.

---

### [Case 174 — Upper Dragoon Attack Ring: Slope Geometry Differences Between Right and Left Spin, Why Low Recoil Enables the Spin-Stealing Attack Role, and How Mold Mass Reduction Leaves Performance Unchanged](./3%20case%20study.md#case-174)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~6.8 g (M1) / ~6.5 g (M2); r_o ≈ 2.3 cm, r_i ≈ 0.9 cm; α_RS ≈ 25°  
**Material**: ABS (two molds)  
**Contact Points**: RS slope α ≈ 25°; eff = cot(25°) = 2.14; LS slope inverted → spin-steal  
**Mechanism**: RS: competitive upper attack via slope α≈25°. LS: inverted slope creates prolonged tangential friction contact → spin equalization (spin-steal). Low recoil fraction enables multiple spin-steal contacts before spin loss. M2 mass reduction (~0.3 g lighter) does not change contact geometry → identical performance. Best AR for LS spin-steal role.  
**Engine Note**: alpha_RS = 25°; eff = 2.14; LSspinSteal via tangential friction; moldMass_irrelevant.

---

### [Case 175 — SG Roller Base: Why Free-Spinning Rollers Increase Net Recoil, and Why Every Competitive Role Belongs to SG Semi-Flat Base](./3%20case%20study.md#case-175)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: four free-spinning outer rollers  
**Geometry**: ~7 g base; rollers at outer radius  
**Material**: ABS + roller bearings  
**Mechanism**: Free-spinning rollers intended to deflect attacks tangentially. Physics: roller spin-up during contact stores angular momentum from impact → returned as recoil when roller decelerates post-contact. Net recoil is higher than smooth surface. Flower pattern disrupted by roller contact geometry. SG Semi-Flat Base is strictly superior in every niche (stamina, attack, defense, compact).  
**Engine Note**: rollerRecoil > smoothSurface; gimmick_counterproductive; SG_SFB = dominant alternative.

---

### [Case 176 — Lizard Blocker Attack Ring: Why Four Outer Rollers Fail the Defense Role, How Frill Geometry Produces Left-Spin Smash, and Why Roller Defense Ring Dominates Both Intended Functions](./3%20case%20study.md#case-176)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: four outer rolling elements  
**Geometry**: ~5.5 g AR; rollers at outer rim + frill geometry  
**Material**: ABS + rollers  
**Mechanism**: Rollers fail defense (same recoil mechanism as Case 175). Frill geometry on the AR body provides useful left-spin smash contact. Best use: LS smash combo. However, Roller Defense Ring (Case 177) outperforms the defensive intent AND provides equal or better LS smash. Lizard Blocker made obsolete by RDR in both roles.  
**Engine Note**: rollerDefense = fails; frill → LS smash viable; RollerDefenseRing = dominant.

---

### [Case 177 — Roller Defense Ring: Recessed Ball-Bearing Rollers as a Contact Normal Softener, Compact Diameter Enabling Circle Survivor Defense, and Why Passive-Only Geometry Caps the Compact Role](./3%20case%20study.md#case-177)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: recessed ball-bearing rollers  
**Geometry**: compact diameter (r < Wide Defense); recessed roller positions  
**Material**: ABS + steel ball bearings  
**Mechanism**: Recessed rollers soften contact normal force (roller yields under impact, reducing peak J). Compact diameter enables Circle Survivor Defense (CSD) mode — bey orbits at AR perimeter with controlled tilt. Passive-only geometry: cannot initiate attack. Compact role capped by mass limitations vs WD-radius alternatives. Best CSD AR in plastics.  
**Engine Note**: recessedRollers → normalSoftening; compactDiameter → CSD viable; passive_only caps upper tier.

---

### [Case 178 — Twin Horn Attack Ring: Why Rounded Leading Edges Maximise Spin-Steal in Left Spin, Why the Same Geometry Caps Right-Spin Attack Effectiveness, and the Compact Role Tradeoff Against Tiger Defenser](./3%20case%20study.md#case-178)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~4.5 g AR; two horn protrusions; rounded leading edges  
**Material**: ABS  
**Contact Points**: LS: rounded edges → sustained tangential friction → spin-steal; RS: rounded edges → convex recoil  
**Mechanism**: Rounded horn edges: in LS orbit the rounded face sustains tangential sliding contact → spin equalization (steal). In RS the same rounded convex face recoils radially. Compact mass alternative to Tiger Defenser — tradeoff: LS spin-steal niche (Twin Horn) vs RS defense niche (Tiger Defenser). Not interchangeable.  
**Engine Note**: LS_spinSteal via rounded tangential contact; RS_recoil; compactRole vs TigerDefenser.

---

### [Case 179 — Fin Tector Support Parts: Why Fin-Shaped Attack SP Adds Net-Negative Value in Attack Mode, Why Defense Mode Is Recoil Without Benefit, and Why Peripheral Mass Is the Correct SP Metric](./3%20case%20study.md#case-179)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: fin-shaped SP; low peripheral mass  
**Material**: ABS  
**Contact Points**: Attack mode: fins at contact radius; Defense mode: smooth back face  
**Mechanism**: Attack mode: fin tips produce sharp point contacts → energy absorbed elastically by fin deformation, not transmitted to opponent → net-negative (removes energy from attacker). Defense mode: smooth back of fin is a flat surface → recoil without defensive benefit. Correct SP metric is peripheral mass (I contribution) — fins fail this: low mass, wrong geometry both modes.  
**Engine Note**: attackMode = netNegative (fin deformation absorbs energy); defenseMode = recoil; correctMetric = peripheralMass.

---

### [Case 180 — Switch Metal Ball Base: Why a Wide-Radius Ball Tip Fails All Three Base Roles, How Hinge Drift Eliminates the Gimmick, and the Low-Attack Vulnerability from Flat-Platform Geometry](./3%20case%20study.md#case-180)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: hinged platform switch between tip positions  
**Geometry**: wide-radius ball tip; flat platform underside  
**Material**: ABS + metal ball  
**Mechanism**: Ball tip: wide contact radius (r_ball ≈ 1.5 cm) → high friction (poor stamina), wide orbit (no compact control), large normal force (poor LAD). Hinge drift: repeated impacts cause hinge to shift position mid-battle → gimmick unreliable. Flat platform underside vulnerable to Force Smash attacks (large contact area). Fails stamina, attack, and defense.  
**Engine Note**: ballTip_widRadius = triple_failure; hingeDrift eliminates gimmick; flatPlatform → FSmash_vulnerable.

---

### [Case 181 — Wing Attack Ring: Spring-Wing Centrifugal Deployment as a Spin-Steal Grinding Mechanism, Why Indirect Hits Fold Instead of Strike, and the Fragility Budget That Limits Every Role](./3%20case%20study.md#case-181)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: spring-loaded wings deploy centrifugally at high spin  
**Geometry**: wings retracted at low spin; deployed radius r_deploy > r_retracted  
**Material**: ABS + spring  
**Mechanism**: At high RPM, centrifugal force deploys wings outward → increases effective radius for spin-steal grinding contacts. Indirect hits (glancing angle) fold wings rather than striking → recoil without steal. Spring fatigue limits gimmick life. Fragility budget: wings crack on direct hard contact. Competitive only in prolonged same-spin grinding contexts at sustained high spin.  
**Engine Note**: centrifugalDeploy at high RPM; indirectHit = foldBack; springFatigue; fragile.

---

### [Case 182 — Spark Attack Ring: Why Friction-Coupled Free-Spin Fails Both Attack and Defense, How Off-Centre Drift Terminates Zombie Utility, and Why the Gimmick Degradation Path Is Self-Defeating](./3%20case%20study.md#case-182)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: friction-coupled free-spin outer ring + spark generation  
**Geometry**: free-spin outer ring at AR radius; friction coupling  
**Material**: ABS outer ring, metal spark contacts  
**Mechanism**: Free-spin ring: intended to absorb attack via spin-decoupling. Physics: friction coupling means full spin is never transmitted → partial decoupling only. Attack: decoupled ring cannot deliver full impulse. Defense: recoil still returns to shell via friction. Off-centre drift during precession causes ring to rub asymmetrically → drag terminates zombie stamina. Gimmick degrades over use: coupling becomes looser → eventually zero coupling → pure dead weight.  
**Engine Note**: frictionCoupling = partial decoupling only; offCentreDrift → zombie termination; degradationPath = selfDefeating.

---

### [Case 183 — Cross Spiker Attack Ring: Why Triangular Protrusion Interference Degrades Right-Spin Spike Attack, How LS Contact Orientation Achieves Competitive Smash, and the Ten Wide WD Dependency for Contact Exposure](./3%20case%20study.md#case-183)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: triangular spike protrusions; mid-range outer radius  
**Material**: ABS  
**Contact Points**: RS: protrusion interference reduces spike contact; LS: favorable contact angle α achieves competitive smash  
**Mechanism**: RS: spike geometry interferes with itself during orbit → reduced effective contact angle → degraded attack. LS: contact orientation flips → spike face presents favorable smash angle. Ten Wide WD dependency: narrow WDs cause WD rim to shadow the AR spikes, reducing exposure; Ten Wide WD fully exposes spike contact zone.  
**Engine Note**: RS_degraded; LS_competitive; TenWideWD_dependency for contact_exposure.

---

### [Case 184 — Fire Cracker Attack Ring: Why Oval Geometry and Rounded Sides Produce Inconsistent Smash, How Raised Head Protrusions Create a Height-Selective Contact System, and Why Mold 2 Is Unambiguously Preferable](./3%20case%20study.md#case-184)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: oval AR profile; raised head protrusions at specific height  
**Material**: ABS (two molds)  
**Contact Points**: Raised protrusions only contact at specific opponent height band  
**Mechanism**: Oval body: inconsistent smash (contact angle varies with oval rotation phase). Rounded sides: recoil as usual. Raised heads: contact only opponents whose AR is within the height band — height-selective contact. Mold 2 raises head height to better match opponent AR height in standard setups → unambiguously preferable. Mold 1 too low for most matchups.  
**Engine Note**: ovalInconsistency; heightSelectiveContact; Mold2 preferred; moldDifference = head height.

---

### [Case 185 — Spin Gear Core: Heavy Metal Core — Maximum Neo Core Mass as a Rotational Inertia Buffer, RPM Maintenance Across All Power Roles, and Why Rotational Smash Attack Is the One Context Where Its Weight Is Decisive](./3%20case%20study.md#case-185)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~4.7 g (heaviest Neo SG core); r ≈ 0.7 cm  
**Material**: metal core  
**Mechanism**: Maximum Neo SG core mass → maximum I contribution from core position. RPM maintenance: higher combo inertia → slower spin decay per friction event. In most roles (stamina, defense), HMC adds marginal I vs mid-weight alternatives. Decisive role: rotational smash attack — high combo I means attacker retains more spin per collision (τ_recoil / I_combo = smaller Δω). HMC shifts the spin-loss-per-hit balance to attacker's favor.  
**Engine Note**: mass_g = 4.7; I_contribution_dominant for core position; rotationalSmash = decisive role.

---

### [Case 186 — Heavy Metal Gear Spin Gear Shells: Tip Height as the Primary Performance Limiter, Why the Semi-Flat Contact Cannot Compensate, and the Narrow WBD Use Case With First Clutch Base](./3%20case%20study.md#case-186)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Engine Gear mechanism  
**Geometry**: HMG SG shell height; semi-flat tip contact  
**Material**: metal gear, ABS shell  
**Mechanism**: Tall SG shell raises combo height → opponent ARs contact at wrong height band. Semi-flat tip cannot compensate for height mismatch (fixed tip geometry). Narrow WBD (Wide Ball Defense) creates one viable context: FCB (First Clutch Base) combo where height mismatch is minimized. All other combos: height deficit dominates, semi-flat tip irrelevant.  
**Engine Note**: heightMismatch = primaryLimiter; semiFlat_cannotCompensate; narrowUsecaseWithFCB.

---

### [Case 187 — First Clutch Base (Metal Driger Version): Why First Clutch Activation Disrupts Rather Than Assists, Why LAD Is Insufficient Against the CEW Light Sharp Benchmark, and the Triangular Protrusion Recoil Tax](./3%20case%20study.md#case-187)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: First Clutch — tip-retraction mechanism triggered by deceleration threshold  
**Geometry**: ~9 g base; triangular protrusions at outer rim; first clutch shaft  
**Material**: ABS + metal clutch mechanism  
**Mechanism**: First Clutch activates (retracts tip → hole-flat contact) when spin drops to clutch threshold — intended to stabilize. Instead, activation mid-battle disrupts bey trajectory. LAD via hole-flat is insufficient vs CEW Light Sharp (lower friction shaft benchmark). Triangular protrusions at rim: recoil tax on every contact (α near-radial). Competitive use case: minimal.  
**Engine Note**: firstClutch = disruptive; LAD < CEW_LightSharp benchmark; triangularProtrusions → recoilTax.

---

### [Case 911 — Whale Crusher AR: Width as a Substitute for WD Overhang in Traditional Upper Attack, and Why Spike Geometry Collapses Left-Spin Effectiveness Through Recoil](./3%20case%20study.md#case-911)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 7.3 g; r_o = 2.6 cm, r_i = 1.0 cm; I = 2.83×10⁻⁶ kg·m²; θ_slope = 22°  
**Material**: ABS  
**Contact Points**: RS slope α = 22°; J_upper = 0.374J; LS spike α_from_tangent = 75°; J_recoil = 0.966J  
**Mechanism**: RS: wide wingspan reaches opponent AR without WD overhang dependency (r_contact = 2.6 cm regardless of WD). LS: radial spikes return 96.6% of impulse to attacker as rotational recoil (~251 rad/s Δω per hit at I_combo = 8×10⁻⁶). Force smash slope β = 5° → J_down = 0.007 N·s (below detectable threshold). Left spin non-viable.  
**Engine Note**: RS_upper viable; LS_spike recoilFraction = 0.966; forcesmash_beta=5° = negligible.

---

### [Case 912 — SG Flat Base: Plastic Flat Tip Height Advantage for Upper Attack Offset by Friction Deficit, and Why LAD Cannot Rescue the Compact Role](./3%20case%20study.md#case-912)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.4 g; shortest plastics BB (H ≈ 1.3 cm vs standard 1.6 cm); r_tip ≈ 0.4 cm  
**Material**: ABS  
**Mechanism**: Shortest base: ΔH = 3 mm lower → ~11.5% extra upward impulse for upper attack. Plastic flat tip μ_s ≈ 0.35 → ω_orbit_max = 4.78 rad/s (slips at useful attack speeds of 8–12 rad/s). Restitution e ≈ 0.7 → 75% more impulse reflected vs rubber. LAD acceptable (wide shell decent I) but not competitive with bearing tips.  
**Engine Note**: H = 1.3 cm (shortest); tipFriction_low; e = 0.7; LAD_acceptable_not_best.

---

### [Case 913 — SG Metal Sharp Base: Near-Zero Contact Radius Tip, Underside Gaps Destroy LAD](./3%20case%20study.md#case-913)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: metal sharp tip r ≈ 0.05 cm; underside gap geometry  
**Material**: ABS + metal sharp tip  
**Mechanism**: Near-zero contact radius → maximum stamina (minimum friction) but irrecoverable tilt at low spin (zero restoring torque). Underside rim gaps (from SG clip geometry) interrupt the continuous rim needed for LAD flower precession → LAD effectively disabled. Metal sharp achieves best stamina until tilt onset, then dies instantly. μ_bearing ≈ 0.05 vs μ_sharp ≈ 0.17: sharp is 3.4× higher friction than bearing.  
**Engine Note**: r_tip ≈ 0.05 cm; LAD_destroyed by underside gaps; tiltRecovery = zero.

---

### [Case 914 — Panther Head AR: Directional Blade Asymmetry as the Sole Determinant of Left-Spin Smash Viability, and Why the Range Ceiling Inverts the WD Choice](./3%20case%20study.md#case-914)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5.5 g; r_outer ≈ 2.2 cm; I ≈ 1.61×10⁻⁶ kg·m²  
**Material**: ABS  
**Contact Points**: RS convex back: α ≈ 80°, J_smash = 0.174J; LS flat face: α ≈ 30°, J_smash = 0.866J  
**Mechanism**: RS: convex blade backs produce near-total recoil (non-viable). LS: flat blade faces at α≈30° → J_smash = 0.869J (competitive). Range ceiling r_outer ≈ 2.2 cm: Wide Defense rim protrudes beyond AR → WD rim leads contact → contact priority inverted (WD leads, not AR). Ten Wide WD keeps WD inside AR range → AR contact priority maintained. LS viable only with Ten Wide or compact WD.  
**Engine Note**: RS non-viable; LS_smash_fraction = 0.866; r_ceiling = 2.2 cm inverts WD priority.

---

### [Case 915 — Spin Gear Core: North Magnecore — Mid-Weight Core as Recoil Buffer, Magnetic Polarity as Assembly Variable](./3%20case%20study.md#case-915)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 3.3 g; r_outer_shell ≈ 0.7 cm; I_core ≈ 6.6×10⁻⁸ kg·m² (0.8% of combo)  
**Material**: ABS shell + permanent magnet (north polarity)  
**Mechanism**: Mid-weight between Metal Weight Core and Heavy Metal Core. I contribution 0.8% (negligible). Recoil damping: 3.5% better than plastic core vs HMC. Magnetic force at d=5mm ≈ 19.6% of tip normal force — affects assembly ergonomics, not in-play performance. Neo SG shell compatibility only.  
**Engine Note**: mass_g = 3.3; I_contribution = 0.8%; magneticForce_gameplay = irrelevant; NeoSG_only.

---

### [Case 916 — Spin Gear Core: South Magnecore — Identical Mass Physics to North, Inverted Polarity Interactions](./3%20case%20study.md#case-916)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 3.3 g; I_core ≈ 6.6×10⁻⁸ kg·m²; identical geometry to North Magnecore  
**Material**: ABS shell + permanent magnet (south polarity)  
**Mechanism**: Physically and mechanically identical to North Magnecore (Case 915). Only difference: south polarity. Attracts magnetized tips (Customize Grip Base Tip, Magne Flat Base Tip) during assembly (north tips snap together). South Magnecore offensive role in Magne Stadia: when south-core bey is repelled by south-pole stadium magnets → involuntary launch toward center.  
**Engine Note**: identical_mass_physics = Case915; polarity = south; magneStadia_offensive role.

---

### [Case 917 — SG Metal Flat Base (Gaia Dragoon V Version): Low-Friction Metal Flat Tip as Rotational-Recoil-to-Linear-Recoil Converter](./3%20case%20study.md#case-917)

**System**: Plastics System (Gen 1, SG System) — GDV variant  
**Geometry**: metal flat tip; Tornado Ridge grip band at outer base radius  
**Material**: ABS base + metal flat tip  
**Mechanism**: Metal flat tip μ ≈ 0.55–0.65 (vs rubber μ ≈ 0.85): lower friction → less flower-pattern grip but better spin retention. Tornado Ridge (raised ring on base underside) provides grip contact during heavy tilt precession — substitute for full rubber. Rotational recoil from collision converts to linear velocity via metal-flat contact (less tip adhesion = more translational escape velocity). Two-mold distinction: GDV version has wider Tornado Ridge.  
**Engine Note**: metalFlat_mu = 0.55–0.65; tornadoRidge_grip; recoilToLinear conversion; GDV_widerRidge.

---

### [Case 918 — Dragon Breaker Core AR: Heaviest Core AR, Direction-Dependent Contact System, SAR-Conditional Performance Across Five Setups](./3%20case%20study.md#case-918)

**System**: Plastics System (Gen 1, SG System) — Core AR system  
**Geometry**: heaviest Core AR in lineup; large contact protrusions  
**Material**: ABS  
**Contact Points**: direction-dependent: RS vs LS contact faces differ  
**Mechanism**: Heaviest Core AR → most mass at AR position → highest I contribution for core AR. Direction-dependent: RS and LS faces present different contact geometries. Five SAR (Sub-Attack Ring) configurations change the effective contact system — each SAR routes contact to different geometry. Performance entirely conditional on SAR choice.  
**Engine Note**: heaviestCoreAR; directionDependent; 5 SAR configurations determine performance.

---

### [Case 919 — Dragon Breaker Sub AR: Large-Radius Free-Spinning Ring as Impulse Fractioner](./3%20case%20study.md#case-919)

**System**: Plastics System (Gen 1, SG System) — SAR  
**Geometry**: large outer radius free-spinning ring; long moment arm  
**Material**: ABS + bearing  
**Mechanism**: Free-spinning SAR ring at large radius: when contact occurs at ring, ring spins up instead of coupling impulse to core. Impulse fractioned: part accelerates ring (wasted), part transfers to Core AR. Long moment arm → high angular impulse on ring per contact → large fraction wasted. Vertical recoil from ring's long moment arm can destabilize. Useful only in Gyro Engine Gear context where ring spin-up provides power feedback.  
**Engine Note**: freeSpinRing_large_r; impulseFraction; verticalRecoil; viable in EG Gyro context only.

---

### [Case 920 — Volcano Change Base: Magnetic Tip Retention as Structural Substitute, Height Minimisation Through Bracket-Only Design, and SG Grip Base Tip as Performance Unlock](./3%20case%20study.md#case-920)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: magnetic tip retention; interchangeable tip via bracket  
**Geometry**: minimised height (bracket-only design); tip swappable  
**Material**: ABS + magnetic retention  
**Mechanism**: Magnetic retention keeps tip in bracket without screw — enables rapid tip swaps. Height minimization via bracket removes SG collar → shorter profile. Default tip: inadequate for competitive use. SG Grip Base Tip (Case 928) is the performance unlock: rubber tip provides grip and flower pattern in this base's geometry. Stock tip leaves base non-competitive; SGB Tip makes it viable.  
**Engine Note**: magneticRetention; tipSwappable; stockTip_noncompetitive; SGGripBaseTip = performanceUnlock.

---

### [Case 921 — Tryhorn: V-Tread Circular Disk as the Only Mechanism That Recovers Smash from a Zero-Smash Radial Profile](./3%20case%20study.md#case-921)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: V-tread circular outer disk; radial profile body  
**Material**: ABS  
**Contact Points**: V-tread ridges convert radial contact to smash; body alone = radial (α ≈ 90°, zero smash)  
**Mechanism**: Body is circular → radial profile → zero smash (α = 90°, J_smash = 0). V-tread ridges on disk circumference are angled → when disk meets opponent AR, ridge angle converts radial impact to partial smash component. Only mechanism on the part that produces any smash at all. Without V-tread, pure recoil and destabilization. Paired with 8 Heavy WD + Right SG + SG Semi-Flat Base.  
**Engine Note**: bodyAlone_zeroSmash; VtreadRidges_recover smashComponent; uniqueRecoveryMechanism.

---

### [Case 922 — Cross Griffon AR: Four-Wing 90-Degree Symmetry as Contact-Frequency Multiplier](./3%20case%20study.md#case-922)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4-fold symmetric; 4 wings at 90°  
**Material**: ABS  
**Contact Points**: 4 contacts per revolution vs 2–3 for most ARs  
**Mechanism**: 90° symmetry: 4 contact events per revolution at given contact radius. More contact frequency → more spin-steal events per unit time (assuming sustained engagement). Wing geometry determines quality of each contact (smash vs recoil vs steal). Higher frequency amplifies both positive (steal) and negative (recoil) outcomes. Net depends entirely on wing contact angle quality.  
**Engine Note**: symmetry = 4 at 90°; contactFrequency × 4; netEffect amplifies wing geometry quality.

---

### [Case 923 — Dual Dragon AR: Polycarbonate Sub-Frame Cannot Absorb Shock, Rounded Contact Point Physics](./3%20case%20study.md#case-923)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: polycarbonate sub-frame; rounded contact points  
**Material**: ABS main body + polycarbonate sub-frame  
**Mechanism**: Sub-frame intended to flex/absorb impact. Polycarbonate (stiffer than ABS) does not yield sufficiently → no shock absorption. Rounded contact points: recoil-dominant (as per Cases 159, 162 patterns). Dual material construction adds complexity without performance gain. PC sub-frame may cause inconsistent contact if fit loosens over time.  
**Engine Note**: PCsubframe_noshock; roundedContacts_recoil; dual_material = no net benefit.

---

### [Case 924 — Fantom Grip Base: Narrow Hard-Rubber Tip Trades Peak Grip for Flower-Pattern Accessibility](./3%20case%20study.md#case-924)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: narrow hard-rubber tip; smaller contact radius than standard Grip Flat  
**Material**: ABS + hard rubber tip  
**Mechanism**: Narrow hard rubber: lower grip peak than wide rubber (smaller contact area) → flower pattern activates at lower orbit speed (easier to trigger). Flower pattern accessibility: ω_grip = √(μ × g / r_tip) — narrower r_tip raises ω_grip threshold, but hard-rubber lower μ offsets. Net: easier flower pattern than soft-wide rubber but lower grip force ceiling. Trade: accessibility vs peak performance.  
**Engine Note**: narrowHardRubber; flowerPattern_accessible; peakGrip < wide rubber alternatives.

---

### [Case 925 — Eight Attacker: Flat Contacts Generate Uncontrolled Recoil with No Spin-Direction Asymmetry](./3%20case%20study.md#case-925)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 8-fold symmetric; flat outer contacts  
**Material**: ABS  
**Contact Points**: flat contacts at uniform spacing; no directional bias  
**Mechanism**: Eight flat contacts at uniform 45° spacing: no spin-direction asymmetry (same contact geometry RS and LS). Flat contacts at near-radial orientation → high recoil, low smash (similar to Eight Balance WD contacts). Uncontrolled recoil with no attack or defense benefit from the symmetry. Frequency disadvantage: collision forces spread across 8 equal contacts → lower peak impulse per contact vs concentrated ARs.  
**Engine Note**: symmetry=8; noSpinAsymmetry; flatContacts_highRecoil; peakImpulse_diluted.

---

### [Case 926 — Magne Flat Base: Removable-Tip SG Base Trades SP Mass for Magnetic Shaft Compatibility](./3%20case%20study.md#case-926)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: removable tip for Magne Flat Base Tip; magnetic shaft compatibility  
**Geometry**: SG-compatible base; removable tip slot  
**Material**: ABS  
**Mechanism**: Removable tip allows Magne Flat Base Tip (Case 927) installation. SP rails removed vs Customize Grip Base → trades SP mass contribution for magnetic shaft compatibility. Magnetic shaft pairs with Magnecore variants (Cases 915, 916). Without SP mass (Defense Ring, Cross Survivor): lower I contribution vs CGB. Niche: Magne Stadia environments where magnetic tip–shaft interaction is exploitable.  
**Engine Note**: removableTip; SPmass_traded; magneticShaft_compatible; niche = MagneStadia.

---

### [Case 927 — Magne Flat Base Tip: Plastic Flat with Embedded South Magnet Fails at All Three Tip Roles](./3%20case%20study.md#case-927)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: south-pole magnet embedded in plastic flat tip  
**Geometry**: plastic flat tip geometry; magnet mass added centrally  
**Material**: ABS + permanent magnet  
**Mechanism**: Attack role: plastic flat μ too low for reliable flower pattern. Stamina role: magnetic mass at tip center increases tip weight → higher normal force → more friction → faster spin decay. Defense role: magnetic attraction to north-pole cores (Case 915) causes tip to cling asymmetrically → disrupts smooth precession. All three roles: magnet is a liability. Competitive value: none.  
**Engine Note**: allThreeRoles_fail; magnetAdds_tipMass → higherFriction; magneticCling → precessDisruption.

---

### [Case 928 — SG Grip Base Tip: Lighter Rubber Tip Matches CGB Tip on Grip while Enabling Force Smash and Volcano Change Base Combos](./3%20case%20study.md#case-928)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: rubber tip; lighter than Customize Grip Base Tip; compatible with VCB and SGB  
**Material**: rubber tip + ABS base  
**Mechanism**: Lighter rubber tip: same grip coefficient as CGB Tip (both rubber, similar hardness) but lower normal force contribution → slightly less spin decay per orbit. Enables Force Smash combos (tip grip allows attacker to press down on opponent). Volcano Change Base compatibility expands build options. In CGB: identical grip to standard CGB tip. Better in weight-sensitive builds.  
**Engine Note**: rubber; lighter vs CGBtip; sameGrip; forceSmash_viable; VCB_compatible.

---

### [Case 929 — Sonic Tiger: Separated Three-Segment Wing Geometry Multiplies Recoil Without Compensating Smash](./3%20case%20study.md#case-929)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: three separated wing segments; outer radius contacts  
**Material**: ABS  
**Contact Points**: separated segments: each contact event is isolated → no continuous contact for spin-steal  
**Mechanism**: Three separated segments: each functions as an independent contact event. Separation means no continuous grinding surface for spin-steal (requires sustained contact). Each segment contact: high recoil if angled poorly. Multiplied across three segments per rotation → recoil accumulates faster than spin-steal. Gap between segments: no contact during gap → discontinuous engagement pattern. Net: multiplied recoil, zero sustained steal.  
**Engine Note**: separatedSegments → isolatedContacts; noSustainedSteal; recoil × 3.

---

### [Case 930 — SG Metal Flat Base: Truncated Cone Tip Sits One Flat-Diameter Away from Competitive Compact Stability](./3%20case%20study.md#case-930)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: truncated cone metal tip; mid-range contact area  
**Material**: ABS + metal truncated cone tip  
**Mechanism**: Truncated cone tip: contact radius midway between sharp (r≈0.05 cm) and flat (r≈0.4 cm). μ ≈ 0.55 (metal). Not narrow enough for minimum-friction stamina; not wide enough for compact centring stability. One flat-diameter increase would place it in compact-stable range; current geometry misses both niches. LAD: truncated cone provides intermediate precession — not best, not worst.  
**Engine Note**: truncatedCone; contactRadius_midrange; missed_both_niches; LAD_intermediate.

---

### [Case 931 — Griffolyon Base (Hasbro): Four Pole Bases Destroy LAD While Shaft Friction Negates Free-Spin Gimmick](./3%20case%20study.md#case-931)

**System**: Plastics System (Gen 1, SG System) — Hasbro  
**Gimmick**: free-spin outer shell + four support poles  
**Geometry**: four pole structures at base perimeter; free-spin outer shell  
**Material**: ABS  
**Mechanism**: Four structural poles interrupt the continuous rim required for LAD (flower precession requires smooth rim contact — poles create point contacts). Shaft friction between inner and outer shells remains despite free-spin intent → partial coupling preserved → gimmick effectiveness reduced. Hasbro-only base; TT equivalent does not share this geometry.  
**Engine Note**: fourPoles → LAD_destroyed; shaftFriction → partialCoupling; gimmick_reduced.

---

### [Case 932 — Cybernetic Dragon: Maximum-Area Flat Contact Faces Produce Near-Total Recoil and Structural Threading Failure](./3%20case%20study.md#case-932)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: maximum flat contact face area; large flat face AR  
**Material**: ABS (thread failure reported)  
**Contact Points**: maximum area flat face → α near-radial → near-total recoil  
**Mechanism**: Wide flat faces: largest contact area in plastics AR lineup. Contact angle near-radial → J_recoil dominant (same as Eight Attacker but larger area). Maximum recoil per hit. Structural threading failure: ABS thread stripped on SG mount under repeated hard impacts — AR detaches from assembly. Both contact physics and structural integrity fail.  
**Engine Note**: maxFlatArea; alpha_near-radial; threadStripping = structuralFailure.

---

### [Case 933 — Spike Dragon: Vertical-Line Flat Faces Generate High Smash-Area Contact but Cannot Reduce Rotational Recoil](./3%20case%20study.md#case-933)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: vertical spike profile; flat leading faces  
**Material**: ABS  
**Contact Points**: flat faces → good smash fraction; spike shape → high moment arm recoil  
**Mechanism**: Vertical-line flat faces: favorable smash angle (α low, J_smash dominant). Good smash-area contact per hit. Cannot reduce rotational recoil: spike protrusion creates large moment arm → angular impulse per hit × r_spike → significant rotational recoil Δω. Trade: good linear smash push but simultaneous rotational recoil. Net: works for KO but destabilizes attacker spin.  
**Engine Note**: flatFace → goodSmash; spikeProfileMomentArm → rotationalRecoil; linearVsRotational tradeoff.

---

### [Case 934 — Magne Weight Disk: Even Mass Distribution and Magnetic Gimmick Combine to Underperform Specialised WDs](./3%20case%20study.md#case-934)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: embedded magnets  
**Geometry**: even mass distribution; r_outer mid-range; magnetic inserts  
**Material**: ABS + magnets  
**Mechanism**: Even mass distribution (neither rim-concentrated nor compact-centred): mediocre I for any role. Magnetic inserts add mass but at non-optimal radius. Gimmick: magnets interact with Magne Stadia pins → disturbance force in Magne Stadia. Outside Magne Stadia: magnets are dead mass adding I at wrong radius. Underperforms Wide Defense (I), Ten Heavy (mass/balance), Eight Wide (compact alternative). Niche: Magne Stadia exploitation only.  
**Engine Note**: evenDistribution_mediocreI; magnetsDeadMass outside Magne Stadia; niche = magneStadiaOnly.

---

### [Case 935 — Reverse Attack SP: Moderate Fin Angle Makes It the Least-Recoil-Prone Two-Part SP](./3%20case%20study.md#case-935)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: two fin-shaped pieces; moderate fin angle  
**Material**: ABS  
**Contact Points**: moderate fin angle α (not radial, not tangential) → intermediate smash/recoil balance  
**Mechanism**: Moderate fin angle: less radical than Cross Attack (α≈80°) → lower recoil fraction. "Reverse" orientation: fin faces configured for opposite-spin contact exploitation. Among two-part SPs, lowest recoil due to fin angle compromise. Still outperformed by Defense Ring (peripheral mass) in most roles. Best two-part SP where low recoil is priority over LAD or mass.  
**Engine Note**: moderateFinAngle → leastRecoil of 2-part SPs; reverseOrientation for opp-spin; outperformed by DR in mass.

---

### [Case 936 — Customize Grip Base: SP-Compatible Wide Rim Provides Exceptional LAD Across Every Shaft and Tip Configuration](./3%20case%20study.md#case-936)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: wide outer rim r_rim ≈ 2.2 cm; SP rail slots; deep rim contact surface  
**Material**: ABS  
**Mechanism**: Wide rim at r=2.2 cm provides LAD across all shaft types: ω_LAD_min = √(μ_plastic × g / r_rim) = 10.56 rad/s (vs tip-dependent rates up to 24.7 rad/s). SP rails: Defense Ring or Cross Survivor add peripheral mass. Exceptional LAD because rim dominates precession regardless of tip choice. Best base for zombie combos requiring LAD + SP mass.  
**Engine Note**: r_rim = 2.2 cm; omega_LAD_min = 10.56 rad/s; SP_compatible; LAD_universal across shaft types.

---

### [Case 937 — Customize Grip Base Tip: Wide Hard-Rubber Flat with Central Magnet Trades Ridge Control for Stamina-Based Outspin](./3%20case%20study.md#case-937)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: embedded central magnet  
**Geometry**: wide rubber flat tip r ≈ 0.8–1.0 cm; magnet at tip center  
**Material**: rubber + magnet  
**Mechanism**: Wide rubber flat: μ_rubber ≈ 0.85 → reliable flower pattern at normal orbit speeds. Central magnet: attracts north-pole cores (South Magnecore, metal tips with north exposure) → tip clings to core shaft → slight tip retraction resistance (stamina-based outspin via reduced drift). Ridge control reduced vs narrow rubber (wider contact = less precise path). Best in zombie stamina combos.  
**Engine Note**: wideRubber_mu = 0.85; centralMagnet → north-core attraction; ridgeControl_reduced; zombieStamina.

---

### [Case 938 — Upper Claw: Multi-Mode Contact Geometry Combines Upper Attack, Upward Smash, and Smash Attack in Right Spin](./3%20case%20study.md#case-938)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: claw-shaped AR; multiple contact face orientations  
**Material**: ABS  
**Contact Points**: RS: upward slope (upper), flat claw face (smash), angled sides (upward smash) — 3 distinct contact modes  
**Mechanism**: Three RS contact modes: (1) upper slope lifts opponent; (2) flat claw face drives smash; (3) angled sides combine upward and lateral. Left spin: inverted slopes self-destabilize (downward component on attacker). RS combo potential: multi-mode contact means different opponent heights trigger different mechanics. Left spin: avoid (inverted self-destabilisation).  
**Engine Note**: RS_tripleMode: upperAttack + upwardSmash + smash; LS_selfDestabilising.

---

### [Case 939 — Ten Balance Weight Disk: Compact Edge-Focus vs Wide-Annular Trade-off](./3%20case%20study.md#case-939)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 10-fold symmetric; intermediate r_outer; rim-concentrated mass  
**Material**: ABS  
**Mechanism**: Ten Balance: decagonal (n=10) → r_eff_10 = 0.9834 × r_outer (best polygon efficiency after round). Intermediate outer radius: between Wide Defense (maximum r) and compact WDs. Rim concentration: mass at outer edge maximizes I for given total mass. Trade: lacks Wide Defense's absolute r advantage; better I-per-gram than square/hex WDs. General-purpose competitive WD for non-wide-WD builds.  
**Engine Note**: n=10; r_eff = 0.9834 × r_outer; intermediate_radius; rim_concentrated; competitiveGeneral.

---

### [Case 940 — Upper Attack Support Parts: Slope Extension, Orientation Alignment, and Mass Contribution](./3%20case%20study.md#case-940)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: slope-extension SP geometry; additional mass at SP radius  
**Material**: ABS  
**Mechanism**: SP oriented to extend the upper-attack slope of the AR: SP face angles align with AR slope → coherent slope geometry from inner AR to outer SP radius. Mass contribution: SP at outer radius adds I. Orientation alignment critical: mis-orientated by 1 notch → SP slope opposes AR slope → contact incoherence. Best paired with Upper Dragoon AR (Case 174) to extend slope reach.  
**Engine Note**: slopeExtension; orientationAlignmentCritical; massAtOuterRadius; bestWith = UpperDragoonAR.

---

### [Case 941 — Customize Metal Change Base: Phase-Switching Tip Enables Multi-Role Use at Superior Mass](./3%20case%20study.md#case-941)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: centrifugal phase switch between attack tip and stamina tip  
**Geometry**: metal phase-switch mechanism; two tip profiles  
**Material**: ABS + metal switch  
**Mechanism**: Phase switch: at high spin → centrifugal force deploys attack tip (flat metal); at low spin → tip retracts to stamina tip (sharp). Superior mass vs plastic change bases. Enables legitimately multi-role use: aggressive attack phase early battle, sharp stamina phase late battle. Metal mechanism more reliable than plastic spring mechanisms (vs Case 945). Best change-base implementation.  
**Engine Note**: centrifugalSwitch: highSpin=flatAttack, lowSpin=sharpStamina; metalMechanism_reliable; superior_mass.

---

### [Case 942 — Customize Metal Sharp Base: Fixed Tip with Plastic Collar Achieves Best Same-Spin Stamina at Cost of Early Nutation](./3%20case%20study.md#case-942)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: fixed metal sharp tip; plastic collar at base rim  
**Material**: ABS + metal sharp tip  
**Mechanism**: Fixed metal sharp tip μ ≈ 0.17 (vs bearing μ ≈ 0.05): lower friction than rubber, higher than bearing. Best same-spin stamina for fixed-tip bases. Plastic collar at rim: provides partial LAD (rim contact at deep tilt). Cost: early nutation — metal sharp offers zero restoring torque → any tilt becomes wobble immediately. Same-spin zombie role: excellent; any hit-sustained role: immediate tilt response.  
**Engine Note**: metalSharp_mu = 0.17; bestSameSpin_stamina; plasticCollar_LAD; earlyNutation = liability.

---

### [Case 943 — Mountain Hammer Attack Ring: High-Mass Smash, Rotational Recoil, and Elevated Contact Point Geometry](./3%20case%20study.md#case-943)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: high mass AR (one of heaviest); elevated contact point height; hammer protrusions  
**Material**: ABS  
**Contact Points**: hammer faces at elevated height; high-mass → high I  
**Mechanism**: High mass: elevated I → more spin conservation post-collision (same τ_recoil / higher I = smaller Δω). Elevated contact height: contacts opponent AR at higher band → useful against tall AR opponents. Rotational recoil still significant due to large moment arm of hammer protrusions. Best in high-mass attack builds where I retention matters more than per-hit recoil control.  
**Engine Note**: highMass; elevatedContactHeight; I_retention advantage; rotationalRecoil from large moment arm.

---

### [Case 944 — Defense Ring Support Part: Widest LAD Onset, Maximum Peripheral Inertia, and Passive Low-Recoil Surface](./3%20case%20study.md#case-944)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: largest SP outer radius; smooth passive surface; maximum peripheral I  
**Material**: ABS  
**Mechanism**: Largest SP radius: maximum I contribution of any SP (I = m × r² → r dominates). Wide smooth rim: best LAD onset of any SP (ω_LAD_min = √(μ×g/r_SP) lowest because r_SP largest). Passive surface: smooth, no protrusions → zero recoil from SP contacts, tangential deflection. Best SP for defense and zombie builds requiring LAD + mass + zero recoil.  
**Engine Note**: r_SP = maximum; I = highest SP; omega_LAD_min = lowest SP; passive_zeroRecoil.

---

### [Case 945 — Customize Clutch Change Base: Centrifugal Clutch Inverts the Useful Mode Order](./3%20case%20study.md#case-945)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: centrifugal clutch switches tip at spin threshold  
**Geometry**: clutch mechanism; two tip modes  
**Material**: ABS + plastic clutch  
**Mechanism**: Clutch: at high spin → stamina tip deployed; at low spin → attack tip deployed. This is inverted from useful: early battle (high spin) needs attack mode; late battle (low spin) needs stamina. Mechanism delivers stamina early and attack late — opposite of competitive optimum. Plastic clutch less reliable than metal (Case 941). Customize Metal Change Base (Case 941) solves this with correct phase order.  
**Engine Note**: clutchOrder_inverted: highSpin=stamina, lowSpin=attack; opposite of optimum; CMCBase = superior.

---

### [Case 946 — Cross Dranzer Attack Ring: Four-Fold Symmetry Produces Spin-Neutral Performance with Incomplete Spin-Steal Aggression](./3%20case%20study.md#case-946)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4-fold symmetric; four contact faces  
**Material**: ABS  
**Contact Points**: 4-fold symmetry → same contact geometry in all quadrants → spin-neutral  
**Mechanism**: Perfect 4-fold symmetry: each quadrant is geometrically identical regardless of spin direction → zero spin asymmetry → equal performance RS and LS. Intended for spin-steal aggression (slopes for sustained grinding) but slope geometry incomplete → insufficient sustained contact for equalization. Spin-neutral but not spin-stealing. General stamina/balanced role only.  
**Engine Note**: 4fold_symmetry → spinNeutral; incompleteSpinSteal; generalBalanced role.

---

### [Case 947 — Cross Survivor Support Parts: Wide Defensive Buffer, 4-Tab Geometry, and Bidirectional Mounting Behaviour](./3%20case%20study.md#case-947)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: wide arc SP with 4-tab mount; outer radius > Defense Ring  
**Material**: ABS  
**Mechanism**: Wide arc creates a deflection buffer zone ahead of the base rim. 4-tab mounting: orientable in 4 positions → subtle geometry tuning. Bidirectional: both mounting faces functional. Wider than Defense Ring → greater LAD assist radius and more deflection area. Less peripheral mass concentration than Defense Ring (arc, not full ring). Best where deflection area matters over pure I.  
**Engine Note**: wideArc; 4tabMount_orientable; LAD_radius > DefenseRing; lowerI vs DefenseRing.

---

### [Case 948 — Triple Attacker Attack Ring: Three Distinct Attack Vectors, Outer-Diagonal Contact Penalty, and Left-Spin Viability](./3%20case%20study.md#case-948)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 3-fold symmetric; three distinct contact zone geometries  
**Material**: ABS  
**Contact Points**: 3 vectors: upper slope, flat face, diagonal outer; diagonal outer contact → penalty  
**Mechanism**: Three contact geometries per wing: upper slope (upper attack), flat face (smash), diagonal outer (partial recoil penalty). Inner contacts: favorable angle. Outer-diagonal zone: contact angle steepens → recoil fraction increases. Left spin: slope orientation reverses → left-spin upper attack viable (but penalty zone still active). Good RS attack with acceptable LS cross-spin capability.  
**Engine Note**: 3vectors per wing; outerDiagonal_penaltyZone; LS_upperAttack viable.

---

### [Case 949 — Ten Wide Weight Disk: Wide Outer Radius with Reduced Rim Concentration and Tab Recoil](./3%20case%20study.md#case-949)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: wide r_outer (near Wide Defense); decagonal; mass distribution wider vs rim-concentrated  
**Material**: ABS  
**Mechanism**: Ten Wide: large outer radius (near Wide Defense) → high I. However, mass less rim-concentrated than Wide Defense (distributed across wider band) → lower I-per-gram than WD WD. Tab geometry at edges → recoil events if tabs contact opponent. Good I overall; Wide Defense still preferred for pure LAD/stamina. Ten Wide preferred where WD protrusion past AR must be minimized (Cases 183, 914).  
**Engine Note**: r_outer ≈ WideDefense; lessRimConcentrated; tabRecoil; AR-range scenarios prefer TenWide.

---

### [Case 950 — Double Bearing Core: Two-Stage Coupling Attenuation and Multi-Shaft Compatibility](./3%20case%20study.md#case-950)

**System**: Plastics System (Gen 1, SG System)  
**Spin Coupling**: two bearings in series; each bearing τ ≈ 1.05×10⁻⁶ N·m; total residual coupling approaches τ²  
**Geometry**: two shielded bearings in series; Neo SG shell only  
**Material**: ABS housing + two shielded bearings  
**Mechanism**: Two bearings in series: each stage attenuates coupling torque. τ_total = τ₁ × (attenuation₂) ≈ 1.05×10⁻⁶ × (μ₂ × r₂ / r_shaft) — approaches near-zero. Multi-shaft compatibility: accepts all zombie shafts (Neo SG DBV, Bearing Base Shaft, standard sharp). Only compatible casing for Neo SG DBV Shaft (Case 156). Best zombie casing for stamina builds requiring maximum decoupling.  
**Engine Note**: dualBearing_series; tau_total → near-zero; MultiShaft_compatible; required for NeoSGDBV.

---

## CS4 — Cases 189–285 + 1097 + 1281–1288 {#cs4}
Source: `4 case study.md`

---

### [Case 189 — Eight Spiker Attack Ring: Eight-Contact Symmetry as a Dead-Zone Eliminator, Why Low Recoil Defines the LS Benchmark Despite Lower Peak Power](./4%20case%20study.md#case-189)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 8-fold symmetric spiker AR; contacts at outer rim  
**Material**: ABS  
**Contact Points**: 8 contacts at 45° spacing; LS orientation achieves low recoil fraction  
**Mechanism**: Eight-contact symmetry eliminates dead zones — no rotation angle produces zero contact exposure. LS spin: spiker faces lead at favorable angle → low recoil benchmark for LS ARs despite lower peak smash than some alternatives. RS: spiker backs lead → high recoil. LS benchmark due to consistency + recoil management.  
**Engine Note**: symmetry=8; LSbenchmark for recoil; noDeadZone; RS non-viable.

---

### [Case 190 — Left Engine Gear (Metal Semi-Flat): Non-Bevelled Flat Tip Fails Aggressive Attack, EG Burst Net-Negative, Left Spin Removes Compensating Strategies](./4%20case%20study.md#case-190)

**System**: Plastics System (Gen 1, SG System, EG)  
**Gimmick**: Engine Gear burst mechanism; left-spin EG  
**Geometry**: metal semi-flat tip; EG spring mechanism  
**Material**: metal tip + ABS gear  
**Mechanism**: Non-bevelled flat tip: μ ≈ 0.55 but no bevel edge → attack trajectory undirected (no angle to convert orbital kinetic energy to smash). EG burst: spring fires → tip kicks but delivers net-negative impulse (destabilizes attacker more than opponent). Left spin removes every compensating strategy: no LS-compatible aggressive AR, EG height inverts contact zone.  
**Engine Note**: nonBevelledFlat; EGburst_netNegative; LS_removesAllCompensation.

---

### [Case 191 — First Clutch Base (Driger G Version): 7.3 g](./4%20case%20study.md#case-191)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: First Clutch mechanism  
**Geometry**: 7.3 g; first clutch deceleration trigger  
**Material**: ABS + clutch mechanism  
**Mechanism**: First Clutch triggers tip retraction at deceleration threshold. Driger G version shares FCB trigger mechanism (see Case 187 and Case 223 for FCB variant comparisons). 7.3 g mid-range FCB mass. Clutch activation disrupts orbital trajectory; LAD modest. Competitive window narrow.  
**Engine Note**: mass_g = 7.3; firstClutch; DrigerG version; narrowCompetitiveWindow.

---

### [Case 192 — Triple Tiger Attack Ring: 6.3 g](./4%20case%20study.md#case-192)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 6.3 g; three-fold symmetric; tiger-claw contact faces  
**Material**: ABS  
**Contact Points**: three claw faces; RS smash primary  
**Mechanism**: Tiger-claw geometry: three angled flat faces produce competitive RS smash. 6.3 g mass: good inertia retention per hit. Three-fold symmetry: moderate contact frequency. Pairs well with Survivor Ring SP (Case 214) for alignment bonus. RS primary, LS usable but reduced smash fraction.  
**Engine Note**: mass_g = 6.3; 3fold; RS_smash primary; SurvivorRingSP alignment bonus.

---

### [Case 193 — Right Engine Gear (Metal Semi-Flat): 11.0 g](./4%20case%20study.md#case-193)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Engine Gear spring burst; metal semi-flat tip  
**Geometry**: 11.0 g; metal semi-flat CEW slot; spring mechanism  
**Material**: metal + ABS  
**Mechanism**: 11.0 g EG: heavy enough to contribute significant I. Metal semi-flat tip: μ ≈ 0.55, bevelled semi-flat provides some directional flower pattern. EG height raises attack contact zone. Burst: useful in one specific context (Case 215 V8 combo with metal flat). Standalone: CEW choice determines viability.  
**Engine Note**: mass_g = 11.0; metalSemiFlat; EGheight raises contact; CEWchoice determines viability.

---

### [Case 194 — Auto Change Base: 8.5 g](./4%20case%20study.md#case-194)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: automatic tip change on impact  
**Geometry**: 8.5 g; impact-triggered tip retraction  
**Material**: ABS  
**Mechanism**: Same impact-trigger mechanism family as SGACB (Case 119) but different base geometry. 8.5 g: competitive mass. Auto-change disruption risk in left spin (same self-KO pattern). Best use: right-spin setups where tip transition beneficial. Heavier than SGACB → better KO resistance.  
**Engine Note**: mass_g = 8.5; impactTrigger; LS_selfKO risk same as SGACB; RS preferred.

---

### [Case 195 — CEW Circle Defenser: 4.0 g + 0.23 g clip](./4%20case%20study.md#case-195)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Geometry**: 4.0 g main + 0.23 g clip; ring-shaped CEW  
**Material**: ABS  
**Mechanism**: Ring-shaped CEW providing wide smooth rim → best CEW for LAD assist and Circle Survivor Defense positioning when mounted in EG. Circular profile: tangential deflection at rim → low recoil on contact. Combined with Right EG (Circle Defenser) provides compact Circle Survivor functionality within EG system.  
**Engine Note**: mass_g = 4.23 total; ringCEW; LADassist best in class CEW; circularProfile_lowRecoil.

---

### [Case 196 — Double Horn Attack Ring: 5.5 g](./4%20case%20study.md#case-196)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5.5 g; two horn protrusions  
**Material**: ABS  
**Contact Points**: two horns; direction-dependent contact geometry  
**Mechanism**: Two-fold symmetric horn AR. Horn geometry similar to Twin Horn (Case 178) but different mass (5.5 g vs 4.5 g). Heavier horns: better spin retention per collision. LS rounded horn edges → spin-steal. RS horn backs → recoil. Direction-dependent performance follows same pattern as Twin Horn.  
**Engine Note**: mass_g = 5.5; twoHorn; LS_spinSteal; RS_recoil; heavier than TwinHorn.

---

### [Case 197 — Right Engine Gear (Circle Defenser / Mystery Cutter): 6.9 g](./4%20case%20study.md#case-197)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Engine Gear; accepts Circle Defenser or Mystery Cutter CEW  
**Geometry**: 6.9 g EG shell; CEW slot  
**Material**: ABS + metal spring  
**Mechanism**: Lighter EG shell (6.9 g) designed for Circle Defenser CEW configuration. Lower EG mass means CEW contributes larger fraction of combo I. Circle Defenser CEW provides best LAD in this shell. Mystery Cutter CEW: different contact geometry (see supplementary Case 1286). EG height must be managed for contact zone.  
**Engine Note**: mass_g = 6.9; acceptsCircleDefenser or MysteryCutter; CEWmass_fraction dominant.

---

### [Case 198 — Normal Base (Rock Bison Version): 5.6 g](./4%20case%20study.md#case-198)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Normal Base (no clutch, no spring); EG spring never activates  
**Geometry**: 5.6 g; standard shaft profile  
**Material**: ABS  
**Mechanism**: Normal Base: EG spring never depressed (no tab to trigger). CEW is permanently fixed → acts as standard tip. 5.6 g Rock Bison version. Advantage: no gimmick disruption; EG becomes pure CEW+mass platform. Best paired with CEW Light Sharp (Case 231) for zombie stamina.  
**Engine Note**: mass_g = 5.6; EGspringNeverFires; CEW_permanent; bestWith = CEWLightSharp zombie.

---

### [Case 199 — Normal Base (Wolborg 4 Version): 5.4 g](./4%20case%20study.md#case-199)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Normal Base — EG spring inactive  
**Geometry**: 5.4 g; slightly lighter than Rock Bison version  
**Material**: ABS  
**Mechanism**: Same Normal Base functionality as Case 198 (spring never fires). Wolborg 4 version 0.2 g lighter. Same CEW-permanent advantage. Marginally lower mass → marginally lower KO resistance. Functionally interchangeable with Rock Bison version; choose heaviest available.  
**Engine Note**: mass_g = 5.4; functionallyIdentical to RockBison Normal Base; EGspring_inactive.

---

### [Case 200 — Right Engine Gear (Circle Survivor): 6.8 g](./4%20case%20study.md#case-200)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Geometry**: 6.8 g; accepts Circle Survivor CEW  
**Material**: ABS + metal spring  
**Mechanism**: EG shell configured for Circle Survivor CEW (Case 201). 6.8 g shell: moderate I contribution. Circle Survivor CEW provides the best sustained stamina/LAD combination in CEW class. EG spring burst adds spin-steal grinding moment if activated in zombie builds. Key stamina EG configuration.  
**Engine Note**: mass_g = 6.8; pairedWith CircleSurvivorCEW; EGspring for spinSteal in zombie mode.

---

### [Case 201 — CEW Circle Survivor: 4.5 g + 0.23 g clip](./4%20case%20study.md#case-201)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Geometry**: 4.5 g + 0.23 g clip; smooth circular ring CEW  
**Material**: ABS  
**Mechanism**: Smooth circular ring CEW: maximum LAD radius, smooth rim, zero recoil profile. Best stamina CEW in class — wider than Circle Defenser, smooth surface → better precession. Zombie configuration: Normal Base + CEW Circle Survivor + Right CG Free Shaft (Case 234) achieves competitive LAD. Paired with Right EG Circle Survivor (Case 200).  
**Engine Note**: mass_g = 4.73 total; smoothCircularRing; bestStaminaCEW; LAD_best in CEW class.

---

### [Case 202 — Star Wolf Attack Ring: 4.3 g](./4%20case%20study.md#case-202)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.3 g; star/wolf profile contact geometry  
**Material**: ABS  
**Contact Points**: star-shaped protrusions; moderate smash  
**Mechanism**: 4.3 g: light AR. Star/wolf profile: moderate contact geometry between pure radial (zero smash) and optimal flat face. Usable in specific stamina-hybrid builds. Not top-tier in any category — lightweight limits I contribution while contact geometry provides neither best smash nor best recoil absorption.  
**Engine Note**: mass_g = 4.3; light_AR; moderate contact; no top-tier role.

---

### [Case 203 — Final Clutch Base (Dranzer G Version): 7.9 g](./4%20case%20study.md#case-203)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Final Clutch — tip deploys at minimum spin threshold  
**Geometry**: 7.9 g; Final Clutch mechanism  
**Material**: ABS + clutch  
**Mechanism**: Final Clutch activates when spin drops below threshold: retracts tip to change mode. Dranzer G version: 7.9 g (heavier than most FCBs). Timing inversion problem: tip activates when bey is already slow → wrong mode at wrong time in most archetypes. V8 combo (Case 215 EG Metal Flat) is the primary exception where FCB timing aligns with post-topple LAD mode.  
**Engine Note**: mass_g = 7.9; finalClutch; timingInverted except V8 combo; DranzerG version.

---

### [Case 204 — Wing Survivor Attack Ring: 4.7 g](./4%20case%20study.md#case-204)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.7 g; wing profile optimized for survival  
**Material**: ABS  
**Mechanism**: Wing profile shaped for LAD/survival rather than attack. Smooth wing edges → low recoil on contact (deflection rather than smash). Paired with Circle Survivor-type bases for zombie stamina builds. 4.7 g: moderate mass. Not attack-viable; optimized for passive deflection and spin retention.  
**Engine Note**: mass_g = 4.7; survivorWing; passiveDeflection; no attack viable.

---

### [Case 205 — Shield Hammer Attack Ring: 6.3 g](./4%20case%20study.md#case-205)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 6.3 g; shield profile + hammer protrusions  
**Material**: ABS  
**Contact Points**: shield smooth face (defense) + hammer protrusion (attack) dual-mode  
**Mechanism**: Dual-profile AR: smooth shield section provides low-recoil defense on one face; hammer protrusion delivers smash on opposing face. 6.3 g mass: competitive. Performance depends on contact orientation at collision. Inconsistent — opponent may contact shield or hammer unpredictably. Neither role fully optimized vs dedicated ARs.  
**Engine Note**: mass_g = 6.3; dualMode_shield+hammer; inconsistent contact orientation.

---

### [Case 206 — Right Engine Gear (Metal Ball): 11.5 g](./4%20case%20study.md#case-206)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Engine Gear; metal ball CEW slot  
**Geometry**: 11.5 g; accepts Metal Ball CEW  
**Material**: metal + ABS  
**Mechanism**: Heaviest EG shell variant at 11.5 g. Metal ball CEW (Case 207): spherical contact produces inconsistent outcomes. 11.5 g shell mass dominates I. EG burst with metal ball tip: ball rolls at contact → unpredictable contact direction. Heavy shell compensates for CEW deficiencies via mass alone.  
**Engine Note**: mass_g = 11.5; heaviestEG; metalBallCEW_inconsistent; shellMass_compensates.

---

### [Case 207 — CEW Metal Ball: 3.7 g — Spherical Contact Surface Undermines Every Role](./4%20case%20study.md#case-207)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Geometry**: 3.7 g; spherical ball contact surface  
**Material**: metal ball  
**Mechanism**: Spherical CEW: contact normal direction varies with ball rotation angle → inconsistent impulse direction per collision. Attack: unpredictable smash vector. Stamina: ball rolls rather than slides → spin-steal can work in one narrow configuration (see Case 206 note). Defense: ball deflects but direction random. Negligible I due to r_ball small. No competitive role except niche ball-roll geometry exploit.  
**Engine Note**: mass_g = 3.7; sphericalContact_inconsistent; rollGeometry = 1 niche; noCompetitiveRole.

---

### [Case 208 — Left Customize Engine Gear: 6.6 g — Weaker Spring, No Competitive Attack CEW, Left-Spin Structural Constraints](./4%20case%20study.md#case-208)

**System**: Plastics System (Gen 1, SG System, EG/CEW) — Left Spin  
**Gimmick**: Left-spin EG; weaker spring than Right CEG  
**Geometry**: 6.6 g; left-spin CEW slot  
**Material**: ABS + spring  
**Mechanism**: Left-spin CEG: weaker spring produces lower burst velocity → less burst benefit. No competitive LS attack CEW exists → CEW slot goes unused for attack. Left-spin structural constraints: gear engagement reverses → some CEWs cannot engage properly. Only LS EG platform. Without competitive LS attack CEW, no viable role despite unique LS capability.  
**Engine Note**: mass_g = 6.6; weakerSpring; noCompetitiveLS_CEW; structuralConstraints_LS.

---

### [Case 209 — Right Customize Gear (Full Auto Clutch Version): 5.1 g — Replicates FAC Without Shielded Bearings, Destroys Free-Spin Phase](./4%20case%20study.md#case-209)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Full Auto Clutch mechanism replica without shielded bearings  
**Geometry**: 5.1 g; FAC-style clutch  
**Material**: ABS  
**Mechanism**: Attempts to replicate Full Auto Clutch free-spin phase without the shielded metal ball bearings of Case 234 (Right CG Free Shaft). Without bearing isolation, shaft friction eliminates free-spin → clutch engages immediately → no actual free-spin phase. Every blade base pairing either negates gimmick immediately or produces result worse than existing alternatives.  
**Engine Note**: mass_g = 5.1; FACwithoutBearings; freeSpinPhase_destroyed; noViableRole.

---

### [Case 210 — SG (MG Spring Version): 3.8 g — Jumping Gimmick Worsens Stability, Shaft Geometry Is Only Justification, Spring Variation Compounds Failures](./4%20case%20study.md#case-210)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: spring-loaded jumping mechanism  
**Geometry**: 3.8 g; spring-loaded SG; shaft geometry for specific combos  
**Material**: ABS + spring  
**Mechanism**: Spring jump: launched upward by spring on contact → air time → landing. Jump worsens stability: leaves contact with stadium → zero precession control mid-air → random landing tilt. Shaft geometry (specific diameter) justifies the part in limited combos where shaft fit matters more than gimmick. Spring strength varies between copies → inconsistent jump height → unpredictable performance.  
**Engine Note**: mass_g = 3.8; jumpGimmick_worsensStability; shaftGeometry = only justification; springVariation compounds.

---

### [Case 211 — Final Clutch Base (Draciel G Version): 7.3 g — Independent Non-Bridged Clutch Tabs Create Alignment-Dependent Trigger Failure](./4%20case%20study.md#case-211)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Final Clutch with non-bridged independent tabs  
**Geometry**: 7.3 g; lightest Final Clutch Base; independent clutch tabs  
**Material**: ABS  
**Mechanism**: Non-bridged clutch tabs: each tab operates independently → misalignment between tabs and EG trigger → clutch activates at wrong spin rate relative to design intent. Lightest FCB at 7.3 g → narrowest competitive window (lowest mass support). Alignment-dependent failure means performance varies significantly between assemblies. Only viable in precisely aligned assemblies.  
**Engine Note**: mass_g = 7.3; nonBridgedTabs; alignmentDependentFailure; lightestFCB.

---

### [Case 212 — Dragon Saucer Attack Ring: 6.5 g total (Core AR 4.5 g) — Default Gear SAR Cancels Core; Screw Zeus Unlocks Top-Tier RS/LS Smash](./4%20case%20study.md#case-212)

**System**: Plastics System (Gen 1, SG System, SGS)  
**Geometry**: 6.5 g total (Core AR: 4.5 g, Gear SAR: ~2.0 g); SAR slot  
**Material**: ABS  
**Contact Points**: SAR-conditional — Gear SAR obstructs Core; Screw Zeus exposes top-tier contacts  
**Mechanism**: Default Gear SAR: interferes with Core AR contact points → cancels smash → non-competitive stock. Screw Zeus SAR (Case 233) fixed by Dragon Saucer Core: all contacts exposed → one of most powerful RS and LS smash setups. Fast, high-traction tip required to convert full weight mass into ring-outs. SAR choice is binary for performance.  
**Engine Note**: mass_g = 6.5; defaultSAR_cancels; ScrewZeusSAR = topTier; requiresHighTractionTip.

---

### [Case 213 — Dragon Saucer Sub-AR: 1.9 g — Free-Spinning Gear Ring Disperses Smash Force; Gap-Resonance with Holy Despell Creates Catastrophic Recoil](./4%20case%20study.md#case-213)

**System**: Plastics System (Gen 1, SG System, SGS)  
**Gimmick**: free-spinning gear SAR  
**Geometry**: 1.9 g; gear-profile ring  
**Material**: ABS  
**Mechanism**: Free-spinning gear ring: only SAR that meaningfully disperses smash force (spin-up absorbs impact). Height dynamics critical: must align with opponent AR height for contact. Gap-resonance with Holy Despell Core AR (Case 232): gear teeth engage Despell triangle protrusions → catastrophic recoil failure mode. Avoid pairing. Best in Gyro EG context where gear ring feedback provides power.  
**Engine Note**: mass_g = 1.9; freeSpinGear; dispersesSmash; HolyDespell_resonance = catastrophic.

---

### [Case 214 — Survivor Ring Support Part: 2.9 g — Near-Complete Ring at Maximum SP Radius, Highest I-Per-Gram, Three-Fold Fin Symmetry Aligns With Triple Tiger](./4%20case%20study.md#case-214)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 2.9 g; near-complete ring at maximum SP radius; 3-fold fin alignment  
**Material**: ABS  
**Mechanism**: Near-complete ring at maximum possible SP radius → highest I-per-gram of any SP (I = m × r², maximum r maximizes I). Three-fold fin symmetry: aligns perfectly with Triple Tiger AR (Case 192) — fins slot into AR valleys → coherent contact geometry. Defense Ring still wins LS survival role (higher mass). Survivor Ring excels in RS stamina + maximum I contribution.  
**Engine Note**: mass_g = 2.9; maxRadius → highestI_perGram; TripleTiger_alignment; DR wins LS survival.

---

### [Case 215 — Right Engine Gear (Metal Flat): 10.9 g — Wide Metal Tip Enables V8 Combo, FCB Burst Into Toppling Creates Post-Topple Spin-Stealing LAD Mode](./4%20case%20study.md#case-215)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Engine Gear spring burst with metal flat tip; V8 combo interaction  
**Geometry**: 10.9 g; metal flat tip; wide contact radius  
**Material**: metal flat tip + ABS  
**Mechanism**: Wide metal flat tip: μ ≈ 0.55–0.65, wide contact enables flower pattern at high spin. V8 combo: metal flat tip + Final Clutch Base → EG burst topples bey at burst threshold → bey transitions to LAD mode, spinning on EG rim → spin-steal contact with opponent from LAD position. Only EG that makes competitive use of the gimmick via this specific post-topple mode.  
**Engine Note**: mass_g = 10.9; metalFlatTip; V8combo = topple→LAD_spinSteal; only competitive EG gimmick use.

---

### [Case 216 — Final Clutch Base (Gaia Dragoon G Version): 7.4 g — Aggressive Perimeter Irrelevant to V8; Trigger Aligns With Post-Topple EG Burst](./4%20case%20study.md#case-216)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Final Clutch; V8 combo trigger alignment  
**Geometry**: 7.4 g; aggressive perimeter shape  
**Material**: ABS  
**Mechanism**: Perimeter shape looks aggressive but contacts floor, not opponents → irrelevant to performance. Final Clutch trigger timing aligns with post-topple EG burst in V8 combo (Case 215). Marginal advantage vs Dranzer G version (Case 203): Dranzer G slightly heavier (0.2 g) but better LAD. Gaia Dragoon G version does not justify cost premium for marginal timing difference.  
**Engine Note**: mass_g = 7.4; perimeterShape_irrelevant; V8triggerAlignment; DranzerG_slightlyPreferred.

---

### [Case 217 — Wing Upper Attack Ring: 5.3 g — Rounded Wing Edges, Wider Than Wide Survivor, RS/LS Slope Geometry Mismatch](./4%20case%20study.md#case-217)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5.3 g; wide wing profile (wider than Wide Survivor WD); rounded leading edges  
**Material**: ABS  
**Contact Points**: rounded edges → partial upper slope; RS primary; LS recoil cost  
**Mechanism**: Wider than Wide Survivor: physical width blocks Wide Survivor LAD benefit (WS rim hidden behind AR). Rounded wing edges: partial slope → upper attack component exists but reduced vs sharp-edge alternatives. RS: slope geometry functional. LS: slope inverts → recoil costs exceed every offensive gain. Net: neither best upper attack nor best LAD — dual penalty.  
**Engine Note**: mass_g = 5.3; widerThanWideSurvivor = blocks LAD; roundedSlope; LS_recoilExceedsGain.

---

### [Case 218 — Gyro Engine Gear: 21.2 g](./4%20case%20study.md#case-218)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Gyro EG — internal gyroscopic mass that spins opposite to shell  
**Geometry**: 21.2 g (heaviest EG); internal rotor mass; CEW slot  
**Material**: metal rotor + ABS  
**Mechanism**: Internal rotor spins counter to shell via gear coupling. At high combo spin: rotor provides gyroscopic stabilization (increases effective L = I_total × ω_effective). Heavy at 21.2 g: highest I contribution of any EG. Counter-rotation: creates opposite spin-angular-momentum component → enhances precession resistance. Best for stamina/defense with high-inertia CEW. Rotor wear reduces effectiveness over time.  
**Engine Note**: mass_g = 21.2; counterRotatingRotor; gyroStabilization; heaviestEG; rotorWear.

---

### [Case 219 — Engine Stopper Base: 5.5 g](./4%20case%20study.md#case-219)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: EG spring stopper — spring fires then locks permanently  
**Geometry**: 5.5 g; spring stopper mechanism  
**Material**: ABS  
**Mechanism**: Spring fires once, then stopper engages — spring cannot re-cock. EG burst is a one-time event: high initial burst at launch, then base functions as Normal Base for remainder. 5.5 g: competitive mass. One-time burst advantage: full spring energy delivered on first opportune contact. After burst: CEW permanently fixed. Use CEW Light Sharp (Case 231) for post-burst stamina.  
**Engine Note**: mass_g = 5.5; onceFiresLocks; postBurst = NormalBase; bestWith = CEWLightSharp.

---

### [Case 220 — CEW Metal Sharp: 3.3 g](./4%20case%20study.md#case-220)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Geometry**: 3.3 g; metal sharp tip CEW  
**Material**: metal sharp tip  
**Mechanism**: Metal sharp CEW: μ ≈ 0.17 → best stamina of any CEW tip type. Paired with Right CG Free Shaft (Case 234) bearing isolation achieves near-bearing stamina performance within EG system. Best stamina CEW alongside Circle Survivor. EG height handicap: sharp tip sits high → contact geometry affected. Best on Normal Base or Engine Stopper Base where spring doesn't interfere.  
**Engine Note**: mass_g = 3.3; metalSharp_mu=0.17; bestStaminaCEW alongside CircleSurvivor; EGheight handicap.

---

### [Case 221 — G Upper Attack Ring: 5.5 g — Focused Smash Geometry Doubles as Effective Traditional Upper in LS; RS Provides Nothing Useful](./4%20case%20study.md#case-221)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5.5 g; focused smash faces with upper-attack slope component  
**Material**: ABS  
**Contact Points**: LS: slope face → traditional upper attack; RS: geometry inverts → no useful contact  
**Mechanism**: G Upper AR: primary design is focused smash but slope geometry doubles as traditional upper attack in left spin (slope leads in LS → both upper lift and lateral smash). RS: same slope inverts → geometry provides no useful contact mode. Pure LS AR. Competitive LS upper attack benchmark alongside Eight Spiker (Case 189) for recoil comparison.  
**Engine Note**: mass_g = 5.5; LS_upper+smash viable; RS_nothing useful; LSbenchmark.

---

### [Case 222 — Left Engine Gear (Turbo): 7.0 g — Turbo Activation Produces Attack-Class Spin Burst; Height and LS AR Geometry Prevent Effective Contact](./4%20case%20study.md#case-222)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Turbo EG — stronger spring burst than standard EG; left spin  
**Geometry**: 7.0 g; turbo spring; left-spin orientation  
**Material**: ABS + high-tension spring  
**Mechanism**: Turbo spring: delivers attack-class burst velocity on activation. Height penalty: left EG raises combo → AR contact height too high for most opponents. LS AR geometry: inverts most AR contacts → reduces effective smash from available LS ARs. First Clutch Base (Case 223 Dragoon GT variant) is only viable host: FCB timing aligned with burst threshold. Outside of FCB combo, height + LS AR geometry prevents effective contact.  
**Engine Note**: mass_g = 7.0; turboSpring_attackBurst; height+LS_ARgeometry = prevents contact; FCB_only_viable.

---

### [Case 223 — First Clutch Base (Dragoon GT Version): 7.4 g — Four-Wing Perimeter Recoil in Both Directions; FCB Activation Avoids Self-KO but Breaks Flower Pattern](./4%20case%20study.md#case-223)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: First Clutch; four-wing perimeter  
**Geometry**: 7.4 g; four-wing perimeter protrusions  
**Material**: ABS  
**Mechanism**: Four-wing perimeter: generates unacceptable recoil in both spin directions (Case 223 vs Case 191 comparison: Dragoon GT worse than Driger G). FCB activation avoids Final Clutch's self-KO pattern (activates on deceleration not minimum spin) but replaces with broken flower pattern (tip change disrupts movement trajectory). Dragoon G version (Case 191) strictly superior.  
**Engine Note**: mass_g = 7.4; fourWingRecoil; FCB_avoidsSelfKO; brokenFlowerPattern; DragoonG_inferior.

---

### [Case 224 — CEW Metal Semi-Flat: 3.6 g — Bevelled Semi-Flat Falls Between Every Useful Role](./4%20case%20study.md#case-224)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Geometry**: 3.6 g; bevelled semi-flat metal tip CEW  
**Material**: metal semi-flat tip  
**Mechanism**: Bevelled semi-flat: neither sharp (best stamina) nor wide flat (attack flower pattern). EG height compounds limited output. Bevel provides slight directional tendency but insufficient for competitive attack. Stamina: μ too high vs sharp alternatives. Attack: bevel insufficient for competitive flower. Defense: no advantage. No archetype benefits from this specific geometry combination.  
**Engine Note**: mass_g = 3.6; bevelledSemiFlat; betweenAllRoles; noArchetype benefits.

---

### [Case 225 — Triangle Wing Attack Ring: 6.1 g — Symmetric Slope Geometry Produces Identical Upper Attack Both Directions; Recoil Disqualifies Defense/Survival](./4%20case%20study.md#case-225)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 6.1 g; symmetric triangular wings; same slope RS and LS  
**Material**: ABS  
**Contact Points**: symmetric slope: identical upper attack RS and LS  
**Mechanism**: Symmetric triangle wing: slope angle same in both spin directions → identical upper attack performance regardless of spin. Bidirectional upper attack AR. Smash component comparable to upper attack AR family. Recoil cost: triangle edges generate recoil → disqualifies defense and survival roles. Attack viable; defense/survival not competitive.  
**Engine Note**: mass_g = 6.1; symmetricSlope → bidirectionalUpperAttack; recoil disqualifies defense.

---

### [Case 226 — Right Engine Gear (Reverse): 6.7 g — Counter-Rotating Tip Direction Produces Force Competition; Final Clutch Reduces Movement Without Counter-Attack; Metal Grip Is Only Residual Utility](./4%20case%20study.md#case-226)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Reverse EG — tip rotation direction reversed relative to shell  
**Geometry**: 6.7 g; reverse tip direction; CEW slot  
**Material**: ABS  
**Mechanism**: Reverse tip direction: tip rotates opposite to shell → floor friction acts against orbital velocity → creates force competition between orbital tendency and tip resistance. Does not reverse attack direction. Final Clutch interaction: clutch reduces orbital speed without enabling counter-attack. Metal Grip CEW: only configuration where reverse tip provides grip-based orbital control.  
**Engine Note**: mass_g = 6.7; reverseRotation_forceCompetition; FCB_reducesMovement; MetalGrip = only utility.

---

### [Case 227 — Final Clutch Base (Dranzer GT Version): 7.6 g — Three-Protrusion Mode-Change, Limited Functional Difference, Desert Sphinxer Version Outclasses](./4%20case%20study.md#case-227)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Final Clutch + three-protrusion mode-change perimeter  
**Geometry**: 7.6 g; three-protrusion perimeter mode-change  
**Material**: ABS  
**Mechanism**: Three perimeter protrusions switch between pseudo-attack and pseudo-defense contact geometry on mode-change. Functional difference between modes: limited — geometry overlap means attack mode has recoil (defense features protrude) and defense mode has attack exposure. FCB timing fails all archetypes independently. Desert Sphinxer version FCB (Case 1287) outclasses in the only role where weight matters.  
**Engine Note**: mass_g = 7.6; threeProngMode; limitedFunctionalDiff; DesertSphinxer_superior.

---

### [Case 228 — CEW Metal Change: 3.6 g — Well-Executed Subtle Point Produces Balanced Movement But Cannot Overcome EG Penalties; Circle Survivor Defeats It for Stamina](./4%20case%20study.md#case-228)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: metal phase-change tip CEW  
**Geometry**: 3.6 g; phase-change geometry (attack→stamina transition)  
**Material**: metal  
**Mechanism**: Well-executed metal phase-change: provides balanced movement across spin range. Point geometry: subtle → balanced impulse without extremes. Cannot overcome EG system height penalties. Circle Survivor CEW (Case 201) defeats it for stamina role by superior rim radius. Sits mid-tier in CEW offensive hierarchy. Best use: multi-role builds where one specific CEW cannot dominate.  
**Engine Note**: mass_g = 3.6; metalPhaseChange; balanced_no_extreme; CircleSurvivor_beats for stamina.

---

### [Case 229 — Gigantic Claw Attack Ring: 6.6 g — Slope Obstruction Limits RS Smash; Storm Grip Base Tip Inversion Unlocks Top-Tier Status; LS Force Smash Produces Only Upward Recoil](./4%20case%20study.md#case-229)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 6.6 g; large claw profile; slope geometry  
**Material**: ABS  
**Contact Points**: RS: slope obstruction reduces smash; inverted with Storm Grip Base Tip → top-tier  
**Mechanism**: RS standard: slope geometry partially obstructed → limited smash. Upward smash component elevates traditional upper attack capability. Inversion via Storm Grip Base Tip mount: flips contact orientation → removes obstruction → top-tier smash unlocked. LS force smash intent: downward slope inverts in LS → applies upward recoil to attacker instead. LS non-viable.  
**Engine Note**: mass_g = 6.6; RSobstructed; StormGripTipInversion = topTier; LS_uprightRecoil.

---

### [Case 230 — Final Clutch Base (Gigars Version): 7.6 g — Spike Protrusions Compound EG Recoil, Decent LAD Irrelevant Without Stamina Architecture](./4%20case%20study.md#case-230)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Final Clutch + spike protrusion perimeter  
**Geometry**: 7.6 g; spike protrusion perimeter  
**Material**: ABS  
**Mechanism**: Spike protrusions: high recoil fraction on perimeter contacts (α near-radial, Case 913 pattern). Compounds EG system recoil beyond all other FCB versions. Decent LAD (rim geometry adequate) but LAD irrelevant without competitive stamina CEW architecture. Worst FCB implementation: spike recoil removes every remaining role.  
**Engine Note**: mass_g = 7.6; spikeProtrusions_compoundRecoil; LAD_decent_but_irrelevant; worstFCB.

---

### [Case 231 — CEW Light Sharp: 0.85 g — POM Material and Change-Shaped Tip Produce Only Competitive CEW Configuration; Right Spin Lock and Inferior LAD Ceiling Keep It Niche](./4%20case%20study.md#case-231)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Geometry**: 0.85 g; change-shaped POM tip; right-spin bearing support from Right CG Free Shaft  
**Material**: POM (polyoxymethylene — ultra-low friction)  
**Mechanism**: POM material: μ ≈ 0.05 (same as bearing) → lowest friction CEW tip. Change-shaped tip creates LAD-capable contact surface. Right CG Free Shaft (Case 234) bearing support enables genuine LAD. Right-spin lock: CEW Light Sharp only engages properly in RS → LS incompatible. Inferior LAD ceiling vs dedicated bearing bases (CBS, SG Bearing Base). Niche: best EG zombie when right-spin + bearing EG not available.  
**Engine Note**: mass_g = 0.85; POM_mu=0.05; LAD_via_CG_FreeShaft; RS_only; niche_EGzombie.

---

### [Case 232 — Core Attack Ring: Holy Despell: 2.8 g — Triangle Protrusions Structural Recoil Liability; Dragon Saucer SAR Jamming; War Lion SAR Cannot Fully Shield](./4%20case%20study.md#case-232)

**System**: Plastics System (Gen 1, SG System, SGS)  
**Geometry**: 2.8 g; triangle protrusions; Core AR  
**Material**: ABS  
**Contact Points**: triangle protrusions → recoil liability (Case 157/Cross Attack pattern)  
**Mechanism**: Triangle protrusions: structural recoil liability in all roles (near-radial contact angle returns impulse to attacker). Dragon Saucer SAR gap-resonance: Despell triangles engage Dragon Saucer Gear SAR teeth → catastrophic recoil jam. War Lion SAR partially shields but cannot fully cover triangle exposure zone. Use only with War Lion SAR and accept partial shielding.  
**Engine Note**: mass_g = 2.8; triangleProtrusions_recoilLiability; DragonSaucer_gapJam; WarLion_partial shield.

---

### [Case 233 — Sub Attack Ring: Screw Zeus: 4.4 g — Speed-Dependent Contact Geometry Is Highest-Ceiling Smash SAR When Fixed; Inverted Slopes Create LS Asymmetric Self-Destabilisation](./4%20case%20study.md#case-233)

**System**: Plastics System (Gen 1, SG System, SGS)  
**Geometry**: 4.4 g; speed-dependent screw contact faces; inverted slopes  
**Material**: ABS  
**Contact Points**: speed-dependent: higher RPM → better smash angle alignment; fixed position = optimal  
**Mechanism**: Speed-dependent geometry: contact angle changes with RPM → at high RPM, screw face presents optimal smash angle. Fixed in position by Core AR (Great Dragon or Dragon Saucer): removes speed-dependency → optimal angle permanent → highest-ceiling smash SAR. Inverted slopes in LS: create asymmetric self-destabilization when struck from behind. RS primary.  
**SAR–AR Core Compatibility**: Screw Zeus SAR free-spin behavior is geometry-dependent — not all AR Cores permit the same rotation range. Native Zeus Core: collar geometry matches Screw Zeus dumbbell slopes → full rotation range (still non-functional due to phase-slip per Case 114). War Lion AR Core (Case 1032): AR slope contact surfaces and collar space create interference → partial movement only. The collar gap between AR Core and SAR body, plus the slope profile at the SAR-to-Core interface, are the physical contact points that define compatibility. Dragon Saucer AR Core (Case 212) and Great Dragon AR Core (Case 259): fix Screw Zeus in position → eliminates free-spin entirely → optimal smash. SAR choice and AR Core pairing are inseparable for performance analysis.  
**Engine Note**: mass_g = 4.4; speedDependent_fixed=optimal; highestCeilingSmashSAR; LS_invertedSlopes_selfDestabilise; sarCompatibility_geometryDependent — partialMovement with War Lion Core; fullFixed with Dragon Saucer / Great Dragon Core.

---

### [Case 234 — Right Customize Gear (Free Shaft Version): 4.0 g (shells) + 2 Bearings — Bearing Isolation Is Only EG Component Achieving Competitive LAD](./4%20case%20study.md#case-234)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: bearing-isolated free shaft; CEW slot  
**Geometry**: 4.0 g shells + bearing mass; shielded metal ball bearings  
**Material**: ABS shells + shielded bearings  
**Spin Coupling**: bearing-isolated free shaft → near-zero spin coupling τ ≈ 1.05×10⁻⁶ N·m per bearing  
**Mechanism**: Bearing isolation: only EG component that achieves competitive LAD. Two shielded bearings → free shaft approaches near-zero friction. CEW choice determines configuration space: Light Sharp → zombie; Circle Survivor → stamina; Metal Sharp → stamina variant. Alternative shafts produce distinct attack applications. Primary use remains stock Right CG shell.  
**Engine Note**: shells_g = 4.0; bearingIsolation; competitiveLAD_only_EG_component; CEWdeterminesConfig.

---

### [Case 235 — Right Customize Gear (Free Shaft Version) Shaft: 0.87 g — Casing Compatibility Determines Height Penalty; Non-EG Casing Mounting Creates Unavoidable Tallness](./4%20case%20study.md#case-235)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Geometry**: 0.87 g shaft; casing-dependent height  
**Material**: metal/ABS  
**Mechanism**: Shaft alone: 0.87 g. When mounted in non-EG casing (Customize Bearing Base, SG Bearing Base): creates unavoidable height increase vs native casing. Height penalty changes contact zone. Primary use: stock Right CG shell (Case 234) where casing height is optimized. Non-EG casing mounting is a height-penalty tradeoff worth taking only when native shell unavailable.  
**Engine Note**: mass_g = 0.87; casing_determines_height; nonEG_casing = heightPenalty; primaryUse = stockRCGshell.

---

### [Case 236 — First Clutch Base (Zeus Version): 8.0 g — Heaviest EG Base Creates Viable but Outclassed Weight-Based Defense; Poor LAD Limits All Other Roles; Round-Edge Profile Does Not Compensate for Height](./4%20case%20study.md#case-236)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: First Clutch; heaviest FCB  
**Geometry**: 8.0 g; round-edge perimeter; heaviest FCB  
**Material**: ABS  
**Mechanism**: Heaviest FCB at 8.0 g → maximum weight for weight-based defense role. Round-edge perimeter reduces recoil from base contacts. However: EG system height still applies → contact zone elevated → match results inconsistent. Poor LAD limits every other role. Viable (but outclassed) for weight-based defense only. No LAD role without round rim height fix.  
**Engine Note**: mass_g = 8.0; heaviestFCB; weightDefense_viable_outclassed; poorLAD; roundEdge_insufficient vs height.

---

### [Case 237 — Andre's Yak (Anime-Only): ~38–42 g Full Combo — Pagoda-Dome AR, Yin-Yang Ball-Bearing Pocket, Reversible-Axis Stamina](./4%20case%20study.md#case-237)

**System**: Plastics System (Gen 1, SG System) — Anime-Only  
**Geometry**: ~38–42 g full combo; pagoda dome AR; ball-bearing pocket yin-yang mechanism; height-doubling mode change  
**Material**: ABS (anime-only / never released)  
**Gimmick**: reversible spin-axis via yin-yang ball pocket; height-doubling mode change  
**Mechanism**: Pagoda-inspired dome AR. Yin-yang ball-bearing pocket enables reversible axis (RS↔LS switch mid-battle in anime). Height-doubling mode change: low-mode (standard, stable stamina) → high-mode (upper attack deflection with full height). Axis inversion becomes unavailable after mode change is triggered. Physics override: BeySpirit power enables anime mechanics that violate EG/clutch limits (see Anime Physics Override memory note).  
**Engine Note**: animeOnly; reversibleAxis; yinYangBallPocket; heightDoubling; axisInversion_locked post-change.

---

### [Case 238 — Sharkrash Attack Ring: ~6.0 g — Four Curved Shark Profiles Produce High Recoil Without Smash Throughput](./4%20case%20study.md#case-238)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~6.0 g; four curved shark-profile contacts  
**Material**: ABS  
**Contact Points**: convex curved backs → bound-style deflection without rubber energy absorption  
**Mechanism**: Four curved shark profiles: convex backs produce directional variation across contact arc (bound-style) but without rubber → elastic deformation absent → full impulse returns as recoil. High recoil without smash throughput. Below mid-tier attack benchmark. Curved geometry too variable for consistent smash angle — attack is inconsistent.  
**Engine Note**: mass_g ≈ 6.0; curvedSharkProfile; highRecoil_noSmash; belowMidTier.

---

### [Case 239 — Cyber Dranzer (Anime-Only): ~30–35 g Full Combo — Three-Claw Broad-Face AR Smash; Metal Sting Base Suppresses Attack by Eliminating Orbital Speed](./4%20case%20study.md#case-239)

**System**: Plastics System (Gen 1, SG System) — Anime-Only  
**Geometry**: ~30–35 g full combo; three-claw broad-face AR; Metal Sting Base  
**Material**: ABS (anime-only)  
**Mechanism**: Three-claw broad-face AR: higher RS smash throughput than Triple Wing (broader face → better angle). Metal Sting Base: very low friction tip → zero orbital speed → bey stays in place → no attack (attack requires orbital movement to intercept opponent). Suppresses attack output by eliminating orbital speed despite good AR geometry. No competitive archetype exploitable.  
**Engine Note**: animeOnly; ThreeClaw_higherSmash_than_TripleWing; MetalStingBase_zeroOrbital → suppresses attack.

---

### [Case 240 — Cross Fang Attack Ring (Driger F): 3.7 g — Four-Fold Thin Construction Outward-Angled Contact Eliminates RS Attack; LS Tier-2 Zombie Survival](./4%20case%20study.md#case-240)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 3.7 g; four-fold symmetric; thin construction; outward-angled contact faces  
**Material**: ABS  
**Contact Points**: outward-angled: RS near-radial → eliminates attack; LS inverts → moderate contact angle  
**Mechanism**: Outward-angled contacts: RS → near-radial → eliminates attack viability (J_smash → 0). LS: same geometry inverts → moderate contact angle achieves tier-2 zombie survival (low recoil, reasonable LAD). Tip protrusion width prevents top-tier zombie (protrusions reduce LAD rim effectiveness). Lightweight (3.7 g) limits I.  
**Engine Note**: mass_g = 3.7; RS_attackEliminated; LS_tier2_zombie; tipProtrusionWidth_prevents_topTier.

---

### [Case 241 — Cyber Driger (Anime-Only): ~27–31 g Full Combo — Thin Cyber-Claw AR Insufficient Contact Mass; Driger S Semi-Flat Tip Improves Orbital Stability](./4%20case%20study.md#case-241)

**System**: Plastics System (Gen 1, SG System) — Anime-Only  
**Geometry**: ~27–31 g full combo; thin cyber-claw AR  
**Material**: ABS (anime-only)  
**Mechanism**: Thin cyber-claw AR: insufficient effective contact mass across both spin directions — thin geometry reduces J at contact. Driger S semi-flat metal tip: μ ≈ 0.55 → better orbital stability than pure sting tip (less tip protrusion). Improvement in orbital stability doesn't rescue contact mass deficiency. Cannot achieve any competitive archetype.  
**Engine Note**: animeOnly; thinClaw_insufficientContactMass; DrigerS_SemiFlat improves orbital stability; noCompetitiveArchetype.

---

### [Case 242 — Spiral Change Base (Dranzer S): 7.2 g — Notch-Spring Mode Switching, Two Tip Geometries With Opposed Trade-offs, Best-in-Generation LAD, Cannot Compensate for Recoil Self-KO Risk](./4%20case%20study.md#case-242)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: notch-spring mode switch between two tip geometries  
**Geometry**: 7.2 g; notch-spring mode switch; two distinct tip profiles  
**Material**: ABS + spring  
**Mechanism**: Notch-spring switches between tip A (stable, lower LAD) and tip B (maximum LAD, less stable). Smooth spiral profile: best-in-generation LAD — spiral rim provides widest precession surface. Exceptional spin-steal capability from spiral contact. Cannot compensate for recoil self-KO risk: high spin-steal contacts also generate self-destabilizing recoil from spiral geometry. Niche: LAD demonstration build only.  
**Engine Note**: mass_g = 7.2; notchSpringSwitch; bestInGen_LAD; spinSteal_excellent; recoilSelfKO = disqualifier.

---

### [Case 243 — Double Wing Attack Ring (Dranzer S): 3.5 g — Two-Fold Asymmetric Wing Eliminates RS Viability; Wide Defense Coverage Inverts From Neutral to Beneficial by Shielding Tip Recoil; LS Compact Is Only Competitive Application](./4%20case%20study.md#case-243)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 3.5 g; two-fold asymmetric wings  
**Material**: ABS  
**Contact Points**: asymmetric: RS obstructed; LS favorable compact angle  
**Mechanism**: Asymmetric two-fold wings: RS contact obstructed → non-viable RS. LS: favorable wing contact angle → compact smash viable. Wide Defense WD inversion: normally WD protrusion past AR hurts (Case 167); here WD rim shields tip recoil → active benefit. Wide Defense changes from neutral to beneficial by the shield. LS compact: only competitive application.  
**Engine Note**: mass_g = 3.5; asymmetric_RS_obstructed; LS_compact viable; WD_shieldsRecoil = activelyBeneficial.

---

### [Case 244 — War Bear AR (Galzzly) — Core AR: 4.3 g / Total 6.7 g — Rounded Claw Arms, Free-Spinning Offensive SAR; Core Usable Only With Dragon Saucer SAR in LS](./4%20case%20study.md#case-244)

**System**: Plastics System (Gen 1, SG System, SGS)  
**Geometry**: Core AR: 4.3 g; Total with War Bear SAR: 6.7 g; rounded claw arms  
**Material**: ABS (fragile spike sections)  
**Contact Points**: rounded claw arms; free-spinning SAR for LS smash  
**Mechanism**: Core AR: rounded claw arms — not optimal alone. Free-spinning War Bear SAR (Case 278): non-functional free-spin (SAR locks to position) → fixed contacts → top-tier LS smash when properly fixed. Core viable only with Dragon Saucer SAR in LS (Case 212 Great Dragon). Fragile spiked sections on core. Non-competitive as stocked.  
**Engine Note**: coreAR_g = 4.3; total_g = 6.7; WarBearSAR_fixed = LS_topTier; DragonSaucerSAR_for_core_LS; fragile spikes.

---

### [Case 245 — War Monkey AR (Galman) — Core AR: 3.7/4.5 g / Total: 5.6/6.3 g (2 molds) — Four-Fold Symmetric; LS Top-Tier Survival, Zombie, Weight-Based Defense; RS Tier 2 Only](./4%20case%20study.md#case-245)

**System**: Plastics System (Gen 1, SG System, SGS)  
**Geometry**: M1: core 3.7 g / total 5.6 g; M2: core 4.5 g / total 6.3 g; 4-fold symmetric rounded heads  
**Material**: ABS  
**Contact Points**: 4-fold symmetric rounded monkey heads; LS favorable orientation  
**Mechanism**: Four-fold symmetric rounded heads: in LS favorable contact angle → top-tier survival, zombie, and weight-based defense (Case 277 War Monkey SAR pairs for ~100° coverage). RS: heads present convex backs → tier-2 only (higher recoil). M2 heavier (6.3 g total) preferred for weight-based roles. Both molds competitive in LS; choose M2 where mass matters.  
**Engine Note**: M1: 5.6g, M2: 6.3g; 4fold; LS_topTier_3roles; RS_tier2; M2_preferred.

---

### [Case 246 — Whale Attacker Attack Ring (Seaborg): ~3.5 g — Rounded Orca-Head Contact Geometry Produces Elastic Bouncing; Non-Competitive All Archetypes](./4%20case%20study.md#case-246)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~3.5 g; rounded orca head protrusions  
**Material**: ABS  
**Contact Points**: rounded orca heads → elastic bounce contact; near-zero LS contact angle  
**Mechanism**: Rounded orca-head geometry: contact produces elastic bouncing (curved surface deflects impulse off angle → inconsistent direction). LS: near-zero contact angle fails to provide smooth recoil absorption. RS: rounded backs produce elastic bounce without smash direction. Both spin directions: non-competitive. Light weight limits I contribution.  
**Engine Note**: mass_g ≈ 3.5; orcaHead_elasticBounce; LS_nearZeroAngle; RS_bounce; nonCompetitive all.

---

### [Case 247 — Cross Spike Attack Ring (Draciel S): ~3.9 g — Four Radially-Oriented Spike Tips; High Contact Frequency Multiplies Recoil Rather Than Compensating Smash Deficit](./4%20case%20study.md#case-247)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~3.9 g; four radially-oriented spike tips  
**Material**: ABS  
**Contact Points**: radial spikes → α ≈ 90°; J_smash ≈ 0; J_recoil ≈ J  
**Mechanism**: Radially-oriented spikes: α ≈ 90° from orbital tangent → near-zero smash, near-total recoil (cross attack pattern, Case 157). Four-fold symmetry: 4 contacts per revolution → frequency multiplies recoil accumulation rather than compensating smash deficit. High frequency + zero smash = rapid self-destabilization. No competitive advantage from symmetric four-fold geometry in this contact type.  
**Engine Note**: mass_g ≈ 3.9; radialSpikes_J_smash≈0; highFrequency_multipliesRecoil; noCompetitive advantage.

---

### [Case 248 — SG Metal Ball Base (Draciel S): ~6.1 g — Metal Ball Tip in SG Shell; Moderate Friction Orbital Movement; Tier 2 in Tip Friction Hierarchy](./4%20case%20study.md#case-248)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: ~6.1 g; metal ball tip integrated in SG shell; r_ball ≈ 0.2 cm  
**Material**: ABS + metal ball  
**Mechanism**: Metal ball tip integrated in SG shell (vs CEW version Case 207). μ_metal_ball ≈ 0.35 (between sharp and rubber). Provides moderate friction → orbital movement without full rubber grip. Tier 2 in plastics tip friction hierarchy: bearing (μ≈0.05) > metal sharp (μ≈0.17) > metal ball (μ≈0.35) > plastic flat (μ≈0.35). Useful when bearing configurations unavailable. SG-native integration means no CEW height penalty.  
**Engine Note**: mass_g ≈ 6.1; metalBall integrated; mu≈0.35; tier2 tip hierarchy; no CEW height penalty.

---

### [Case 249 — SG Bearing Base (Wolborg): ~7.2 g — Built-In Ball Bearings Define Top-Tier Zombie Archetype; Purpose-Fit Shaft Tolerance Eliminates Catch Events](./4%20case%20study.md#case-249)

**System**: Plastics System (Gen 1, SG System)  
**Spin Coupling**: built-in ball bearings (purpose-fit shaft) → near-zero friction; τ ≈ 1.05×10⁻⁶ N·m  
**Geometry**: ~7.2 g; purpose-fit shaft tolerance; dual bearing positions  
**Material**: ABS + shielded bearings  
**Mechanism**: Built-in ball bearings: near-zero tip friction (same tier as Case 234 bearing shaft). Purpose-fit shaft tolerance: eliminates catch events that affect Customize Bearing Base (CBS has slight shaft wobble → intermittent catch → spin loss spikes). SG Bearing Base native fit: consistent near-zero friction throughout battle. Enabling hardware for top-tier zombie-defense. CBS competes but SGBB more consistent.  
**Engine Note**: mass_g ≈ 7.2; builtInBearings; purposeFitShaft → no catch events; topTier zombie hardware.

---

### [Case 250 — Cross Attacker AR (Dranzer V): 5.6 g — Phoenix-Head Smash/Upper Hybrid; Four-Fold Symmetry, Compound Contact Geometry](./4%20case%20study.md#case-250)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5.6 g; four-fold symmetric; phoenix-head compound contact  
**Material**: ABS  
**Contact Points**: phoenix-head shape: combined smash + upper components; 4-fold  
**Mechanism**: Phoenix-head geometry: contact face combines flat smash component (lateral push) with upward slope component (upper attack lift). Four-fold symmetry: contact frequency × 4. RS primary (forward face presents favorable angle). Hybrid smash/upper: neither best-in-class smash nor best-in-class upper but competitive in both.  
**Engine Note**: mass_g = 5.6; 4fold; phoenixHead_smash+upper hybrid; RS primary.

---

### [Case 251 — Ten Spike AR (Draciel V): 4.1 g — Uneven Ten-Protrusion Ring; Alternating Large/Small Spikes; Extreme Recoil; Non-Competitive](./4%20case%20study.md#case-251)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.1 g; 10-protrusion ring; alternating large/small spikes  
**Material**: ABS  
**Contact Points**: 10 spikes alternating size → variable recoil per contact; near-radial orientation  
**Mechanism**: Alternating large/small spikes: creates two recoil levels per revolution (large spikes → extreme recoil; small spikes → moderate recoil). Near-radial spike orientation → near-total recoil from every contact regardless of size. Ten-spike high contact frequency multiplies total recoil accumulation. Non-competitive in all archetypes.  
**Engine Note**: mass_g = 4.1; alternatingSpikes; nearRadial_extremeRecoil; nonCompetitive.

---

### [Case 252 — Eight Spike AR (Draciel F): 4.2 g — Eight Symmetric Blunt Spikes; No Smash Angle; No Competitive Value](./4%20case%20study.md#case-252)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.2 g; 8 symmetric blunt spikes  
**Material**: ABS  
**Contact Points**: blunt spikes → α near-90°; J_smash ≈ 0  
**Mechanism**: Eight blunt spikes: symmetric → no spin-direction asymmetry. Blunt profile: contact normal near-radial → J_smash ≈ 0, J_recoil ≈ J. Eight-fold frequency: multiplies recoil. Blunt vs sharp spike: less penetrating — spreads contact energy across blunt face but angle remains radial. No competitive value — non-competitive by contact geometry alone.  
**Engine Note**: mass_g = 4.2; 8bluntSpikes; J_smash≈0; noCompetitive.

---

### [Case 253 — Weight Ring WD (Hayate-type beys): 12.4 g — Specialty Non-Universal WD; Hayate Base-Only Channel Fit](./4%20case%20study.md#case-253)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 12.4 g; channel-fit geometry; Hayate-base only  
**Material**: ABS  
**Mechanism**: Non-universal WD: channel fit mates only with Hayate-type base (specific groove). Same mass as Wide Survivor (12.4 g) but less peripheral concentration (channel fit distributes mass differently). Cannot be used outside Hayate beys. Competitive only in Hayate assemblies; Wide Survivor or Wide Defense universally preferred where interchangeable.  
**Engine Note**: mass_g = 12.4; channelFit_HayateOnly; notUniversal; sameAsMass_WideSurvivor.

---

### [Case 254 — Balance WD / Eight Balance WD: 14.1 g — Eight-Spoke Compact Distribution; Mid-Weight Universal WD](./4%20case%20study.md#case-254)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 14.1 g; eight-spoke (n=8); r_eff_8 = 0.9745 × r_outer  
**Material**: ABS  
**Mechanism**: Eight-spoke octagonal WD: 14.1 g, heaviest compact-class WD. r_eff_8 = 0.9745 × r_outer (vs decagonal r_eff_10 = 0.9834). ~1% I deficit vs Ten Balance. Compact mass distribution: heavier than any 10-spoke compact alternatives. Universal fit. Mid-weight general purpose WD; Wide Defense preferred for stamina/defense; Eight Balance for compact-mass builds.  
**Engine Note**: mass_g = 14.1; n=8; r_eff=0.9745×r; heaviestCompact; ~1% vs TenBalance.

---

### [Case 255 — Eight Heavy WD: 15.3/15.5 g — Eight-Spoke Heavy; Two Molds; Maximum Mass 8-Spoke WD](./4%20case%20study.md#case-255)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: M1: 15.3 g / M2: 15.5 g; eight-spoke; maximum mass 8-spoke  
**Material**: ABS (two molds)  
**Mechanism**: Heaviest 8-spoke WD at 15.3–15.5 g. Two molds (Driger S / Dranzer F / Master Dragoon) with slight mass difference. n=8 → r_eff_8 vs Ten Heavy: ~1% I deficit for same mass. Maximum mass 8-spoke for KO resistance and inertia. Prefer M2 (heavier) when available.  
**Engine Note**: M1=15.3g, M2=15.5g; n=8; heaviest 8-spoke; preferM2.

---

### [Case 256 — Heavy WD: 15.3 g — Most Compact Standard WD; Hexagonal Corner Geometry; Ten/Eight Heavy Preferred](./4%20case%20study.md#case-256)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 15.3 g; hexagonal (n=6) → lower r_eff vs octagonal/decagonal; compact  
**Material**: ABS  
**Mechanism**: Most compact standard WD (small outer radius). Hexagonal corners: n=6 → r_eff_6 = 0.9574 × r_outer (lower than n=8 at 0.9745 or n=10 at 0.9834). Despite equal mass to Eight Heavy M1, lower r_eff → lower I. Broad unit variance: weight varies between copies. Ten/Eight Heavy preferred over Heavy WD due to better polygon efficiency.  
**Engine Note**: mass_g = 15.3; n=6; r_eff=0.9574×r; lowerI_vs_TenHeavy; broadVariance.

---

### [Case 257 — Heavy Attack WD: 16.0 g — Compact Heavy with Rounded Corner Protrusions; Severe Recoil Limits Use to Shielded Weight-Based Defense](./4%20case%20study.md#case-257)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 16.0 g; compact with rounded corner protrusions; highest-mass WD  
**Material**: ABS  
**Contact Points**: rounded corner protrusions → elevated recoil on contact  
**Mechanism**: Heaviest plastics WD at 16.0 g. Rounded corner protrusions: WD contacts opponent in some geometries → recoil from protrusions. Severe recoil limits use to builds where WD is fully shielded by AR (wide AR prevents WD contact). Only role: shielded weight-based defense where WD mass matters but WD never contacts.  
**Engine Note**: mass_g = 16.0; heaviestWD; roundedProtrusions_severeRecoil; use_only_shielded.

---

### [Case 258 — Viper Metal Ball Base (Draciel V): 8.2 g — Ball-in-Shaft Design; Magnecore-Dependent; Non-Competitive](./4%20case%20study.md#case-258)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 8.2 g; metal ball on metal pole  
**Material**: ABS base + metal ball + metal pole  
**Gimmick**: magnetic Magnecore alignment dependency  
**Mechanism**: Metal ball on metal pole: ball contact radius r_ball ≈ 0.2 cm provides moderate friction. Magnecore dependency: Magnecore attracts metal pole → holds ball in position. Without Magnecore, ball rattles → unpredictable contact. With Magnecore: controlled ball contact but friction still mid-tier. 8.2 g mass is competitive but tip + gimmick dependency makes it non-competitive vs alternatives.  
**Engine Note**: mass_g = 8.2; metalBallOnPole; MagnecoreDependent; nonCompetitive overall.

---

### [Case 259 — Great Dragon AR: 5.4 g — Two-Part Smash AR with SAR-Slot; Top-Tier with War Lion or War Bear SAR; Wing Sub-Ring Hurts Performance](./4%20case%20study.md#case-259)

**System**: Plastics System (Gen 1, SG System, SGS)  
**Geometry**: Core AR: 3.9 g, Wing SAR: 1.5 g; total 5.4 g; r_outer_core ≈ 3.0 cm; I_core ≈ 2.09×10⁻⁶ kg·m²  
**Material**: ABS (black version: Gold Plastic Syndrome → avoid)  
**Contact Points**: SAR-conditional: War Lion SAR → RS highly competitive; War Bear SAR → LS top-tier  
**Mechanism**: Core AR has elevated contact height → hits above Circle Survivor Defense ring. Default Wing SAR obstructs contacts → poor stock. War Lion SAR: RS highly competitive, LS good-but-suboptimal. War Bear SAR (fixed): LS top-tier smash comparable to Square Edge. Screw Zeus SAR (fixed by Great Dragon): both RS and LS top-tier. Black version: Gold Plastic Syndrome (GPS) → brittle → never use.  
**Engine Note**: coreAR_g=3.9; total_g=5.4; I_core=2.09e-6; WingSAR_hurts; WarBear_LS_topTier; blackVersion_GPS.

---

### [Case 260 — Dark Wing AR: 6.4 g — Hyper-Aggro Three-Sided Thick Contact Ring; Maximum Offensive Power at High Recoil Cost](./4%20case%20study.md#case-260)

**System**: Plastics System (Gen 1, SG System, SGS)  
**Geometry**: 6.4 g (core 4.9 g + sub AR 1.5 g); I ≈ 3.8×10⁻⁶ kg·m²; 3-fold symmetric  
**Material**: ABS  
**Contact Points**: thick blade; smashFraction_RS = 0.56; recoilFactor = 0.52  
**Mechanism**: Three-sided thick contact ring: strong smash output (RS 0.56) but recoilFactor = 0.52 → significant recoil. Struggles against heavy, low-recoil defenses. Heavy Metal Core recommended to dampen self-destabilization. C-tier competitive: wins vs mid-defense, loses vs heavy defense. Best in hyper-aggressive formats.  
**Engine Note**: mass_g = 6.4; I=3.8e-6; smashRS=0.56; recoil=0.52; HMC required; CTier_hyper-aggro.

---

### [Case 261 — Wing Attack Ring: 6.1 g — Centripetally-Deployed Spring Wings; Zombie Spin-Steal AR with Indirect-Hit Fold Mechanism](./4%20case%20study.md#case-261)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: spring-loaded centrifugal wing deployment  
**Geometry**: 6.1 g; r_outer_deployed ≈ 3.4 cm; r_inner ≈ 1.3 cm; wings fold at low spin  
**Material**: ABS + spring hinges  
**Mechanism**: Wings deploy centrifugally at >300 RPM. Deployed: spin-steal grinding (spinStealFactor ≈ 0.12, recoilFactor ≈ 0.22). Indirect hits fold wings inward: recoilFactor_indirect ≈ 0.08 → absorbs attacks without destabilizing. Fragility: ~20% wing breakage vs heavy smash ARs (smashFraction > 0.55). Best in zombie + right-spin spin-steal sustained engagement.  
**Engine Note**: mass_g = 6.1; r_deployed=3.4cm; centrifugalDeploy; spinSteal=0.12; fragile_vs_heavySmash.

---

### [Case 262 — Corona Saber AR: 7.4 g — Combined Upper Attack + Smash via Wing-Tip Slopes; Heaviest Competitive Plastic Gen AR](./4%20case%20study.md#case-262)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 7.4 g; heaviest competitive plastics AR; wing-tip slope + angular edges  
**Material**: ABS  
**Contact Points**: wing tips: upper slope + angular edge → compound upper+smash; RS primary  
**Mechanism**: Heaviest competitive plastics AR at 7.4 g → maximum I contribution from AR position. Wing-tip slopes deliver upper attack component; angular edges add smash. Compound contact: both upper and smash in RS. Primary orientation RS. LS: geometry partially inverts → reduced effectiveness but still usable. High mass advantage for KO resistance.  
**Engine Note**: mass_g = 7.4; heaviestCompetitiveAR; compound_upper+smash; RS primary; highMass_I advantage.

---

### [Case 263 — Genocide Circle AR: 5.9 g — Inconsistent Contact Geometry; Wing Protrusions + Pole Extensions Produce Either Reasonable Smash or Zero Impact](./4%20case%20study.md#case-263)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5.9 g; wing protrusions + pole extensions  
**Material**: ABS  
**Contact Points**: wing vs pole: wing produces smash, pole produces zero impact  
**Mechanism**: Two contact geometry types on same AR: wing protrusions → reasonable smash angle. Pole extensions → contact passes through gap between poles → zero effective impact. Random collision angle determines whether wing or pole contacts → inconsistent performance. Either reasonable smash or zero impact per battle depending on engagement geometry.  
**Engine Note**: mass_g = 5.9; dualGeometry_wing+pole; inconsistent: wing=smash OR pole=zero.

---

### [Case 264 — Hammer Tusk AR: 4.7 g — Three-Sided Spiked Wing Grinding; Stamina Drain via Low-Recoil Spike Contact](./4%20case%20study.md#case-264)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.7 g; three spiked wings  
**Material**: ABS  
**Contact Points**: spiked wings at moderate contact angle → low-recoil grinding  
**Mechanism**: Three spiked wings at contact angle that produces grinding rather than sharp smash. Low-recoil spike contact: sustained grinding across opponent AR/WD → stamina drain mechanism (spin steal via friction). Not smash-focused. Three-fold contact frequency. Moderate I at 4.7 g. Stamina-drain archetype: effective against other stamina builds, less so vs defense.  
**Engine Note**: mass_g = 4.7; spikedWings; lowRecoilGrinding; staminaDrain_mechanism.

---

### [Case 265 — Jungle Shock AR: 4.1 g — Round Spiked AR with Alligator Head Protrusions; LS Competitive Smash; RS Passable but Inconsistent](./4%20case%20study.md#case-265)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.1 g; round spiked AR; alligator head protrusions  
**Material**: ABS  
**Contact Points**: LS: alligator heads → competitive smash in line with G Upper / Eight Spiker; RS: inconsistent  
**Mechanism**: Alligator head protrusions: in LS, head orientation provides competitive smash angle (in line with G Upper Case 221 and Eight Spiker Case 189). RS: same protrusions present inconsistent angle → passable but inconsistent, outclassed. 4.1 g light mass → limited I. LS primary usage.  
**Engine Note**: mass_g = 4.1; alligatorHeads; LS_competitive; RS_inconsistent_passable; lightMass.

---

### [Case 266 — Panther Claw AR: 4.5 g — Compact Wider Profile with Wing Gaps; RS Smash with Manageable Recoil, Low-Moderate Tier](./4%20case%20study.md#case-266)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.5 g; compact wider profile; wing gaps  
**Material**: ABS  
**Contact Points**: wing faces: RS smash; wing gaps reduce contact frequency  
**Mechanism**: Compact wider profile: outer radius slightly wider than standard compact WDs. Wing gaps: reduce contact surface area → lower contact frequency. RS smash: manageable recoil (moderate angle). Low-moderate tier: lighter than competitive smash benchmarks (Triple Wing, G Upper). Flash Leopard stock AR; competitive but not top-tier.  
**Engine Note**: mass_g = 4.5; compactWider; wingGaps_reduce_frequency; RS_manageable_recoil; lowModerTier.

---

### [Case 267 — Cross Dragon AR: 2.7 g — Lightest Confirmed Plastic Gen AR; Flat Faces, Excessive Recoil, No Competitive Role](./4%20case%20study.md#case-267)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 2.7 g; lightest confirmed plastics AR  
**Material**: ABS  
**Contact Points**: flat faces → excessive recoil from low mass  
**Mechanism**: Lightest confirmed plastics AR at 2.7 g: negligible I contribution. Flat faces: good smash angle theoretically (low α) but minimal mass means J_total at contact is tiny → no KO capability. Excessive recoil fraction because low mass means attacker suffers proportionally more from recoil impulse. No competitive role: weight deficit eliminates every archetype.  
**Engine Note**: mass_g = 2.7; lightestAR; flatFace_good angle_but_noMass; noCompetitiveRole.

---

### [Case 268 — Knight Claws Ring: 3.5 g — Fragile Thin AR with Severe Recoil; Design Intent Negated by Structural Failure Risk](./4%20case%20study.md#case-268)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 3.5 g; thin claw protrusions  
**Material**: ABS (brittle under stress)  
**Contact Points**: thin claws → concentration of force → structural failure  
**Mechanism**: Thin claw geometry: concentrated stress at claw tip under impact → fracture risk. Severe recoil: aggressive claw angle combined with thin construction → high recoil fraction. Design intent (aggressive smash claws) negated by structural failure risk. Even if geometry is favorable, breakage eliminates competitive viability after first few battles.  
**Engine Note**: mass_g = 3.5; thinClaws_fragile; severeRecoil; structuralFailure negates design.

---

### [Case 269 — Max Shield AR: 3.5 g — Flat-Face Non-Competitive AR; Identical Weight to Knight Claws Ring; Even Fewer Contact Points](./4%20case%20study.md#case-269)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 3.5 g; flat-face shield profile; fewer contact points  
**Material**: ABS  
**Mechanism**: Equal mass to Knight Claws Ring (Case 268) but fewer contact points → even lower contact frequency → attack even less viable. Flat face: same mass, same mass deficit problem — insufficient J at contact. Shield profile: intended for defense but 3.5 g too light for weight-based defense role. No competitive role in either attack or defense.  
**Engine Note**: mass_g = 3.5; flatFace; fewerContacts; insufficientMass all roles; nonCompetitive.

---

### [Case 270 — Revolver Attack WD: 15.0 g — Compact WD with Protruding Contact Points; Same Weight Class as Ten Balance; Non-Competitive Due to AR Recoil](./4%20case%20study.md#case-270)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 15.0 g; compact WD; protruding contact points  
**Material**: ABS  
**Mechanism**: 15.0 g compact WD: same weight class as Ten Balance but with protruding contact points. Protrusions generate recoil when WD contacts opponent (same failure as Heavy Attack WD tabs, Case 257 pattern). Non-competitive: same mass as Ten Balance with added recoil liability. Use Ten Balance or Ten Heavy instead.  
**Engine Note**: mass_g = 15.0; compactWD; protrusions_addRecoil; sameWeightAs_TenBalance; nonCompetitive.

---

### [Case 271 — Star Attack WD: 15.6 g — Five-Pointed Star Geometry; Uniquely Penta Wing-Aligned; Non-Competitive Outside That Configuration](./4%20case%20study.md#case-271)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 15.6 g; five-pointed star WD  
**Material**: ABS  
**Mechanism**: Five-pointed star: star tips at WD perimeter generate recoil on contact (Case 170 Star Attack AR pattern). 15.6 g: heavy, good mass. Uniquely aligns with Penta Wing SP and Star Attack AR (Cases 170, 172): tips slot into aligned geometry → contact geometry normalized. Non-competitive in all other configurations. One-combo niche: Penta Wing alignment build only.  
**Engine Note**: mass_g = 15.6; starGeometry_recoil; PentaWingAlignment_unique niche; nonCompetitive otherwise.

---

### [Case 272 — Metal Ball Base (Draciel Metal Ball Defenser): 8.4 g + up to 6×1.05 g balls — 4LS Built-In Right SG; Gimmick Non-Functional at Competition Speed](./4%20case%20study.md#case-272)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: ball-pocket gimmick (6 ball slots); built-in Right SG (4LS)  
**Geometry**: 8.4 g base + up to 6.3 g balls (6×1.05 g); Tornado Ridge  
**Material**: ABS + steel balls  
**Mechanism**: Built-in Right SG (4LS = 4-legged SG): compact ball base. Ball pockets: 6 slots for 1/4" steel balls → centrifugally extend at high spin for wider contact. At competition speed, balls don't fully extend (centrifugal force insufficient at typical launch RPM) → gimmick non-functional in competition. Tornado Ridge: passive grip during tilt. Passive Tornado Ridge defense is the only competitive function.  
**Engine Note**: base_g=8.4; ballPockets_nonFunctional_at_competitionRPM; TornadoRidge_passive; 4LS built-in.

---

### [Case 273 — War Lynx AR (Galux — UNRELEASED): ~6.65 g — Speed-Optimised War Lion Variant; 6.3% Lighter; Counter-Oriented Balanced Design](./4%20case%20study.md#case-273)

**System**: Plastics System (Gen 1, SG System) — Unreleased prototype  
**Geometry**: ~6.65 g (6.3% lighter than War Lion); counter-oriented design  
**Material**: ABS (unreleased)  
**Mechanism**: War Lynx: unreleased Galux prototype. Speed-optimised War Lion variant — 6.3% mass reduction → 6.3% higher orbital speed (same motor force, lighter load). Counter-oriented: some contact faces oriented for counter-attack (absorb then redirect). Balanced design reduces specialization. Never commercially released; academic study only.  
**Engine Note**: mass_g ≈ 6.65; unreleased; 6.3% lighter than WarLion → higher orbital speed; counterOriented.

---

### [Case 274 — Right Spin Gear (G Ball): 1.1 g shells + 0.88 g core + optional 0.448 g ball + optional 1.12 g gear — G Special Base Platform](./4%20case%20study.md#case-274)

**System**: Plastics System (Gen 1, SG System) — G-Series  
**Gimmick**: ball-weighted SG core; G Special Base retention  
**Geometry**: shells: 1.1 g each (2.2 g pair); core: 0.88 g; optional 3/16" ball: 0.448 g; optional Metal Weight Gear: 1.12 g  
**Material**: ABS + optional metal ball + optional gear  
**Mechanism**: Lightest possible SG configuration without optional parts (shells + core only). Ball in core pocket: centrifugal extension at high spin (same ball-gimmick principle as Case 276). Metal Weight Gear: +1.12 g at SG radius → modest I increase. Black version: fragile (GPS-equivalent in black plastic). G Special Base (Case 276) retention platform.  
**Engine Note**: shells=2.2g; core=0.88g; blackVersion_fragile; GSB_platform; ballGimmick_centrifugal.

---

### [Case 275 — Neo Right Spin Gear (South Magne Version): 2.3 g shells + 3.3 g Magnecore — Recoil-Managing Attack-Stamina Core; Negligible Magnetic Effect](./4%20case%20study.md#case-275)

**System**: Plastics System (Gen 1, SG System, Gaia Dragoon)  
**Geometry**: Neo shells: 1.15 g each (2.3 g pair); South Magnecore: 3.3 g; total SG: 5.6 g  
**Material**: ABS shells + magnet core  
**Mechanism**: South Magnecore (Case 916) in Neo SG shells. 5.6 g total SG: competitive mass for recoil management. Standard South Magnecore physics: 3.5% better recoil damping vs plastic core. Magnetic effect negligible in standard play (same conclusion as Cases 915, 916). Used in Gaia Dragoon stock combo.  
**Engine Note**: total_SG_g = 5.6; SouthMagnecore; recoilDamping = 3.5% vs plastic; magnet_negligible.

---

### [Case 276 — G Special Base (Gaia Dragoon): 4.6 g + up to 4×0.448 g balls — Four-Ball Pocket Gimmick; Aggressive Semi-Flat Tip; Poor LAD](./4%20case%20study.md#case-276)

**System**: Plastics System (Gen 1, SG System, G-Series)  
**Gimmick**: four ball-pocket centrifugal extension  
**Geometry**: 4.6 g base + up to 1.79 g balls (4×0.448 g); aggressive semi-flat tip; 4 ball pockets  
**Material**: ABS + optional steel balls  
**Mechanism**: Four ball pockets: 3/16" balls extend centrifugally at high spin → increase effective tip contact radius → shift from semi-flat to wider orbit. Aggressive semi-flat tip: μ ≈ 0.55, moderate attack movement. Poor LAD: ball pocket rim is interrupted → no smooth precession surface. Black version: fragile. Competitive range limited to high-spin attack phase.  
**Engine Note**: base_g=4.6; ballPockets×4; semiFlat_tip; poorLAD; blackVersion_fragile.

---

### [Case 277 — War Monkey SAR (Galman): 1.9 g — Dual-Winglet Sub-Ring with ~100° Coverage; Top-Tier LS SAR; RS Requires Wide Defense or Wider](./4%20case%20study.md#case-277)

**System**: Plastics System (Gen 1, SG System, SGS)  
**Geometry**: 1.9 g; dual winglets; ~100° coverage arc  
**Material**: ABS  
**Contact Points**: dual winglets ≈ 100° arc coverage; LS orientation favorable  
**Mechanism**: ~100° arc coverage per winglet pair: high contact zone exposure in LS. Top-tier LS SAR: favorable winglet angle provides excellent LS smash assist. RS: winglet backs present convex surface → requires Wide Defense WD or wider to prevent WD leading contact (Case 914/Panther Head range-ceiling pattern). Wide Defense exposes winglet contact in RS.  
**Engine Note**: mass_g = 1.9; 100deg_coverage; LS_topTier; RS_requiresWideDefense+.

---

### [Case 278 — War Bear SAR (Galzzly): 2.4 g — Free-Spinning Offensive Sub-Ring; Non-Functional Free-Spin; Fixed-Position LS = Top-Tier Smash; Fragile](./4%20case%20study.md#case-278)

**System**: Plastics System (Gen 1, SG System, SGS)  
**Gimmick**: intended free-spinning outer ring  
**Geometry**: 2.4 g; wide free-spin ring geometry  
**Material**: ABS  
**Mechanism**: Intended free-spin: ring design supposed to rotate independently. In practice: ring locks to fixed position → SAR is fixed, not free-spinning. Fixed-position LS: top-tier smash (comparable to Square Edge per Case 259 Great Dragon assessment). RS: fragile under heavy RS contacts → avoid RS use. Worn/loose versions: partially free-spin → reduced effectiveness. Fix in position before use.  
**Engine Note**: mass_g = 2.4; freeSpin_nonFunctional (locks); fixed_LS = topTier smash; RS_fragile.

---

### [Case 279 — Delta Wave AR (Orca Diver): 4.3 g — Three-Fold RS Smash with Limited Range and Above-Average Recoil; No LS Use; Contact Points Wear Quickly](./4%20case%20study.md#case-279)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.3 g; three-fold symmetric wave profile  
**Material**: ABS (contact surfaces wear quickly)  
**Contact Points**: RS wave face: limited contact range; above-average recoil  
**Mechanism**: Three-fold wave AR: RS smash functional but limited range (shorter reach than top-tier alternatives). Above-average recoil: wave geometry doesn't fully convert impulse laterally. LS: wave orientation reverses → non-viable contact. Contact point wear: wave tips wear faster than flat-face ARs → performance degrades with use.  
**Engine Note**: mass_g = 4.3; 3fold; RS_limitedRange; aboveAvgRecoil; LS_noUse; wear_quick.

---

### [Case 280 — Scissors Arm AR (Crab Diver): 4.6 g — Two-Fold Large Crab-Claw; LS Massive Power with Self-KO Recoil; RS Non-Viable; Best Non-CCL LS Smash AR](./4%20case%20study.md#case-280)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.6 g; two-fold; large crab-claw protrusions  
**Material**: ABS  
**Contact Points**: LS: claw faces → massive smash; RS: claw backs → non-viable  
**Mechanism**: Large crab-claw: in LS the claw interior face presents at favorable smash angle → massive smash power. Self-KO recoil: claw size means recoil fraction remains high despite smash power → attacker destabilized simultaneously. RS: claw backs → non-viable. Best non-Customise Clutch Launcher (CCL) LS smash AR — closest to CCL power without the launcher.  
**Engine Note**: mass_g = 4.6; 2fold; LS_massivePower + selfKOrecoil; RS_nonViable; bestNonCCL_LS.

---

### [Case 281 — Cross Gator AR: 4.0 g — 4-Fold Balance AR; Moderate RS and LS; Outclassed Both Directions](./4%20case%20study.md#case-281)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 4.0 g; 4-fold symmetric balance AR  
**Material**: ABS  
**Contact Points**: 4-fold balanced → moderate performance both directions  
**Mechanism**: Four-fold balanced AR: moderate smash and moderate recoil in both RS and LS. No spin-direction advantage. Balance design prevents top performance in either direction. 4.0 g: lightweight limits I. Outclassed by direction-specialized ARs in both RS and LS. General purpose but no competitive niche.  
**Engine Note**: mass_g = 4.0; 4fold_balanced; moderate_both; outclassed_both_directions.

---

### [Case 282 — Vanishing Moot AR (Anime/Manga Exclusive): ~3-fold Swept-Back Turbine Blades; RS Survival/LAD-Optimised; Magnacore Centering; Never Released](./4%20case%20study.md#case-282)

**System**: Plastics System (Gen 1, SG System) — Anime/Manga Exclusive  
**Geometry**: estimated AR with swept-back turbine blades; Magnacore centering feature  
**Material**: ABS (never commercially released)  
**Mechanism**: Swept-back turbine blade geometry: in RS orbital direction, blades present low-drag profile → minimizes AR-induced spin loss. LAD-optimised profile: smooth blade backs serve as LAD surface. Magnacore centering: magnetic centering feature keeps bey oriented toward stadium center. Anime-exclusive; never released commercially. Studied from anime/manga reference only.  
**Engine Note**: animeExclusive; sweptTurbine; RS_LAD_optimised; MagnacoreCentering; neverReleased.

---

### [Case 283 — Neo Cross Horn AR: 5.7 g — 3-Fold Dual-Direction Hyper-Aggressive Smash; Takara GPS Non-Competitive; Hasbro Version Competitive Both Directions](./4%20case%20study.md#case-283)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5.7 g; 3-fold symmetric horn AR  
**Material**: Takara: GPS (brittle) / Hasbro: standard ABS  
**Contact Points**: dual-direction horn faces → RS and LS competitive smash  
**Mechanism**: Three-fold horn AR with dual-direction contact faces → both RS and LS achieve competitive smash. Hyper-aggressive: high smash output but also high recoil. Takara version: GPS (Gold Plastic Syndrome) → brittle → non-competitive (breaks). Hasbro version: standard ABS → fully competitive both directions. Always use Hasbro version.  
**Engine Note**: mass_g = 5.7; 3fold; dual_direction; Takara_GPS_avoid; Hasbro_competitive_both.

---

### [Case 284 — Trident Vector AR: 5.4 g — 3-Fold High-Recoil Multiple Contact Points; RS Self-Destructive; LS Mediocre; Non-Competitive Both Directions](./4%20case%20study.md#case-284)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 5.4 g; 3-fold trident profile; multiple contact points  
**Material**: ABS  
**Contact Points**: multiple trident tines → variable angle, high combined recoil  
**Mechanism**: Trident profile: three tines per arm → multiple contact points per collision. RS: tine geometry self-destructive (high recoil overwhelms attack output). LS: mediocre tine contact angle. Multiple contact points increase total recoil accumulation without proportional smash increase. Non-competitive both directions.  
**Engine Note**: mass_g = 5.4; 3fold_trident; multipleContactPoints; RS_selfDestructive; LS_mediocre; nonCompetitive.

---

### [Case 285 — Mirage Goddess AR: 7.8 g — 3-Fold Heaviest Competitive AR; Top-Tier RS Smash; Top-Tier LS Weight-Based Defense + Spin-Steal Attack](./4%20case%20study.md#case-285)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: 7.8 g; 3-fold symmetric; heaviest competitive plastics AR  
**Material**: ABS  
**Contact Points**: RS: flat-face smash at optimal angle; LS: smooth deflection + spin-steal contact  
**Mechanism**: Heaviest competitive AR at 7.8 g → maximum I contribution from AR position → highest KO resistance. RS: flat-face contacts at top-tier smash angle. LS: geometry provides both weight-based defense (mass deflects attacks) and spin-steal attack (smooth face provides sustained grinding). Top-tier in all three LS roles simultaneously. Venus/Venusian G stock AR.  
**Engine Note**: mass_g = 7.8; heaviestCompetitiveAR; RS_topTierSmash; LS_topTier_weightDefense+spinSteal.

---

### [Case 1097 — CEW Metal Grip: 2.7 g](./4%20case%20study.md#case-1097)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Geometry**: 2.7 g; rubber grip CEW  
**Material**: rubber grip surface  
**Mechanism**: Rubber grip CEW: μ_rubber ≈ 0.85 → reliable grip on floor contact. Used with Right Engine Gear (Reverse) (Case 226) where reverse tip direction + rubber grip provides orbital control (one viable use case identified in Case 226). Grip provides flower-pattern capability but EG height system handicap applies. Best in Right EG Reverse configuration for orbital control.  
**Engine Note**: mass_g = 2.7; rubberGrip_mu=0.85; bestWith_REG_Reverse; EGheight_handicap.

---

### [Case 1281 — Attack Ring: Turtle Survivor (Master Dranzer)](./4%20case%20study.md#case-1281)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: Turtle Survivor AR; rounded turtle-shell profile  
**Material**: ABS  
**Mechanism**: Rounded turtle-shell profile: smooth deflection surface → low recoil on contact (tangential deflection). Shell geometry approaches compact defense — deflects rather than absorbs. Survival role: smooth surface aids LAD continuation. Competitive in survival/zombie builds. Not top-tier smash but low recoil allows sustained battle without spin loss spikes.  
**Engine Note**: TurtleSurvivor; roundedShell; smoothDeflection; lowRecoil; survival role.

---

### [Case 1282 — Blade Base: Metal Sting Base (Master Dranzer)](./4%20case%20study.md#case-1282)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: metal sting (very narrow) tip; minimal contact radius  
**Material**: ABS + metal sting tip  
**Mechanism**: Metal sting tip: contact radius → 0 → near-zero orbital speed (bey remains stationary). Zero orbital speed means attack behavior eliminated — bey only defends/spins in place. Best with stamina ARs for pure spin-time optimization. Eliminates every attack role (requires orbital speed). Anti-attack configuration tool.  
**Engine Note**: metalStingTip; r_contact→0; zeroOrbital; eliminatesAttack; pureStaminaRolePlatform.

---

### [Case 1283 — Blade Base: Flat Base](./4%20case%20study.md#case-1283)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: flat plastic tip; standard-height blade base  
**Material**: ABS  
**Mechanism**: Standard flat base configuration. Plastic flat tip: μ ≈ 0.35 → flower pattern difficult at competition orbital speeds (see Case 912 SG Flat Base for full analysis). Standard height. Outperformed by SG Flat Base (shorter) for upper attack and by rubber-tipped bases for aggressive attack. Use when no alternative available.  
**Engine Note**: plasticFlat_mu=0.35; standardHeight; outperformed by SG_FlatBase and rubber alternatives.

---

### [Case 1284 — Attack Ring: Bound Attack Ring](./4%20case%20study.md#case-1284)

**System**: Plastics System (Gen 1, SG System)  
**Gimmick**: rubber-edged bound mechanism  
**Geometry**: rubber edges at contact points  
**Material**: ABS + rubber edges  
**Contact Points**: rubber-edged contacts → e = 0.25 / μ_k = 0.50 (rubber restitution)  
**Mechanism**: Rubber edges provide two effects: high friction (μ_k ≈ 0.50 → spin-steal capability) and low restitution (e ≈ 0.25 → energy absorbed, not returned as recoil). Bound mechanism: rubber deforms on contact → stores energy → returns as secondary kick after primary hit. Spin-steal + secondary kick combined. Rubber wear: effectiveness decreases over matches.  
**Engine Note**: rubberEdges; e=0.25; mu_k=0.50; spinSteal+boundKick; rubberWear_degradation.

---

### [Case 1285 — Attack Ring: Ark Pyramid (Desert Sphinxer)](./4%20case%20study.md#case-1285)

**System**: Plastics System (Gen 1, SG System)  
**Geometry**: pyramid-shaped protrusions; moderate outer radius  
**Material**: ABS  
**Contact Points**: pyramid faces: angled smash faces + tip concentration  
**Mechanism**: Pyramid geometry: flat faces at smash angle → competitive smash component. Tip apex: stress concentration on opponent AR at contact point → local deformation or fracture risk (opponent's part). Moderate outer radius. Desert Sphinxer stock AR. Competitive in RS smash with pyramid face angle advantage.  
**Engine Note**: pyramidProtrusions; flatFace_smash + tipApex_concentration; DesertSphinxer_stock.

---

### [Case 1286 — Spin Gear: Right Engine Gear (Mystery Cutter) [Supplementary to Case 197]](./4%20case%20study.md#case-1286)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Mystery Cutter CEW cutting gimmick  
**Geometry**: EG shell accepting Mystery Cutter CEW; cutting blade CEW  
**Material**: ABS + cutting CEW  
**Mechanism**: Mystery Cutter CEW: blade-shaped cutting extension. On contact: blade attempts to sever opponent ring connections. In practice: blade geometry produces asymmetric contact → partial smash with rotation-dependent angle. Supplementary to Case 197 (Right EG Circle Defenser/Mystery Cutter shell). Mystery Cutter vs Circle Defenser: cutter provides attack bias; Circle Defenser provides LAD bias.  
**Engine Note**: MysteryCutter_CEW; bladeGeometry; attackBias vs CircleDefenser_LADbias; asymmetricContact.

---

### [Case 1287 — Blade Base: Final Clutch Base (Desert Sphinxer Version)](./4%20case%20study.md#case-1287)

**System**: Plastics System (Gen 1, SG System, EG/CEW)  
**Gimmick**: Final Clutch  
**Geometry**: Desert Sphinxer FCB version; mass and geometry optimized for weight-based defense  
**Material**: ABS  
**Mechanism**: Desert Sphinxer FCB version outclasses Dranzer GT version (Case 227) in weight-based defense role. Geometry: perimeter optimized for minimal recoil vs Dranzer GT's mode-change protrusions. FCB timing inversion problem persists (same as all FCBs) but weight-based defense role is less timing-sensitive. Best FCB for weight-based defense builds.  
**Engine Note**: DesertSphinxer_FCB; outclasses_DranzerGT in weightDefense; FCBtimingInverted persists.

---

### [Case 1288 — Assembled Beyblade Analysis: Darllanzer — Hydro-Siphon Tip Mechanism](./4%20case%20study.md#case-1288)

**System**: Plastics System (Gen 1, SG System) — assembled analysis  
**Gimmick**: hydro-siphon tip (water channeling through tip body)  
**Geometry**: full combo assembled; hydro-siphon tip channels water during wet-arena battles  
**Material**: ABS + hydro-siphon tip  
**Mechanism**: Hydro-siphon tip: tip body contains channels that draw water from wet arena surface into rotation path. Water mass centrifugally distributed → temporary I increase (water adds effective rotating mass). Water drainage rate determines duration of I boost. Gimmick only functional in wet-arena events (non-standard). Outside wet arena: tip acts as standard flat tip with drainage channels (slightly higher friction from channel edges).  
**Engine Note**: hydroSiphon; waterChanneling → temporaryI_boost; wetArena_only; dryArena = standardFlat.

---

## CS5 — Cases 286–296 + 951–1000 + 1089–1096 {#cs5}
Source: `5 case study.md`

---

### [Case 286 — 100 Track: Attack-Bracket Height Positioning and Vertical Impulse Geometry](./5%20case%20study.md#case-286)

**System**: Metal Fight Beyblade (MFB/HWS) — Track  
**Geometry**: 1.0 cm height (100 = 10.0 mm); shaft clears scrape threshold for full practical sliding shoot range  
**Material**: ABS  
**Mechanism**: 10 mm height provides floor-scrape clearance for sliding shoot launch tilt range. Wheel overhang compensates 1.5 mm undercut deficit vs Track 85. Contact bracket: wheel sits at height where it can contact opponents' wheels from below (upper attack) or level (smash). 1.0 g mass negligible I contribution.  
**Engine Note**: height = 1.0 cm; scrapeThreshold_cleared; wheelOverhang_compensates_1.5mm; attackBracket.

---

### [Case 287 — RSF (Rubber Semi-Flat) Bottom: Rubber Friction Geometry, Mold-Hardness Contact Area, and L-Spin Torque Reversal](./5%20case%20study.md#case-287)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: rubber semi-flat tip; contact area mold-dependent  
**Material**: rubber (varying hardness by mold)  
**Mechanism**: Rubber semi-flat: μ_rubber ≈ 0.85 → strong floor grip. Semi-flat profile: contact area intermediate between sharp (point) and flat (wide). Mold hardness variation: softer molds → more deformation → larger contact area → more grip. L-spin (left spin): torque reversal — rubber grip direction inverts → LS bey moves differently from RS. Must tune for spin direction.  
**Engine Note**: rubber; mu≈0.85; mold_hardness_affects_area; torqueReversal_LS.

---

### [Case 288 — Vulcan Metal Wheel: Two-Mold Mass Redistribution, Pseudo-Upper-Attack Slope Analysis, and Rubber-Tip Impulse Threshold](./5%20case%20study.md#case-288)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: two molds; mass redistribution between molds; pseudo-upper-attack slopes  
**Material**: zinc alloy metal wheel  
**Contact Points**: pseudo-upper slopes: partial upper-attack component; rubber tip dependency  
**Mechanism**: Two molds: M1 vs M2 mass redistribution changes effective contact height and smash angle slightly. Pseudo-upper-attack slopes: slope angle insufficient for true upper attack (partial component only). Rubber tip impulse threshold: Vulcan requires rubber tip to exceed the recoil threshold for ring-outs. Metal/plastic tips: insufficient impulse from pseudo-upper contact → no KO.  
**Engine Note**: twoMolds; pseudoUpper_partialSlope; rubberTip_required for KO impulse.

---

### [Case 289 — Flame Metal Wheel: Crown-Profile Track Exposure, Floor-Scrape Clearance Angle, and Stamina Decay Mechanics](./5%20case%20study.md#case-289)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: ~29.0 g; crown profile; track exposure geometry  
**Material**: zinc alloy metal wheel  
**Mechanism**: Crown profile: rim-concentrated mass at maximum outer radius → high I. Track exposure: crown geometry exposes track (145 or similar) contact zone. Floor-scrape clearance: crown height sets minimum track for safe launch tilt. Stamina decay: crown profile minimizes rim-stadium friction (smooth outer edge) → slow spin decay. Top-tier stamina wheel in MFB initial series.  
**Engine Note**: mass_g ≈ 29.0; crownProfile; highI_rimConcentrated; slow spinDecay; stamina_topTier.

---

### [Case 290 — Pegasis II Clear Wheel: 3.1 g](./5%20case%20study.md#case-290)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 3.1 g; clear wheel (Energy Ring equivalent in Hybrid Wheel System)  
**Material**: polycarbonate (PC)  
**Mechanism**: PC Energy Ring. 3.1 g: minor I contribution (~1–2% of combo). Primary function: launcher hook geometry and Fusion Wheel gap fill. PC material stiffness: contributes to wheel-gap resonance behavior. Pegasis II: second-generation Pegasis ring, slightly different launcher tab geometry vs Pegasis.  
**Engine Note**: mass_g = 3.1; PC_energyRing; launcherHookGeometry; gapFill; I_minor.

---

### [Case 291 — Galaxy Metal Wheel: 29.4 g](./5%20case%20study.md#case-291)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 29.4 g; metal Fusion Wheel  
**Material**: zinc alloy  
**Mechanism**: 29.4 g Galaxy wheel: three-wing compact geometry. Wings provide smash contacts. Not rim-concentrated: mass distributed through wing structure. Compact overall diameter: limits reach vs wider wheels. Mid-tier attack wheel: competitive smash but not best reach or mass for top-tier.  
**Engine Note**: mass_g = 29.4; threeWing; compactDiameter; midTier_attack.

---

### [Case 292 — Wing 105 Track / W105: 1.2 g](./5%20case%20study.md#case-292)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 1.05 cm height (10.5 mm); wing protrusions; 1.2 g  
**Material**: ABS  
**Mechanism**: Wing protrusions on track: create contact surfaces at track height. Wing contacts can deflect opponent tracks laterally — defensive function at track level. 1.05 cm height places track in moderate contact bracket. Wing protrusions also generate recoil if struck directly (similar to track-level contact problems). Niche: defensive track-contact builds.  
**Engine Note**: height = 1.05 cm; wingProtrusions; trackContact_defensive; recoil if struck.

---

### [Case 293 — R²F Bottom / Right Rubber Flat: 0.8 g](./5%20case%20study.md#case-293)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 0.8 g; wide rubber flat tip; right-spin optimized  
**Material**: rubber  
**Mechanism**: Wide rubber flat: μ ≈ 0.85, large contact area → maximum floor grip for right spin. Right-spin optimized: rubber flat generates maximum orbital velocity for RS attack builds. Flower pattern: reliable at competition orbital speeds. Top-tier RS attack tip. LS: torque reversal reduces effectiveness (same R²F principle inverted). Best RS attack tip in MFB attack builds.  
**Engine Note**: mass_g = 0.8; wideRubberFlat; mu≈0.85; RS_topTier_attack; LS_torqueReversal.

---

### [Case 294 — Ketos Clear Wheel: 2.5 g](./5%20case%20study.md#case-294)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 2.5 g; PC energy ring  
**Material**: polycarbonate  
**Mechanism**: 2.5 g PC energy ring. Lighter than average (avg ≈ 3 g) → slightly lower combo mass. Launcher hook geometry: Ketos-type tabs. Wheel gap fill function. I contribution minimal. Marginally lighter than Pegasis II Clear Wheel; use Ketos when minimizing combo mass is priority.  
**Engine Note**: mass_g = 2.5; PC_lightClearWheel; minimalI; launcherHook.

---

### [Case 295 — Grand Metal Wheel: 29.3 g](./5%20case%20study.md#case-295)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 29.3 g; metal Fusion Wheel  
**Material**: zinc alloy  
**Mechanism**: 29.3 g Grand wheel: near-circular defense profile. Smooth outer rim → low recoil on contact. Rim concentration: circular shape provides good I-per-gram. Near-circular outer shape: tangential deflection dominant → defense/stamina. Competitive defense/stamina wheel. Not top-tier attack.  
**Engine Note**: mass_g = 29.3; nearCircular; smoothRim_lowRecoil; defense/stamina.

---

### [Case 296 — Rubber Sharp / RS: 0.8 g](./5%20case%20study.md#case-296)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 0.8 g; rubber sharp tip; small contact area  
**Material**: rubber  
**Mechanism**: Rubber sharp: narrow rubber tip. μ_rubber ≈ 0.70–0.85 (hardness varies). Sharp shape: small contact area → lower friction than rubber flat (R²F) but higher than plastic sharp. Contact radius: ≈ 1–2 mm → moderate LAD capability. Provides grip without full rubber flat orbital speed → stamina/survival hybrid role. Spin-steal via rubber friction.  
**Engine Note**: mass_g = 0.8; rubberSharp; smallContact_moderateFriction; stamina/survival hybrid; spinSteal.

---

### [Case 951 — 4 Layer System: Four-Component Homogeneity as Physics Prerequisite for All Original Series Customisation](./5%20case%20study.md#case-951)

**System**: Plastics System architecture (Gen 1, 4LS) — system overview  
**Mechanism**: Four layers (AR + WD + BB + SG implicitly): each layer's stack position determines mechanical role. AR: contact geometry (top). WD: inertia and height. BB: tip and LAD. Homogeneity: all 4LS components must be from 4-layer architecture → no SG-system parts mix in. Absence of SG: tip and weight distribution must be solved within BB single body → limits stamina and gimmick options vs SG system.  
**Engine Note**: 4LS_architecture; stackPosition_determines_role; noSG_constrains_BBrole.

---

### [Case 952 — Spin Gear System: Fifth Layer Decouples Spin Direction from Blade Base Architecture](./5%20case%20study.md#case-952)

**System**: Plastics System architecture (Gen 1–2, SG System) — system overview  
**Mechanism**: SG (fifth layer between WD and BB): decouples spin direction from BB. Shell-and-core: shell = SG carrier; core = inner driver (bearings, magnets, EG). Enables bearing and engine gimmicks without changing BB. 4L blade bases mechanically incomplete in this system: 4L BB lacks SG receiver slot → cannot interface with SG gimmicks.  
**Engine Note**: SG_decouplesSpin; shell+core = modular; 4L_BBs_incomplete.

---

### [Case 953 — Magnacore System (NEO SG System): Separating Core from SG Shell Enables Stadium-Magnetic Coupling](./5%20case%20study.md#case-953)

**System**: Plastics System architecture (Gen 1–2, Magnacore variant) — system overview  
**Mechanism**: Magnacore: core separated from SG shell → core swappable without changing shell. Stadium magnetic coupling: Magnecore polarity (N/S) interacts with Magne Stadia magnets → augments attack (repulsion) or defense (attraction) depending on polarity. Six-layer structure (AR + WD + SG shell + Magnecore + BB + SG base) requires no new AR/WD architecture — pure core-swap upgrade.  
**Engine Note**: NEO_SG; Magnecore_swappable; stadiumMagnets_coupling; 6layer; no_new_AR_WD_needed.

---

### [Case 954 — Hard Metal System: 75% Linear Scale Reduction Produces Disproportionate Air-Drag Savings; Metal Frame–ABS Caul Concentrates Hardness at Contact Zone](./5%20case%20study.md#case-954)

**System**: Hard Metal System (HMS) — system overview  
**Mechanism**: 75% linear scale reduction (HMS beys ~75% of plastics dimensions). Air drag scales as A × v²: area ∝ r² → drag ∝ r² → 75% scale → 56% drag. Mass preserved → same inertia but 56% drag → disproportionate spin retention improvement. Metal frame + ABS caul: metal at contact zone (hardness where needed) + ABS main body (mass savings). RC consolidates SG into running core → breaks prior-system compatibility.  
**Engine Note**: 75%_scale; drag = 56%; metalFrame_ABS_caul; RC_consolidates_SG; incompatible with 4L/SG.

---

### [Case 955 — Metal System (MFB Initial Series): Discrete Track Layer Decouples Contact-Height from Contact-Geometry Tuning; All-Metal Wheel Changes Impulse Budget](./5%20case%20study.md#case-955)

**System**: Metal Fight Beyblade (MFB) initial system — system overview  
**Mechanism**: Separate Track layer: contact height tunable independently of wheel (contact geometry). Prior systems: wheel height and geometry coupled. All-metal wheel: higher stiffness → higher e (restitution) → more elastic collision → different impulse budget vs ABS ARs. Bottom three classes (sharp/flat/rubber) directly from friction-velocity phase diagram. Track 85/90/100/105 create discrete height brackets.  
**Engine Note**: separateTrack → decouples height from geometry; allMetal_wheel; 3bottom_classes from frictionPhase.

---

### [Case 956 — Engine Gear System: Clutch BB Determines Spring Energy Entry; Turbo 4× Power; Reverse EG Spin Budget; Gyro EG Bearing LAD](./5%20case%20study.md#case-956)

**System**: Plastics System (EG System) — system architecture  
**Mechanism**: EG system: spring stores energy at launch → clutch BB determines when released. First Clutch: deceleration-trigger. Final Clutch: minimum-spin-trigger. Turbo EG: 4× spring release power via spring architecture differences. Reverse EG: trades spin budget for one high-impulse event (spring fires reverse → one controlled counter). Gyro EG: merges spring launch with bearing LAD in single housing.  
**Engine Note**: clutchBB_determines_entry; Turbo=4x; Reverse=spinBudget_tradeoff; Gyro=spring+bearingLAD.

---

### [Case 957 — Hybrid Wheel System: PC Energy Ring + Metal Fusion Wheel Split Relocates Mass Control to Fusion Wheel](./5%20case%20study.md#case-957)

**System**: Metal Fight Beyblade (MFB/HWS) — system architecture  
**Mechanism**: MFB split: original single metal wheel → PC Energy Ring + Metal Fusion Wheel. Fusion Wheel: carries nearly all mass (I_total dominated by FW). Energy Ring: PC → minor I. PC material: launcher hook geometry only (no meaningful I). Five-layer stack: physically identical to Metal System except single wheel-split. Mass distribution control: entirely in Fusion Wheel design (Energy Ring negligible).  
**Engine Note**: FW_dominates_I; ER_PC_launcherHookOnly; 5layer = MetalSystem + oneSplit.

---

### [Case 958 — 4D System: PC Frame + Metal Frame + Core Enables Mode Changes; F:D Merges Track and Tip](./5%20case%20study.md#case-958)

**System**: Metal Fight Beyblade (4D System) — system architecture  
**Mechanism**: Fusion Wheel subdivided: PC Frame + Metal Frame + Core → in-part mode changes possible (reorder components). Final Drive (F:D): combines track + tip into one speed-dependent tip-transition unit. Four "D" variables: Different Material (PC+Metal+Core) + Divided Wheel (three-part FW) + Dynamic Drive (F:D) + Deep Custom (four FW components combinable). Each variable independent physics axis.  
**Engine Note**: PCFrame+MetalFrame+Core; modeChange via reorder; FD_merges_track+tip; 4D_4variables.

---

### [Case 959 — Burst System (Base Structure): Three-Layer Stack Forces Disc to Carry All Flywheel Function; Spring-Ratchet Burst Converts Impulse to Two-Point Win](./5%20case%20study.md#case-959)

**System**: Beyblade Burst (Gen 3) — system architecture  
**Mechanism**: Three layers (Blade/Layer + Disc + Driver): disc must carry all flywheel function (no separate track/WD distinction). Spring-ratchet burst: contact impulse → spring compresses → ratchet clicks → burst (scattered parts = 2-point win). Standardized driver height: eliminates height-mismatch exploit of all prior systems. Disc mass and radius determine combo inertia; blade provides contact geometry only.  
**Engine Note**: 3layer: Blade+Disc+Driver; disc_flywheel; springRatchet_burst = 2pts; standardDriverHeight.

---

### [Case 960 — Burst Subsystems (Takara Tomy): Each Generation Changes One Physics Axis; Cho-Z Metal-Insert Shifts Burst Balance; DB High/Low Mode Is Contact-Height Selector](./5%20case%20study.md#case-960)

**System**: Beyblade Burst variants (Cho-Z, GT, DB, BU, X) — system architecture  
**Mechanism**: Each TT generation changes exactly one axis of burst physics framework. Cho-Z: metal inserts in layer → higher layer I + contact stiffness → burst balance shifts toward attack. Three-part layers: chip swapping without full layer replacement. DB High/Low mode: part reorder changes contact height (High=Armor-top/taller; Low=DBCore-top/stable — see DB/BU High vs Low Mode memory note). X: new launcher + disc/driver naming.  
**Engine Note**: eachGen_oneAxis; ChoZ_metalInsert; 3partLayer_chipSwap; DB_highLow = contactHeightSelector.

---

### [Case 961 — CobaltDrake 4-60F: 38 g Blade Exceeds Contemporaries by 3 g; Upward-Slanting Contacts Decompose to Lateral + Vertical; Flat Bit Rail Couples Xtreme Line](./5%20case%20study.md#case-961)

**System**: Beyblade X (BX) — Layer/Disc/Driver  
**Geometry**: 38 g blade; 4-disc; 60 track; Flat bit  
**Material**: metal/PC composite blade  
**Contact Points**: upward-slanting faces → J decomposes to lateral smash + destabilizing vertical  
**Mechanism**: 38 g blade: +3 g over contemporaries → higher I + harder hits. Upward-slanting contacts: lateral smash component + vertical destabilizing component. Flat bit: rail coupling to Xtreme Line converts rotational energy to directed translational velocity → attack orbital movement enhanced. Combo total I increases per-collision smash and KO capability.  
**Engine Note**: blade_g=38; 4disc; 60track; FlatBit_XtremeLine_coupling; verticalComponent_destabilizes.

---

### [Case 962 — DranBuster 1-60A (Unique Line): Single Off-Axis Protrusion Concentrates All Contact Mass at One Angular Position; 1-Protrusion Ratchet Imbalance Creates Eccentric Orbit](./5%20case%20study.md#case-962)

**System**: Beyblade X (BX)  
**Geometry**: 1-disc; 60 track; Accel bit  
**Mechanism**: Single off-axis protrusion: all contact mass concentrated at one angular position → single high-impulse event per revolution (maximum J per contact). 1-protrusion ratchet imbalance: blade orbits eccentrically → controlled eccentric orbit (OWD = orbital wobble direction). 16 Accel gears increase Xtreme Dash exit speed at direct spin-energy cost (gear friction loss).  
**Engine Note**: 1disc; 60track; AccelBit; singleProtrusion_maxJ; eccentricOrbit; 16AccelGears_tradeoff.

---

### [Case 963 — DranBrave S6-60V (Custom Line): Lock Chip + Main Blade + Assist Blade Introduces Secondary Contact; Brave Tall Upper-Attack Trades Bite for Height; Vortex Screw-Pump Force](./5%20case%20study.md#case-963)

**System**: Beyblade X (BX)  
**Geometry**: S6 blade (chip+main+assist); 60 track; Vortex bit  
**Mechanism**: Three-part blade: Lock Chip (burst resistance) + Main Blade + Assist Blade (secondary contact surface). Brave: smooth tall upper-attack blades trade bite (sharp contact = high J) for height (contacts upper band of opponent blade). Reduced effective impulse from lower bite. Vortex bit: rightward-spiral spikes generate screw-pump lateral force → increases Xtreme Line coupling speed.  
**Engine Note**: S6_3partBlade; tall_upper_lowerBite; VortexBit_screwPump → XtremeLine coupling.

---

### [Case 964 — Track 85: 0.86 g — Minimum-Height Track Enables Wheel-Underside Contact Against Taller Opponents](./5%20case%20study.md#case-964)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 0.86 g; 8.5 mm height  
**Material**: ABS  
**Mechanism**: Minimum height track: 8.5 mm → wheel sits lowest possible → can contact underside of taller opponents' wheels (upper attack geometry). Floor-scrape threshold: 8.5 mm shaft cuts threshold below sliding shoot tilt envelope → moderate scrape risk at extreme launch angles. Boost Disk 145 and 230 structurally close the low-track attack window against those specific opponents.  
**Engine Note**: height = 0.85 cm; minimum; upperContact vs taller; floorScrape_risk at extreme angles.

---

### [Case 965 — Track 90: 0.9 g — 0.5 mm Height Increase Over 85 Raises Scrape Threshold by 1.4° Into Safer Window](./5%20case%20study.md#case-965)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 0.9 g; 9.0 mm height  
**Material**: ABS  
**Mechanism**: 0.5 mm taller than 85: scrape threshold increases by 1.4° (arctan(0.5/tip_radius)). Retains 92% of CoM-lowering benefit of 85. Deciding factor: marginally safer launch angle window vs T85 while maintaining near-equivalent attack bracket. Choose 90 when scraping with 85 is problematic at full sliding shoot angle.  
**Engine Note**: height = 0.9 cm; 1.4deg_safer vs T85; 92%_CoM_benefit; marginalSafetyAdvantage.

---

### [Case 966 — Track 100: 1.0 g — 10 mm Shaft Clears Scrape Threshold for Full Practical Sliding Shoot Range](./5%20case%20study.md#case-966)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 1.0 g; 10.0 mm height  
**Material**: ABS  
**Mechanism**: 10 mm height clears floor-scrape threshold for the full practical sliding shoot angle range. Wheel overhang compensates 1.5 mm undercut deficit relative to T85. Standard attack bracket height. Most widely used attack track — adequate height without excessive elevation. Reference height for contact zone analysis.  
**Engine Note**: height = 1.0 cm; scrapeThreshold_cleared; wheelOverhang compensates 1.5mm; standardAttack.

---

### [Case 967 — Track 105: 1.0 g — Identical Mass to 100 With 0.5 mm More Height; No Practical Advantage](./5%20case%20study.md#case-967)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 1.0 g; 10.5 mm height  
**Material**: ABS  
**Mechanism**: 0.5 mm taller than T100 at identical mass. 0.5 mm extra height: elevates wheel contact zone slightly above T100 range → marginally worsens all attack metrics (higher contact misses lower-wheel opponents). No practical advantage over T100. Last-resort-only: use T100 whenever available.  
**Engine Note**: height = 1.05 cm; same mass as T100; marginallyWorseAttack; last_resort_only.

---

### [Case 968 — AD145 (Armor Defense 145): 2.8 g — Funnel-Shaped Track Top-Tier Stamina Despite Failing Defense Role; BD145 Supersedes for Defense](./5%20case%20study.md#case-968)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 2.8 g; 14.5 mm height; funnel-shaped with outward weight distribution  
**Material**: ABS  
**Mechanism**: Funnel shape with outward weight at 38 mm max width: I_track = 2.8 g × r² → significant I contribution. Weight distributed outward → best I-per-gram among tracks → top-tier stamina. Named defensive role: funnel deflects downward → doesn't protect wheel → defense fails. BD145 structurally supersedes for defense. AD145 retains stamina niche due to outward mass distribution.  
**Engine Note**: height=1.45cm; mass=2.8g; r_outer=1.9cm; I_contribution_topTier; stamina niche; BD145_defense.

---

### [Case 969 — DF145 (Down Force 145): 1.5 g — Four Wings Cannot Generate Meaningful Downforce at Beyblade Spin Rates; Outclassed](./5%20case%20study.md#case-969)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 1.5 g; height_cm: 1.45; cylinder r_body ≈ 0.7 cm; 4 fins protruding upward from the TOP of the cylinder (z_base: 1.45 cm, z_top: ~1.75 cm); fins have a downward pitch angle (tiltAngle_deg: −12) — blades slant so their tips point downward, creating "downforce" airflow when spinning; fin span r_inner: 0.5 cm → r_outer: 1.0 cm; arcWidth: ~20° each; foldSymmetry: 4  
**Material**: ABS  
**Mechanism**: Downforce = ½ × ρ × v² × A × C_L. At beyblade RPM v_wing ≈ 1–3 m/s → downforce ≈ 10⁻³ N (0.021% of gravitational normal force — negligible). Fins slant at −12° pitch (tips down) to push air downward when bey spins, but aerodynamic forces are orders of magnitude below gravity at these speeds. Track outclassed in stamina (I ≈ 1.2×10⁻⁷ kg·m², vs AD145 at 4.73×10⁻⁷) and irrelevant in defense or attack. No competitive role.  
**Engine Note**: height=1.45cm; mass=1.5g; cylinder: fixed; WingDef: {count:4, spacingDeg:90, shape:"rectangle", r_inner_cm:0.5, r_outer_cm:1.0, z_base_cm:1.45, z_top_cm:1.75, arcWidth_deg:20, tiltAngle_deg:−12, movementType:"fixed"}; NO mechanic derived — downforce_negligible at game RPMs; I=1.2e-7 kg·m²; foldSymmetry:4.

---

### [Case 970 — SW145 (Switch 145): 4.2 g — Reversing Wings Changes Contact Face From Smash to Deflection; 4.2 g Highest Track I; Rigid Wings Cap Defense](./5%20case%20study.md#case-970)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 4.2 g; 14.5 mm height; three wings at 38 mm max width; two orientations  
**Material**: ABS  
**Mechanism**: Mode switch: reverse three wings → attack mode: wings forward → smash-initiating contact face. Defense mode: wings backward → deflection-optimized face. 4.2 g at r_max = 1.9 cm → highest track-level I in 145-height class. Rigid wing attachment (not free-spin): full contact impulse transmitted → irremovable recoil → structurally caps defensive ceiling. Best I contribution of any track.  
**Engine Note**: height=1.45cm; mass=4.2g; highestTrack_I; modeSwitch; rigidWings_recoil caps defense.

---

### [Case 971 — WD145 (Wide Defense 145): 3.6 g — Fixed Wings Transmit Full Impulse Unlike ED145; Radial Gap Creates Mechanical Trap; Trap-Coupling Produces Large Mutual Spin Drain](./5%20case%20study.md#case-971)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 3.6 g; 14.5 mm height; wide wing-flange design  
**Material**: ABS  
**Mechanism**: Fixed wings (not free-spin unlike ED145): full contact impulse transmitted. Radial gap between wheel outer edge and wing outer edge: mechanical trap — attacker protrusions can lock into gap. Trap-coupling event: both beyblades momentarily linked → large mutual spin drain. High risk for attacker (lost spin). Defensive track: wide flange aids LAD via large precession radius.  
**Engine Note**: height=1.45cm; mass=3.6g; fixedWings_fullImpulse; mechanicalTrap_in_radialGap; LAD_widePrecessionRadius.

---

### [Case 972 — E230 (Elevator 230): 7.4 g — Gravity-Driven Free-Sliding Disk Acts as Passive Speed Governor on Zero-G Stadium Walls](./5%20case%20study.md#case-972)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 7.4 g; 23.0 mm height; free-sliding disk (gravity-driven, non-rotating)  
**Material**: ABS  
**Mechanism**: Free-sliding disk: gravity pulls disk down to one of two positions (Normal or Boost mode, 2 mm difference). Cannot rotate independently. On Zero-G stadium walls: disk acts as passive speed governor — inertial lag as bey climbs wall produces restoring torque that stabilizes during wall climb. 7.4 g at h=2.3 cm: significant mass at track → I contribution. Contact geometry changes 2 mm between Normal and Boost disk position.  
**Engine Note**: height=2.3cm; mass=7.4g; freeSlidingDisk_nonRotating; wallClimb_governor; 2mm_modeSwitch.

---

### [Case 973 — SP230 (Spike 230): ~4.8 g](./5%20case%20study.md#case-973)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: ~4.8 g (estimated); 23.0 mm height; spike protrusions  
**Material**: ABS  
**Mechanism**: 23 mm spike track. Spikes at track perimeter: contact stadium wall during wall-climb precession → generate friction drag on wall contact (slows orbital speed). On Zero-G stadiums: spikes grip wall → increases wall-ride stability but reduces speed. Very tall height (2.3 cm) → lower opponent contact probability vs standard wheels. Niche: Zero-G wall-ride builds.  
**Engine Note**: height=2.3cm; mass_est≈4.8g; spikePerimeter; wallGrip_on_ZeroG; tallHeight_lowers_contact.

---

### [Case 974 — F230 (Free 230): 4.6 g](./5%20case%20study.md#case-974)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 4.6 g; 23.0 mm height; free-spinning disk extension  
**Material**: ABS  
**Mechanism**: Free-spinning disk at 2.3 cm height: disk rotates independently of track body. Impact on disk: disk spins up → impulse partially absorbed (spin-up energy stored) → less recoil to combo. Passive impact absorption: different from E230's gravity-sliding. Free-spin decouples contact impulse from main body. Tall height for Zero-G builds.  
**Engine Note**: height=2.3cm; mass=4.6g; freeSpinDisk; impulseAbsorption; ZeroG_niche.

---

### [Case 975 — TB (Twin Ball): ~unrecorded weight](./5%20case%20study.md#case-975)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: twin ball contact geometry; weight unrecorded  
**Material**: ABS + twin ball  
**Mechanism**: Two contact balls in bottom: similar to single metal ball (Case 248) but dual → wider contact base → more stable orbital precession. Ball radius still limits tip-friction to μ_ball ≈ 0.35. Twin configuration provides symmetry vs single ball. Moderate stamina, moderate attack. Niche between pure sharp (stamina) and flat (attack).  
**Engine Note**: twinBall; mu_ball≈0.35; stable_precession; moderate niche.

---

### [Case 976 — Storm Metal Wheel: ~28.5 g](./5%20case%20study.md#case-976)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: ~28.5 g; metal Fusion Wheel; two-wing design  
**Material**: zinc alloy  
**Contact Points**: two wing smash faces; RS primary  
**Mechanism**: Two large wings: aggressive smash contacts at high-radius position. ~28.5 g: competitive mass for wing-based attack. Wing angle: smash-optimized → high lateral impulse per hit. RS primary attack wheel. Paired with R²F or RF for top-tier RS attack combos. Classic MFB attack wheel.  
**Engine Note**: mass_g≈28.5; twoWing; smash_RSPrimary; RF/R²F_paired.

---

### [Case 977 — Rock Metal Wheel: ~28.0 g](./5%20case%20study.md#case-977)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: ~28.0 g; compact circular wheel  
**Material**: zinc alloy  
**Mechanism**: Compact near-circular wheel: smooth outer profile → low recoil. ~28.0 g at compact radius: I_rock lower than rim-concentrated wheels of same mass. Defense/balance role: smooth profile deflects. Does not reach top-tier in stamina (not rim-concentrated) or attack (compact, limited reach). General-purpose mid-tier.  
**Engine Note**: mass_g≈28.0; compact_circular; smoothProfile; defense/balance; midTier.

---

### [Case 978 — Lightning Metal Wheel (L-Drago): ~28.0 g](./5%20case%20study.md#case-978)

**System**: MFB (Metal Fight Beyblade) — Left Spin  
**Geometry**: ~28.0 g; left-spin specific design; three rubber sliders  
**Material**: zinc alloy + rubber sliders  
**Contact Points**: rubber sliders (left-spin smash contacts); spin-steal friction  
**Mechanism**: Left-spin specific wheel with rubber slider contacts. Rubber sliders: μ_rubber provides spin-steal and friction-based smash in LS. Geometry optimized for LS orbital attack. RS use: geometry inverts → non-viable for attack. Only competitive LS attack metal wheel in initial MFB series. L-Drago bey stock wheel.  
**Engine Note**: mass_g≈28.0; LS_specific; rubberSliders; spinSteal+friction_smash; RS_nonViable.

---

### [Case 979 — Flame Metal Wheel: ~29.0 g](./5%20case%20study.md#case-979)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: ~29.0 g; crown profile; rim-concentrated mass  
**Material**: zinc alloy  
**Mechanism**: Crown profile: see Case 289 (duplicate wheel entry with different analysis focus). Rim concentration → high I for stamina. Smooth outer rim → minimal friction loss. Top-tier stamina wheel in initial MFB series alongside Earth (Case 998). Case 289 covers track exposure; this entry covers wheel mass properties.  
**Engine Note**: mass_g≈29.0; crownRim; I_topTier; stamina; same part as Case289 different focus.

---

### [Case 980 — Burn Metal Wheel: ~29.5 g](./5%20case%20study.md#case-980)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: ~29.5 g; smooth wide-rim wheel  
**Material**: zinc alloy  
**Mechanism**: Wide smooth rim: rim-concentrated at large radius → high I. ~29.5 g: good mass for stamina. Smooth circular profile: tangential deflection → near-zero recoil. Stamina/defense hybrid wheel. Less I per gram than Earth (heavier, same distribution) but competitive. Paired with WD/SD bottom for stamina builds.  
**Engine Note**: mass_g≈29.5; wideRim; I_competitive; stamina/defense.

---

### [Case 981 — Earth Metal Wheel: ~30.0 g](./5%20case%20study.md#case-981)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: ~30.0 g; near-circular; minimal-gap outer rim; two molds  
**Material**: zinc alloy  
**Mechanism**: Near-circular with minimal outer gap: best recoil absorption in MFB (smooth tangential contact). ~30.0 g: heaviest standard wheel → highest I. Two-mold structural evolution: later mold reduces structural weakness in outer rim. Top-tier defense and stamina. Earth+WD145+WD = iconic stamina combo. See also Case 998 for detailed analysis.  
**Engine Note**: mass_g≈30.0; nearCircular_minimalGap; I_highest; bestRecoilAbsorption; defense+stamina.

---

### [Case 982 — L Drago Metal Wheel: 32 g](./5%20case%20study.md#case-982)

**System**: MFB (Metal Fight Beyblade) — Left Spin  
**Geometry**: 32 g; left-spin design; three-blade structure  
**Material**: zinc alloy  
**Contact Points**: three LS attack blades; RS contacts non-competitive  
**Mechanism**: 32 g: heavier than standard (~28–30 g) → higher I + harder hits. Three-blade LS structure: LS attack-optimized. Higher mass than L-Lightning → more KO force per hit. RS: blade backs present recoil geometry → non-competitive. Top-tier LS attack wheel in MFB.  
**Engine Note**: mass_g=32; 3blade; LS_topTier_attack; RS_nonCompetitive; higherMass than L-Lightning.

---

### [Case 983 — Leone Metal Wheel: 38.0 g — r_outer = 2.179 cm, h = 8.97 mm](./5%20case%20study.md#case-983)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 38.0 g; r_outer = 2.179 cm; h = 0.897 cm; annular design  
**Material**: zinc alloy  
**Mechanism**: 38.0 g: very heavy metal wheel. r_outer = 2.179 cm, h = 0.897 cm. Annular geometry: I = ½ × m × (r_outer² + r_inner²). High mass + large radius → very high I. Heavy wheel → maximum stamina and KO resistance. Defense role: high mass absorbs hits without significant Δω. Contact: smooth outer rim → low recoil. Top-tier defense/stamina.  
**Engine Note**: mass_g=38.0; r_outer=2.179cm; h=0.897cm; veryHighI; defense/stamina_topTier.

---

### [Case 984 — Libra Metal Wheel: 40.5 g (three molds)](./5%20case%20study.md#case-984)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 40.5 g; heaviest standard MFB metal wheel; three molds  
**Material**: zinc alloy (three mold variants)  
**Mechanism**: 40.5 g: heaviest standard MFB metal wheel → highest possible I in class. Three molds: mass varies slightly between molds (all around 40.5 g — verify specific copy). Near-circular profile: low recoil. Maximum KO resistance and maximum stamina. Defense benchmark in MFB.  
**Engine Note**: mass_g=40.5; heaviestMFB; 3molds; I_maximum; defense+stamina benchmark.

---

### [Case 985 — Pegasis Metal Wheel: 36.0 g — r_outer ≈ 2.220 cm, h = 12.16 mm](./5%20case%20study.md#case-985)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 36.0 g; r_outer ≈ 2.220 cm; h = 1.216 cm; three-wing design  
**Material**: zinc alloy  
**Contact Points**: three wing faces; smash contacts  
**Mechanism**: 36.0 g three-wing wheel. h = 1.216 cm provides good contact height bracket. r_outer = 2.220 cm: competitive reach. Three wings: smash contacts at outer radius. RS primary. Attack role: 36.0 g mass + three-wing smash. I higher than Storm/Galaxy due to mass advantage. Mid-tier between pure attack and pure defense.  
**Engine Note**: mass_g=36.0; r_outer=2.220cm; h=1.216cm; threeWing; RS_attack.

---

### [Case 986 — Pisces Metal Wheel: 35.4 g](./5%20case%20study.md#case-986)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 35.4 g; two-wing design  
**Material**: zinc alloy  
**Contact Points**: two-wing smash faces  
**Mechanism**: 35.4 g two-wing wheel. Heavy for attack → maximum impulse per hit. Two wings: lower contact frequency than three-wing but higher impulse concentration per contact. RS attack role. High mass → good KO potential vs defense-heavy combos. Not as rim-concentrated as defense wheels.  
**Engine Note**: mass_g=35.4; twoWing; highMass_attack; lowerFreq_higherImpulse vs threeWing.

---

### [Case 987 — Sagittario Metal Wheel: ~31 g](./5%20case%20study.md#case-987)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: ~31 g (estimated); arrow-head profile contacts  
**Material**: zinc alloy  
**Contact Points**: arrow-head faces; dual smash + upper component  
**Mechanism**: ~31 g estimated. Arrow-head profile: dual contact geometry — flat smash face + slight upward slope (upper component). Moderate mass. RS primary. Mid-tier in both attack and stamina. Not specialized enough for top-tier in either direction.  
**Engine Note**: mass_g_est≈31; arrowHead_dual; RS_attack; midTier.

---

### [Case 988 — Virgo Metal Wheel: 37.0 g](./5%20case%20study.md#case-988)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 37.0 g; smooth curved design  
**Material**: zinc alloy  
**Mechanism**: 37.0 g: heavy wheel. Smooth curved outer rim: tangential deflection → low recoil. High mass + smooth rim → defense/stamina role. I contribution high due to mass. Competitive defense alongside Leone and Libra. Not top-tier in attack (smooth profile limits smash concentration).  
**Engine Note**: mass_g=37.0; smoothCurved; defense/stamina; I_high; notAttack.

---

### [Case 989 — Leone Clear Wheel: 3.0 g](./5%20case%20study.md#case-989)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 3.0 g; PC clear wheel  
**Material**: polycarbonate  
**Mechanism**: Standard PC energy ring. 3.0 g. Leone-design tabs for launcher. Gap fill for Leone metal wheel. Minimal I contribution. No mechanical function beyond launcher interface and gap fill.  
**Engine Note**: mass_g=3.0; PC; launcherTabs; gapFill; I_negligible.

---

### [Case 990 — Nemesis 4D Clear Wheel: 3.23 g](./5%20case%20study.md#case-990)

**System**: MFB (4D System)  
**Geometry**: 3.23 g; PC clear wheel for 4D system  
**Material**: polycarbonate  
**Mechanism**: 4D system energy ring. 3.23 g slightly heavier than standard rings. 4D-specific geometry: designed around 4D Fusion Wheel three-piece design. Launcher tab interface for 4D beys. Slightly higher I contribution from 3.23 g vs standard 3.0 g rings.  
**Engine Note**: mass_g=3.23; PC; 4D_compatible; slightlyHeavier; I_slightly above standard.

---

### [Case 991 — VariAres 4D Metal Wheel: Centrifugal PC Frame Retraction and Three-Wing Smash Geometry](./5%20case%20study.md#case-991)

**System**: MFB (4D System)  
**Geometry**: 4D composite wheel (PC Frame + Metal Frame + Core); three-wing design  
**Material**: PC frame + zinc alloy metal frame  
**Gimmick**: centrifugal PC frame retraction  
**Mechanism**: Centrifugal retraction: at high spin, PC Frame retracts inward → changes effective wheel radius and contact geometry. Three-wing smash geometry: effective in retracted mode (high spin) for attack. At low spin, frame extends → changes contact profile. Mode-change via RPM threshold. Top-tier 4D attack wheel when PC frame behavior managed.  
**Engine Note**: PCframe_centrifugalRetract; threeWing_smash; modeChangeByRPM; topTier4D_attack.

---

### [Case 992 — D:D (Delta Drive) Bottom: Three-Tip Manual Mode Selector and CoM Height Gradient](./5%20case%20study.md#case-992)

**System**: MFB (4D System) — Bottom  
**Geometry**: three-tip configuration; manual mode selector; CoM height changes with mode  
**Material**: ABS + metal tips  
**Gimmick**: manual three-position mode selector (attack/stamina/defense)  
**Mechanism**: Three tips selectable: attack tip (rubber/flat), stamina tip (sharp), defense (rubber ball or wide flat). Manual selection before battle. CoM height gradient: each tip positions combo CoM differently → tilt stability changes per mode. Not centrifugal (unlike F:D): user selects deliberately. Provides genuine mode flexibility without gimmick uncertainty.  
**Engine Note**: 3tipManual; COMheight varies by mode; deliberateSelection; noGimmickUncertainty.

---

### [Case 993 — Horogium Clear Wheel: Clock-Motif Asymmetry and Gear-Tooth Perimeter Air Drag](./5%20case%20study.md#case-993)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: clock-motif design; gear-tooth perimeter  
**Material**: polycarbonate  
**Mechanism**: Asymmetric clock motif: slight mass asymmetry → minor imbalance force during spin. Gear-tooth perimeter: aero drag from gear teeth at outer radius → additional spin decay during high-speed phases (unlike smooth rings). Decorative function primary; gear teeth are a passive stamina penalty. Note for game: gear teeth add aerodrag_coefficient to spin decay rate at high RPM.  
**Engine Note**: asymmetric; gearTeethPerimeter → aeroDrag penalty; stamina_decayFaster vs smooth rings.

---

### [Case 994 — Basalt Metal Wheel: Maximum-Weight Annular Defense and Spiral Staircase of Death Imbalance](./5%20case%20study.md#case-994)

**System**: MFB (Metal Fight Beyblade) — 4D era  
**Geometry**: maximum weight annular wheel; spiral staircase geometry on underside  
**Material**: zinc alloy (very high mass)  
**Mechanism**: Maximum-weight annular design: highest mass in MFB class → maximum I → maximum KO resistance. Smooth annular outer rim → near-zero recoil (defense dominant). Spiral staircase underside: known "Spiral Staircase of Death" imbalance — microscopic mass distribution irregularity causes wobble resonance at specific spin rates. Competitive despite imbalance due to overwhelming mass advantage.  
**Engine Note**: maxWeight; annularDefense; I_maximum; spiralStaircase_imbalance at specific RPM.

---

### [Case 995 — 145 Track: Height-Limited Tilt Angle and Precession Amplitude](./5%20case%20study.md#case-995)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: standard 14.5 mm height track; widely used  
**Material**: ABS  
**Mechanism**: 14.5 mm height: standard track height. Tilt angle at contact → precession amplitude scales with height (higher = more precession arm during tilt). 145 height: balanced — not too low (track scrape), not too high (contact zone mismatch with 85/100 tracks). Reference track for most stamina/defense builds. I contribution: minimal (T145 ≈ 1.0–1.2 g).  
**Engine Note**: height=1.45cm; standardHeight; precessionAmp_balanced; I_minimal; referenceForBuilds.

---

### [Case 996 — WD (Wide Defense) Bottom: Annular Contact Geometry and Large-Angle Precession](./5%20case%20study.md#case-996)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: wide annular rubber ring contact; large precession radius  
**Material**: rubber + ABS  
**Mechanism**: Wide annular rubber ring: contact area wide → multiple contact points at outer rim → stable during flower precession. Large precession radius: ω_LAD_min = √(μ×g/r_WD) → large r_WD lowers LAD threshold → very late spin-out. Spin decay: rubber drag slightly higher than sharp but annular contact stable. Top-tier stamina/LAD bottom.  
**Engine Note**: wideRubberRing; r_WD_large → LAD_threshold_low; stableFlower; topTier_stamina/LAD.

---

### [Case 997 — Aquila Clear Wheel: Two-Fold Wing Symmetry, Principal Moment Anisotropy, and Earth-Fit Geometry](./5%20case%20study.md#case-997)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 2-fold symmetric wing design; fits Earth metal wheel  
**Material**: polycarbonate  
**Mechanism**: Two-fold wing symmetry: principal moments of inertia anisotropic (I_xx ≠ I_yy) → minor wobble tendency at specific resonance. Earth-fit geometry: wings align with Earth wheel gaps → coherent surface (no protrusion gap). PC wings: minor mass but add aerodynamic effect at outer radius. Aquila chosen over other rings for Earth stamina builds for gap-fill geometry.  
**Engine Note**: 2fold; anisotropicI_minor_wobble; EarthWheel_fit; gapFill.

---

### [Case 998 — Earth Metal Wheel: Minimal-Gap Near-Circular Defense and Two-Mold Structural Evolution](./5%20case%20study.md#case-998)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: ~30.0 g; near-circular; minimal wheel-to-ring gap  
**Material**: zinc alloy  
**Mechanism**: Near-circular outer rim: minimal gap between wheel and energy ring → smooth outer surface → most elastic contact (lowest e for wheel → maximum recoil absorption). Two-mold: early mold has structural stress concentration at outer rim (fracture risk under repeated heavy attack); late mold reinforces. Top-tier defense + stamina. See also Case 981.  
**Engine Note**: mass_g≈30.0; nearCircular_minimalGap; twoMold_structuralReinforce; defense+stamina.

---

### [Case 999 — Unicorno II 4D Clear Wheel: Iron-Powder Density Augmentation and Three-Fold Inertial Isotropy](./5%20case%20study.md#case-999)

**System**: MFB (4D System)  
**Geometry**: 4D energy ring; iron-powder density augmentation; three-fold symmetric  
**Material**: iron-powder composite PC  
**Mechanism**: Iron-powder embedded in PC → increases density → higher ring mass vs standard PC. Three-fold symmetry: I_xx = I_yy = I_zz (inertial isotropy) → no preferred wobble direction → more stable precession. Higher mass from iron powder: slightly better I contribution than standard ring. Used in 4D Unicorno II for maximum ring-mass contribution.  
**Engine Note**: ironPowderPC; higherDensity; 3fold_inertialIsotropy; stablePrecession; I_above_standard.

---

### [Case 1000 — Blitz 4D Metal Wheel: Two-Piece Composite Inertia, Mode-Dependent Wing Geometry, and Slope-Bump Contact Profile](./5%20case%20study.md#case-1000)

**System**: MFB (4D System)  
**Geometry**: 4D two-piece wheel; mode-dependent wing geometry; slope-bump contacts  
**Material**: metal frame + core  
**Gimmick**: two pieces enable mode switch via rotation  
**Mechanism**: Two-piece 4D wheel: Metal Core rotates relative to Metal Frame → switches between wing configurations. Slope-bump contacts: each wing face has both a slope (upper attack component) and a bump (smash component) → dual contact per wing. Mode A: wings aligned for smash-dominant. Mode B: wings rotated for deflection. Composite I: both pieces contribute.  
**Engine Note**: twopiece; modeSwitch via rotation; slopeBump_dual contact per wing; compositeI.

---

### [Case 1089 — Upper Dragon AR (Dragoon MF): ~19 g — Most Aggressive Plastic Caul Produces Tier-2 Attack; GFC Ultimate Mode Unlocks Throughput Ceiling](./5%20case%20study.md#case-1089)

**System**: Hard Metal System (HMS)  
**Geometry**: ~19 g; metal frame + plastic caul AR; aggressive caul geometry  
**Material**: metal frame + ABS caul  
**Contact Points**: aggressive caul geometry; RS upper attack primary  
**Mechanism**: HMS composite AR (metal frame + plastic caul). Most aggressive plastic caul design: steep upper-attack angle. ~19 g (heaviest HMS combo component). Tier-2 attack output: aggressive geometry produces recoil along with upper attack. Non-uniform 3-mass distribution limits stamina viability. GFC Ultimate Mode (specific RC configuration): unlocks throughput ceiling → top-tier possible.  
**Engine Note**: mass_g≈19; HMS_metalFrame+caul; aggressiveCaul; tier2 standard; GFCUltimate unlocks.

---

### [Case 1090 — CWD Chain Attacker (Dragoon MF): ~17 g — Distributed Chain-Link Protrusions; Spin-Steal Niche Only; Functionally Neutral Most Archetypes](./5%20case%20study.md#case-1090)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g; chain-link protrusion profile  
**Material**: metal  
**Mechanism**: Chain-link protrusions distributed around circumference: non-committal contact geometry — neither optimal smash angle nor optimal LAD surface. Spin-steal niche: chain-link texture provides sustained grinding friction → equalization. Functionally neutral across most archetypes (not bad, not great). CWD (Counter Weight Disk) adds I at CWD radius.  
**Engine Note**: mass_g≈17; chainLinkProtrusions; spinSteal_niche; functionallyNeutral_most.

---

### [Case 1091 — CWD Eternal Survivor (Dragoon MF): ~17 g — Gear-Like Protrusions at Oversized Diameter Absorb Attack; Fixed-Rotation Solid Foundation; Diameter Excess Is Single Limiting Factor](./5%20case%20study.md#case-1091)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g; gear-like protrusions; oversized diameter  
**Material**: metal  
**Mechanism**: Gear-like protrusions at oversized diameter: protrusion tips absorb impact (stress concentration deforms tip slightly → elastic energy storage → partial return). Fixed-rotation (non-free-spinning): solid foundation vs free-spinning CWDs. Oversized diameter: CWD protrudes past RC → limits effectiveness in some matchups. Diameter excess = single competitive cap.  
**Engine Note**: mass_g≈17; gearProtrusions_absorb; fixedRotation_stable; oversizedDiameter = limitingFactor.

---

### [Case 1092 — Metal Weight Grip Core (Dragoon MF): ~3 g — Heavier Rubber RC Smaller Tip Trades Orbital Speed for Consistency; Speed Deficit Disqualifies Outside Big Three Attack ARs](./5%20case%20study.md#case-1092)

**System**: Hard Metal System (HMS) — Running Core  
**Geometry**: ~3 g; rubber RC tip; smaller tip diameter vs standard grip  
**Material**: ABS + rubber tip  
**Mechanism**: Heavier rubber RC at ~3 g (heavier than other HMS cores). Smaller tip diameter: lower orbital speed (narrower contact → less floor friction drive). Consistency advantage: smaller tip → more predictable flower pattern path. Speed deficit disqualifies it outside the Big Three Attack ARs (where it provides consistent recoil management without speed requirement). Niche: consistent attack timing.  
**Engine Note**: mass_g≈3; rubberRC_smallerTip; lowerSpeed_moreConsistent; BigThreeAR_only.

---

### [Case 1093 — Smash Phoenix AR (Dranzer MF): ~18 g — Conservative Phoenix Geometry Excess Recoil for Stamina, Insufficient Smash for Attack; LS Defense Only Viable Role](./5%20case%20study.md#case-1093)

**System**: Hard Metal System (HMS)  
**Geometry**: ~18 g; phoenix motif AR; conservative contact geometry  
**Material**: metal frame + ABS caul  
**Mechanism**: Conservative phoenix geometry: contact angle intermediate — neither steep enough for top-tier smash nor shallow enough for stamina. Too much recoil for stamina role (recoil disrupts LAD). Insufficient smash fraction for attack role (conservative angle reduces impulse). Uneven metal frame distribution: mass not rim-concentrated → limited stamina I. LS defense: the only viable competitive role.  
**Engine Note**: mass_g≈18; conservative_intermediate_angle; tooMuchRecoil_stamina; insufficientSmash_attack; LS_defense viable.

---

### [Case 1094 — CWD Wing Attacker (Dranzer MF): ~17 g — Large Free-Spinning Wings Beyond AR Diameter; Easy Destabilisation Vector; Liability All Competitive Contexts](./5%20case%20study.md#case-1094)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g; large free-spinning wings extending beyond AR diameter  
**Material**: metal  
**Mechanism**: Free-spinning wings extend beyond AR: opponent contacts wing first → wing spins up → impulse absorbed (similar to Case 919/Dragon Breaker SAR). BUT: large radius creates long moment arm → any asymmetric contact torques the CWD → CWD wobble transmitted to combo → destabilization. Easy destabilisation vector for opponents. Net: liability in all competitive contexts.  
**Engine Note**: mass_g≈17; freespinWings_beyondAR; longMomentArm → wobble; destabilisationVector; liability.

---

### [Case 1095 — CWD Reverse Defenser (Dranzer MF): ~17 g — Functionally Identical to CWD God Ring; Defense and Zombie Role at Potentially Lower Cost](./5%20case%20study.md#case-1095)

**System**: Hard Metal System (HMS)  
**Geometry**: ~17 g; smooth defensive CWD  
**Material**: metal  
**Mechanism**: Functionally identical to CWD God Ring (same defense/zombie role, same geometry class). Obscure alternative: less well-known → potentially available at lower secondary market cost. Smooth perimeter: low recoil on contact. Zombie role: smooth CWD aids LAD precession. If CWD God Ring unavailable: direct substitute. No physics distinction.  
**Engine Note**: mass_g≈17; functionallyIdentical_CWDGodRing; defense+zombie; lowerCost alternative.

---

### [Case 1096 — Free Shaft Core (Dranzer MF): ~3 g — Early-Precession-Prone Compact RC Cannot Compete Against Bearing Core; High-RPM Flat Launch Is Only Recovery](./5%20case%20study.md#case-1096)

**System**: Hard Metal System (HMS) — Running Core  
**Geometry**: ~3 g; free-shaft design (non-bearing); compact RC  
**Material**: ABS  
**Spin Coupling**: free-shaft (non-bearing) → higher friction than Bearing Core  
**Mechanism**: Free-shaft (non-bearing) RC: higher friction than Bearing Core → faster spin decay. Early precession onset: compact RC provides less tilt resistance → nutation starts sooner. Cannot compete with Bearing Core for stamina — Bearing Core is strictly superior in zombie/stamina roles. High-RPM flat launch recovery: at max launch spin, free-shaft still competitive briefly — window closes after first significant spin decay. Niche: attack builds where shaft-friction management is secondary.  
**Engine Note**: mass_g≈3; freeShaft_nonBearing; earlyPrecession; BearingCore_superior; highRPM_flatLaunch_only.

---

## CS6 — Cases 297–353 + 1041–1063 {#cs6}
Source: `6 case study.md`

---

### [Case 297 — Rubber Flat / RF: 0.8 g](./6%20case%20study.md#case-297)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.8 g; r_tip = 0.2775 cm; h_tip = 0.797 cm; full h = 1.109 cm; housing r = 0.791 cm; annular ring contact when new  
**Material**: rubber tip + ABS housing  
**Mechanism**: New tip: central indentation → annular ring contact (r_inner ≈ 0.2 cm, r_outer = 0.2775 cm) → localized high pressure. Worn tip: full disk contact → smoother friction distribution → controllable attack. Locked-tip molds (SonoKong, Hasbro): full angular velocity transferred → maximum traction. Free-spinning TT mold: tip decoupled → ~50% traction reduction. Top-tier RS attack tip (locked mold).  
**Engine Note**: mass_g=0.8; r_tip=0.2775cm; lockedMold=topTier; freeSpin=50%reduction; worn_moreControllable.

---

### [Case 298 — Move 145 / M145: 4.2 g, 14.5 mm height](./6%20case%20study.md#case-298)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 4.2 g; 14.5 mm height; movable wing protrusions (spring-loaded)  
**Material**: ABS + spring  
**Gimmick**: spring-loaded moving wings  
**Mechanism**: Spring-loaded wings move under centrifugal force: at high spin wings extend outward (attack/defense mode). Wings retract at low spin. 4.2 g: good I contribution for a track. Moving wings can contact opponents → recoil at contact. Net: like SW145 (Case 970) but with spring-loaded motion rather than manual switch. Competitive for same I-contribution reason as SW145.  
**Engine Note**: mass_g=4.2; height=1.45cm; springWings; centrifugalExtension; I_same_as_SW145.

---

### [Case 299 — Quake / Q Bottom: 0.6 g (second mold)](./6%20case%20study.md#case-299)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.6 g; irregular quake tip geometry; second mold  
**Material**: ABS  
**Mechanism**: Irregular tip geometry: produces erratic non-smooth movement (quake-like). Not a fixed orbital path — random perturbations at contact. Second mold: slightly different geometry from first mold. Niche: destabilization builds where unpredictable movement is advantageous. Not competitive in standard attack/stamina/defense. Movement unpredictability can confuse opponents but unreliable.  
**Engine Note**: mass_g=0.6; irregularTip; erraticMovement; secondMold; niche_destabilize.

---

### [Case 300 — Death 4D Metal Wheel: 43.6 g](./6%20case%20study.md#case-300)

**System**: MFB (4D System)  
**Geometry**: 43.6 g; 4D composite wheel  
**Material**: metal frame + PC core  
**Mechanism**: 43.6 g: very heavy 4D wheel. High mass → maximum I → maximum KO resistance and stamina. 4D structure: PC core + metal frame configuration. Death wheel profile: defense-optimized outer rim. Pairs with BD145 for full defensive setup. One of the heaviest 4D wheels alongside Flash (45.6 g) and Fusion (44.0 g).  
**Engine Note**: mass_g=43.6; 4D; veryHighI; defense_stamina; heavyClass.

---

### [Case 301 — Rubber Defense Flat / RDF: 1.1 g](./6%20case%20study.md#case-301)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 1.1 g; wide rubber flat with defense-oriented outer rim  
**Material**: rubber + ABS  
**Mechanism**: Wider rubber flat than RF: wider contact area → more stable orbital path but lower peak speed. Outer rim designed for defense: when tilted, outer rim contacts floor → LAD assist (similar to WD bottom principle). Dual role: attack via rubber grip (flower pattern) + LAD assist at tilt. Good alternative to RF in builds needing both attack and survival.  
**Engine Note**: mass_g=1.1; wideRubberFlat; outerRim_LAD; dualRole_attack+LAD.

---

### [Case 302 — Eternal Wide Defense / EWD: 1.2 g](./6%20case%20study.md#case-302)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 1.2 g; wide rubber ring + free-spinning outer shell  
**Material**: rubber + ABS free-spin shell  
**Spin Coupling**: free-spinning outer shell → contact impulse not transmitted to inner body  
**Mechanism**: Free-spinning outer rubber ring: when opponent contacts EWD rim, rim rotates freely → impulse not transferred to combo → no spin drain. Wide rubber ring: large r → low LAD threshold (ω_LAD_min = √(μ×g/r)). Top-tier defense/stamina bottom: EWD combines free-spin defense with wide-rim LAD. Rivals WD bottom for stamina; superior in defense role.  
**Engine Note**: mass_g=1.2; freeSpinShell; wideRubberRing; LAD_topTier; impulse_notTransferred.

---

### [Case 303 — Upper Wing 145 / UW145: 3.6 g](./6%20case%20study.md#case-303)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 3.6 g; 14.5 mm height; upward wing geometry  
**Material**: ABS  
**Mechanism**: Upper wings angled upward: when contacted, wings deflect opponent's contact upward → upper-attack-like deflection from a track. 3.6 g: good I contribution at track position. Wings provide peripheral mass + upper-deflect on contact. Competitive stamina track (same mass class as AD145 but less mass concentration). Niche: upper-defense builds.  
**Engine Note**: mass_g=3.6; height=1.45cm; upwardWings; upperDeflect; I_competitive.

---

### [Case 304 — Fusion 4D Metal Wheel: 44.0 g](./6%20case%20study.md#case-304)

**System**: MFB (4D System)  
**Geometry**: 44.0 g; 4D composite  
**Material**: metal frame + PC core  
**Mechanism**: 44.0 g: among heaviest 4D wheels. Fusion profile: near-circular outer rim for defense. Heavy mass → very high I → maximum defense/stamina. 4D structure allows PC core mode changes. Defense-oriented with maximum I.  
**Engine Note**: mass_g=44.0; 4D; nearCircular; I_maximum; defense.

---

### [Case 305 — Kerbecs Clear Wheel: 3.3 g](./6%20case%20study.md#case-305)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 3.3 g; PC clear wheel; three-head Cerberus motif  
**Material**: polycarbonate  
**Mechanism**: 3.3 g PC ring. Three-head Cerberus motif: three protrusions. Slight mass above average (3.3 vs 3.0 g standard). Launcher tab geometry. Pairs with Hell or Kerbecs/BD145 defense combo. I contribution minor.  
**Engine Note**: mass_g=3.3; PC; 3head_motif; slightlyAboveAvgMass; launcherTabs.

---

### [Case 306 — Hell Metal Wheel: 39.6 g](./6%20case%20study.md#case-306)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 39.6 g; metal wheel; smooth annular design  
**Material**: zinc alloy  
**Mechanism**: 39.6 g near-circular design: very high I. Smooth outer profile → near-zero recoil. Defense benchmark alongside Libra and Basalt. Hell + Kerbecs + BD145 + EWD (or similar): top-tier defense combo. Mass advantage ensures KO resistance and stamina.  
**Engine Note**: mass_g=39.6; nearCircular; I_veryHigh; defense benchmark; Hell+BD145_combo.

---

### [Case 307 — Boost Disk 145 / BD145: 8.0 g](./6%20case%20study.md#case-307)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 8.0 g; 14.5 mm height; wide flange disk at track level  
**Material**: ABS  
**Mechanism**: 8.0 g at 14.5 mm height: highest mass of any standard track. Wide flange: extremely wide outer radius → I_BD145 = 8.0 × r_flange² (largest track I). Defense function: wide flange blocks lower-track attackers (T85/T90/T100 attack combos cannot reach wheel below BD145 flange — flange intercepts). Structurally closes low-track attack window vs T85 (Case 964). Best defensive track I contribution.  
**Engine Note**: mass_g=8.0; height=1.45cm; widestFlange; I_highest_track; closesLowTrackWindow.

---

### [Case 308 — Lightning Metal Wheel: 30.0 g](./6%20case%20study.md#case-308)

**System**: MFB (Metal Fight Beyblade) — Left Spin  
**Geometry**: 30.0 g; LS wheel  
**Material**: zinc alloy  
**Mechanism**: Left-spin Lightning variant (different from Case 978 which covers initial L-Lightning ~28.0 g). 30.0 g: heavier revision. LS attack contacts improved vs earlier version. Rubber elements still provide spin-steal. RS non-viable. Top-tier LS attack wheel in later MFB series (heavier mass revision).  
**Engine Note**: mass_g=30.0; LS_specific; heavierRevision_vs_Case978; LS_topTier_attack.

---

### [Case 309 — Flash 4D Metal Wheel: 45.6 g](./6%20case%20study.md#case-309)

**System**: MFB (4D System)  
**Geometry**: 45.6 g; 4D wheel; flash/lightning protrusions  
**Material**: metal frame + PC  
**Mechanism**: 45.6 g: one of heaviest 4D wheels. Flash protrusions: lightning-bolt-shaped contacts add smash component alongside defense mass. 4D: PC frame mode. Very high I from mass. Smash contacts from protrusions: attack-capable despite high mass → hybrid attack/defense. Top-tier in both roles due to mass + smash geometry.  
**Engine Note**: mass_g=45.6; 4D; lightningProtrusions_smash; veryHighI; attack/defense hybrid.

---

### [Case 310 — Chrome Wheel: Phoenic: 29.8 g](./6%20case%20study.md#case-310)

**System**: MFB (Synchrome / Zero-G System) — Chrome Wheel  
**Geometry**: 29.8 g; chrome wheel; phoenix motif  
**Material**: zinc alloy  
**Mechanism**: Synchrome system Chrome Wheel. 29.8 g: standard mass for chrome wheel. Phoenix motif contacts: moderate smash + upper component (similar to standard phoenix AR logic). Synchrome system allows two chrome wheels to be paired on one beyblade (Synchrome combo = 2× chrome wheel mass). Phoenic in Synchrome: one of the components.  
**Engine Note**: mass_g=29.8; ChromeWheel; phoenixContacts; Synchrome_compatible.

---

### [Case 311 — Chrome Wheel: Gargole: 29.5 g](./6%20case%20study.md#case-311)

**System**: MFB (Synchrome / Zero-G System)  
**Geometry**: 29.5 g; chrome wheel; gargoyle wing design  
**Material**: zinc alloy  
**Mechanism**: 29.5 g gargoyle-wing chrome wheel. Wing geometry: smash contacts. Synchrome-compatible. Paired in Synchrome for dual-wheel mass. Wing design provides moderate attack capability in Zero-G environment.  
**Engine Note**: mass_g=29.5; ChromeWheel; wingContacts; Synchrome_compatible.

---

### [Case 312 — Track: Switch Attack 165 / SA165: 6.18 g](./6%20case%20study.md#case-312)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 6.18 g; 16.5 mm height; switchable wing attack geometry  
**Material**: ABS  
**Gimmick**: switch mechanism changes wing orientation  
**Mechanism**: 6.18 g at 16.5 mm height: very high mass for a track. Switch mechanism: wings alternate between attack and defense orientation (similar to SW145 but taller). 16.5 mm height: above standard 145 → contact zone elevated. Attack mode: wings extend for smash contacts. Defense: wings retract. High I contribution from 6.18 g mass.  
**Engine Note**: mass_g=6.18; height=1.65cm; switchWings; I_veryHigh; above145_height.

---

### [Case 313 — Chrome Wheel: Genbull: 30.8 g](./6%20case%20study.md#case-313)

**System**: MFB (Synchrome / Zero-G System)  
**Geometry**: 30.8 g; chrome wheel; bull/taurus motif  
**Material**: zinc alloy  
**Mechanism**: 30.8 g: heavier chrome wheel. Bull motif contacts. Synchrome-compatible. Heavier than average chrome wheels → better I contribution per wheel in Synchrome combo. Defense/stamina preferred.  
**Engine Note**: mass_g=30.8; ChromeWheel; bullMotif; heavier_average; Synchrome_preferred.

---

### [Case 314 — Track: Stamina Ring 200 / SR200: 3.3 g](./6%20case%20study.md#case-314)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 3.3 g; 20.0 mm height; ring-shaped track  
**Material**: ABS  
**Mechanism**: 20 mm height: tall track for Zero-G/wall-climb stadiums. Ring shape: smooth outer ring at 2.0 cm height → contact zone primarily at ring. 3.3 g at large ring radius: decent I contribution. Stamina role: smooth ring minimizes aerodrag and friction contact. Tall height in Zero-G builds maintains ring contact with stadium wall during precession.  
**Engine Note**: mass_g=3.3; height=2.0cm; smoothRing; I_decent; ZeroG_stamina.

---

### [Case 315 — Track: Left Wing 105 / LW105: ~1.1 g](./6%20case%20study.md#case-315)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: ~1.1 g; 10.5 mm height; left-spin oriented wings  
**Material**: ABS  
**Mechanism**: Wing geometry optimized for LS orbital movement: wings angled for LS direction. Provides slight orbital guidance in LS (wings generate asymmetric airflow in LS orbit). Small effect at beyblade speeds but aligns with LS attack builds. Height = 1.05 cm: same bracket as W105 but LS-specific. Minor functional difference from standard W105.  
**Engine Note**: mass_g≈1.1; height=1.05cm; LSwing_oriented; minorOrbitalGuidance_LS.

---

### [Case 316 — Chrome Wheel: Dragooon: 30.90/~29.0 g light mold](./6%20case%20study.md#case-316)

**System**: MFB (Synchrome / Zero-G System)  
**Geometry**: 30.90 g (heavy mold) / ~29.0 g (light mold); chrome wheel  
**Material**: zinc alloy  
**Mechanism**: Two molds: heavy (30.90 g) and light (~29.0 g). Heavy mold: better I for defense/stamina. Light mold: faster orbital speed if used in attack role (lower mass). Dragooon chrome wheel: rounded profile contacts. Synchrome builds prefer heavy mold.  
**Engine Note**: heavyMold=30.90g; lightMold≈29.0g; ChromeWheel; Synchrome_heavy preferred.

---

### [Case 317 — Chrome Wheel: Bahamdia: 29.35 g](./6%20case%20study.md#case-317)

**System**: MFB (Synchrome / Zero-G System)  
**Geometry**: 29.35 g; chrome wheel; sea-creature motif  
**Material**: zinc alloy  
**Mechanism**: 29.35 g standard chrome wheel mass. Sea-creature motif contacts. Synchrome-compatible. Standard attack/defense balance in Zero-G environment.  
**Engine Note**: mass_g=29.35; ChromeWheel; Synchrome_compatible; standard.

---

### [Case 318 — Bottom: Giga Flat / GF: 0.74 g](./6%20case%20study.md#case-318)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.74 g; large flat ABS tip  
**Material**: ABS  
**Mechanism**: Large flat ABS tip: μ ≈ 0.35 (plastic). Wide contact area → stable orbital movement at low friction. Better speed/stability than RF (lower friction) but no flower pattern reliability. Zero-G attacks: large flat enables fast linear movement in wall-ride stadiums. Not top-tier attack (no rubber grip) but better control than standard Flat for large-diameter stadium floors.  
**Engine Note**: mass_g=0.74; largeFlatABS; mu≈0.35; stableOrbit_lowFriction; ZeroG_linear.

---

### [Case 319 — Chrome Wheel: Revizer: 30.6 g](./6%20case%20study.md#case-319)

**System**: MFB (Synchrome / Zero-G System)  
**Geometry**: 30.6 g; chrome wheel  
**Material**: zinc alloy  
**Mechanism**: 30.6 g heavier chrome wheel. Revizer contacts: strong smash geometry. Top-tier offensive chrome wheel for Synchrome attack builds. Competitive attack with solid mass.  
**Engine Note**: mass_g=30.6; ChromeWheel; strongSmash; Synchrome_attack.

---

### [Case 320 — Crystal Wheel: Guardian: 4.1 g](./6%20case%20study.md#case-320)

**System**: MFB (Synchrome / Zero-G System) — Crystal Wheel  
**Geometry**: 4.1 g; PC crystal wheel  
**Material**: polycarbonate  
**Mechanism**: PC crystal wheel (energy ring equivalent in Zero-G/Synchrome system). 4.1 g: heavier than standard MFB energy rings. PC contributes minor I. Guardian motif. Launcher tab geometry. I contribution from higher mass (4.1 vs 3.0 g standard).  
**Engine Note**: mass_g=4.1; PC_CrystalWheel; heavier_standard; launcherTabs; I_slightly_above.

---

### [Case 1041 — Metal Wheel: Mercury: 29.0 g](./6%20case%20study.md#case-1041)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 29.0 g; mercury-themed wheel  
**Material**: zinc alloy  
**Mechanism**: 29.0 g standard MFB wheel mass. Mercury: smooth profile contacts. Mid-tier wheel for stamina/defense. Not specialized enough for top-tier in any role but competitive in general builds.  
**Engine Note**: mass_g=29.0; smoothProfile; midTier_stamina/defense.

---

### [Case 1042 — Crystal Wheel: Archer: 5.16 g](./6%20case%20study.md#case-1042)

**System**: MFB (Synchrome / Zero-G System) — Crystal Wheel  
**Geometry**: 5.16 g; PC crystal wheel  
**Material**: polycarbonate  
**Mechanism**: 5.16 g: heaviest standard crystal wheel. High mass for PC ring → best I contribution of crystal wheels. Archer motif. Launcher tabs. Used in Synchrome builds where crystal wheel mass matters.  
**Engine Note**: mass_g=5.16; PC; heaviest_crystal; I_best; Synchrome_preferred.

---

### [Case 1043 — Crystal Wheel: Bandid: 4.8 g](./6%20case%20study.md#case-1043)

**System**: MFB (Synchrome / Zero-G System) — Crystal Wheel  
**Geometry**: 4.8 g; PC crystal wheel  
**Material**: polycarbonate  
**Mechanism**: 4.8 g: heavy crystal wheel. Second-heaviest after Archer. Good I contribution. Bandid motif. Competitive in builds needing high crystal wheel mass.  
**Engine Note**: mass_g=4.8; PC; heavy_crystal; I_good.

---

### [Case 1044 — Crystal Wheel: Berserker: 4.5 g](./6%20case%20study.md#case-1044)

**System**: MFB (Synchrome / Zero-G System) — Crystal Wheel  
**Geometry**: 4.5 g; PC crystal wheel  
**Material**: polycarbonate  
**Mechanism**: 4.5 g: mid-heavy crystal wheel. Berserker motif. Competitive in Synchrome builds. Standard launcher tabs.  
**Engine Note**: mass_g=4.5; PC; midHeavy_crystal; Synchrome.

---

### [Case 1045 — Crystal Wheel: Dark Knight: 3.87 g](./6%20case%20study.md#case-1045)

**System**: MFB (Synchrome / Zero-G System) — Crystal Wheel  
**Geometry**: 3.87 g; PC crystal wheel  
**Material**: polycarbonate  
**Mechanism**: 3.87 g: slightly above standard (3.0 g) crystal wheel. Dark Knight motif. Standard launcher tabs. Minor I contribution above baseline.  
**Engine Note**: mass_g=3.87; PC; slightlyAboveStandard.

---

### [Case 1046 — Crystal Wheel: Gladiator: 5.37 g](./6%20case%20study.md#case-1046)

**System**: MFB (Synchrome / Zero-G System) — Crystal Wheel  
**Geometry**: 5.37 g; PC crystal wheel  
**Material**: polycarbonate  
**Mechanism**: 5.37 g: very heavy crystal wheel (second-heaviest after Archer at 5.16 g — actually heavier). Gladiator motif. Best I contribution of standard crystal wheels. Competitive in Synchrome builds.  
**Engine Note**: mass_g=5.37; PC; veryHeavy_crystal; I_topTier_crystal.

---

### [Case 1047 — Crystal Wheel: Pirates: 4.0 g](./6%20case%20study.md#case-1047)

**System**: MFB (Synchrome / Zero-G System) — Crystal Wheel  
**Geometry**: 4.0 g; PC crystal wheel  
**Material**: polycarbonate  
**Mechanism**: 4.0 g: standard-heavy crystal wheel. Pirates motif. Standard launcher tabs. Competitive in Synchrome builds at typical crystal wheel mass.  
**Engine Note**: mass_g=4.0; PC; standardHeavy_crystal.

---

### [Case 1048 — Crystal Wheel: Samurai: 5.4 g](./6%20case%20study.md#case-1048)

**System**: MFB (Synchrome / Zero-G System) — Crystal Wheel  
**Geometry**: 5.4 g; PC crystal wheel  
**Material**: polycarbonate  
**Mechanism**: 5.4 g: among heaviest crystal wheels (Samurai + Shinobi both 5.4 g, tied with Archer~5.16 g only lighter). Samurai motif. Top-tier crystal wheel for I contribution in Synchrome.  
**Engine Note**: mass_g=5.4; PC; topTier_heavy_crystal; I_topTier.

---

### [Case 1049 — Crystal Wheel: Shinobi / Ninja: 5.4 g](./6%20case%20study.md#case-1049)

**System**: MFB (Synchrome / Zero-G System) — Crystal Wheel  
**Geometry**: 5.4 g; PC crystal wheel  
**Material**: polycarbonate  
**Mechanism**: 5.4 g: tied for heaviest crystal wheel alongside Samurai. Shinobi/Ninja motif (regional naming variant: Shinobi = Takara Tomy; Ninja = Hasbro). Name conflict: TT vs Hasbro naming only — same part. Top-tier crystal wheel for I contribution.  
**Engine Note**: mass_g=5.4; PC; Shinobi_TT=Ninja_Hasbro; topTier_heavy_crystal.

---

### [Case 1050 — Crystal Wheel: Thief: 5.3 g](./6%20case%20study.md#case-1050)

**System**: MFB (Synchrome / Zero-G System) — Crystal Wheel  
**Geometry**: 5.3 g; PC crystal wheel  
**Material**: polycarbonate  
**Mechanism**: 5.3 g: very heavy crystal wheel (just below Samurai/Shinobi 5.4 g). Thief motif. Top-tier crystal wheel class for I contribution. Competitive alternative in Synchrome builds.  
**Engine Note**: mass_g=5.3; PC; nearTopTier_heavy_crystal.

---

### [Case 321 — Chrome Wheel: Killerken: 30.45 g](./6%20case%20study.md#case-321)

**System**: MFB (Synchrome / Zero-G System)  
**Geometry**: 30.45 g; chrome wheel; shark/killer motif  
**Material**: zinc alloy  
**Mechanism**: 30.45 g: competitive chrome wheel mass. Killerken contacts: aggressive shark-profile attack geometry. Synchrome-compatible. Good attack chrome wheel for Zero-G builds.  
**Engine Note**: mass_g=30.45; ChromeWheel; sharkContacts_attack; Synchrome.

---

### [Case 322 — Track: Armor 230 / A230: 5.5 g](./6%20case%20study.md#case-322)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 5.5 g; 23.0 mm height; armor-disk protrusions  
**Material**: ABS  
**Mechanism**: 5.5 g at 2.3 cm height: high mass tall track. Armor disk: wide protrusions at track mid-height. In Zero-G stadiums: armor disk contacts wall before bottom → provides wall-grip buffer. On normal stadiums: armor prevents low-track attackers from reaching bottom. High I contribution from 5.5 g mass. Defense-oriented tall track.  
**Engine Note**: mass_g=5.5; height=2.3cm; armorDisk; wallBuffer_ZeroG; preventsLowTrackAttack; I_high.

---

### [Case 323 — Chrome Wheel: Pegasis: ~29.5 g](./6%20case%20study.md#case-323)

**System**: MFB (Synchrome / Zero-G System)  
**Geometry**: ~29.5 g (weight not confirmed); chrome wheel; Pegasus motif  
**Material**: zinc alloy  
**Mechanism**: ~29.5 g estimate. Pegasis motif: three-wing smash contacts (same design language as MFB Pegasis metal wheel Case 985). Chrome wheel version for Synchrome system. Competitive attack chrome wheel.  
**Engine Note**: mass_g_est≈29.5; ChromeWheel; threeWingSmash; Synchrome.

---

### [Case 324 — Chrome Wheel: Wyvang: ~31.5 g](./6%20case%20study.md#case-324)

**System**: MFB (Synchrome / Zero-G System)  
**Geometry**: ~31.5 g (weight not confirmed); chrome wheel; wyvern wing design  
**Material**: zinc alloy  
**Mechanism**: ~31.5 g: heavier chrome wheel. Wyvern wing contacts: large wing sweep → good smash angle. Heavier mass → better KO force. One of the heavier chrome wheels → competitive in Synchrome defense/attack hybrid.  
**Engine Note**: mass_g_est≈31.5; ChromeWheel; wyvernWing; heavier; Synchrome_hybrid.

---

### [Case 325 — Bottom: Ball / B: 0.6 g](./6%20case%20study.md#case-325)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.6 g; ball tip r ≈ 0.2 cm  
**Material**: ABS  
**Mechanism**: ABS ball tip: μ ≈ 0.35 → moderate friction. Ball shape: multi-directional contact → stable low-friction orbit. Less directional than flat. Moderate stamina (higher friction than sharp). Precession: r_ball ≈ 0.2 cm → intermediate LAD (ω_LAD_min = √(0.35×9.8/0.002) ≈ 41 rad/s). Mid-tier general use.  
**Engine Note**: mass_g=0.6; ABSball; mu≈0.35; moderate_orbit; LAD_intermediate.

---

### [Case 326 — Bottom: Wide Ball / WB: 0.7 g](./6%20case%20study.md#case-326)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.7 g; wide ball tip r ≈ 0.35 cm  
**Material**: ABS  
**Mechanism**: Wider ball than standard B: r_ball ≈ 0.35 cm → lower ω_LAD_min = √(0.35×9.8/0.0035) ≈ 31 rad/s (better LAD than B). More stable precession. Better LAD than B at same friction. Slightly more orbital movement spread (wider contact = less centred orbit). Stamina/survival hybrid.  
**Engine Note**: mass_g=0.7; widerBall_r≈0.35cm; betterLAD vs B; stable_precession.

---

### [Case 1051 — Bottom: Jog Ball / JB: ~0.7 g](./6%20case%20study.md#case-1051)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: ~0.7 g; jogging ball (irregular surface ball)  
**Material**: ABS  
**Mechanism**: Irregular surface ball: jogging contact creates non-smooth movement (similar to Quake tip but ball-shaped). Less erratic than Q but more unpredictable than standard ball. Niche: destabilization via irregular contact. Not competitive in standard roles.  
**Engine Note**: mass_g_est≈0.7; irregularBall; nonSmooth_movement; niche_destabilize.

---

### [Case 327 — Bottom: Metal Ball / MB: 1.4 g](./6%20case%20study.md#case-327)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 1.4 g; metal ball tip  
**Material**: metal ball  
**Mechanism**: Metal ball: μ_metal ≈ 0.35 (same class as ABS ball but smoother over time — metal doesn't wear like ABS). 1.4 g: heavier than ABS alternatives → higher normal force on floor → slightly more friction drag vs ABS ball. Metal surface: more consistent μ over time (doesn't wear to change μ). Moderate stamina/control.  
**Engine Note**: mass_g=1.4; metalBall; mu≈0.35; consistent_mu_over_time; slightlyMoreDrag vs ABS.

---

### [Case 328 — Bottom: Rubber Ball / RB: 0.82 g](./6%20case%20study.md#case-328)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.82 g; rubber ball tip  
**Material**: rubber  
**Mechanism**: Rubber ball: μ_rubber ≈ 0.70 → higher friction than ABS/metal ball. Ball shape: multi-directional grip but sustained (not directional like flat). Flower pattern: accessible at lower orbit speeds than RF (ball doesn't require directional grip). Good spin-steal vs opponent via rubber surface. Hybrid: partial attack grip + LAD stability from ball shape.  
**Engine Note**: mass_g=0.82; rubberBall; mu≈0.70; multiDirGrip; spinSteal+LAD.

---

### [Case 329 — Bottom: Sharp Ball / SB: 0.6 g](./6%20case%20study.md#case-329)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.6 g; sharp-ball hybrid tip  
**Material**: ABS  
**Mechanism**: Sharp point at tip center, ball profile around it: at rest/low spin → sharp tip contacts (near-zero friction → stamina). At heavy tilt → ball profile contacts (provides LAD). Hybrid: stamina phase (sharp) + LAD phase (ball). ABS material: μ varies between phases. Smart design: automatically transitions phases without spring mechanism.  
**Engine Note**: mass_g=0.6; sharpBallHybrid; auto_phase: sharp=stamina, ball=LAD.

---

### [Case 330 — Bottom: Defense / D: 0.68 g](./6%20case%20study.md#case-330)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.68 g; wide rounded base; flat underside  
**Material**: ABS  
**Mechanism**: Wide rounded base: at tilt, base edge contacts floor → wide precession radius → good LAD. Flat underside: near-zero sharp point → some friction but not grip-type. Stable at low spin due to wide contact base. Defense role: wide base resists lateral displacement from hits. Mid-tier LAD from wide base radius.  
**Engine Note**: mass_g=0.68; wideRoundedBase; flatUnderside; LAD_mid; lateralResistance.

---

### [Case 331 — Bottom: Semi-Defense / SD: 0.6 g](./6%20case%20study.md#case-331)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.6 g; semi-wide base between sharp and D  
**Material**: ABS  
**Mechanism**: Between D (wide base) and Sharp (point) in geometry. Moderate friction: some orbital movement (not stationary like D) + some LAD (not zero like sharp). Standard stamina + moderate LAD hybrid. Top-tier for traditional stamina combos in MFB. SD + 145 + high-mass wheel: iconic stamina formula.  
**Engine Note**: mass_g=0.6; semiWideBase; moderate_orbital+LAD; stamina_topTier.

---

### [Case 332 — Bottom: Wide Defense / WD: 0.7 g](./6%20case%20study.md#case-332)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.7 g; wide rubber ring; r_ring ≈ 0.3–0.5 cm  
**Material**: rubber + ABS  
**Mechanism**: Wide rubber ring: at tilt → rubber ring contacts → LAD. During normal spin: tip contact (sharp or center point) provides low friction. Wide ring radius: low ω_LAD_min (√(μ×g/r_ring)). Rubber ring also provides spin-steal on contact. Top-tier LAD bottom alongside EWD. WD = most important stamina/LAD bottom in MFB.  
**Engine Note**: mass_g=0.7; wideRubberRing; LAD_topTier; ω_LAD_min_low; spinSteal_ring.

---

### [Case 333 — Bottom: Sharp Wide Defense / SWD: 0.82 g](./6%20case%20study.md#case-333)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.82 g; sharp center tip + wide defense ring  
**Material**: ABS + rubber ring  
**Mechanism**: Combines Sharp (low friction center tip) with WD outer ring (LAD). Sharp phase: near-zero friction → maximum stamina. WD ring: triggers at heavy tilt → LAD. Best of both phases: sharp center = long stamina; WD ring = extended LAD. Marginally heavier than WD alone. Top-tier for stamina + LAD simultaneously.  
**Engine Note**: mass_g=0.82; sharpCenter + wideDfenseRing; sharpPhase+LADphase; topTier_both.

---

### [Case 334 — Bottom: Wide Semi Flat / WSF: ~0.7 g](./6%20case%20study.md#case-334)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: ~0.7 g; wide semi-flat profile  
**Material**: ABS  
**Mechanism**: Wide semi-flat: between standard semi-flat (SD) and wide flat (WF). Slightly wider contact than SD → more stable orbit but slightly higher friction. Used in Zero-G wall-climb builds where wider contact aids wall grip. General-purpose: competes with SD for stamina but slightly wider movement range.  
**Engine Note**: mass_g≈0.7; wideSemiFlat; between_SD_and_WF; ZeroG_wallClimb.

---

### [Case 335 — Bottom: Sharp / S: 0.6 g](./6%20case%20study.md#case-335)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.6 g; ABS sharp tip r ≈ 0.05 cm  
**Material**: ABS  
**Mechanism**: ABS sharp tip: μ_ABS ≈ 0.25–0.35 → near-zero contact area → lower friction than rubber but higher than metal sharp (μ ≈ 0.17). Moderate stamina (not best in class). Usable for beginner builds. Outperformed by MS (metal sharp) for stamina and by WD for LAD. Basic reference tip.  
**Engine Note**: mass_g=0.6; ABSsharp; mu≈0.30; moderate_stamina; outclassed by MS+WD.

---

### [Case 336 — Bottom: Ball Sharp / BS: 0.6 g](./6%20case%20study.md#case-336)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.6 g; ball-point sharp hybrid  
**Material**: ABS  
**Mechanism**: Ball-shaped lower body with sharp point: similar to Sharp Ball (Case 329) but slightly different geometry. Sharp center → low friction. Ball body → LAD phase at heavy tilt. Same principle: automatic phase transition. Slight geometry difference from SB may change LAD onset angle. Mid-tier stamina + LAD.  
**Engine Note**: mass_g=0.6; ballSharpHybrid; similar to SB; auto_phase_LAD.

---

### [Case 337 — Bottom: Eternal Sharp / ES: 1.0 g](./6%20case%20study.md#case-337)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 1.0 g; sharp center + free-spinning outer ring  
**Material**: ABS + free-spin ring  
**Spin Coupling**: free-spinning outer ring decouples contact impulse  
**Mechanism**: Free-spinning outer ring: contact impulse on ring decoupled from body (ring spins up). Sharp center: near-zero friction → stamina. Eternal (persistent) spin: outer ring free-spin = minimal drag on body during orbital movement. Heavier than S (1.0 vs 0.6 g) → more floor normal force → slightly more friction. Best for builds needing both stamina and minimal contact impulse.  
**Engine Note**: mass_g=1.0; sharpCenter+freeSpinRing; decoupledContact; EternalSpin.

---

### [Case 338 — Bottom: Metal Sharp / MS: 1.30 g](./6%20case%20study.md#case-338)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 1.30 g; metal sharp tip r ≈ 0.05 cm  
**Material**: metal tip + ABS housing  
**Mechanism**: Metal sharp: μ ≈ 0.17 → near-bearing friction. Best ABS-housed stamina tip. 1.30 g: heavier than plastic sharp → higher normal force but μ still very low. Top-tier stamina alongside SD+WD combos. Heavier mass vs S: slightly more floor friction but metal compensates with lower μ.  
**Engine Note**: mass_g=1.30; metalSharp_mu=0.17; topTier_stamina; nearBearing_friction.

---

### [Case 339 — Bottom: Flat / F: 1.0 g](./6%20case%20study.md#case-339)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 1.0 g; ABS flat tip  
**Material**: ABS  
**Mechanism**: ABS flat tip: μ ≈ 0.35, wide contact → flower pattern at lower orbital speeds than rubber (rubber preferred). 1.0 g. Outperformed by RF for attack (rubber provides better grip). Useful baseline: any flat tip provides orbital movement for attack; ABS flat is lower tier. Anti-sync: in same-direction contact, ABS flat loses to rubber grip decisively.  
**Engine Note**: mass_g=1.0; ABSflat; mu≈0.35; attack_baseline; outclassed_by_RF.

---

### [Case 340 — Bottom: Wide Flat / WF: 0.6 g](./6%20case%20study.md#case-340)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.6 g; wide ABS flat tip  
**Material**: ABS  
**Mechanism**: Wider ABS flat: larger contact area than F → more stable orbit (wider contact = less tip-path deviation). Lower orbital speed than F (wider = more friction distribution but larger area → overall similar μ). Better floor coverage for Zero-G stadium base contact. Not as fast as RF but stable.  
**Engine Note**: mass_g=0.6; wideABSflat; stableOrbit; ZeroG_baseContact.

---

### [Case 341 — Bottom: Extreme Flat / XF: 0.68 g](./6%20case%20study.md#case-341)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.68 g; very wide ABS flat tip  
**Material**: ABS  
**Mechanism**: Extreme (very wide) ABS flat: wider than WF. Maximum contact area → maximum floor coverage → fastest orbital speed of ABS flat types (at same μ, wider contact → same friction magnitude but entire floor area engaged → orbital path maximized). Most aggressive ABS flat for attack builds where rubber unavailable.  
**Engine Note**: mass_g=0.68; extremeWideFlat; maximumOrbitalSpeed_ABS; bestAttack_ABSflat.

---

### [Case 342 — Bottom: Metal Flat / MF: ~1.3 g](./6%20case%20study.md#case-342)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: ~1.3 g; metal flat tip  
**Material**: metal  
**Mechanism**: Metal flat: μ_metal ≈ 0.55–0.65 → between ABS flat and rubber flat. Good orbital speed + more controlled than rubber. Heavier (~1.3 g) → higher floor normal force. Best of flat types when rubber unavailable: more controlled flower pattern than rubber (lower μ = less aggressive jerking) but still faster than ABS. Top attack tip when RF unavailable.  
**Engine Note**: mass_g≈1.3; metalFlat_mu≈0.60; bestAlt when RF_unavailable; controlled_flower.

---

### [Case 343 — 4D Metal Wheel: Big Bang: 41.83 g](./6%20case%20study.md#case-343)

**System**: MFB (4D System)  
**Geometry**: 41.83 g; 4D wheel  
**Material**: metal frame + PC  
**Mechanism**: 41.83 g: heavy 4D wheel. Big Bang configuration: attack-oriented contacts with high mass. 4D PC frame provides mode. Attack role: mass + contact geometry deliver heavy hits. High I → KO resistance during attack phase. Competitive top-tier 4D wheel for attack/defense hybrid.  
**Engine Note**: mass_g=41.83; 4D; attackContacts; highMass; attack/defense_hybrid.

---

### [Case 344 — 4D Bottom: Final Drive / F:D: 5.85 g](./6%20case%20study.md#case-344)

**System**: MFB (4D System) — Bottom  
**Geometry**: 5.85 g; speed-dependent tip transition; combined track+tip unit  
**Material**: ABS + metal tips  
**Gimmick**: centrifugal speed-dependent tip change (high spin = attack tip; low spin = stamina tip)  
**Mechanism**: Final Drive: tip transitions automatically with RPM. High spin: wide flat or semi-flat → attack orbital movement. Low spin: sharp → stamina/LAD mode. Automatic and continuous (not one-shot like clutch). Track + tip combined → saves one layer slot. 5.85 g: adds track-level I. Best 4D bottom for multi-role use.  
**Engine Note**: mass_g=5.85; speedDependent_continuous; highRPM=attack, lowRPM=stamina; track+tip_combined.

---

### [Case 345 — 4D Bottom: X:Drive / X:D: 7.19 g](./6%20case%20study.md#case-345)

**System**: MFB (4D System) — Bottom  
**Geometry**: 7.19 g; extreme version of F:D; speed-dependent transitions  
**Material**: ABS + metal  
**Gimmick**: speed-dependent tip with three positions  
**Mechanism**: Heavier than F:D (7.19 vs 5.85 g). Three tip positions with RPM: high-spin flat attack, mid-spin semi-flat, low-spin sharp stamina. Extreme transitions: more aggressive position change vs F:D. 7.19 g: highest mass of 4D bottoms → highest I contribution. Top-tier 4D bottom for builds needing maximum control across all RPM phases.  
**Engine Note**: mass_g=7.19; 3positions_RPM; heaviest_4Dbottom; I_topTier; extremeTransitions.

---

### [Case 346 — 4D Metal Wheel: Diablo: 51.26 g](./6%20case%20study.md#case-346)

**System**: MFB (4D System)  
**Geometry**: 51.26 g; heaviest 4D wheel (possibly heaviest standard MFB wheel)  
**Material**: metal frame + PC  
**Mechanism**: 51.26 g: heaviest known MFB wheel. Extreme I → maximum KO resistance. Diablo contacts: very aggressive smash geometry on a near-circular body. Attack + defense simultaneously: heaviest contact impulse deliverable with any wheel. Top-tier 4D wheel. Note: Chrome Wheel Ifraid (Case 1062) ties at 51.26 g.  
**Engine Note**: mass_g=51.26; heaviestMFBwheel (tied w/ Ifraid); I_extreme; attack+defense.

---

### [Case 347 — 4D Metal Wheel: L-Drago Destroy: 44.33 g](./6%20case%20study.md#case-347)

**System**: MFB (4D System) — Left Spin  
**Geometry**: 44.33 g; 4D left-spin wheel  
**Material**: metal frame + PC  
**Mechanism**: 44.33 g: very heavy 4D LS wheel. L-Drago Destroy: destruction-oriented contacts. Left-spin optimized with metal and PC frame combination. 4D mode changes available. LS attack + defense hybrid from high mass. Top-tier LS 4D wheel.  
**Engine Note**: mass_g=44.33; 4D; LS_specific; destructionContacts; attack/defense_4D.

---

### [Case 348 — 4D Bottom: F:S Final:Survive: 5.73 g](./6%20case%20study.md#case-348)

**System**: MFB (4D System) — Bottom  
**Geometry**: 5.73 g; survival-optimized final drive variant  
**Material**: ABS + metal  
**Gimmick**: speed-dependent but survival-optimized transitions  
**Mechanism**: Final:Survive variant: speed-dependent transitions tuned for maximum survival (stamina-oriented). High spin: mild flat movement. Low spin: sharp for maximum stamina. Survival-focus means less aggressive attack at high spin vs standard F:D. 5.73 g: track+tip combined. Best for stamina builds needing speed-phase management.  
**Engine Note**: mass_g=5.73; finalSurvive; stamina_tuned; survivalFocus vs F:D_attack_focus.

---

### [Case 349 — 4D Clear Wheel: Orion: 3.0 g](./6%20case%20study.md#case-349)

**System**: MFB (4D System)  
**Geometry**: 3.0 g; 4D clear wheel  
**Material**: polycarbonate  
**Mechanism**: Standard 4D energy ring at 3.0 g. Orion constellation motif. Launcher tabs. Compatible with 4D metal wheels. Standard I contribution for PC ring.  
**Engine Note**: mass_g=3.0; PC; 4D_standard; Orion_motif.

---

### [Case 350 — 4D Metal Wheel: Phantom: 44.50 g](./6%20case%20study.md#case-350)

**System**: MFB (4D System)  
**Geometry**: 44.50 g; 4D wheel; circular defense profile  
**Material**: metal frame + PC  
**Mechanism**: 44.50 g: very heavy 4D wheel. Phantom: near-circular defense-dominant profile. Smooth outer rim → near-zero recoil. High I → maximum defense/stamina. 4D mode enables PC core configuration. Top-tier 4D defense wheel alongside Fusion.  
**Engine Note**: mass_g=44.50; 4D; nearCircular; I_veryHigh; defense.

---

### [Case 351 — 4D Bottom: B:D Bearing Drive: 3.45 g](./6%20case%20study.md#case-351)

**System**: MFB (4D System) — Bottom  
**Geometry**: 3.45 g; bearing-based drive  
**Material**: ABS + bearing  
**Spin Coupling**: bearing isolation → near-zero tip friction  
**Mechanism**: Bearing Drive: bearing in bottom → near-zero tip friction (μ ≈ 0.05). Top-tier stamina bottom in 4D system. Combined track + tip unit. 3.45 g. Bearing wears over time → friction increases gradually. Competitive while bearings are fresh. Best 4D bottom for pure stamina.  
**Engine Note**: mass_g=3.45; bearing_mu≈0.05; topTier_stamina; bearingWear_over_time.

---

### [Case 352 — Track: S130 Shield 130: 3.3 g](./6%20case%20study.md#case-352)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 3.3 g; 13.0 mm height; shield disk protrusions  
**Material**: ABS  
**Mechanism**: Shield disk at 1.3 cm height: protrusions extend outward at track level. Provides coverage against lower-track attackers while being shorter than 145. 3.3 g: good I contribution. Defense track: shield protrusions deflect attacks that would otherwise reach wheel. Shorter than BD145 but provides lateral protection at track level.  
**Engine Note**: mass_g=3.3; height=1.3cm; shieldDisk; lateralProtection; I_good.

---

### [Case 353 — Bottom: CS Coat Sharp: 0.8 g](./6%20case%20study.md#case-353)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.8 g; coated sharp tip  
**Material**: metal/coated tip  
**Mechanism**: Coat Sharp: sharp tip with special surface coating → μ lower than standard ABS sharp but higher than MS. Coat reduces friction via low-friction polymer layer. Better stamina than ABS sharp; slightly more friction than metal sharp. 0.8 g: moderate mass. Competitive in builds without MS access.  
**Engine Note**: mass_g=0.8; coatedSharp; mu_between_ABSsharp_and_MS; competitive_without_MS.

---

### [Case 1052 — Fusion Wheel: Forbidden: 31.7 g](./6%20case%20study.md#case-1052)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 31.7 g; Fusion Wheel  
**Material**: zinc alloy  
**Mechanism**: 31.7 g Fusion Wheel. Forbidden motif. Contact geometry: moderate smash with wide profile. Competitive in defense/stamina applications due to mass. Not a top-tier attack wheel. General-purpose mid-to-heavy wheel.  
**Engine Note**: mass_g=31.7; FusionWheel; moderate contact; defense/stamina.

---

### [Case 1053 — Track: Eternal Defense 145 / ED145: 3.6 g](./6%20case%20study.md#case-1053)

**System**: MFB (Metal Fight Beyblade) — Track  
**Geometry**: 3.6 g; 14.5 mm height; free-spinning disk wings  
**Material**: ABS + free-spin bearings  
**Spin Coupling**: free-spinning wings → contact impulse dissipated  
**Mechanism**: Free-spinning wing disk: wings spin independently on contact → impulse absorbed (wings spin up). Unlike WD145 (Case 971): ED145 wings ARE free-spinning → full impulse absorption. 3.6 g at 14.5 mm: same mass as WD145 but free-spin. Lower recoil than WD145 (no mechanical trap risk). Trade: free-spin means trap mechanism impossible. Pure defense track.  
**Engine Note**: mass_g=3.6; height=1.45cm; freeSpinWings; impulseAbsorbed; noTrap vs WD145.

---

### [Case 1054 — Bottom: Flat Ball / FB: 0.6 g](./6%20case%20study.md#case-1054)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.6 g; flat-ball hybrid (flat base with ball-shaped lower profile)  
**Material**: ABS  
**Mechanism**: Flat base with ball-shaped lower profile: standard movement + ball-curve edge. Ball curve on flat → when tilted, ball edge rolls vs flat hard edge. Provides slight LAD benefit at tilt vs standard flat. Attack character from flat base. LAD assist from ball edge. Mid-tier attack+survival hybrid.  
**Engine Note**: mass_g=0.6; flatBase+ballEdge; attack+minorLAD.

---

### [Case 1055 — Clear Wheel: Eonis / Ionis: 2.8 g](./6%20case%20study.md#case-1055)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 2.8 g; PC clear wheel  
**Material**: polycarbonate  
**Mechanism**: 2.8 g: slightly below standard PC ring (3.0 g avg). Eonis/Ionis — regional naming variant (TT vs Hasbro). Name note: same part, two names. Lightweight clear wheel → marginal mass advantage in builds needing minimum combo mass.  
**Engine Note**: mass_g=2.8; PC; belowStandard_mass; Eonis_TT=Ionis_Hasbro; lightClearWheel.

---

### [Case 1056 — Fusion Wheel: Dark: 31.4 g](./6%20case%20study.md#case-1056)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 31.4 g; Fusion Wheel; smooth dark profile  
**Material**: zinc alloy  
**Mechanism**: 31.4 g: competitive Fusion Wheel mass. Dark profile: smooth, round outer rim → low recoil → defense/stamina. Comparable to Earth/Burn for stamina but slightly lighter. Mid-upper tier defense wheel.  
**Engine Note**: mass_g=31.4; smoothDark; lowRecoil; defense/stamina; mid-upper tier.

---

### [Case 1057 — Bottom: Flat Spike / Flat Sharp / FS: 0.6 g](./6%20case%20study.md#case-1057)

**System**: MFB (Metal Fight Beyblade) — Bottom  
**Geometry**: 0.6 g; flat tip with central spike  
**Material**: ABS  
**Mechanism**: Flat tip with central spike protruding below: during high-speed spin, flat outer rim contacts (attack mode). During tilt/low spin, spike contacts (sharp mode for minimal friction). Dual profile: automatic transition. Similar to Sharp Ball but inverted geometry (spike in center vs ball body). Competitive alternative to SB/BS.  
**Engine Note**: mass_g=0.6; flatOuter+spikeCenter; auto_phase: flat=attack, spike=stamina.

---

### [Case 1058 — Clear Wheel: Wolf: 3.1 g](./6%20case%20study.md#case-1058)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 3.1 g; PC clear wheel; wolf motif  
**Material**: polycarbonate  
**Mechanism**: 3.1 g: standard mass PC ring. Wolf motif. Standard launcher tabs. Compatible with most Fusion Wheels. Standard I contribution.  
**Engine Note**: mass_g=3.1; PC; standard; wolfMotif.

---

### [Case 1059 — Fusion Wheel: Poison: 29.8 g](./6%20case%20study.md#case-1059)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 29.8 g; Fusion Wheel  
**Material**: zinc alloy  
**Mechanism**: 29.8 g: lower mid-range Fusion Wheel mass. Poison design: somewhat aggressive contact geometry with moderate recoil. Not top-tier attack or defense — mid-range competitor. Pairs with standard attack bottoms.  
**Engine Note**: mass_g=29.8; FusionWheel; moderate contact; midRange.

---

### [Case 1060 — Fusion Wheel: Spiral: 34.2 g](./6%20case%20study.md#case-1060)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 34.2 g; Fusion Wheel; spiral groove contacts  
**Material**: zinc alloy  
**Mechanism**: 34.2 g: heavier Fusion Wheel. Spiral groove contacts: rotational contact provides screw-pump lateral force (similar to Vortex bit in BX, Case 963). Moderate attack + good mass for KO resistance. Higher mass enables heavy hits with spiral-groove contact directing spin energy.  
**Engine Note**: mass_g=34.2; spiralGroove; screwPump_lateral; heavier; attack+KO.

---

### [Case 1061 — Clear Wheel: Serpent: 2.9 g](./6%20case%20study.md#case-1061)

**System**: MFB (Metal Fight Beyblade)  
**Geometry**: 2.9 g; PC clear wheel  
**Material**: polycarbonate  
**Mechanism**: 2.9 g: near-standard PC ring. Serpent motif. Standard launcher tabs. Slightly below 3.0 g average → marginal lightness.  
**Engine Note**: mass_g=2.9; PC; serpentMotif; nearStandard.

---

### [Case 1062 — Chrome Wheel: Ifraid: 51.26 g](./6%20case%20study.md#case-1062)

**System**: MFB (Synchrome / Zero-G System)  
**Geometry**: 51.26 g; chrome wheel; fire-beast motif  
**Material**: zinc alloy  
**Mechanism**: 51.26 g: tied with Diablo (Case 346) for heaviest standard MFB wheel. Ifraid Chrome Wheel. Extreme I → maximum KO resistance and inertia in Synchrome setup. Fire-beast contacts: aggressive smash geometry. In Synchrome: Ifraid + another heavy wheel → extreme combined mass. Top-tier Synchrome offensive wheel.  
**Engine Note**: mass_g=51.26; heaviest_ChromeWheel (tied w/ Diablo); I_extreme; Synchrome_topTier.

---

### [Case 1063 — Chrome Wheel: Begirados: 45.6 g](./6%20case%20study.md#case-1063)

**System**: MFB (Synchrome / Zero-G System)  
**Geometry**: 45.6 g; chrome wheel; dragon motif  
**Material**: zinc alloy  
**Mechanism**: 45.6 g: very heavy chrome wheel. Begirados: dragon-motif contacts → smash geometry. Heavy for Synchrome → excellent I contribution. Top-tier offensive chrome wheel by mass. Competes with Revizer for Synchrome attack builds.  
**Engine Note**: mass_g=45.6; ChromeWheel; dragonContacts; veryHeavy; Synchrome_topTier.

---

## CS7 — Cases 354–374 {#cs7}
Source: `7 case study.md`

---

### [Case 354 — Basic Line System (BX)](./7%20case%20study.md#case-354)

**System**: Beyblade X (BX)  
**Geometry**: Blade: zinc contact points at outer perimeter, metal launcher hooks ×3 at mid-radius, PMMA body; Ratchet: twist-lock tooth ring; Bit: 12-tooth pinion gear  
**Material**: Blade — zinc alloy (contact points) + metal (hooks) + PMMA body; Ratchet — ABS; Bit — ABS  
**Mechanism**: Three-component BX stack. Metal launcher hooks pull mass toward axis vs UX resin hooks → balanced stable spin geometry. Ratchet twist-lock: more indent engagement = higher burst torque threshold. Bit 12-tooth pinion meshes X-Celerator Rail → Xtreme Dash per 30° arc. Spin direction fixed by Blade stopper; cross-launch physically blocked. L/R spin set at Blade manufacture level — not changeable by Ratchet selector.  
**Engine Note**: system=BX_BasicLine; hookMaterial=metal; inertiaBalance=inward; ratchet=twistLock; bit_teeth=12; dashPer30deg=true; spinLock=physical.

---

### [Case 355 — Unique Line System (UX)](./7%20case%20study.md#case-355)

**System**: Beyblade X (UX)  
**Geometry**: Blade: zinc contact points outer perimeter, resin launcher hooks ×3 at mid-radius (lower density than BX metal hooks); Ratchet: same twist-lock as BX; Bit: gimmick variants per model  
**Material**: Blade — zinc alloy (contact points) + resin (hooks) + PMMA body; Ratchet-Integrated Blade: fused single unit (BulletGriffon type)  
**Mechanism**: UX advances BX by replacing metal launcher hooks with resin — same geometry, lower density → less inward mass pull → zinc outer ring dominates I more completely → higher Outward Weight Distribution (OWD). Each UX release specialised in one distinct mechanical/geometric axis beyond OWD. Ratchet-Integrated Blades fuse Ratchet into Blade enabling cross-boundary gimmick mechanisms. Expand Blade (Feb 2026) integrates Ratchet; no rotating Gear Chip; avatar = sticker.  
**Engine Note**: system=UX_UniqueLine; hookMaterial=resin; OWD=high; RatchetIntegrated=available; ExpandBlade=2026.

---

### [Case 356 — Custom Line System (CX)](./7%20case%20study.md#case-356)

**System**: Beyblade X (CX)  
**Geometry**: Standard CX: Lock Chip (ABS, inner) + Main Blade (zinc contacts, r_outer varies) + Assist Blade (PMMA, height/reach variable) + Ratchet + Bit — 5 components. Expand CX: Lock Chip + Over Blade (PMMA outer) + Metal Blade (zinc, beneath) + Assist Blade + Ratchet + Bit — 6 components. Metal Lock Chip variant: denser/taller at center.  
**Material**: Lock Chip — ABS (standard) or metal (Metal LC); Main Blade — zinc alloy + PMMA; Assist Blade — PMMA; Over Blade — PMMA; Metal Blade — zinc alloy  
**Mechanism**: Modular 3-part Blade stack. I_blade_total = I_lock_chip + I_main_blade + I_assist_blade (standard); + I_over_blade + I_metal_blade for Expand. Any single component swappable without disturbing others — unique tuning axis vs BX/UX. Assist Blade changes vertical contact height and secondary contact timing. Over Blade (Expand) shifts outermost contact to PMMA → less recoil than zinc-on-zinc.  
**Engine Note**: system=CX_CustomLine; bladeComponents=3(standard)/4(expand); modularity=per_zone; Expand_2layer=overBlade+metalBlade.

---

### [Case 357 — Ratchet System Architecture (BX / UX / CX)](./7%20case%20study.md#case-357)

**System**: Beyblade X (BX / UX / CX) — Ratchet sub-architecture  
**Geometry**: Height encoded in part name: X-YY where YY × 0.1 mm = height. 3-60: 6.0 mm, 6 indents (C₃). 4-70: 7.0 mm, 7 indents (3+4, C₁ asymmetric). 4-80: 8.0 mm, 8 indents (C₄-like). Outer protrusion count = first digit.  
**Material**: ABS  
**Mechanism**: Ratchet performs 3 simultaneous functions: (1) sets total Bey height → controls contact-plane elevation and CoM; (2) burst resistance via indent count — W_burst ∝ N_indents × F_indent × d_travel; (3) shaft-lock preload. 70-height C₁ pattern: 3-indent and 4-indent halves produce direction-dependent burst threshold — lower-resistance arc is burst window. Higher Ratchet = more tilt-sensitive CoM; lower = more stable. Spin-direction selector ring: marks only assembly orientation, does not override Blade stopper.  
**Engine Note**: heightConvention=YY×0.1mm; indents_60=6; indents_70=7(C1_asymmetric); indents_80=8; burstWindow=3indentArc(70h); CoM_scales_with_height.

---

### [Case 358 — Bit System Architecture (BX / UX / CX)](./7%20case%20study.md#case-358)

**System**: Beyblade X (BX / UX / CX) — Bit sub-architecture  
**Geometry**: Bit pinion: 12 teeth (standard Flat), 10 teeth (Rush). Rack pitch p_tooth fixed by stadium. Linear distance per revolution = N_teeth × p_tooth. Floor contact: flat tip = large disk patch; ball/dome = near-point Hertzian contact. Shaft ridges = high burst resistance; smooth shaft = low.  
**Material**: ABS  
**Mechanism**: Bit controls two independent functions: (1) X-Celerator Rail engagement — pinion tooth count sets dash frequency: fewer teeth = shorter pitch circle = more engagements per metre = more/faster dashes. Rush (10T) produces more Xtreme Dashes per lap than Flat (12T). (2) Shaft surface controls secondary burst resistance stacked on Ratchet indent count. (3) Tip geometry sets floor contact patch → movement type. Dash sequence: Bit pinion contacts rail → reaction impulse → successive tooth engagements → higher tangential exit speed.  
**Engine Note**: bitTeeth_flat=12; bitTeeth_rush=10; rushHigherDashFreq=true; shaftRidges=highBurstResist; tipFlat=erratic; tipBall=stable.

---

### [Case 359 — 4 Layer System (4LS): Original Series Architecture](./7%20case%20study.md#case-359)

**System**: Plastics Gen 1 — 4 Layer System (4LS)  
**Geometry**: Bit Chip: r≈0.9 cm, h≈0.3 cm, m≈1.0 g; AR: r_outer≈2.2–2.8 cm, r_inner≈1.0 cm, m≈6 g (representative); WD (Wide): r_outer≈2.2 cm, r_inner≈0.4 cm, m≈14 g → I_WD≈3.50×10⁻⁶ kg·m²; BB: r_outer≈2.0–2.6 cm, m≈5 g → I_BB≈1.04×10⁻⁶ kg·m²; I_total (Wide WD representative)≈6.63×10⁻⁶ kg·m²; WD share≈52.8%; tip r≈0.1–0.4 cm  
**Material**: AR — ABS (optional metal tips); WD — zinc/steel; BB — ABS; BC — ABS  
**Mechanism**: 4-component axial stack (Bit Chip / AR / WD / BB). Chirality fixed in BB at manufacture — no hot-swap. AR is first and only contact point (r_AR ≥ r_WD enforced). WD contributes >50% of I. AR contact face φ: smash = cos(φ), recoil = sin(φ). BB tip sets spin decay: flat (μ=0.35, r_tip=0.4 cm) → dω/dt≈−68 rad/s²; spike (μ=0.17, r_tip=0.1 cm) → dω/dt≈−8 rad/s². No mid-battle mode change. Chip Cover clips over BC (obsolete in SGS+).  
**Engine Note**: gen=Plastics_4LS; layers=4; chiralityIn=BB(fixed); WD_I_share=52.8%; tipDecay_flat=68rad_s2; tipDecay_spike=8rad_s2; noModeChange.

---

### [Case 360 — Spin Gear System (SGS): Five-Layer Architecture and Chirality Modularisation](./7%20case%20study.md#case-360)

**System**: Plastics Gen 1 — Spin Gear System (SGS)  
**Geometry**: SG shells (pair): m≈2.24 g, r_outer≈1.9 cm, r_inner≈0.4 cm → I_SG_shells≈4.22×10⁻⁷ kg·m²; Metal Weight Gear (MWG): m≈1.12 g, r≈1.5 cm (thin ring) → I_MWG≈2.52×10⁻⁷ kg·m²; I_SG_total (shells+MWG)≈6.74×10⁻⁷ kg·m²; BC extended: r≈0.9–1.1 cm (no Chip Cover needed); Sub-AR (representative): m≈3 g, r_outer≈2.2 cm → I_subAR≈8.76×10⁻⁷ kg·m²; 5-layer I_total (Wide WD)≈7.10×10⁻⁶ kg·m²; WD share≈49.3%; SG share≈9.5%  
**Material**: SG shells — ABS; MWG — metal; Sub-AR — ABS  
**Spin Coupling**: SG Left/Right shells — physically incompatible with wrong-spin launcher (Left tabs block Right shooter insertion). SG chirality hot-swappable (swap shells, BB unchanged). Sub-AR free-spins on collar: transmitted impulse fraction = I_bey / (I_bey + I_subAR) ≈ 89% for representative Sub-AR.  
**Mechanism**: SGS adds SG layer between WD and BB — extracts chirality from BB into swappable SG shells. Gimmick SGs: Full Auto Clutch (ball bearings + ratchet decoupler); Engine Gear (spring-wound, separate system Case 362). BB compatibility: 4LS BBs lack SG cavity.  
**Engine Note**: gen=Plastics_SGS; layers=5; chiralityIn=SG_shells(swappable); SubAR_impulseAbsorb=11pct; SG_I_share=9.5pct; EG_pushes_SG_share_25_40pct.

---

### [Case 361 — Magnacore System (MGS): Six-Layer Architecture and Magnetic Normal-Force Modulation](./7%20case%20study.md#case-361)

**System**: Plastics Gen 1 — Magnacore System (MGS)  
**Geometry**: 6-layer stack. NEO SG shells: hollow centre, accepts Core inserts. Magnecore: permanent magnet (N or S pole). Magnetic WD: two-sided, flip for N/S polarity. Support Parts: reversible BB accessories that change contact geometry/height. Stadium magnet: South pole always faces up (Magnacore Tray).  
**Material**: NEO SG shells — ABS; Magnecore — ABS + permanent magnet; Magnetic WD — metal + permanent magnet  
**Gimmick**: Magnecore (South): repels stadium magnet → ↓N_normal → ↓tip friction → erratic low-drag movement; easier ring-out. Magnecore (North): attracts stadium magnet → ↑N_normal → ↑tip friction → harder to displace defensive; faster spin decay. Magnetic WD enables SGS beys with Gimmick SGs to access magnetic modulation without swapping base. Support Parts reversible — change contact height without part swap.  
**Mechanism**: MGS splits SGS SG into NEO SG shells + Core (6th layer). Core is swappable inertia/gimmick module: Metal Weight Core (mass only), Standard SG Core (legacy), Magnecore (magnetic). Normal-force modulation via magnetic attraction/repulsion is the sole new physics variable vs SGS.  
**Engine Note**: gen=Plastics_MGS; layers=6; Core=swappable; Magnecore_S=reduceNormal; Magnecore_N=increaseNormal; MagneticWD=SGS_compatible.

---

### [Case 362 — Engine Gear System (EGS): Spring-Energy Storage, Clutch-Timed Release, and EG-Dominant Inertia](./7%20case%20study.md#case-362)

**System**: Plastics Gen 1 — Engine Gear System (EGS)  
**Geometry**: EG: r_outer≈1.9–2.2 cm, mass≈10–21 g (variant-dependent); replaces NEO SG+Core. BB clutch types: First (releases at launch), Final (releases on impact/low spin), No Clutch (steady release), Stopper (no release). CEW slot at EG bottom accepts interchangeable tip inserts.  
**Material**: EG body — ABS; spring — steel; CEW tip inserts — varies by type  
**Gimmick**: Turbo Winder pre-winds spring before launch. Clutch timing: First Clutch → peak ω at launch; Final Clutch → peak ω at low-spin or impact moment; No Clutch → gradual release across match. EG mass (10–21 g) is 4–10× SGS shell mass → EG becomes co-dominant or dominant I contributor (25–40% of I_total). Reverse Engine Gear applies counter-spin torque to Bey at activation → deliberate spin-loss event (Dranzer GT reverse attack strategy). Custom Engine Weights (CEW) decouple tip geometry from spring mechanism.  
**Mechanism**: EG replaces NEO SG+Core as single enlarged unit. Spring stores potential energy pre-launch; BB clutch tab geometry triggers release. Builder controls not just what Bey does but when peak ω occurs in match timeline. Anime note: Special moves override all clutch/mechanical limits via BeySpirit power.  
**Engine Note**: gen=Plastics_EGS; EG_mass_g=10_21; clutchTypes=First/Final/NoCrutch/Stopper; Reverse_EG=counterSpin; CEW=tipModular; EG_I_share=25_40pct; animeOverride=BeySpirit.

---

### [Case 363 — Hard Metal System (HMS): Complete Architecture Break, Running Core Consolidation, and Metal AR Contact Physics](./7%20case%20study.md#case-363)

**System**: Plastics Gen 1 — Hard Metal System (HMS)  
**Geometry**: HMS≈75% scale of plastics gen: AR r_outer≈1.6–2.2 cm; WD r_outer≈1.6–2.0 cm. I scales as r² → HMS I ≈ 56% of equivalent plastics build at same mass → higher launch ω at equal launch energy. Bit Protector: r≈1.4–1.6 cm (structural lock atop RC). RC: central spine — BP/AR/WD slide over RC upper post; tip exits from RC lower.  
**Material**: AR — ABS Caul + zinc Metal Frame; WD — metal (standard) or notched with ABS inserts (CWD, Free Spinning or Stationary); RC — ABS + tip; BP — ABS  
**Mechanism**: Complete compatibility break with 4LS/SGS/MGS/EGS. 4-layer stack: BP / AR / WD / RC. Assembly inverted: RC is spine; all other parts slide over it. AR = ABS Caul + zinc Metal Frame → zinc-on-zinc contact: higher impulse (density ≈6.3× ABS), zero contact deformation, no energy loss to indentation. AR co-dominant I with WD. Dual Shooter: L and R ripcord insertion holes → chirality = launcher choice, not assembly property. No separate Spin Gear.  
**Engine Note**: gen=Plastics_HMS; scale=75pct; I_scale_factor=0.56; metalFrame_AR=zinc; dualShooter=chiralityFree; RC=spine; noSG_layer; complete_break_from_4LS_SGS.

---

### [Case 364 — Metal System (MFS): Generation 2 Architecture, Wheel-Dominant Inertia, and Track Height Parametrisation](./7%20case%20study.md#case-364)

**System**: MFB Gen 2 — Metal System (MFS)  
**Geometry**: Wheel: r_outer≈2.2–2.8 cm, m≈20–30 g, zinc/aluminum → I_Wheel≈95% of I_total. Track height = part number × 0.1 mm (145=1.45 cm, 230=2.30 cm, 100=1.00 cm). Face Bolt: threaded steel screw through Wheel into Track.  
**Material**: Wheel — zinc alloy; Track — ABS; Bottom — varies (rubber, PC, metal); Face Bolt — steel  
**Mechanism**: Gen 2 (Metal Saga) opening architecture. Complete compatibility break with Gen 1. 4-layer stack: Face Bolt / Wheel / Track / Bottom. Face Bolt = threaded screw (secure vs press-fit). Wheel contributes ≈95% of I_total — Track and Bottom are I-irrelevant. Track height = discrete tunable variable (part number encodes height in 0.1 mm). Bottom three-class: Attack (flat/rubber), Defense (wide/ball), Stamina (sharp/free-spin). Gimmick Tracks (GB145 gyro balls, DF145 disk fins, etc.) add aerodynamic/gravitational effects. Wheel choice determines all spin retention.  
**Engine Note**: gen=MFB_MetalSystem; Wheel_I_share=95pct; trackHeight=partNumber×0.1mm; FB=threadedScrew; bottomClass=Attack/Defense/Stamina; complete_break_from_Gen1.

---

### [Case 365 — Hybrid Wheel System (HWS): Wheel Bifurcation, Energy Ring, and Two-Dimensional Customisation](./7%20case%20study.md#case-365)

**System**: MFB Gen 2 — Hybrid Wheel System (HWS)  
**Geometry**: Energy Ring (ER): r_outer≈2.3–2.7 cm, polycarbonate (ρ≈1200 kg/m³); Fusion Wheel (FW): r_inner≈0.6 cm, r_outer≈2.2 cm, zinc (ρ≈6600 kg/m³); FW lighter than one-piece Metal System Wheel. I_FW≈55% of I_total; I_ER≈31%; combined wheel assembly≈86% of I_total. Spin Track and Performance Tip: unchanged from Metal System.  
**Material**: ER — polycarbonate; FW — zinc alloy; Track — ABS; Tip — varies  
**Mechanism**: HWS bifurcates Metal System one-piece Wheel into FW (metal contact) + ER (PC outer-rim launcher hooks). ER at maximum radius: contributes ~31% I despite low PC density. 2D customisation matrix: any FW × any ER = independent contact geometry + outer-rim profile selection. FW contact protrusions may protrude past ER. PC is 1/5 density of zinc → ER shifts effective specific inertia inward vs metal ring at same r. Spin Track height convention unchanged (part number × 0.1 mm). Track and Tip roles identical to Metal System.  
**Engine Note**: gen=MFB_HWS; FW_I_share=55pct; ER_I_share=31pct; wheelAssembly_I=86pct; customMatrix=FW×ER; trackUnchanged=true.

---

### [Case 366 — 4D System: Sub-Part Fusion Wheel Reconfiguration, Mode-Change Contact Geometry, and Final Drive Centrifugal Tip Switch](./7%20case%20study.md#case-366)

**System**: MFB Gen 2 — 4D System  
**Geometry**: 4D FW sub-parts: PC Frame (r_outer≈2.2–2.5 cm, polycarbonate), Metal Frame (zinc), Core (ABS or light metal) — repositionable. F:D Bottom (Final Drive): combines Spin Track + Performance Tip into single unit with centrifugal tip-switch mechanism. PC Frame + ER together make polycarbonate I share largest in any Metal Saga system. I_wheel_assembly≈90–95% of I_total.  
**Material**: PC Frame — polycarbonate; Metal Frame — zinc/steel; Core — ABS; F:D — ABS  
**Gimmick**: 4D Fusion Wheel: 2–3 sub-parts repositionable pre-launch → discrete contact-geometry modes without replacing parts (Divided Wheel). F:D Final Drive: centrifugal mechanism switches tip contact regime automatically at spin threshold (Dynamic Drive). Two new performance variable classes vs HWS: (1) pre-launch mechanical mode selection at FW level; (2) mid-battle automatic tip-regime switching.  
**Mechanism**: 4D retains HWS 5-component stack but restructures FW and Bottom. Four 4D principles: Different Material (multi-material FW), Divided Wheel (repositionable sub-parts), Dynamic Drive (F:D auto tip switch), Deep Custom (expanded matrix). Wheel assembly still dominant at 90–95% I.  
**Engine Note**: gen=MFB_4D; FW_subParts=3; modeChange=preLaunch; FD_autoTipSwitch=midBattle; polycarbonate_I_share=highest_in_MetalSaga; I_wheel=90_95pct.

---

### [Case 367 — Synchrome System (Zero-G): Warrior Wheel Asymmetry, Three-Mode Flip Assembly, and Synchrome Inertia Amplification](./7%20case%20study.md#case-367)

**System**: MFB Gen 2 — Synchrome System (Zero-G)  
**Geometry**: Warrior Wheel (Chrome Wheel): r_outer≈2.2–2.6 cm, zinc, C₁ symmetry (asymmetric). Element Wheel (Crystal Wheel): r_outer≈2.3–2.7 cm, polycarbonate. Shogun Face Bolt: longer screw vs standard FB (extends through double-wheel Synchrome stack). Zero-G stadium floor tilts during battle.  
**Material**: Warrior Wheel — zinc alloy; Element Wheel — polycarbonate crystal; Shogun Face Bolt — steel  
**Gimmick**: Three battle modes from one assembly: (1) Chromium Up — Warrior Wheel at top, metal contact height (default); (2) Crystal Up — flip assembly, Element Wheel at contact height; (3) Synchrome — replace Element Wheel with second Warrior Wheel → double zinc mass → extreme I amplification. Synchrome assembly alignment: 180° offset → asymmetries partially cancel; 0° offset → asymmetries compound → max I imbalance and contact frequency.  
**Mechanism**: Warrior Wheel C₁ symmetry → dynamic imbalance, continuously varying contact angle φ(θ), uneven collision frequency per revolution. Synchrome mass amplification: two heavy Chrome Wheels (e.g. Ifraid+Diablo at ~102 g combined) → extreme I. Zero-G stadium tilts → requires CF (Circle Flat) tip designs maintaining contact on non-horizontal floor.  
**Engine Note**: gen=MFB_ZeroG_Synchrome; WarriorWheel_C1=asymmetric; modes=3(ChromeUp/CrystalUp/Synchrome); SynchromeAlignment=0deg_max/180deg_cancel; ZeroG_floor=tilts; CF_tip_required.

---

### [Case 368 — Burst System (Gen 3 Overview): Three-Component Architecture, Ratchet Burst Mechanism, and Subsystem Progression](./7%20case%20study.md#case-368)

**System**: Burst System Gen 3 (overview)  
**Geometry**: Layer: dual-piece PC (hard outer + softer inner); ratchet teeth inner ring; NFC chip slot (TT only). Disc (Forge Disc): all metal, r_outer≈2.2–2.8 cm, I budget second-largest; Core Disc variant accepts Disc Frames. Driver: upside-down pyramid body + internal spring; combines Track + Tip functions. Scope: Takara Tomy only (Hasbro excluded from Gen 3 case studies).  
**Material**: Layer — PC (dual hardness); Disc — metal; Driver — ABS + steel spring  
**Mechanism**: 3-component stack: Layer / Disc / Driver. New loss condition: Burst = Layer separates when collision torque > ratchet engagement threshold. Burst ratchet: Driver spring tabs engage Layer ratchet teeth; burst probability = f(tooth count, face angle, spring preload). Disc positioned below Layer (not between contact and base as in Metal Saga). Driver replaces Spin Track + Performance Tip as combined unit. Gen 3 subsystems: Initial Burst → DLS (Case 369) → GLS (Case 370) → Cho-Z (Case 371) → Gatinko (Case 372) → Superking (Case 373) → DB/BU (Case 374).  
**Engine Note**: gen=Burst_Gen3_Overview; components=3(Layer/Disc/Driver); burstMechanism=ratchet_tabs; Disc_below_Layer; TT_only_scope; subsystems=7.

---

### [Case 369 — Dual Layer System (DLS): Upper/Lower Layer Split, Thickness-Driven Inertia Increase, and Matched-Pair Constraint](./7%20case%20study.md#case-369)

**System**: Burst System Gen 3 — Dual Layer System (DLS)  
**Geometry**: DLS Layer: Upper Layer (hard PC, contact geometry) + Lower Layer (softer PC, ratchet housing), fastened by central screw (r≈0.3 cm, I negligible). Total thickness: t_DLS≈1.0–1.4 cm (vs t_initial≈0.6–0.8 cm, ≈40–75% thicker). I_Layer share increases from ≈34% to ≈42% of I_total vs initial Burst Layers.  
**Material**: Upper Layer — high-hardness PC (E≈2.4–2.8 GPa); Lower Layer — lower-hardness PC (E≈1.8–2.2 GPa); screw — metal  
**Mechanism**: Single architectural change: Layer splits into two matched-pair sub-pieces (Upper + Lower). Upper: primary contact geometry; 3D overhangs/undercuts enabled by separate die not achievable in single-shot mould. Lower: ratchet housing. Compliance step at screw interface damps impulse slightly before burst tabs loaded. Layer mass increases (more PC per two separate mouldings) → I_Layer +40–50% vs initial Burst. Upper/Lower sold as matched pairs — no inter-bey interchangeability (unlike Gatinko).  
**Engine Note**: gen=Burst_DLS; layerSplit=Upper+Lower; thickness_increase=40_75pct; I_Layer_share_42pct; matchedPair=noInterchangeability; screwJoint=compliance.

---

### [Case 370 — God Layer System (GLS): Two-Part Disc Architecture, Core Disc Protrusion I, and God Ability Layer Gimmicks](./7%20case%20study.md#case-370)

**System**: Burst System Gen 3 — God Layer System (GLS)  
**Geometry**: Core Disc: metal, numbered by protrusion count N; central annulus r_body≈0.4–1.6 cm, each protrusion extends to r_prot≈2.0–2.4 cm. Disc Frame: plastic ring, r_inner≈1.8 cm, r_outer≈2.5–2.8 cm. Naming: [Core Disc number][Frame first letter] e.g. 5G (5 Core + Glaive), 6M (6 Core + Meteor). Layer naming: lowercase first letter + uppercase beast name (gV = God Valkyrie). PC-only GLS Layer: I_Layer≈4.80×10⁻⁶ kg·m² (representative m≈17 g, r_o=2.2 cm).  
**Material**: Core Disc — metal; Disc Frame — ABS or PC; Layer — PC dual-hardness  
**Gimmick**: God Abilities — named gimmicks built into each God Layer: rubber contact zones, spring-actuated mode shifts, asymmetric protrusion configurations. These are the first Layer-level mechanical gimmicks in any Burst subsystem.  
**Mechanism**: Two simultaneous changes: (1) Disc splits into Core Disc (metal protrusions) + Disc Frame (plastic outer ring) — same density trade-off logic as HWS FW/ER split. Core protrusions carry metal mass to larger r than body alone. I_Core = I_body + I_protrusions. Disc Frame contributes I at max r with plastic density penalty (~5.5× lower than equivalent zinc). (2) God Ability gimmicks added to Layer. Shorthand notation (e.g. 5G, 6M) carries forward through all subsequent subsystems.  
**Engine Note**: gen=Burst_GLS; CoreDisc_protrusions=variable_N; DiscFrame_plastic; GodAbility=per_layer_gimmick; naming_convention=GLS_established; I_Layer_PC≈4.80e-6.

---

### [Case 371 — Cho-Z Layer System (CZL): Die-Cast Metal Layer Insert, Level Chip Compliance, and Awakening Wing Burst-Stop](./7%20case%20study.md#case-371)

**System**: Burst System Gen 3 — Cho-Z Layer System (CZL)  
**Geometry**: Cho-Z Layer: PC frame m≈10 g (r_i=0.6 cm, r_o=2.0 cm) + metal insert m≈10 g (r_i=1.8 cm, r_o=2.4 cm) → I_metal_insert≈4.50×10⁻⁶ kg·m²; I_ChoZ_Layer≈6.68×10⁻⁶ kg·m² → +39.2% vs GLS PC-only Layer. Layer I share≈55%; Disc assembly≈44%. Awakening wing deployment: extends effective r_outer by wing-arm mass contribution. r_turbo_wing≈3.7 cm at full deploy.  
**Material**: Layer PC shell — polycarbonate; metal insert — zinc alloy (die-cast); Level Chip — ABS hoop; Xtend Chip — ABS (Z Achilles exclusive)  
**Gimmick**: Awakening System: launch-strength-gated wing deployment at high spin. Wings deploy → ↑I (hoop term from wing arm mass) + engage Burst Stoppers (physical blocks preventing Driver tab ratchet-slip → burst mechanically impossible while wings deployed). Level Chip (beneath Layer face): adds mass at inner-to-mid r; three controllable properties: stability (CoM shift), locking (burst ratchet preload ↑), weight (ΔI). Xtend Chip (Z Achilles only): manual 3-mode Driver tip selection.  
**Mechanism**: First Burst subsystem with die-cast metal in Layer. Reverses Layer/Disc density relationship: Layer now PC+metal composite → Layer dominates I. Zinc metal insert: E≈43× ABS → contact patch r ↓20% vs PC, eliminates deformation energy loss. Cho-Z contact is harder and shorter than any prior Burst subsystem. Anime note: Special moves override Awakening/clutch limits via BeySpirit power.  
**Engine Note**: gen=Burst_ChoZ; metalInsert_in_Layer; I_Layer_6.68e-6; I_Layer_share=55pct; AwakenWings=BurstStopper; LevelChip=stabilityLockingWeight; animeOverride=BeySpirit.

---

### [Case 372 — Gatinko Layer System (GT): Three-Part Layer Modularity, Mugen Lock Free-Spin Burst Inhibition, and Power Core Electric Driver Spin Modulation](./7%20case%20study.md#case-372)

**System**: Burst System Gen 3 — Gatinko Layer System (GT)  
**Geometry**: GT Chip: r_outer≈1.3–1.5 cm, m≈3–5 g, ABS/PC; carries bayonet ring. Weight: r_inner≈0.9 cm, r_outer≈1.9–2.2 cm, m≈5–9 g (zinc or heavy ABS). Base: r_outer≈2.3–2.7 cm, m≈6–10 g, ABS. I shares (representative): Chip≈9%; Weight≈36%; Base≈55%. Bayonet interface: quarter-turn lock; repeatable angular positioning ±1–2°.  
**Material**: GT Chip — ABS/PC; Weight — zinc or heavy ABS; Base — ABS; Mugen Lock hub — ABS  
**Gimmick**: Mugen Lock System (mid-series): free-spinning central hub mechanically decouples Disc from outer Layer body under normal load → no burst-threshold torque accumulates. Vulnerability indicator turns red when perimeter tab retracts → single-strike burst possible (stopper jams disc). Power Core System: motorised or spring-actuated Driver shafts whose output speed = f(launch impulse or spring energy) → launch mechanics couple into in-battle tip behaviour.  
**Mechanism**: First Burst subsystem with 3-part interchangeable Layer: Chip (identity + bayonet) / Weight (inertia adjuster, no contact) / Base (contact geometry + burst ratchet + driver socket). Swap only Base to change attack/stamina character while retaining Chip+Weight. Bayonet: hard-stop angular repeatability critical for asymmetric Weights.  
**Engine Note**: gen=Burst_Gatinko; layerParts=3(Chip/Weight/Base); Base_dominates_I; MugenLock=freeSpin_decouples_burst; PowerCore=motorizedDriver; bayonet=repeatable.

---

### [Case 373 — Superking Layer System (SK): Ring-Dominant Three-Part Architecture, Limit Break Centrifugal Blade Deployment, and Free-Spinning Ring Burst Decoupling](./7%20case%20study.md#case-373)

**System**: Burst System Gen 3 — Superking Layer System (SK)  
**Geometry**: Superking Chip: r_outer≈1.2–1.5 cm, m≈3–4 g, ABS/PC. Ring: r_inner≈1.0 cm, r_outer≈2.7 cm, m≈11–14 g, ABS or rubber blend → dominant I. Chassis: r_inner≈0.4 cm, r_outer≈1.9 cm, m≈5–7 g, ABS. I shares (representative): Chip≈6%; Ring≈62%; Chassis≈32%. Limit Break Burn Ring: 4 blades deploy centrifugally above threshold. Volcano Ring: 5 primary + 5 secondary blades (cam pivot). The End Ring: outer section free-spins on bearing.  
**Material**: Ring — ABS or rubber blend; Chassis — ABS; Superking Chip — ABS/PC  
**Gimmick**: Limit Break System (mid-series): 3 specialised Rings integrating Chassis boss → reduces to 2-part assembly (Chip + LB Ring). Burn Ring: blade deploy → ↑I + wider contact arc. Volcano Ring: cam pivot reveals secondary blades → 5→10 contact faces, double collision frequency per revolution. The End Ring: outer partition free-spins on bearing → impulse accelerates outer partition only; transmitted torque to ratchet = I_chassis / I_Ring_outer fraction → stamina-class burst-resist without state-switching.  
**Mechanism**: Restructures Gatinko roles: Ring collapses Weight (inertia) + Base (contact) into single outer piece — outermost component is Ring (contact + dominant I). Chassis is inner structural skeleton (ratchet + driver socket) at smaller r. Shift from Gatinko: largest-r component now also carries contact blades.  
**Engine Note**: gen=Burst_Superking; Ring_I_share=62pct; Ring=contact+inertia(combined); LimitBreak_3variants; TheEnd=bearingDecoupled; collisionFreq_Volcano=2x.

---

### [Case 374 — Dynamite Battle / BU Layer System: Blade-Dominant Three-Part Architecture, Mode-Invariant Inertia, and Evolution Gear Stacking](./7%20case%20study.md#case-374)

**System**: Burst System Gen 3 — Dynamite Battle (DB) + Burst Ultimate (BU)  
**Geometry**: DB Blade: r_inner≈0.6 cm, r_outer≈2.8 cm, m≈15 g, ABS + rubber inserts → dominant I component. DB Armor: r_inner≈0.5 cm, r_outer≈2.1 cm, m≈8 g, ABS. Dynamite Core: r_inner≈0.3 cm, r_outer≈1.3 cm, m≈5 g, ABS. Low Mode (−): Core at bottom; High Mode (+): Armor at bottom, raises contact height by Armor axial thickness. Mode switching changes no radial position → I_total identical in both modes (annular formula depends only on mass and r). BU Blade: larger r and heavier than DB Blade → higher I_Layer share.  
**Material**: Blade — ABS + rubber inserts; Armor — ABS; Core — ABS  
**Gimmick**: Evolution Gear (EG) sub-system: named clip-on mass accessories (F, V, S, L, D, A, H, VS Gears) mount at fixed r on Blade or Driver shaft. Each adds discrete ΔI. Stackable to named ceiling: 1→2→3→Perfect Gear (4 standard gears); Ultimate Gear (4 special gears D/A/H/VS). VS Gear mounts on Driver tip shaft (Venture/Adventure) — only EG that modifies I at Driver level rather than Layer level.  
**Mechanism**: DB/BU: 3-part Layer (Core/Blade/Armor) with physically reversible assembly order for High/Low Mode. Mode is pure contact-height strategy (not I change). High Mode: raises CoM by Armor thickness → faster precession at low spin, destabilizes sooner. Low Mode: lower contact plane. High Mode gyroscopic coupling: precession rate Ω_p = τ/(I·ω); torque arm d is mode-dependent. BU extends DB with larger-radius BU Blade and A/H Gear exclusive ports. Anime note: Special moves override DB/BU mechanical limits via BeySpirit power.  
**Engine Note**: gen=Burst_DB_BU; modeInvariant_I=true; modeChange=contactHeight_only; HighMode_CoM_higher=fasterPrecession; EG_stackable_to_Perfect/Ultimate; VS_Gear=Driver_level; animeOverride=BeySpirit.

---

## CS8 — Cases 375–415 {#cs8}
Source: `8 case study.md`

---

### [Case 375 — Shark Edge (BX Blade): C₃ Dual-Face Attack Geometry, Upper Attack Force Decomposition, and Recoil-Driven Spin Depletion](./8%20case%20study.md#case-375)

**System**: Beyblade X (BX)  
**Geometry**: C₃ symmetry; m≈34.5 g; 3 fins: hub m≈9 g (r_i=0.3 cm, r_o=1.2 cm), fins m≈25.5 g (r=1.2–2.6 cm); I_blade≈1.031×10⁻⁵ kg·m²; I_system≈1.106×10⁻⁵ kg·m² (93.2% blade). Fin arc: 40° each; inter-fin gap: 80°. Upper face α≈35° above horizontal; smash face φ≈20° from radial. r_o≈2.6 cm.  
**Material**: zinc alloy (E≈100 GPa, ρ≈6600 kg/m³)  
**Contact Points**: Upper attack face (α=35°): J_horiz=0.819J, J_vert=0.574J → lifts opponent, reduces burst T_burst_eff by 12.5%. Smash face (φ=20°): smash=cos20°=0.940, recoil=sin20°=0.342. Zinc-on-zinc contact: peak pressure≈316 MPa (exceeds elastic limit → surface micro-yielding).  
**Mechanism**: Glass cannon: recoil decay≈−304 rad/s² at contact; blended ≈−66.6 rad/s²; battle window≈10.5 s. Must ring-out or burst within window. Counter: PhoenixWing (Case 377) — SE's aggressive Bit drains SE faster than PW's stamina Bit drains PW.  
**Engine Note**: symm=C3; m_g=34.5; I_blade=1.031e-5; smashFraction=0.940; recoilFraction=0.342; upperAlpha_deg=35; battleWindow_s=10.5; glassCannon.

---

### [Case 376 — Dran Dagger (BX Blade): C₆ Barrage Frequency, Moderate-φ Flat-Blade Contact, and Stalemate Failure Condition](./8%20case%20study.md#case-376)

**System**: Beyblade X (BX)  
**Geometry**: C₆ symmetry; m≈34.9–35.7 g; 6 swept flat-dagger blades; r_o≈2.4 cm (estimated); I_system≈1.031×10⁻⁵ kg·m². Contact face φ≈40° from radial. 50% arc coverage.  
**Material**: zinc alloy  
**Contact Points**: φ=40°: smash=cos40°=0.766, recoil=sin40°=0.643. C₆ frequency: f=ω×6/(2π)≈573 Hz at ω=600 rad/s. 6 moderate-push per revolution.  
**Mechanism**: Barrage failure mode: if per-hit impulse J×cos(40°) < m_opp×v_rim, no single strike ejects opponent → cumulative shove absorbed by high-I defense or free-spin stamina. C₆ provides 50% annular coverage → more uniform I tensor → suppresses dynamic imbalance vs C₃. Flat-dagger trailing surface deflects incoming impacts tangentially (defensive side effect).  
**Engine Note**: symm=C6; m_g=35.3; smashFraction=0.766; recoilFraction=0.643; stalemateRisk=highI_opponent; uniformI=C6_advantage.

---

### [Case 377 — Phoenix Wing (BX Blade): Weight-Class Inertia Dominance, 9-Tab Burst Hardening, Gap Vulnerability, and Top-Heavy Precession Onset](./8%20case%20study.md#case-377)

**System**: Beyblade X (BX)  
**Geometry**: C₃ symmetry; m≈39.0 g (Mold 3); hub m≈9 g (r_i=0.4 cm, r_o=1.3 cm); wings m≈30 g (r=1.3–2.8 cm); I_blade≈1.400×10⁻⁵ kg·m²; I_system≈1.474×10⁻⁵ kg·m² (+35.8% vs Shark Edge). Wing arc: 55° each (45.8% coverage); inter-wing gap: 65°. r_o≈2.8 cm. z_CoM≈4.62 mm above mid-plane.  
**Material**: zinc alloy  
**Contact Points**: Smash face φ≈25°: smash=cos25°=0.906, recoil=sin25°=0.423. Upper attack α≈40°: J_vert=0.643J (largest upper-attack fraction in BX lineup). Wide wing arc 55° → 1.375× contact duration vs Shark Edge → single-hit ring-out potential (Δv≈0.138 m/s, borderline).  
**Mechanism**: I-dominant: absorbs hits with less spin loss than all lighter BX blades. Gap vulnerability: 65° gap exposes Ratchet at r≈1.3 cm; 9-tab Ratchet at gap requires J≈0.235 N·s to burst (achievable but non-trivial). Precession onset: ω≈120 rad/s (≈1145 RPM) — earlier than flat-profile blade (≈61 rad/s). Recommended: 9-60 or 5-60 Ratchet to lower CoM height.  
**Engine Note**: symm=C3; m_g=39.0; I_system=1.474e-5; ratchetTabs=9; topple_rad_s=120; wingArc_deg=55; Mold3_I_increase=3.6pct.

---

### [Case 378 — Cobalt Drake (BX Blade): C₄ Blocky-Rectangle Contact, Dual-Role Deflection and Moderate Smash, and Round-Profile Gyroscopic Balance](./8%20case%20study.md#case-378)

**System**: Beyblade X (BX)  
**Geometry**: C₄ symmetry; m≈37.1 g; hub m≈9 g (r_i=0.4 cm, r_o=1.1 cm); 4 blocks m≈28.1 g (r=1.1–2.6 cm); I_blade≈1.077×10⁻⁵ kg·m²; I_system≈1.151×10⁻⁵ kg·m². Block arc: 40° each (44.4% coverage); inter-block concavity: 50° (shallow). r_o≈2.6 cm. z_CoM≈4 mm above mid-plane.  
**Material**: zinc alloy  
**Contact Points**: φ≈42°: smash=cos42°=0.743, recoil=sin42°=0.669. C₄ frequency: f=ω×4/(2π). Round/octagonal perimeter → incoming attacks glance rather than lock in concavity → minimises burst torque coupling per event.  
**Mechanism**: Defensive character from deflection geometry. Near-circular outer profile: more uniform I than C₃ fins → suppresses dynamic imbalance. Precession onset: ω≈83 rad/s (intermediate: better than Phoenix Wing 120 rad/s, worse than flat blade 61 rad/s).  
**Engine Note**: symm=C4; m_g=37.1; I_system=1.151e-5; smashFraction=0.743; topple_rad_s=83; roundProfile=deflectionDefense.

---

### [Case 379 — Dran Buster (UX Blade): C₂ Oval One-Shot Maximisation, 1-Tab Ratchet Glass-Cannon Architecture, and Impulse-Duration Amplification](./8%20case%20study.md#case-379)

**System**: Beyblade X (UX)  
**Geometry**: C₂ oval; m≈36.75 g; 2 lobes m≈20 g (r_CoM≈2.2 cm); hub+bridge m≈16.75 g (r=0.4–1.4 cm); I_blade≈1.118×10⁻⁵ kg·m²; I_system≈1.192×10⁻⁵ kg·m². Lobe arc≈90° each; r_major≈2.8 cm; 50% arc coverage at poles. Smash face φ≈12° from radial.  
**Material**: zinc alloy  
**Contact Points**: φ=12°: smash=cos12°=0.978 (highest in lineup), recoil=sin12°=0.208 (lowest). Contact duration C₂/C₃ ratio≈2.06 → J_DB≈2.06×J_SE_ref. Single-hit ring-out: Δv≈0.224 m/s (1.49× ring-out threshold of 0.15 m/s).  
**Mechanism**: 1-tab Ratchet: T_burst≈2.65×10⁻³ N·m (minimum in lineup). Gap burst: J≈0.204 N·s to burst through oval gap — achievable. Recoil decay≈−215 rad/s²; battle window≈13.6 s. One clean hit wins; miss → spin-out before stamina opponents. UX-01 paired with 1-60A Ratchet-Bit.  
**Engine Note**: symm=C2_oval; m_g=36.75; I_system=1.192e-5; smashFraction=0.978; ratchetTabs=1; oneShot_ringOut_ms=0.224; battleWindow_s=13.6.

---

### [Case 380 — Hells Hammer (UX Blade): C₃ Down-Smash Geometry, Negative-Elevation Impulse Decomposition, and Height-Restricted Contact Window](./8%20case%20study.md#case-380)

**System**: Beyblade X (UX)  
**Geometry**: C₃ symmetry; m≈33.0 g (lightest BX/UX blade); 3 broad curved wings sweeping downward below mid-plane. Geometric tip r_3D≈2.7 cm; effective horizontal projection r_eff≈2.4 cm. Downward slope α≈−25° from horizontal. I_system≈8.63×10⁻⁶ kg·m² (−22% vs Dran Dagger; −41% vs Phoenix Wing). UX-02 paired with 3-70H Ratchet-Bit.  
**Material**: zinc alloy  
**Contact Points**: Down-smash 3D normal: smash=cos(φ)×cos(α), recoil=sin(φ)×cos(α), downward=sin(α). Downward component drives opponent Layer into floor → ↑Bit friction → ↑spin decay → presses contact zone down into Ratchet tab-exposure region.  
**Mechanism**: Specialist Slam (Down Smash). Height-critical: H-type Bit at 70 mm total height positions wing contact at 54 mm → contacts upper Layer (wrong target, misses Ratchet zone). At ≤60 mm total height → descends to 38–50 mm → aligns with lower Layer/Ratchet for correct Slam. Light I = fastest self-depleter. Recommended: sub-60 mm stable Bit.  
**Engine Note**: symm=C3; m_g=33.0; I_system=8.63e-6; downSmash=true; downAlpha_deg=−25; heightCritical=60mm_or_less; lightestBXUX.

---

### [Case 381 — Wizard Rod (UX Blade): C₅ Outward Weight Distribution, Gyroscopic Angular-Momentum Reserve, and Attack-Deflection AVA Superiority](./8%20case%20study.md#case-381)

**System**: Beyblade X (UX)  
**Geometry**: C₅ near-circular; m≈35.5 g; outer rim mass≈73% of blade mass; r_o≈2.8 cm (rim r_i≈2.0 cm, r_o≈2.8 cm); hub r≈0.4–1.2 cm; I_system≈1.742×10⁻⁵ kg·m² (highest in BX/UX lineup, +18% vs Phoenix Wing, 2.02× Hells Hammer). UX-03 paired with 5-70DB.  
**Material**: zinc alloy  
**Contact Points**: 5 slight bump-protrusions on near-circular rim; φ≈5° (near-circular); R_rim≈2.8 cm (large curvature → shallow Hertz patch). Per-event J≈0.0015 N·s; Δω≈0.20 rad/s per contact. Attacker recoil on circular rim: fin redirected nearly tangentially → large recoil fraction on attacker.  
**Mechanism**: OWD maximises I → slowest spin decay: dω/dt≈−5.99 rad/s² (DB Bit); theoretical window≈117 s. L=I×ω=6.97×10⁻³ kg·m²/s at ω=400 rad/s (57% more gyro resistance than Shark Edge). 5-tab Ratchet T_burst≈1.326×10⁻² N·m. Optimal: DB Bit for maximum stamina and wall-orbit gyroscopic stability.  
**Engine Note**: symm=C5_nearCircular; m_g=35.5; I_system=1.742e-5; OWD=73pctRim; spinDecay_rad_s2=−5.99; ratchetTabs=5; stamina_window_s=117; highest_I_BXUX.

---

### [Case 382 — Cobalt Dragoon (BX Blade): Left-Spin Counter-Rotation Velocity Amplification, C₄ Upper-Blade Bit-Burst Mechanics, and Hollow-Section Inertia Deficit](./8%20case%20study.md#case-382)

**System**: Beyblade X (BX)  
**Geometry**: C₄ left-spin; m≈37.8 g; 4 upper-sloped hollow wings: outer shells m≈20 g (r_i=1.9 cm, r_o=2.6 cm); hollow zone r=1.0–1.9 cm (through-holes). I_system≈1.289×10⁻⁵ kg·m². r_o≈2.6 cm. α≈30° above horizontal; φ≈25° from radial. BX-34 paired with 2-60C.  
**Material**: zinc alloy (hollowed mid-radius)  
**Contact Points**: Counter-spin velocity amplification: v_rel_counter=r×(ω_L+ω_R) vs v_rel_same≈0→0.5 m/s → 40× amplification factor at equal ω=400 rad/s. 3D normal: smash=cos25°×cos30°≈0.784, recoil=sin25°×cos30°≈0.366, upper-lift=sin30°=0.500. Bit Burst: large J_counter → angular impulse exceeds Ratchet-Bit retention torque → Bit physical ejection.  
**Mechanism**: 2-tab Ratchet: T_burst≈5.30×10⁻³ N·m (second-lowest). Self-burst risk through C₄ gaps if KO missed. Optimal: hard-launch early KO so ω_L >> ω_R at first contact. Hollow I_deficit penalises same-direction spin equalization.  
**Engine Note**: symm=C4_leftSpin; m_g=37.8; I_system=1.289e-5; counterSpinAmplification=40x; ratchetTabs=2; BitBurst=possible; hollowZone_I_deficit.

---

### [Case 383 — Aero Pegasus (UX Blade): C₃ Wide-Wing Smash-Upper Duality, Double-Metal-Coat Mass Premium, and Top-Heavy Nutation Onset](./8%20case%20study.md#case-383)

**System**: Beyblade X (UX)  
**Geometry**: C₃ symmetry; m≈38.1 g (Double Metal Coat adds ≈0.3 g); 3 wide smooth wings: m≈27 g (r_i=1.4 cm, r_o=3.0 cm); hub m≈11.1 g. I_system≈1.539×10⁻⁵ kg·m² (2nd highest, after Wizard Rod). Wing arc≈90° each; gap≈30°; r_o≈3.0 cm. z_CoM_wings≈3.5 mm above mid-plane. UX-00 paired with 3-70A.  
**Material**: zinc alloy (Double Metal Coat)  
**Contact Points**: Primary smash: φ≈22°, α≈15° (upper). Contact normal: smash=cos22°×cos15°≈0.895J; upper=sin15°≈0.259J; recoil=sin22°×cos15°≈0.361J. Wide-wing 90° arc → long contact duration.  
**Mechanism**: Precession at ω=100 rad/s: ω_precess≈3.42 rad/s (visible tilting). Nutation onset≈9.44 rad/s (near-stopped). Stamina: dω/dt≈−7.29 rad/s² on Ball → near-Wizard Rod performance. Most versatile blade: attack + stamina + defense-capable. 3-tab Ratchet; C₃ 120° gaps expose Ratchet at 70 mm height.  
**Engine Note**: symm=C3; m_g=38.1; I_system=1.539e-5; doubleMetalCoat=0.3g_premium; smashDual=true; stamina_decay=7.29rad_s2; nutationOnset=9.44rad_s.

---

### [Case 384 — Silver Wolf (UX Blade): Specialist Free Spin, Free-Spin Ring Contact Decoupling, Bearing-Reduced Tip Friction, and Top-Heavy Orbital Instability](./8%20case%20study.md#case-384)

**System**: Beyblade X (UX)  
**Geometry**: Composite: zinc C₃ core m≈22 g (r_i=1.0 cm, r_o=2.6 cm) + free-spin PC ring m≈6.65 g (r_i=2.6 cm, r_o=3.0 cm) on bearing. Total m≈36.65 g. I_main≈8.757×10⁻⁶ kg·m² (zinc only; decoupled ring not counted). z_CoM≈4 mm above mid-plane; nutation onset≈11.7 rad/s. UX-08 paired with 3-80FB.  
**Material**: Zinc core + polycarbonate free-spin outer ring + bearing  
**Gimmick**: Free-spin ring: opponent strikes ring → ring rotates freely → main assembly Δω=0 (complete decoupling). FB Bit: bearing decouples ball tip from Ratchet → tip spin rate ≠ assembly spin rate → μ_bearing≈0.005 vs μ_ball≈0.10 → dω/dt≈−0.615 rad/s² → theoretical window≈1138 s. Spin-equalization paradox: cannot gain or lose spin from opponents.  
**Mechanism**: Dual decoupling: (1) outer ring absorbs blade-level collisions; (2) FB Bit absorbs tip-friction torque. 3-tab Ratchet. Optimal Bit: FB for maximum decoupling. Liability: no XD capability; 80 mm default height worsens gap exposure.  
**Engine Note**: symm=C3_zincCore+freeSpin_ring; m_g=36.65; I_main=8.757e-6; ringDecouple=true; FBBit_decay=0.615rad_s2; spinEqualizationImmune; bearing_mu=0.005.

---

### [Case 385 — Impact Drake (UX Blade): Specialist Rubber Attack, Bi-Material C₄ Contact Mechanics, Anti-Slide Condition, and Rubber Self-Friction Spin Budget](./8%20case%20study.md#case-385)

**System**: Beyblade X (UX)  
**Geometry**: C₄ bi-material; m≈38.85 g; zinc wings upper m≈26 g (r_i=1.2 cm, r_o=2.7 cm); rubber inserts lower section (r≈2.2–2.6 cm). I_system estimated ≈1.3×10⁻⁵ kg·m² (approximate). φ≈35°; α≈25° (zinc upper zone). r_o≈2.7 cm. UX-11 paired with 9-60LR.  
**Material**: Zinc alloy upper contact + rubber lower contact inserts (E_rubber≈0.002 GPa; μ_rubber≈0.80; e_rubber≈0.25)  
**Contact Points**: Anti-slide: μ_rubber=0.80 > tan(35°)=0.70 → no tangential slide at φ=35° (zinc would slide at φ>16.7°). Extended contact duration: rubber E×28-fold larger contact patch (a_rubber≈0.065 cm) → t_contact≈15 ms → progressive Ratchet spring loading ("sniping" the Ratchet at low height). Rubber does NOT increase J vs zinc (e=0.25 vs e=0.65 → lower J_rubber).  
**Mechanism**: 9-tab Ratchet (max burst resistance, same as Phoenix Wing). Severe self-friction: Δω≈8.69 rad/s per hit + LR Bit μ≈0.45 r_tip=0.6 cm → dω/dt_tip≈−70.3 rad/s²; battle window≈4.2 s (shortest in lineup). Precession onset≈10.5 rad/s. Glass-cannon: wins quickly or spins out.  
**Engine Note**: symm=C4_biMaterial; m_g=38.85; rubber_antiSlide=true; extendedContact_15ms=true; ratchetTabs=9; battleWindow_s=4.2; shortestWindow_lineup.

---

### [Case 386 — M-85 (BX Ratchet): Metal-Ring Inertia Augmentation, O-Type Snap Joint Binary Burst Mechanics, and Weight Pre-Load Burst Resistance](./8%20case%20study.md#case-386)

**System**: Beyblade X (BX) — Ratchet  
**Geometry**: 5-protrusion (C₅); height=8.5 mm (tallest in lineup); m=10.6 g (heaviest); metal ring riveted to underside (m_ring≈3.6 g, r_i≈0.5 cm, r_o≈1.5 cm); I_M85≈1.148×10⁻⁶ kg·m² (+55% vs standard 5-tab reference 7.42×10⁻⁷ kg·m²). BX-44 (TT) / G3028 (Hasbro).  
**Material**: PC body + metal ring (inner)  
**Mechanism**: O-type snap joint ("Simple Type Ratchet") — single-position snap ring; NO rotation mechanism → binary burst (full hold or catastrophic release; no progressive partial-burst states). Snap ring yield governs vs tab-spring. Gravitational pre-load: F_preload≈0.0236 N → ΔT_burst≈2.50×10⁻⁴ N·m ≈+1.9%. ΔI≈4.06×10⁻⁷ kg·m² over standard → +3.5% system stamina. T_burst = tab formula NOT applicable (no tabs); burst = snap ring deflection yield.  
**Engine Note**: type=Ratchet_BX; protrusions=5; height_mm=8.5; mass_g=10.6; joint=OType_snap; I=1.148e-6; binaryBurst; metalRing_underside.

---

### [Case 387 — 2-60 (BX Ratchet): Minimum-Tab Burst Catastrophe, Blocky Protrusion Gap Geometry, and Tall-Height Contact-Zone Mismatch](./8%20case%20study.md#case-387)

**System**: Beyblade X (BX) — Ratchet  
**Geometry**: 2-protrusion (C₂); height=6.0 mm; m=6.2 g; I≈6.22×10⁻⁷ kg·m²; protrusion arc≈25° (blocky/wider than CG render); inter-protrusion gap≈155°; gap fraction≈86.1% (highest in lineup). BX-34 (TT) / G1491 (Hasbro). Paired: Cobalt Dragoon (Case 382).  
**Material**: PC  
**Mechanism**: T_burst=2×F_spring×cos(β)×r = ≈5.31×10⁻³ N·m (2nd lowest after 1-tab). Single moderate contact (J≈0.060 N·s at r=2.6 cm) → τ_peak≈7.80×10⁻³ N·m → 47% above 2-tab threshold → immediate burst. Blocky protrusion: wider leading face + greater protrusion → wider burst-unlock angular window. Gap fraction 86%: 86% of angular orientations vulnerable. Production discrepancy: shipped protrusions wider/further than CG spec.  
**Engine Note**: type=Ratchet_BX; protrusions=2; height_mm=6.0; mass_g=6.2; joint=rotatingTab; T_burst=5.31e-3; gapFraction=86pct; cobaltDragoon_paired.

---

### [Case 388 — 4-50 (UX Ratchet): Minimum-Height Profile Optimisation, Low-Stack Customisation Mechanics, and 4-Tab Burst Equilibrium](./8%20case%20study.md#case-388)

**System**: Beyblade X (UX) — Ratchet  
**Geometry**: 4-protrusion (C₄); height=5.0 mm (lowest in entire BX/UX lineup); m=5.9 g; I≈5.919×10⁻⁷ kg·m² (lowest PC-only Ratchet). UX-15 (TT) / G2731 (Hasbro).  
**Material**: PC (no metal ring)  
**Mechanism**: T_burst=4-tab≈1.061×10⁻² N·m (80% of 5-tab threshold; moderate risk). Dominant purpose: stack-height minimisation — places Blade 1.5–3.0 mm below standard-height opponents → height-mismatch evasion → hits land below opponent's burst-locking geometry. Axial thinness (5 mm) reduces off-axis tilt torque moment arm → marginally improves tilt-induced burst resistance. I contribution (5.9×10⁻⁷) = only 4–6% of system I → Ratchet mass savings <0.3% system I variation.  
**Engine Note**: type=Ratchet_UX; protrusions=4; height_mm=5.0; mass_g=5.9; joint=rotatingTab; T_burst=1.061e-2; minimumHeight_lineup; heightEvasion.

---

### [Case 389 — 4-55 (CX Ratchet): O-Type Snap Joint on a 4-Protrusion Body, Lightest-Ratchet Inertia Minimum, and Binary Burst at the Mass Floor](./8%20case%20study.md#case-389)

**System**: Beyblade X (CX) — Ratchet  
**Geometry**: 4-protrusion (C₄); height=5.5 mm (mid-low); m=4.8 g (lightest production Ratchet); I≈4.816×10⁻⁷ kg·m² (system floor). CX-02 (TT) / G1679 (Hasbro).  
**Material**: PC (no metal ring)  
**Mechanism**: O-type snap joint ("Simple Type Ratchet") — same mechanism as M-85. T_snap≈1.44 N·m (136× the 4-tab progressive threshold). Binary burst: hold or catastrophic snap. 4-protrusion C₄ geometry: 90° sectors, 20° protrusion arc, 70° inter-snap gap — gap is irrelevant for snap-joint (radially symmetric retention). Minimum mass for builds prioritising snap-joint burst immunity over system inertia.  
**Engine Note**: type=Ratchet_CX; protrusions=4; height_mm=5.5; mass_g=4.8; joint=OType_snap; T_snap=1.44Nm; lightestRatchet; binaryBurst.

---

### [Case 390 — 7-70 (UX Ratchet): Maximum-Tab Burst Suppression, Tallest Protrusion Height-Tier Mechanics, and Gap-Geometry Defence at C₇ Spacing](./8%20case%20study.md#case-390)

**System**: Beyblade X (UX) — Ratchet  
**Geometry**: 7-protrusion (C₇); height=7.0 mm (tallest standard rotating-tab tier); m=7.3 g; I≈7.324×10⁻⁷ kg·m². 40° sector repeat; protrusion arc≈20°; gap≈31.4°; gap fraction=61.1% (lowest rotating-tab in lineup). UX-10 (TT) / G3195 (Hasbro).  
**Material**: PC  
**Mechanism**: T_burst=7-tab≈1.857×10⁻² N·m (+40% over 5-tab; 3.5× the 2-60). Highest rotating-tab burst resistance. Gap fraction 61% vs 2-60's 86% → 36% less vulnerable orientations. Diminishing returns: each additional tab adds +2.65×10⁻³ N·m linearly (not multiplicative). Preferred over snap-joint for players wanting progressive burst feedback.  
**Engine Note**: type=Ratchet_UX; protrusions=7; height_mm=7.0; mass_g=7.3; joint=rotatingTab; T_burst=1.857e-2; gapFraction=61pct; maxTab_rotatingFamily.

---

### [Case 391 — 7-80 (BX Ratchet): 7-Tab Burst Threshold at Maximum Standard Height, Heavy-Body Inertia Ceiling, and Tall-Stack Contact-Zone Elevation](./8%20case%20study.md#case-391)

**System**: Beyblade X (BX) — Ratchet  
**Geometry**: 7-protrusion (C₇); height=8.0 mm (tallest PC rotating-tab; only M-85 at 8.5 mm is taller); m=7.8 g (heaviest PC rotating-tab); I≈7.824×10⁻⁷ kg·m² (+6.8% over 5-tab reference). 40° sector repeat; gap fraction=61.1% (same as 7-70). BX-39 (TT) / G1675 (Hasbro).  
**Material**: PC  
**Mechanism**: T_burst=7-tab≈1.857×10⁻² N·m (same as 7-70; tab count unchanged). Height 8.0 mm: contact zone at z≈8.0 mm → 1 mm higher than 7-70 → engages fins reaching z>7.0 mm. Optimal for tall-profile Blades (Phoenix Wing, Aero Pegasus). For short-profile Blades: no height advantage over 7-70; ΔI≈4×10⁻⁸ kg·m² only additional value.  
**Engine Note**: type=Ratchet_BX; protrusions=7; height_mm=8.0; mass_g=7.8; joint=rotatingTab; T_burst=1.857e-2; tallestPC_rotatingTab; pairedWith=tallBlades.

---

### [Case 392 — 1-60 (UX Ratchet): Minimum-Tab Burst Floor, Single-Protrusion Contact Frequency Collapse, and Concentrated-Impact Attack Pairing](./8%20case%20study.md#case-392)

**System**: Beyblade X (UX) — Ratchet  
**Geometry**: 1-protrusion (C₁); height=6.0 mm; m=6.0 g; I≈6.0×10⁻⁷ kg·m² (estimated). Gap arc=340° (94.4% of circumference). UX-01 (paired with Dran Buster 1-60A).  
**Material**: PC  
**Mechanism**: T_burst_1tab≈2.651×10⁻³ N·m (minimum rotating-tab). Light contact J=0.010 N·s at r=2.6 cm → τ_peak≈0.130 N·m → 49× threshold → immediate burst. Contact frequency collapse: f=ω/(2π)≈63.7 Hz at ω=400 (vs 318 Hz for 5-tab). Single tab accumulates kinetic energy from 340° free rotation → impulse spike at engagement. Paired with Dran Buster: deliberate attack trade-off — one decisive hit before opponent can burst back.  
**Engine Note**: type=Ratchet_UX; protrusions=1; height_mm=6.0; mass_g=6.0; joint=rotatingTab; T_burst=2.651e-3; gapFraction=94pct; pairedWith=DranBuster.

---

### [Case 393 — 1-70 (Ratchet): Single-Tab Contact Dynamics at Tall Height, Gap-Arc Wobble Amplification, and Balance-Destabilising Asymmetry](./8%20case%20study.md#case-393)

**System**: Beyblade X (Ratchet)  
**Geometry**: 1-protrusion (C₁); height=7.0 mm; m≈6.0 g (estimated ±5%); gap arc=340°. C₁ mass imbalance: Δr_CoM≈1.25 mm from geometric centre. Note: product code not confirmed at time of writing.  
**Material**: PC (estimated)  
**Mechanism**: T_burst_1tab≈2.651×10⁻³ N·m (identical to 1-60). Height advantage: engages tall-fin Blades (z>6.0 mm). Height disadvantage: raises CoM by 0.5 mm → precession at higher ω (ω_nut ∝ 1/h → nutates earlier than 1-60). C₁ imbalance: F_imbal≈1.20 N at ω=400 rad/s → once-per-revolution wobble forcing. Use case: niche — attack rhythm synchroniser via imbalance dynamics.  
**Engine Note**: type=Ratchet; protrusions=1; height_mm=7.0; mass_g=approx6; joint=rotatingTab; T_burst=2.651e-3; C1_imbalance=1.25mm_offset; worsePrecession_than_1_60.

---

### [Case 394 — 0-60 (Ratchet): Zero-Protrusion Friction-Retention Free-Spin Mechanics, Tab-Formula Breakdown, and Rotational Decoupling Burst Immunity](./8%20case%20study.md#case-394)

**System**: Beyblade X (Ratchet)  
**Geometry**: 0-protrusion (C∞, rotationally symmetric); height=6.0 mm; m≈5.5 g (estimated ±8%); smooth flat top face. Note: product code not confirmed at time of writing.  
**Material**: PC (estimated)  
**Mechanism**: T_burst_tab_formula=0 (N=0 → no tab retention). Friction-only retention: T_friction=μ_PC×F_axial×r_eff≈0.30×15N×0.0095m≈0.0428 N·m (≈16.2× the 5-tab threshold). But failure mode is gradual slip (not discrete burst): Blade spins freely relative to Ratchet when τ>T_friction, absorbing contact impulse through sliding rather than tab cam-over. No conventional burst (Blade does not eject). XD mechanism also lost during slip (Blade-Bit coupling needed for XD). Best as passive stamina/balance avoiding contact.  
**Engine Note**: type=Ratchet; protrusions=0; height_mm=6.0; mass_g=approx5.5; joint=frictionOnly; T_friction=0.0428Nm; noBurst_conventional; XD_disabled_on_slip.

---

### [Case 395 — 9-70 (UX Ratchet): Maximum Rotating-Tab Count, Near-50% Gap Fraction at C₉ Geometry, and Rounded-Protrusion Reduced Contact Impulse](./8%20case%20study.md#case-395)

**System**: Beyblade X (UX) — Ratchet  
**Geometry**: 9-protrusion (C₉, rounded); height=7.0 mm; m=6.4 g; dual-component construction (lighter outer ring + darker inner body). 40° sector repeat; protrusion arc≈18° (rounded); gap≈22°; gap fraction=55% (lowest rotating-tab). UX-07 (TT, Phoenix Rudder Deck Set).  
**Material**: PC dual-component (two-shot moulding likely)  
**Mechanism**: T_burst_9tab≈2.386×10⁻² N·m (maximum rotating-tab; 80% above 5-tab; same as Phoenix Wing Ratchet). Rounded protrusion: progressive cam angle β during engagement → lower impulse spike vs flat-face tabs → resists single-spike attacks. Gap fraction 55% vs 2-60's 86% → 36% fewer vulnerable orientations. Near-uniform annular mass at N=9 → I≈6.4×10⁻⁷ kg·m² → neutral stamina.  
**Engine Note**: type=Ratchet_UX; protrusions=9; height_mm=7.0; mass_g=6.4; joint=rotatingTab_rounded; T_burst=2.386e-2; gapFraction=55pct; maxTab_rotating_9.

---

### [Case 396 — 7-60 (UX Ratchet): Asymmetric Single-Superprotrusion Bimodal Burst Behaviour, Heaviest Low-Height Body, and Defence-Weight Distribution](./8%20case%20study.md#case-396)

**System**: Beyblade X (UX) — Ratchet  
**Geometry**: 7-protrusion asymmetric (6 standard ≈20° arc + 1 superprotrusion ≈30° arc, extends 1–2 mm further); height=6.0 mm; m=7.0 g (heaviest PC-only 60-height Ratchet); I≈7.021×10⁻⁷ kg·m². UX-06 (TT, Leon Crest 7-60GN).  
**Material**: PC  
**Mechanism**: Nominal T_burst_7tab≈1.857×10⁻² N·m but bimodal behaviour: (1) most orientations: standard 7-tab protection; (2) ≈5–10° arc adjacent to superprotrusion: superprotrusion extra height → if attacker tab catches at tip → guaranteed burst (larger cam-over travel → spring always reaches release). Heaviest 60-height body: low CoM (vs 7-70/7-80) → better gyroscopic stability at mid-to-late match.  
**Engine Note**: type=Ratchet_UX; protrusions=7; height_mm=6.0; mass_g=7.0; joint=rotatingTab_asymmetric; T_burst_nominal=1.857e-2; bimodal=true; superprotrusion_burstWindow=5_10deg.

---

### [Case 397 — Kick / K (CX Bit): Flat-Tip XD Rail Engagement, Hexagonal Body Stabilisation, and Dual-Tooth Burst Architecture](./8%20case%20study.md#case-397)

**System**: Beyblade X (CX) — Bit  
**Geometry**: m=2.2 g; Balance type; flat disc tip with central indent: r_o≈2.5 mm, r_indent≈0.8 mm, r_eff≈1.80 mm; hexagonal outer body (6 flat faces at 60° spacing); XD teeth (between tip face and disc flange); shaft teeth (stat-80). CX-05 (TT) / G1678 (Hasbro).  
**Material**: PC  
**Mechanism**: Tip: dω/dt≈−9.9 rad/s² (same tier as Flat). XD: reliable from hard launch. Shaft stat-80: T_bit≈4.16×10⁻³ N·m (strong burst lock). Hex body: at low-spin tilt, flat hexagonal faces contact bowl → periodic restoring moment → delays catastrophic wobble collapse (does not extend spin window, but extends functional spin window). Self-KO risk comparable to Flat but hex faces partially damp orbital velocity before XD → lower self-KO probability.  
**Engine Note**: type=Bit_CX; mass_g=2.2; role=Balance; tipGeom=flatAnnular; r_eff_mm=1.80; hexBody=bowlStabilisation; stat=80; dOmega_dt=−9.9.

---

### [Case 398 — Flat / F (BX Bit): Maximum XD Rail Grip, Annular-Indent Tip Mechanics, and Controlled-Trajectory Self-KO Risk](./8%20case%20study.md#case-398)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.3 g; Attack type; flat disc tip with central indent: r_o≈2.5 mm, r_i≈0.8 mm, r_eff≈1.796 mm; smooth cylindrical body (no hex); XD teeth (η_xd≈1.00 baseline, highest); shaft teeth stat-80. BX-01 (TT, Dransword 3-60F).  
**Material**: PC  
**Mechanism**: dω/dt≈−9.89 rad/s² (highest in lineup); tip-friction window≈70.8 s. Central indent: raises r_eff 7.7% vs full-disc flat; self-centring pressure distribution. XD: baseline maximum grip. T_bit≈4.16×10⁻³ N·m (stat-80). Self-KO risk: at orbital v>0.343 m/s, XD redirects Bey past safe wall-stopping velocity. Recommended: 70–80% power launch or slight tilt.  
**Engine Note**: type=Bit_BX; mass_g=2.3; role=Attack; r_eff_mm=1.796; eta_xd=1.00; stat=80; dOmega_dt=−9.89; selfKO_risk=high; window_s=70.8.

---

### [Case 399 — Taper / T (BX Bit): Semi-Flat Indent Tip, Reduced XD Rail Contact Area, and Stamina-Attack Balance via Contact-Area Reduction](./8%20case%20study.md#case-399)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.2 g; Balance type; semi-flat convex dome tip + central indent: r_o≈1.5 mm, r_i≈0.5 mm, r_eff≈1.083 mm (−39.7% vs Flat); XD teeth moderate (η_xd≈0.55); shaft teeth stat-80. BX-02 (TT, Hells Scythe 4-60T).  
**Material**: PC  
**Mechanism**: dω/dt≈−4.80 rad/s² (2× better than Flat); window≈145.8 s. Reduced contact area: 241/678 of Flat area. XD: η_xd≈0.55 — requires hard/precise launch for XD activation. Mixed-attack weakness: sub-optimal launch → aggressive movement but no XD → spin wasted on random contacts. T_bit≈4.16×10⁻³ N·m (stat-80 identical to Flat). Lower self-KO risk than Flat.  
**Engine Note**: type=Bit_BX; mass_g=2.2; role=Balance; r_eff_mm=1.083; eta_xd=0.55; stat=80; dOmega_dt=−4.80; window_s=145.8.

---

### [Case 400 — Ball / B (BX Bit): Hertzian Point Contact Minimum Friction, Stat-20 Shaft Lock Vulnerability, and Maximum Stamina via Near-Zero XD Engagement](./8%20case%20study.md#case-400)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.1 g (lightest base Bit); Stamina type; hemisphere tip: R_ball≈3 mm; Hertzian contact patch a≈9.1×10⁻⁵ m (0.091 mm); contact area≈2.60×10⁻⁸ m² (678× smaller than Flat); r_eff≈a≈9.1×10⁻⁵ m. XD teeth minimal (η_xd≈0.05); shaft teeth stat-20 (shallow). BX-03 (TT, Wizard Arrow 4-80B).  
**Material**: PC  
**Mechanism**: dω/dt≈−0.335 rad/s²; theoretical window≈2090 s (Hertzian near-zero friction). T_bit≈1.04×10⁻³ N·m (stat-20 — 7.8% supplemental vs Ratchet). No XD engagement → no self-KO risk. KO vulnerability: hemisphere provides minimal lateral friction vs impulse → more ring-out susceptible per unit impulse than flat-tip. Optimal: pair with high-tab Ratchets to compensate low shaft burst resistance.  
**Engine Note**: type=Bit_BX; mass_g=2.1; role=Stamina; R_ball_mm=3.0; a_contact_m=9.1e-5; eta_xd=0.05; stat=20; dOmega_dt=−0.335; window_s=2090.

---

### [Case 401 — Needle Bit (N)](./8%20case%20study.md#case-401)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.0 g; Defense type; PC cone tip θ≈75° half-angle; contact area≈10⁻¹¹ m² (Boussinesq penetration); dω/dt≈−0.200 rad/s²; XD teeth vestigial (η_xd≈0.03); shaft teeth stat-20. BX-04 (TT, Knight Shield 3-80N).  
**Material**: PC  
**Mechanism**: Cone anchoring: apex bites into stadium surface (0.441 N weight) → resists lateral displacement. Lateral stability unmatched by hemisphere or flat tips. No XD capability. T_bit≈1.04×10⁻³ N·m (stat-20; pair with high-tab Ratchet). Passive defensive stamina role.  
**Engine Note**: type=Bit_BX; mass_g=2.0; role=Defense; cone_halfAngle_deg=75; dOmega_dt=−0.200; eta_xd=0.03; stat=20; lateralAnchoring=true.

---

### [Case 402 — Low Flat Bit (LF)](./8%20case%20study.md#case-402)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.1 g; Attack type; full disc tip (no indent): r_o≈2.5 mm; r_eff=(2/3)×r_o=1.667 mm; body ≈1 mm shorter than Flat. XD teeth (η_xd≈1.00); shaft teeth stat-80. BX-14 (TT, SharkEdge 3-60LF).  
**Material**: PC  
**Mechanism**: r_eff=1.667 mm (vs Flat 1.796 mm) → marginally better tip-friction stamina on paper. But lower CoM → more aggressive/frequent XD engagement → more wall contacts → practical stamina worse than Flat. Same stat-80 shaft (T_bit≈4.16×10⁻³ N·m). Niche: arenas without Xtreme Line rail; or lower CoM reduces nutation onset rate.  
**Engine Note**: type=Bit_BX; mass_g=2.1; role=Attack; r_eff_mm=1.667; eta_xd=1.00; stat=80; practicalStamina=worse_than_Flat; lowerCoM=niche.

---

### [Case 403 — Orb Bit (Orb)](./8%20case%20study.md#case-403)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.0 g; Stamina/Defense type; smaller semi-sphere: R≈2 mm; Hertzian a≈8.04×10⁻⁵ m; dω/dt≈−0.296 rad/s²; wider/flatter body disc than Ball; XD vestigial (η_xd≈0.03); stat-20. BX-16 (TT, ViperTail 5-80Orb).  
**Material**: PC  
**Mechanism**: Near-identical stamina to Ball (−0.296 vs −0.335 rad/s²; "comparable" as wiki notes). Distinguishing feature: wider disc → larger second moment of area about tilt axis → higher tilt-stiffness → better resistance to destabilising opponents. Preferred over Ball for opponents using destabilise-rather-than-burst strategy.  
**Engine Note**: type=Bit_BX; mass_g=2.0; role=Stamina_Defense; R_orb_mm=2.0; dOmega_dt=−0.296; stat=20; tiltStiffness=higher_than_Ball.

---

### [Case 404 — Point Bit (P)](./8%20case%20study.md#case-404)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.2 g; Balance type; flat annulus (r_o=2.5 mm, r_i=0.8 mm) with central sphere bump (R≈0.8 mm) rather than hollow indent; XD teeth (η_xd≈1.00 upright → ≈0.60 tilted); stat-80. No confirmed product code; appears in Random Booster assortments.  
**Material**: PC  
**Mechanism**: Dual-mode tip: upright → flat annular contact (r_eff≈1.796 mm, dω/dt≈−9.89 rad/s²); tilted (>40% spin stability) → sphere bump becomes primary contact (Hertzian regime, dramatically lower r_eff). Mode switch origin of "flower movement": sphere bump pivot → wide precession circles → lower friction + unpredictable attack vector. Highest-stamina flat-family Bit via passive geometry adaptation. XD naturally suppresses at tilt (preserves stamina late-match).  
**Engine Note**: type=Bit_BX; mass_g=2.2; role=Balance; dualMode=flatAnnular_upright→sphereBump_tilted; eta_xd=1.00→0.60; stat=80; flowerMovement=true.

---

### [Case 405 — Rush Bit (R)](./8%20case%20study.md#case-405)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.1 g; Attack type; small flat annulus tip: r_o≈1.8 mm, r_i≈0.6 mm, r_eff≈1.300 mm; elevated XD gear tooth (higher on shaft than any other Bit); η_xd≈1.15 (highest XD efficiency); stat-80. BX-20 (TT, DranDagger 4-60R).  
**Material**: PC  
**Mechanism**: dω/dt≈−7.16 rad/s² from tip alone (better than Flat) but negated by high XD frequency → each XD wall contact transfers 15–25 rad/s. Elevated gear = deepest rail mesh = highest XD reliability. Wear failure mode: raised teeth wear faster than recessed → η_xd degrades over part life (highest maintenance Bit). T_bit≈4.16×10⁻³ N·m (stat-80).  
**Engine Note**: type=Bit_BX; mass_g=2.1; role=Attack; r_eff_mm=1.300; eta_xd=1.15; stat=80; dOmega_dt=−7.16; wearRate=highest; XD_reliability=max.

---

### [Case 406 — High Taper Bit (HT)](./8%20case%20study.md#case-406)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.2 g; Balance type; semi-flat annular tip identical to Taper: r_o≈1.5 mm, r_i≈0.5 mm, r_eff≈1.083 mm; body ≈1.5 mm taller than Taper → CoM h≈6.0 mm vs Taper≈4.5 mm; XD (η_xd≈0.55); stat-80. BX-21 (TT, HellsChain 5-60HT).  
**Material**: PC  
**Mechanism**: dω/dt≈−4.80 rad/s² (identical to Taper from same tip). Taller body: higher CoM → ω_nut ∝ 1/h → nutates at higher ω than Taper → enters unstable wobble earlier → shorter functional battle window. Wiki: "slightly worse than Taper." No competitive scenario where HT outperforms Taper. Set-fill variant only.  
**Engine Note**: type=Bit_BX; mass_g=2.2; role=Balance; r_eff_mm=1.083; eta_xd=0.55; stat=80; dOmega_dt=−4.80; coM_h_mm=6.0; nutatesEarlier_than_Taper.

---

### [Case 407 — Accel Bit (A)](./8%20case%20study.md#case-407)

**System**: Beyblade X (UX) — Bit  
**Geometry**: m=2.6 g (heaviest attack Bit); Attack type; flat annular tip: r_o≈2.5 mm, r_i≈0.8 mm, r_eff≈1.736 mm; 16-tooth XD gear (doubles standard 8-tooth count); stat-80. UX-01 (TT, Dran Buster 1-60A).  
**Material**: PC  
**Mechanism**: dω/dt≈−9.57 rad/s² (similar to Flat). XD: 16-tooth at 22.5° pitch mismatches rail's 45° design → only alternating teeth engage cleanly → bouncing inconsistent orbital path (η_xd_effective≈0.85 vs 1.20 nominal). Viable Rush substitute when unavailable; outperformed by Rush on XD reliability and by Flat on path consistency. Heavier mass moderates spin decay marginally.  
**Engine Note**: type=Bit_UX; mass_g=2.6; role=Attack; r_eff_mm=1.736; eta_xd_eff=0.85; stat=80; dOmega_dt=−9.57; pitchMismatch=16tooth_22.5deg.

---

### [Case 408 — Disc Ball Bit (DB)](./8%20case%20study.md#case-408)

**System**: Beyblade X (UX) — Bit  
**Geometry**: m=3.2 g (heaviest Bit alongside Elevate); Stamina type; hemisphere tip: R≈3 mm, a≈9.21×10⁻⁵ m; wide stabilising disc flange (r_disc≈7.5 mm, wider than Ball's ≈6 mm); body ≈2 mm taller than Ball; XD vestigial (η_xd≈0.05); stat-20. UX-03 (TT, Wizard Rod 5-70DB).  
**Material**: PC  
**Mechanism**: dω/dt≈−0.339 rad/s² (identical to Ball from same tip). Wide disc: ↑I_sys + ↑gyroscopic stiffness (slower precession); but disc drag∝r_disc⁵ → (1.2)⁵≈2.49× more aerodynamic drag than Ball. Higher CoM: lower nutation threshold (onset at higher ω) vs Ball. Best for low-contact stamina scenarios where aero drag is acceptable trade for gyro stiffness.  
**Engine Note**: type=Bit_UX; mass_g=3.2; role=Stamina; R_ball_mm=3.0; a_contact_m=9.21e-5; eta_xd=0.05; stat=20; discFlange=gyrroStiffness; aeroDrag=2.49x_Ball.

---

### [Case 409 — Hexa Bit (H)](./8%20case%20study.md#case-409)

**System**: Beyblade X (UX) — Bit  
**Geometry**: m=2.6 g; Defense/Balance type; hexagonal faceted cone body (6 flat faces); cone apex ≈flat-annular contact upright; 16-tooth XD gear (η_xd≈0.85 eff; same pitch mismatch as Accel); stat-80. UX-02 (TT, Hells Hammer 3-70H).  
**Material**: PC  
**Mechanism**: Hammer motion: when Bey tilts past critical angle φ_crit → flat hexagonal facet contacts floor → high-friction braking pulse + upward restoring impulse → fights back against destabilisation. Upright: flat-annular apex contact → spin decay comparable to other flat-tip Bits. Best defense Bit in BX/UX catalogue. 16-tooth cone can catch rail edge at steep angles → lateral torque redirecting attack. T_bit≈4.16×10⁻³ N·m (stat-80).  
**Engine Note**: type=Bit_UX; mass_g=2.6; role=Defense_Balance; hexFacets=6; hammerMotion=true; eta_xd=0.85; stat=80; bestDefenseBit.

---

### [Case 410 — Quake Bit (Q)](./8%20case%20study.md#case-410)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.3 g; Attack type; flat tip with diagonal cut (bottom face angled ≈10–15° from perpendicular to shaft axis → one side lower than other); one-sided XD gear teeth exposed on lower side; stat-80. BX-31 (TT, Tyranno Beat 4-70Q).  
**Material**: PC  
**Mechanism**: Diagonal cut → periodic bounce at spin frequency: lower side contacts floor first → vertical impulse per revolution → bouncing/jumping motion. One-sided XD: stronger orbital activation from exposed-gear side → directional asymmetry in attack trajectories. Diagonal reduces effective contact area → higher pressure per unit area (↑friction) but lower total frictional torque vs full-face. Bounce adds downward velocity component during re-contact → ↑collision force at XD events. Niche: requires exploiting directional asymmetry and bouncing trajectory.  
**Engine Note**: type=Bit_BX; mass_g=2.3; role=Attack; diagonalCut=true; bounceMotion=true; stat=80; directionalXD=asymmetric.

---

### [Case 411 — Metal Needle Bit (MN)](./8%20case%20study.md#case-411)

**System**: Beyblade X (UX) — Bit  
**Geometry**: m=2.7 g; Defense type; PC body + steel cone tip insert (E_steel≈200 GPa, E*_MN≈94 GPa vs E*_Needle≈1.33 GPa); XD vestigial (η_xd≈0.03); stat-20. UX-05 (TT, Shinobi Shadow 1-80MN).  
**Material**: PC body + steel tip  
**Mechanism**: Steel rigid indenter vs PC stadium: plastic deformation of floor (permanent dents, not elastic recovery). Three consequences: (1) deeper channel per pass → ↑lateral resistance long-term; (2) plastic indent ratchets deeper each pass → progressive floor surface destabilisation; (3) energy consumed as plastic work (not returned as spin-recovery). Heavier, damages equipment, mechanically inferior to standard Needle in every category. Wiki: worst Bit in lineup.  
**Engine Note**: type=Bit_UX; mass_g=2.7; role=Defense; steelTip=true; plasticDeformation=true; eta_xd=0.03; stat=20; worstBit=true.

---

### [Case 412 — Cyclone Bit (C)](./8%20case%20study.md#case-412)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.1 g; Attack type; curved star/vane pattern on tip face (centrifugal pump impeller geometry); r_eff≈1.5 mm (estimated); XD (η_xd≈1.10–1.15, centrifugal pump + rail); stat-80. BX-34 (TT, Cobalt Dragoon 2-60C).  
**Material**: PC  
**Mechanism**: dω/dt≈−8.27 rad/s²; window≈84.7 s. Centrifugal pumping: vane geometry converts floor contact into centrifugal acceleration → orbital pumping action during XD (distinct from Rush's gear depth mechanism). Requires flat launch: tilted launch → asymmetric vane contact → reduced orbital consistency. Viable Rush alternative when flat launch guaranteed. η_xd comparable to Rush but via different energy pathway.  
**Engine Note**: type=Bit_BX; mass_g=2.1; role=Attack; curvedVane=centrifugalPump; r_eff_mm=1.5; eta_xd=1.10_1.15; stat=80; dOmega_dt=−8.27; flatLaunch_required.

---

### [Case 413 — Elevate Bit (E)](./8%20case%20study.md#case-413)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=3.2 g (heaviest alongside DB); Balance type; flat annular tip + central sphere bump (as in Point Bit) + large outer disc (r_disc≈7.5 mm); curved XD gear teeth (spiral outward path); stat-20. BX-36 (TT, Whale Wave 5-80E).  
**Material**: PC  
**Mechanism**: Curved XD gear: cam-lift mechanism converts lateral rail groove → vertical lift force → physically elevates Bey off floor 20–50 ms per XD cycle (unique in catalogue). During elevation: tip-friction contribution=0 (airborne). Creates "side-curve unique motion": sweeps upward/inward along ballistic arc → unpredictable attack vector. Stat-20: T_bit≈1.04×10⁻³ N·m (pair with high-tab Ratchet). Large disc: ↑I + aerodynamic drag penalty (same as DB).  
**Engine Note**: type=Bit_BX; mass_g=3.2; role=Balance; curvedXD_camLift=true; elevation_ms=20_50; stat=20; sideCurveMotion=unique; largDisc=aeroDrag.

---

### [Case 414 — Free Ball Bit (FB)](./8%20case%20study.md#case-414)

**System**: Beyblade X (BX) — Bit  
**Geometry**: m=2.0 g; Stamina/Defense type; semi-sphere tip R≈2.5 mm on bearing/snap mount — tip rotates freely and independently of Ratchet-Blade system; XD vestigial (η_xd≈0.03); stat-20. No product code listed; appears in assortments.  
**Material**: PC + bearing  
**Mechanism**: Free-spin tip: tip angular velocity ≠ assembly angular velocity → floor friction torque applies to tip's own I (not I_sys) → braking force ratio I_tip/I_sys → drastically reduced spin-braking. Partially decouples rotational impulse from attack impacts (tip does not resist or transmit rotational impulse back). No XD engagement (free tip cannot mesh rail). T_bit≈1.04×10⁻³ N·m (stat-20). Second independent ω-vector: minor destabilisation of opponents in head-on collision (perturbs combined contact response). Comparable stamina to Orb; better destabilising capability.  
**Engine Note**: type=Bit_BX; mass_g=2.0; role=Stamina_Defense; freeTip=bearing; tipDecoupled=true; eta_xd=0.03; stat=20; impulseDecoupled=partial.

---

### [Case 415 — Level Bit (L)](./8%20case%20study.md#case-415)

**System**: Beyblade X (UX) — Bit  
**Geometry**: m=2.6 g; Attack/Balance type; 16-tooth XD gear on large circular disc with 3 concentric speed zones: outer (r_o, high speed), middle (r_m), inner/green (r_i, low speed); flat tip below disc (tilt-launch required); stat-80. UX-09 (TT, Samurai Saber 2-70L).  
**Material**: PC  
**Mechanism**: 3-zone radial engagement: at high spin/large orbital radius → outer zone → max lever arm → highest orbital velocity; as spin decays → engagement migrates inward → conservative balance orbit. Natural attack→balance transition built into geometry. η_xd_eff≈0.85 (same 16-tooth 22.5°/45° pitch mismatch as Accel/Hexa). Tilt launch requirement: flat disc face at zero tilt → extreme initial friction torque → wastes spin; tilt δ≈15° reduces launch spin loss by cos²(15°)≈0.933. Large disc: ↑gyroscopic stiffness. T_bit≈4.16×10⁻³ N·m (stat-80).  
**Engine Note**: type=Bit_UX; mass_g=2.6; role=Attack_Balance; 3zoneDisc=true; eta_xd_eff=0.85; stat=80; tiltLaunch_required; attackToBalance_transition_natural.

---





## CS9 — Cases 416–523, 867–891 + Overflow 1001–1024 {#cs9}
Source: `9 case study.md`

---

### CS9 Overflow — Cases 1001–1024 {#cs9-overflow}

---

### [Case 1001 — Winning Valkyrie Energy Layer (Burst Standard)](./9%20case%20study.md#case-1001)

**System**: Burst Standard — Energy Layer
**Geometry**: m=15.2 g; C3 symmetry; r_i=0.4 cm; r_o=1.7 cm; 3 smash blades phi=22 deg; 2 burst tabs L=5.0 mm b=3.0 mm h=0.55 mm; r_tab=0.75 cm; tau_burst=10.8 mN*m; I_L=2.318e-6 kg*m2
**Material**: PC (E=2.4 GPa)
**Spin Coupling**: 2-tab cantilever k_tab=2400 N/m; delta_max=0.30 mm
**Contact Points**: r_o=1.7 cm; phi=22 deg; smash fraction=0.927; recoil fraction=0.375; f_contact=286 Hz at 600 rad/s
**Mechanism**: Inaugural Burst layer; WV.12.V assembly m=34.1 g I_total=4.018e-6 kg*m2 L0=2.41e-3 kg*m2/s; Velocity tip dw/dt=-7.08 rad/s2; 2-tab burst easiest of all documented layers
**Engine Note**: tau_burst=10.8 mN*m; k_tab=2400 N/m; I_L=2.318e-6; L0=2.41e-3 kg*m2/s; f_contact=286 Hz

---

### [Case 1002 — Xtreme Performance Tip (Burst)](./9%20case%20study.md#case-1002)

**System**: Burst Standard — Performance Tip
**Geometry**: m=~6.0 g; rubber flat outer ring r_ring=0.4 cm; central void r_void=0.2 cm; contact annulus area A=37.7 mm2
**Material**: Rubber (mu_k=0.85)
**Contact Points**: annular rubber contact; r_eff=centroid of annulus ~0.32 cm
**Mechanism**: Premier attack-type tip; high floor friction torque drives aggressive movement pattern; center void prevents central contact clogging; spin-decay asymmetry vs hard tips documented
**Engine Note**: type=XT_Burst; mu_k=0.85; r_ring=0.4 cm; r_void=0.2 cm; attack specialist

---

### [Case 1003 — Xeno Xcalibur Energy Layer (Burst Dual Layer)](./9%20case%20study.md#case-1003)

**System**: Burst Dual Layer System — Energy Layer
**Geometry**: m=~15.5 g est; C1 symmetry; r_o=2.2 cm (sword tip); single primary contact point; tall-tooth burst threshold
**Material**: ABS outer (E=2.3 GPa) over PC inner (E=2.4 GPa)
**Spin Coupling**: tall-tooth design raises burst resistance vs standard 2-tab WV
**Contact Points**: r_o=2.2 cm; C1 sword geometry; phi defined by sword face angle
**Mechanism**: First Xcalibur iteration; C1 imbalance creates flail momentum; first-mold handle fracture from centrifugal imbalance documented; XC.M.I assembly context
**Engine Note**: type=XenoXC; C1_sword; tall_tooth_burst; first_mold_fracture_risk

---

### [Case 1004 — Magnum Forge Disc (Burst Dual Layer)](./9%20case%20study.md#case-1004)

**System**: Burst Dual Layer System — Forge Disc
**Geometry**: m=19.2 g; r_i_metal=0.3 mm r_o_metal=1.0 cm (metal zone); r_i_plastic=1.0 cm r_o_plastic=1.6 cm (ABS zone); I_metal=half*0.0145*(0.003^2+0.010^2); I_plastic=half*0.0047*(0.010^2+0.016^2)
**Material**: zinc alloy center (m_metal~14.5 g) + ABS plastic perimeter (m_plastic~4.7 g)
**Spin Coupling**: two-click disc-layer alignment for sword orientation
**Mechanism**: hybrid two-zone inertia; three-corner weight distribution; XC.M.I assembly; CWD metal center lowers r_eff vs OWD alternatives
**Engine Note**: type=Magnum; m=19.2 g; two_zone_inertia; CWD_metal_core

---

### [Case 1005 — Impact Performance Tip (Burst)](./9%20case%20study.md#case-1005)

**System**: Burst Standard — Performance Tip
**Geometry**: m=~6.0 g est; three-point rubber star tip r_outer=0.45 cm; rubber arc 40 deg each sector; ABS infill 80 deg per sector
**Material**: rubber star tips mu_k=0.85; ABS infill mu_k=0.17
**Contact Points**: C3 rubber-ABS mixed contact; r_outer=0.45 cm; friction instability CV documented
**Mechanism**: XC.M.I assembly tip; three-point contact creates spin-decay variability; mixed rubber-ABS geometry produces non-constant friction torque
**Engine Note**: type=Impact; C3_mixed_rubber_ABS; friction_CV_documented

---

### [Case 1006 — Sieg Xcalibur Energy Layer (Burst God Layer)](./9%20case%20study.md#case-1006)

**System**: Burst God Layer System — Energy Layer
**Geometry**: m=15.9 g; C1 dominant; r_o=2.4 cm (sword tip); zinc sword insert m_sw~5.0 g; diamond outline secondary recoil contacts
**Material**: ABS/PC composite + zinc alloy sword insert
**Spin Coupling**: two-zone inertia from zinc insert; inertia-amplified burst resistance
**Contact Points**: r_o=2.4 cm primary; C1 sword; hilt-gap fatigue denting documented
**Mechanism**: God Layer era Xcalibur; metal sword insert amplifies smash force; hilt gap causes fatigue denting on opponent layers; Sieg.1.Iron assembly m=43.8 g I=4.79e-3 kg*m2/s L0
**Engine Note**: type=SiegXC; m=15.9 g; m_sword=5.0 g; C1_metal_sword; hilt_gap_denting

---

### [Case 1007 — Forge Disc 1 (Burst God Layer)](./9%20case%20study.md#case-1007)

**System**: Burst God Layer System — Core Disc (asymmetric)
**Geometry**: m=21.2 g; C1 elliptical asymmetric; r_i=0.4 cm r_o=1.7 cm annular model; e_1=2.77 mm static eccentricity
**Material**: zinc alloy
**Spin Coupling**: C1 asymmetry produces deliberate imbalance; flail-momentum attack amplification
**Mechanism**: one heavy side for flail momentum; eccentricity budget e_1=2.77 mm; dual-mode disc orientation possible; higher burst resistance for XC assembly via angular momentum amplification
**Engine Note**: type=Disc1_God; m=21.2 g; C1_asymmetric; e=2.77 mm; flail_momentum

---

### [Case 1008 — Iron Performance Tip (Burst God Layer)](./9%20case%20study.md#case-1008)

**System**: Burst God Layer System — Performance Tip
**Geometry**: m=6.7 g; flat metal tip r_contact=0.35 cm; r_eff=2*r/3=0.233 cm
**Material**: steel flat tip (mu_k_metal_on_ABS=0.12 [CONFIRMED CS3])
**Contact Points**: r_contact=0.35 cm metal flat; lowest friction of metal-flat tips
**Mechanism**: attack-stamina hybrid; tall-tooth layer interaction — weak spring lock; lowest hard-tip spin decay; Sieg.1.Iron assembly context
**Engine Note**: type=Iron; m=6.7 g; mu_k=0.12; r_eff=0.233 cm; weak_spring_lock_tall_tooth

---

### [Case 1009 — Buster Xcalibur Energy Layer (Cho-Z)](./9%20case%20study.md#case-1009)

**System**: Burst Cho-Z Layer System — Energy Layer
**Geometry**: m=19.6 g; C1 symmetry; m_sword=7.0 g (35.7% of total); bistable sword arm r_o_retracted; r_o_deployed=2.4 cm est
**Material**: PC + zinc alloy sword insert
**Gimmick**: Cho-Z Awakening System — bistable leaf-spring sword extension; omega_crit~140.9 rad/s for deployment; Burst Stoppers engage at deployment
**Spin Coupling**: spring-loaded bistable; above omega_crit burst tabs blocked mechanically
**Contact Points**: maximum C1 smash eccentricity; deployed sword tip r_o max in lineup
**Mechanism**: highest Xcalibur smash force when deployed; Buster.1'.D.Sw assembly m=53.9 g; bistable deployment confirmed irreversible in battle
**Engine Note**: type=BusterXC; m=19.6 g; omega_crit=140.9 rad/s; Cho-Z_Awakening; C1_max_eccentricity

---

### [Case 1010 — Core Disc 1' (Cho-Z Dash)](./9%20case%20study.md#case-1010)

**System**: Burst Cho-Z Dash — Core Disc
**Geometry**: m=22.5 g; bilateral-fill vs Disc 1 (21.2 g); r_i=0.4 cm r_o=1.7 cm annular; reduced eccentricity vs Disc 1 (e_1=2.77 mm)
**Material**: zinc alloy
**Mechanism**: 1.3 g heavier than Disc 1; bilateral fill reduces static imbalance; combined assembly imbalance minimisation with Buster XC; Dash marker added
**Engine Note**: type=Disc1Prime; m=22.5 g; bilateral_fill; lower_eccentricity_vs_Disc1

---

### [Case 1011 — Dagger Frame (Cho-Z)](./9%20case%20study.md#case-1011)

**System**: Burst Cho-Z — Disc Frame
**Geometry**: m=2.6 g; C4 symmetry; 4 blade protrusions 15 deg arc each; protrusion height 1.5 mm above disc; r_i=1.9 cm r_o=2.1 cm; 16.7% perimeter coverage
**Material**: ABS
**Mechanism**: seats on Core Disc 1' outer edge; LAD geometry contribution; marginal inertia contribution to assembly
**Engine Note**: type=DaggerFrame; m=2.6 g; C4; 16.7%_perimeter_coverage; LAD_geometry

---

### [Case 1012 — Sword Performance Tip (Cho-Z)](./9%20case%20study.md#case-1012)

**System**: Burst Cho-Z — Performance Tip
**Geometry**: m=9.2 g; wide flat hard ABS; r_contact=0.55 cm; r_eff=(2/3)*r_contact=0.367 cm
**Material**: hard ABS (mu_k=0.17)
**Contact Points**: r_contact=0.55 cm — widest standard hard-plastic flat in Burst era
**Mechanism**: lowest hard-tip spin decay; scrape tilt threshold documented; full Buster assembly stability budget in Buster.1'.D.Sw combination
**Engine Note**: type=Sword; m=9.2 g; r_contact=0.55 cm; mu_k=0.17; lowest_hard_decay

---

### [Case 1013 — DB Core Xcalibur (Burst Ultimate)](./9%20case%20study.md#case-1013)

**System**: Burst Ultimate (BU) — DB Core
**Geometry**: m=10.6 g; r_core=0.8 cm; 3 BU Lock protrusions; spring-loaded Bound Attack; height-dependent CoM shift (High/Low Mode)
**Material**: ABS + PC spring tabs
**Gimmick**: BU Lock (3-protrusion Hertzian burst resistance amplifier); spring Bound Attack rebound
**Spin Coupling**: BU Lock tau_BU=56.25 mN*m (with Xanthus disc)
**Mechanism**: spring rebound + BU Lock + High/Low Mode; heaviest DB Core in XC lineage (10.6 g); Xiphoid.XC.Xanthus.Sw'-1 assembly m=78.8 g
**Engine Note**: type=DBCore_XC; m=10.6 g; tau_BU=56.25 mN*m; BU_Lock; spring_bound

---

### [Case 1014 — Xiphoid BU Blade (Burst Ultimate)](./9%20case%20study.md#case-1014)

**System**: Burst Ultimate — BU Blade
**Geometry**: m=13.0 g; C3 symmetry; r_i=1.0 cm r_o=2.2 cm; phi=20 deg; smash fraction=0.940; recoil fraction=0.342
**Material**: PC + metal weight elements
**Contact Points**: C3 smash wings; r_o=2.2 cm; One Hit Mode alignment eccentricity; High Mode blade contact height advantage
**Mechanism**: primary attack surface of BU XC assembly; outermost rotating mass ring; phi=20 deg optimised for ring-out attack
**Engine Note**: type=Xiphoid; m=13.0 g; C3; r_o=2.2 cm; phi=20 deg; smash=0.940

---

### [Case 1015 — Armor 1 (Burst Ultimate)](./9%20case%20study.md#case-1015)

**System**: Burst Ultimate — Armor
**Geometry**: m=13.1 g; r_i=1.0 cm r_o=2.4 cm; 7 protrusions; symmetric ring
**Material**: ABS
**Gimmick**: BU Lock engagement — amplifies burst threshold when engaged with DB Core protrusions
**Mechanism**: largest single-inertia component in BU assembly; High/Low Mode stack control; BU Lock engagement as burst-threshold amplifier; tau_BU=56.25 mN*m [CONFIRMED CS9]
**Engine Note**: type=Armor1; m=13.1 g; r_o=2.4 cm; 7_protrusions; BU_Lock_amplifier

---

### [Case 1016 — Xanthus Forge Disc (Burst Ultimate)](./9%20case%20study.md#case-1016)

**System**: Burst Ultimate — Forge Disc
**Geometry**: m=32.5 g; r_i=0.4 cm r_o=2.4 cm wide-rim; I_Xanthus=half*0.0325*(0.004^2+0.024^2)
**Material**: zinc alloy wide-rim construction
**Mechanism**: heaviest disc in XC lineage (Magnum 19.2 g -> Disc 1 21.2 g -> Disc 1' 22.5 g -> Xanthus 32.5 g); peripheral inertia dominance; 41.2% of 78.8 g assembly mass; activates BU Lock
**Engine Note**: type=Xanthus; m=32.5 g; heaviest_XC_lineage_disc; OWD_dominant; BU_Lock_activator

---

### [Case 1017 — Sword' Dash Performance Tip (Burst Ultimate)](./9%20case%20study.md#case-1017)

**System**: Burst Ultimate — Performance Tip (Dash)
**Geometry**: m=9.6 g; wide flat hard; r_contact=0.55 cm; Dash spring ratchet
**Material**: hard ABS + Dash spring mechanism
**Spin Coupling**: Dash ratchet prevents counter-rotation; tau_Dash=21.6 mN*m supplementary burst threshold
**Mechanism**: Sword' completes Xiphoid.XC.Xanthus.Sw'-1 assembly m=78.8 g I=8.36e-3 kg*m2/s L0; full BU assembly spin decay documented; Xcalibur lineage L0 comparison: 2.41e-3->4.79e-3->5.75e-3->8.36e-3 kg*m2/s
**Engine Note**: type=Sword_Prime; m=9.6 g; tau_Dash=21.6 mN*m; Dash_ratchet; L0_lineage_peak=8.36e-3

---

### [Case 1018 — Victory Valkyrie Energy Layer (God Layer System)](./9%20case%20study.md#case-1018)

**System**: Burst God Layer System — Energy Layer
**Geometry**: m=8.9 g; C3 symmetry; dual-mode wings phi_attack=20 deg / upper-attack mode; r_o<1.7 cm (lighter than WV)
**Material**: ABS/PC
**Contact Points**: C3 smash; dual-mode attack/upper-attack orientation; Upper Attack vertical force component documented
**Mechanism**: VV.Boost.Variable assembly; lighter than WV 15.2 g -> less burst resistance; upper-attack vertical lift supplements knock-out force
**Engine Note**: type=VV; m=8.9 g; C3_dual_mode; upper_attack_lift; phi=20 deg

---

### [Case 1019 — Boost Forge Disc (God Layer System)](./9%20case%20study.md#case-1019)

**System**: Burst God Layer System — Forge Disc
**Geometry**: m=20.0 g; r_body=1.2 cm inner; r_wing=1.7 cm wing tips; three extending wings; I_inner=half*0.015*(0.004^2+0.012^2); I_wing=half*0.005*(0.012^2+0.017^2)
**Material**: zinc alloy
**Mechanism**: three wing extensions provide secondary elevation contact; disc inertia dominates VV assembly; wings create C3 engagement frequency matching Victory Valkyrie
**Engine Note**: type=Boost; m=20.0 g; three_extending_wings; secondary_elevation_contact; disc_dominant

---

### [Case 1020 — Variable Performance Tip (God Layer System)](./9%20case%20study.md#case-1020)

**System**: Burst God Layer System — Performance Tip
**Geometry**: m=6.2 g; three-stage rubber spike wear; Stage 1 rubber spike narrow; Stage 2 intermediate; Stage 3 worn flat r~0.35 cm
**Material**: rubber tips (mu_k=0.85 fresh) evolving to lower mu_k worn
**Contact Points**: non-monotonic spin decay progression; decay rate changes with wear stage
**Mechanism**: three-stage rubber-to-plastic evolution; aggressiveness escalates with wear; VV assembly stamina budget documented; one of few components with physics changing permanently through use
**Engine Note**: type=Variable; m=6.2 g; 3_stage_wear; non_monotonic_decay; aggressive_when_worn

---

### [Case 1021 — God Valkyrie Energy Layer (God Layer System)](./9%20case%20study.md#case-1021)

**System**: Burst God Layer System — Energy Layer
**Geometry**: m=10.16 g; C3 smash blades; central hub spring mechanism; delta_layer~1.5 mm; k_spring~600 N/m est
**Material**: ABS + PC spring tabs
**Gimmick**: Central-hub spring Bound Attack; spring-tab paradox — spring compresses burst tabs to 0 resistance during contact
**Spin Coupling**: spring-tab paradox: hub compression zeroes burst resistance during collision; paradox confirmed
**Mechanism**: God layer bound attack; hub spring collapses burst tabs during contact -> higher burst risk; God Layer inertia budget documented
**Engine Note**: type=GodV; m=10.16 g; spring_hub_bound; spring_tab_paradox; burst_risk_elevated

---

### [Case 1022 — Strike God Valkyrie Energy Layer + Strike God Chip (God Layer System)](./9%20case%20study.md#case-1022)

**System**: Burst God Layer System — Energy Layer + Chip
**Geometry**: m_layer=11.6 g; m_chip=1.7 g; combined; harder PC smash blades wider phi; Chip Lock 3-tab mechanism
**Material**: ABS/PC layer + ABS chip
**Spin Coupling**: Chip Lock adds burst resistance tabs via chip socket
**Contact Points**: wider contact face angle vs God Valkyrie; optimised for ring-out attack
**Mechanism**: forfeits spring Bound Attack for harder blades; Chip Lock burst resistance addition; combined layer inertia; spring-to-lock trade-off analysis
**Engine Note**: type=StrikeGodV; m_layer=11.6 g; m_chip=1.7 g; chip_lock; ring_out_optimised

---

### [Case 1023 — Forge Disc 6 (God Layer System)](./9%20case%20study.md#case-1023)

**System**: Burst God Layer System — Forge Disc (Core)
**Geometry**: m=21.2 g; C6 hexagonal symmetry; r_i=0.4 cm r_o=1.7 cm; 6 equal lobes; near-zero eccentricity; e~0
**Material**: zinc alloy
**Mechanism**: same mass as Disc 1 (21.2 g) but C6 vs C1; zero imbalance; six-fold contact frequency at 600 rad/s: f=6*600/(2*pi)=572 Hz; Valkyrie God Layer assemblies context
**Engine Note**: type=Disc6_God; m=21.2 g; C6; e~0; f_contact=572 Hz; zero_imbalance

---

### [Case 1024 — Vortex Frame (God Layer System)](./9%20case%20study.md#case-1024)

**System**: Burst God Layer System — Disc Frame
**Geometry**: m=2.51 g; C8 spiral cuts; r_i=1.4 cm r_o=1.6 cm; I_Vortex=half*0.00251*(0.014^2+0.016^2)=8.80e-7 kg*m2
**Material**: ABS
**Mechanism**: 8 spiral-cut openings; aerodynamic slot torque contribution; seats on Disc 6 outer edge; irreducible inertia-per-mass floor for rim-concentrated frames; scalloped aerodynamic contact profile
**Engine Note**: type=VortexFrame; m=2.51 g; C8_spiral; I=8.80e-7 kg*m2; aero_slot_torque

---

### CS9 Regular — Cases 416–523 {#cs9-regular}

---

### [Case 416 — Reboot Performance Tip (God Layer System)](./9%20case%20study.md#case-416)

**System**: Burst God Layer System — Performance Tip
**Geometry**: m=7.65 g; m_rubber~0.5 g; centrifugal spring rubber deployment; omega_crit_reboot defined by spring constant k
**Material**: ABS body + rubber tip segment; k~350 N/m est
**Gimmick**: centrifugal spring — inverts conventional behaviour: rubber deployed at high spin (aggressive), retracted at low spin (stamina)
**Mechanism**: two-phase spin decay profile: Phase 1 high-spin rubber (high friction, aggressive movement); Phase 2 low-spin hard tip (low friction, stable centre); spin decay non-monotonic across phases
**Engine Note**: type=Reboot; m=7.65 g; centrifugal_spring; inverted_rubber_deploy; 2_phase_decay

---

### [Case 417 — Ultimate Reboot Performance Tip (God Layer System)](./9%20case%20study.md#case-417)

**System**: Burst God Layer System — Performance Tip
**Geometry**: m=8.1 g; k_ultimate~450 N/m (+~29% vs Reboot); m_rubber~0.55 g; earlier rubber deployment threshold
**Material**: ABS body + rubber tip; stiffer centrifugal spring
**Gimmick**: upgraded Reboot with stiffer spring -> rubber deploys at higher omega_crit -> longer aggressive phase
**Mechanism**: comparative analysis with Reboot (Case 416): earlier rubber deploy, harder to revert to stamina mode; Strike God Valkyrie assembly context
**Engine Note**: type=UltReboot; m=8.1 g; k=450 N/m; earlier_deploy; aggressive_phase_extended

---

### [Case 418 — Cho-Z Winning Valkyrie Energy Layer (Cho-Z Layer System)](./9%20case%20study.md#case-418)

**System**: Burst Cho-Z Layer System — Energy Layer
**Geometry**: m=19.9 g; C3 smash blades; zinc ring r_i_zn=1.4 cm r_o_zn=1.8 cm (est); m_ABS~14.2 g; m_zn~5.7 g
**Material**: ABS/PC body + zinc alloy weight ring (rho_Zn=7130 kg/m3)
**Spin Coupling**: two-zone inertia; zinc ring enhances burst angular momentum; burst resistance higher than WV (Case 1001) via added inertia
**Contact Points**: C3 smash; phi similar to WV; r_o same lineage
**Mechanism**: Cho-Z upgrade of Winning Valkyrie; zinc ring increases I vs original; ChZWV.12Core.Volcanic assembly context; assembly m documented
**Engine Note**: type=ChZWV; m=19.9 g; zinc_ring; C3; two_zone_inertia; burst_AM_enhanced

---

### [Case 419 — Forge Disc 12-Core (Cho-Z Layer System)](./9%20case%20study.md#case-419)

**System**: Burst Cho-Z Layer System — Core Disc
**Geometry**: m=16.1 g; C12 twelve-spoke symmetric; r_o=1.9 cm (Core only, no outer frame ring vs r_o=2.2 cm standard); LAD penalty from smaller radius
**Material**: zinc alloy / ABS
**Mechanism**: 12-spoke C12 design; Core-only (no frame) caps outer radius; high ratchet engagement frequency f=12*omega/(2pi); LAD penalty vs outer-frame discs; ChZWV.12Core.Volcanic assembly
**Engine Note**: type=Disc12Core; m=16.1 g; C12; r_o=1.9 cm; high_f_ratchet; LAD_penalty

---

### [Case 420 — Volcanic Performance Tip (Cho-Z Layer System)](./9%20case%20study.md#case-420)

**System**: Burst Cho-Z Layer System — Performance Tip
**Geometry**: m=6.3 g; rubber flat disk r_base=0.4 cm; r_eff=2*r/3=0.267 cm; mu_k=0.85
**Material**: rubber (mu_k=0.85)
**Contact Points**: r_base=0.4 cm wide rubber flat; maximum friction torque in Cho-Z era standard tips
**Mechanism**: wide flat rubber base for aggressive destabilising attack; short-duration attack physics (spin decays fast under rubber contact); ChZWV.12Core.Volcanic assembly
**Engine Note**: type=Volcanic; m=6.3 g; r_base=0.4 cm; mu_k=0.85; r_eff=0.267 cm; short_duration_attack

---

### [Case 421 — Cho-Z Valkyrie Energy Layer (Cho-Z Layer System)](./9%20case%20study.md#case-421)

**System**: Burst Cho-Z Layer System — Energy Layer
**Geometry**: m=20.9 g; C3 smash blades; zinc wings m_zn=5.7 g at r_i_zn=1.4 cm r_o_zn=2.0 cm; higher r_eff vs ChZWV (zinc further out)
**Material**: ABS/PC + zinc alloy blade wings
**Spin Coupling**: higher inertia efficiency vs ChZWV (zinc placed further outward); peripheral zinc wing placement
**Contact Points**: C3; phi similar lineage; r_o same
**Mechanism**: zinc further outward increases I_zn vs ChZWV; increased inertia efficiency; C3 attack geometry comparison; ChZV.Zenith.Evolution assembly context
**Engine Note**: type=ChZV; m=20.9 g; zinc_wings_peripheral; I_higher_than_ChZWV; C3

---

### [Case 422 — Forge Disc Zenith (Cho-Z Layer System)](./9%20case%20study.md#case-422)

**System**: Burst Cho-Z Layer System — Forge Disc
**Geometry**: m=24.1 g; r_o=2.3 cm; wider outer rim vs Disc 1 (r_o=2.2 cm); I_Zenith=half*0.0241*(r_i^2+0.023^2)
**Material**: zinc alloy
**Mechanism**: heaviest single-piece Cho-Z Forge Disc; 2.9 g heavier than Disc 1; extra mass at outer rim; maximum Cho-Z stamina-assembly angular momentum reserve; ChZV.Zenith.Evolution assembly context
**Engine Note**: type=Zenith; m=24.1 g; r_o=2.3 cm; max_Cho-Z_disc_inertia; stamina_reserve

---

### [Case 423 — Evolution Performance Tip (Cho-Z Layer System)](./9%20case%20study.md#case-423)

**System**: Burst Cho-Z Layer System — Performance Tip
**Geometry**: m=6.4 g; two-stage rubber spike wear; Stage 1 r_s1=0.2 cm r_eff1=0.133 cm; Stage 2 worn r_s2=0.35 cm r_eff2=0.233 cm
**Material**: rubber spikes (mu_k~0.85 fresh; lower worn)
**Gimmick**: two-stage rubber spike wear — progressively more aggressive with use
**Contact Points**: wear-progressive radius increase; friction torque escalates with wear
**Mechanism**: non-Dash spring; worn stage more aggressive (opposite of most tips); ChZV.Zenith.Evolution assembly context; progressive aggressiveness documented
**Engine Note**: type=Evolution; m=6.4 g; 2_stage_wear; r_s1=0.2_r_s2=0.35 cm; progressive_aggressive

---

### [Case 424 — Level Chip (Cho-Z Layer System)](./9%20case%20study.md#case-424)

**System**: Burst Cho-Z Layer System — Level Chip (accessory)
**Geometry**: m=0.7 g; r_LC=1.4 cm radial offset; snaps under Cho-Z Energy Layer on opposite side from zinc ring
**Material**: ABS
**Mechanism**: eccentric counter-mass neutralises zinc ring imbalance; imbalance force suppression; banking pattern stabilisation; ChZV.Zenith.Evolution assembly context
**Engine Note**: type=LevelChip; m=0.7 g; r_LC=1.4 cm; counter_eccentric; imbalance_suppression

---

### [Case 425 — Gatinko Chip Valkyrie (Gatinko Layer System)](./9%20case%20study.md#case-425)

**System**: Burst Gatinko Layer System — Gatinko Chip
**Geometry**: m=3.0 g; r_chip~0.7 cm; ABS hub; burst tabs on chip; miniature burst-control hub
**Material**: ABS
**Spin Coupling**: three-part modular architecture: Chip + Layer Base + Layer Weight; disc-tab engagement threshold controlled by chip
**Mechanism**: Chip provides character-specific burst resistance; replaces single-piece Cho-Z layer with modular system; Slash.Blitz.Power assembly context
**Engine Note**: type=GChip_V; m=3.0 g; modular_3part; burst_control_hub

---

### [Case 426 — Layer Base Slash (Gatinko Layer System)](./9%20case%20study.md#case-426)

**System**: Burst Gatinko Layer System — Layer Base
**Geometry**: m=9.1 g; C3 three blades; phi=25 deg slashing contact; r_i=0.8 cm r_o=2.1 cm; hollow hub (inertia penalty vs solid)
**Material**: ABS/PC
**Contact Points**: C3 slashing; phi=25 deg; smash fraction=cos(25 deg)=0.906; recoil fraction=sin(25 deg)=0.423
**Mechanism**: primary attack geometry of Gatinko system; hollow hub penalises inertia vs solid; attack smash-recoil decomposition; Slash.Blitz.Power assembly context
**Engine Note**: type=LayerBase_Slash; m=9.1 g; C3; phi=25 deg; hollow_hub_penalty

---

### [Case 427 — Layer Weight Retsu (Gatinko Layer System)](./9%20case%20study.md#case-427)

**System**: Burst Gatinko Layer System — Layer Weight
**Geometry**: m=8.7 g; aluminium ring r_i=1.7 cm r_o=2.2 cm; h~0.53 cm; V=pi*(r_o^2-r_i^2)*h
**Material**: aluminium (rho_Al~2700 kg/m3)
**Mechanism**: snap-on peripheral inertia ring; high radial efficiency (all mass at large radius); modular mass architecture; Slash.Blitz.Power assembly context; OWD maximisation at layer level
**Engine Note**: type=LayerWeight_Retsu; m=8.7 g; Al; r_i=1.7 r_o=2.2 cm; OWD_ring

---

### [Case 428 — Forge Disc Blitz (Gatinko Layer System)](./9%20case%20study.md#case-428)

**System**: Burst Gatinko Layer System — Forge Disc
**Geometry**: m=28.6 g; r_o=2.3 cm; wider outer rim; I_Blitz=half*0.0286*(r_i^2+0.023^2)
**Material**: zinc alloy + ABS
**Mechanism**: heaviest Gatinko-era Forge Disc (exceeds Zenith 24.1 g by 4.5 g = +18.7%; exceeds Disc 1 by 7.4 g = +34.9%); disc-dominant assembly inertia; Slash.Blitz.Power assembly context
**Engine Note**: type=Blitz; m=28.6 g; r_o=2.3 cm; heaviest_Gatinko_disc; disc_dominant

---

### [Case 429 — Power Performance Tip (Gatinko Layer System)](./9%20case%20study.md#case-429)

**System**: Burst Gatinko Layer System — Performance Tip
**Geometry**: m=6.4 g; rubber base r_base=0.3 cm; r_eff=2*r/3=0.2 cm; intermediate between Volcanic (r=0.4) and sharp (r~0.05)
**Material**: rubber (mu_k=0.85)
**Contact Points**: r_base=0.3 cm moderate-width rubber
**Mechanism**: moderate-width rubber for attack-stamina balance; non-Dash spring; Slash.Blitz.Power assembly context; between Volcanic aggressiveness and stamina tips
**Engine Note**: type=Power; m=6.4 g; r_base=0.3 cm; mu_k=0.85; attack_stamina_balance

---

### [Case 430 — DB Core Valkyrie (Dynamite Battle Layer System)](./9%20case%20study.md#case-430)

**System**: Burst DB Layer System — DB Core
**Geometry**: m=7.7 g; r_core=0.8 cm; spring-rebound mechanism; BU Lock integration; High/Low Mode CoM asymmetry
**Material**: ABS + spring
**Gimmick**: spring-rebound Bound Attack; BU Lock compatible; High/Low Mode
**Mechanism**: lightest documented DB Core (7.7 g vs XC 10.6 g); same spring mechanism as XC Core; Savior.Shot-7 assembly context
**Engine Note**: type=DBCore_V; m=7.7 g; spring_rebound; BU_Lock; High_Low_mode

---

### [Case 431 — Blade Savior (Dynamite Battle Layer System)](./9%20case%20study.md#case-431)

**System**: Burst DB Layer System — Blade
**Geometry**: m=11.2 g; C3 wing contact points with rubber tip coating; r_i=0.8 cm; Hertzian rubber contact patch a_rubber documented
**Material**: ABS + rubber wing tips
**Contact Points**: C3 rubber-tipped; Hertzian contact mechanics; a_rubber=(3WR/4E*)^(1/3)
**Mechanism**: wear-progressive burst threshold — rubber tips absorb then harden; lighter than Blade Ultimate (11.2 g same mass); Savior.Shot-7 assembly context
**Engine Note**: type=Blade_Savior; m=11.2 g; C3_rubber_tips; Hertzian_contact; wear_progressive

---

### [Case 432 — Armor 7 (Dynamite Battle Layer System)](./9%20case%20study.md#case-432)

**System**: Burst DB Layer System — Armor
**Geometry**: m=13.2 g; C3 with 9 total wings (3 groups of 3); r_i=1.0 cm r_o=2.4 cm
**Material**: ABS
**Gimmick**: BU Lock engagement compatible
**Mechanism**: 9 wings in C3 groups (vs Armor 1's 7 protrusions); High/Low Mode height control; BU Lock engagement; Savior.Shot-7 assembly context; m similar to Armor 1 (13.1 g)
**Engine Note**: type=Armor7; m=13.2 g; C3_9wing; BU_Lock; High_Low_control

---

### [Case 433 — Performance Tip Shot (Dynamite Battle Layer System)](./9%20case%20study.md#case-433)

**System**: Burst DB Layer System — Performance Tip (disc-integrated)
**Geometry**: m=10.4 g (disc+driver unit); r_outer_disc~2.2 cm r_inner~0.8 cm; disc and driver fused single component
**Material**: ABS + metal
**Mechanism**: disc-integrated attack type — driver and Forge Disc fused; eliminates separate Forge Disc slot; Savior Valkyrie Shot-7 starter context
**Engine Note**: type=Shot; m=10.4 g; disc_integrated; attack_type; single_component

---

### [Case 434 — Superking Chip Valkyrie (Sparking Layer System)](./9%20case%20study.md#case-434)

**System**: Burst Sparking (Superking) Layer System — SK Chip
**Geometry**: m=2.6 g; r_chip~0.7 cm; ABS; PC cantilever burst tabs; I_Chip=half*0.0026*0.007^2~6.4e-8 kg*m2
**Material**: ABS + PC burst tabs
**Spin Coupling**: Chip carries burst resistance tabs; chip-only burst control in 3-part SK architecture
**Mechanism**: negligible inertia contribution (6.4e-8 kg*m2); burst tab kinematics documented; tab stiffness hierarchy across chip generations; Brave.Ev'.2A assembly context
**Engine Note**: type=SKChip_V; m=2.6 g; PC_tabs; I~6.4e-8; negligible_inertia

---

### [Case 435 — Ring Brave (Sparking Layer System)](./9%20case%20study.md#case-435)

**System**: Burst Sparking Layer System — Ring
**Geometry**: m=12.3 g; r_i=0.8 cm r_o=2.2 cm; C3 smash geometry; no metal inserts (ABS only)
**Material**: ABS
**Contact Points**: C3 smash; r_o=2.2 cm; primary blade-contact surface for outer perimeter
**Mechanism**: attack-geometry component atop Chassis 2A; provides outer contact blades that Chassis body cannot; ring-layer momentum transfer; Brave.Ev'.2A assembly context
**Engine Note**: type=Ring_Brave; m=12.3 g; C3_ABS; r_o=2.2 cm; outer_contact_surface

---

### [Case 436 — Chassis 2A (Sparking Layer System)](./9%20case%20study.md#case-436)

**System**: Burst Sparking Layer System — Chassis (Double)
**Geometry**: m=44.5 g; r_i=0.7 cm r_o=2.3 cm; integrated disc+layer; I_2A=80.1% of system inertia
**Material**: ABS + zinc reinforcement (integrated)
**Mechanism**: eliminates separate Forge Disc; monolithic 44.5 g integrates disc and upper layer; 80.1% of total system inertia in one component; Brave.Ev'.2A assembly stamina reserve; Attack-chassis radial geometry
**Engine Note**: type=Chassis2A; m=44.5 g; integrated_disc_layer; I=80.1%_system; monolithic

---

### [Case 437 — Performance Tip Evolution' (Sparking/Dash)](./9%20case%20study.md#case-437)

**System**: Burst Sparking — Performance Tip (Dash)
**Geometry**: m=6.7 g; three-stage rubber wear decay; Dash spring adds ~40% burst resistance vs non-Dash Evolution
**Material**: rubber + Dash spring
**Gimmick**: Dash spring burst resistance augmentation (+40% vs Case 423)
**Contact Points**: same rubber wear stages as Evolution (Case 423)
**Mechanism**: Dash enhancement of Evolution tip; fresh-to-worn decay rate scaling documented; Brave.Ev'.2A assembly context
**Engine Note**: type=Ev_Prime; m=6.7 g; Dash_spring; +40%_burst_vs_Ev; 3_stage_wear

---

### [Case 438 — DB Core Valkyrie 2 (Dynamite Battle / Burst Ultimate System)](./9%20case%20study.md#case-438)

**System**: Burst DB/BU — DB Core
**Geometry**: m=7.5 g; spring-rebound; above-average burst resistance among DB Cores; dual-spin compatible; r_core=0.8 cm
**Material**: ABS + spring
**Gimmick**: above-average burst resistance (stronger spring tab engagement vs DB Core Valkyrie 7.7 g)
**Mechanism**: minor revision of DB Core Valkyrie (Case 430); 0.2 g lighter; above-average burst resistance; High/Low Mode CoM shift; dual-spin core; Ultimate.Legacy.Variable'-9 assembly context
**Engine Note**: type=DBCore_V2; m=7.5 g; above_avg_burst; dual_spin; spring_rebound

---

### [Case 439 — BU Blade Ultimate (Burst Ultimate System)](./9%20case%20study.md#case-439)

**System**: Burst Ultimate — BU Blade
**Geometry**: m=11.2 g; C3 smash; rubber tips; R_equiv=0.3 cm; E_rubber=2 MPa; a_rubber=2.038 mm Hertzian contact patch
**Material**: ABS + rubber tips (dual-zone)
**Contact Points**: C3 rubber-tipped Hertzian contact; a_rubber=(3WR/4E*)^(1/3)=2.038 mm; wear-progressive
**Mechanism**: wear-progressive burst impulse transmission; fresh rubber absorbs; worn ABS transmits; two-zone rubber-ABS inertia; Ultimate.Legacy.Variable'-9 assembly context
**Engine Note**: type=BUBlade_Ult; m=11.2 g; C3_rubber; a_rubber=2.038 mm; wear_progressive_burst

---

### [Case 440 — Armor 9 (Dynamite Battle / Burst Ultimate System)](./9%20case%20study.md#case-440)

**System**: Burst DB/BU — Armor
**Geometry**: m=13.9 g; C3 nine-wing (asymmetric points); r_i=1.0 cm r_o=2.4 cm; I_A9=half*0.0139*(0.010^2+0.024^2)
**Material**: ABS
**Mechanism**: nine-wing C3 asymmetric ring; High/Low Mode impulse interception; armour-disc inertia share comparison; Ultimate.Legacy.Variable'-9 assembly context
**Engine Note**: type=Armor9; m=13.9 g; C3_9wing_asymmetric; r_o=2.4 cm; impulse_intercept

---

### [Case 441 — Forge Disc Legacy (Burst Ultimate System)](./9%20case%20study.md#case-441)

**System**: Burst Ultimate — Forge Disc
**Geometry**: m=30.5 g; r_o=2.4 cm est; 6 downward blades; circular + blade profile; mu_LAD penalised by blades
**Material**: zinc alloy + blade geometry
**Mechanism**: high-OWD inertia dominance; six-blade anti-LAD mechanism (blades increase effective floor friction); Ultimate.Legacy.Variable'-9 assembly context; mu_eff elevated during final wobble
**Engine Note**: type=Legacy; m=30.5 g; 6_blade_anti-LAD; OWD_dominant; mu_LAD_penalty

---

### [Case 442 — Performance Tip Variable' (Burst Ultimate System)](./9%20case%20study.md#case-442)

**System**: Burst Ultimate — Performance Tip
**Geometry**: m=6.4 g; three-stage rubber spike wear; non-Dash spring; aggressiveness escalates with wear
**Material**: rubber + ABS (non-Dash)
**Contact Points**: three-stage rubber decay; opposite direction to stability-improving wear patterns
**Mechanism**: wear-progressive aggressiveness escalation; non-Dash burst resistance; Ultimate.Legacy.Variable'-9 assembly context
**Engine Note**: type=Variable_Prime; m=6.4 g; 3_stage_wear; non_Dash; aggressive_escalation

---

### [Case 443 — Energy Layer Z Achilles (Cho-Z Layer System)](./9%20case%20study.md#case-443)

**System**: Burst Cho-Z Layer System — Energy Layer
**Geometry**: m=18 g; C4 four blades; zinc ring r_i_zn=1.3 cm r_o_zn=1.8 cm m_zinc=3.5 g; I_ABS=half*0.0145*(0.004^2+0.022^2); I_zinc=half*0.0035*(0.013^2+0.018^2)
**Material**: ABS + zinc ring in blade wings
**Spin Coupling**: two-zone inertia; Level Chip incompatible (no counter-mass slot)
**Contact Points**: C4; phi defined by blade face; zinc radial efficiency documented
**Mechanism**: C4 four-blade vs C3 Valkyrie; Level Chip incompatible; Z.Achilles.11.Xtend assembly context; zinc placed in wings for inertia efficiency
**Engine Note**: type=ZAchilles; m=18 g; C4; zinc_wings; Level_Chip_incompatible; two_zone

---

### [Case 444 — Forge Disc 11 (Cho-Z Layer System)](./9%20case%20study.md#case-444)

**System**: Burst Cho-Z Layer System — Core Disc
**Geometry**: m=18.5 g; C2 elliptical; one-sided rectangular indent (structural asymmetry); r_i=0.4 cm r_o=2.2 cm est
**Material**: ABS (lightest Core Disc at time of release before Disc 12)
**Mechanism**: lightest Core Disc at release; C2 elliptical; one-sided indent creates unique asymmetric profile; Z.Achilles.11.Xtend assembly context; eccentricity from indent documented
**Engine Note**: type=Disc11_ChZ; m=18.5 g; C2_asymmetric; one_sided_indent; lightest_at_release

---

### [Case 445 — Performance Tip Xtend (Cho-Z / God Layer System)](./9%20case%20study.md#case-445)

**System**: Burst Cho-Z/God Layer — Performance Tip (dual-mode manual)
**Geometry**: m=7.6 g; Mode 1 sharp r_tip=0.03 cm; Mode 2 flat base r_base=0.7 cm; manual height selector switches modes
**Material**: ABS
**Contact Points**: Mode 1: r_tip=0.03 cm sharp stamina; Mode 2: r_base=0.7 cm flat aggressive; opposite extremes
**Mechanism**: dual-mode manual height-change; mode aggressiveness ratio documented; Z.Achilles.11.Xtend assembly context; user switches any time outside battle
**Engine Note**: type=Xtend; m=7.6 g; dual_mode_manual; r_tip=0.03_r_base=0.7 cm; height_selector

---

### [Case 446 — Energy Layer Cho-Z Achilles (Cho-Z Layer System)](./9%20case%20study.md#case-446)

**System**: Burst Cho-Z Layer System — Energy Layer
**Geometry**: m=21.5 g; C4 four blades (2 standard + 2 zinc sword blades); bistable deployment omega_crit~120 rad/s
**Material**: ABS + zinc sword blades + leaf spring tabs
**Gimmick**: bistable Burst-Stopper wing deployment — leaf-spring tabs snap outward above omega_crit blocking burst tabs
**Spin Coupling**: two-zone inertia; above omega_crit burst tabs physically blocked -> near-infinite burst resistance
**Contact Points**: C4; phi defined by sword geometry
**Mechanism**: Cho-Z Awakening System variant; omega_crit~120 rad/s (lower than Buster XC 140.9 rad/s); ChZAchilles.00.Dimension assembly m documented
**Engine Note**: type=ChZAchilles; m=21.5 g; C4; omega_crit=120 rad/s; bistable_burst_stopper; Cho-Z_Awakening

---

### [Case 447 — Forge Disc 00 (Cho-Z Layer System)](./9%20case%20study.md#case-447)

**System**: Burst Cho-Z Layer System — Core Disc
**Geometry**: m=25.2 g; symmetrical elliptical; r_i=0.4 cm r_o=2.2 cm; accommodates separate Frame component; heaviest Core Disc in Core Disc lineup (00 > Zenith 24.1 g > Disc 1 21.2 g)
**Material**: zinc alloy
**Mechanism**: heaviest documented Core Disc; Frame-facilitating architecture; stamina OWD dominance; ChZAchilles.00.Dimension assembly context
**Engine Note**: type=Disc00; m=25.2 g; heaviest_core_disc; Frame_compatible; OWD_dominant

---

### [Case 448 — Performance Tip Dimension (Cho-Z / God Layer System)](./9%20case%20study.md#case-448)

**System**: Burst Cho-Z/God Layer — Performance Tip (6-config manual)
**Geometry**: m=7.2 g; 3 heights (Low/Mid/High) x 2 rubber states (exposed/retracted) = 6 configurations; r_tip various by mode
**Material**: ABS + rubber spike tip (retractable)
**Contact Points**: 6-configuration height-tip matrix; rubber-exposed sharp vs retracted sharp plastic; height-dependent LAD geometry
**Mechanism**: six-configuration matrix analysis; ChZAchilles.00.Dimension assembly context; most complex manual tip in lineup
**Engine Note**: type=Dimension; m=7.2 g; 6_config_matrix; 3height_x_2rubber; LAD_height_dependent

---

### [Case 449 — Superking Chip Achilles (Superking / Sparking System)](./9%20case%20study.md#case-449)

**System**: Burst Sparking (Superking) Layer System — SK Chip
**Geometry**: m=3.1 g; r_chip=0.7 cm; ABS hub; I_Chip=half*0.0031*0.007^2~7.6e-8 kg*m2
**Material**: ABS
**Mechanism**: right-spin SK Chip for Infinite Achilles 1B assembly m_total=66.0 g I_total=1.388e-5 kg*m2; negligible inertia contribution vs Chassis 1B
**Engine Note**: type=SKChip_A; m=3.1 g; right_spin; I~7.6e-8; Inf_Achilles_context

---

### [Case 450 — Ring Infinite (Superking / Sparking System)](./9%20case%20study.md#case-450)

**System**: Burst Sparking Layer System — Ring
**Geometry**: m=12.5 g; r_i=0.8 cm r_o=2.2 cm; Balance Type; compatible with Infinite Sword (Attack) and Infinite Shield (Defense) add-ons
**Material**: ABS
**Contact Points**: base ring; Attack Mode: +Infinite Sword at r_o_sword=2.4 cm; Defense Mode: +Infinite Shield inner
**Mechanism**: dual-accessory compatible; Balance Type base; ring-assembly interaction; Infinite Achilles 1B context
**Engine Note**: type=Ring_Infinite; m=12.5 g; dual_accessory; Attack_Defense_modes

---

### [Case 451 — Infinite Sword (Superking / Sparking System — Attack Mode Accessory)](./9%20case%20study.md#case-451)

**System**: Burst Sparking — Attack Mode Accessory
**Geometry**: m=5.3 g; r_inner=2.0 cm r_outer=2.4 cm; annular wedge clips to Ring Infinite; Ring+Sword total m=17.8 g r_o=2.4 cm
**Material**: ABS
**Mechanism**: clips to Ring Infinite outer perimeter; extends r_o from 2.2 to 2.4 cm; raises attack contact radius; DeltaI_Sword=half*0.0053*(0.020^2+0.024^2)
**Engine Note**: type=InfSword; m=5.3 g; r_o_extension=2.4 cm; attack_accessory; clip-on

---

### [Case 452 — Chassis 1B (Superking / Sparking System)](./9%20case%20study.md#case-452)

**System**: Burst Sparking Layer System — Chassis (Double)
**Geometry**: m=43.0 g; r_i=0.7 cm r_o=2.3 cm; ABS + zinc reinforcement; 65.2% of assembly mass (66.0 g Balance Mode); I_1B=half*0.043*(0.007^2+0.023^2)
**Material**: ABS + zinc reinforcement
**Mechanism**: 1-Balance Double Chassis; monolithic disc-integrated; 65.2% of assembly mass; dominates Infinite Achilles assembly inertia; eliminates separate Forge Disc
**Engine Note**: type=Chassis1B; m=43.0 g; 1-Balance; integrated_disc; 65.2%_mass_fraction

---

### [Case 453 — Dimension' (Superking / Sparking System)](./9%20case%20study.md#case-453)

**System**: Burst Sparking — Performance Tip (Dash)
**Geometry**: m=7.4 g; identical geometry to Dimension (Case 448); Dash spring added; 3-height adjustable; r_tip_A=0.2 cm rubber / r_tip_B=0.05 cm retracted
**Material**: ABS + rubber + Dash spring
**Gimmick**: Dash spring burst resistance enhancement (+~40%) over non-Dash Dimension
**Mechanism**: Dash variant of Dimension; all 6 configurations available; burst resistance ~40% higher; Infinite Achilles context
**Engine Note**: type=Dimension_Prime; m=7.4 g; Dash_spring; 6_config; burst_enhanced

---

### [Case 454 — DB Core Achilles (BU System)](./9%20case%20study.md#case-454)

**System**: Burst Ultimate — DB Core
**Geometry**: m=8.1 g; ABS + rubber contact points; r_core=0.8 cm; right-spin; Rubber Lock gimmick; slope angle
**Material**: ABS + rubber contacts
**Gimmick**: Rubber Lock — slope-based burst resistance mechanism using rubber contact points
**Mechanism**: Zest Achilles Illegal Quattro'-4 assembly; Attack Mode m=74.6 g Speed Mode m=70.6 g; I_atk=1.800e-5 I_spd=1.608e-5 kg*m2; Rubber Lock slope resists burst
**Engine Note**: type=DBCore_A; m=8.1 g; Rubber_Lock; right_spin; Zest_assembly_context

---

### [Case 455 — BU Blade Zest (BU System)](./9%20case%20study.md#case-455)

**System**: Burst Ultimate — BU Blade (dual-mode)
**Geometry**: m_Speed=6.0 g / m_Attack=10.0 g (with Zest Sword 4.0 g); Speed Mode r_o=2.1 cm theta=12 deg; Attack Mode r_o=2.4 cm theta_attack higher
**Material**: ABS
**Gimmick**: dual-mode: Speed Mode (bare ring low-angle) vs Attack Mode (Zest Sword attachment extends r_o)
**Contact Points**: Speed Mode: 4 low-angle blades phi=12 deg; Attack Mode: extended phi_attack > 12 deg
**Mechanism**: Zest Sword adds 4.0 g and extends radius; Zest Achilles Illegal Quattro'-4 context
**Engine Note**: type=BUBlade_Zest; m_Speed=6.0 m_Attack=10.0 g; dual_mode; Zest_Sword_attachment

---

### [Case 456 — Armor 4 (BU System)](./9%20case%20study.md#case-456)

**System**: Burst Ultimate — Armor
**Geometry**: m=13.8 g; r_i=1.0 cm r_o=2.4 cm; hollow center construction; 6 blunt square-face protrusions; I_A4=half*0.0138*(0.010^2+0.024^2)
**Material**: ABS (hollow center)
**Mechanism**: 6 square-face protrusions; Zest Achilles Illegal Quattro'-4 assembly; hollow center reduces inertia vs solid ring; standard DB/BU Armor slot usage
**Engine Note**: type=Armor4; m=13.8 g; 6_square_protrusions; hollow_center; r_o=2.4 cm

---

### [Case 457 — Forge Disc Illegal (BU System)](./9%20case%20study.md#case-457)

**System**: Burst Ultimate — Forge Disc
**Geometry**: m=31.9 g; r_i=0.4 cm r_o=2.3 cm; C4 circular smooth perimeter; I_Ill=half*0.0319*(0.004^2+0.023^2)~8.52e-6 kg*m2; mu_LAD~0.05 (smooth perimeter)
**Material**: zinc alloy
**Mechanism**: maximum OWD in BU Forge Disc lineup; smooth perimeter minimises LAD friction; C4 gaps reduce central mass; Zest Achilles Illegal Quattro'-4 context; extreme stamina and LAD performance
**Engine Note**: type=Illegal; m=31.9 g; r_o=2.3 cm; max_OWD_BU; smooth_LAD; mu_LAD=0.05

---

### [Case 458 — Quattro' (BU System)](./9%20case%20study.md#case-458)

**System**: Burst Ultimate — Performance Tip (4-mode Dash)
**Geometry**: m=10.8 g; 4 modes: Attack r=0.5 cm rubber flat; Defense free-rotating metal ball r~0.05 cm; Stamina metal sharp r=0.03 cm; Balance rubber/sharp combined
**Material**: ABS + metal inserts + Dash spring
**Contact Points**: 4-mode tip matrix; Attack mu_k=0.85; Defense mu_metal_ball~0.01; Stamina mu_metal~0.05; Balance intermediate
**Mechanism**: most versatile tip matrix in BU lineup; Dash spring; Zest Achilles context; Quattro = 4 modes
**Engine Note**: type=Quattro_Prime; m=10.8 g; 4_mode_Dash; Attack_Defense_Stamina_Balance

---

### [Case 459 — Energy Layer Guardian Kerbeus (God Layer System)](./9%20case%20study.md#case-459)

**System**: Burst God Layer System — Energy Layer
**Geometry**: m=10.3 g; ABS; right-spin; Defense Type; r_i=0.6 cm r_o=2.1 cm; elastic chain gimmick
**Material**: ABS + rubber chain
**Gimmick**: Bound Defense elastic chain — outward rubber chain absorbs/redirects collision impulse elastically; k_chain=E_rubber*A/L
**Contact Points**: Defense Type; outer chain perimeter contact
**Mechanism**: GK.H.R assembly context; Bound Defense chain physics; elastic energy storage and return vs inelastic rubber
**Engine Note**: type=GuardianK; m=10.3 g; Bound_Defense_chain; elastic_collision_absorption

---

### [Case 460 — Forge Disc Heavy (God Layer System)](./9%20case%20study.md#case-460)

**System**: Burst God Layer System — Forge Disc
**Geometry**: m=21.6 g [FACT]; r_i=0.4 cm r_o=2.2 cm; C4 symmetric; I_H=half*0.0216*(0.004^2+0.022^2)
**Material**: zinc alloy
**Mechanism**: heaviest standard Forge Disc in God Layer/Cho-Z era; dominant inertia in GK.H.R assembly; CWD profile; heavier than Disc 1 (21.2 g) by 0.4 g
**Engine Note**: type=Heavy; m=21.6 g [FACT]; r_o=2.2 cm; C4; heaviest_GodLayer_disc

---

### [Case 461 — Performance Tip Revolve (God Layer System)](./9%20case%20study.md#case-461)

**System**: Burst God Layer System — Performance Tip
**Geometry**: m=5.9 g; sharp center tip r_tip=0.03 cm + free-spinning outer ring r_ring=0.7 cm
**Material**: ABS + metal bearing (free-spinning ring)
**Contact Points**: ultra-low spin decay sharp tip mu_tip=0.12 est; LAD via free-spinning outer ring; 3 distinct mechanisms documented
**Mechanism**: premier stamina and LAD tip of God Layer era; sharp metal tip ultra-low friction; free-spinning ring for LAD contact; GK.H.R assembly context
**Engine Note**: type=Revolve; m=5.9 g; sharp_tip + free_spin_ring; LAD_premier; ultra_low_decay

---

### [Case 462 — DB Core Kerbeus (DB/BU System)](./9%20case%20study.md#case-462)

**System**: Burst DB/BU — DB Core
**Geometry**: m=8.1 g; ABS; right-spin; Rubber Lock slope theta~slope angle; slope-based mechanism
**Material**: ABS + rubber contacts
**Gimmick**: Rubber Lock — slope mechanism achieves highest burst resistance of right-spin DB Cores; geometric slope vs PC snap-through tabs
**Mechanism**: tau_burst via slope N*sin(theta) force not spring constant; highest right-spin DB Core burst resistance; Chain Kerbeus Fortress Yard'-6 assembly context
**Engine Note**: type=DBCore_K; m=8.1 g; Rubber_Lock_slope; highest_right_spin_burst_resistance

---

### [Case 463 — BU Blade Chain (DB/BU System)](./9%20case%20study.md#case-463)

**System**: Burst DB/BU — BU Blade
**Geometry**: m=14.8 g; r_i=0.8 cm; r_o_extended=2.4 cm r_o_retracted=2.1 cm; 6 retractable rubber chains + 2 fixed plastic chains; k_chain=E_rubber*A/L per chain
**Material**: ABS + rubber chains + plastic chains
**Gimmick**: passive bistable chain deployment — rubber chains retract above omega_crit; deploy at low spin
**Contact Points**: retractable rubber chains for passive defense
**Mechanism**: passive-gimmick BU Blade; chain spring analysis; Chain Kerbeus Fortress Yard'-6 assembly context
**Engine Note**: type=BUBlade_Chain; m=14.8 g; 6_rubber_chains+2_plastic; passive_deploy; k_chain_documented

---

### [Case 464 — Armor 6 (DB/BU System)](./9%20case%20study.md#case-464)

**System**: Burst DB/BU — Armor
**Geometry**: m=13.4 g; r_i=1.0 cm r_o=2.4 cm; C6 symmetry; 6 square-face protrusions evenly spaced
**Material**: ABS
**Mechanism**: C6 symmetric stamina-oriented; shared component with Case 478 (left-spin context); Chain Kerbeus Fortress Yard'-6 assembly; I_A6=half*0.0134*(0.010^2+0.024^2)
**Engine Note**: type=Armor6; m=13.4 g; C6; 6_square_protrusions; stamina_oriented

---

### [Case 465 — Forge Disc Fortress (DB/BU System)](./9%20case%20study.md#case-465)

**System**: Burst DB/BU — Forge Disc
**Geometry**: m=31.1 g; r_i=0.4 cm r_o=2.3 cm; hexagonal + 6 downward-sloping blades (2 enlarged); C2 near-symmetric
**Material**: zinc alloy + ABS
**Mechanism**: highest-mass non-circular Forge Disc; 6-blade sloping profile; C2 asymmetry from 2 enlarged blades; directional attack potential; Chain Kerbeus assembly context
**Engine Note**: type=Fortress; m=31.1 g; C2_hex; 6_blade_slope; directional_attack

---

### [Case 466 — Yard' (DB/BU System)](./9%20case%20study.md#case-466)

**System**: Burst DB/BU — Performance Tip (Dash)
**Geometry**: m=7.4 g; free-rotating metal ball r_ball=0.05 cm + wide ABS ring r_ring=0.7 cm; Dash spring alpha=0.40 burst resistance
**Material**: ABS + metal ball + Dash spring
**Contact Points**: metal ball r_ball=0.05 cm near-point contact; mu_ball~0.01; wide ring for stadium interaction
**Mechanism**: Dash variant of Yard (+0.2 g vs Case 488); Dash spring burst resistance alpha=0.40; semi-aggressive movement from rolling ball; Chain Kerbeus Fortress Yard'-6 assembly context
**Engine Note**: type=Yard_Prime; m=7.4 g; metal_ball; Dash_alpha=0.40; semi_aggressive

---

### [Case 467 — SK Chip Deathscyther (Superking / Sparking Layer System)](./9%20case%20study.md#case-467)

**System**: Burst Sparking (Superking) Layer System — SK Chip
**Geometry**: m=3.1 g; r_outer~0.9 cm r_inner~0.4 cm; ABS only; no metal insert; lightest SK Chip tier
**Material**: ABS
**Mechanism**: right-spin SK Chip for Hollow Deathscyther; no metal insert -> lightest tier; standard hard lock tabs; Hollow Deathscyther 4A 12Axe HA' context
**Engine Note**: type=SKChip_DS; m=3.1 g; ABS_only; no_metal; lightest_tier

---

### [Case 468 — Ring Hollow (Superking / Sparking Layer System)](./9%20case%20study.md#case-468)

**System**: Burst Sparking Layer System — Ring
**Geometry**: m=14.6 g; r_outer~2.6 cm r_inner~1.1 cm; asymmetric: left half hollowed (~4 g eff) right half full with thumb-claw protrusion
**Material**: ABS
**Contact Points**: asymmetric mass: right half primary contact; thumb-claw protrusion for attack
**Mechanism**: pronounced asymmetric mass distribution; left hollowed for C1 imbalance; Hollow Deathscyther 4A assembly context; flail momentum from C1 asymmetry
**Engine Note**: type=Ring_Hollow; m=14.6 g; asymmetric_C1; left_hollow_right_full; flail_momentum

---

### [Case 469 — Chassis 4A (Superking / Sparking Layer System)](./9%20case%20study.md#case-469)

**System**: Burst Sparking Layer System — Chassis (Single)
**Geometry**: m=16.7 g; r_outer~2.6 cm r_inner~0.9 cm; ABS; dual-spin via internal directional ratchet
**Material**: ABS
**Gimmick**: dual-spin Single Chassis via internal directional ratchet (accepts CW or CCW from SK Chip)
**Mechanism**: Single Chassis (no integrated disc function); lightest Chassis category; external Forge Disc required; Hollow Deathscyther context
**Engine Note**: type=Chassis4A; m=16.7 g; dual_spin_ratchet; Single_Chassis; external_disc_required

---

### [Case 470 — Forge Disc 12 (Superking / Sparking Layer System)](./9%20case%20study.md#case-470)

**System**: Burst Sparking Layer System — Forge Disc (Core)
**Geometry**: m=16.1 g; r_outer~2.75 cm r_inner~0.8 cm; zinc alloy; C2 elliptical; r_max~3.0 cm at protrusions
**Material**: zinc alloy
**Mechanism**: lightest numbered Core Disc at 16.1 g; C2 elliptical with two protrusions; lowest heavy-disc inertia -> poor stamina contribution; Hollow Deathscyther context
**Engine Note**: type=Disc12_SK; m=16.1 g; C2_elliptical; lightest_numbered_Core_Disc

---

### [Case 471 — Disc Frame Axe (Superking / Sparking Layer System)](./9%20case%20study.md#case-471)

**System**: Burst Sparking Layer System — Disc Frame
**Geometry**: m=3.5 g; r_outer~3.0 cm; inner mount r~2.2 cm; C3 three broad flat blades; heaviest standard Disc Frame
**Material**: ABS
**Mechanism**: heaviest standard Disc Frame (>Outer 3.0 g >Armed 3.2 g >Meteor 2.9 g); wide triangular profile; C3 symmetry; Hollow Deathscyther context; LAD enhancement via broad blades
**Engine Note**: type=Frame_Axe; m=3.5 g; C3_broad_blades; heaviest_std_frame; LAD_enhanced

---

### [Case 472 — Performance Tip High Accel' (Superking / Sparking Layer System)](./9%20case%20study.md#case-472)

**System**: Burst Sparking — Performance Tip (Dash)
**Geometry**: m=7.2 g; r_contact~0.15 cm flat plastic; High body geometry (taller casing); Dash spring
**Material**: ABS + Dash spring
**Mechanism**: Dash variant of High Accel; taller casing raises CoM; aggressive flat tip movement; Hollow Deathscyther context; High body adds gyroscopic wobble-susceptibility
**Engine Note**: type=HighAccel_Prime; m=7.2 g; flat_plastic; High_body; Dash_spring

---

### [Case 473 — Energy Layer Dark Deathscyther (God Layer System)](./9%20case%20study.md#case-473)

**System**: Burst God Layer System — Energy Layer
**Geometry**: m=7.0 g; r_outer~2.1 cm r_inner~0.6 cm; 4 blades: 2 Upper Attack (15 deg) + 2 burst-point blades; ABS only
**Material**: ABS
**Contact Points**: 2-plane contact: upper 15 deg for vertical lift; burst-point blades for tab engagement
**Mechanism**: upper attack + burst-target geometry; Dark Deathscyther 3Force Jaggy context (Case 473-475); two blade types serve different combat functions
**Engine Note**: type=DarkDS; m=7.0 g; 4_blades_2_upper+2_burst; dual_function_geometry

---

### [Case 474 — Forge Disc Force (God Layer System)](./9%20case%20study.md#case-474)

**System**: Burst God Layer System — Forge Disc
**Geometry**: m=19.2 g [FACT]; r_outer~2.6 cm r_inner~0.8 cm; C4 diamond shape; r_max~2.9 cm protrusions; r_min~1.7 cm recessed
**Material**: zinc alloy
**Mechanism**: C4 diamond/plus shape; four trapezoidal protrusions; alternating protrusions/recesses; Dark Deathscyther Force Jaggy context; I_Force=half*0.0192*(0.008^2+0.026^2)
**Engine Note**: type=Force; m=19.2 g [FACT]; C4_diamond; r_max=2.9 cm; protrusion_recess_alternating

---

### [Case 475 — Performance Tip Jaggy (God Layer System)](./9%20case%20study.md#case-475)

**System**: Burst God Layer System — Performance Tip
**Geometry**: m=5.7 g; r_contact~1.8 cm flat star perimeter; 8 triangular teeth; shaft r~0.4 cm; I_Jaggy=9.674e-7 kg*m2 [CONFIRMED CS9 Case 881]
**Material**: ABS
**Contact Points**: 8-pointed flat star; jagged irregular contact disrupts smooth stadium rolling; unpredictable movement
**Mechanism**: 8-tooth star profile creates irregular floor contact; disrupts stadium surface at Jaggy tip contact points; Dark Deathscyther Force Jaggy context
**Engine Note**: type=Jaggy; m=5.7 g; 8_tooth_star; r_contact=1.8 cm; I=9.674e-7; irregular_movement

---

### [Case 476 — DB Core Bahamut (Dynamite Battle / Burst Ultimate Layer System)](./9%20case%20study.md#case-476)

**System**: Burst DB/BU — DB Core (Left-Spin)
**Geometry**: m=7.8 g; r_outer~1.4 cm r_inner~0.5 cm; left-spin; slope angle theta~22 deg; 3 BU Lock grooves; highest left-spin burst resistance
**Material**: ABS + rubber contact points
**Gimmick**: Rubber Lock slope mechanism + BU Lock grooves; highest burst resistance left-spin DB Core
**Mechanism**: left-spin Bahamut; slope angle 22 deg; Rubber Lock higher than DB Core Kerbeus (22 deg vs different geometry); Roar Bahamut Karma Metal Drift-6 context
**Engine Note**: type=DBCore_Bah; m=7.8 g; left_spin; slope_theta=22 deg; highest_left_burst; BU_Lock

---

### [Case 477 — BU Blade Roar (Dynamite Battle / Burst Ultimate Layer System)](./9%20case%20study.md#case-477)

**System**: Burst DB/BU — BU Blade
**Geometry**: m=12.1 g; r_outer_retracted~2.3 cm r_outer_deployed~2.7 cm r_inner~1.0 cm; 4 ABS protrusions bistable deployed below omega_crit
**Material**: ABS + spring mechanism
**Gimmick**: bistable deployment — protrusions held retracted by spring above omega_crit; deploy radially at low spin (passive defense/stamina enhancement)
**Mechanism**: passive deploy at low spin; spring pre-tensioned holds retracted at high spin; passive defense enhancement; Roar Bahamut Karma Metal Drift-6 context
**Engine Note**: type=BUBlade_Roar; m=12.1 g; bistable_passive_deploy; r_deploy=2.7 cm; low_spin_activate

---

### [Case 478 — Armor 6 (Dynamite Battle / Burst Ultimate Layer System, Left-Spin Context)](./9%20case%20study.md#case-478)

**System**: Burst DB/BU — Armor (Left-Spin Context)
**Geometry**: m=13.4 g; r_outer~2.6 cm r_inner~1.1 cm; 6 sides + rubber bumper inserts; same component as Case 464 but in left-spin config
**Material**: ABS + rubber bumpers
**Mechanism**: same physical component as Case 464; left-spin alters interaction geometry (contact faces hit from opposite direction); rubber bumpers absorb same-spin hits differently; Roar Bahamut context
**Engine Note**: type=Armor6_LeftSpin; m=13.4 g; same_as_464; left_spin_alters_contact; rubber_bumpers

---

### [Case 479 — Forge Disc Karma (Dynamite Battle / Burst Ultimate Layer System)](./9%20case%20study.md#case-479)

**System**: Burst DB/BU — Forge Disc
**Geometry**: m=29.2 g; r_outer~2.7 cm r_inner~0.8 cm; 10 upward-angled blades (5 pairs); phi~20 deg from vertical; I_Karma=half*0.0292*(0.014^2+0.033^2)~1.155e-5 kg*m2 [Case 508]
**Material**: zinc alloy
**Mechanism**: 10 blades in 5 pairs (tall outer + short inner guide); blade angle phi~20 deg creates Upper Force aerodynamic effect in left-spin; Roar Bahamut Karma Metal Drift-6 context
**Engine Note**: type=Karma; m=29.2 g; 10_blade_5pair; phi=20 deg; Upper_Force_aero_left_spin

---

### [Case 480 — Performance Tip Metal Drift (Dynamite Battle / Burst Ultimate Layer System)](./9%20case%20study.md#case-480)

**System**: Burst DB/BU — Performance Tip
**Geometry**: m=12.1 g; r_shaft~0.5 cm; bearing r~0.25 cm; conical tip r_tip~0.05 cm; octagonal lock ring r_ring=0.7 cm
**Material**: ABS + hardened zinc collar (Metal Lock) + ball bearings
**Gimmick**: Metal Lock system — zinc collar with shorter tabs for lower burst resistance; free-spinning sharp tip via bearing
**Spin Coupling**: Metal Lock tau_metal_lock < standard tab burst threshold; metal bearing free-spin
**Mechanism**: two mechanisms: Metal Lock burst system + metal bearing free-spin; combines burst control and LAD; Roar Bahamut context
**Engine Note**: type=MetalDrift; m=12.1 g; Metal_Lock + metal_bearing; combined_burst_LAD

---

### [Case 481 — Gatinko Chip Diabolos (Gatinko Layer System)](./9%20case%20study.md#case-481)

**System**: Burst Gatinko Layer System — Gatinko Chip
**Geometry**: m=14.0 g; ABS + integrated metal Layer Weight; dual-spin; r_hub=0.5 cm r_weight=0.9 cm
**Material**: ABS + integrated metal weight
**Gimmick**: integrated Layer Weight in chip body (unique — other chips require separate Layer Weight piece)
**Mechanism**: heaviest Gatinko Chip; metal weight integrated vs separate; dual-spin capable; Erase Diabolos Vanguard Bullet assembly context
**Engine Note**: type=GChip_Diab; m=14.0 g; integrated_LW; dual_spin; heaviest_Gatinko_Chip

---

### [Case 482 — Layer Base Erase (Gatinko Layer System)](./9%20case%20study.md#case-482)

**System**: Burst Gatinko Layer System — Layer Base
**Geometry**: m=10.6 g; ABS; left-spin; 5 upward-sloping blades theta=25 deg (Upper Attack); r_i=0.7 cm r_o=2.1 cm; I_E=half*0.0106*(0.007^2+0.021^2)
**Material**: ABS
**Contact Points**: 5 upper-sloping blades; theta=25 deg Upper Attack geometry
**Mechanism**: Balance Type designation; upper attack lift force component; hollow hub; Erase Diabolos Vanguard Bullet assembly context
**Engine Note**: type=LayerBase_Erase; m=10.6 g; 5_upper_blades; theta=25 deg; left_spin; hollow_hub

---

### [Case 483 — Forge Disc Vanguard (Gatinko Layer System)](./9%20case%20study.md#case-483)

**System**: Burst Gatinko Layer System — Forge Disc
**Geometry**: m=26.5 g; r_i=0.4 cm r_o=2.2 cm; metal frame + ABS plastic rivets; 6 downward-sloping blades (2 enlarged)
**Material**: metal frame + ABS rivets (hybrid)
**Mechanism**: unique hybrid: low-lying shape for LAD; 6-blade sloping for Attack potential; dual-purpose disc; Erase Diabolos Vanguard Bullet context
**Engine Note**: type=Vanguard; m=26.5 g; hybrid_LAD+attack; 6_blade_sloped; 2_enlarged

---

### [Case 484 — Performance Tip Bullet (Gatinko Layer System)](./9%20case%20study.md#case-484)

**System**: Burst Gatinko Layer System — Performance Tip
**Geometry**: m=15.4 g; detachable satellite m_sat~5.4 g at r_attachment=0.7 cm; main tip body m_main~10.0 g; ABS + rubber contact face
**Material**: ABS + rubber contact
**Gimmick**: detachable "bullet" satellite — adds mass eccentrically; detaches on high-force hit
**Mechanism**: heaviest standard Performance Tip in Burst lineup; satellite mechanism; rubber contact face; Erase Diabolos Vanguard Bullet context; m dominated by detachable satellite
**Engine Note**: type=Bullet; m=15.4 g; detachable_satellite=5.4 g; heaviest_Burst_tip; rubber_contact

---

### [Case 485 — Hell Salamander (Cho-Z Layer System)](./9%20case%20study.md#case-485)

**System**: Burst Cho-Z Layer System — Energy Layer (Left-Spin)
**Geometry**: m=21.27 g; ABS + 5 metal-lined blade inserts; left-spin; dual-mode Defense/Attack; r_o~2.4 cm est
**Material**: ABS + metal-lined inserts
**Gimmick**: dual-mode: Defense (10 blades spread) / Attack (5 consolidated double-blades)
**Contact Points**: mode-dependent; Defense 10-blade spread; Attack 5 double-blades
**Mechanism**: among heaviest Cho-Z layers; left-spin gear-mesh with right-spin opponents; Hell Salamander 0 Atomic assembly m=46.77 g I=9.882e-6 kg*m2; reference context for Case 882+
**Engine Note**: type=HellSalam; m=21.27 g; left_spin; 5_metal_inserts; dual_mode_D_A

---

### [Case 486 — Energy Layer Emperor Forneus (Cho-Z Layer System)](./9%20case%20study.md#case-486)

**System**: Burst Cho-Z Layer System — Energy Layer
**Geometry**: m=17.7 g; ABS + metal shark-detail inserts; right-spin; Defense Type; 12 CCW warped blades; r_i=0.6 cm r_o=2.1 cm
**Material**: ABS + metal inserts
**Mechanism**: CWD from metal inserts at inner shark-head geometry; Defense Type; 12 counter-clockwise warped blades; Emperor Forneus assembly context
**Engine Note**: type=EmperorF; m=17.7 g; CWD_metal_inserts; 12_CCW_blades; Defense_Type

---

### [Case 487 — Forge Disc 0 (Cho-Z Layer System)](./9%20case%20study.md#case-487)

**System**: Burst Cho-Z Layer System — Core Disc
**Geometry**: m=24.0 g; r_i=0.4 cm r_o=2.2 cm; C2 elliptical; zinc inner ring + ABS outer protrusions; CWD profile
**Material**: zinc alloy inner ring + ABS
**Mechanism**: heaviest Cho-Z-era numbered Forge Disc (24.0 g); CWD despite high mass (zinc concentrated inboard); two wide smooth protrusions; Emperor Forneus context
**Engine Note**: type=Disc0; m=24.0 g; C2_elliptical; CWD_zinc_inner; heaviest_ChZ_numbered_disc

---

### [Case 488 — Performance Tip Yard (Cho-Z Layer System)](./9%20case%20study.md#case-488)

**System**: Burst Cho-Z Layer System — Performance Tip
**Geometry**: m=7.2 g; metal ball r_ball=0.05 cm + wide ABS ring r_ring=0.7 cm; non-Dash; no burst-tab ring inserts
**Material**: ABS + metal ball
**Contact Points**: metal ball r_ball=0.05 cm near-point; mu_ball~0.01; ring base for stadium floor interaction
**Mechanism**: non-Dash predecessor of Yard' (Case 466, 0.2 g lighter); no Dash alpha burst contribution; semi-aggressive from rolling ball; Emperor Forneus context
**Engine Note**: type=Yard; m=7.2 g; metal_ball; non_Dash; r_ring=0.7 cm; semi_aggressive

---

### [Case 489 — DB Core Lucifer (Dynamite Battle / Burst Ultimate Layer System)](./9%20case%20study.md#case-489)

**System**: Burst DB/BU — DB Core
**Geometry**: m=7.4 g; r_outer~1.4 cm r_inner~0.5 cm; right-spin; 3 thick PC Locks + 3 BU Lock grooves; highest burst resistant among documented right-spin DB Cores via triple PC Lock
**Material**: ABS + PC Locks
**Gimmick**: three thick PC Locks provide maximum right-spin burst resistance via geometric overlap
**Mechanism**: triple PC Lock + BU Lock grooves; highest documented right-spin DB Core burst resistance; Barricade Lucifer 2Armor Bearing Mobius-10 context
**Engine Note**: type=DBCore_Luc; m=7.4 g; 3_PC_Locks+3_BU_Lock; highest_right_spin_burst

---

### [Case 490 — BU Blade Barricade (Dynamite Battle / Burst Ultimate Layer System)](./9%20case%20study.md#case-490)

**System**: Burst DB/BU — BU Blade
**Geometry**: m=14.8 g; r_outer_retracted~2.3 cm r_outer_deployed~2.7 cm r_inner~1.0 cm
**Material**: ABS
**Mechanism**: final BU Blade in Takara Tomy Burst toyline; bistable deployment gimmick (similar to Roar, Case 477); historical Easter egg "Thank You" moulded on underside; Barricade Lucifer context
**Engine Note**: type=BUBlade_Barricade; m=14.8 g; bistable_deploy; r_deploy=2.7 cm; Easter_egg_ThankYou

---

### [Case 491 — Armor 10 (Dynamite Battle / Burst Ultimate Layer System)](./9%20case%20study.md#case-491)

**System**: Burst DB/BU — Armor
**Geometry**: m=13.4 g; r_outer~2.6 cm r_inner~1.0 cm; C10 ten-fold symmetry; 10 triangular protrusions at 36 deg intervals
**Material**: ABS
**Mechanism**: C10 ten-fold symmetry; most uniform mass distribution among all Armors; 36 deg spacing; Barricade Lucifer context (also cross-referenced Case 507 right-spin)
**Engine Note**: type=Armor10; m=13.4 g; C10_10fold; 36deg_intervals; most_uniform_armor

---

### [Case 492 — Forge Disc Illegal (DB/BU Stamina Assembly Context)](./9%20case%20study.md#case-492)

**System**: Burst DB/BU — Forge Disc (stamina assembly context)
**Geometry**: m=31.9 g; I_Illegal~1.180e-5 kg*m2 (r_o=2.6 cm r_i=0.8 cm uniform two-ring approx); same component as Case 457 in different combo
**Material**: zinc alloy
**Mechanism**: cross-reference to Case 457; same physical parameters; stamina assembly pairing with Barricade Lucifer; all LAD physics identical to Case 457
**Engine Note**: type=Illegal_StamContext; cross_ref=Case457; I=1.180e-5; smooth_LAD

---

### [Case 493 — Performance Tip Bearing Mobius (Dynamite Battle / Burst Ultimate Layer System)](./9%20case%20study.md#case-493)

**System**: Burst DB/BU — Performance Tip
**Geometry**: m=7.8 g; r_outer~1.2 cm; sharp metal tip r_tip~0.03 cm; height~1.5 cm (taller by 1.5 mm vs standard); ball bearings in tip mount
**Material**: ABS casing + ball bearings + metal tip
**Contact Points**: sharp metal tip r_tip~0.03 cm; near-zero friction via ball bearings; apex of free-spinning Burst tip lineage
**Mechanism**: upgraded Mobius with ball bearings; peak free-spinning performance; Barricade Lucifer context; lowest documented spin decay in Burst lineup
**Engine Note**: type=BearingMobius; m=7.8 g; ball_bearings; r_tip=0.03 cm; lowest_spin_decay; 1.5mm_taller

---

### [Case 494 — Superking Chip Lucifer 2 (Superking / Sparking Layer System)](./9%20case%20study.md#case-494)

**System**: Burst Sparking Layer System — SK Chip (metal insert)
**Geometry**: m~3.5 g est; small zinc/steel insert in chip body; r_chip~0.9 cm; one of five SK Chips with metal component
**Material**: ABS + zinc/steel insert
**Mechanism**: second Lucifer SK Chip; metal insert increases mass concentration at outer radius vs pure ABS; metal insert provides marginal inertia increase; Variant Lucifer Mobius 2D context
**Engine Note**: type=SKChip_Luc2; m~3.5 g; metal_insert; 5_metal_SK_chips_in_lineup

---

### [Case 495 — Ring The End (Superking / Sparking Layer System)](./9%20case%20study.md#case-495)

**System**: Burst Sparking Layer System — Ring (Defense Type)
**Geometry**: m=25.5 g; r_outer~2.8 cm r_inner~1.0 cm; right-spin; Defense Type; two-layer bistable free-spin gimmick
**Material**: ABS + inner bearing/pivot
**Gimmick**: two-layer bistable free-spin: inner layer fixed to SK Chip; outer layer free-spinning on internal bearing/pivot
**Contact Points**: outer free-spinning layer absorbs lateral impact; Defense Type
**Mechanism**: heaviest Ring in lineup; Variant Lucifer Mobius 2D context; bistable free-spin provides elastic collision absorption
**Engine Note**: type=Ring_TheEnd; m=25.5 g; two_layer_free_spin; heaviest_Ring; Defense_Type

---

### [Case 496 — Forge Disc Kou (Superking / Sparking Layer System)](./9%20case%20study.md#case-496)

**System**: Burst Sparking Layer System — Forge Disc (Limit Break)
**Geometry**: m=27.3 g; r_outer~2.5 cm r_inner~0.8 cm; one of three Limit Break Discs; mechanically interfaces with Limit Break Rings
**Material**: zinc alloy
**Mechanism**: Limit Break Disc; mechanically interfaces with Limit Break Rings (Burn, Volcano, The End); name Kou (Emperor in Japanese); Variant Lucifer Mobius 2D context
**Engine Note**: type=Kou; m=27.3 g; Limit_Break_Disc; mechanical_Ring_interface; Emperor_named

---

### [Case 497 — Performance Tip Drift (Superking / Sparking Layer System)](./9%20case%20study.md#case-497)

**System**: Burst Sparking — Performance Tip
**Geometry**: m=10.0 g; r_outer~1.5 cm octagonal body; r_tip~0.04 cm conical sharp free-spinning; plain plastic bushing (not ball bearings)
**Material**: ABS + POM bushing + conical tip
**Contact Points**: free-spinning conical sharp tip via POM bushing; mu_POM~0.02 (self-lubricating crystalline); lower than Bearing Mobius (ball bearings) but cheaper
**Mechanism**: high stamina via free-spinning tip; Variant Lucifer Mobius 2D context; POM bushing not ball bearings distinguishes from Bearing Mobius
**Engine Note**: type=Drift; m=10.0 g; free_spin_POM; r_tip=0.04 cm; mu~0.02; no_ball_bearings

---

### [Case 498 — Gatinko Chip Dragon 2 (GT / Rise Layer System)](./9%20case%20study.md#case-498)

**System**: Burst GT/Rise Layer System — Gatinko Chip
**Geometry**: m=3.0 g; r_outer~0.9 cm r_inner~0.4 cm; right-spin; 3 hard locks; beta_ramp~25 deg vs standard 15 deg
**Material**: ABS
**Spin Coupling**: hard locks with steeper ramp angle beta=25 deg -> higher normal force component N*sin(beta) -> higher tau_burst vs standard chips
**Mechanism**: GT era Gatinko Chip; hard lock design; ramp angle comparison: 25 deg vs 15 deg standard; Imperial Dragon Ignition' assembly context
**Engine Note**: type=GChip_Dragon2; m=3.0 g; hard_locks; beta_ramp=25 deg; higher_tau_burst

---

### [Case 499 — Layer Imperial (GT / Rise Layer System)](./9%20case%20study.md#case-499)

**System**: Burst GT/Rise Layer System — GT Layer
**Geometry**: m=26.8 g; r_outer~2.9 cm r_inner~0.8 cm; right-spin; Attack Type; 3-stage progressive rubber awakening gimmick
**Material**: ABS + rubber gimmick components
**Gimmick**: three-stage progressive rubber awakening — most sophisticated layer-level combat evolution in GT series; three sequential activation thresholds
**Contact Points**: progressive rubber deployment increases contact friction at each stage
**Mechanism**: 3-stage awakening; heaviest GT Layer; Imperial Dragon Ignition' assembly context
**Engine Note**: type=Imperial; m=26.8 g; 3_stage_rubber_awakening; most_sophisticated_GT_layer; Attack_Type

---

### [Case 500 — Disc-Integrated Driver Ignition' (GT / Rise Layer System)](./9%20case%20study.md#case-500)

**System**: Burst GT/Rise Layer System — Disc-Integrated Driver (motorised)
**Geometry**: m=39.1 g; disc r_outer~2.4 cm; motor housing r_inner~0.5 cm; driver height~1.4 cm; battery-powered DC motor
**Material**: ABS + DC motor + battery
**Gimmick**: battery-powered DC electric motor fused with Forge Disc and Attack-type tip — single component provides motor spin assist
**Mechanism**: most mechanically complex component in case study series; motor + disc + tip integrated; Imperial Dragon Ignition' context; motor assist spin recovery during battle
**Engine Note**: type=Ignition_Prime; m=39.1 g; DC_motor; disc_integrated; battery_powered; most_complex

---

### [Case 501 — Superking Chip Dragon (Superking / Sparking Layer System)](./9%20case%20study.md#case-501)

**System**: Burst Sparking Layer System — SK Chip
**Geometry**: m=3.1 g; r_outer~0.9 cm r_inner~0.4 cm; right-spin; no metal insert; average-weight
**Material**: ABS
**Mechanism**: same mass as SK Chip Deathscyther (Case 467); no metal insert; dragon motif; Tempest Dragon 1A Charge Metal assembly context
**Engine Note**: type=SKChip_Dragon; m=3.1 g; ABS_only; no_metal; average_weight

---

### [Case 502 — Ring Tempest (Superking / Sparking Layer System)](./9%20case%20study.md#case-502)

**System**: Burst Sparking Layer System — Ring
**Geometry**: m=13.0 g; r_outer_bound~2.4 cm r_outer_awake~2.7 cm r_inner~1.1 cm; 4-blade Bound system (2 short front + 2 long rear spring-loaded)
**Material**: ABS + spring-loaded blades
**Gimmick**: Bound system: retracted Bound Mode + deployed Awakened Mode; spring-loaded blade deployment
**Contact Points**: Bound Mode baseline; Awakened Mode extends r_o to 2.7 cm for attack advantage
**Mechanism**: right-spin Attack Type; 4-blade Bound system; Tempest Dragon 1A Charge Metal context
**Engine Note**: type=Ring_Tempest; m=13.0 g; 4_blade_Bound; r_awake=2.7 cm; Attack_Type

---

### [Case 503 — Chassis 1A (Superking / Sparking Layer System)](./9%20case%20study.md#case-503)

**System**: Burst Sparking Layer System — Chassis (Double, Attack)
**Geometry**: m=45.6 g; r_outer~2.7 cm r_inner~0.8 cm; right-spin; C4 four blades at 0/90/180/270 deg; heaviest standard chassis
**Material**: ABS (integrated disc function)
**Mechanism**: 1-Attack Double Chassis; heaviest standard chassis; disc function integrated; C4 rotational symmetry; Tempest Dragon 1A Charge Metal context
**Engine Note**: type=Chassis1A; m=45.6 g; 1-Attack; C4; heaviest_standard_chassis; integrated_disc

---

### [Case 504 — Performance Tip Charge Metal (Superking / Sparking Layer System)](./9%20case%20study.md#case-504)

**System**: Burst Sparking — Performance Tip
**Geometry**: m=16.2 g; r_outer~1.6 cm; hollow flat metal tip r_tip~0.4 cm; shaft r~0.2 cm
**Material**: ABS body + hollow metal tip
**Contact Points**: hollow metal flat tip r_tip~0.4 cm; hollow reduces friction vs solid ABS flat; metal hardness reduces wear
**Mechanism**: metal-reinforced flat tip over original Charge; hollow metal tip reduces friction by reducing contact area vs solid flat; Tempest Dragon 1A context
**Engine Note**: type=ChargeMetal; m=16.2 g; hollow_metal_flat; r_tip=0.4 cm; reduced_friction_vs_solid

---

### [Case 505 — DB Core Dragon (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-505)

**System**: Burst DB/BU — DB Core
**Geometry**: m=7.8 g; r_i=1.0 cm r_o=2.2 cm (thin ring model); I~4.2e-7 kg*m2; DB Core central spring; spring constant and mode-switch function
**Material**: ABS
**Gimmick**: spring-rebound; mode-switch (Low/High Mode); BU Lock compatible
**Mechanism**: thin ring geometry vs solid disc; Gatling Dragon Karma Charge Metal'-10 assembly context; spring and mode-switch function
**Engine Note**: type=DBCore_Dragon; m=7.8 g; I=4.2e-7; spring_rebound; BU_Lock; High_Low_mode

---

### [Case 506 — BU Blade Gatling (Burst Ultimate)](./9%20case%20study.md#case-506)

**System**: Burst Ultimate — BU Blade
**Geometry**: m=16.2 g; ABS; 2 spring-loaded movable blades; SHM (deployed r_o=~2.4 cm) vs CHM (retracted)
**Material**: ABS + spring-loaded blade mechanism
**Gimmick**: dual mode: Slashing Hit Mode (SHM blades deployed radially) vs Consecutive Hit Mode (CHM alternating)
**Contact Points**: SHM: deployed blades; CHM: retracted rapid-contact geometry
**Mechanism**: dual-mode spring-loaded; Gatling Dragon Karma Charge Metal' assembly context; heavier BU Blade at 16.2 g
**Engine Note**: type=BUBlade_Gatling; m=16.2 g; SHM_CHM; 2_spring_movable_blades

---

### [Case 507 — Armor 10 (Burst Ultimate) [Cross-Reference: Case 491]](./9%20case%20study.md#case-507)

**System**: Burst Ultimate — Armor (Right-Spin Context)
**Geometry**: m=13.4 g; r_o=2.4 cm r_i=1.2 cm; C10 ten-fold; identical physical geometry to Case 491 but right-spin context
**Material**: ABS
**Mechanism**: cross-reference to Case 491; identical geometry; right-spin Gatling Dragon context vs left-spin Barricade Lucifer; contact direction reversed
**Engine Note**: cross_ref=Case491; m=13.4 g; C10; right_spin_context; Gatling_Dragon

---

### [Case 508 — Forge Disc Karma (Burst Ultimate) [Cross-Reference: Case 479, Right-Spin Context]](./9%20case%20study.md#case-508)

**System**: Burst Ultimate — Forge Disc (Right-Spin Context)
**Geometry**: m=29.2 g; r_o=3.3 cm r_i=1.4 cm; I_Karma=0.5*0.0292*(0.014^2+0.033^2)=1.155e-5 kg*m2 [Case 508 documented]; same physical component as Case 479
**Material**: zinc alloy
**Mechanism**: cross-reference to Case 479; right-spin context changes aerodynamic blade effect direction vs left-spin; physical parameters identical; Gatling Dragon context
**Engine Note**: cross_ref=Case479; m=29.2 g; I=1.155e-5; right_spin_context; aero_direction_reversed

---

### [Case 509 — Performance Tip Charge Metal' (Burst Ultimate)](./9%20case%20study.md#case-509)

**System**: Burst Ultimate — Performance Tip (Dash)
**Geometry**: m=16.3 g; same geometry as Charge Metal (Case 504); Dash spring stiffness increased; ratchet engagement augmented
**Material**: PC + zinc alloy hybrid + Dash spring
**Spin Coupling**: Dash spring stiffness increase; ratchet engagement stronger vs Charge Metal base
**Mechanism**: Dash variant of Charge Metal (+0.1 g); PC and zinc hybrid vs ABS base; augmented burst resistance; Gatling Dragon context
**Engine Note**: type=ChargeMetal_Prime; m=16.3 g; Dash_spring; PC_zinc_hybrid; augmented_burst

---

### [Case 510 — SK Chip Ragnaruk (Superking / Sparking)](./9%20case%20study.md#case-510)

**System**: Burst Sparking Layer System — SK Chip
**Geometry**: m=3.0 g; ABS; right-spin; 3 standard hard lock tabs; same mass as SK Chip Dragon 2
**Material**: ABS
**Mechanism**: winged demon Ragnaruk motif; right-spin only; 3 standard hard lock tabs compatible with right-spin SK Rings; Glide Ragnaruk 1S Drift assembly context
**Engine Note**: type=SKChip_Rag; m=3.0 g; 3_hard_lock; right_spin; ABS_only

---

### [Case 511 — Ring Glide (Superking / Sparking)](./9%20case%20study.md#case-511)

**System**: Burst Sparking Layer System — Ring
**Geometry**: m=8.3 g; ABS; C3 + pivoting wing substructure; 3 large colored wings + 3 small clear pivoting wings; 6-wing alternating arrangement
**Material**: ABS
**Contact Points**: 3 large fixed wings primary attack surface; 3 small pivoting wings passive energy absorption
**Mechanism**: Stamina Type; pivoting wings reduce recoil; Glide Ragnaruk 1S Drift context
**Engine Note**: type=Ring_Glide; m=8.3 g; 3_fixed+3_pivoting; Stamina_Type; recoil_reduction

---

### [Case 512 — Chassis 1S (Superking / Sparking)](./9%20case%20study.md#case-512)

**System**: Burst Sparking Layer System — Chassis (Single, Stamina)
**Geometry**: m=16.5 g; ABS; dual-spin capable; near-perfect circular perimeter; outer CoG for stamina; Single Chassis (no integrated disc)
**Material**: ABS
**Mechanism**: 1-Stamina Single Chassis; large-diameter near-circular; outer CoG optimised for stamina; dual-spin compatible; Glide Ragnaruk 1S Drift context; external Forge Disc required
**Engine Note**: type=Chassis1S; m=16.5 g; 1-Stamina; Single; dual_spin; circular_outer_CoG

---

### [Case 513 — Forge Disc Wheel (Burst / Cho-Z / Sparking compatible)](./9%20case%20study.md#case-513)

**System**: Burst multi-era — Forge Disc
**Geometry**: m=30.6 g; r_o=3.5 cm r_i=1.4 cm; zinc alloy; circular profile + 4 rectangular gaps at 90 deg; I_Wheel=half*0.0306*(0.014^2+0.035^2)~2.25e-5 kg*m2 est
**Material**: zinc alloy
**Mechanism**: perfectly circular outer boundary; 4 gaps reduce central mass -> increase OWD; highest documented OWD in circular discs; cross-era compatible; Glide Ragnaruk context
**Engine Note**: type=Wheel; m=30.6 g; r_o=3.5 cm; 4_gaps; I~2.25e-5; highest_OWD_circular

---

### [Case 514 — Performance Tip Revolve (Burst / Sparking)](./9%20case%20study.md#case-514)

**System**: Burst multi-era — Performance Tip
**Geometry**: m=5.9 g; r_tip=0.1 cm fixed sharp + free-spinning ring r_ring=1.4 cm; shaft r~0.2 cm
**Material**: PC
**Contact Points**: sharp tip r_tip=0.1 cm (rigidly attached, NOT free-spinning); free-spinning outer ring r_ring=1.4 cm for LAD; distinct from Bearing Mobius free-spin architecture
**Mechanism**: Stamina and LAD; fixed sharp tip; free-spinning ring provides LAD; Glide Ragnaruk context; cross-era compatibility; same component as Case 461 in different context
**Engine Note**: type=Revolve_SK; m=5.9 g; fixed_sharp_tip; free_spin_ring; LAD; cross_era

---

### [Case 515 — Energy Layer Crash Ragnaruk (Cho-Z Layer System)](./9%20case%20study.md#case-515)

**System**: Burst Cho-Z Layer System — Energy Layer
**Geometry**: m=18.9 g; ABS + zinc reinforcement; near-circular stamina profile; 4 wings (2 large PC-over-metal + 2 small clear PC); r_o~2.3 cm est
**Material**: ABS + zinc alloy reinforcement
**Contact Points**: 4-wing layout; large wings primary stamina mass; small wings secondary
**Mechanism**: near-circular stamina configuration; Crash Ragnaruk Wheel Revolve context; zinc reinforcement for stability; pivoting Stamina Wings similar concept to Ring Glide
**Engine Note**: type=CrashRag; m=18.9 g; near_circular_stamina; zinc_reinforced; 4_wing

---

### [Case 516 — Forge Disc 11 (Burst / Cho-Z)](./9%20case%20study.md#case-516)

**System**: Burst Cho-Z Layer System — Core Disc
**Geometry**: m=18.5 g; ABS (not zinc); elliptical; 2 semi-ellipses each with 1 large protrusion creating "11" visual; one protrusion with rectangular indent asymmetry
**Material**: ABS (unusual for Burst Forge Disc — no zinc casting despite naming)
**Mechanism**: same physical component as Case 444; ABS construction despite "Forge Disc" naming; one-sided indent creates C2 asymmetry; Crash Ragnaruk context
**Engine Note**: cross_ref=Case444; m=18.5 g; ABS_not_zinc; C2_asymmetric; indent_one_side

---

### [Case 517 — Disc Frame Reach (Burst / Cho-Z)](./9%20case%20study.md#case-517)

**System**: Burst Cho-Z — Disc Frame
**Geometry**: m=2.5 g; PC; 6 clockwise-angled blades (3 upper + 3 lower staggered); r_i=1.9 cm r_o=2.4 cm; mounted on Disc 11
**Material**: PC (polycarbonate)
**Mechanism**: 6 interleaved blades at two heights; clockwise-angled for aerodynamic interaction; Crash Ragnaruk context; PC material for increased toughness vs ABS frames
**Engine Note**: type=Frame_Reach; m=2.5 g; PC; 6_blade_staggered; CW_angled; r_i=1.9_r_o=2.4 cm

---

### [Case 518 — Performance Tip Wedge (Burst / Cho-Z)](./9%20case%20study.md#case-518)

**System**: Burst Cho-Z — Performance Tip
**Geometry**: m=7.0 g; hollow zinc alloy conical; t_wall=0.8 mm; air cavity inside cone; wide low-angle cone geometry
**Material**: zinc alloy (hollow cone)
**Contact Points**: conical geometry; minimal contact radius from low cone angle; metal low friction mu~0.05-0.08
**Mechanism**: hollow zinc cone for stamina; minimal contact from low-angle cone; metal reduces friction; Crash Ragnaruk context
**Engine Note**: type=Wedge; m=7.0 g; hollow_zinc_cone; t_wall=0.8 mm; low_angle; mu~0.05-0.08

---

### [Case 519 — DB Core Ragnaruk (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-519)

**System**: Burst DB/BU — DB Core
**Geometry**: m=6.7 g; ABS; 7-lock fine-tooth ratchet geometry; lightest documented DB Core; demon motif (Norse Ragnarok)
**Material**: ABS
**Spin Coupling**: 7 fine locks distribute burst torque; lower per-tooth engagement depth vs 4 medium-short teeth
**Mechanism**: 7-lock fine-tooth vs others; Cyclone Ragnaruk Giga Never-6 assembly context; lightest DB Core at 6.7 g
**Engine Note**: type=DBCore_Rag; m=6.7 g; 7_fine_lock; lightest_DB_Core; Norse_motif

---

### [Case 520 — Blade Cyclone (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-520)

**System**: Burst DB/BU — BU Blade
**Geometry**: m=8.3 g; ABS; 2-blade round stamina profile; movable pivoting Stamina Wings; r_o~2.2 cm
**Material**: ABS
**Contact Points**: 2-blade symmetric; movable wings pivot to reduce recoil on contact
**Mechanism**: round two-blade stamina profile; Stamina Wings same concept as Ring Glide; Cyclone Ragnaruk Giga Never-6 context; lighter DB/BU blade at 8.3 g
**Engine Note**: type=BUBlade_Cyclone; m=8.3 g; 2_blade_round; pivoting_Stamina_Wings; lighter_blade

---

### [Case 521 — Armor 6 (Dynamite Battle / Burst Ultimate) [Cross-Reference: Case 478]](./9%20case%20study.md#case-521)

**System**: Burst DB/BU — Armor (another context)
**Geometry**: m=13.4 g; r_o=2.4 cm r_i=1.2 cm; 6 square-face protrusions; same physical component as Case 478
**Material**: ABS
**Mechanism**: cross-reference to Case 478; Cyclone Ragnaruk context; right-spin DB context vs left-spin in Case 478; physical parameters identical
**Engine Note**: cross_ref=Case478; m=13.4 g; C6; Cyclone_Ragnaruk_context

---

### [Case 522 — Forge Disc Giga (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-522)

**System**: Burst DB/BU — Forge Disc
**Geometry**: m=32.8 g; r_o=3.5 cm (circumscribed) r_apo=3.23 cm (inscribed); zinc alloy; octagonal profile (MFB Gravity homage); 8 equal flat sides
**Material**: zinc alloy
**Mechanism**: homage to MFB-era Gravity disc; octagonal 8-sided symmetric; r_o=3.5 cm; Cyclone Ragnaruk Giga Never-6 context; I_Giga=half*0.0328*(r_i^2+0.035^2) high OWD
**Engine Note**: type=Giga; m=32.8 g; r_o=3.5 cm; octagonal; Gravity_homage; high_OWD

---

### [Case 523 — Performance Tip Never (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-523)

**System**: Burst DB/BU — Performance Tip
**Geometry**: m=7.6 g; PC + POM; free-spinning conical sharp tip on central axle with POM bushing; POM outer ring
**Material**: PC body + POM bushing (self-lubricating) + conical tip
**Contact Points**: free-spinning conical tip via POM bushing; mu_POM~0.02; POM outer ring r_ring=? for LAD
**Mechanism**: POM-on-steel axle ultra-low friction bushing; free-spinning; Cyclone Ragnaruk Giga Never-6 context; stamina specialist
**Engine Note**: type=Never; m=7.6 g; POM_bushing; free_spin_conical; mu~0.02; stamina_specialist

---

### CS9 Late Block — Cases 867–891 {#cs9-late}

---

### [Case 867 — Energy Layer: Dead Phoenix (Cho-Z, 21.8 g)](./9%20case%20study.md#case-867)

**System**: Burst Cho-Z Layer System — Energy Layer
**Geometry**: m=21.8 g; C4 four-fold symmetric; Dead Armor (DA) outer annulus + Dead Core (DC) inner; I_DC+I_DA=6.028e-6 kg*m2 total [Case 870]; dual-armor architecture
**Material**: ABS (DA outer) + ABS (DC inner)
**Gimmick**: Dead Armor sacrifice system — DA detaches on burst event -> DC perimeter becomes smooth -> near-immune to subsequent burst
**Spin Coupling**: DA carries burst tabs; after sacrifice: smooth DC = no further burst engagement
**Mechanism**: dual-armor burst-sacrifice; confirmed best Defence combo use (smooth post-sacrifice perimeter); Dead Phoenix 10 Friction assembly context
**Engine Note**: type=DeadPhoenix; m=21.8 g; C4; dual_armor_sacrifice; smooth_post_burst; I_total=6.028e-6

---

### [Case 868 — Forge Disc: 10 (Cho-Z, 23.8 g)](./9%20case%20study.md#case-868)

**System**: Burst Cho-Z — Core Disc
**Geometry**: m=23.8 g; C10 ten-fold symmetric; r_o=2.4 cm r_i=1.3 cm; I_10=0.5*0.0238*(0.024^2+0.013^2)=8.861e-6 kg*m2 [ESTIMATED geometry; CONFIRMED mass]; r_eff=19.3 mm est
**Material**: zinc alloy
**Mechanism**: ten-fold symmetric; high inertia Cho-Z disc; Dead Phoenix 10 Friction assembly context
**Engine Note**: type=Disc10_ChZ; m=23.8 g; C10; I=8.861e-6; r_eff=1.93 cm

---

### [Case 869 — Performance Tip: Friction (Cho-Z, 7.0 g)](./9%20case%20study.md#case-869)

**System**: Burst Cho-Z — Performance Tip
**Geometry**: m=7.0 g; POM flat contact r_contact=0.45 cm; mu_POM=0.10 (self-lubricating crystalline)
**Material**: POM (polyoxymethylene) — self-lubricating
**Contact Points**: r_contact=0.45 cm flat; mu_POM=0.10 (between rubber 0.85 and metal 0.05-0.12); firm grip for KO resistance while maintaining low decay
**Mechanism**: POM flat tip stamina specialist; lower friction than ABS (0.17) and far lower than rubber (0.85); Dead Phoenix 10 Friction assembly context
**Engine Note**: type=Friction; m=7.0 g; POM; mu=0.10; r_contact=0.45 cm; stamina_KO_resist

---

### [Case 870 — Assembly: Dead Phoenix 10 Friction (Cho-Z, 52.6 g)](./9%20case%20study.md#case-870)

**System**: Burst Cho-Z — Full Assembly
**Geometry**: m=52.6 g; I_total=1.503e-5 kg*m2 [CALCULATED]; fractions: I_layer=40.1%, I_disc=58.9%, I_tip=0.84%; L0=I*omega_launch
**Material**: composite assembly
**Mechanism**: Cho-Z stamina assembly; inertia dominated by disc (58.9%); Dead Armor sacrifice strategy; full spin decay budget documented
**Engine Note**: assembly; m=52.6 g; I=1.503e-5; disc_dominant_58.9%; Dead_Armor_sacrifice

---

### [Case 871 — Energy Layer: Revive Phoenix (Cho-Z, 23.3 g)](./9%20case%20study.md#case-871)

**System**: Burst Cho-Z Layer System — Energy Layer
**Geometry**: m=23.3 g; dual-armor: Revive Armor (RA) + Revive Core (RC); parry window ~0.45-0.75 N for free-spin; above 0.75 N RA locks and absorbs
**Material**: ABS dual-armor
**Gimmick**: Revive Armor parry mechanism — free-spins in impact force parry window; locks above threshold; absorbs and redirects rather than sacrificing
**Spin Coupling**: parry window: free-spin absorption in range; lock above range prevents burst
**Mechanism**: best Right-Spin Defense Layer of Cho-Z generation [CONFIRMED]; parry vs sacrifice distinction from Dead Phoenix (Case 867); heavier than Dead Phoenix by 1.5 g
**Engine Note**: type=RevivePhoenix; m=23.3 g; parry_mechanism; RA_free_spin_window; best_ChZ_RSD

---

### [Case 872 — DB Core: Phoenix (DB System, 7.6 g)](./9%20case%20study.md#case-872)

**System**: Burst DB Layer System — DB Core
**Geometry**: m=7.6 g; r_o=1.0 cm r_i=0.4 cm annular model; I_core=0.5*0.0076*(0.010^2+0.004^2)=4.408e-7 kg*m2; 4 locking teeth
**Material**: ABS
**Spin Coupling**: 4 locking teeth engage Blade; burst resistance from tooth engagement geometry
**Mechanism**: innermost ratchet hub of DB Layer System; modelled as annular cylinder; Prominence Phoenix assembly context
**Engine Note**: type=DBCore_Ph; m=7.6 g; 4_locking_teeth; I=4.408e-7; annular_hub

---

### [Case 873 — Blade: Prominence (DB System, ~24.0 g)](./9%20case%20study.md#case-873)

**System**: Burst DB Layer System — Blade
**Geometry**: m_total~24.0 g (Shield 9.5 g [CONFIRMED] + Blade body ~14.5 g [ESTIMATED]); r_o=2.3 cm r_i=1.1 cm; I_blade=half*0.0145*(0.023^2+0.011^2) + shield contribution; total I~9.397e-6 kg*m2
**Material**: ABS + detachable Prominence Shield
**Gimmick**: detachable Prominence Shield (PS, 9.5 g) — functions as additional armor that can detach
**Contact Points**: outer blade body + shield perimeter
**Mechanism**: Prominence Phoenix Tapered-10 Metal Universe assembly context; detachable shield adds outer protection; total blade with shield I~9.397e-6 kg*m2
**Engine Note**: type=Blade_Prominence; m_total=24.0 g (Shield=9.5+body=14.5); I~9.397e-6; detachable_shield

---

### [Case 874 — Armor-10 (DB System, 13.4 g)](./9%20case%20study.md#case-874)

**System**: Burst DB Layer System — Armor
**Geometry**: m=13.4 g; r_o=2.2 cm r_i=1.5 cm; I_A10=0.5*0.0134*(0.022^2+0.015^2)=4.750e-6 kg*m2; r_eff=18.83 mm; n=10 rotational features
**Material**: ABS
**Mechanism**: DB System Armor; n=10 protrusions; Prominence Phoenix assembly context; narrow annular width (r_o-r_i=0.7 cm) concentrated at medium radius
**Engine Note**: type=Armor10_DB; m=13.4 g; C10; r_i=1.5_r_o=2.2 cm; I=4.750e-6

---

### [Case 875 — Forge Disc: Tapered (DB System, 29.3 g)](./9%20case%20study.md#case-875)

**System**: Burst DB Layer System — Forge Disc
**Geometry**: m=29.3 g; r_o=2.7 cm r_i=1.1 cm; I_Tap=0.5*0.0293*(0.027^2+0.011^2)=1.245e-5 kg*m2; r_eff=19.7 mm; tapered profile
**Material**: zinc alloy (tapered construction)
**Mechanism**: highest-inertia standard disc at point of documentation; elevated mass + larger r_o vs Cho-Z discs; Prominence Phoenix assembly context; tapered cross-section
**Engine Note**: type=Tapered; m=29.3 g; r_o=2.7 cm; I=1.245e-5; highest_inertia_at_time

---

### [Case 876 — Performance Tip: Metal Universe (DB System, 11.1 g)](./9%20case%20study.md#case-876)

**System**: Burst DB Layer System — Performance Tip
**Geometry**: m=11.1 g; wide hemispherical ball + metal steel ball bearing insert; r_contact~0.2 cm (near-point from spherical geometry); mu_MU~0.012 [CONFIRMED metal bearing; ESTIMATED mu and r_contact]
**Material**: ABS housing + steel ball bearing insert
**Contact Points**: near-point contact r~0.2 cm; mu_MU~0.012 ultra-low; hemispherical ball geometry
**Mechanism**: DB stamina premier tip; metal ball bearing ultra-low friction; hemispherical ball near-point contact; Prominence Phoenix assembly context
**Engine Note**: type=MetalUniverse; m=11.1 g; steel_ball_bearing; mu=0.012; near_point_contact; DB_stamina_premier

---

### [Case 877 — Assembly: Prominence Phoenix 10 Tapered Metal Universe (DB System, 85.4 g)](./9%20case%20study.md#case-877)

**System**: Burst DB — Full Assembly
**Geometry**: m=85.4 g; I_total=I_core(4.408e-7)+I_blade(9.397e-6)+I_armor(4.750e-6)+I_tapered(1.245e-5)+I_tip(5.13e-7)=2.766e-5 kg*m2 [CALCULATED]; disc dominant
**Material**: composite DB assembly
**Mechanism**: highest total assembly mass documented in Burst era at time; total I=2.766e-5 kg*m2; massive angular momentum reserve; DB stamina archetype
**Engine Note**: assembly; m=85.4 g; I=2.766e-5; heaviest_Burst_assembly; Tapered_disc_dominant

---

### [Case 878 — Energy Layer: Twin Nemesis (God Layer System, 13.1 g)](./9%20case%20study.md#case-878)

**System**: Burst God Layer System — Energy Layer
**Geometry**: m=13.1 g; C2 two-fold elliptical; two large opposing blades; I_x != I_y (confirmed gyroscopic imbalance wobble); I_TN=3.461e-6 kg*m2 [from Case 881]
**Material**: ABS
**Contact Points**: two large opposing blades; C2 asymmetric contact frequency
**Mechanism**: only common layer with I_x != I_y -> gyroscopic wobble confirmed; Twin Nemesis 3Hit Jaggy assembly context
**Engine Note**: type=TwinNemesis; m=13.1 g; C2; I_x_neq_I_y; gyroscopic_wobble; I=3.461e-6

---

### [Case 879 — Forge Disc: 3 (God Layer System, 21.6 g)](./9%20case%20study.md#case-879)

**System**: Burst God Layer System — Core Disc
**Geometry**: m=21.6 g; two-zone: inner ring 45% (9.72 g, r_o=0.8 cm r_i=0.4 cm) + outer slim ring 55% (11.88 g, r=1.7 cm); I_3=3.822e-6 kg*m2 [CALCULATED]
**Material**: zinc alloy
**Mechanism**: two-zone CWD mass distribution; inboard concentration relative to even-numbered discs; I_3=3.822e-6 kg*m2; Twin Nemesis 3Hit Jaggy assembly context
**Engine Note**: type=Disc3_God; m=21.6 g; two_zone_CWD_inboard; I=3.822e-6; lower_OWD_vs_even_discs

---

### [Case 880 — Disc Frame: Hit (God Layer System, 2.0 g)](./9%20case%20study.md#case-880)

**System**: Burst God Layer System — Disc Frame
**Geometry**: m=2.0 g; thin ring body 1.5 g at r=1.8 cm + asymmetric protrusion 0.5 g at r=1.9 cm; I_Hit=4.860e-7+1.805e-7=6.665e-7 kg*m2; combined I_3Hit=4.489e-6 kg*m2
**Material**: ABS
**Mechanism**: asymmetric single protrusion on thin ring; combined with Disc 3: I_3Hit=4.489e-6; m_3Hit=23.6 g; Twin Nemesis 3Hit Jaggy assembly context
**Engine Note**: type=Frame_Hit; m=2.0 g; asymmetric_protrusion; I=6.665e-7; I_3Hit_combined=4.489e-6

---

### [Case 881 — Assembly: Twin Nemesis 3Hit Jaggy (God Layer System, 42.4 g)](./9%20case%20study.md#case-881)

**System**: Burst God Layer — Full Assembly
**Geometry**: m=42.4 g; I_total=I_TN(3.461e-6)+I_3Hit(4.489e-6)+I_Jaggy(9.674e-7)=8.918e-6 kg*m2 [CALCULATED]; fractions: TN=38.8%, Disc3=42.5%, Hit=~7.5%, Jaggy=10.8%
**Material**: composite God Layer assembly
**Mechanism**: lightweight God Layer attack assembly; gyroscopic wobble from TN C2 asymmetry; disc+frame combined inertia dominant; I_total=8.918e-6 kg*m2
**Engine Note**: assembly; m=42.4 g; I=8.918e-6; TN_gyro_wobble; disc_dominant_42.5%

---

### [Case 882 — Energy Layer: Hell Salamander (Cho-Z, Left-Spin, 21.27 g)](./9%20case%20study.md#case-882)

**System**: Burst Cho-Z Layer System — Energy Layer (Left-Spin)
**Geometry**: m=21.27 g; left-spin; 10 blades mode-changeable; Defense Mode (10 spread) vs Attack Mode (5 double-blades); I_HS=6.774e-6 kg*m2 [from Case 885]
**Material**: ABS
**Gimmick**: mode-change between Defense (10 spread blades) and Attack (5 consolidated double-blades)
**Contact Points**: mode-dependent blade arrangement
**Mechanism**: left-spin creates gear-mesh interaction with right-spin opponents; Hell Salamander 12 Operate assembly context; same layer as Case 485 different assembly
**Engine Note**: cross_ref=Case485; m=21.27 g; left_spin; 10_blade_mode_change; I=6.774e-6; gear_mesh

---

### [Case 883 — Forge Disc: 12 (Cho-Z, 16.1 g)](./9%20case%20study.md#case-883)

**System**: Burst Cho-Z — Core Disc
**Geometry**: m=16.1 g; even-numbered (2 Frame slots); r_o=2.1 cm r_i=1.2 cm; I_12=0.5*0.0161*(0.021^2+0.012^2); lightest Cho-Z Core Disc [CONFIRMED]
**Material**: zinc alloy
**Mechanism**: same disc as Case 419 (12-Core) but in Hell Salamander context; lightest confirmed Cho-Z Core Disc; Frame-compatible; Hell Salamander 12 Operate context
**Engine Note**: cross_ref=Case419; m=16.1 g; lightest_ChZ_disc; C_even_Frame_compatible; I=4.711e-6 [from Case 885]

---

### [Case 884 — Performance Tip: Operate (Cho-Z, 7.1 g)](./9%20case%20study.md#case-884)

**System**: Burst Cho-Z — Performance Tip (dual-mode, underperforming)
**Geometry**: m=7.1 g; sliding mechanism offsets/centers wide plastic ball contact; Attack Mode (ball off-center) vs Defense Mode (ball centered)
**Material**: ABS + plastic ball + sliding mechanism
**Gimmick**: sliding offset mechanism for Attack/Defense modes; both modes confirmed underperforming
**Contact Points**: off-center ball in Attack Mode creates eccentric contact; centered ball in Defense
**Mechanism**: dual-mode tip whose gimmick actively impedes competitive viability [CONFIRMED]; both modes inferior to specialist alternatives; Hell Salamander 12 Operate context; I_tip~8.875e-8 kg*m2
**Engine Note**: type=Operate; m=7.1 g; sliding_offset; dual_mode_underperforming; I=8.875e-8

---

### [Case 885 — Assembly: Hell Salamander 12 Operate (Cho-Z, Left-Spin, 44.47 g)](./9%20case%20study.md#case-885)

**System**: Burst Cho-Z — Full Assembly (Left-Spin)
**Geometry**: m=44.47 g; I_total=I_HS(6.774e-6)+I_12(4.711e-6)+I_tip(8.875e-8)=1.157e-5 kg*m2 [CALCULATED]; fractions: HS=58.6%, Disc12=40.7%, Operate=0.77%
**Material**: composite Cho-Z left-spin assembly
**Mechanism**: left-spin Cho-Z assembly; layer dominates at 58.6%; Hell Salamander gear-mesh with right-spin opponents; Operate underperforms in both modes
**Engine Note**: assembly; m=44.47 g; I=1.157e-5; layer_dominant_58.6%; left_spin; gear_mesh_right_opponents

---

### [Case 886 — Armor Detachment: Dimensional Collapse and Geometric Phase Transition (Cross-System Analysis)](./9%20case%20study.md#case-886)

**System**: Cross-System Analysis — Armor/Shield Detachment Physics
**Geometry**: analysis covers simultaneous change across 3 spatial dimensions: diameter, height, perimeter shape on detachment
**Material**: varies by system
**Mechanism**: losing detachable armor = phase transition in mechanical identity; simultaneous diameter reduction + height reduction + perimeter smoothing; post-detachment object is geometrically distinct; physical consequences documented for Dead Phoenix (Case 867), Prominence Shield (Case 873), and all detachable components
**Engine Note**: type=cross_system_analysis; armor_detachment_phase_transition; 3D_simultaneous_collapse

---

### [Case 887 — Energy Layer: Killer Deathscyther (God Layer, Right-Spin, Attack, 9.2 g)](./9%20case%20study.md#case-887)

**System**: Burst God Layer System — Energy Layer
**Geometry**: m=9.2 g; 6 blades: 2 colored ABS (Upper Attack 15 deg) + 4 clear ABS (flat Burst Attack) + 1 centrifugal sliding blade ("Double Strike" gimmick); all gimmick elements fail by confirmation
**Material**: ABS
**Gimmick**: "Double Strike" centrifugal sliding blade — confirmed fails in competitive use
**Contact Points**: 2 upper attack blades (lift); 4 burst-point blades (tab engagement); sliding gimmick blade (non-functional)
**Mechanism**: triple-type blade architecture; Killer Deathscyther 2Vortex Hunter assembly context; I_KD=2.141e-6 kg*m2 [from Case 891]; gimmick failure confirmed
**Engine Note**: type=KillerDS; m=9.2 g; 6_blades; Double_Strike_gimmick_fails; I=2.141e-6

---

### [Case 888 — Forge Disc: 2 (God Layer, 21.21 g)](./9%20case%20study.md#case-888)

**System**: Burst God Layer System — Core Disc
**Geometry**: m=21.21 g; standard weight; uniform annular distribution; even-numbered (2 Frame slots); single protrusion per side ("2" molding); I_2 [part of I_2V=7.322e-6 in Case 891]
**Material**: zinc alloy
**Mechanism**: "Jack-of-All-Trades" designation [CONFIRMED]; adequate in any combination type; minimal protrusion design avoids aggressive recoil; Killer Deathscyther 2Vortex Hunter context
**Engine Note**: type=Disc2_God; m=21.21 g; jack_of_all_trades; minimal_protrusion; Frame_compatible

---

### [Case 889 — Disc Frame: Vortex (God Layer, 2.51 g)](./9%20case%20study.md#case-889)

**System**: Burst God Layer System — Disc Frame
**Geometry**: m=2.51 g; wide triangular profile; wave-like surface; 3 sides; heaviest God Layer Frame [CONFIRMED]; I_Vortex part of I_2V=7.322e-6 kg*m2 (Disc 2 + Vortex combined)
**Material**: ABS
**Mechanism**: 25% heavier than Hit Frame (2.0 g) and Cross Frame (~2.0 g); notable inertia vs peers; protrusion height insufficient for competitive attack; Killer Deathscyther 2Vortex Hunter context
**Engine Note**: type=Frame_Vortex; m=2.51 g; heaviest_God_Frame; I_2V=7.322e-6; wide_triangular

---

### [Case 890 — Performance Tip: Hunter (God Layer, 5.9 g)](./9%20case%20study.md#case-890)

**System**: Burst God Layer System — Performance Tip
**Geometry**: m=5.9 g; annular rubber contact ring; r_outer~0.5 cm r_inner~0.2 cm void; r_contact~0.35 cm (ring centroid); I_Hunter=7.375e-8 kg*m2 [from Case 891]
**Material**: rubber (annular contact ring)
**Contact Points**: rubber annular ring; central depression eliminates center contact; mu_k=0.85 rubber; r_contact~0.35 cm
**Mechanism**: rubber flat with center void (similar concept to Xtreme Case 1002); God Layer attack context; Killer Deathscyther 2Vortex Hunter assembly
**Engine Note**: type=Hunter; m=5.9 g; rubber_annular; void_center; r_contact=0.35 cm; I=7.375e-8

---

### [Case 891 — Assembly: Killer Deathscyther 2Vortex Hunter (God Layer, Right-Spin, 38.82 g)](./9%20case%20study.md#case-891)

**System**: Burst God Layer — Full Assembly
**Geometry**: m=38.82 g; I_total=I_KD(2.141e-6)+I_2V(7.322e-6)+I_Hunter(7.375e-8)=9.537e-6 kg*m2 [CALCULATED]; fractions: KD=22.5%, Disc2=67.3% est, Vortex=~9.5%, Hunter=0.77%
**Material**: composite God Layer assembly
**Mechanism**: disc+frame dominant at ~76.8%; lightweight attack assembly; layer provides attack geometry while disc dominates inertia; gimmick blade non-functional in competitive context
**Engine Note**: assembly; m=38.82 g; I=9.537e-6; disc_dominant_67.3%; KD_gimmick_fails

---


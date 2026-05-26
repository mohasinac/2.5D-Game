# Beyblade Case Studies — Master Index

Total: **585 cases** across 10 files + 1 master reference.

---

## File Map

| File | Cases | Scope |
|------|-------|-------|
| [1 case study.md](1%20case%20study.md) | 1–73 | Physics fundamentals → MFB/4D parts |
| [2 case study.md](2%20case%20study.md) | 74–123 | HMS parts → Gen 1 Plastic SG-era parts |
| [3 case study.md](3%20case%20study.md) | 118–187 | Gen 1 Plastic SG/EG/CEW parts |
| [4 case study.md](4%20case%20study.md) | 189–237 | Gen 1 EG/CEW parts → Anime-only |
| [5 case study.md](5%20case%20study.md) | 236–296 | System architectures → MFB wheels/tracks/bottoms |
| [6 case study.md](6%20case%20study.md) | 297–353 | MFB bottoms → 4D wheels/bottoms/tracks |
| [7 case study.md](7%20case%20study.md) | 354–374 | BX/UX/CX system architecture → All-gen system summaries |
| [8 case study.md](8%20case%20study.md) | 375–415 | BX/UX blades, ratchets, bits |
| [9 case study.md](9%20case%20study.md) | 392–544 | Burst series (all subsystems) full lineage analysis |
| [10 case study.md](10%20case%20study.md) | 545–585 | Arena mechanics, stadiums, launch physics |
| [MASTER ANALYSIS.md](MASTER%20ANALYSIS.md) | — | Engine reference: constants, formulas, normalization |

### Numbering Notes

- **Duplicate numbers in CS2**: Cases 106–113 appear twice with different parts (second run uses garbled em-dash encoding). The first occurrence covers MFB-era parts (Dragon Head AR, Wide WD, etc.); the second covers Gen 1 Plastic SG parts (Neo Right SG Shells, Metal Weight Core, etc.).
- **Out-of-order in CS1**: Case 16 (Kreis) placed after Case 21; Case 74 (Spring Core RC) placed between Cases 67 and 68.
- **CS9 sequencing**: Cases are grouped by Beyblade lineage (Xcalibur, Valkyrie, Achilles, etc.) rather than strict numeric order. Cases 392–396 overlap numbering with CS8 (different parts).
- **CS5 overlap**: Cases 236–237 in CS5 (system architectures) differ from Cases 236–237 in CS4 (specific EG parts).

---

## Tag Legend

**Generations**: `Fundamentals` · `Gen1-Plastic` · `Gen1-HMS` · `Gen2-MFB` · `Gen2-4D` · `Gen2-ZeroG` · `Gen3-Burst` · `Gen4-BX` · `Cross-Gen`

**Systems**: `4LS` (4 Layer) · `SGS` (Spin Gear) · `MGS` (Magnacore) · `EGS` (Engine Gear) · `HMS` · `MFS` (Metal System) · `HWS` (Hybrid Wheel) · `4D` · `ZeroG` (Synchrome) · `Burst-Std` · `Burst-DL` (Dual Layer) · `Burst-God` · `Burst-CZ` (Cho-Z) · `Burst-GT` (Gatinko) · `Burst-SK` (Sparking/Superking) · `Burst-DB` (Dynamite Battle) · `Burst-BU` (Burst Ultimate) · `BX-Basic` · `BX-Unique` · `BX-Custom`

**Part Types**: `AR` · `WD` · `BB` · `SG` · `SP` · `SAR` · `Core` · `RC` · `CWD` · `EG` · `CEW` · `Wheel` · `ClearWheel` · `Track` · `Bottom` · `Layer` · `Blade` · `Disc` · `Frame` · `Chip` · `Armor` · `Ratchet` · `Bit` · `Chassis` · `Ring` · `Gear` · `System` · `Arena` · `Launcher` · `Mechanic` · `Assembly`

---

## Part 1 — Cases 1–73

> Physics fundamentals, MFB/4D/HMS individual parts

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 1 | Hit to a Freely Suspended Body | Fundamentals | — | Mechanic | impulse, translation, rotation |
| 2 | Hit to a Body Already in Motion | Fundamentals | — | Mechanic | impulse, momentum |
| 3 | The Body Becomes a Gyro (spinning) | Fundamentals | — | Mechanic | gyroscope, precession |
| 4 | Gyro Has Contact Points, Gets Hit On One | Fundamentals | — | Mechanic | contact-point, torque |
| 5 | Gyro + Contact Points + TILT | Fundamentals | — | Mechanic | tilt, precession |
| 6 | Per-Tick Integration | Fundamentals | — | Mechanic | tick-loop, simulation |
| 7 | Tip Hit + Gyroscopic Counter-Strike (2-Tick Cascade) | Fundamentals | — | Mechanic | tip-hit, gyro-response |
| 8 | Destabilization: Smash, Upper, Recoil, Ground | Fundamentals | — | Mechanic | destabilization |
| 9 | Body On The Floor: How The Floor Constraint Changes Everything | Fundamentals | — | Mechanic | floor-constraint |
| 10 | Hit Height: Upper, Equator, Lower, Axis | Fundamentals | — | Mechanic | hit-height |
| 11 | Tall Bey vs Short Bey: Height Mismatch Contact | Fundamentals | — | Mechanic | height-mismatch |
| 12 | The Full Contact System: Computing Contact Points, Torques, Bounces | Fundamentals | — | Mechanic | contact-system |
| 13 | Bounce Behavior: What Determines the Rebound | Fundamentals | — | Mechanic | restitution, bounce |
| 14 | Off-Axis Tip: Jumping, Airborne, Landing (Storm Capricorn M145Q) | Gen2-MFB | MFS | Bottom | M145, Q-tip, jumping |
| 15 | Multi-Layer Tip Profile System | Cross-Gen | — | Mechanic | tip-profiles |
| 16 | Metal Wheel Compliance: Partial Rotational Free-Spin (Kreis) | Gen2-4D | 4D | Wheel | Kreis, free-spin |
| 17 | Cross-Component Coupled Mechanics: Diablo + X Drive | Gen2-4D | 4D | Assembly | Diablo, X:D |
| 18 | Mass Distribution + Dual Bearing Architecture (Phantom Orion B:D) | Gen2-4D | 4D | Assembly | Phantom, B:D, bearing |
| 19 | Active I Modulation (Jade), Track Disc Geometry (S130), Spherical Contact (RB) | Gen2-MFB | HWS | Assembly | Jade, S130, RB |
| 20 | Wing Alignment Geometry: Impact Frequency vs Magnitude (Blitz) | Gen2-4D | 4D | Wheel | Blitz |
| 21 | Three-Component Composite Wheel: Viscoelastic Damping (Fusion) | Gen2-4D | 4D | Wheel | Fusion, damping |
| 22 | Fixed Inner-Outer Stack: SWD | Gen2-MFB | MFS | Bottom | SWD, sharp-wide-defense |
| 23 | Track Height as Physics Variable: Nemesis 4D Bottom (170/195) | Gen2-4D | 4D | Track | 170, 195, height |
| 24 | Energy Ring as Contact-Point Override: Gravity Destroyer (Counter/Defense) | Gen2-HWS | HWS | ClearWheel | Gravity, Destroyer, mode-change |
| 25 | Energy Ring Coverage Spectrum: Destroyer Attack/Defense/Stamina | Gen2-HWS | HWS | ClearWheel | Destroyer, coverage |
| 26 | Spin Track as Active Contact Surface: R145 | Gen2-MFB | MFS | Track | R145, rubber, wing-scrape |
| 27 | Plastic Spherical Tips: Ball vs Wide Ball | Gen2-MFB | MFS | Bottom | B, WB, radius-movement |
| 28 | Circular Max-Weight Wheel + Static Imbalance: Twisted | Gen2-HWS | HWS | Wheel | Twisted, imbalance |
| 29 | Jade Fusion Wheel: Dual-Element Ball Channel (Steel + Rubber) | Gen2-4D | 4D | Wheel | Jade, rubber, steel |
| 30 | Rubber ER as Spin-Steal Interface: L-Drago II | Gen2-HWS | HWS | ClearWheel | L-Drago II, spin-steal, rubber |
| 31 | L-Drago ER Variants: Rubber as Entire Mechanism (Rush + Assault) | Gen2-HWS | HWS | ClearWheel | L-Drago, Rush, Assault |
| 32 | Fusion Wheel + ER Composite Contact System: Meteo | Gen2-HWS | HWS | Wheel | Meteo, composite |
| 33 | Wide Flat Tips: XF Contact, Flower Pattern, Tornado Stalling | Gen2-MFB | MFS | Bottom | XF, flower-pattern |
| 34 | Metal Flat (MF): Metal Friction Paradox and Tornado Stalling | Gen2-MFB | MFS | Bottom | MF, metal-friction |
| 35 | Claw 145 (C145): Centrifugal Wing Extension | Gen2-MFB | MFS | Track | C145, centrifugal |
| 36 | Spike (S): Minimum Friction, Maximum Instability | Gen2-MFB | MFS | Bottom | S, spike, instability |
| 37 | Wing 105 (W105): Aerodynamic Fin Track | Gen2-MFB | MFS | Track | W105, aerodynamic |
| 38 | R²F (Right Rubber Flat): Directional Star Contact + Wear | Gen2-MFB | MFS | Bottom | R2F, rubber, wear |
| 39 | L-Drago Destructor: Rubber Core in 4D Metal Wheel | Gen2-4D | 4D | Wheel | L-Drago Destructor, spin-steal |
| 40 | L-Drago Guardian: Armor-Flat Metal Frame + Full Rubber Core | Gen2-4D | 4D | Wheel | L-Drago Guardian, defense |
| 41 | Metal Ball (MB): Metal Sphere on Metal Base — Double Metal Friction | Gen2-MFB | MFS | Bottom | MB, metal-friction |
| 42 | Metal Face / Face Bolt: CoM Elevation | Gen2-MFB | MFS | Chip | metal-face, CoM |
| 43 | Bit Chip and Face Bolt: Structural Integrity as Match-End Trigger | Cross-Gen | — | Chip | face-bolt, burst |
| 44 | Fang 4D Metal Wheel: Alternating Protrusion + Hollow-Face Mode | Gen2-4D | 4D | Wheel | Fang, mode-change |
| 45 | Aero Core & Aero Wing (HMS): Small-Diameter + Helicopter Vortex | Gen1-HMS | HMS | RC | Aero, vortex |
| 46 | CWD Chain Attacker: Free-Spinning WD + Self-Damage Paradox | Gen1-HMS | HMS | CWD | Chain Attacker, free-spin |
| 47 | Rubber Weight Core (HMS): Combined WD+RC, Force Smash | Gen1-HMS | HMS | RC | RWC, force-smash |
| 48 | Advance Defenser (HMS): Metal Roller Contact Points | Gen1-HMS | HMS | AR | Advance Defenser, rollers |
| 49 | Upper Fox AR + CWD Circle Attacker + Bunshin Core | Gen1-HMS | HMS | Assembly | Upper Fox, Bunshin, splitting |
| 50 | Circle Upper (HMS AR): Near-Circular Metal Frame | Gen1-HMS | HMS | AR | Circle Upper, upper-attack |
| 51 | Spring Core (HMS RC): Spring-Actuated Launch Bounce | Gen1-HMS | HMS | RC | Spring Core, spring, bounce |
| 52 | Metal Spike (MS): Hertzian Contact Stress, Stadium Denting | Gen1-HMS | HMS | RC | Metal Spike, Hertzian, ban |
| 53 | Hades FW + BD145: Gap-Filling + Floor Scraping | Gen2-4D | 4D | Wheel | Hades, BD145, floor-scrape |
| 54 | Defense Spike (DS): Convex Ring Always-Glancing + Compound Tip | Gen2-MFB | MFS | Bottom | DS, defense |
| 55 | L-Drago I + Lightning: Plastic Mode Selector + No-Rubber | Gen2-MFB | MFS | Wheel | Lightning, L-Drago I, mode |
| 56 | HFS (Hard Metal System): Between-Battle Mode Change | Gen1-HMS | HMS | System | HFS, mode-change |
| 57 | H145 (Horn 145): Hyper-Extended Contact Point Radius | Gen2-MFB | MFS | Track | H145 |
| 58 | GB145 (Gyro Ball 145): Ball Migration at Track Height | Gen2-MFB | MFS | Track | GB145, gyro-ball |
| 59 | D125 (Defense 125): Aerodynamic Ring as I-Modifier | Gen2-MFB | MFS | Track | D125 |
| 60 | Coating Spike (CS): Binary Tilt-Threshold Tip Regime Switch | Gen2-MFB | MFS | Bottom | CS, coating, tilt-threshold |
| 61 | Flash Fusion Wheel: Oval I Anisotropy, 2-Node vs 4-Node Weight | Gen2-4D | 4D | Wheel | Flash, anisotropy |
| 62 | 230 Track: Extreme h/r Ratio, Height Denial | Gen2-MFB | MFS | Track | 230, height-denial |
| 63 | Wide Defense (WD): Wide Disc Compound Tip, Balance Recovery | Gen2-MFB | MFS | Bottom | WD, balance-recovery |
| 64 | Triple Roller 145 (TR145): Life After Death via Rolling | Gen2-MFB | MFS | Track | TR145, LAD |
| 65 | Wave Wide Defense (W²D): CS-Analog Flat+Spike Compound | Gen2-MFB | MFS | Bottom | W2D, compound-tip |
| 66 | Rubber Defense Flat (RDF): Three-Regime Tip | Gen2-MFB | MFS | Bottom | RDF, rubber, three-regime |
| 67 | Duo Fusion Wheel: Deliberate Static Imbalance as Attack | Gen2-4D | 4D | Wheel | Duo, imbalance |
| 74 | Spring Core RC (HMS): Tall CoM as Precession-Rate Advantage | Gen1-HMS | HMS | RC | Spring Core, precession |
| 68 | Hole Flat (HF): Annular Contact Reduces Pivot Friction | Gen2-MFB | MFS | Bottom | HF, annular-contact |
| 69 | Wing Attack 130 (WA130): Free-Spinning Wing Scrape | Gen2-MFB | MFS | Track | WA130, free-spin |
| 70 | Under Frame (U): Downward-Angled Protrusions | Gen3-Burst | Burst-Std | Frame | Under, burst-attack |
| 71 | Atomic: Wide Free-Rotating Ball + LAD Ring | Gen3-Burst | Burst-God | Bottom | Atomic, LAD |
| 72 | Ignition' (Disc-Integrated Driver): Impact-Activated Motor | Gen3-Burst | Burst-GT | Bottom | Ignition', motor |
| 73 | Loop (Lp): Spin-Velocity-Dependent Roller Behaviour | Gen3-Burst | Burst-Std | Bottom | Loop, roller |

---

## Part 2 — Cases 74–123

> HMS parts → Gen 1 Plastic (Spin Gear era) parts

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 74 | Nexus (Nx): Eight-Blade Two-Tier Disc | Gen3-Burst | Burst-DB | Disc | Nexus, attack |
| 75 | D Gear: Spring-Loaded Sliding Gear as Recoil Deflector | Gen3-Burst | Burst-DB | Gear | D Gear, recoil |
| 76 | Metal Attacker AR: Low AR Mass Kills Follow-Through | Gen1-HMS | HMS | AR | Metal Attacker |
| 77 | Grip Flat Core (HMS RC): Rubber Tip Grip | Gen1-HMS | HMS | RC | Grip Flat, rubber, attack |
| 78 | Metal Spiker AR: Spike Geometry + Identical Under-Mass | Gen1-HMS | HMS | AR | Metal Spiker |
| 79 | Circle Wide WD (HMS): Spoke-and-Rim Max I per Gram | Gen1-HMS | HMS | CWD | Circle Wide, inertia |
| 80 | Grip Flat Core (Ultimate Mode): Softer Rubber Compound | Gen1-HMS | HMS | RC | Grip Flat, ultimate, rubber |
| 81 | Metal Spring AR: All-Metal Perimeter, Zero Plastic Contact | Gen1-HMS | HMS | AR | Metal Spring |
| 82 | Circle Heavy WD (HMS): Solid-Ring Mass-vs-Inertia Trade-off | Gen1-HMS | HMS | CWD | Circle Heavy |
| 83 | Wolf Crusher AR: Symmetric Recoil + High-Mass Stamina | Gen1-HMS | HMS | AR | Wolf Crusher, stamina |
| 84 | Bearing Core RC (HMS): Ball-Bearing Near-Zero Friction | Gen1-HMS | HMS | RC | Bearing Core, bearing, LAD |
| 85 | Advance Balancer AR: Serrated Metal Rim, Spin-Steal | Gen1-HMS | HMS | AR | Advance Balancer, spin-steal |
| 86 | Circle Balance WD (HMS): Thick Radial Bridge | Gen1-HMS | HMS | CWD | Circle Balance |
| 87 | Metal Semi-Flat Core (MSF) RC: Wider Metal Tip | Gen1-HMS | HMS | RC | MSF, metal-tip |
| 88 | Seagon Attacker AR: Curved Hook Upper Attack | Gen1-HMS | HMS | AR | Seagon Attacker, upper |
| 89 | Upper Fox AR: Shared-Frame Mid-Tier Upper Attack | Gen1-HMS | HMS | AR | Upper Fox |
| 90 | Smash Leopard AR: Shared Metal Frame, CWD Interaction | Gen1-HMS | HMS | AR | Smash Leopard |
| 91 | CWD Needle Attacker: Free-Spinning Protrusions, Near-Zero Impulse | Gen1-HMS | HMS | CWD | Needle Attacker, free-spin |
| 92 | CWD Mold Variation: Hidden 2g Mass Difference | Gen1-HMS | HMS | CWD | mold-variation |
| 93 | Tornado Change Core (TCC) RC: Centrifugal Mode-Change | Gen1-HMS | HMS | RC | TCC, mode-change |
| 94 | Turtle Crusher AR: Gap-Catch Hidden Impulse Amplifier | Gen1-HMS | HMS | AR | Turtle Crusher, gap-catch |
| 95 | Aero Core & Aero Wing RC: Propeller Cannot Fly | Gen1-HMS | HMS | RC | Aero, propeller |
| 96 | Rubber Weight Core (RWC): Combined WD+RC, Height Penalty | Gen1-HMS | HMS | RC | RWC, rubber |
| 97 | Samurai Upper AR: Spin-Direction Attack Bifurcation | Gen1-HMS | HMS | AR | Samurai Upper |
| 98 | Battle Change Core (BCC) RC: Impact-Cam Mode Change | Gen1-HMS | HMS | RC | BCC, mode-change |
| 99 | Jumping Base (Plastics BB): Spring-Launched Vertical Impulse | Gen1-Plastic | SGS | BB | Jumping Base, spring |
| 100 | Left Spin Gear Shells (Regular): Mass Budget, Neo Incompatibility | Gen1-Plastic | SGS | SG | LSG shells, left-spin |
| 101 | Metal Change Base (Driger S BB): Small-Point Metal Tip | Gen1-Plastic | SGS | BB | Metal Change, Driger S |
| 102 | Tiger Defenser AR (Driger S): Slope-Mediated Recoil Suppression | Gen1-Plastic | SGS | AR | Tiger Defenser |
| 103 | Reverse Dragon AR: Outward Contact Angle, Left-Spin | Gen1-Plastic | SGS | AR | Reverse Dragon, left-spin |
| 104 | Eight Wide WD: Octagonal Low-Mass Wide Distribution | Gen1-Plastic | SGS | WD | Eight Wide |
| 105 | Storm Grip Base: Hertzian Small-Dome + Inverted-Tip Speed | Gen1-Plastic | SGS | BB | Storm Grip, attack |
| 106a | Dragon Head AR: Sub-Minimum Mass, WD Coverage | Gen1-Plastic | SGS | AR | Dragon Head |
| 107a | Wide WD: Rounded-Profile Tangential Impulse Loss | Gen1-Plastic | SGS | WD | Wide |
| 108a | Grip Base: Rubber Traction, Tornado Stall | Gen1-Plastic | SGS | BB | Grip Base, rubber |
| 109a | SG Semi-Flat Base: Shallow-Dome Contact | Gen1-Plastic | SGS | BB | SG Semi-Flat |
| 110a | Jumping Base (Trygle): Ski-Contact Critical Tilt | Gen1-Plastic | SGS | BB | Jumping Base, Trygle |
| 111a | Triple Wing AR: Near-Tangential Contact, Spin-Symmetric | Gen1-Plastic | SGS | AR | Triple Wing, dual-spin |
| 106b | Neo Right Spin Gear Shells: Neo Core Cavity | Gen1-Plastic | MGS | SG | Neo RSG, shells |
| 107b | Metal Weight Core (MWC): Central Zinc Insert | Gen1-Plastic | MGS | Core | MWC, zinc |
| 108b | Normal Core: All-Plastic Hollow Neo Core | Gen1-Plastic | MGS | Core | Normal Core |
| 109b | Regular SG Core Part: Lightest Structural Core | Gen1-Plastic | SGS | Core | Regular Core |
| 111b | Right SG Shells + Metal Weight Gear: Anti-Rattle | Gen1-Plastic | SGS | SG | RSG, metal-weight-gear |
| 112a | SG (Spring Version) Core: Height-Driven Instability | Gen1-Plastic | SGS | Core | Spring SG, Jumping Base |
| 113a | Defense Grip Base: Dual-Mode Rubber Tip | Gen1-Plastic | SGS | BB | Defense Grip, rubber |
| 110b | SG Wing Base: Sub-AR Slot, Scraping | Gen1-Plastic | SGS | BB | SG Wing Base |
| 111c | SG Sharp Base: Tall-Body Precession | Gen1-Plastic | SGS | BB | SG Sharp |
| 114 | Screw Zeus SAR: Rectangular Mass, Speed-Threshold Smash | Gen1-Plastic | SGS | SAR | Screw Zeus |
| 112b | Flying Defense AR (Takara, 6.2g): Aerodynamic Gimmick Catastrophe | Gen1-Plastic | 4LS | AR | Flying Defense |
| 112c | AR War Lion: Two-Wing Oval, Low Recoil | Gen1-Plastic | SGS | AR | War Lion |
| 113b | Sub AR War Lion: Near-Circular Neutral Filler | Gen1-Plastic | SGS | SAR | War Lion SAR |
| 115a | Flying Defense AR (Hasbro): Circular Rim Zero-Smash | Gen1-Plastic | 4LS | AR | Flying Defense, Hasbro |
| 113c | Jumping Base 2 (Cyber Dragoon BB): Dish Grind | Gen1-Plastic | SGS | BB | Jumping Base 2 |
| 116a | Square Edge AR: Multi-Point Jagged Smash | Gen1-Plastic | SGS | AR | Square Edge |
| 114a | Ten Heavy WD (16.1g / 17.0g): Heaviest Legal WD | Gen1-Plastic | SGS | WD | Ten Heavy |
| 117a | SG Full Auto Clutch Shaft: Bearing-Decoupled Metal Flat | Gen1-Plastic | SGS | SG | Full Auto Clutch, bearing |
| 115b | Flame Wing AR (Dranzer F): Spin-Direction Wing Fragility | Gen1-Plastic | SGS | AR | Flame Wing, Dranzer F |
| 118a | Full Auto Clutch Base: Spring-Loaded Centrifugal Clutch | Gen1-Plastic | SGS | BB | Full Auto Clutch |
| 116b | SG (Triple Change Version) Core: Three-Tip Friction Indexer | Gen1-Plastic | SGS | Core | Triple Change |
| 117b | Flame Change Base (Dranzer F BB): TCVersion Shell | Gen1-Plastic | SGS | BB | Flame Change, Dranzer F |
| 119a | SG Auto Change Base: Impact-Triggered Tip Retraction | Gen1-Plastic | SGS | BB | SG Auto Change |
| 120a | Double Snake AR: Steep Contact Angle Recoil | Gen1-Plastic | SGS | AR | Double Snake |
| 118b | Metal Balls (1/4" and 3/16" Steel): Rolling Contact Ballast | Gen1-Plastic | SGS | Core | metal-balls |
| 121a | Eight Balance WD: Octagonal Polygon Mass | Gen1-Plastic | SGS | WD | Eight Balance |
| 122a | SG (Auto Change Version) Core: Height-Reduced | Gen1-Plastic | SGS | Core | AC Core |
| 123a | Upper Wolf AR: Steeper Slope, Three-Fold Recoil | Gen1-Plastic | SGS | AR | Upper Wolf |

---

## Part 3 — Cases 118–187

> Gen 1 Plastic: SG bases, ARs, WDs, EG parts, CEW tips

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 118 | SG Metal Sharp Base: Near-Zero Contact Radius | Gen1-Plastic | SGS | BB | SG Metal Sharp, instability |
| 116 | Whale Crusher AR: Width as WD Overhang Substitute | Gen1-Plastic | SGS | AR | Whale Crusher, upper |
| 117 | SG Flat Base: Plastic Flat Tip Height Advantage | Gen1-Plastic | SGS | BB | SG Flat |
| 119 | Panther Head AR: Directional Blade Asymmetry | Gen1-Plastic | SGS | AR | Panther Head, left-spin |
| 120 | SG Core: North Magnecore | Gen1-Plastic | MGS | Core | North Magnecore, magnetic |
| 121 | SG Core: South Magnecore | Gen1-Plastic | MGS | Core | South Magnecore, magnetic |
| 122 | SG Metal Flat Base (Gaia Dragoon V): Low-Friction Metal Flat | Gen1-Plastic | SGS | BB | SG Metal Flat, Gaia Dragoon V |
| 123 | Dragon Breaker Core AR: Heaviest Core AR, SAR-Conditional | Gen1-Plastic | SGS | AR | Dragon Breaker |
| 124 | Dragon Breaker Sub AR: Large-Radius Free-Spinning Ring | Gen1-Plastic | SGS | SAR | Dragon Breaker SAR |
| 125 | Volcano Change Base: Magnetic Tip Retention | Gen1-Plastic | MGS | BB | Volcano Change, magnetic |
| 126 | Tryhorn (Land Attack AR / 8 Heavy / Right SG / SG Semi-Flat) | Gen1-Plastic | SGS | Assembly | Tryhorn, V-tread |
| 127 | Cross Griffon AR: Four-Wing 90° Symmetry | Gen1-Plastic | SGS | AR | Cross Griffon |
| 128 | Dual Dragon AR: Polycarbonate Sub-Frame | Gen1-Plastic | SGS | AR | Dual Dragon |
| 129 | Fantom Grip Base: Narrow Hard-Rubber Tip | Gen1-Plastic | SGS | BB | Fantom Grip, rubber |
| 130 | Eight Attacker: Flat Contacts, Uncontrolled Recoil | Gen1-Plastic | 4LS | AR | Eight Attacker |
| 131 | Magne Flat Base: Removable-Tip SG, Magnetic Shaft | Gen1-Plastic | MGS | BB | Magne Flat, magnetic |
| 132 | Magne Flat Base Tip: Plastic Flat + South Magnet | Gen1-Plastic | MGS | Bottom | Magne Flat tip, magnetic |
| 133 | SG Grip Base Tip: Lighter Rubber Tip | Gen1-Plastic | SGS | Bottom | SG Grip tip, rubber |
| 134 | Sonic Tiger: Separated Three-Segment Wing | Gen1-Plastic | SGS | AR | Sonic Tiger, recoil |
| 135 | SG Metal Flat Base: Truncated Cone Tip | Gen1-Plastic | SGS | BB | SG Metal Flat |
| 136 | Griffolyon Base (Hasbro): Four Pole Bases | Gen1-Plastic | SGS | BB | Griffolyon, Hasbro, poles |
| 137 | Cybernetic Dragon: Maximum-Area Flat Contact Faces | Gen1-Plastic | SGS | AR | Cybernetic Dragon |
| 138 | Spike Dragon: Vertical-Line Flat Faces | Gen1-Plastic | SGS | AR | Spike Dragon |
| 139 | Magne Weight Disk: Even Mass + Magnetic Gimmick | Gen1-Plastic | MGS | WD | Magne WD, magnetic |
| 140 | Reverse Attack SP: Moderate Fin Angle, Least Recoil | Gen1-Plastic | SGS | SP | Reverse Attack |
| 141 | Customize Grip Base: SP-Compatible Wide Rim LAD | Gen1-Plastic | SGS | BB | CGB, LAD |
| 142 | Customize Grip Base Tip: Wide Hard-Rubber + Magnet | Gen1-Plastic | SGS | Bottom | CGB tip, rubber, magnetic |
| 143 | Upper Claw: Multi-Mode Contact | Gen1-Plastic | SGS | AR | Upper Claw, upper, smash |
| 144 | Ten Balance Weight Disk: Compact Edge-Focus | Gen1-Plastic | SGS | WD | Ten Balance |
| 145 | Upper Attack Support Parts: Slope Extension | Gen1-Plastic | SGS | SP | Upper Attack SP |
| 146 | Customize Metal Change Base: Phase-Switching Tip | Gen1-Plastic | SGS | BB | CMC Base, mode-change |
| 147 | Customize Metal Sharp Base: Fixed Tip + Plastic Collar | Gen1-Plastic | SGS | BB | CMS Base, stamina |
| 148 | Mountain Hammer AR: High-Mass Smash | Gen1-Plastic | SGS | AR | Mountain Hammer |
| 149 | Defense Ring SP: Widest LAD Onset | Gen1-Plastic | SGS | SP | Defense Ring, LAD |
| 150 | Customize Clutch Change Base: Centrifugal Clutch Inverts Mode | Gen1-Plastic | SGS | BB | Clutch Change, mode-change |
| 151 | Cross Dranzer AR: Four-Fold Spin-Neutral | Gen1-Plastic | SGS | AR | Cross Dranzer |
| 152 | Cross Survivor SP: Wide Defensive Buffer, 4-Tab | Gen1-Plastic | SGS | SP | Cross Survivor |
| 153 | Triple Attacker AR: Three Distinct Attack Vectors | Gen1-Plastic | SGS | AR | Triple Attacker |
| 154 | Ten Wide WD: Wide Outer Radius, Reduced Rim | Gen1-Plastic | SGS | WD | Ten Wide |
| 155 | Double Bearing Core: Two-Stage Coupling Attenuation | Gen1-Plastic | SGS | Core | Double Bearing |
| 156 | Neo SG (Double Bearing) Shaft: Three-Point Decoupling | Gen1-Plastic | MGS | SG | Double Bearing, shaft |
| 157 | Cross Attack SP: Radially Oriented Protrusions, Max Recoil | Gen1-Plastic | SGS | SP | Cross Attack |
| 158 | Customize Bearing Base: Smooth-Shell, Three Shaft Regimes | Gen1-Plastic | SGS | BB | Bearing Base, stamina |
| 159 | Strike Turtle: Rounded Segment Penalty | Gen1-Plastic | SGS | AR | Strike Turtle |
| 160 | SG Bolt Base: Screw Ballast Failure | Gen1-Plastic | SGS | BB | SG Bolt |
| 161 | Double Attacker: Maximum Flat-Face Smash | Gen1-Plastic | SGS | AR | Double Attacker |
| 162 | Revolver Attack: Compact Distribution, Tab Recoil | Gen1-Plastic | SGS | AR | Revolver Attack |
| 163 | Twin Guard: Thin-Profile Bidirectionality | Gen1-Plastic | SGS | AR | Twin Guard |
| 164 | Corona Saber: Large-Reach Upper Attack | Gen1-Plastic | SGS | AR | Corona Saber, upper |
| 165 | Triple Beak: Bevelled Triangle Omni-Smash | Gen1-Plastic | SGS | AR | Triple Beak |
| 166 | Reverse Wolf (Hasbro): Inverted Contact, Left-Spin Compact | Gen1-Plastic | SGS | AR | Reverse Wolf, Hasbro, left-spin |
| 167 | Wide Defense: Extreme Peripheral Concentration, Most Versatile WD | Gen1-Plastic | SGS | WD | Wide Defense |
| 168 | Wide Survivor: Maximum Outer Radius, Stamina | Gen1-Plastic | SGS | WD | Wide Survivor, stamina |
| 169 | Spark Disk: Wide Survivor + Friction/Spark Gimmick | Gen1-Plastic | SGS | WD | Spark Disk |
| 170 | Star Attack: 5-Fold Recoil, Penta Wing Alignment | Gen1-Plastic | SGS | AR | Star Attack |
| 171 | Wide Attack: Intermediate Distribution Fails Both Roles | Gen1-Plastic | SGS | WD | Wide Attack |
| 172 | Penta Wing: Left-Spin Long-Slope Upper Attack | Gen1-Plastic | SGS | AR | Penta Wing, upper, left-spin |
| 173 | Smash Turtle AR: Force Smash Slope | Gen1-Plastic | SGS | AR | Smash Turtle, force-smash |
| 174 | Upper Dragoon AR: Slope Geometry RS/LS Differences | Gen1-Plastic | SGS | AR | Upper Dragoon, spin-steal |
| 175 | SG Roller Base: Free-Spinning Rollers Increase Recoil | Gen1-Plastic | SGS | BB | SG Roller |
| 176 | Lizard Blocker AR: Four Outer Rollers Fail Defense | Gen1-Plastic | SGS | AR | Lizard Blocker, rollers |
| 177 | Roller Defense Ring: Recessed Bearings, Contact Normal Softener | Gen1-Plastic | SGS | SP | Roller Defense Ring |
| 178 | Twin Horn AR: Rounded Leading Edges Maximise Left-Spin Steal | Gen1-Plastic | SGS | AR | Twin Horn, spin-steal, left-spin |
| 179 | Fin Tector SP: Fin-Shaped Attack SP Net-Negative | Gen1-Plastic | SGS | SP | Fin Tector |
| 180 | Switch Metal Ball Base: Wide-Radius Ball Tip Fails All Roles | Gen1-Plastic | SGS | BB | Switch Metal Ball |
| 181 | Wing AR: Spring-Wing Centrifugal Deployment, Spin-Steal | Gen1-Plastic | SGS | AR | Wing, spring, spin-steal |
| 182 | Spark AR: Friction-Coupled Free-Spin Fails Both Roles | Gen1-Plastic | SGS | AR | Spark, free-spin |
| 183 | Cross Spiker AR: Triangular Protrusion Interference | Gen1-Plastic | SGS | AR | Cross Spiker |
| 184 | Fire Cracker AR: Oval Geometry + Rounded Sides | Gen1-Plastic | SGS | AR | Fire Cracker |
| 185 | SG Core: Heavy Metal Core — Maximum Neo Core Mass | Gen1-Plastic | MGS | Core | Heavy Metal Core |
| 186 | Heavy Metal Gear SG Shells: Tip Height as Limiter | Gen1-Plastic | SGS | SG | Heavy Metal Gear |
| 187 | First Clutch Base (Metal Driger): First Clutch Disrupts | Gen1-Plastic | EGS | BB | First Clutch, Metal Driger |

---

## Part 4 — Cases 189–237

> Gen 1 Plastic: Engine Gear era parts, CEW tips, anime-only entries

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 189 | Eight Spiker AR: Eight-Contact Symmetry | Gen1-Plastic | SGS | AR | Eight Spiker, LS-benchmark |
| 190 | Left Engine Gear (Metal Semi-Flat) | Gen1-Plastic | EGS | EG | Left EG MSF, left-spin |
| 191 | First Clutch Base (Driger G Version) | Gen1-Plastic | EGS | BB | First Clutch, Driger G |
| 192 | Triple Tiger AR | Gen1-Plastic | EGS | AR | Triple Tiger |
| 193 | Right Engine Gear (Metal Semi-Flat) | Gen1-Plastic | EGS | EG | Right EG MSF |
| 194 | Auto Change Base | Gen1-Plastic | SGS | BB | Auto Change |
| 195 | CEW Circle Defenser | Gen1-Plastic | EGS | CEW | Circle Defenser |
| 196 | Double Horn AR | Gen1-Plastic | SGS | AR | Double Horn |
| 197 | Right Engine Gear (Circle Defenser / Mystery Cutter) | Gen1-Plastic | EGS | EG | Right EG, Circle Defenser |
| 198 | Normal Base (Rock Bison Version) | Gen1-Plastic | EGS | BB | Normal Base, Rock Bison |
| 199 | Normal Base (Wolborg 4 Version) | Gen1-Plastic | EGS | BB | Normal Base, Wolborg 4 |
| 200 | Right Engine Gear (Circle Survivor) | Gen1-Plastic | EGS | EG | Right EG, Circle Survivor |
| 201 | CEW Circle Survivor | Gen1-Plastic | EGS | CEW | Circle Survivor |
| 202 | Star Wolf AR | Gen1-Plastic | EGS | AR | Star Wolf |
| 203 | Final Clutch Base (Dranzer G Version) | Gen1-Plastic | EGS | BB | Final Clutch, Dranzer G |
| 204 | Wing Survivor AR | Gen1-Plastic | EGS | AR | Wing Survivor |
| 205 | Shield Hammer AR | Gen1-Plastic | EGS | AR | Shield Hammer |
| 206 | Right Engine Gear (Metal Ball) | Gen1-Plastic | EGS | EG | Right EG, Metal Ball |
| 207 | CEW Metal Ball | Gen1-Plastic | EGS | CEW | Metal Ball |
| 208 | Left Customize Engine Gear | Gen1-Plastic | EGS | EG | Left CEG |
| 209 | Right Customize Gear (Full Auto Clutch Version) | Gen1-Plastic | EGS | EG | Right CG FAC |
| 210 | SG (MG Spring Version) | Gen1-Plastic | SGS | SG | MG Spring, jumping |
| 211 | Final Clutch Base (Draciel G Version) | Gen1-Plastic | EGS | BB | Final Clutch, Draciel G |
| 212 | Dragon Saucer Core AR | Gen1-Plastic | SGS | AR | Dragon Saucer |
| 213 | Dragon Saucer Sub AR: Free-Spinning Gear Ring | Gen1-Plastic | SGS | SAR | Dragon Saucer SAR |
| 214 | Survivor Ring SP: Highest I-Per-Gram SP | Gen1-Plastic | SGS | SP | Survivor Ring |
| 215 | Right Engine Gear (Metal Flat): V8 Combo Enabler | Gen1-Plastic | EGS | EG | Right EG MF, V8 |
| 216 | Final Clutch Base (Gaia Dragoon G Version) | Gen1-Plastic | EGS | BB | Final Clutch, Gaia Dragoon G |
| 217 | Wing Upper AR | Gen1-Plastic | EGS | AR | Wing Upper |
| 218 | Gyro Engine Gear | Gen1-Plastic | EGS | EG | Gyro EG |
| 219 | Engine Stopper Base | Gen1-Plastic | EGS | BB | Engine Stopper |
| 220 | CEW Metal Sharp | Gen1-Plastic | EGS | CEW | Metal Sharp |
| 221 | G Upper AR | Gen1-Plastic | EGS | AR | G Upper |
| 222 | Left Engine Gear (Turbo) | Gen1-Plastic | EGS | EG | Left EG Turbo |
| 223 | First Clutch Base (Dragoon GT Version) | Gen1-Plastic | EGS | BB | First Clutch, Dragoon GT |
| 224 | CEW Metal Semi-Flat | Gen1-Plastic | EGS | CEW | Metal Semi-Flat |
| 225 | Triangle Wing AR | Gen1-Plastic | EGS | AR | Triangle Wing, upper |
| 226a | Right Engine Gear (Reverse) | Gen1-Plastic | EGS | EG | Right EG Reverse |
| 226b | CEW Metal Grip | Gen1-Plastic | EGS | CEW | Metal Grip |
| 227 | Final Clutch Base (Dranzer GT Version) | Gen1-Plastic | EGS | BB | Final Clutch, Dranzer GT |
| 228 | CEW Metal Change | Gen1-Plastic | EGS | CEW | Metal Change |
| 229 | Gigantic Claw AR | Gen1-Plastic | EGS | AR | Gigantic Claw |
| 230 | Final Clutch Base (Gigars Version): Worst-Case FCB | Gen1-Plastic | EGS | BB | Final Clutch, Gigars |
| 231 | CEW Light Sharp: Only Competitive CEW | Gen1-Plastic | EGS | CEW | Light Sharp, POM |
| 232 | Core AR: Holy Despell | Gen1-Plastic | SGS | AR | Holy Despell |
| 233 | Sub AR: Screw Zeus | Gen1-Plastic | SGS | SAR | Screw Zeus |
| 234 | Right Customize Gear (Free Shaft Version) | Gen1-Plastic | EGS | EG | Right CG Free Shaft |
| 235 | Right Customize Gear (Free Shaft Version) Shaft | Gen1-Plastic | EGS | EG | CG Free Shaft, shaft |
| 236 | First Clutch Base (Zeus Version) | Gen1-Plastic | EGS | BB | First Clutch, Zeus |
| 237 | Andre's Yak (Anime-Only): Pagoda-Inspired Dome AR | Gen1-Plastic | — | Assembly | anime-only, Yak |

---

## Part 5 — Cases 236–296

> System architectures (all gens) → MFB-era wheels, tracks, bottoms

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 236 | 4 Layer System (4LS) | Gen1-Plastic | 4LS | System | architecture, original-series |
| 237 | Spin Gear System (SGS) | Gen1-Plastic | SGS | System | architecture, fifth-layer |
| 238 | Magnacore System (Neo Spin Gear) | Gen1-Plastic | MGS | System | architecture, magnetic |
| 239 | Hard Metal System (HMS) | Gen1-HMS | HMS | System | architecture, scale-reduction |
| 240 | Metal System (MFS) | Gen2-MFB | MFS | System | architecture, metal-wheel |
| 241 | Engine Gear System (EGS) | Gen1-Plastic | EGS | System | architecture, spring, clutch |
| 242 | Hybrid Wheel System (HWS) | Gen2-MFB | HWS | System | architecture, energy-ring |
| 243 | 4D System | Gen2-4D | 4D | System | architecture, mode-change |
| 244 | Burst System (Base Structure) | Gen3-Burst | Burst-Std | System | architecture, burst-mechanism |
| 245 | Burst Subsystems (Takara Tomy) | Gen3-Burst | Burst-Std | System | architecture, all-burst |
| 246 | CobaltDrake 4-60F | Gen4-BX | BX-Basic | Assembly | CobaltDrake, BX |
| 247 | DranBuster 1-60A (Unique Line) | Gen4-BX | BX-Unique | Assembly | DranBuster, UX |
| 248 | DranBrave S6-60V (Custom Line) | Gen4-BX | BX-Custom | Assembly | DranBrave, CX |
| 249 | Track 85 | Gen4-BX | BX-Basic | Ratchet | 85, min-height |
| 250 | Track 90 | Gen4-BX | BX-Basic | Ratchet | 90 |
| 251 | Track 100 | Gen4-BX | BX-Basic | Ratchet | 100 |
| 252 | Track 105 | Gen4-BX | BX-Basic | Ratchet | 105 |
| 253 | AD145 (Armor Defense 145) | Gen2-MFB | MFS | Track | AD145, stamina |
| 254 | DF145 (Down Force 145) | Gen2-MFB | MFS | Track | DF145, downforce |
| 255 | SW145 (Switch 145) | Gen2-MFB | MFS | Track | SW145, switch |
| 256 | WD145 (Wide Defense 145) | Gen2-MFB | MFS | Track | WD145, wing-trap |
| 257 | E230 (Elevator 230) | Gen2-MFB | MFS | Track | E230, Zero-G |
| 258 | SP230 (Spike 230) | Gen2-MFB | MFS | Track | SP230 |
| 259 | F230 (Free 230) | Gen2-MFB | MFS | Track | F230, free-spin |
| 260 | TB (Twin Ball) | Gen2-MFB | MFS | Bottom | TB, twin-ball |
| 261 | Storm Metal Wheel | Gen2-MFB | MFS | Wheel | Storm |
| 262 | Rock Metal Wheel | Gen2-MFB | MFS | Wheel | Rock |
| 263 | Lightning Metal Wheel (L-Drago) | Gen2-MFB | MFS | Wheel | Lightning, L-Drago |
| 264 | Flame Metal Wheel | Gen2-MFB | MFS | Wheel | Flame |
| 265 | Burn Metal Wheel | Gen2-MFB | MFS | Wheel | Burn |
| 266 | Earth Metal Wheel | Gen2-MFB | MFS | Wheel | Earth |
| 267 | L Drago Metal Wheel | Gen2-MFB | MFS | Wheel | L-Drago |
| 268 | Leone Metal Wheel | Gen2-MFB | MFS | Wheel | Leone |
| 269 | Libra Metal Wheel | Gen2-MFB | MFS | Wheel | Libra, three-molds |
| 270 | Pegasis Metal Wheel | Gen2-MFB | MFS | Wheel | Pegasis |
| 271 | Pisces Metal Wheel | Gen2-MFB | MFS | Wheel | Pisces |
| 272 | Sagittario Metal Wheel | Gen2-MFB | MFS | Wheel | Sagittario |
| 273 | Virgo Metal Wheel | Gen2-MFB | MFS | Wheel | Virgo |
| 274 | Leone Clear Wheel | Gen2-MFB | MFS | ClearWheel | Leone |
| 275 | Nemesis 4D Clear Wheel | Gen2-4D | 4D | ClearWheel | Nemesis |
| 276 | VariAres 4D Metal Wheel: Centrifugal PC Frame Retraction | Gen2-4D | 4D | Wheel | VariAres, mode-change |
| 277 | D:D (Delta Drive) Bottom: Three-Tip Manual Mode Selector | Gen2-4D | 4D | Bottom | D:D, mode-change |
| 278 | Horogium Clear Wheel: Clock-Motif Asymmetry | Gen2-4D | 4D | ClearWheel | Horogium |
| 279 | Basalt Metal Wheel: Maximum-Weight Annular Defense | Gen2-HWS | HWS | Wheel | Basalt, defense |
| 280 | 145 Track: Height-Limited Tilt Angle | Gen2-MFB | MFS | Track | 145, standard |
| 281 | WD (Wide Defense) Bottom: Annular Contact + Precession | Gen2-MFB | MFS | Bottom | WD, annular |
| 282 | Aquila Clear Wheel: Two-Fold Wing Symmetry | Gen2-MFB | MFS | ClearWheel | Aquila |
| 283 | Earth Metal Wheel: Minimal-Gap Near-Circular Defense | Gen2-MFB | MFS | Wheel | Earth, defense |
| 284 | Unicorno II 4D Clear Wheel: Iron-Powder Augmentation | Gen2-4D | 4D | ClearWheel | Unicorno II |
| 285 | Blitz 4D Metal Wheel: Two-Piece Composite | Gen2-4D | 4D | Wheel | Blitz, composite |
| 286 | 100 Track: Attack-Bracket Height | Gen2-MFB | MFS | Track | 100 |
| 287 | RSF (Rubber Semi-Flat) Bottom: Rubber Friction + L-Spin Torque | Gen2-MFB | MFS | Bottom | RSF, rubber |
| 288 | Vulcan Metal Wheel: Two-Mold Mass Redistribution | Gen2-MFB | MFS | Wheel | Vulcan |
| 289 | Flame Metal Wheel: Crown-Profile Track Exposure | Gen2-MFB | MFS | Wheel | Flame, stamina |
| 290 | Pegasis II Clear Wheel | Gen2-HWS | HWS | ClearWheel | Pegasis II |
| 291 | Galaxy Metal Wheel | Gen2-HWS | HWS | Wheel | Galaxy |
| 292 | Wing 105 Track / W105 | Gen2-MFB | MFS | Track | W105 |
| 293 | R²F Bottom / Right Rubber Flat | Gen2-MFB | MFS | Bottom | R2F, rubber |
| 294 | Ketos Clear Wheel | Gen2-MFB | MFS | ClearWheel | Ketos |
| 295 | Grand Metal Wheel | Gen2-HWS | HWS | Wheel | Grand |
| 296 | Rubber Sharp / RS | Gen2-MFB | MFS | Bottom | RS, rubber |

---

## Part 6 — Cases 297–353

> MFB bottoms, tracks, 4D wheels/bottoms, Chrome Wheels (Zero-G/Synchrome)

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 297 | Rubber Flat / RF | Gen2-MFB | MFS | Bottom | RF, rubber |
| 298 | Move 145 / M145 | Gen2-MFB | MFS | Track | M145, mobile |
| 299 | Quake / Q (second mold) | Gen2-MFB | MFS | Bottom | Q, quake |
| 300 | Death 4D Metal Wheel | Gen2-4D | 4D | Wheel | Death |
| 301 | Rubber Defense Flat / RDF | Gen2-MFB | MFS | Bottom | RDF, rubber |
| 302 | Eternal Wide Defense / EWD | Gen2-MFB | MFS | Bottom | EWD, bearing |
| 303 | Upper Wing 145 / UW145 | Gen2-MFB | MFS | Track | UW145, upper |
| 304 | Fusion 4D Metal Wheel | Gen2-4D | 4D | Wheel | Fusion |
| 305 | Kerbecs Clear Wheel | Gen2-4D | 4D | ClearWheel | Kerbecs |
| 306 | Hell Metal Wheel | Gen2-MFB | MFS | Wheel | Hell |
| 307 | Boost Disk 145 / BD145 | Gen2-MFB | MFS | Track | BD145 |
| 308 | Lightning Metal Wheel (30.0g) | Gen2-MFB | MFS | Wheel | Lightning |
| 309 | Flash 4D Metal Wheel | Gen2-4D | 4D | Wheel | Flash |
| 310 | Chrome Wheel: Phoenic | Gen2-ZeroG | ZeroG | Wheel | Phoenic |
| 311 | Chrome Wheel: Gargole | Gen2-ZeroG | ZeroG | Wheel | Gargole |
| 312 | Track: Switch Attack 165 / SA165 | Gen2-ZeroG | ZeroG | Track | SA165, switch |
| 313 | Chrome Wheel: Genbull | Gen2-ZeroG | ZeroG | Wheel | Genbull |
| 314 | Track: Stamina Ring 200 / SR200 | Gen2-ZeroG | ZeroG | Track | SR200, stamina |
| 315 | Track: Left Wing 105 / LW105 | Gen2-MFB | MFS | Track | LW105, left-spin |
| 316 | Chrome Wheel: Dragooon | Gen2-ZeroG | ZeroG | Wheel | Dragooon |
| 317 | Chrome Wheel: Bahamdia | Gen2-ZeroG | ZeroG | Wheel | Bahamdia |
| 318 | Bottom: Giga Flat / GF | Gen2-MFB | MFS | Bottom | GF, giga-flat |
| 319 | Chrome Wheel: Revizer | Gen2-ZeroG | ZeroG | Wheel | Revizer |
| 320 | Crystal Wheel: Guardian | Gen2-ZeroG | ZeroG | ClearWheel | Guardian |
| 321 | Chrome Wheel: Killerken | Gen2-ZeroG | ZeroG | Wheel | Killerken |
| 322 | Track: Armor 230 / A230 | Gen2-ZeroG | ZeroG | Track | A230 |
| 323 | Chrome Wheel: Pegasis | Gen2-ZeroG | ZeroG | Wheel | Pegasis |
| 324 | Chrome Wheel: Wyvang | Gen2-ZeroG | ZeroG | Wheel | Wyvang |
| 325 | Bottom: Ball / B | Gen2-MFB | MFS | Bottom | B, ball |
| 326 | Bottom: Wide Ball / WB | Gen2-MFB | MFS | Bottom | WB, wide-ball |
| 327 | Bottom: Metal Ball / MB | Gen2-MFB | MFS | Bottom | MB, metal |
| 328 | Bottom: Rubber Ball / RB | Gen2-MFB | MFS | Bottom | RB, rubber |
| 329 | Bottom: Sharp Ball / SB | Gen2-MFB | MFS | Bottom | SB |
| 330 | Bottom: Defense / D | Gen2-MFB | MFS | Bottom | D, defense |
| 331 | Bottom: Semi-Defense / SD | Gen2-MFB | MFS | Bottom | SD |
| 332 | Bottom: Wide Defense / WD | Gen2-MFB | MFS | Bottom | WD, wide-defense |
| 333 | Bottom: Sharp Wide Defense / SWD | Gen2-MFB | MFS | Bottom | SWD |
| 334 | Bottom: Wide Semi Flat / WSF | Gen2-MFB | MFS | Bottom | WSF |
| 335 | Bottom: Sharp / S | Gen2-MFB | MFS | Bottom | S, sharp |
| 336 | Bottom: Ball Sharp / BS | Gen2-MFB | MFS | Bottom | BS |
| 337 | Bottom: Eternal Sharp / ES | Gen2-MFB | MFS | Bottom | ES, bearing |
| 338 | Bottom: Metal Sharp / MS | Gen2-MFB | MFS | Bottom | MS, metal |
| 339 | Bottom: Flat / F | Gen2-MFB | MFS | Bottom | F, flat |
| 340 | Bottom: Wide Flat / WF | Gen2-MFB | MFS | Bottom | WF |
| 341 | Bottom: Extreme Flat / XF | Gen2-MFB | MFS | Bottom | XF, extreme |
| 342 | Bottom: Metal Flat / MF | Gen2-MFB | MFS | Bottom | MF, metal |
| 343 | 4D Metal Wheel: Big Bang | Gen2-4D | 4D | Wheel | Big Bang, mode-change |
| 344 | 4D Bottom: Final Drive / F:D | Gen2-4D | 4D | Bottom | F:D, mode-change |
| 345 | 4D Bottom: X:Drive / X:D | Gen2-4D | 4D | Bottom | X:D, mode-change |
| 346 | 4D Metal Wheel: Diablo | Gen2-4D | 4D | Wheel | Diablo |
| 347 | 4D Metal Wheel: L-Drago Destroy | Gen2-4D | 4D | Wheel | L-Drago Destroy, rubber |
| 348 | 4D Bottom: F:S Final:Survive | Gen2-4D | 4D | Bottom | F:S |
| 349 | 4D Clear Wheel: Orion | Gen2-4D | 4D | ClearWheel | Orion |
| 350 | 4D Metal Wheel: Phantom | Gen2-4D | 4D | Wheel | Phantom |
| 351 | 4D Bottom: B:D Bearing Drive | Gen2-4D | 4D | Bottom | B:D, bearing |
| 352 | Track: S130 Shield 130 | Gen2-MFB | MFS | Track | S130, shield |
| 353 | Bottom: CS Coat Sharp | Gen2-MFB | MFS | Bottom | CS, coat |

---

## Part 7 — Cases 354–374

> BX/UX/CX system architecture + All-gen system summary retrospectives

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 354 | Basic Line System (BX) | Gen4-BX | BX-Basic | System | architecture |
| 355 | Unique Line System (UX) | Gen4-BX | BX-Unique | System | architecture |
| 356 | Custom Line System (CX) | Gen4-BX | BX-Custom | System | architecture |
| 357 | Ratchet System Architecture (BX/UX/CX) | Gen4-BX | BX-Basic | System | ratchet, architecture |
| 358 | Bit System Architecture (BX/UX/CX) | Gen4-BX | BX-Basic | System | bit, architecture |
| 359 | 4 Layer System (4LS): Retrospective | Gen1-Plastic | 4LS | System | architecture, retrospective |
| 360 | Spin Gear System (SGS): Retrospective | Gen1-Plastic | SGS | System | architecture, retrospective |
| 361 | Magnacore System (MGS): Retrospective | Gen1-Plastic | MGS | System | architecture, retrospective |
| 362 | Engine Gear System (EGS): Retrospective | Gen1-Plastic | EGS | System | architecture, retrospective |
| 363 | Hard Metal System (HMS): Retrospective | Gen1-HMS | HMS | System | architecture, retrospective |
| 364 | Metal System (MFS): Retrospective | Gen2-MFB | MFS | System | architecture, retrospective |
| 365 | Hybrid Wheel System (HWS): Retrospective | Gen2-MFB | HWS | System | architecture, retrospective |
| 366 | 4D System: Retrospective | Gen2-4D | 4D | System | architecture, retrospective |
| 367 | Synchrome System (Zero-G): Retrospective | Gen2-ZeroG | ZeroG | System | architecture, retrospective |
| 368 | Burst System (Gen 3 Overview): Retrospective | Gen3-Burst | Burst-Std | System | architecture, retrospective |
| 369 | Dual Layer System (DLS) | Gen3-Burst | Burst-DL | System | architecture |
| 370 | God Layer System (GLS) | Gen3-Burst | Burst-God | System | architecture |
| 371 | Cho-Z Layer System (CZL) | Gen3-Burst | Burst-CZ | System | architecture |
| 372 | Gatinko Layer System (GT) | Gen3-Burst | Burst-GT | System | architecture |
| 373 | Superking Layer System (SK) | Gen3-Burst | Burst-SK | System | architecture |
| 374 | Dynamite Battle / Burst Ultimate (DB/BU) | Gen3-Burst | Burst-DB | System | architecture |

---

## Part 8 — Cases 375–415

> BX/UX/CX blades, ratchets, and bits

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 375 | Shark Edge (BX Blade): C₃ Dual-Face Attack | Gen4-BX | BX-Basic | Blade | Shark Edge, attack |
| 376 | Dran Dagger (BX Blade): C₆ Barrage Frequency | Gen4-BX | BX-Basic | Blade | Dran Dagger |
| 377 | Phoenix Wing (BX Blade): Weight-Class Inertia Dominance | Gen4-BX | BX-Basic | Blade | Phoenix Wing |
| 378 | Cobalt Drake (BX Blade): C₄ Blocky-Rectangle Contact | Gen4-BX | BX-Basic | Blade | Cobalt Drake |
| 379 | Dran Buster (UX Blade): C₂ Oval One-Shot | Gen4-BX | BX-Unique | Blade | Dran Buster, glass-cannon |
| 380 | Hells Hammer (UX Blade): C₃ Down-Smash | Gen4-BX | BX-Unique | Blade | Hells Hammer |
| 381 | Wizard Rod (UX Blade): C₅ Outward Weight Distribution | Gen4-BX | BX-Unique | Blade | Wizard Rod |
| 382 | Cobalt Dragoon (BX Blade): Left-Spin Counter-Rotation | Gen4-BX | BX-Basic | Blade | Cobalt Dragoon, left-spin |
| 383 | Aero Pegasus (UX Blade): C₃ Wide-Wing Smash-Upper | Gen4-BX | BX-Unique | Blade | Aero Pegasus |
| 384 | Silver Wolf (UX Blade): Free-Spin Ring Contact Decoupling | Gen4-BX | BX-Unique | Blade | Silver Wolf, free-spin |
| 385 | Impact Drake (UX Blade): Bi-Material C₄ Rubber Attack | Gen4-BX | BX-Unique | Blade | Impact Drake, rubber |
| 386 | M-85 (BX Ratchet): Metal-Ring Inertia Augmentation | Gen4-BX | BX-Basic | Ratchet | M-85, metal |
| 387 | 2-60 (BX Ratchet): Minimum-Tab Burst Catastrophe | Gen4-BX | BX-Basic | Ratchet | 2-60 |
| 388 | 4-50 (UX Ratchet): Minimum-Height Profile | Gen4-BX | BX-Unique | Ratchet | 4-50 |
| 389 | 4-55 (CX Ratchet): O-Type Snap Joint, Lightest | Gen4-BX | BX-Custom | Ratchet | 4-55 |
| 390 | 7-70 (UX Ratchet): Maximum-Tab Burst Suppression | Gen4-BX | BX-Unique | Ratchet | 7-70 |
| 391 | 7-80 (BX Ratchet): 7-Tab at Maximum Height | Gen4-BX | BX-Basic | Ratchet | 7-80 |
| 392 | 1-60 (UX Ratchet): Minimum-Tab Burst Floor | Gen4-BX | BX-Unique | Ratchet | 1-60 |
| 393 | 1-70 (Ratchet): Single-Tab at Tall Height | Gen4-BX | BX-Basic | Ratchet | 1-70 |
| 394 | 0-60 (Ratchet): Zero-Protrusion Free-Spin | Gen4-BX | BX-Basic | Ratchet | 0-60, free-spin |
| 395 | 9-70 (UX Ratchet): Maximum Rotating-Tab Count | Gen4-BX | BX-Unique | Ratchet | 9-70 |
| 396 | 7-60 (UX Ratchet): Asymmetric Superprotrusion | Gen4-BX | BX-Unique | Ratchet | 7-60, asymmetric |
| 397 | Kick / K (CX Bit): Flat-Tip XD Rail Engagement | Gen4-BX | BX-Custom | Bit | K, kick |
| 398 | Flat / F (BX Bit): Maximum XD Rail Grip | Gen4-BX | BX-Basic | Bit | F, flat |
| 399 | Taper / T (BX Bit): Semi-Flat Indent Tip | Gen4-BX | BX-Basic | Bit | T, taper |
| 400 | Ball / B (BX Bit): Hertzian Point Contact Min Friction | Gen4-BX | BX-Basic | Bit | B, ball |
| 401 | Needle Bit (N) | Gen4-BX | BX-Basic | Bit | N, needle |
| 402 | Low Flat Bit (LF) | Gen4-BX | BX-Basic | Bit | LF, low-flat |
| 403 | Orb Bit (Orb) | Gen4-BX | BX-Basic | Bit | Orb |
| 404 | Point Bit (P) | Gen4-BX | BX-Basic | Bit | P, point |
| 405 | Rush Bit (R) | Gen4-BX | BX-Basic | Bit | R, rush |
| 406 | High Taper Bit (HT) | Gen4-BX | BX-Basic | Bit | HT, high-taper |
| 407 | Accel Bit (A) | Gen4-BX | BX-Basic | Bit | A, accel |
| 408 | Disc Ball Bit (DB) | Gen4-BX | BX-Basic | Bit | DB, disc-ball |
| 409 | Hexa Bit (H) | Gen4-BX | BX-Basic | Bit | H, hexa |
| 410 | Quake Bit (Q) | Gen4-BX | BX-Basic | Bit | Q, quake |
| 411 | Metal Needle Bit (MN) | Gen4-BX | BX-Basic | Bit | MN, metal |
| 412 | Cyclone Bit (C) | Gen4-BX | BX-Basic | Bit | C, cyclone |
| 413 | Elevate Bit (E) | Gen4-BX | BX-Basic | Bit | E, elevate |
| 414 | Free Ball Bit (FB) | Gen4-BX | BX-Basic | Bit | FB, free-ball |
| 415 | Level Bit (L) | Gen4-BX | BX-Basic | Bit | L, level |

---

## Part 9 — Cases 392–544

> Burst series: full lineage analysis across all subsystems (Xcalibur, Valkyrie, Achilles, Kerbeus, Diabolos, Deathscyther, Bahamut/Lucifer, L-Drago/Longinus, Ragnaruk, Belial, Wyvern)

**Note:** Cases 392–396 in this file are different parts from Cases 392–396 in Part 8 (BX ratchets). CS9's versions cover Burst-era parts. Cases within CS9 are grouped by Beyblade lineage, not strict numeric order.

### Xcalibur Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 392 | Winning Valkyrie Energy Layer (Burst Standard) | Gen3-Burst | Burst-Std | Layer | Winning Valkyrie |
| 393 | Xtreme Performance Tip (Xt, Burst) | Gen3-Burst | Burst-Std | Bottom | Xtreme, rubber |
| 397 | Sieg Xcalibur Energy Layer (Burst God Layer) | Gen3-Burst | Burst-God | Layer | Sieg Xcalibur, metal-insert |
| 398 | Forge Disc 1 (Burst God Layer, Asymmetric) | Gen3-Burst | Burst-God | Disc | Disc 1, asymmetric |
| 399 | Iron Performance Tip (Burst God Layer) | Gen3-Burst | Burst-God | Bottom | Iron, metal |
| 394 | Xeno Xcalibur Energy Layer (Burst Dual Layer) | Gen3-Burst | Burst-DL | Layer | Xeno Xcalibur |
| 395 | Magnum Forge Disc (Burst Dual Layer) | Gen3-Burst | Burst-DL | Disc | Magnum |
| 396 | Impact Performance Tip (Burst) | Gen3-Burst | Burst-DL | Bottom | Impact, rubber |
| 400 | Buster Xcalibur Energy Layer (Cho-Z) | Gen3-Burst | Burst-CZ | Layer | Buster Xcalibur, sword |
| 401 | Core Disc 1' (Cho-Z Dash) | Gen3-Burst | Burst-CZ | Disc | 1 Dash |
| 402 | Dagger Frame (Cho-Z) | Gen3-Burst | Burst-CZ | Frame | Dagger |
| 403 | Sword Performance Tip (Cho-Z) | Gen3-Burst | Burst-CZ | Bottom | Sword |
| 404 | DB Core Xcalibur (Burst Ultimate) | Gen3-Burst | Burst-BU | Chip | DB Core Xcalibur |
| 405 | Xiphoid BU Blade (Burst Ultimate) | Gen3-Burst | Burst-BU | Blade | Xiphoid |
| 406 | Armor 1 (Burst Ultimate) | Gen3-Burst | Burst-BU | Armor | Armor 1 |
| 407 | Xanthus Forge Disc (Burst Ultimate) | Gen3-Burst | Burst-BU | Disc | Xanthus |
| 408 | Sword' Dash Performance Tip (Burst Ultimate) | Gen3-Burst | Burst-BU | Bottom | Sword Dash |

### Valkyrie Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 409 | Victory Valkyrie Energy Layer (God Layer) | Gen3-Burst | Burst-God | Layer | Victory Valkyrie |
| 410 | Boost Forge Disc (God Layer) | Gen3-Burst | Burst-God | Disc | Boost |
| 411 | Variable Performance Tip (God Layer) | Gen3-Burst | Burst-God | Bottom | Variable, three-stage |
| 412 | God Valkyrie Energy Layer (God Layer) | Gen3-Burst | Burst-God | Layer | God Valkyrie |
| 413 | Strike God Valkyrie + Strike God Chip (God Layer) | Gen3-Burst | Burst-God | Layer | Strike God Valkyrie |
| 414 | Forge Disc 6 (God Layer) | Gen3-Burst | Burst-God | Disc | 6, hexagonal |
| 415 | Vortex Frame (God Layer) | Gen3-Burst | Burst-God | Frame | Vortex |
| 416 | Reboot Performance Tip (God Layer) | Gen3-Burst | Burst-God | Bottom | Reboot, centrifugal |
| 417 | Ultimate Reboot Performance Tip (God Layer) | Gen3-Burst | Burst-God | Bottom | Ultimate Reboot |
| 418 | Cho-Z Winning Valkyrie Layer (Cho-Z) | Gen3-Burst | Burst-CZ | Layer | CZ Winning Valkyrie, zinc |
| 419 | Forge Disc 12-Core (Cho-Z) | Gen3-Burst | Burst-CZ | Disc | 12-Core |
| 420 | Volcanic Performance Tip (Cho-Z) | Gen3-Burst | Burst-CZ | Bottom | Volcanic, rubber |
| 421 | Cho-Z Valkyrie Energy Layer (Cho-Z) | Gen3-Burst | Burst-CZ | Layer | CZ Valkyrie, zinc |
| 422 | Forge Disc Zenith (Cho-Z) | Gen3-Burst | Burst-CZ | Disc | Zenith |
| 423 | Evolution Performance Tip (Cho-Z) | Gen3-Burst | Burst-CZ | Bottom | Evolution |
| 424 | Level Chip (Cho-Z) | Gen3-Burst | Burst-CZ | Chip | Level Chip |
| 425 | Gatinko Chip Valkyrie (Gatinko) | Gen3-Burst | Burst-GT | Chip | GT Valkyrie |
| 426 | Layer Base Slash (Gatinko) | Gen3-Burst | Burst-GT | Layer | Slash |
| 427 | Layer Weight Retsu (Gatinko) | Gen3-Burst | Burst-GT | Layer | Retsu, aluminium |
| 428 | Forge Disc Blitz (Gatinko) | Gen3-Burst | Burst-GT | Disc | Blitz |
| 429 | Power Performance Tip (Gatinko) | Gen3-Burst | Burst-GT | Bottom | Power, rubber |
| 430 | DB Core Valkyrie (Dynamite Battle) | Gen3-Burst | Burst-DB | Chip | DB Core Valkyrie |
| 431 | Blade Savior (Dynamite Battle) | Gen3-Burst | Burst-DB | Blade | Savior, rubber |
| 432 | Armor 7 (Dynamite Battle) | Gen3-Burst | Burst-DB | Armor | Armor 7 |
| 433 | Performance Tip Shot (Dynamite Battle) | Gen3-Burst | Burst-DB | Bottom | Shot |
| 434 | SK Chip Valkyrie (Sparking) | Gen3-Burst | Burst-SK | Chip | SK Valkyrie |
| 435 | Ring Brave (Sparking) | Gen3-Burst | Burst-SK | Ring | Brave, attack |
| 436 | Chassis 2A (Sparking) | Gen3-Burst | Burst-SK | Chassis | 2A |
| 437 | Evolution' Performance Tip (Sparking/Dash) | Gen3-Burst | Burst-SK | Bottom | Evolution Dash |
| 438 | DB Core Valkyrie 2 (DB / BU) | Gen3-Burst | Burst-BU | Chip | DB Core Valkyrie 2 |
| 439 | BU Blade Ultimate (Burst Ultimate) | Gen3-Burst | Burst-BU | Blade | Ultimate, rubber |
| 440 | Armor 9 (DB / BU) | Gen3-Burst | Burst-BU | Armor | Armor 9 |
| 441 | Forge Disc Legacy (Burst Ultimate) | Gen3-Burst | Burst-BU | Disc | Legacy |
| 442 | Variable' Performance Tip (Burst Ultimate) | Gen3-Burst | Burst-BU | Bottom | Variable Dash |

### Achilles Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 443 | Z Achilles Energy Layer (Cho-Z) | Gen3-Burst | Burst-CZ | Layer | Z Achilles, zinc |
| 444 | Forge Disc 11 (Cho-Z) | Gen3-Burst | Burst-CZ | Disc | 11, asymmetric |
| 445 | Xtend Performance Tip (Cho-Z / God) | Gen3-Burst | Burst-CZ | Bottom | Xtend, dual-mode |
| 446 | Cho-Z Achilles Energy Layer (Cho-Z) | Gen3-Burst | Burst-CZ | Layer | CZ Achilles, awakening |
| 447 | Forge Disc 00 (Cho-Z) | Gen3-Burst | Burst-CZ | Disc | 00, heaviest |
| 448 | Dimension Performance Tip (Cho-Z / God) | Gen3-Burst | Burst-CZ | Bottom | Dimension, 6-config |
| 449 | SK Chip Achilles (Superking / Sparking) | Gen3-Burst | Burst-SK | Chip | SK Achilles |
| 450 | Ring Infinite (Superking / Sparking) | Gen3-Burst | Burst-SK | Ring | Infinite |
| 451 | Infinite Sword (Superking / Sparking) | Gen3-Burst | Burst-SK | Ring | Infinite Sword, attack |
| 452 | Chassis 1B (Superking / Sparking) | Gen3-Burst | Burst-SK | Chassis | 1B |
| 453 | Dimension' (Superking / Sparking) | Gen3-Burst | Burst-SK | Bottom | Dimension Dash |
| 454 | DB Core Achilles (BU) | Gen3-Burst | Burst-BU | Chip | DB Core Achilles |
| 455 | BU Blade Zest (BU) | Gen3-Burst | Burst-BU | Blade | Zest |
| 456 | Armor 4 (BU) | Gen3-Burst | Burst-BU | Armor | Armor 4 |
| 457 | Forge Disc Illegal (BU) | Gen3-Burst | Burst-BU | Disc | Illegal |
| 458 | Quattro' (BU) | Gen3-Burst | Burst-BU | Bottom | Quattro Dash |

### Kerbeus Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 459 | Guardian Kerbeus Energy Layer (God Layer) | Gen3-Burst | Burst-God | Layer | Guardian Kerbeus |
| 460 | Forge Disc Heavy (God Layer) | Gen3-Burst | Burst-God | Disc | Heavy |
| 461 | Revolve Performance Tip (God Layer) | Gen3-Burst | Burst-God | Bottom | Revolve |
| 462 | DB Core Kerbeus (DB/BU) | Gen3-Burst | Burst-DB | Chip | DB Core Kerbeus |
| 463 | BU Blade Chain (DB/BU) | Gen3-Burst | Burst-DB | Blade | Chain |
| 464 | Armor 6 (DB/BU) | Gen3-Burst | Burst-DB | Armor | Armor 6 |
| 465 | Forge Disc Fortress (DB/BU) | Gen3-Burst | Burst-DB | Disc | Fortress |
| 466 | Yard' (DB/BU) | Gen3-Burst | Burst-DB | Bottom | Yard Dash |

### Deathscyther Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 467 | SK Chip Deathscyther (Sparking) | Gen3-Burst | Burst-SK | Chip | SK Deathscyther |
| 468 | Ring Hollow (Sparking) | Gen3-Burst | Burst-SK | Ring | Hollow |
| 469 | Chassis 4A (Sparking) | Gen3-Burst | Burst-SK | Chassis | 4A |
| 470 | Forge Disc 12 (Sparking) | Gen3-Burst | Burst-SK | Disc | 12 |
| 471 | Disc Frame Axe (Sparking) | Gen3-Burst | Burst-SK | Frame | Axe |
| 472 | High Accel' Performance Tip (Sparking) | Gen3-Burst | Burst-SK | Bottom | High Accel Dash |
| 473 | Dark Deathscyther Energy Layer (SwitchStrike DL) | Gen3-Burst | Burst-DL | Layer | Dark Deathscyther |
| 474 | Forge Disc Force (SwitchStrike DL) | Gen3-Burst | Burst-DL | Disc | Force |
| 475 | Jaggy Performance Tip (SwitchStrike DL) | Gen3-Burst | Burst-DL | Bottom | Jaggy |

### Diabolos Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 481 | Gatinko Chip Diabolos (Gatinko) | Gen3-Burst | Burst-GT | Chip | Diabolos |
| 482 | Layer Base Erase (Gatinko) | Gen3-Burst | Burst-GT | Layer | Erase |
| 483 | Forge Disc Vanguard (Gatinko) | Gen3-Burst | Burst-GT | Disc | Vanguard |
| 484 | Bullet Performance Tip (Gatinko) | Gen3-Burst | Burst-GT | Bottom | Bullet |

### Salamander / Forneus Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 485 | Hell Salamander (Cho-Z) | Gen3-Burst | Burst-CZ | Layer | Hell Salamander |
| 486 | Emperor Forneus Energy Layer (Cho-Z) | Gen3-Burst | Burst-CZ | Layer | Emperor Forneus |
| 487 | Forge Disc 0 (Cho-Z) | Gen3-Burst | Burst-CZ | Disc | 0 |
| 488 | Yard Performance Tip (Cho-Z) | Gen3-Burst | Burst-CZ | Bottom | Yard |

### Bahamut / Lucifer Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 476 | DB Core Bahamut (DB / BU) | Gen3-Burst | Burst-DB | Chip | DB Core Bahamut |
| 477 | BU Blade Roar (DB / BU) | Gen3-Burst | Burst-DB | Blade | Roar |
| 478 | Armor 6 (DB / BU, Left-Spin Context) | Gen3-Burst | Burst-DB | Armor | Armor 6, left-spin |
| 479 | Forge Disc Karma (DB / BU) | Gen3-Burst | Burst-DB | Disc | Karma |
| 480 | Metal Drift Performance Tip (DB / BU) | Gen3-Burst | Burst-DB | Bottom | Metal Drift |
| 489 | DB Core Lucifer (DB / BU) | Gen3-Burst | Burst-DB | Chip | DB Core Lucifer |
| 490 | BU Blade Barricade (DB / BU) | Gen3-Burst | Burst-DB | Blade | Barricade |
| 491 | Armor 10 (DB / BU) | Gen3-Burst | Burst-DB | Armor | Armor 10 |
| 492 | Forge Disc Illegal (DB/BU Stamina Context) | Gen3-Burst | Burst-BU | Disc | Illegal, stamina |
| 493 | Bearing Mobius Performance Tip (DB / BU) | Gen3-Burst | Burst-DB | Bottom | Bearing Mobius |
| 494 | SK Chip Lucifer 2 (Sparking) | Gen3-Burst | Burst-SK | Chip | SK Lucifer 2 |
| 495 | Ring The End (Sparking) | Gen3-Burst | Burst-SK | Ring | The End |
| 496 | Forge Disc Kou (Sparking) | Gen3-Burst | Burst-SK | Disc | Kou |
| 497 | Drift Performance Tip (Sparking) | Gen3-Burst | Burst-SK | Bottom | Drift |

### Dragon / Imperial Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 498 | Gatinko Chip Dragon 2 (GT / Rise) | Gen3-Burst | Burst-GT | Chip | Dragon 2 |
| 499 | Layer Imperial (GT / Rise) | Gen3-Burst | Burst-GT | Layer | Imperial |
| 500 | Disc-Integrated Driver Ignition' (GT / Rise) | Gen3-Burst | Burst-GT | Bottom | Ignition Dash |
| 501 | SK Chip Dragon (Sparking) | Gen3-Burst | Burst-SK | Chip | SK Dragon |
| 502 | Ring Tempest (Sparking) | Gen3-Burst | Burst-SK | Ring | Tempest |
| 503 | Chassis 1A (Sparking) | Gen3-Burst | Burst-SK | Chassis | 1A |
| 504 | Charge Metal Performance Tip (Sparking) | Gen3-Burst | Burst-SK | Bottom | Charge Metal |
| 505 | DB Core Dragon (DB / BU) | Gen3-Burst | Burst-DB | Chip | DB Core Dragon |
| 506 | BU Blade Gatling (Burst Ultimate) | Gen3-Burst | Burst-BU | Blade | Gatling |
| 507 | Armor 10 (BU) [xref: Case 491] | Gen3-Burst | Burst-BU | Armor | Armor 10 |
| 508 | Forge Disc Karma (BU) [xref: Case 479] | Gen3-Burst | Burst-BU | Disc | Karma |
| 509 | Charge Metal' Performance Tip (Burst Ultimate) | Gen3-Burst | Burst-BU | Bottom | Charge Metal Dash |

### Ragnaruk Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 510 | SK Chip Ragnaruk (Sparking) | Gen3-Burst | Burst-SK | Chip | SK Ragnaruk |
| 511 | Ring Glide (Sparking) | Gen3-Burst | Burst-SK | Ring | Glide |
| 512 | Chassis 1S (Sparking) | Gen3-Burst | Burst-SK | Chassis | 1S |
| 513 | Forge Disc Wheel (Burst / Cho-Z / Sparking) | Gen3-Burst | Burst-SK | Disc | Wheel |
| 514 | Revolve Performance Tip (Burst / Sparking) | Gen3-Burst | Burst-SK | Bottom | Revolve |
| 515 | Crash Ragnaruk Energy Layer (Cho-Z) | Gen3-Burst | Burst-CZ | Layer | Crash Ragnaruk |
| 516 | Forge Disc 11 (Burst / SwitchStrike / Cho-Z) | Gen3-Burst | Burst-CZ | Disc | 11 |
| 517 | Disc Frame Reach (Burst / Cho-Z) | Gen3-Burst | Burst-CZ | Frame | Reach |
| 518 | Wedge Performance Tip (Cho-Z / Burst) | Gen3-Burst | Burst-CZ | Bottom | Wedge |
| 519 | DB Core Ragnaruk (DB / BU) | Gen3-Burst | Burst-DB | Chip | DB Core Ragnaruk |
| 520 | Blade Cyclone (DB / BU) | Gen3-Burst | Burst-DB | Blade | Cyclone |
| 521 | Armor 6 (DB / BU) [xref: Case 478] | Gen3-Burst | Burst-DB | Armor | Armor 6 |
| 522 | Forge Disc Giga (DB / BU) | Gen3-Burst | Burst-DB | Disc | Giga |
| 523 | Never Performance Tip (DB / BU) | Gen3-Burst | Burst-DB | Bottom | Never |

### Longinus Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 524 | SK Chip Longinus (Sparking) | Gen3-Burst | Burst-SK | Chip | SK Longinus |
| 525 | Ring Rage (Sparking) | Gen3-Burst | Burst-SK | Ring | Rage |
| 526 | Chassis 3A (Sparking) | Gen3-Burst | Burst-SK | Chassis | 3A |
| 527 | Destroy' Performance Tip (Sparking) | Gen3-Burst | Burst-SK | Bottom | Destroy Dash |

### Belial Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 528 | DB Core Belial (DB / BU) | Gen3-Burst | Burst-DB | Chip | DB Core Belial |
| 529 | Blade Dynamite + F Gear + L Gear (DB / BU) | Gen3-Burst | Burst-DB | Blade | Dynamite, gears |
| 530 | Armor 2 (DB / BU) | Gen3-Burst | Burst-DB | Armor | Armor 2 |
| 531 | Forge Disc Nexus + S Gear + D Gear (DB / BU) | Gen3-Burst | Burst-DB | Disc | Nexus, gears |
| 532 | Venture + V Gear + VS Gear (DB / BU) | Gen3-Burst | Burst-DB | Bottom | Venture, gears |
| 533 | Assembly: Dynamite Belial Nexus Venture-2 | Gen3-Burst | Burst-DB | Assembly | Belial, full-combo |
| 534 | DB Core Belial 2 (DB / BU) | Gen3-Burst | Burst-DB | Chip | DB Core Belial 2 |
| 535 | Blade Dangerous (DB / BU) | Gen3-Burst | Burst-DB | Blade | Dangerous |
| 536 | Almight + S/D/V Gear (DB / BU) | Gen3-Burst | Burst-DB | Bottom | Almight, gears |
| 537 | Assembly: Dangerous Belial Almight (Perfect Gear) | Gen3-Burst | Burst-DB | Assembly | Belial, perfect-gear |
| 538 | DB Core Belial 3 (DB / BU) | Gen3-Burst | Burst-BU | Chip | DB Core Belial 3 |
| 539 | BU Blade Divine + A Gear + H Gear (DB / BU) | Gen3-Burst | Burst-BU | Blade | Divine, gears |
| 540 | Forge Disc Nexus (Divine Belial context) | Gen3-Burst | Burst-BU | Disc | Nexus |
| 541 | Bearing Drift Performance Tip (DB / BU) | Gen3-Burst | Burst-BU | Bottom | Bearing Drift |
| 542 | Assembly: Divine Belial Nexus Bearing Drift | Gen3-Burst | Burst-BU | Assembly | Belial, Divine |

### Wyvern Lineage

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 543 | Tornado Wyvern 4Glaive Atomic (God Layer) | Gen3-Burst | Burst-God | Assembly | Tornado Wyvern, free-spin |
| 544 | Jet Wyvern Around Just 1D (Sparking) | Gen3-Burst | Burst-SK | Assembly | Jet Wyvern, rubber |

---

## Part 10 — Cases 545–585

> Arena mechanics, stadiums, launch physics (cross-generational)

### Stadium Analysis

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 545 | BeyStadium Attack Type (MFB): Five-Zone Bowl | Gen2-MFB | MFS | Arena | MFB stadium, bowl |
| 546 | Tornado Ridge (MFB vs Plastic) | Cross-Gen | — | Arena | tornado-ridge, engagement |
| 547 | Sliding Shoot Technique (MFB Attack Type) | Gen2-MFB | MFS | Mechanic | sliding-shoot, launch |
| 548 | BX-10 Xtreme Stadium | Gen4-BX | BX-Basic | Arena | Xtreme Stadium, square |
| 549 | BX Xtreme Line: Gear Rack Architecture | Gen4-BX | BX-Basic | Arena | Xtreme Line, X-Dash |
| 550 | Over Zone vs Xtreme Zone: Corner-Trap Physics | Gen4-BX | BX-Basic | Arena | zones, corner-trap |
| 551 | Gen 1–3 Tops in Xtreme Stadium | Cross-Gen | — | Arena | cross-gen, spin-decay |
| 552 | Wide Xtreme Stadium and Infinity Stadium | Gen4-BX | BX-Basic | Arena | wide, infinity, oval |
| 553 | Ultimate Beyta Stadium (4D MFB): Magnetic Spin Spot | Gen2-4D | 4D | Arena | magnetic, revival-mode |
| 554 | Gen 1 Magnacore System in Magne Stadia | Gen1-Plastic | MGS | Arena | magnetic, magne-stadia |
| 555 | Ferromagnetic Spring Coils in Magnetic Fields | Cross-Gen | — | Mechanic | spring, magnetic, EG |
| 556 | EG Energy Budget, Ignition' Motor, Shot Driver Spring | Cross-Gen | — | Mechanic | energy-budget, motor, spring |
| 557 | F:D Final Drive Mode-Switch + Magnetic Arena Effects | Gen2-4D | 4D | Mechanic | F:D, mode-switch, magnetic |
| 558 | Original Plastic BBA Stadium (White Stadium) | Gen1-Plastic | 4LS | Arena | BBA, white, square-bowl |
| 559 | Field of Doom (BBA V-Force, Baseball) | Gen1-Plastic | SGS | Arena | anime, baseball, asymmetric |
| 560 | Blizzard Bowl (BBA V-Force, Biovolt) | Gen1-Plastic | SGS | Arena | anime, ice, low-friction |
| 561 | R.P.M. Dish (BBA V-Force, Biovolt) | Gen1-Plastic | SGS | Arena | anime, rotating-disc |
| 562 | Black Sea Bowl (BBA V-Force, Biovolt) | Gen1-Plastic | SGS | Arena | anime, water, whirlpool |
| 563 | BBA V-Force Tower Arena (Biovolt Cylinder) | Gen1-Plastic | SGS | Arena | anime, hemisphere, tower |
| 564 | Roman Colosseum Arena (BBA G-Revolution) | Gen1-Plastic | SGS | Arena | anime, stepped-platform |
| 565 | Cityscape Bowl (BBA G-Revolution NYC) | Gen1-Plastic | SGS | Arena | anime, buildings, corridors |
| 566 | New Jersey Turnpike Dish (BBA G-Revolution) | Gen1-Plastic | SGS | Arena | anime, banked-highway, loop |
| 567 | Great Wall of China Bowl (BBA G-Revolution) | Gen1-Plastic | SGS | Arena | anime, stone-corridor |
| 568 | Tsunami Stadium (BBA G-Revolution) | Gen1-Plastic | SGS | Arena | anime, water, volcanic |
| 569 | White House Bowl (BBA G-Revolution) | Gen1-Plastic | SGS | Arena | anime, building, grass |
| 570 | Sand Pagoda Bowl (BBA G-Revolution S1) | Gen1-Plastic | SGS | Arena | anime, sand, terraced |
| 571 | Forbidden City Dish (BBA S1) | Gen1-Plastic | SGS | Arena | anime, ceremonial |
| 572 | Tree Stump Bowl (BBA S1) | Gen1-Plastic | SGS | Arena | anime, organic |
| 573 | Brick Courtyard Rain Bowl (BBA S1) | Gen1-Plastic | SGS | Arena | anime, rain, brick |
| 574 | Blizzard Bowl (BBA S1) | Gen1-Plastic | SGS | Arena | anime, ice, outdoor |
| 575 | Wok Arena (Improvised / BBA S1) | Gen1-Plastic | SGS | Arena | anime, improvised |
| 576 | Obstacle Dish / Seaside Dome (BBA S1) | Gen1-Plastic | SGS | Arena | anime, obstacles |
| 577 | Moon Base Trampoline Arena (BBA S1) | Gen1-Plastic | SGS | Arena | anime, low-gravity, trampoline |

### Launch and Game Mechanics

| # | Title | Gen | System | Type | Tags |
|---|-------|-----|--------|------|------|
| 578 | String Launcher Physics | Cross-Gen | — | Launcher | string, pull-velocity |
| 579 | Gear/Winder Launcher | Cross-Gen | — | Launcher | gear, winder |
| 580 | BX Xtreme Launcher | Gen4-BX | BX-Basic | Launcher | max-gear-ratio |
| 581 | Tilt Angle Physics | Cross-Gen | — | Mechanic | tilt, contact-height |
| 582 | Power Percentage: Spin Life Scaling | Cross-Gen | — | Mechanic | power, spin-life |
| 583 | Launch Position: Spawn Radius | Cross-Gen | — | Mechanic | position, orbit |
| 584 | Spin Steal × Launch × Bearing Interaction | Cross-Gen | — | Mechanic | spin-steal, bearing, launch |
| 585 | First-Hit Recoil Kinematics | Cross-Gen | — | Mechanic | recoil, COR, self-KO |

---

## Tag Indexes

### By Generation

| Generation | Cases | Count |
|-----------|-------|-------|
| **Fundamentals** | 1–13, 15 | 14 |
| **Gen1-Plastic (4LS)** | 112b, 115a, 130, 236, 558, 359 | ~6 |
| **Gen1-Plastic (SGS)** | 99–123, 126–187, 189, 194, 196, 210, 212–214, 232–233, 237, 360 | ~100+ |
| **Gen1-Plastic (MGS)** | 106b–108b, 120–121, 125, 131–132, 139, 142, 156, 185, 238, 361, 554 | ~15 |
| **Gen1-Plastic (EGS)** | 187, 190–193, 195, 197–209, 211, 215–231, 234–236, 241, 362 | ~50+ |
| **Gen1-HMS** | 45–52, 56, 74 (CS1), 76–98, 239, 363 | ~30 |
| **Gen2-MFB (MFS)** | 14, 22, 26–27, 33–38, 41–42, 54–55, 57–60, 62–66, 68–69, 240, 253–273, 280–283, 286–289, 292–302, 306–308, 315, 318, 325–342, 352–353, 364, 545–547 | ~80+ |
| **Gen2-MFB (HWS)** | 19, 24–25, 28, 30–32, 279, 290–291, 295, 365 | ~12 |
| **Gen2-4D** | 16–18, 20–21, 23, 29, 39–40, 44, 53, 61, 67, 243, 275–278, 284–285, 300, 304–305, 309, 343–351, 366, 553, 557 | ~35 |
| **Gen2-ZeroG** | 310–314, 316–317, 319–324, 367 | ~14 |
| **Gen3-Burst** | 70–73, 244–245, 368–374, 392–544 | ~170+ |
| **Gen4-BX** | 246–252, 354–358, 375–415, 548–552, 580 | ~60+ |
| **Cross-Gen** | 15, 43, 546, 551, 555–556, 578–579, 581–585 | ~12 |

### By Part Type

| Part Type | Cases (sample) |
|-----------|---------------|
| **Attack Ring** | 48, 50, 76, 78, 81, 83, 85, 88–90, 94, 97, 102–103, 106a, 111a, 116a, 127–128, 130, 134, 137–138, 143, 148, 151, 153, 159, 161–165, 170, 172–176, 178, 181–184, 189, 192, 196, 202, 204–205, 212, 217, 221, 225, 229, 232 |
| **Weight Disk** | 104, 107a, 114a, 121a, 139, 144, 154, 167–171 |
| **Blade Base** | 99, 101, 105, 108a, 109a, 110a–b, 111c, 113a, 113c, 117–119, 122, 125, 129, 131, 135–136, 141, 146–147, 150, 158, 160, 175, 180, 187, 191, 194, 198–199, 203, 211, 216, 219, 223, 227, 230, 236 |
| **Spin Gear** | 100, 111b, 156, 186, 210 |
| **SG Core** | 107b, 108b, 109b, 112a, 116b, 118b, 120–121, 122a, 155, 185 |
| **Support Parts** | 140, 145, 149, 152, 157, 177, 179, 214 |
| **Engine Gear** | 190, 193, 197, 200, 206, 208–209, 215, 218, 222, 226a, 234–235 |
| **CEW** | 195, 201, 207, 220, 224, 226b, 228, 231 |
| **HMS Running Core** | 45, 47, 51–52, 77, 80, 84, 87, 93, 95–96, 98 |
| **HMS CWD** | 46, 79, 82, 86, 91–92 |
| **Metal Wheel** | 261–273, 279, 283, 285, 288–289, 291, 295, 300, 304, 306, 308–311, 313, 316–317, 319, 321, 323–324, 343, 346–347, 350 |
| **Clear Wheel** | 24–25, 30–31, 274–275, 278, 282, 284, 290, 294, 305, 320, 349 |
| **Track** | 26, 35, 37, 57–59, 62, 64, 69, 253–259, 280, 286, 292, 298, 303, 307, 312, 314–315, 322, 352 |
| **Bottom/Tip** | 14, 22, 27, 33–34, 36, 38, 41, 54, 60, 63, 65–66, 68, 71–73, 260, 281, 287, 293, 296–297, 299, 301–302, 318, 325–342, 344–345, 348, 351, 353 |
| **BX/UX Blade** | 375–385 |
| **Ratchet** | 249–252, 386–396 |
| **Bit** | 397–415 |
| **Burst Layer** | 392, 394, 397, 400, 409, 412–413, 418, 421, 443, 446, 459, 473, 481–482, 485–486, 499, 515 |
| **Burst Disc** | 395, 398, 401, 410, 414, 419, 422, 428, 444, 447, 457, 460, 465, 470, 474, 483, 487, 492, 496, 508, 513, 516, 522, 531, 540–541 |
| **Burst Driver/Tip** | 393, 396, 399, 403, 408, 411, 416–417, 420, 423, 429, 433, 437, 442, 445, 448, 453, 458, 461, 466, 472, 475, 480, 484, 488, 493, 497, 500, 504, 509, 514, 518, 523, 527, 532, 536 |
| **Burst Chip** | 404, 424–425, 430, 434, 438, 449, 454, 462, 467, 476, 481, 489, 494, 498, 501, 505, 510, 519, 524, 528, 534, 538 |
| **Burst Blade (DB/BU)** | 405, 431, 439, 455, 463, 477, 490, 506, 520, 529, 535, 539 |
| **Burst Armor** | 406, 432, 440, 456, 464, 478, 491, 507, 521, 530 |
| **Burst Ring (SK)** | 435, 450–451, 468, 495, 502, 511, 525 |
| **Burst Chassis** | 436, 452, 469, 503, 512, 526 |
| **Burst Frame** | 70, 402, 415, 471, 517 |
| **Burst Gear** | 75, 529, 531–532, 536, 539 |
| **System Architecture** | 236–245, 354–374 |
| **Arena/Stadium** | 545–577 |
| **Launcher** | 578–580 |
| **Mechanic** | 1–13, 15, 547, 555–557, 581–585 |
| **Assembly** | 17–19, 49, 126, 237, 246–248, 533, 537, 542–544 |

---

## Quick Search by Beyblade Name

| Beyblade | Cases |
|----------|-------|
| **L-Drago** (all) | 30–31, 39–40, 55, 263, 267, 308, 347 |
| **Xcalibur** (Burst lineage) | 394–408 |
| **Valkyrie** (Burst lineage) | 392–393, 409–442 |
| **Achilles** (Burst lineage) | 443–458 |
| **Kerbeus** (Burst lineage) | 459–466 |
| **Deathscyther** (Burst lineage) | 467–475 |
| **Diabolos** (Burst lineage) | 481–484 |
| **Salamander / Forneus** | 485–488 |
| **Bahamut / Lucifer** | 476–480, 489–497 |
| **Dragon / Imperial** | 498–509 |
| **Ragnaruk** | 510–523 |
| **Longinus** | 524–527 |
| **Belial** | 528–542 |
| **Wyvern** | 543–544 |
| **Dragoon** (Gen 1) | 103, 123–124, 174, 212–213, 223 |
| **Dranzer** (Gen 1) | 115b, 117b, 151, 203, 227 |
| **Driger** (Gen 1) | 101–102, 187, 191 |
| **Draciel** (Gen 1) | 211 |
| **Wolborg** (Gen 1) | 199 |
| **Phantom Orion** | 18, 349–351 |
| **Galaxy Pegasis** | 291 |
| **Storm Pegasis** | 261, 270 |
| **Earth Eagle** | 266, 283 |
| **Shark Edge** (BX) | 375 |
| **Cobalt Drake** (BX) | 246, 378 |
| **Dran Buster** (UX) | 247, 379 |
| **Dran Brave** (CX) | 248 |

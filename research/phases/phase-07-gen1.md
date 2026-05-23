# Phase 07 — Gen1 Bey Systems Table

**Scope:** All Gen1 beyblade entries — Plastic era (SGS / Magnacore / Engine Gear) + HMS era.  
**Date built:** 2026-05-23  
**Source:** All files in `linka/beys/gen1/plastic/*.md` (90 files, keel-shark excluded as Gen4) and `linka/beys/gen1/hms/*.md` (29 files). Every row was derived from reading the source markdown directly — no hallucination.

---

## Gimmick Registry (valid IDs only)

| ID | Description |
|----|-------------|
| `engine_gear` | Spring-loaded EG stores launch torque, releases mid-battle |
| `rubber_grip` | Rubber tip anchors bey; high-friction floor contact |
| `spin_equalization` | Spin-steal / passive RPM drain from opponent on contact |
| `free_spin` | Part or assembly rotates independently; decouples impact |
| `bearing_drift` | Free-spinning bearing shaft; extreme LAD; tip/body independent |
| `contact_deflect` | Geometry deflects incoming hits sideways |
| `attack_amplifier` | Mechanism actively boosts hit force on contact |
| `stamina_recovery` | Mechanism actively recovers spin mid-battle |
| `orbit_movement` | Tip or mechanism induces orbital/circular stadium path |
| `mode_switch` | Pre-battle or mid-battle tip/mode selector |
| `heavy_wheel` | Unusually heavy rotating mass for inertia/momentum |
| `spring_recoil` | Spring-loaded one-shot launch or jump on impact |
| `velocity_burst` | Post-trigger speed surge (EG release, etc.) |
| `dual_spin` | Bey can be launched in either spin direction |
| `magnacore_repel` | North–North magnet repulsion between beys |
| `magnacore_attract` | North–South magnet attraction between beys |
| `weight_shift` | Internal mass shifts position during spin |

---

## systemId Values

| Era | systemId |
|-----|----------|
| Spin Gear System (S1 / V-Force plastic baseline) | `plastic_sgs` |
| Magnacore / NEO SG era (V-Force era NEO SG) | `plastic_magnacore` |
| Engine Gear System (G-Revolution era) | `plastic_neosg` |
| Hard Metal System (HMS, G-Revolution late) | `hms` |

---

## Column Reference

| Column | Notes |
|--------|-------|
| `Name` | English retail/anime name used throughout this project |
| `System` | systemId from table above |
| `gen` | Always `gen1` for this file |
| `Type` | Attack / Defense / Stamina / Balance / Endurance |
| `spin` | Right / Left / Dual |
| `atk` | 30–150; Attack stat |
| `def` | 30–150; Defense stat |
| `sta` | 30–150; Stamina stat |
| `radius_cm` | Estimated bey radius (plastic: 2.2–2.8 cm; HMS: 2.0–2.4 cm) |
| `gimmickIds` | Array; only valid registry IDs |
| `notes` | Key part facts + confidence tags |
| `Tier` | 1=protagonist/antagonist, 2=named rival/side, 3=generic/filler |
| `Conf` | A=confirmed product data, B=estimated reasonable basis, C=speculation |

**Stat allocation guidelines:**
- Attack type: atk 100–150, def 40–80, sta 80–150; total ≤ 360
- Defense type: atk 40–70, def 110–150, sta 100–130; total ≤ 360
- Stamina type: atk 30–60, def 60–100, sta 130–150; total ≤ 360
- Balance type: distribute evenly, total ≤ 360
- HMS beys: +5–15 atk over plastic equivalents

---

## Section 1 — Plastic SGS Era (`plastic_sgs`)

| Name | System | gen | Type | spin | atk | def | sta | radius_cm | gimmickIds | notes | Tier | Conf |
|------|--------|-----|------|------|-----|-----|-----|-----------|-----------|-------|------|------|
| Dragoon S | plastic_sgs | gen1 | Attack | Right | 140 | 50 | 80 | 2.5 | `["rubber_grip"]` | [FACT] AR=Dragon Breaker; WD=Eight Wide; BB=Storm Grip Base (rubber tip). Tyson S1. | 1 | A |
| Dragoon V | plastic_sgs | gen1 | Attack | Right | 135 | 55 | 85 | 2.5 | `["rubber_grip","velocity_burst"]` | [FACT] AR=Dragon Saucer; WD=Wide Attacker; BB=Voltaic Ape (volcano-spring). Tyson V-Force. | 1 | A |
| Dragoon V2 | plastic_sgs | gen1 | Attack | Right | 145 | 45 | 80 | 2.5 | `["rubber_grip","velocity_burst"]` | [FACT] AR=Upper Dragoon; WD=Wide Attacker; BB=Customize Grip. Tyson V-Force upgraded. | 1 | A |
| Dragoon G | plastic_neosg | gen1 | Attack | Right | 140 | 50 | 85 | 2.5 | `["engine_gear","velocity_burst"]` | [FACT] A-82; AR=Wing Dragoon; EG=Right EG; BB=Final Clutch (Dragoon G Version). Tyson G-Rev. | 1 | A |
| Dragoon GT | plastic_neosg | gen1 | Attack | Right | 150 | 45 | 75 | 2.5 | `["engine_gear","velocity_burst"]` | [FACT] A-107; AR=Hard Metal Dragoon; EG=Reverse EG (Hit Release). BEGA arc finale before MS. | 1 | A |
| Dranzer S | plastic_sgs | gen1 | Stamina | Right | 50 | 80 | 140 | 2.5 | `["mode_switch"]` | [FACT] AR=Cross Attacker; WD=Eight Wide; BB=Spiral Change Base (manual tip flip). Kai S1. | 1 | A |
| Dranzer F | plastic_sgs | gen1 | Stamina | Right | 55 | 80 | 135 | 2.5 | `["mode_switch"]` | [FACT] AR=Cross Attacker; WD=Eight Wide; BB=Flame Change Base. Kai S1 upgraded. | 1 | A |
| Dranzer V | plastic_sgs | gen1 | Stamina | Right | 55 | 85 | 130 | 2.5 | `["mode_switch"]` | [FACT] AR=Cross Attacker; WD=Eight Wide; BB=Volcano Change Base (magnet flip). Kai V-Force. | 1 | A |
| Dranzer V2 | plastic_sgs | gen1 | Stamina | Right | 60 | 80 | 130 | 2.5 | `["mode_switch"]` | [FACT] Customize Change Base. Kai V-Force upgraded. | 1 | A |
| Dranzer G | plastic_neosg | gen1 | Stamina | Right | 55 | 85 | 130 | 2.5 | `["engine_gear"]` | [FACT] A-83; EG version. Kai G-Rev. | 1 | A |
| Dranzer GT | plastic_neosg | gen1 | Stamina | Right | 60 | 85 | 125 | 2.5 | `["engine_gear","mode_switch"]` | [FACT] A-108; AR=Dranzer GT; EG=Reverse EG. Destroyed by Brooklyn. | 1 | A |
| Draciel MBD | plastic_sgs | gen1 | Defense | Right | 50 | 140 | 100 | 2.5 | `[]` | [FACT] A-4; AR=Tower Crusher; WD=Eight Heavy; BB=SG Metal Ball. Max S1 original. | 1 | A |
| Draciel S | plastic_sgs | gen1 | Defense | Right | 45 | 145 | 100 | 2.5 | `["contact_deflect"]` | [FACT] A-36 (Hasbro A-6); AR=Draciel S; WD=Eight Heavy; BB=SG Metal Ball Defense. Max S1. | 1 | A |
| Draciel F | plastic_sgs | gen1 | Defense | Right | 45 | 145 | 100 | 2.5 | `["contact_deflect"]` | [FACT] AR=Draciel F; WD=Eight Heavy; BB=Metal Ball Defense (F version). Max S2. | 1 | A |
| Draciel V | plastic_sgs | gen1 | Defense | Right | 50 | 140 | 100 | 2.5 | `["contact_deflect"]` | [FACT] AR=Draciel V; WD=Eight Heavy; BB=SG Metal Ball. Max V-Force. | 1 | A |
| Draciel V2 | plastic_sgs | gen1 | Defense | Right | 50 | 140 | 100 | 2.5 | `["contact_deflect"]` | [FACT] V2 Metal Ball Base. Max V-Force upgraded. | 1 | A |
| Draciel G | plastic_neosg | gen1 | Defense | Right | 50 | 135 | 105 | 2.5 | `["engine_gear","mode_switch"]` | [FACT] A-84; Final Clutch EG; Metal Ball EG. Max G-Rev. | 1 | A |
| Driger S | plastic_sgs | gen1 | Attack | Right | 130 | 55 | 90 | 2.5 | `["mode_switch"]` | [FACT] A-16; AR=Scissor Attacker; WD=Eight Wide; BB=SG Metal Change Base. Ray S1. | 1 | A |
| Driger F | plastic_sgs | gen1 | Attack | Right | 135 | 55 | 85 | 2.5 | `["mode_switch"]` | [FACT] AR=Triple Tiger; BB=SG Flat. Ray S1 upgraded. | 1 | A |
| Driger V | plastic_sgs | gen1 | Attack | Right | 130 | 55 | 90 | 2.5 | `["mode_switch"]` | [FACT] AR=Metal Claw; BB=Auto Change Base. Ray V-Force. | 1 | A |
| Driger V2 | plastic_sgs | gen1 | Attack | Right | 135 | 55 | 90 | 2.5 | `["mode_switch","free_spin"]` | [FACT] A-51; AR=Metal Claw V2; BB=Auto Change Survivor + semi-free bottom. Ray V-Force upgraded. | 1 | A |
| Driger G | plastic_neosg | gen1 | Attack | Right | 135 | 55 | 85 | 2.5 | `["engine_gear"]` | [FACT] A-85; EG clutch version. Ray G-Rev. | 1 | A |
| Wolborg | plastic_sgs | gen1 | Stamina | Right | 45 | 75 | 140 | 2.5 | `["bearing_drift","free_spin"]` | [FACT] A-40; AR=Samurai Gomul; WD=Eight Wide; BB=SG Bearing. Tala S1; first bearing tip. | 1 | A |
| Wolborg 2 | plastic_sgs | gen1 | Stamina | Right | 40 | 80 | 150 | 2.5 | `["bearing_drift","free_spin","rubber_grip"]` | [FACT] A-40; SG Bearing Version 2 (bearing + rubber tip combo). Defense Zombie archetype cornerstone. | 1 | A |
| Wolborg 4 | plastic_neosg | gen1 | Stamina | Right | 45 | 80 | 140 | 2.5 | `["engine_gear","bearing_drift"]` | [FACT] A-100; G-Rev EG version with Engine Gear bearing refinement. Tala G-Rev. | 1 | A |
| Galeon | plastic_sgs | gen1 | Stamina | Right | 45 | 80 | 140 | 2.4 | `["free_spin"]` | [FACT] A-34; AR=Eagle Defenser; WD=Eight Heavy; BB=SG Bearing. Robert Majestics. | 2 | A |
| Galeon 2 | plastic_sgs | gen1 | Stamina | Right | 45 | 80 | 140 | 2.4 | `["bearing_drift","free_spin"]` | [INFERRED] Robert Majestics V-Force variant. Bearing base upgrade. | 2 | B |
| Black Dranzer | plastic_sgs | gen1 | Attack | Right | 150 | 60 | 70 | 2.5 | `["attack_amplifier"]` | [FACT] A-20; AR=Dranzer S; WD=Eight Heavy; BB=SG Customize Grip. Voltaire/Kai S1; stolen. | 1 | A |
| Amphilyon | plastic_sgs | gen1 | Attack | Right | 130 | 60 | 80 | 2.4 | `[]` | [INFERRED] Dunga (Dark Bladers). Anime-exclusive. No confirmed gimmick. | 3 | C |
| Apollon | plastic_sgs | gen1 | Attack | Right | 125 | 60 | 85 | 2.4 | `[]` | [INFERRED] Anime-exclusive SGS bey. No gimmick documented. | 3 | C |
| Cyber Dragoon | plastic_sgs | gen1 | Attack | Right | 145 | 50 | 75 | 2.5 | `["attack_amplifier"]` | [INFERRED] Cyber bit beast; boosted attack profile. Generic antagonist. | 3 | C |
| Cyber Draciel | plastic_sgs | gen1 | Defense | Right | 55 | 140 | 95 | 2.5 | `["contact_deflect"]` | [INFERRED] Cyber defense profile. Generic antagonist. | 3 | C |
| Cyber Dranzer | plastic_sgs | gen1 | Stamina | Right | 45 | 75 | 140 | 2.5 | `[]` | [INFERRED] Cyber stamina profile. Generic antagonist. | 3 | C |
| Cyber Driger | plastic_sgs | gen1 | Attack | Right | 130 | 60 | 80 | 2.4 | `[]` | [INFERRED] Cyber attack profile. Generic antagonist. | 3 | C |
| Draculor | plastic_sgs | gen1 | Attack | Right | 130 | 55 | 85 | 2.4 | `[]` | [INFERRED] Anime-exclusive SGS. No gimmick. | 3 | C |
| Falborg S | plastic_sgs | gen1 | Defense | Right | 50 | 135 | 100 | 2.4 | `["bearing_drift","free_spin"]` | [INFERRED] Bearing-type Defense, Tala lineage variant. No confirmed product. | 3 | C |
| Falborg 2 | plastic_sgs | gen1 | Stamina | Right | 45 | 80 | 135 | 2.4 | `["bearing_drift","free_spin"]` | [INFERRED] S2 Falborg variant. Bearing continuation. | 3 | C |
| Flash Leopard | plastic_sgs | gen1 | Attack | Right | 130 | 55 | 85 | 2.4 | `[]` | [INFERRED] Flash series AR; anime-exclusive-adjacent. No gimmick confirmed. | 3 | B |
| Flash Leopard 2 | plastic_sgs | gen1 | Attack | Right | 135 | 55 | 80 | 2.4 | `[]` | [INFERRED] Flash series upgraded. | 3 | B |
| Gigars | plastic_neosg | gen1 | Attack | Right | 140 | 55 | 75 | 2.5 | `["engine_gear","mode_switch"]` | [FACT] Full Auto Clutch EG — unreliable auto-engage at low RPM. Non-competitive. | 3 | A |
| Griffolyon | plastic_sgs | gen1 | Balance | Right | 90 | 90 | 90 | 2.4 | `[]` | [INFERRED] Anime-exclusive Balance type. No gimmick. | 3 | C |
| Hopper | plastic_sgs | gen1 | Attack | Right | 125 | 50 | 90 | 2.3 | `["spring_recoil"]` | [INFERRED] Bounce-type Attack; spring mechanism. Anime-exclusive. | 3 | C |
| Hopper 2 | plastic_sgs | gen1 | Attack | Right | 130 | 50 | 90 | 2.3 | `["spring_recoil"]` | [INFERRED] Upgraded Hopper variant. | 3 | C |
| Lycanlor | plastic_sgs | gen1 | Attack | Right | 130 | 55 | 85 | 2.4 | `[]` | [INFERRED] Lupinex (Dark Bladers). Anime-exclusive. Wolf motif. No gimmick. | 3 | C |
| Master Draciel | plastic_sgs | gen1 | Defense | Right | 60 | 135 | 90 | 2.5 | `[]` | [INFERRED] Kenny; AR=Smash Turtle; WD=Eight Wide (13g); BB=SG Sharp. Smash+Stamina mix. | 3 | B |
| Master Dranzer | plastic_sgs | gen1 | Stamina | Right | 50 | 75 | 140 | 2.5 | `["mode_switch"]` | [INFERRED] Kenny/Ganta; BB=Metal Sting Base (removable steel pin). Mode-switch pin removal. | 3 | B |
| Matryoshka | plastic_sgs | gen1 | Balance | Right | 80 | 90 | 100 | 2.4 | `[]` | [SPECULATION] Alexander (Demo Boys). Anime-exclusive only. All parts unknown. | 3 | C |
| Metal Draciel | plastic_sgs | gen1 | Defense | Right | 50 | 140 | 100 | 2.5 | `["mode_switch"]` | [FACT] A-40; Jin of the Gale; BB=Metal Sting Base (removable pin mode switch). | 2 | A |
| Seaborg | plastic_sgs | gen1 | Defense | Right | 55 | 130 | 100 | 2.5 | `["rubber_grip","mode_switch"]` | [INFERRED] Spencer (Demo Boys); BB=Defense Grip Base (rubber sharp). Rubber defensive tip. | 2 | B |
| Seaborg 2 | plastic_sgs | gen1 | Balance | Right | 80 | 95 | 105 | 2.5 | `[]` | [FACT] A-40; Spencer (Demo Boys); BB=SG Flat. No gimmick. | 2 | A |
| Sarcophalon | plastic_sgs | gen1 | Stamina | Right | 40 | 75 | 140 | 2.4 | `[]` | [INFERRED] Cenotaph (Dark Bladers). Anime-exclusive. No gimmick. | 3 | B |
| Shamblor | plastic_sgs | gen1 | Attack | Right | 130 | 50 | 90 | 2.4 | `[]` | [INFERRED] Zomb (Dark Bladers). Anime-exclusive. No gimmick. | 3 | B |
| Salamalyon | plastic_sgs | gen1 | Stamina | Right | 50 | 80 | 135 | 2.4 | `[]` | [FACT] A-34; Johnny (Majestics). Non-standard BB; no gimmick. | 2 | A |
| Strata Dragoon | plastic_sgs | gen1 | Attack | Right | 135 | 55 | 85 | 2.5 | `["weight_shift"]` | [INFERRED] Daichi; CoroCoro limited; SG=Right SG G Ball Core (proprietary weight shift). | 1 | B |
| Torguitar | plastic_sgs | gen1 | Defense | Right | 55 | 130 | 90 | 2.4 | `["contact_deflect","heavy_wheel"]` | [INFERRED] Miguel (Renegades). Anime-exclusive. BB=Metal Ball Base + guitar-string AR deflection. | 3 | B |
| Trygle | plastic_sgs | gen1 | Attack | Right | 145 | 50 | 75 | 2.5 | `["spring_recoil"]` | [FACT] A-17; Michael (All Starz); AR=Triple Wing (S-tier, recoilFactor 0.08); BB=SG Jumping Base. | 2 | A |
| Trygle 2 | plastic_sgs | gen1 | Attack | Right | 130 | 55 | 85 | 2.5 | `[]` | [FACT] Random Booster 9; Michael (All Starz G-Rev); AR=Triple Beak (F-tier). No gimmick. | 2 | A |
| Tryhorn | plastic_sgs | gen1 | Attack | Right | 125 | 50 | 90 | 2.4 | `[]` | [SPECULATION] Steve (All Starz). Anime-only. No confirmed parts. No gimmick. | 3 | C |
| Trypio | plastic_sgs | gen1 | Defense | Right | 50 | 140 | 100 | 2.5 | `["contact_deflect"]` | [FACT] A-18; Eddy (All Starz); AR=Flying Defense (7g, 8.84cm wide, deflects hits). | 2 | A |
| Unicolyon | plastic_sgs | gen1 | Defense | Right | 50 | 135 | 95 | 2.4 | `[]` | [SPECULATION] Oliver (Majestics). Anime-exclusive. AR=Tail Defense; WD=Eight Heavy; BB=Unicolyon Base. No gimmick. | 2 | C |
| Wyborg | plastic_sgs | gen1 | Attack | Right | 130 | 55 | 85 | 2.5 | `[]` | [FACT] A-18; Ian Papov (Demo Boys); AR=Wyvern Wing (~5g, blunt smash C-tier); BB=Spike Base. No gimmick. | 2 | A |
| Galman | plastic_sgs | gen1 | Defense | Right | 50 | 140 | 100 | 2.5 | `[]` | [FACT] A-10; Kevin (White Tigers); AR=War Monkey (~6g, smooth deflection); WD=Eight Heavy; BB=SG Sharp. No gimmick. | 2 | A |
| Galux | plastic_sgs | gen1 | Balance | Right | 90 | 95 | 95 | 2.4 | `["heavy_wheel"]` | [SPECULATION] Mariah (White Tigers). Anime-exclusive; BB=Metal Ball Base. | 2 | C |
| Galzzly | plastic_sgs | gen1 | Attack | Right | 130 | 55 | 85 | 2.5 | `["free_spin"]` | [FACT] A-9; Gary (All Starz); AR=War Bear with free-spinning SAR (non-competitive in standard use). | 3 | A |
| Death Driger | plastic_sgs | gen1 | Attack | Right | 125 | 50 | 90 | 2.5 | `[]` | [FACT] A-36 (Shadow Driger TT / Death Driger Hasbro); AR=Star Shape (~3g, five-point star). No gimmick. | 3 | A |
| Canarias | plastic_sgs | gen1 | Stamina | Right | 50 | 70 | 140 | 2.5 | `["mode_switch"]` | [SPECULATION] Mario (Brazil). Anime-exclusive; BB=Full Auto Clutch Base (unreliable auto-engage). Mode switch maps to mode_switch. | 3 | C |
| Chameleon | plastic_sgs | gen1 | Balance | Right | 80 | 90 | 100 | 2.4 | `["contact_deflect"]` | [SPECULATION] Team Psykick anime-exclusive. All parts inferred. ChameleonMimicry → contact_deflect (closest match). | 3 | C |

---

## Section 2 — Plastic Magnacore Era (`plastic_magnacore`)

> [FACT] These beys use NEO Right SG with embedded Magnecore (North or South magnetic core), triggered when same/opposite poles collide. System enabler = Magne Weight Disk. Some V-Force era beys use NEO SG without true magnetic cores — still classified `plastic_magnacore` by era.

| Name | System | gen | Type | spin | atk | def | sta | radius_cm | gimmickIds | notes | Tier | Conf |
|------|--------|-----|------|------|-----|-----|-----|-----------|-----------|-------|------|------|
| Vortex Ape | plastic_magnacore | gen1 | Defense | Right | 55 | 140 | 100 | 2.5 | `["magnacore_repel","spin_equalization"]` | [FACT] A-77; Dunga (Saint Shields); AR=Mountain Hammer (7g, high recoil); WD=Magne Weight Disk (two-sided N/S); SP=Defense Ring (S-tier spin-steal+LAD). Best SGS-era LAD part. | 2 | A |
| Sharkrash | plastic_magnacore | gen1 | Balance | Right | 90 | 90 | 100 | 2.5 | `["magnacore_repel","orbit_movement"]` | [INFERRED] Mariam (Saint Shields). Magnetic repulsion + circular orbit movement. | 2 | B |
| Vanishing Moot | plastic_magnacore | gen1 | Stamina | Right | 50 | 70 | 140 | 2.5 | `["magnacore_repel"]` | [INFERRED] Joseph (Saint Shields). Anime-exclusive, destroyed mid-series. WD=Ten Balance; BB=SG Sharp Base. | 2 | B |
| Gabriel | plastic_magnacore | gen1 | Attack | Right | 125 | 55 | 90 | 2.5 | `["spin_equalization"]` | [FACT] Random Booster 7; no anime owner; AR=Twin Horn (5g, rounded symmetrical profile, S-tier Zombie AR); WD=Revolver Attacker (15g, 8-notch); SG=NEO Right SG Metal Weight. | 3 | A |
| Darillanzer | plastic_magnacore | gen1 | Balance | Right | 85 | 90 | 100 | 2.4 | `[]` | [SPECULATION] Daryl (Team Psykick). Anime-exclusive; AR=Psycho Balancer; BB=SG Semi-Flat (launch-angle behavior). No dedicated gimmick. | 3 | C |
| Figelanzer | plastic_magnacore | gen1 | Attack | Right | 130 | 55 | 85 | 2.4 | `[]` | [SPECULATION] Figel (Majestics V-Force). Anime-exclusive; AR=Figelanzer blades; BB=flat/semi-flat anime-only. No gimmick. | 3 | C |
| Dark Gargoyle | plastic_magnacore | gen1 | Attack | Right | 130 | 55 | 85 | 2.5 | `[]` | [FACT] Random Booster 10 (TT=Death Gargoyle); Miguel (Barthez); AR=Genocide Circle (~5g, wide-arc lateral smash); SG=NEO Right SG Metal Weight Core (non-magnetic). No gimmick on Takara release; Hasbro Engine Gear version upgrades to `engine_gear`. | 2 | A |

---

## Section 3 — Plastic Engine Gear Era (`plastic_neosg`)

> [FACT] Engine Gear (EG) System: spring stores launch torque, releases mid-battle via clutch. Clutch types: Instant Release (First Clutch / Zeus), Hit Release (Trypio G, Strata Dragoon G), Final Clutch, Full Auto Clutch (Gigars — listed under SGS above due to non-competitive EG), Reverse EG (Dranzer GT).

| Name | System | gen | Type | spin | atk | def | sta | radius_cm | gimmickIds | notes | Tier | Conf |
|------|--------|-----|------|------|-----|-----|-----|-----------|-----------|-------|------|------|
| Metal Driger | plastic_neosg | gen1 | Balance | Right | 100 | 95 | 95 | 2.5 | `["heavy_wheel"]` | [FACT] A-95; Jin/Hiro; EG era (Instant Release); SG=Neo Right SG HMC (~9g zinc alloy); `heavy_wheel` from heavy metal SG core. | 2 | A |
| Pierce Hedgehog | plastic_neosg | gen1 | Attack | Right | 140 | 50 | 80 | 2.3 | `["spring_recoil"]` | [INFERRED] Mathilda (Barthez). Anime-exclusive. Self-destruct spring mechanism. EG system. | 2 | C |
| Rapid Eagle | plastic_neosg | gen1 | Balance | Right | 95 | 90 | 95 | 2.4 | `["orbit_movement"]` | [INFERRED] Claude (Barthez). A series. AR=Penta Wing; WD=Ten Wide; BB=SG Flat Base. Orbital path movement. | 3 | B |
| Rock Bison | plastic_neosg | gen1 | Defense | Right | 55 | 140 | 100 | 2.5 | `["engine_gear","stamina_recovery"]` | [FACT] A-98; Rick (All Starz); EG=Right EG Circle Defenser. EG + stamina recovery on release. | 2 | A |
| Rushing Boar | plastic_neosg | gen1 | Stamina | Right | 55 | 75 | 140 | 2.4 | `[]` | [INFERRED] Aaron (Barthez). EG stamina type. No gimmick beyond EG baseline. | 3 | B |
| Strata Dragoon G | plastic_neosg | gen1 | Attack | Right | 145 | 50 | 80 | 2.5 | `["engine_gear","free_spin","spin_equalization"]` | [FACT] A-108; Daichi; AR=Dragon Saucer (~8g, outer free-spin ring + sub-AR gear-tooth socket); EG=Right EG Metal Flat; BB=Hit Release (Strata Dragoon G Version). | 1 | A |
| Thunder Pegasus | plastic_neosg | gen1 | Attack | Dual | 140 | 55 | 80 | 2.5 | `["dual_spin","engine_gear"]` | [FACT] Random Booster Vol. 12; Julia (F-Dynasty); BB=Engine Stopper Base. Dual-spin EG. | 2 | A |
| Torch Pegasus | plastic_neosg | gen1 | Attack | Dual | 135 | 55 | 80 | 2.5 | `["dual_spin"]` | [FACT] A-109; unnamed; dual-spin selectable without EG. | 3 | A |
| Trypio G | plastic_neosg | gen1 | Attack | Right | 140 | 55 | 80 | 2.5 | `["engine_gear","spring_recoil"]` | [FACT] A-87; Eddie (All Starz); AR=Scorpio Claw (~5g, pointed dual-claw); EG=Right EG Metal Semi-Flat (Hit Release); BB=Jumping Base (spring hop on EG release). | 2 | A |
| Zeus | plastic_neosg | gen1 | Stamina | Right | 80 | 80 | 120 | 2.6 | `["free_spin","engine_gear","velocity_burst"]` | [FACT] A-129; Brooklyn (BEGA); AR=Holy Despell (inner core + outer free-spinning ring); SG=Right Customize Gear (Free Shaft Version); BB=First Clutch Base (Zeus Version). Final arc villain. | 1 | A |

---

## Section 4 — HMS Era (`hms`)

> [FACT] All HMS beys: steel-faced Metal Attack Ring (MAR) with die-cast zinc alloy metal frame; Circle Weight Disk (CWD); Running Core (RC) integrates SG+BB; standard dual-spin launcher. Dual-spin is universal to HMS — not listed as `dual_spin` gimmick unless it's a notable special feature; HMS beys all have it by default.

| Name | System | gen | Type | spin | atk | def | sta | radius_cm | gimmickIds | notes | Tier | Conf |
|------|--------|-----|------|------|-----|-----|-----|-----------|-----------|-------|------|------|
| Strata Dragoon MS | hms | gen1 | Attack | Dual | 145 | 50 | 75 | 2.3 | `["spin_equalization"]` | [FACT] A-123; Daichi; AR=Metal Saucer (16 gear-notches, circular, rattle flaw, inferior to Advance Balancer); WD=Circle Heavy; RC=Flat Core. Metal Saucer viable for spin-steal customs. Early release; outdated stock. | 1 | A |
| Dragoon MS | hms | gen1 | Attack | Dual | 150 | 50 | 70 | 2.3 | `["rubber_grip"]` | [FACT] A-126; Tyson; AR=Metal Attacker (steel, aggressive smash); WD=Circle Wide; RC=Grip Flat Core (rubber flat, aggressive, wears 0.02/match). | 1 | A |
| Draciel MS | hms | gen1 | Defense | Dual | 55 | 150 | 95 | 2.3 | `[]` | [FACT] A-125; Max; AR=Metal Defense (steel, round, ultra-low recoilFactor 0.05); WD=Circle Wide; RC=Sharp Core (metal sharp, center-hold). No unique gimmick. | 1 | A |
| Driger MS | hms | gen1 | Balance | Dual | 110 | 95 | 105 | 2.3 | `[]` | [FACT] A-124; Ray; AR=Metal Upper (steel, 3-slope tiger-claw upper-attack); WD=Circle Balance; RC=Semi-Flat Core (metal semi-flat). No unique gimmick. | 1 | A |
| Dranzer MS | hms | gen1 | Balance | Dual | 110 | 100 | 100 | 2.3 | `["mode_switch"]` | [FACT] A-131 (last A-code); Kai; AR=Spiral Upper (steel spiral omnidirectional upper-attack); WD=Circle Balance; RC=Manual Change Core (PLAYER_SELECTABLE: ATTACK_FLAT / SURVIVAL_SHARP / HYBRID_SEMIFLAT). Pre-battle selector. | 1 | A |
| Wyvern DJ | hms | gen1 | Stamina | Dual | 60 | 75 | 140 | 2.3 | `[]` | [FACT] A-130; Blader DJ; AR=DJ Spiker (18g, letter-J geometry, multi-type Smash+Spike+minor Upper); WD=Circle Balance (15.13g); RC=Metal Sharp Core (4g, low-friction center). Outclassed in stock by later HMS. | 2 | A |
| Death Gargoyle MS | hms | gen1 | Balance | Right | 110 | 95 | 105 | 2.3 | `["mode_switch"]` | [FACT] MA-04 (booster); Miguel (manga Barthez); AR=Circle Upper (~20g, second-widest HMS AR, two molds); WD=Circle Heavy; RC=Metal Change Core (auto-switch: sharp=survival/flat=attack on tilt — passive mode_switch). Right-spin standard. | 2 | A |
| Einstein MS | hms | gen1 | Balance | Dual | 90 | 85 | 95 | 2.3 | `["spring_recoil"]` | [FACT] A-136/FB-04; Kenny; AR=Metal Spring (~16g, triangular, small diameter); WD=Circle Heavy; RC=Spring Core (~3g, internal spring bounce-on-launch, zero competitive use). spring_recoil = bounce launch gimmick. | 2 | A |
| Wolborg MS | hms | gen1 | Stamina | Dual | 50 | 80 | 160 | 2.3 | `["bearing_drift","free_spin"]` | [FACT] MA-08; Tala (manga); AR=Wolf Crusher (steel, defensive profile); WD=Circle Wide (mold variants); RC=Bearing Core (S-tier: free-shaft bearing, spinDecayRate 0.003/s, best in HMS). | 1 | A |
| Advance Averazer | hms | gen1 | Balance | Dual | 100 | 95 | 105 | 2.3 | `["spin_equalization"]` | [FACT] MA-09; no anime owner; AR=Advance Balancer (15g, gear-toothed circular metal sub-ring, S-tier spin-steal); WD=Circle Balance; RC=Metal Semi-Flat Core. | 3 | A |
| Advance Eterner | hms | gen1 | Stamina | Dual | 55 | 80 | 150 | 2.3 | `["spin_equalization"]` | [FACT] MA-14; no anime owner; AR=Advance Survivor (18g, reversible 4-protrusion metal sub-ring, A-tier spin-steal); WD=Circle Wide; RC=Metal Sharp Core (4g, best non-bearing Stamina RC). | 3 | A |
| Advance Guardian | hms | gen1 | Defense | Dual | 55 | 145 | 90 | 2.3 | `[]` | [FACT] MA-11; no anime owner; AR=Advance Defenser (18g, metal roller pair, negligible defense); WD=Circle Heavy (16g); RC=Grip Sharp Core (~3g, rubber sharp hybrid, niche). No effective gimmick. | 3 | A |
| Advance Striker | hms | gen1 | Attack | Dual | 155 | 50 | 70 | 2.3 | `["mode_switch"]` | [FACT] MA-12; no anime owner; AR=Advance Attacker (21g, reversible frame: Upper Mode / Force Smash Mode, best left-spin Upper in HMS); WD=Circle Heavy (16g); RC=Metal Flat Core (3g, requires Sliding Shoot). | 3 | A |
| Aero Knight MS | hms | gen1 | Defense | Dual | 55 | 140 | 90 | 2.3 | `["spring_recoil"]` | [FACT] MA-21; no anime owner; AR=Knight Crusher (19g, metal nubs, high recoil both spins — non-competitive); WD=Circle Wide (14g, harvested); RC=Aero Core (3g) + Aero Wing (6g helicopter disc, one-shot launch toy mode, combat-negative). | 3 | A |
| Phantom Fox MS | hms | gen1 | Attack | Dual | 135 | 55 | 80 | 2.3 | `["free_spin"]` | [FACT] MA-15; no anime owner; AR=Upper Fox (19g, shared metal frame with Upper Dragon + Devil Crusher, plastic-dominant Smash); WD=CWD Circle Attacker (17g, Wobbling tournament winner); RC=Bunshin Core (split on impact: upper half ejects, lower half continues). free_spin = Bunshin separation. | 3 | A |
| Dark Leopard MS | hms | gen1 | Balance | Dual | 100 | 90 | 100 | 2.3 | `[]` | [FACT] MA-16; no anime owner; AR=Smash Leopard (18g, Force Smash left-spin, shared metal frame with Smash Phoenix + God Smasher); WD=Needle Attacker (16g); RC=Tornado Change Core (3g, lightest RC, tall profile for Force Smash height gain). No registry gimmick (tall profile is passive architecture). | 3 | A |
| Dragoon MF | hms | gen1 | Attack | Dual | 140 | 55 | 80 | 2.3 | `["rubber_grip"]` | [FACT] RBA3 prize; Tyson (manga Vol.14); AR=Upper Dragon (19g, shared metal frame, best Smash among shared-frame trio); WD=CWD Chain Attacker (17g, free-spinning 9 spikes, non-competitive); RC=Metal Weight Grip Core (~14-16g, hardened rubber flat, controlled rubber Attack, heavier than Grip Flat Core). | 1 | A |
| Dragoon MS UV | hms | gen1 | Attack | Dual | 160 | 50 | 65 | 2.3 | `["rubber_grip","velocity_burst"]` | [FACT] MA-01 (first+rarest HMS); Tyson (anime finale Ep.52); AR=Ultimate Attacker (~14g, 4 dragon-head spikes); WD=Circle Wide (14g); RC=Grip Flat Core Ultimate Mode (5mm soft red rubber, ~120-130% speed of base GFC, lightest RC at 1g, highest self-KO risk). velocity_burst = Tornado Ridge grip acceleration burst. | 1 | A |
| Dranzer MF | hms | gen1 | Balance | Dual | 110 | 90 | 110 | 2.3 | `["free_spin"]` | [FACT] RBA4; Kai (manga Rising); AR=Smash Phoenix (~18g, wide phoenix-wing Smash, shared metal frame with Smash Leopard + God Smasher); WD=Wing Attacker (~17g, asymmetric wing protrusions); RC=Free Shaft Core (~8g, decoupled inner shaft reduces spin loss on Smash impact, Metal Flat tip). free_spin = Free Shaft decoupled shaft. | 1 | A |
| Gaia Dragoon MS | hms | gen1 | Attack | Dual | 145 | 55 | 75 | 2.3 | `["spin_equalization"]` | [FACT] A-123 (provisional); Daichi; AR=Metal Saucer (steel saucer, spin-steal via gear-notch contact); WD=Circle Heavy (~18g, heaviest HMS Circle); RC=Flat Core (pure metal flat). [NOTE: This is a duplicate entry — Strata Dragoon MS = Gaia Dragoon MS, same product A-123. Included for name alias completeness; do not seed twice.] | 1 | A |
| Jiraiya MS | hms | gen1 | Stamina | Dual | 55 | 85 | 150 | 2.3 | `["bearing_drift","free_spin"]` | [FACT] MA-22; no anime owner; AR=Jiraiya Blade (~19g, co-heaviest AR with Samurai Upper, perimeter metal spikes, stationary Smash capability); WD=CWD Free Cross (~14g, shuriken-motif, free-spinning, no competitive use); RC=Bearing Core 2 (~8g, hard rubber bearing tip, tunable mint/worn condition, mandatory competitive own). bearing_drift+free_spin = bearing shaft mechanism. | 3 | A |
| Magical Ape MS | hms | gen1 | Defense | Dual | 55 | 150 | 85 | 2.3 | `["mode_switch"]` | [FACT] MA-18; no anime owner; AR=Metal Ape (~19g, smallest HMS AR, centralized weight, wall-defense geometry); WD=Circle Heavy (~16.3g); RC=Flat Core (revised, ~2g, screw center, outdated). Includes Gyro Adapter accessory (Battle Mode vs Gyro Mode = mode_switch). | 3 | A |
| Round Shell MS | hms | gen1 | Defense | Dual | 55 | 145 | 90 | 2.3 | `["rubber_grip","contact_deflect"]` | [FACT] MA-19; no anime owner; AR=Turtle Crusher (~19g, two blunt projections, adjacent-end weight, Wobbling prone); no separate CWD; RC=Rubber Weight Core (~25g, rubber outer shell = shock absorption + Force Smash diagonal lower rim, replaces both WD+RC layers). rubber_grip = rubber shell contact; contact_deflect = diagonal force smash deflection. | 3 | A |
| Samurai Changer MS | hms | gen1 | Balance | Dual | 115 | 95 | 100 | 2.3 | `["mode_switch"]` | [FACT] MA-20; no anime owner; AR=Samurai Upper (22g, heaviest HMS AR, circular, Upper+Smash right-spin / Smash-only left-spin); WD=Circle Heavy (~20g); RC=Battle Change Core (~11g, impact-triggered tip toggle: flat=Attack / sharp=Survival, unlimited switches, uncontrollable). mode_switch = Battle Change Core. | 3 | A |
| Sea Dragon | hms | gen1 | Defense | Right | 60 | 140 | 90 | 2.3 | `["free_spin"]` | [FACT] RBA2 prize; no anime owner; AR=Seagon Attacker (~22g, inverted metal frame design, left-spin hammer-head extreme Smash with catastrophic recoil); WD=CWD Defense Ring (17g, heaviest+most compact fixed CWD, star part); RC=Metal Ball Core (~3g, free-spinning metal ball in greased chamber). free_spin = Metal Ball Core + CWD Defense Ring free aspects. Right-spin standard. | 3 | A |
| Shining God MS | hms | gen1 | Balance | Dual | 100 | 100 | 100 | 2.3 | `["mode_switch"]` | [FACT] MA-24 (final regular Takara HMS release); no anime owner; AR=God Smasher (18g, wide ABS caul, Force Smash left-spin weak / Smash right-spin moderate, shared metal frame with Smash Phoenix + Smash Leopard); WD=CWD God Ring (18g, near-circular, top-tier CWD peer to CWD Defense Ring); RC=Shooter Change Core Gamma (6g, spin-direction tip selector: right=flat/left=sharp, WD bottom-mount, Upper Mode gap enabled). Misprint: "dog" instead of "god" on BP. | 3 | A |
| Slash Riger MS | hms | gen1 | Attack | Dual | 140 | 55 | 80 | 2.3 | `["free_spin"]` | [FACT] FB-05 (Fukubako 2005 prize); no anime owner; AR=Slash Upper (~19g, 2-ramp Upper+Smash simultaneous right-spin, mid-tier due to ~4g weight deficit vs Jiraiya/Samurai Upper); WD=CWD Free Crusher (~18g, six-wing free-spinning spikes, non-competitive standard, niche BCC-lock Smash); RC=Free Wing Core (~7g, 3 free-pivot claws, non-competitive, self-defeating stock). free_spin = dual free-spin gimmick parts. | 3 | A |
| Bloody Devil MS | hms | gen1 | Attack | Dual | 130 | 70 | 80 | 2.3 | `["mode_switch"]` | [FACT] MA-23; no anime owner; AR=Devil Crusher (~19g, shared metal frame Upper Dragon/Upper Fox family, circular ABS caul, weak Smash); WD=CWD Devil Saucer (~17g, 8 spikes free-spinning, non-competitive); RC=Shooter Change Core Alpha (~8g, spin-direction tip selector: right=flat/left=semi-flat, WD bottom-mount inverted architecture, Upper Mode gap enabled). Mold 3 BP. | 3 | A |
| Thunder Dragon | hms | gen1 | Attack | Right | 130 | 75 | 80 | 2.3 | `["free_spin","contact_deflect"]` | [FACT] RBA1 prize; no anime owner; CoroCoro 2003 contest co-winner; AR=Spark Dragon (~14g, ABS Caul free-spins on hit — near-zero Smash, cosmetic spark effect TT only); WD=CWD Free Survivor (~17g, outer ring free-spins, Upper Attack mitigation, first-ever CWD); RC=Metal Weight Flat Core (~3g, metal slug, Takara wider tip for more speed). free_spin = CWD Free Survivor deflection; contact_deflect = Spark Dragon caul free-spin deflection. Right-spin only. | 3 | A |

---

## Gen1 Gimmick Discovery Summary

### SGS / Plastic Era Key Findings

**Zombie/Spin-Steal Archetype (SGS):**
- [FACT] `Wolborg 2` (Tala) — SG Bearing Version 2 (bearing + rubber tip) = Defense Zombie cornerstone. `bearing_drift` + `rubber_grip`.
- [FACT] `Vortex Ape` (Dunga) — Defense Ring SP sub-part = S-tier spin-steal + LAD for SGS era. `spin_equalization`.
- [FACT] `Gabriel` (no owner) — Twin Horn AR = S-tier passive spin-steal Zombie AR. `spin_equalization`.

**Unique Attack Gimmicks:**
- [FACT] `Trygle` (Michael) — SG Jumping Base = spring-hop on launch. `spring_recoil`.
- [FACT] `Trypio` (Eddy) — Flying Defense AR (7g, 8.84cm wide) = contact deflection wall. `contact_deflect`.
- [FACT] `Galzzly` (Gary) — War Bear SAR free-spinning sub-attack ring. `free_spin` (non-competitive in standard use).
- [FACT] `Galux` (Mariam) — Metal Ball Base (chrome ball bearing tip). `heavy_wheel`.

**Mode-Switch Lineage (Dranzer family):**  
Every Dranzer blade base has a switchable tip: S→Spiral Change, F→Flame Change, V→Volcano Change, V2→Customize Change, G→EG clutch swap, GT→Reverse EG, MS→Manual Change Core. `mode_switch` runs the entire line.

**Magnacore System:**
- [FACT] System requires: NEO Right SG + Magnecore (North or South) + Magne Weight Disk (MWD) on all true Magnacore beys.
- [FACT] Repulsion/attraction occurs when same (repel) or opposite (attract) magnetic poles collide.
- [INFERRED] Anime-exclusive Magnacore beys (Sharkrash, Vanishing Moot) lack product data; `magnacore_repel` mapped from their described system.

**Engine Gear System:**
- [FACT] Clutch types produce different release behaviors: Instant Release (Zeus, First Clutch) = `velocity_burst` peak; Hit Release (Strata Dragoon G, Trypio G) = `spring_recoil` + `engine_gear`; Final Clutch = gradual release.
- [FACT] Zeus `free_spin` outer ring on Holy Despell AR absorbs opponent contact before EG fires.
- [FACT] Strata Dragoon G unique: `free_spin` (Dragon Saucer outer ring) + `spin_equalization` (sub-AR locked mode) + `engine_gear`.

### HMS Era Key Findings

**Core Architecture (all HMS):**
- [FACT] All HMS beys: steel-faced MAR (zinc alloy metal frame), Circle WD, Running Core (SG+BB integrated), dual-spin selectable. `dual_spin` is system-wide, not noted per-bey as it would repeat every row.

**Top Competitive Parts:**
- [FACT] `Bearing Core` (Wolborg MS): S-tier spinDecayRate 0.003/s. `bearing_drift` + `free_spin`. Counter-strategies: Halting+Force Smash, Pure Attack KO, Mirror Bearing.
- [FACT] `Bearing Core 2` (Jiraiya MS): hard rubber bearing tip, tunable mint/worn. Top-tier mandatory own. `bearing_drift` + `free_spin`.
- [FACT] `Advance Balancer` (Advance Averazer): 15g gear-toothed metal sub-ring, S-tier spin-steal. `spin_equalization`.
- [FACT] `Samurai Upper` (Samurai Changer MS): 22g, co-heaviest AR, Upper+Smash right-spin, viable Defense.
- [FACT] `CWD Defense Ring` (Sea Dragon RBA2): 17g, heaviest+most compact fixed CWD. Universal donor.
- [FACT] `CWD God Ring` (Shining God MS): 18g, peer to CWD Defense Ring.
- [FACT] `Grip Flat Core Ultimate Mode` (Dragoon MS UV): 5mm rubber tip, 120-130% base GFC speed, highest self-KO risk.

**Gimmick Sub-Line (MA-15 through MA-24):**
- MA-15 Phantom Fox MS: Bunshin Core (two-part split RC). `free_spin`.
- MA-16 Dark Leopard MS: Tornado Change Core (tall profile for Force Smash height). Passive architecture — no registry gimmick.
- MA-18 Magical Ape MS: Battle Mode vs Gyro Mode via Gyro Adapter. `mode_switch`.
- MA-19 Round Shell MS: Rubber Weight Core (rubber shell Defense + Force Smash rim). `rubber_grip` + `contact_deflect`.
- MA-20 Samurai Changer MS: Battle Change Core (impact-triggered tip toggle, uncontrollable). `mode_switch`.
- MA-21 Aero Knight MS: Aero Wing helicopter disc (one-shot launch toy, combat-negative). `spring_recoil`.
- MA-22 Jiraiya MS: Bearing Core 2 (hard rubber bearing, tunable condition). `bearing_drift` + `free_spin`.
- MA-23 Bloody Devil MS: Shooter Change Core Alpha (spin-direction tip: right=flat/left=semi-flat, WD bottom-mount). `mode_switch`.
- MA-24 Shining God MS: Shooter Change Core Gamma (improved Alpha successor, sharp left-spin, same WD bottom-mount). `mode_switch`. Final regular Takara HMS release.

**Shared Metal Frame Families:**
1. Upper Dragon / Upper Fox / Devil Crusher — same frame, different ABS caul geometries.
2. Smash Phoenix / Smash Leopard / God Smasher — same Force Smash frame.
3. Circle Upper (Death Gargoyle MS) / Samurai Upper (Samurai Changer MS) — same metal frame, Samurai Upper has wider plastic component.

**Notable Exclusions / Duplicate Alerts:**
- `keel-shark.md` → Gen4 (Beyblade X, BX system, SharkEdge 3-60LF). EXCLUDED.
- `vortex-ape.md` and `vortex-ape-2.md` → same product A-77. ONE ROW (listed as "Vortex Ape").
- `trygator-s.md` and `trygator-2.md` → same product (Emily Watson). Use "Trygator 2" name.
- `gaia-dragoon-ms.md` and `strata-dragoon-ms.md` → same product A-123 (Gaia Dragoon MS / Strata Dragoon MS). ONE ROW in final seed (use Strata Dragoon MS as canonical English name). Gaia Dragoon MS row above marked DO NOT SEED TWICE.
- `death-driger.md` → TT=Shadow Driger, Hasbro=Death Driger. Table uses "Death Driger" (English facing).

---

*End of Phase 07 Gen1 Research File*

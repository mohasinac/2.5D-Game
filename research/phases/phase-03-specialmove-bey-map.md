[← Phase 02: Special Moves](phase-02-special-moves.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 04: Combo Mapping →](phase-04-combo-mapping.md)

---

# Phase 03 — Special Move → Beyblade Mapping

> Stage 3 | Cross-reference: phase-02-special-moves.md + linka/beys/
> Tag key: FACT | INFERENCE | SPECULATION | UNKNOWN
> Date: 2026-05-23
> Total moves mapped: 91 canonical + batch entries from phase-02 (all 119 covered)

> **DECISION (2026-05-24)**: 3D simulation is not planned. Annotations "(3D correction logged)" and "(3D audit: already correct)" in confidence cells below are historical notes from a prior research pass and do not represent implementation targets.

---

## Assignment Rules

### 1 Move Per Bey (Primary Assignment)

Each beyblade has exactly **one** `specialMoveId` in `beyblade_stats`. Where a canonical bey has multiple named moves (e.g. Dranzer G has both Blazing Gigs and Blazing Gigs Tempest), the more powerful / series-defining move is assigned as `specialMoveId`. The other moves become combo-chain flavour or upgrade paths — noted in the "Notes" column.

### Game-Original Beys Get Custom Moves

Beys with no linka canonical owner map to placeholder IDs in the format `game_original_[type]`. These are filled by engine type-default (see `DEFAULT_TYPE_TO_MOVE` in `server/constants/specialMoves.ts`).

### powerCost Scale

| Value | Tier | Meaning |
|-------|------|---------|
| 0 | Passive | Always-on or threshold-gated; no active power deduction |
| 50 | Light | Minor burst; cheap to activate |
| 100 | Standard | Normal special move cost (engine default) |
| 150 | Heavy | High-impact or environmental move |
| 200 | Ultimate | Finisher / once-per-match moves |

Engine note: the existing `specialMoves.ts` hardcodes four moves at implicit cost ≈100 (single activation per charge). Phase-02 `powerCost` values used in config skeletons are on a permille scale (1000 = max charge unit). For the `beyblade_stats` field, powerCost here maps to the simplified 5-tier integer above.

### Type Restrictions

Type restrictions follow beyblade archetype. A "universal" move can be held by any type. "attack / defense / stamina / balanced" restricts equip to matching bey type.

### Generation Labeling

- Gen1 = Plastic / HMS era (Beyblade original, V-Force, G-Revolution)
- Gen2 = Metal Fight Beyblade (Metal Fusion, Metal Masters, Metal Fury)
- Gen3 = Beyblade Burst (all Burst sub-eras: Standard, Evolution, Turbo, Rise, Sparking, DB)
- Gen4 = Beyblade X

### Combo Chain Logic

Combos from the 8-entry engine registry can "chain into" a special move — meaning activating a specific combo generates power toward or triggers the special. Assignments are thematic/mechanical:

- `power-thrust` (JJJ, universal, cost 25) → chains into attack-type specials (forward burst + damage)
- `quick-dash-r` / `quick-dash-l` (→→J / ←←J, free) → chains into mobility/airborne specials
- `pivot-strike` (←→J, balanced, cost 15) → chains into multi-directional / balanced specials
- `spin-leech-jab` (←J→, stamina, cost 35) → chains into spin-steal / stamina specials
- `guard-tap` (KKK, free) → chains into defensive specials
- `riposte` (KKJ, defense, cost 15) → chains into counter/defensive specials
- `feint` (←→K, free) → chains into evasion / movement specials

---

## Move → Bey Mapping Table

| Move ID | Move Name | Owner Bey(s) | Gen | Type | powerCost | Trigger Combo? | comboIds | Evidence | Confidence |
|---------|-----------|-------------|-----|------|-----------|----------------|---------|---------|-----------|
| `storm-attack` | Storm Attack | Dragoon S | Gen1 | attack | 50 | Yes — quick dash into contact | `quick-dash-r`, `quick-dash-l` | FACT (wiki + eps) | High |
| `phantom-hurricane` | Phantom Hurricane | Dragoon S / Dragoon F / Dragoon V | Gen1 | attack | 150 | Yes — power-thrust leads into pillar | `power-thrust` | FACT (wiki + eps) | High |
| `dragoon-typhoon` | Dragoon Typhoon | Dragoon V | Gen1 | attack | 150 | Yes — power-thrust triple column | `power-thrust`, `quick-dash-r` | INFERENCE | Medium |
| `galaxy-storm` | Galaxy Storm | Dragoon G | Gen1 | attack | 200 | Yes — power-thrust into vortex | `power-thrust` | FACT (wiki + eps) | High |
| `galaxy-turbo-twister` | Galaxy Turbo Twister | Dragoon GT | Gen1 | attack | 150 | Yes — power-thrust into twister | `power-thrust`, `quick-dash-r` | FACT (G-Rev Ep 26) | High |
| `flame-saber` | Flame Saber | Dranzer S / Dranzer F / Dranzer V | Gen1 | attack | 100 | Yes — pivot-strike into arc | `pivot-strike`, `quick-dash-r` | FACT (eps, linka) | High |
| `blazing-gigs` | Blazing Gigs | Dranzer G | Gen1 | balanced | 150 | Yes — power-thrust orbit trigger | `power-thrust` | FACT (wiki + manga) | High |
| `blazing-gigs-tempest` | Blazing Gigs Tempest | Dranzer GT | Gen1 | balanced | 200 | Yes — feint into barricade phase | `feint`, `power-thrust` | FACT (wiki + manga) | High |
| `reverse-zig-zag-attack` | Reverse Zig-Zag Attack | Dranzer GT | Gen1 | balanced | 100 | Yes — feint into zigzag | `feint`, `quick-dash-l` | FACT (Takara Tomy Reverse EG) | High |
| `tiger-claw` | Tiger Claw | Driger S / Driger F / Driger V | Gen1 | attack | 100 | Yes — power-thrust multi-hit | `power-thrust`, `quick-dash-r` | FACT (eps + linka) | High |
| `gatling-claw` | Gatling Claw | Driger G | Gen1 | attack | 150 | Yes — power-thrust volley | `power-thrust` | FACT | High |
| `fortress-defense` | Fortress Defense | Draciel S / Draciel F / Draciel V | Gen1 | defense | 100 | Yes — guard-tap into barrier | `guard-tap`, `riposte` | FACT (eps + linka) | High |
| `dark-lightning` | Dark Lightning | Galeon | Gen1 | attack | 150 | Yes — contact aura via quick-dash | `quick-dash-r`, `quick-dash-l` | FACT (wiki) | High |
| `novae-rog` | Novae Rog | Wolborg 2 / Wolborg 4 | Gen1 | stamina | 200 | Yes — spin-leech-jab into prison | `spin-leech-jab` | FACT (wiki + ep50) | High |
| `slash-right` | Slash Right | Lightning L-Drago (plastic) | Gen1 | attack | 100 | Yes — quick-dash-r arc steal | `quick-dash-r`, `spin-leech-jab` | FACT (linka + eps) | High |
| `ice-wall` | Ice Wall | Wolborg (original) | Gen1 | defense | 100 | Yes — guard-tap directional shield | `guard-tap` | INFERENCE (pre-Novae Rog) | Medium |
| `freezing-wolf-claw` | Freezing Wolf Claw | Wolborg (original) | Gen1 | attack | 100 | Yes — power-thrust + freeze | `power-thrust` | FACT (linka batch) | Medium |
| `sky-strike` | Sky Strike | Trygle | Gen1 | attack | 100 | Yes — quick-dash into airborne | `quick-dash-r` | FACT (linka + eps) | High |
| `wild-claw` | Wild Claw | Galeon 2 | Gen1 | attack | 100 | Yes — power-thrust multi-claw | `power-thrust` | INFERENCE | Medium |
| `shadow-fang` | Shadow Fang | Galux | Gen1 | attack | 100 | Yes — feint stealth approach | `feint`, `quick-dash-r` | INFERENCE | Medium |
| `cyber-storm` | Cyber Storm | Cyber Dragoon | Gen1 | attack | 100 | Yes — power-thrust clone pillar | `power-thrust` | INFERENCE (copy bey) | Medium |
| `reverse-storm` | Reverse Storm | Cyber Dragoon | Gen1 | attack | 100 | Yes — feint spin flip | `feint`, `quick-dash-l` | INFERENCE | Medium |
| `volcano-ember` | Volcano Ember | Burning Kerberos | Gen1 | attack | 150 | Yes — power-thrust zone spawn | `power-thrust` | INFERENCE (Metal Masters era) | Medium |
| `flare-blitz` | Flare Blitz | Burn Fireblaze | Gen2 | attack | 100 | Yes — quick-dash fire rush | `quick-dash-r`, `power-thrust` | INFERENCE | Medium |
| `black-excalibur` | Black Excalibur | Cyber Griffolyon | Gen1 | attack | 150 | Yes — overhead-cleave via power-thrust | `power-thrust` | INFERENCE (3D correction) | Medium |
| `eight-headed-dragon-strike` | Eight-Headed Dragon Strike | Yaryū | Gen1 | attack | 150 | Yes — power-thrust spherical | `power-thrust` | INFERENCE (3D correction) | Medium |
| `fire-execution` | Fire Execution | Dranzer G / Dranzer GT | Gen1 | attack | 150 | Yes — quick-dash into descent | `quick-dash-r`, `power-thrust` | INFERENCE (3D correction) | Medium |
| `spiral-survivor` | Spiral Survivor | Dranzer V / Dranzer V2 | Gen1 | defense | 100 | Yes — guard-tap reflect pillar | `guard-tap`, `riposte` | INFERENCE | Medium |
| `aqua-shield` | Aqua Shield | Master Draciel MS | Gen1 | defense | 100 | Yes — guard-tap multi-axis | `guard-tap` | INFERENCE (HMS manga) | Low |
| `zeus-barrier` | Zeus' Barrier | Dragoon V2 (team) | Gen1 | defense | 200 | Yes — guard-tap formation | `guard-tap` | INFERENCE | Low |
| `dragon-scream` | Dragon Scream | Dragoon V | Gen1 | attack | 100 | Yes — feint AoE debuff | `feint` | INFERENCE | Low |
| `spiral-dimension` | Spiral Dimension | game_original_attack | Gen1 | attack | 200 | Yes — power-thrust vortex | `power-thrust` | INFERENCE (team combo) | Low |
| `eternal-defense-spin` | Eternal Defense Spin | Strata Dragoon V | Gen1 | defense | 100 | Yes — guard-tap spin shield | `guard-tap` | INFERENCE | Low |
| `stardust-driver` | Stardust Driver | Strata Dragoon G | Gen1 | attack | 100 | Yes — quick-dash-r burst | `quick-dash-r` | INFERENCE | Low |
| `griffolyon-full-power` | Griffolyon Full Power | Griffolyon | Gen1 | attack | 100 | Yes — power-thrust persistent | `power-thrust` | INFERENCE | Low |
| `phantom-fire-shot` | Phantom Fire Shot | Trygle | Gen1 | attack | 150 | Yes — quick-dash airborne shot | `quick-dash-r` | INFERENCE | Low |
| `sharkrash-lateral` | Sharkrash Lateral | Sharkrash | Gen1 | attack | 100 | Yes — quick-dash-r tackle | `quick-dash-r` | INFERENCE | Low |
| `seaborg-tsunami-wave` | Seaborg Tsunami Wave | Seaborg / Seaborg 2 | Gen1 | attack | 150 | Yes — power-thrust wave | `power-thrust` | INFERENCE | Low |
| `falborg-wind-attack` | Falborg Wind Attack | Falborg S / Falborg 2 | Gen1 | attack | 100 | Yes — power-thrust multi-blade | `power-thrust` | INFERENCE | Low |
| `stroblitz` | Stroblitz | Falborg 2 | Gen1 | attack | 100 | Yes — power-thrust crusher | `power-thrust` | INFERENCE | Low |
| `driger-tiger-soul` | Driger Tiger Soul | Metal Driger / Driger MS | Gen1 | attack | 150 | Yes — power-thrust volley | `power-thrust` | INFERENCE | Low |
| `dread-phoenix-auto-resurrect` | Dread Phoenix Auto-Resurrect | game_original_stamina | Gen1 | stamina | 0 | No — passive threshold gate | `spin-leech-jab` | INFERENCE (spiritual) | Low |
| `starblast-attack` | Starblast Attack | Storm Pegasus 105RF | Gen2 | attack | 100 | Yes — quick-dash into airborne | `quick-dash-r` | FACT (wiki) | High |
| `storm-bringer` | Storm Bringer | Storm Pegasus 105RF | Gen2 | attack | 100 | Yes — power-thrust whirlwind | `power-thrust` | FACT (MF Ep ~3) | High |
| `pegasus-star-booster-attack` | Pegasus Star Booster Attack | Galaxy Pegasus W105R2F | Gen2 | attack | 150 | Yes — quick-dash-r apex dive | `quick-dash-r`, `power-thrust` | FACT (MF finale) | High |
| `lion-gale-force-wall` | Lion Gale Force Wall | Rock Leone 145WB | Gen2 | defense | 100 | Yes — guard-tap cylinder | `guard-tap`, `riposte` | FACT (eps + linka) | High |
| `king-lion-100-fang-fury` | King Lion 100 Fang Fury | Rock Leone 145WB | Gen2 | attack | 150 | Yes — power-thrust fang volley | `power-thrust` | FACT (eps + linka) | High |
| `inferno-blast` | Inferno Blast | Burn Fireblaze 135MS | Gen2 | attack | 100 | Yes — power-thrust pillar lash | `power-thrust` | FACT (linka + eps) | High |
| `dragon-emperor-soaring-bite-strike` | Dragon Emperor Soaring Bite Strike | L-Drago Destroy F:S | Gen2 | attack | 150 | Yes — quick-dash + spin-leech | `quick-dash-r`, `spin-leech-jab` | FACT (linka + eps) | High |
| `galaxy-nova` | Galaxy Nova | Galaxy Pegasus W105R2F | Gen2 | attack | 150 | Yes — quick-dash-r stellar nova | `quick-dash-r` | INFERENCE (3D correction) | Medium |
| `super-cosmic-nova` | Super Cosmic Nova | Big Bang Pegasis F:D | Gen2 | attack | 200 | Yes — power-thrust legend gate | `power-thrust` | INFERENCE (Metal Fury) | Medium |
| `big-bang-tornado` | Big Bang Tornado | Big Bang Pegasis F:D | Gen2 | attack | 200 | Yes — power-thrust finale | `power-thrust` | INFERENCE (Metal Fury finale) | Low |
| `solid-iron-wall` | Solid Iron Wall | Twisted Tempo | Gen2 | defense | 100 | Yes — guard-tap extreme anchor | `guard-tap` | FACT (linka + eps) | Medium |
| `grand-deucalion` | Grand Deucalion | Hades Kerbecs BD145DS | Gen2 | attack | 200 | Yes — power-thrust finisher | `power-thrust` | FACT (linka + eps) | Medium |
| `sand-storm-lion-gale-force-wall` | Sand Storm Lion Gale Force Wall | Fang Leone 130W2D | Gen2 | defense | 150 | Yes — guard-tap contact damage | `guard-tap`, `riposte` | INFERENCE | Medium |
| `lion-wild-wind-fang-dance` | Lion Wild Wind Fang Dance | Rock Leone (alt) | Gen2 | attack | 100 | Yes — power-thrust rapid | `power-thrust` | INFERENCE | Low |
| `bull-uppercut` | Bull Uppercut | Dark Bull H145SD | Gen2 | attack | 100 | Yes — power-thrust upper launch | `power-thrust` | FACT (3D audit) | Medium |
| `grand-maelstrom` | Grand Maelstrom | Jade Jupiter S130RB | Gen2 | attack | 150 | Yes — feint AoE storm | `feint` | INFERENCE | Low |
| `eyes-of-medusa` | Eyes of Medusa | Death Quetzalcoatl | Gen2 | stamina | 100 | Yes — spin-leech paralysis | `spin-leech-jab`, `feint` | INFERENCE | Low |
| `diving-arrow` | Diving Arrow | Flash Sagittario 230WD | Gen2 | attack | 100 | Yes — quick-dash dive | `quick-dash-r` | FACT (3D audit) | Medium |
| `tightrope-dive` | Tightrope Dive | Flame Libra T125ES | Gen2 | stamina | 50 | No — movement/ridge ride | `spin-leech-jab` | INFERENCE | Low |
| `spring-cannon` | Spring Cannon | game_original_attack | Gen2 | attack | 50 | Yes — quick-dash-r spring burst | `quick-dash-r` | INFERENCE | Low |
| `kerbeus-howl` | Kerbeus Howl | Phantom Kerbeus | Gen2 | stamina | 100 | Yes — feint AoE stun | `feint` | INFERENCE | Low |
| `storm-surge` | Storm Surge | Storm Pegasus (alt) | Gen2 | attack | 50 | Yes — quick-dash-r velocity | `quick-dash-r` | INFERENCE | Low |
| `thunder-attack` | Thunder Attack | game_original_attack | Gen2 | attack | 100 | Yes — power-thrust lightning | `power-thrust` | INFERENCE | Low |
| `galaxy-turbo-twister-g2` | Galaxy Turbo Twister (Gen2) | Galaxy Pegasus W105R2F | Gen2 | attack | 100 | Yes — power-thrust multi-vector | `power-thrust`, `pivot-strike` | INFERENCE | Low |
| `turbo-awakening` | Turbo Awakening | Cho-Z Achilles | Gen3 | attack | 0 | No — threshold gate passive | `power-thrust` | FACT (Burst Turbo S3) | High |
| `drain-spin` | Drain Spin | Drain Fafnir 8 Nothing | Gen3 | stamina | 0 | No — passive always-on | `spin-leech-jab` | FACT (wiki) | High |
| `requiem-spin` | Requiem Spin | Spryzen Requiem 0 Zeta | Gen3 | stamina | 0 | No — passive bidirectional | `spin-leech-jab` | FACT (wiki) | High |
| `counter-break` | Counter Break | Spryzen (all variants) | Gen3 | balanced | 100 | Yes — feint reactive redirect | `feint`, `riposte` | FACT (wiki) | High |
| `nothing-break` | Nothing Break | Drain Fafnir / Mirage Fafnir | Gen3 | stamina | 100 | Yes — guard-tap absorb charge | `guard-tap` | FACT (wiki) | High |
| `genesis-reboot` | Genesis Reboot | Genesis Valtryek 6V Reboot | Gen3 | attack | 100 | Yes — feint rubber velocity snap | `feint`, `quick-dash-r` | FACT (wiki) | High |
| `brave-flash` | Brave Flash | Brave Valkyrie Evolution' 2A | Gen3 | attack | 100 | Yes — quick-dash wall orbit | `quick-dash-r` | FACT (wiki) | High |
| `brave-sword` | Brave Sword | Brave Valkyrie Evolution' 2A | Gen3 | attack | 100 | Yes — power-thrust triple blade | `power-thrust` | FACT (wiki) | High |
| `hyper-flux` | Hyper-Flux | game_original_attack | Gen3 | attack | 100 | Yes — power-thrust sync gate | `power-thrust`, `pivot-strike` | FACT (wiki) | High |
| `dread-cannon` | Dread Cannon | Dread Phoenix 10 Friction | Gen3 | attack | 150 | Yes — quick-dash ricochet | `quick-dash-r`, `pivot-strike` | FACT (wiki) | High |
| `dread-break` | Dread Break | Dread Phoenix 10 Friction | Gen3 | attack | 100 | Yes — power-thrust rubber charge | `power-thrust` | FACT (wiki) | High |
| `revive-crush` | Revive Crush | Revive Phoenix 10 Friction | Gen3 | attack | 150 | Yes — pivot-strike pincer | `pivot-strike`, `quick-dash-r` | FACT (wiki) | High |
| `prime-reboot` | Prime Reboot | Prime Apocalypse 0D Reboot' | Gen3 | attack | 100 | Yes — feint rubber burst | `feint`, `quick-dash-r` | FACT (wiki) | High |
| `guilty-smash` | Guilty Smash | Guilty Longinus Karma Metal Destroy-2 | Gen3 | attack | 150 | Yes — quick-dash-r overhead | `quick-dash-r`, `power-thrust` | FACT (wiki) | High |
| `guilty-upper` | Guilty Upper | Guilty Longinus Karma Metal Destroy-2 | Gen3 | attack | 100 | Yes — power-thrust upward launch | `power-thrust` | FACT (wiki) | High |
| `final-limit-breaker` | Final Limit Breaker | Lucius Endbringer Kou Drift | Gen3 | defense | 150 | Yes — guard-tap ring split | `guard-tap`, `riposte` | FACT (wiki) | High |
| `lightning-crush` | Lightning Crush | Lightning Pandora QF | Gen3 | attack | 150 | Yes — quick-dash-r upper deck | `quick-dash-r` | FACT (wiki) | High |
| `omega-blast` | Omega Blast | Cho-Z Achilles 11Xt | Gen3 | attack | 200 | Yes — power-thrust turbo finisher | `power-thrust` | INFERENCE (3D correction) | Medium |
| `v-temptation` | V-Temptation | Valtryek V2 | Gen3 | attack | 100 | Yes — quick-dash hop lean | `quick-dash-r` | INFERENCE (3D correction) | Medium |
| `requiem-whip` | Requiem Whip | Spriggan Requiem | Gen3 | balanced | 100 | Yes — pivot-strike arc sweep | `pivot-strike`, `spin-leech-jab` | INFERENCE | Medium |
| `dynamite-burst` | Dynamite Burst | Dynamite Belial Nexus Venture-2 | Gen3 | attack | 150 | Yes — power-thrust dark strike | `power-thrust` | INFERENCE | Low |
| `dangerous` | Dangerous | Dangerous Belial | Gen3 | attack | 200 | Yes — power-thrust stadium-wide | `power-thrust` | INFERENCE | Low |
| `air-knight-vertical-volcanic` | Air Knight Vertical Volcanic | game_original_attack | Gen3 | attack | 150 | Yes — quick-dash volcanic dive | `quick-dash-r` | INFERENCE (3D audit) | Low |
| `pillar-dive` | Pillar Dive | game_original_attack | Gen3 | attack | 100 | Yes — quick-dash wall-climb | `quick-dash-r` | INFERENCE (3D audit) | Low |
| `sparking` | Sparking | game_original_attack | Gen3 | attack | 0 | No — passive bar charge | `power-thrust` | INFERENCE | Low |
| `genesis-whip` | Genesis Whip | Genesis Valtryek | Gen3 | stamina | 100 | Yes — spin-leech whip drain | `spin-leech-jab`, `pivot-strike` | INFERENCE | Low |
| `glimmering-stars` | Glimmering Stars | game_original_attack | Gen3 | attack | 100 | Yes — feint spin flip | `feint`, `power-thrust` | INFERENCE | Low |
| `solar-eclipse` | Solar Eclipse | game_original_attack | Gen3 | attack | 200 | Yes — power-thrust stadium-wide | `power-thrust` | INFERENCE | Low |
| `xtreme-dash` | Xtreme Dash | DranSword 3-60F / DranDagger / DranBuster | Gen4 | attack | 100 | Yes — quick-dash-r rail engage | `quick-dash-r` | FACT (wiki + ep01) | High |
| `crescent-judgment` | Crescent Judgment | DranSword 3-60F | Gen4 | attack | 100 | Yes — quick-dash-r arc exit | `quick-dash-r`, `pivot-strike` | FACT (Gen4 variant) | Medium |
| `solar-explosion` | Solar Explosion | PhoenixWing 9-60GF | Gen4 | attack | 100 | Yes — quick-dash-r fire exit | `quick-dash-r` | FACT | Medium |
| `yamata-no-orochi` | Yamata no Orochi | game_original_attack | Gen4 | attack | 150 | Yes — power-thrust 8-head exit | `power-thrust`, `quick-dash-r` | FACT | Medium |
| `emperor` | Emperor | HellsScythe / HellsHammer | Gen4 | attack | 150 | Yes — power-thrust heavy exit | `power-thrust` | FACT | Medium |
| `cosmo` | Cosmo | Aero Pegasus | Gen4 | attack | 100 | Yes — quick-dash-r extended rail | `quick-dash-r` | FACT | Medium |
| `dragonic-break-x` | Dragonic Break X | game_original_attack | Gen4 | attack | 100 | Yes — quick-dash dual-spin rail | `quick-dash-r`, `quick-dash-l` | FACT | Medium |
| `giant-breaching` | Giant Breaching | game_original_attack | Gen4 | attack | 150 | Yes — power-thrust mass dash | `power-thrust` | FACT | Medium |
| `infinite` | Infinite | game_original_attack | Gen4 | attack | 150 | Yes — quick-dash sustained rail | `quick-dash-r` | FACT | Medium |
| `max` | Max | game_original_attack | Gen4 | attack | 100 | Yes — quick-dash-r peak velocity | `quick-dash-r` | FACT | Medium |
| `spell-of-the-end` | Spell of the End | game_original_attack | Gen4 | attack | 200 | Yes — power-thrust dark AoE | `power-thrust` | FACT | Medium |
| `double-universe` | Double Universe | game_original_attack | Gen4 | attack | 150 | Yes — quick-dash-r double strike | `quick-dash-r`, `power-thrust` | FACT | Medium |
| `turbo-sword` | Turbo Sword | Cho-Z Achilles | Gen3 | attack | 100 | Yes — power-thrust turbo slash | `power-thrust` | INFERENCE | Low |
| `turbo-counter-break` | Turbo Counter Break | Cho-Z Achilles | Gen3 | attack | 100 | Yes — riposte absorb discharge | `riposte`, `power-thrust` | INFERENCE | Low |
| `turbo-defense` | Turbo Defense / Turbo Shield | Cho-Z Achilles | Gen3 | defense | 100 | Yes — guard-tap rigid | `guard-tap` | INFERENCE | Low |
| `reboot` | Reboot (Valtryek universal) | Valtryek V2 / Genesis Valtryek | Gen3 | balanced | 50 | Yes — feint spin-threshold catch | `feint`, `spin-leech-jab` | INFERENCE | Medium |
| `vanish-fafnir-spin-steal` | Vanish Fafnir Spin-Steal | Drain Fafnir (alt) / Mirage Fafnir | Gen3 | stamina | 0 | No — passive always-on | `spin-leech-jab` | FACT (wiki) | High |
| `naked-pulse` | Naked Pulse | game_original_stamina | Gen3 | stamina | 100 | Yes — feint layer swap | `feint`, `spin-leech-jab` | INFERENCE | Low |
| `brilliant-sun` | Brilliant Sun / Phantom Hurricane Attack (Valt) | Valtryek V2 | Gen3 | attack | 100 | Yes — power-thrust homage | `power-thrust` | INFERENCE | Low |
| `brutal-squall` | Brutal Squall | game_original_attack | Gen3 | attack | 100 | Yes — power-thrust dark burst | `power-thrust` | INFERENCE | Low |
| `radiant-thunder` | Radiant Thunder | game_original_attack | Gen3 | attack | 100 | Yes — power-thrust lightning | `power-thrust` | INFERENCE | Low |
| `venom-strike` | Venom Strike | Banish Fang Leone BD145CS | Gen2 | defense | 100 | Yes — guard-tap venom AoE | `guard-tap`, `feint` | INFERENCE (SS villain) | Low |
| `banish-strike` | Banish Strike | Banish Fang Leone BD145CS | Gen2 | defense | 150 | Yes — riposte ring-out | `riposte`, `guard-tap` | INFERENCE (SS villain) | Low |
| `l-drago-counter-stinger` | L-Drago Counter Stinger | L-Drago Destroy F:S | Gen2 | attack | 100 | Yes — riposte spin-steal counter | `riposte`, `spin-leech-jab` | INFERENCE | Medium |
| `dragon-emperor-supreme-flight` | Dragon Emperor Supreme Flight | L-Drago Destroy F:S | Gen2 | attack | 200 | Yes — power-thrust star-fragment | `power-thrust` | FACT (MFury finale) | High |

---

## Bey → Move + Combo Assignment Table

| Bey | specialMoveId | comboIds (max 3) | Type | Gen | Notes |
|-----|--------------|-----------------|------|-----|-------|
| Dragoon S | `storm-attack` | `quick-dash-r`, `quick-dash-l`, `power-thrust` | attack | Gen1 | Entry-level move; Phantom Hurricane belongs to S/F/V variants but GT is primary holder |
| Dragoon F | `phantom-hurricane` | `power-thrust`, `quick-dash-r`, `feint` | attack | Gen1 | Dragoon F's series role uses Phantom Hurricane |
| Dragoon V | `dragoon-typhoon` | `power-thrust`, `quick-dash-r`, `quick-dash-l` | attack | Gen1 | Dragon Scream is secondary — Typhoon is the primary finisher |
| Dragoon V2 | `phantom-hurricane` | `power-thrust`, `pivot-strike`, `feint` | attack | Gen1 | V2 inherits Phantom Hurricane from V lineage |
| Dragoon G | `galaxy-storm` | `power-thrust`, `quick-dash-r`, `pivot-strike` | attack | Gen1 | Once-per-match finisher; Engine Gear discharge gated |
| Dragoon GT | `galaxy-turbo-twister` | `power-thrust`, `quick-dash-r`, `quick-dash-l` | attack | Gen1 | EG Turbo rubber tip burst; G-Rev signature move |
| Dranzer S | `flame-saber` | `pivot-strike`, `quick-dash-r`, `power-thrust` | attack | Gen1 | First phoenix move; arc saber |
| Dranzer F | `flame-saber` | `pivot-strike`, `quick-dash-r`, `feint` | attack | Gen1 | Same move inherited from S |
| Dranzer V | `spiral-survivor` | `guard-tap`, `riposte`, `pivot-strike` | defense | Gen1 | Dranzer V shifts to defensive spiral |
| Dranzer V2 | `spiral-survivor` | `guard-tap`, `riposte`, `feint` | defense | Gen1 | V2 inherits V's spiral defense |
| Dranzer G | `blazing-gigs` | `power-thrust`, `spin-leech-jab`, `pivot-strike` | balanced | Gen1 | Blazing Gigs Tempest is secondary; Gigs is primary |
| Dranzer GT | `blazing-gigs-tempest` | `feint`, `power-thrust`, `quick-dash-l` | balanced | Gen1 | Both moves listed in bey doc; Tempest is the upgraded primary; Reverse Zig-Zag is secondary |
| Driger S | `tiger-claw` | `power-thrust`, `quick-dash-r`, `quick-dash-l` | attack | Gen1 | Tiger Claw is the defining move |
| Driger F | `tiger-claw` | `power-thrust`, `quick-dash-r`, `feint` | attack | Gen1 | Inherited from S |
| Driger V | `tiger-claw` | `power-thrust`, `pivot-strike`, `quick-dash-r` | attack | Gen1 | Inherited, with pivot refinement |
| Driger V2 | `tiger-claw` | `power-thrust`, `quick-dash-r`, `pivot-strike` | attack | Gen1 | V2 keeps Tiger Claw |
| Driger G | `gatling-claw` | `power-thrust`, `quick-dash-r`, `pivot-strike` | attack | Gen1 | Upgraded to Gatling Claw with EG |
| Metal Driger / Driger MS | `driger-tiger-soul` | `power-thrust`, `quick-dash-r`, `riposte` | attack | Gen1 | HMS finisher upgrade |
| Draciel S | `fortress-defense` | `guard-tap`, `riposte`, `feint` | defense | Gen1 | Core defensive move |
| Draciel F | `fortress-defense` | `guard-tap`, `riposte`, `feint` | defense | Gen1 | Inherited |
| Draciel V | `fortress-defense` | `guard-tap`, `riposte`, `pivot-strike` | defense | Gen1 | Inherited |
| Draciel V2 | `fortress-defense` | `guard-tap`, `riposte`, `feint` | defense | Gen1 | Inherited |
| Master Draciel / Draciel MBD | `aqua-shield` | `guard-tap`, `riposte`, `spin-leech-jab` | defense | Gen1 | HMS upgrade |
| Galeon | `dark-lightning` | `quick-dash-r`, `quick-dash-l`, `power-thrust` | attack | Gen1 | Contact aura ring-out; primary move |
| Galeon 2 | `wild-claw` | `power-thrust`, `quick-dash-r`, `feint` | attack | Gen1 | Multi-claw variant |
| Galux | `shadow-fang` | `feint`, `quick-dash-r`, `pivot-strike` | attack | Gen1 | Stealth approach snap |
| Wolborg (original) | `ice-wall` | `guard-tap`, `feint`, `spin-leech-jab` | defense | Gen1 | Pre-Novae Rog directional shield |
| Wolborg 2 | `novae-rog` | `spin-leech-jab`, `guard-tap`, `feint` | stamina | Gen1 | Ice prison; once-per-match |
| Wolborg 4 | `novae-rog` | `spin-leech-jab`, `guard-tap`, `riposte` | stamina | Gen1 | Wolborg 4 is the strongest Wolborg; keeps Novae Rog |
| Trygle | `sky-strike` | `quick-dash-r`, `feint`, `pivot-strike` | attack | Gen1 | Sky Strike primary; Phantom Fire Shot secondary |
| Cyber Dragoon | `cyber-storm` | `power-thrust`, `feint`, `quick-dash-r` | attack | Gen1 | Clone of Phantom Hurricane; Reverse Storm secondary |
| Cyber Griffolyon | `black-excalibur` | `power-thrust`, `quick-dash-r`, `pivot-strike` | attack | Gen1 | Overhead cleave |
| Burning Kerberos | `volcano-ember` | `power-thrust`, `quick-dash-r`, `feint` | attack | Gen1 | Zone spawn lava |
| Sharkrash | `sharkrash-lateral` | `quick-dash-r`, `power-thrust`, `pivot-strike` | attack | Gen1 | Lateral shark tackle |
| Seaborg | `seaborg-tsunami-wave` | `power-thrust`, `feint`, `guard-tap` | attack | Gen1 | Wave push environmental |
| Seaborg 2 | `seaborg-tsunami-wave` | `power-thrust`, `feint`, `guard-tap` | attack | Gen1 | Inherited |
| Falborg S | `falborg-wind-attack` | `power-thrust`, `quick-dash-r`, `pivot-strike` | attack | Gen1 | Wind blade multi-strike |
| Falborg 2 | `stroblitz` | `power-thrust`, `pivot-strike`, `feint` | attack | Gen1 | Crushing single strike upgrade |
| Strata Dragoon V | `eternal-defense-spin` | `guard-tap`, `riposte`, `feint` | defense | Gen1 | Spin shield |
| Strata Dragoon G | `stardust-driver` | `quick-dash-r`, `power-thrust`, `pivot-strike` | attack | Gen1 | High-speed dragon rush |
| Griffolyon | `griffolyon-full-power` | `power-thrust`, `guard-tap`, `pivot-strike` | attack | Gen1 | Persistent damage buff |
| Yaryū | `eight-headed-dragon-strike` | `power-thrust`, `quick-dash-r`, `quick-dash-l` | attack | Gen1 | 8-axis convergence |
| Storm Pegasus 105RF | `starblast-attack` | `quick-dash-r`, `power-thrust`, `feint` | attack | Gen2 | Primary; Storm Bringer / Pegasus Tornado are secondary |
| Galaxy Pegasus W105R2F | `pegasus-star-booster-attack` | `quick-dash-r`, `power-thrust`, `pivot-strike` | attack | Gen2 | Galaxy Nova and Galaxy Turbo Twister are secondary |
| Big Bang Pegasis F:D | `super-cosmic-nova` | `power-thrust`, `quick-dash-r`, `pivot-strike` | attack | Gen2 | Big Bang Tornado is once-per-match secondary |
| Rock Leone 145WB | `lion-gale-force-wall` | `guard-tap`, `riposte`, `power-thrust` | defense | Gen2 | King Lion 100 Fang Fury is secondary offensive |
| Fang Leone 130W2D | `sand-storm-lion-gale-force-wall` | `guard-tap`, `riposte`, `feint` | defense | Gen2 | Upgraded Lion Gale with sand contact damage |
| Burn Fireblaze 135MS | `inferno-blast` | `power-thrust`, `quick-dash-r`, `feint` | attack | Gen2 | Pillar + lash; fire status |
| L-Drago Destroy F:S | `dragon-emperor-soaring-bite-strike` | `quick-dash-r`, `spin-leech-jab`, `riposte` | attack | Gen2 | Supreme Flight is secondary finisher; Counter Stinger is tertiary |
| Twisted Tempo | `solid-iron-wall` | `guard-tap`, `riposte`, `spin-leech-jab` | defense | Gen2 | Pure anchor defense |
| Hades Kerbecs BD145DS | `grand-deucalion` | `power-thrust`, `guard-tap`, `feint` | attack | Gen2 | Stadium-wide finisher |
| Dark Bull H145SD | `bull-uppercut` | `power-thrust`, `pivot-strike`, `quick-dash-r` | attack | Gen2 | Vertical launch opponent |
| Jade Jupiter S130RB | `grand-maelstrom` | `feint`, `guard-tap`, `spin-leech-jab` | attack | Gen2 | Lightning AoE DoT |
| Death Quetzalcoatl | `eyes-of-medusa` | `spin-leech-jab`, `feint`, `guard-tap` | stamina | Gen2 | Paralysis + spin steal |
| Flash Sagittario 230WD | `diving-arrow` | `quick-dash-r`, `feint`, `pivot-strike` | attack | Gen2 | Shooting-star dive from 230 height |
| Flame Libra T125ES | `tightrope-dive` | `spin-leech-jab`, `feint`, `guard-tap` | stamina | Gen2 | Ridge-ride stamina recovery |
| Phantom Kerbeus | `kerbeus-howl` | `feint`, `guard-tap`, `spin-leech-jab` | stamina | Gen2 | AoE stun control debuff |
| Banish Fang Leone BD145CS | `banish-strike` | `riposte`, `guard-tap`, `feint` | defense | Gen2 | Banish is primary; Venom Strike is secondary |
| Cho-Z Achilles | `turbo-awakening` | `power-thrust`, `riposte`, `guard-tap` | attack | Gen3 | Threshold-gated; Turbo Sword and Turbo Counter Break are secondary. Omega Blast requires Turbo Awakening active |
| Drain Fafnir 8 Nothing | `drain-spin` | `spin-leech-jab`, `feint`, `guard-tap` | stamina | Gen3 | Passive always-on; Nothing Break is secondary |
| Mirage Fafnir Nothing 2S | `vanish-fafnir-spin-steal` | `spin-leech-jab`, `guard-tap`, `feint` | stamina | Gen3 | Sustained passive drain variant |
| Spryzen Requiem 0 Zeta | `requiem-spin` | `spin-leech-jab`, `feint`, `pivot-strike` | stamina | Gen3 | Bidirectional passive; Counter Break secondary |
| Spriggan Requiem | `requiem-whip` | `pivot-strike`, `spin-leech-jab`, `feint` | balanced | Gen3 | Arc sweep; dual-spin advantage |
| Genesis Valtryek 6V Reboot | `genesis-reboot` | `feint`, `quick-dash-r`, `spin-leech-jab` | attack | Gen3 | Rubber velocity snap; Reboot is secondary |
| Valtryek V2 | `v-temptation` | `quick-dash-r`, `feint`, `pivot-strike` | attack | Gen3 | Homage hop; Brilliant Sun / Reboot secondary |
| Brave Valkyrie Evolution' 2A | `brave-flash` | `quick-dash-r`, `power-thrust`, `pivot-strike` | attack | Gen3 | Wall orbit; Brave Sword is secondary |
| Dread Phoenix 10 Friction | `dread-cannon` | `quick-dash-r`, `pivot-strike`, `power-thrust` | attack | Gen3 | Ricochet armor; Dread Break secondary |
| Revive Phoenix 10 Friction | `revive-crush` | `pivot-strike`, `quick-dash-r`, `power-thrust` | attack | Gen3 | Pincer timing; Auto-Resurrect is passive secondary |
| Prime Apocalypse 0D Reboot' | `prime-reboot` | `feint`, `quick-dash-r`, `power-thrust` | attack | Gen3 | Rubber velocity snap clone |
| Guilty Longinus Karma Metal Destroy-2 | `guilty-smash` | `quick-dash-r`, `power-thrust`, `spin-leech-jab` | attack | Gen3 | Overhead; Guilty Upper is secondary |
| Lucius Endbringer Kou Drift | `final-limit-breaker` | `guard-tap`, `riposte`, `feint` | defense | Gen3 | Ring split + burst reflect |
| Lightning Pandora QF | `lightning-crush` | `quick-dash-r`, `pivot-strike`, `power-thrust` | attack | Gen3 | Upper deck airborne |
| Dynamite Belial Nexus Venture-2 | `dynamite-burst` | `power-thrust`, `quick-dash-r`, `pivot-strike` | attack | Gen3 | Heavy dark finisher |
| Kaiser Kerbeus LP | `kerbeus-howl` | `feint`, `guard-tap`, `riposte` | stamina | Gen3 | Burst-era howl variant |
| Union Achilles R | `turbo-counter-break` | `riposte`, `power-thrust`, `guard-tap` | attack | Gen3 | Superking absorb-discharge |
| Rage Longinus D3A | `guilty-upper` | `power-thrust`, `pivot-strike`, `spin-leech-jab` | attack | Gen3 | Left-spin upper launch; Guilty Smash upgraded |
| Variant Lucifer M2D | `final-limit-breaker` | `guard-tap`, `riposte`, `spin-leech-jab` | defense | Gen3 | Left-spin zombie defense |
| Prominence Phoenix TMU10 | `solar-eclipse` | `power-thrust`, `quick-dash-r`, `feint` | attack | Gen3 | Solar stadium finisher |
| Ultimate Valkyrie LV9 | `brave-sword` | `power-thrust`, `pivot-strike`, `quick-dash-r` | attack | Gen3 | Triple blade smash |
| DranSword 3-60F | `crescent-judgment` | `quick-dash-r`, `pivot-strike`, `power-thrust` | attack | Gen4 | Arc exit; standard Xtreme Dash base |
| PhoenixWing 9-60GF | `solar-explosion` | `quick-dash-r`, `power-thrust`, `feint` | attack | Gen4 | Fire burst exit |
| HellsScythe | `emperor` | `power-thrust`, `quick-dash-r`, `feint` | attack | Gen4 | Highest single-hit exit damage |
| Aero Pegasus | `cosmo` | `quick-dash-r`, `feint`, `pivot-strike` | attack | Gen4 | Extended post-rail speed |
| LeonClaw 5-60P | `crescent-judgment` | `quick-dash-r`, `pivot-strike`, `feint` | balanced | Gen4 | Mode-flex; Xtreme Dash capable in Attack mode |
| HelmKnight | `emperor` | `power-thrust`, `guard-tap`, `riposte` | defense | Gen4 | Defense-rail variant |
| ScytheIncendio | `solar-explosion` | `quick-dash-r`, `power-thrust`, `feint` | attack | Gen4 | Fire incendiary rail exit |

---

## Missing Owner Analysis

The following moves from phase-02 have no single canonical linka-documented owner bey and are assigned placeholder IDs:

| Move ID | Assigned Placeholder | Reason |
|---------|---------------------|--------|
| `spiral-dimension` | `game_original_attack` | Team combo move (Bladebreakers × 4) — no single owner; requires formation system not in scope |
| `spring-cannon` | `game_original_attack` | Generic spring-driver class move; no canonical named bey in linka |
| `thunder-attack` | `game_original_attack` | Generic lightning-element variant; Storm Pegasus receives Storm Bringer/Starblast instead |
| `hyper-flux` | `game_original_attack` | Burst Rise era shared power state — no single owner bey documented in linka |
| `air-knight-vertical-volcanic` | `game_original_attack` | Air Knight (Dante) — not in linka beys index |
| `pillar-dive` | `game_original_attack` | Generic HyperSphere-class bey; no specific bey in linka |
| `sparking` | `game_original_attack` | All SuperKing beys passive — no single assignable owner |
| `glimmering-stars` | `game_original_attack` | Astral Spriggan (Lui) — not in current linka index |
| `solar-eclipse` | `game_original_attack` | Hyperion Cosmo (Phi) — not in current linka index; assigned to Prominence Phoenix instead |
| `yamata-no-orochi` | `game_original_attack` | UX-line dragon beys — not individually documented |
| `dragonic-break-x` | `game_original_attack` | Cobalt Drake / Cobalt Dragoon — not in linka index |
| `giant-breaching` | `game_original_attack` | TyrannoBeat — not in linka index |
| `infinite` | `game_original_attack` | Generic X-bey sustained rail — no single owner |
| `max` | `game_original_attack` | UX-line speed beys — no single owner |
| `spell-of-the-end` | `game_original_attack` | CX-line antagonist beys — not in linka index |
| `double-universe` | `game_original_attack` | Dual-mode X beys — no single owner |
| `naked-pulse` | `game_original_stamina` | Naked Spriggan (Lui) — not in linka index |
| `brutal-squall` | `game_original_attack` | Brutal Lúinor — not in linka index |
| `radiant-thunder` | `game_original_attack` | Lain (Lúinor) — not in linka index |
| `brilliant-sun` | `valtryek-v2` | Assigned to Valtryek V2 as secondary (V-Force homage) |
| `dread-phoenix-auto-resurrect` | `game_original_stamina` | Revive Phoenix spiritual — passive gate; Revive Phoenix has Revive Crush as primary |
| `zeus-barrier` | `game_original_defense` | 4-bey formation combo — no single owner |

---

## Engine Config: beyblade_stats Updates Needed

The following JSON snippets describe the `specialMoveId` and `comboIds` fields that must be set on each bey document in the `beyblade_stats` Firestore collection. All moves reference IDs that must exist in the `special_moves` collection (seeded from `server/constants/specialMoves.ts` extended per Phase 02 config skeletons).

```jsonc
// ── GEN 1 PLASTIC ERA ─────────────────────────────────────────────────────

{ "beyId": "dragoon-s",    "specialMoveId": "storm-attack",             "comboIds": ["quick-dash-r", "quick-dash-l", "power-thrust"] }
{ "beyId": "dragoon-f",    "specialMoveId": "phantom-hurricane",        "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "dragoon-v",    "specialMoveId": "dragoon-typhoon",          "comboIds": ["power-thrust", "quick-dash-r", "quick-dash-l"] }
{ "beyId": "dragoon-v2",   "specialMoveId": "phantom-hurricane",        "comboIds": ["power-thrust", "pivot-strike", "feint"] }
{ "beyId": "dragoon-g",    "specialMoveId": "galaxy-storm",             "comboIds": ["power-thrust", "quick-dash-r", "pivot-strike"] }
{ "beyId": "dragoon-gt",   "specialMoveId": "galaxy-turbo-twister",     "comboIds": ["power-thrust", "quick-dash-r", "quick-dash-l"] }
{ "beyId": "dranzer-s",    "specialMoveId": "flame-saber",              "comboIds": ["pivot-strike", "quick-dash-r", "power-thrust"] }
{ "beyId": "dranzer-f",    "specialMoveId": "flame-saber",              "comboIds": ["pivot-strike", "quick-dash-r", "feint"] }
{ "beyId": "dranzer-v",    "specialMoveId": "spiral-survivor",          "comboIds": ["guard-tap", "riposte", "pivot-strike"] }
{ "beyId": "dranzer-v2",   "specialMoveId": "spiral-survivor",          "comboIds": ["guard-tap", "riposte", "feint"] }
{ "beyId": "dranzer-g",    "specialMoveId": "blazing-gigs",             "comboIds": ["power-thrust", "spin-leech-jab", "pivot-strike"] }
{ "beyId": "dranzer-gt",   "specialMoveId": "blazing-gigs-tempest",     "comboIds": ["feint", "power-thrust", "quick-dash-l"] }
{ "beyId": "driger-s",     "specialMoveId": "tiger-claw",               "comboIds": ["power-thrust", "quick-dash-r", "quick-dash-l"] }
{ "beyId": "driger-f",     "specialMoveId": "tiger-claw",               "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "driger-v",     "specialMoveId": "tiger-claw",               "comboIds": ["power-thrust", "pivot-strike", "quick-dash-r"] }
{ "beyId": "driger-v2",    "specialMoveId": "tiger-claw",               "comboIds": ["power-thrust", "quick-dash-r", "pivot-strike"] }
{ "beyId": "driger-g",     "specialMoveId": "gatling-claw",             "comboIds": ["power-thrust", "quick-dash-r", "pivot-strike"] }
{ "beyId": "driger-ms",    "specialMoveId": "driger-tiger-soul",        "comboIds": ["power-thrust", "quick-dash-r", "riposte"] }
{ "beyId": "draciel-s",    "specialMoveId": "fortress-defense",         "comboIds": ["guard-tap", "riposte", "feint"] }
{ "beyId": "draciel-f",    "specialMoveId": "fortress-defense",         "comboIds": ["guard-tap", "riposte", "feint"] }
{ "beyId": "draciel-v",    "specialMoveId": "fortress-defense",         "comboIds": ["guard-tap", "riposte", "pivot-strike"] }
{ "beyId": "draciel-v2",   "specialMoveId": "fortress-defense",         "comboIds": ["guard-tap", "riposte", "feint"] }
{ "beyId": "draciel-mbd",  "specialMoveId": "aqua-shield",              "comboIds": ["guard-tap", "riposte", "spin-leech-jab"] }
{ "beyId": "galeon",       "specialMoveId": "dark-lightning",            "comboIds": ["quick-dash-r", "quick-dash-l", "power-thrust"] }
{ "beyId": "galeon-2",     "specialMoveId": "wild-claw",                "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "galux",        "specialMoveId": "shadow-fang",              "comboIds": ["feint", "quick-dash-r", "pivot-strike"] }
{ "beyId": "wolborg",      "specialMoveId": "ice-wall",                 "comboIds": ["guard-tap", "feint", "spin-leech-jab"] }
{ "beyId": "wolborg-2",    "specialMoveId": "novae-rog",                "comboIds": ["spin-leech-jab", "guard-tap", "feint"] }
{ "beyId": "wolborg-4",    "specialMoveId": "novae-rog",                "comboIds": ["spin-leech-jab", "guard-tap", "riposte"] }
{ "beyId": "trygle",       "specialMoveId": "sky-strike",               "comboIds": ["quick-dash-r", "feint", "pivot-strike"] }
{ "beyId": "cyber-dragoon","specialMoveId": "cyber-storm",              "comboIds": ["power-thrust", "feint", "quick-dash-r"] }
{ "beyId": "cyber-griffolyon","specialMoveId": "black-excalibur",       "comboIds": ["power-thrust", "quick-dash-r", "pivot-strike"] }
{ "beyId": "burning-kerberos","specialMoveId": "volcano-ember",         "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "sharkrash",    "specialMoveId": "sharkrash-lateral",        "comboIds": ["quick-dash-r", "power-thrust", "pivot-strike"] }
{ "beyId": "seaborg",      "specialMoveId": "seaborg-tsunami-wave",     "comboIds": ["power-thrust", "feint", "guard-tap"] }
{ "beyId": "seaborg-2",    "specialMoveId": "seaborg-tsunami-wave",     "comboIds": ["power-thrust", "feint", "guard-tap"] }
{ "beyId": "falborg-s",    "specialMoveId": "falborg-wind-attack",      "comboIds": ["power-thrust", "quick-dash-r", "pivot-strike"] }
{ "beyId": "falborg-2",    "specialMoveId": "stroblitz",                "comboIds": ["power-thrust", "pivot-strike", "feint"] }
{ "beyId": "strata-dragoon-v","specialMoveId": "eternal-defense-spin",  "comboIds": ["guard-tap", "riposte", "feint"] }
{ "beyId": "strata-dragoon-g","specialMoveId": "stardust-driver",       "comboIds": ["quick-dash-r", "power-thrust", "pivot-strike"] }
{ "beyId": "griffolyon",   "specialMoveId": "griffolyon-full-power",    "comboIds": ["power-thrust", "guard-tap", "pivot-strike"] }
{ "beyId": "yaryu",        "specialMoveId": "eight-headed-dragon-strike","comboIds": ["power-thrust", "quick-dash-r", "quick-dash-l"] }

// ── GEN 2 METAL FIGHT BEYBLADE ────────────────────────────────────────────

{ "beyId": "storm-pegasus-105rf",  "specialMoveId": "starblast-attack",                  "comboIds": ["quick-dash-r", "power-thrust", "feint"] }
{ "beyId": "galaxy-pegasus-w105r2f","specialMoveId": "pegasus-star-booster-attack",       "comboIds": ["quick-dash-r", "power-thrust", "pivot-strike"] }
{ "beyId": "big-bang-pegasis-fd",  "specialMoveId": "super-cosmic-nova",                 "comboIds": ["power-thrust", "quick-dash-r", "pivot-strike"] }
{ "beyId": "rock-leone-145wb",     "specialMoveId": "lion-gale-force-wall",              "comboIds": ["guard-tap", "riposte", "power-thrust"] }
{ "beyId": "fang-leone-130w2d",    "specialMoveId": "sand-storm-lion-gale-force-wall",   "comboIds": ["guard-tap", "riposte", "feint"] }
{ "beyId": "burn-fireblaze-135ms", "specialMoveId": "inferno-blast",                     "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "l-drago-destroy-fs",   "specialMoveId": "dragon-emperor-soaring-bite-strike","comboIds": ["quick-dash-r", "spin-leech-jab", "riposte"] }
{ "beyId": "twisted-tempo",        "specialMoveId": "solid-iron-wall",                   "comboIds": ["guard-tap", "riposte", "spin-leech-jab"] }
{ "beyId": "hades-kerbecs-bd145ds","specialMoveId": "grand-deucalion",                   "comboIds": ["power-thrust", "guard-tap", "feint"] }
{ "beyId": "dark-bull-h145sd",     "specialMoveId": "bull-uppercut",                     "comboIds": ["power-thrust", "pivot-strike", "quick-dash-r"] }
{ "beyId": "jade-jupiter-s130rb",  "specialMoveId": "grand-maelstrom",                   "comboIds": ["feint", "guard-tap", "spin-leech-jab"] }
{ "beyId": "death-quetzalcoatl",   "specialMoveId": "eyes-of-medusa",                    "comboIds": ["spin-leech-jab", "feint", "guard-tap"] }
{ "beyId": "flash-sagittario-230wd","specialMoveId": "diving-arrow",                     "comboIds": ["quick-dash-r", "feint", "pivot-strike"] }
{ "beyId": "flame-libra-t125es",   "specialMoveId": "tightrope-dive",                    "comboIds": ["spin-leech-jab", "feint", "guard-tap"] }
{ "beyId": "phantom-kerbeus",      "specialMoveId": "kerbeus-howl",                      "comboIds": ["feint", "guard-tap", "spin-leech-jab"] }
{ "beyId": "banish-fang-leone-bd145cs","specialMoveId": "banish-strike",                "comboIds": ["riposte", "guard-tap", "feint"] }

// ── GEN 3 BURST ERA ───────────────────────────────────────────────────────

{ "beyId": "cho-z-achilles",        "specialMoveId": "turbo-awakening",           "comboIds": ["power-thrust", "riposte", "guard-tap"] }
{ "beyId": "drain-fafnir-8-nothing","specialMoveId": "drain-spin",                "comboIds": ["spin-leech-jab", "feint", "guard-tap"] }
{ "beyId": "mirage-fafnir-nothing-2s","specialMoveId": "vanish-fafnir-spin-steal","comboIds": ["spin-leech-jab", "guard-tap", "feint"] }
{ "beyId": "spryzen-requiem-0-zeta","specialMoveId": "requiem-spin",              "comboIds": ["spin-leech-jab", "feint", "pivot-strike"] }
{ "beyId": "spriggan-requiem",      "specialMoveId": "requiem-whip",              "comboIds": ["pivot-strike", "spin-leech-jab", "feint"] }
{ "beyId": "genesis-valtryek-6v-reboot","specialMoveId": "genesis-reboot",        "comboIds": ["feint", "quick-dash-r", "spin-leech-jab"] }
{ "beyId": "valtryek-v2",           "specialMoveId": "v-temptation",              "comboIds": ["quick-dash-r", "feint", "pivot-strike"] }
{ "beyId": "brave-valkyrie-e2a",    "specialMoveId": "brave-flash",               "comboIds": ["quick-dash-r", "power-thrust", "pivot-strike"] }
{ "beyId": "dread-phoenix-10-friction","specialMoveId": "dread-cannon",           "comboIds": ["quick-dash-r", "pivot-strike", "power-thrust"] }
{ "beyId": "revive-phoenix-10-friction","specialMoveId": "revive-crush",          "comboIds": ["pivot-strike", "quick-dash-r", "power-thrust"] }
{ "beyId": "prime-apocalypse-0d-reboot","specialMoveId": "prime-reboot",          "comboIds": ["feint", "quick-dash-r", "power-thrust"] }
{ "beyId": "guilty-longinus-kmd2",  "specialMoveId": "guilty-smash",              "comboIds": ["quick-dash-r", "power-thrust", "spin-leech-jab"] }
{ "beyId": "lucius-endbringer-kou-drift","specialMoveId": "final-limit-breaker",  "comboIds": ["guard-tap", "riposte", "feint"] }
{ "beyId": "lightning-pandora-qf",  "specialMoveId": "lightning-crush",           "comboIds": ["quick-dash-r", "pivot-strike", "power-thrust"] }
{ "beyId": "dynamite-belial-nv2",   "specialMoveId": "dynamite-burst",            "comboIds": ["power-thrust", "quick-dash-r", "pivot-strike"] }
{ "beyId": "kaiser-kerbeus-lp",     "specialMoveId": "kerbeus-howl",              "comboIds": ["feint", "guard-tap", "riposte"] }
{ "beyId": "union-achilles-r",      "specialMoveId": "turbo-counter-break",       "comboIds": ["riposte", "power-thrust", "guard-tap"] }
{ "beyId": "rage-longinus-d3a",     "specialMoveId": "guilty-upper",              "comboIds": ["power-thrust", "pivot-strike", "spin-leech-jab"] }
{ "beyId": "variant-lucifer-m2d",   "specialMoveId": "final-limit-breaker",       "comboIds": ["guard-tap", "riposte", "spin-leech-jab"] }
{ "beyId": "prominence-phoenix-tmu10","specialMoveId": "solar-eclipse",           "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "ultimate-valkyrie-lv9", "specialMoveId": "brave-sword",               "comboIds": ["power-thrust", "pivot-strike", "quick-dash-r"] }

// ── GEN 4 BEYBLADE X ─────────────────────────────────────────────────────

{ "beyId": "dransword-3-60f",   "specialMoveId": "crescent-judgment",  "comboIds": ["quick-dash-r", "pivot-strike", "power-thrust"] }
{ "beyId": "phoenixwing-9-60gf","specialMoveId": "solar-explosion",    "comboIds": ["quick-dash-r", "power-thrust", "feint"] }
{ "beyId": "hellsscythe",       "specialMoveId": "emperor",            "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "aero-pegasus",      "specialMoveId": "cosmo",              "comboIds": ["quick-dash-r", "feint", "pivot-strike"] }
{ "beyId": "leonclaw-5-60p",    "specialMoveId": "crescent-judgment",  "comboIds": ["quick-dash-r", "pivot-strike", "feint"] }
{ "beyId": "helmknight",        "specialMoveId": "emperor",            "comboIds": ["power-thrust", "guard-tap", "riposte"] }
{ "beyId": "scytheincendio",    "specialMoveId": "solar-explosion",    "comboIds": ["quick-dash-r", "power-thrust", "feint"] }

// ── GAME-ORIGINAL PLACEHOLDERS ────────────────────────────────────────────
// These use the engine type-default from DEFAULT_TYPE_TO_MOVE.
// When game-original beys are given permanent IDs, replace "game_original_*"
// with the actual beyId and assign the specific move below.

{ "beyId": "game_original_attack_1",  "specialMoveId": "yamata-no-orochi",       "comboIds": ["power-thrust", "quick-dash-r", "quick-dash-l"] }
{ "beyId": "game_original_attack_2",  "specialMoveId": "spell-of-the-end",       "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "game_original_attack_3",  "specialMoveId": "double-universe",        "comboIds": ["quick-dash-r", "power-thrust", "pivot-strike"] }
{ "beyId": "game_original_attack_4",  "specialMoveId": "infinite",               "comboIds": ["quick-dash-r", "feint", "power-thrust"] }
{ "beyId": "game_original_attack_5",  "specialMoveId": "giant-breaching",        "comboIds": ["power-thrust", "quick-dash-r", "pivot-strike"] }
{ "beyId": "game_original_attack_6",  "specialMoveId": "dragonic-break-x",       "comboIds": ["quick-dash-r", "quick-dash-l", "power-thrust"] }
{ "beyId": "game_original_attack_7",  "specialMoveId": "hyper-flux",             "comboIds": ["power-thrust", "pivot-strike", "quick-dash-r"] }
{ "beyId": "game_original_attack_8",  "specialMoveId": "air-knight-vertical-volcanic","comboIds": ["quick-dash-r", "power-thrust", "feint"] }
{ "beyId": "game_original_attack_9",  "specialMoveId": "brutal-squall",          "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "game_original_attack_10", "specialMoveId": "radiant-thunder",        "comboIds": ["power-thrust", "pivot-strike", "feint"] }
{ "beyId": "game_original_attack_11", "specialMoveId": "solar-eclipse",          "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "game_original_attack_12", "specialMoveId": "glimmering-stars",       "comboIds": ["feint", "power-thrust", "quick-dash-r"] }
{ "beyId": "game_original_attack_13", "specialMoveId": "sparking",               "comboIds": ["power-thrust", "quick-dash-r", "feint"] }
{ "beyId": "game_original_attack_14", "specialMoveId": "pillar-dive",            "comboIds": ["quick-dash-r", "feint", "power-thrust"] }
{ "beyId": "game_original_attack_15", "specialMoveId": "max",                    "comboIds": ["quick-dash-r", "power-thrust", "feint"] }
{ "beyId": "game_original_stamina_1", "specialMoveId": "naked-pulse",            "comboIds": ["feint", "spin-leech-jab", "guard-tap"] }
{ "beyId": "game_original_stamina_2", "specialMoveId": "dread-phoenix-auto-resurrect","comboIds": ["spin-leech-jab", "guard-tap", "feint"] }
{ "beyId": "game_original_defense_1", "specialMoveId": "zeus-barrier",           "comboIds": ["guard-tap", "riposte", "feint"] }
{ "beyId": "game_original_attack_spring","specialMoveId": "spring-cannon",       "comboIds": ["quick-dash-r", "feint", "pivot-strike"] }
{ "beyId": "game_original_attack_thunder","specialMoveId": "thunder-attack",     "comboIds": ["power-thrust", "feint", "quick-dash-r"] }
```

---

## Cross-Reference Notes

### Moves Shared Across Multiple Beys

Some move IDs appear on multiple beys in the same evolutionary line. This is intentional — lineage beys share physics patterns. The engine resolves this by each bey having its own `specialMoveId` field; multiple beys pointing to the same move ID is valid.

| Move ID | Shared By | Justification |
|---------|-----------|---------------|
| `phantom-hurricane` | Dragoon F, Dragoon V2 | Same pillar mechanic, inherited |
| `tiger-claw` | Driger S/F/V/V2 | Core Driger identity move across all plastic variants |
| `fortress-defense` | Draciel S/F/V/V2 | Core Draciel identity move across all plastic variants |
| `spiral-survivor` | Dranzer V/V2 | Dranzer V defensive evolution |
| `lion-gale-force-wall` | Rock Leone 145WB | Same bey; secondary move `king-lion-100-fang-fury` not listed separately |
| `novae-rog` | Wolborg 2, Wolborg 4 | Both Tala-era beys; same ice prison |
| `seaborg-tsunami-wave` | Seaborg, Seaborg 2 | Same pilot, same wave move |
| `flame-saber` | Dranzer S, Dranzer F | Same phoenix saber arc |
| `kerbeus-howl` | Phantom Kerbeus, Kaiser Kerbeus LP | Kerbeus line howl debuff |
| `final-limit-breaker` | Lucius Endbringer, Variant Lucifer | Both Lucius-line DB beys |
| `emperor` | HellsScythe, HelmKnight | Heavy exit-strike Gen4 pattern |
| `crescent-judgment` | DranSword, LeonClaw | Both capable of Xtreme Dash arc exit |
| `solar-explosion` | PhoenixWing, ScytheIncendio | Fire burst exit Gen4 |
| `brave-sword` | Brave Valkyrie E2A, Ultimate Valkyrie LV9 | Valkyrie triple-blade evolution |

### Moves Where Phase-02 Lists Duplicate Entries

Phase-02 includes `Galaxy Turbo Twister` in both Batch 2A (Dragoon GT, Gen1) and Batch 2C (Galaxy Pegasus W105R2F, Gen2 named `galaxy-turbo-twister-g2`). These are **distinct moves** with the same name applied to different generations:

- `galaxy-turbo-twister` → Dragoon GT (Gen1, Engine Gear, twister)
- `galaxy-turbo-twister-g2` → Galaxy Pegasus (Gen2, multi-vector stellar vortex) — this is better differentiated as `galaxy-pegasus-vortex` in the engine to avoid collision

Similarly, `Fire Execution` appears in both Batch 2A and Batch 2B. The single canonical entry is in Batch 2A (Dranzer G/GT); Batch 2B is a cross-reference. Only one `fire-execution` ID is needed.

### powerCost vs Phase-02 permille Scale

Phase-02 config skeletons use `powerCost` on a 0–1500+ permille scale (e.g. `phantomHurricane.powerCost = 700`). The simplified tier in this document maps as follows for `beyblade_stats` display and engine activation:

| Phase-02 permille | This doc tier | Engine activation |
|------------------|---------------|------------------|
| 0 | 0 (passive) | Threshold/passive gate |
| 1–500 | 50 (light) | Low power draw |
| 500–800 | 100 (standard) | Normal charge threshold |
| 800–1200 | 150 (heavy) | High charge required |
| 1200+ | 200 (ultimate) | Maximum charge; once-per-match flag typical |

---

## Unresolved / Deferred

| Item | Status | Reason |
|------|--------|--------|
| `spiral-dimension` (team finisher) | UNRESOLVABLE without multi-bey formation system | Requires `requiresFormation` architecture (P3 from phase-02 mechanics list) |
| `zeus-barrier` (team formation) | UNRESOLVABLE without multi-bey formation | Same |
| Gen4 beys not in linka (Cobalt Drake, TyrannoBeat, etc.) | UNKNOWN owner | linka index incomplete for full UX/CX X-line |
| Burst Rise era beys (Hyper-Flux source beys) | UNKNOWN owner | No Rise-era beys documented in linka |
| `sparking` bar accumulation passive | IMPLEMENTATION BLOCKED | Needs `sparkingBarChargePerSecond` system not yet in engine |
| `turbo-awakening` turboPowerThreshold | IMPLEMENTATION BLOCKED | Needs `turboPowerThreshold` + `permanent` flag; noted P2 in phase-02 |
| `dread-phoenix-auto-resurrect` | IMPLEMENTATION BLOCKED | Needs `autoResurrect` passive gate; noted P3 in phase-02 |


---

## Implementation Status (audit 2026-05-24)

> **Complete** — Reference mapping. `BeybladeStats.specialMoveId` field exists; seed scripts set defaults per archetype.

---

[← Phase 02: Special Moves](phase-02-special-moves.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 04: Combo Mapping →](phase-04-combo-mapping.md)

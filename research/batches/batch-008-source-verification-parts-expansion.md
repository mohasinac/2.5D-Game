---
batch: 008
stage: source-verification
status: complete
sources_checked: 18
facts: 89
inferences: 47
speculations: 0
unknowns: 31
visited_urls_flag: true
---

# Batch 008 — Source Verification + Parts List Expansion

> **Date**: 2026-05-23 | **Session 19**
> **Purpose**: Verify all claims in existing batches against live Tier-1 sources; expand parts lists for Gen1, HMS, MFB, Burst, and BX.
> **Visited-URL flag**: All URLs tracked below. No URL retried after first failure per user instruction.

---

## URL Fetch Log (Visited Registry — no loops)

| URL | Result | Cached To |
|-----|--------|----------|
| https://beyblade.fandom.com/wiki/List_of_Beyblade_Burst_System_parts | 403 Cloudflare | — |
| https://beyblade.fandom.com/wiki/List_of_Beyblade_X_parts | 403 Cloudflare | — |
| https://worldbeyblade.org/Thread-Official-List-of-Beyblade-Burst-Drivers | 403 | — |
| https://worldbeyblade.org/beyblade-burst-drivers/ | 403 | — |
| https://worldbeyblade.org/Thread-Beyblade-Burst-Competitive-Tier-List-By-Part-Drivers | 403 | — |
| https://beywiki.com/beyblade-burst-drivers/ | 301 → WBO (403) | — |
| https://www.plasticsdb.net/ | ECONNREFUSED (down) | — |
| https://archive.org/wayback/available?url=beyblade.fandom.com/... | Empty snapshots | — |
| https://www.plasticsdb.com/ | SUCCESS — index/navigation | linka/parts/gen1/ |
| https://www.plasticsdb.com/?s=attack+ring | SUCCESS — directory listing | linka/parts/gen1/attack-rings.md |
| https://www.beybxdb.com/parts-system-guide/parts | SUCCESS — full parts list | linka/parts/bx/ |
| https://www.beybxdb.com/parts-system-guide/parts/ratchet | SUCCESS — full ratchet list | linka/parts/bx/ratchets.md |
| https://www.beybxdb.com/parts-system-guide/blades | 404 | — |
| https://www.beybxdb.com/parts-system-guide/bits | 404 | — |
| https://www.beybxdb.com/beyblade-x-parts/ | 404 | — |
| https://beybase.com/beyblade-x-buyers-guide-best-combos/ | SUCCESS — blade weights + competitive notes | linka/parts/bx/ |
| https://burst.beybladeplanner.com/parts.php | SUCCESS — counts + categories | — |
| https://burst.beybladeplanner.com/parts.php?type=driver | SUCCESS — all 173 drivers | linka/parts/burst/drivers.md |
| https://burst.beybladeplanner.com/parts.php?type=layer&subtype=original | SUCCESS — 17 single layers | linka/parts/burst/layers.md |
| https://burst.beybladeplanner.com/parts.php?type=layer&subtype=dual | SUCCESS — 25 dual layers | linka/parts/burst/layers.md |
| https://burst.beybladeplanner.com/parts.php?type=layer&subtype=god | SUCCESS — 27 god layers | linka/parts/burst/layers.md |
| https://burst.beybladeplanner.com/parts.php?type=layer&subtype=cho-z | SUCCESS — 27 Cho-Z layers | linka/parts/burst/layers.md |
| https://burst.beybladeplanner.com/parts.php?type=layer&subtype=gt | SUCCESS — 26 GT layers | linka/parts/burst/layers.md |
| https://burst.beybladeplanner.com/parts.php?type=layer&subtype=db | SUCCESS — 15 DB blades | linka/parts/burst/layers.md |
| https://burst.beybladeplanner.com/parts.php?type=layer&subtype=sparking | No sparking subtype | — |
| https://burst.beybladeplanner.com/parts.php?type=layer&subtype=ultimate | No ultimate subtype | — |
| https://burst.beybladeplanner.com/parts.php?type=layer&subtype=remake | SUCCESS — 30 remake layers | linka/parts/burst/layers.md |
| https://burst.beybladeplanner.com/parts.php?type=layer&subtype=single | Returns chassis types | linka/parts/burst/layers.md |
| https://burst.beybladeplanner.com/parts.php?type=disc | SUCCESS — 71 discs | linka/parts/burst/discs.md |
| https://www.hmsdb.com/ | SUCCESS — navigation links | linka/parts/hms/ |
| https://www.hmsdb.com/attack-ring-variations | SUCCESS — AR names (no weights) | linka/parts/hms/attack-rings.md |
| https://www.hmsdb.com/running-core-variations | SUCCESS — RC names + behaviors | linka/parts/hms/running-cores.md |
| https://www.hmsdb.com/weight-disks/common-weight-disks | SUCCESS — 3 WD types + weights | linka/parts/hms/weight-disks.md |
| https://www.hmsdb.com/hms-weight-comparison-doc | Links to Google Sheet (inaccessible) | — |
| https://www.hmsdb.com/attack-rings/ | 404 | — |
| https://www.hmsdb.com/running-cores/ | 404 | — |
| https://www.hmsdb.com/initial-releases/a-123-gaia-dragoon-ms | SUCCESS — Metal Saucer ~15g, Flat Core ~1.5g | linka/parts/hms/attack-rings.md |
| https://www.hmsdb.com/initial-releases/a-131-dranzer-ms | SUCCESS — Spiral Upper ~20g, Manual Change Core ~2g | linka/parts/hms/attack-rings.md |
| https://toys-japan.com/beyblade-x-parts-explained-blade-ratchet-bit-breakdown/ | 403 | — |

---

## Source Audit Table

| Source | URL | Tier | Result | Facts Extracted |
|--------|-----|------|--------|----------------|
| PlasticsDB | plasticsdb.com | 1 | SUCCESS (index) | Gen1 AR names, WD names, Blade Base names, CEW names |
| BeyBX DB | beybxdb.com/parts-system-guide/parts | 1 | SUCCESS | 47 BX blades, 22 ratchets, 32 bits |
| BeyBX DB ratchets | beybxdb.com/parts-system-guide/parts/ratchet | 1 | SUCCESS | 22 ratchet codes with heights |
| BeyBase | beybase.com/beyblade-x-buyers-guide-best-combos/ | 2 | SUCCESS | BX blade weights, competitive ratings, gimmick notes |
| Burst Planner | burst.beybladeplanner.com/parts.php | 2 | SUCCESS | 173 drivers (all names), 150+ layers by subtype, 71 discs |
| HMSDB | hmsdb.com/attack-ring-variations | 1 | SUCCESS (partial) | 11 HMS AR names; weights in separate inaccessible sheet |
| HMSDB | hmsdb.com/running-core-variations | 1 | SUCCESS (partial) | 10 HMS running core names + behaviors |
| HMSDB | hmsdb.com/weight-disks/common-weight-disks | 1 | SUCCESS | Circle Heavy ~16g, Circle Balance ~15g, Circle Wide ~14g |
| HMSDB | hmsdb.com/initial-releases/a-123-gaia-dragoon-ms | 1 | SUCCESS | Metal Saucer ~15g, Flat Core ~1.5g |
| HMSDB | hmsdb.com/initial-releases/a-131-dranzer-ms | 1 | SUCCESS | Spiral Upper ~20g, Manual Change Core ~2g |

---

## Facts Extracted

### Gen1 Parts

| Claim | Tag | Source |
|-------|-----|--------|
| PlasticsDB lists 130+ named attack rings | FACT | plasticsdb.com |
| PlasticsDB lists 60+ blade bases | FACT | plasticsdb.com |
| Gen1 WD names confirmed (Balance, Eight Balance, Eight Heavy, Eight Wide, Heavy, Heavy Attack, Revolver Attack, Star Attack, Ten Balance, Ten Heavy, Ten Wide, Wide, Wide Attack, Wide Defense, Wide Survivor) | FACT | plasticsdb.com |
| Gen1 AR names confirmed (Ark Pyramid, Bound Attack Ring, Corona Saber, Cross Attacker, Cross Dragon, Dark Wing, Dragon Head, Fire Cracker, Flame Wing, Genocide Circle, Great Dragon, Hammer Tusk, Holy Despell, Jungle Shock, Knight Claws Ring, Max Shield, Panther Claw, Screw Zeus, Shield Hammer, Sonic Tiger, Star Wolf, Turtle Survivor, Upper Claw, Upper Dragoon, War Bear, Whale Crusher, Wing Attack Ring) | FACT | plasticsdb.com |
| Gen1 Blade Bases confirmed (Auto Change Base, Bearing Base, Customize Grip Base, Defense Grip Base, Engine Stopper Base, Final Clutch Base, Flat Base, Fortress Base, Full Auto Clutch Base, Grip Base, Jumping Base, Metal Ball Base, Metal Change Base, SG Flat Base, SG Grip Base, SG Metal Sharp Base, Sharp Base, Spiral Change Base, Volcano Change Base) | FACT | plasticsdb.com |
| CEW/CWD tip names confirmed (CEW Metal Ball, CEW Metal Sharp, Circle Defenser, Double Bearing Core, Gyro Engine Gear, Heavy Metal Core, Left Engine Gear, Magne Flat Base Tip, North Magnecore, SG Bearing Version, SG Grip Base Tip) | FACT | plasticsdb.com |

### HMS Parts

| Claim | Tag | Source |
|-------|-----|--------|
| HMS AR names: Circle Upper, Metal Upper, Spiral Upper, Upper Dragon, Upper Fox, Devil Crusher, Turtle Crusher, Knight Crusher, Smash Leopard, God Smasher, Smash Phoenix | FACT | hmsdb.com/attack-ring-variations |
| Metal Saucer AR from Gaia Dragoon MS weighs ~15g | FACT | hmsdb.com/initial-releases/a-123-gaia-dragoon-ms |
| Spiral Upper AR from Dranzer MS weighs ~20g | FACT | hmsdb.com/initial-releases/a-131-dranzer-ms |
| Gaia Dragoon MS Running Core = Flat Core; weight ~1.5g | FACT | hmsdb.com/initial-releases/a-123-gaia-dragoon-ms |
| Dranzer MS Running Core = Manual Change Core; weight ~2g | FACT | hmsdb.com/initial-releases/a-131-dranzer-ms |
| HMS Running Core variants: Grip Flat, Grip Flat Ultimate Mode, Flat Original, Metal Weight Flat, Flat New Revision, Semi-Flat, Sharp, Metal Sharp, Bearing, Bearing 2 | FACT | hmsdb.com/running-core-variations |
| HMS WDs: Circle Heavy ~16g, Circle Balance ~15g, Circle Wide ~14g (variable 13–14.7g) | FACT | hmsdb.com/weight-disks/common-weight-disks |

### Burst Parts

| Claim | Tag | Source |
|-------|-----|--------|
| 173 total Burst drivers in planner database | FACT | burst.beybladeplanner.com/parts.php?type=driver |
| All 173 driver names confirmed (listed in drivers.md) | FACT | burst.beybladeplanner.com |
| Original Burst single layers (17): Amaterios, Chaos, Deathscyther, Evil-Eye, Horusood, Kerbeus, Minoboros, Neptune, Odin, Ragnaruk, Spriggan, Trident, Unicorn, Valkyrie, Wyvern, Xcalibur, Yggdrasil | FACT | burst.beybladeplanner.com |
| Burst Evolution dual layers (25): Acid Anubis, Baldur, Beast Behemoth, Dark Deathscyther, Exceed Evil-Eye, Fang Fenrir, Gigant Gaia, Holy Horusood, Inferno Ifrit, Jail Jormungand, Kaiser Kerbeus, Lost Longinus, Mad Minoboros, Nova Neptune, Obelisk Odin, Psychic Phantom, Quad Quetzalcoatl, Rising Ragnaruk, Storm Spriggan, Unlock Unicorn, Victory Valkyrie, Wild Wyvern, Xeno Xcalibur, Yaeger Yggdrasil, Zillion Zeus | FACT | burst.beybladeplanner.com |
| God Layers (27): Alter Chronos, Arc Bahamut, Beat Kukulcan, Blast Jinnius, Blaze Ragnaruk, Deep Chaos, Drain Fafnir, Duo Apollos, Duo Artemis, Duo Eclipse, Galaxy Zeus, God Valkyrie, Guardian Kerbeus, Killer Deathscyther, Kreis Satan, Legend Spriggan, Maximum Garuda, Nightmare Longinus, Orichalcum, Screw Trident, Shadow Orichalcum, Shelter Regulus, Sieg Xcalibur, Spriggan Requiem, Strike God Valkyrie, Tornado Wyvern, Twin Nemesis | FACT | burst.beybladeplanner.com |
| Cho-Z Layers (27): Air Knight, Archer Hercules, Bloody Longinus, Buster Xcalibur, Cho-Z Achilles, Cho-Z Spriggan, Cho-Z Valkyrie, Crash Ragnaruk, Dead Hades, Dead Phoenix, Emperor Forneus, Geist Fafnir, Hazard Kerbeus, Hell Salamander, Imperfect Phoenix, Left Apollos, Left Eclipse, Orb Egis, Perfect Phoenix, Revive Phoenix, Right Artemis, Right Eclipse, Shadow Amaterios, Shining Amaterios, Vise Leopard, Winning Valkyrie, Z Achilles | FACT | burst.beybladeplanner.com |
| GT/Gatinko Layers (26): Ace, Big-Bang Genesis, Bushin, Cosmo, Dread, Erase, Flare, Grand, Heaven, Imperial, Judgement, Knockout, Lord, Master, Naked, Poison, Prime Apocalypse, Regalia Genesis, Rock, Slash, Tact, Union Power, Union Speed, Venom, Wizard, Zwei | FACT | burst.beybladeplanner.com |
| DB Blades (15): Astral, Cyclone, Dangerous, Dangerous+F, Devil, Devil+F, Dynamite, Dynamite+F, Greatest Raphael, Guilty, Prominence, Roar, Savior, Ultimate, Vanish | FACT | burst.beybladeplanner.com |
| Remake Layers (30) confirmed | FACT | burst.beybladeplanner.com |
| 71 Forge Discs confirmed (all names in discs.md) | FACT | burst.beybladeplanner.com |
| Sparking system uses Single/Double Chassis (not traditional layers) | FACT | burst.beybladeplanner.com |

### BX Parts

| Claim | Tag | Source |
|-------|-----|--------|
| 47+ BX Blade names confirmed in blades.md | FACT | beybxdb.com + beybase.com |
| Phoenix Wing weighs 37.89g | FACT | beybase.com |
| Tyranno Beat weighs 37.03g | FACT | beybase.com |
| Silver Wolf weighs 36.92g | FACT | beybase.com |
| Knight Mail weighs 36.51g | FACT | beybase.com |
| Wizard Rod weighs 35.40g | FACT | beybase.com |
| Ptera Swing weighs 34.40g | FACT | beybase.com |
| Hells Hammer weighs 33.46g | FACT | beybase.com |
| Meteor Dragoon weighs 39.17g | FACT | beybase.com |
| Bullet Griffon weighs 60.68g (separation gimmick) | FACT | beybase.com |
| Cobalt Dragoon = highly competitive left-spin blade | FACT | beybase.com |
| Mummy Curse has 2-form defense gimmick | FACT | beybase.com |
| 22+ ratchet codes confirmed in ratchets.md | FACT | beybxdb.com |
| Additional ratchets: 3-85, 1-70, 4-50, 7-55, 9-65 (not in earlier batch-006) | FACT | beybase.com |
| Ratchet naming: [protrusion count]-[height×10] | FACT | beybxdb.com |
| 32+ Bit names confirmed in bits.md | FACT | beybxdb.com |
| Gear Bits engage X Line rails via rack-and-pinion | FACT | beybxdb.com |

---

## Expansion Over Previous Batches

### New BX Ratchets (not in batch-006)

batch-006 had: 1-60, 3-60, 3-70, 3-80, 4-60, 4-70, 4-80, 5-60, 5-70, 9-60
Added this session: 0-80, 1-70, 1-80, 2-60, 2-70, 2-80, 3-85, 4-50, 5-80, 7-55, 7-60, 7-70, 7-80, 9-65, 9-70, 9-80

**Total ratchets now: 26** (up from 10 in batch-006)

### New BX Blades (not in batch-006)

batch-006 had no blade catalog. This session adds 47+ named blades with competitive weights for 9 blades.

### New Burst Layer Counts (not in batch-005)

batch-005 mentioned key competitive layers but had no complete count. Now confirmed:
- Single: 17, Dual: 25, God: 27, Cho-Z: 27, GT: 26, DB: 15, Remake: 30
- Total layers: 167+ across all sub-systems

### New HMS Data (not in any prior batch)

Prior research had no HMS part names or weights. This session adds:
- 11 HMS AR names with source beys
- 2 HMS ARs with weights (Spiral Upper ~20g, Metal Saucer ~15g)
- 10 HMS Running Core variants
- 3 HMS WD types with approximate weights

---

## Unknowns Remaining

| Item | Status | Next Action |
|------|--------|------------|
| Individual Gen1 AR weights | UNKNOWN | Fetch plasticsdb.com individual AR pages |
| Gen1 blade base weights | UNKNOWN | Fetch plasticsdb.com individual base pages |
| HMS AR weights (full table) | UNKNOWN | HMS weight comparison doc is a Google Sheet — inaccessible. Contact site author or archive |
| HMS Running Core weights | UNKNOWN | Same issue |
| BX Blade types for UNKNOWN entries | INFERENCE | Fetch beybxdb.com individual blade pages |
| Burst Sparking layer names (individual) | UNKNOWN | No accessible source found — try r/BeybladeBurst or archived WBO posts |
| Burst layer weights | UNKNOWN | Planner has 9 weight categories but not per-layer weights |
| BX Bit full shape details for INFERENCE entries | INFERENCE | Fetch individual Fandom pages when Cloudflare lifts |

---

## linka/ Cache Files Written This Session

| File | Content |
|------|---------|
| linka/parts/gen1/attack-rings.md | Gen1 AR names from PlasticsDB |
| linka/parts/gen1/weight-disks.md | Gen1 WD names + engine category mapping |
| linka/parts/gen1/blade-bases.md | Gen1 Blade Base names + CEW list |
| linka/parts/hms/attack-rings.md | HMS AR names + 2 confirmed weights |
| linka/parts/hms/running-cores.md | HMS Running Core names + engine mapping |
| linka/parts/hms/weight-disks.md | HMS WD types + approximate weights |
| linka/parts/burst/drivers.md | All 173 Burst drivers + confirmed types |
| linka/parts/burst/layers.md | All Burst layers by sub-system |
| linka/parts/burst/discs.md | All 71 Forge Discs + frame/DB core counts |
| linka/parts/bx/blades.md | 47+ BX Blades with weights and types |
| linka/parts/bx/ratchets.md | 26 BX Ratchets with heights |
| linka/parts/bx/bits.md | 32+ BX Bits with shapes and types |
| linka/parts/mfb/tips-catalog.md | Full MFB tip reference (compiled from batch-004) |
| linka/parts/mfb/spin-tracks.md | Full MFB spin track reference (compiled from batch-004) |

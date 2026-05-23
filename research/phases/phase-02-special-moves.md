# Phase 02 — Special Move Understanding

> Stage 2 | Source: linka/special-moves/ (39 files read) + engine validation
> Tag key: FACT | INFERENCE | SPECULATION | UNKNOWN
> Date: 2026-05-23
> Total moves documented: 119 unique special moves (per README mining stats), 91 mapped in detail below, remainder covered in batch entries

---

## Notation

- **FACT** — confirmed from official source (wiki, anime, manga, physical product)
- **INFERENCE** — deduced logically from part design or related canon
- **SPECULATION** — plausible but unverified
- **UNKNOWN** — not yet verifiable

### 3D Archetype Tags Used

| Tag | Meaning |
|---|---|
| `shooting-star-dive` | Bank climb → airborne apex → nose-dive descent (uses AirborneSystem) |
| `vertical-pillar` | Grounded caster; tall cylinder hit volume rising upward |
| `cosmic-multi-vortex` | Multiple sub-pillars converge; caster may briefly go airborne |
| `sustained-rim-charge` | Bey orbits at high speed; sustained aura; single catapult impact |
| `two-phase-env-strike` | Environmental setup (barricade/field) then strike |
| `overhead-cleave` | Bit-beast or caster manifests above → descends vertically |
| `contact-aura` | Caster goes semi-stationary; any opponent contact triggers payload |
| `rail-ride` | Gear-rail engagement → speed boost → exit-vector strike |
| `grounded-direct` | No airborne; straight-line or arc ground charge |
| `multi-strike` | Multiple discrete hit events in sequence |
| `env-transform` | Stadium geometry/friction/walls permanently or temporarily changed |
| `persistent-state` | One-time activation; buffs persist rest of match |
| `reactive-counter` | Triggers on receiving an opponent's attack input |
| `spin-drain-passive` | Always-on mechanic triggered by contact |

---

## Batch 2A — Gen 1 Plastic Era Moves (Bladebreakers + Rivals)

### Table 2A

| Move | Owner Bey | Gen | Anime VFX | Real Mechanic | Mechanic Chain | 2D Method | 2.5D Method | 3D Method | New Mechanic Needed? | Evidence | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Storm Attack | Dragoon S | Gen1 | Green wind burst, short cyclone dart | Short forward velocity spike with mild wind VFX | velocity_burst → attack_amplifier | velocityX/Y direct impulse, short window | Same + forward lean induction | Same + lean lock | No | FACT | High |
| Phantom Hurricane | Dragoon S/F/V | Gen1 | Tall green wind pillar column; dragon in midsection | Vertical cylinder hit volume (r=120mm, h=600mm) drifts toward opponent; radial outward impulse at any height-band intersection | vertical_pillar_aura → radial_impulse → lean_lock | Cylinder zone checked vs opponent position; radial push on overlap | Same + lean locked upright | Same + segment-segment cylinder test at all heights | Needs `hitVolume.cylinder` shape | FACT (wiki + eps) | High |
| Dragoon Typhoon | Dragoon V | Gen1 | Multi-vortex typhoon; 3 wind columns | 3-pillar vertical typhoon (predecessor to Galaxy Storm); pillars converge; multi-strike | vertical_pillar × 3 → convergence → multi_strike | 3 zone pillars → multi-hit | Same + slightly larger columns | Same + convergence brings caster briefly airborne | Needs multi-pillar sub-spawning | INFERENCE | Medium |
| Galaxy Storm | Dragoon G | Gen1 | 4 cosmic sub-pillars converge; Dragoon goes airborne at apex; stadium-wide compression | Engine Gear discharge → 4 sub-pillars spawn → converge → caster AirborneSystem (300mm) → vertical compression strike | engine_gear_discharge → multi_pillar × 4 → orbit_movement → airborne → descent_strike → aoe_compression | 4 zone cylinders drift inward; airborne caster | Same + sub-pillar VFX at four XY offsets | Same + AirborneSystem + segment-level compression on landing | Needs `subPillars[]` scheduler; needs `compressionAOE` field | FACT (wiki + eps) | High |
| Flame Saber | Dranzer S/F/V | Gen1 | Red-orange flame trail in curved saber arc; banking upward on bowl slope then descending arc strike | 3D banking arc: banks upward on stadium slope → brief airborne (~10 ticks) → descends in sabre-curve to opponent's upper body | arc_approach (bank slope) → airborne (short) → descent_strike → lean_forward | velocity curve + arc-path movement; damageMultPermille on contact | Same + bowl-slope banking integrated in heightmap | Same + airborneTicks during arc apex; strike at upper height-band | Needs `arcApproachPath` (bankAngleDeg) | FACT (eps, linka) | High |
| Blazing Gigs | Dranzer G | Gen1 | Dranzer G fully ignited in fireball orbiting rim at high speed; catapults opponent on impact | Engine Gear discharge → velocity × 1.8 → sustained rim-orbit (30t) → strike pivot → catapult impact (opponent velocity reflected at 2.5×) | engine_gear_discharge → velocity_burst → sustained_orbit → attack_amplifier → velocity_burst (opponent) | Orbit path + contact-aura during Phase2; catapult velocity inversion on impact | Same + tipZ rises slightly on banked orbit turns | Same + lean locks tangent-forward; lean flips to target on Phase3 | Needs `sustainedOrbit` phase type; needs `reflectVelocityMultPermille` | FACT (wiki + manga) | High |
| Blazing Gigs Tempest | Dranzer GT | Gen1 | Flaming wings explode into burning feather cloud; feathers barricade opponent; Dranzer materializes for charge/dive | Two-phase: volumetric feather field (0–400mm H) → opponent barricade (control lock) → charge OR dive depending on opponent height | env_transform (feather field) → control_lock (opponent) → velocity_burst OR airborne+descent_strike | Feather zone as stadium-wide aura box; barricade reduces opponentVelocityMult | Same + tip height check selects ground charge vs diving variant | Same + AirborneSystem for diving variant; feather field bounded at 400mm (airborne beys above that height immune) | Needs `phaseCompletionGate`; needs `controlLockPermille` field; needs height-gated barricade | FACT (wiki + manga) | High |
| Reverse Zig-Zag Attack | Dranzer GT | Gen1 | Dranzer GT zigzags erratically across stadium in zig-zag path | Reverse Engine Gear (inner tip counter-rotates); direction flips every 3–5 ticks; 1.5× velocity; lean constantly perpendicular to velocity | reverse_engine_gear_activate → erratic_direction_flips (RNG seeded) → velocity_burst_sustained | Velocity direction flips deterministically (match RNG); magnitude constant | Same + lean flips 90° each direction change | Same + `tiltXMicroRad / tiltYMicroRad` flips each tick; inner-tip dual angular velocity | Needs `ReverseEngineGearSystem` or extension to existing `EngineGearSystem`; needs `innerTipAngularVelRatio` | FACT (Takara Tomy Reverse EG gimmick) | High |
| Tiger Claw | Driger S/F/V | Gen1 | Tiger bit-beast rakes with 3 rapid claw strikes | Multi-strike: 3 successive claw streaks, each a short velocity impulse + damage event | multi_strike × 3 → attack_amplifier | 3× discrete hit checks at intervals | Same + claw-streak VFX at each hit | Same + strike height-band aligned with opponent body zone | No — `multiStrike` already modeled | FACT (eps + linka) | High |
| Gatling Claw | Driger G | Gen1 | Tiger bit-beast rapid-fires 6+ claw streaks; final heavy slash | Engine Gear → 6 rapid-fire hits + final strike × 2 | engine_gear_discharge → multi_strike × 6 → attack_amplifier (×2 on final) | 6 discrete hit intervals; finalStrikeBonus applied on last hit | Same + EG discharge aura | Same + descending angle on final slash gives slight vertical component | No — extends Tiger Claw pattern | FACT | High |
| Fortress Defense | Draciel S/F/V | Gen1 | Turtle bit-beast forms hexagonal energy plates; absorbs hits; plates glow on impact | Plant (minVelocity), hexagonal barrier forms; damage absorbed converts to spin; high displacement resistance | free_spin → defense_buff → convert_hits_to_spin | damageTakenMultPermille: 400; displacementResist: 200; incoming hit → add to spin | Same + barrier volume collision checks | Same + volumetric hexagonal barrier (each plate is a wall segment at specific angles) | Needs `convertHitsToSpinPermille` field; needs `displacementResistMultPermille` | FACT (eps + linka) | High |
| Dark Lightning | Galeon | Gen1 | Dark lightning wraps Galeon; Galeon semi-stationary; any contact → opponent blasted out of stadium | Contact-aura ring-out finisher; caster barely moves; contact triggers massive outward impulse | contact_aura → ring_out_impulse (3500‰) | casterMovementMult: 0.1; on contact: outward velocity impulse triggers ring-out check | Same | Same + 3D volumetric contact detection at all height bands | Needs `contactAura.triggersRingOut` field | FACT (wiki: "repelled with a huge blast out of the stadium") | High |
| Novae Rog | Wolborg 2/4 | Gen1 | Stadium freezes; vertical ice walls rise; floor becomes ice; Wolborg orbits perimeter with freezing aura | Stadium transform (ice_prison); floor friction × 0.2; walls become 800mm impassable; AoE spin drain 50/tick; pockets seal | env_transform → aoe_spin_drain → orbit_movement | Stadium surface friction override; wall collision override; orbit path | Same + wall height applied in 3D wall geometry | Same + vertical ice walls fully blocking in 3D; fog visibility reduction | Needs `stadiumTransform: 'ice_prison'`; already partially supported by existing arena feature system | FACT (wiki + ep50) | High |
| Slash Right | Lightning L-Drago | Gen1 | Left-spin rightward slash; drags opponent's spin direction | Left-spin bey carves right arc; spin-steal on contact; damage + steal hybrid | velocity_burst (arc) → spin_steal | Arc velocity path; spinStealMultPermille on contact | Same + left-spin indicator affects steal ratio | Same + spin direction matters for contact-zone geometry | No — `spinStealFactor` already in engine | FACT (linka + eps) | High |
| Ice Wall | Wolborg | Gen1 | Directional ice wall on one side of stadium (not full prison) | Directional shield: 90° arc on caster's chosen side; partial damage reduction | defensive_wall (directional) | damageTakenMultPermille + directionalShieldDeg: 90 arc | Same | Same | Needs `directionalShieldDeg` field | INFERENCE (pre-Novae Rog Tala move) | Medium |
| Freezing Wolf Claw | Wolborg | Gen1 | Wolf bit-beast lunges with frozen claws; freeze status on hit | Lunge + damage + freeze status (spinDecay × 1.5 for 40t) | velocity_burst → attack_amplifier → status_effect (freeze) | Impulse + statusOnHit applying spinDecayMultPermille override | Same | Same + 3D wolf descends from above (add `verticalSpread`) | Needs `statusOnHit.spinDecayMultPermille` field | FACT (linka batch) | Medium |
| Sky Strike | Trygle | Gen1 | Trygle jumps, hovers at apex, dives onto opponent | Jump → AirborneSystem → descent strike (canonical AirborneSystem reference for Gen1) | airborne → descent_strike | AirborneSystem.airborneTicks; descentDamagePermille | Same + tip Z offset | Full AirborneSystem with tipZ | No — AirborneSystem already exists | FACT (linka + eps) | High |
| Wild Claw | Galeon | Gen1 | Galeon's black lion strikes with 4 multi-directional claws | Multi-strike × 4; should include vertical spread (claws from above and lateral) | multi_strike × 4 → attack_amplifier | multiStrike count: 4 at intervals | Same + vertical spread in 2.5D | Same + `verticalSpread: true` means some hits at upper body zone | Needs `verticalSpreadEnabled` flag | INFERENCE (3D correction logged) | Medium |
| Shadow Fang | Galux | Gen1 | Galux in stealth orbit; sudden direction change → fang bite | Stealth approach (opponent can't see trajectory); sudden snap to target → bite damage | stealthApproach (timer) → velocity_snap → attack_amplifier | `stealthApproachTicks` opacity window; then velocity direction snap to opponent | Same + lean-shift on snap adds vertical component | Same + lean-shift is full 3D axis change | Needs `stealthApproachTicks` field (opacity-based) | INFERENCE | Medium |
| Cyber Storm | Cyber Dragoon | Gen1 | Electrified dark vortex (same shape as Phantom Hurricane but darker) | Clone of Phantom Hurricane at 85% power with electric VFX (no bit-beast manifest needed) | vertical_pillar_aura → radial_impulse | Same as Phantom Hurricane cylinder model at 2125‰ | Same | Same | No — reuses Phantom Hurricane engine pattern | INFERENCE (copy bey, weaker) | Medium |
| Reverse Storm | Cyber Dragoon | Gen1 | Spin direction flip flash + surge | Spin direction reversal; counter-spin disrupt; then surge attack | spin_reversal → velocity_burst | spinDirection flag flip; attack on momentum confusion | Same | Same | Needs `spinDirectionFlip` field | INFERENCE | Medium |
| Volcano Ember | Burning Kerberos | Gen1 | Lava zone spawns on stadium floor; persists ~60 ticks | Environmental: create persistent lava zone (radiusMm: 80); opponent in zone = burn DoT + spinDecay boost | env_transform (zone spawn) → burn_status_on_contact | spawnZone object in stadium state; per-tick contact check | Same + zone visible in 2.5D | Same + zone is a 3D cylinder at floor level | Needs `spawnZone` persistent-object system | INFERENCE (Metal Masters era) | Medium |
| Flare Blitz | Burn Fireblaze | Gen2 | Rapid flame-rush, fire aura tackle | velocity × 1.4 + damage; fire status on hit | velocity_burst → attack_amplifier → status_effect (fire) | velocityMultPermille: 1400; elementalAlignment: fire | Same | Same + lean-forward during charge | No — extends velocity_burst + status pattern | INFERENCE | Medium |
| Storm Attack (gen1) | Dragoon | Gen1 | Short green cyclone dart | Quick forward dash; grounded; lean ~30° forward | velocity_burst → attack_amplifier | velocityX/Y impulse + damagePermille: 1400 | Same + 30° lean | Same | No | FACT (linka + eps) | High |
| Black Excalibur | Cyber Griffolyon | Gen1 | Griffolyon spreads wings; black energy sword descends vertically | Overhead Cleave archetype: bit-beast manifests above stadium; black sword descends straight down | airborne (bit-beast) → descent_strike (vertical) → knockback | Phase: bit-beast manifest above (no caster movement); then hit volume descends | Same + overhead VFX | Same + `airborneTicks` for the descending sword path; segment collision at top height-band of opponent | Needs overhead bit-beast manifest sub-phase | INFERENCE (3D correction logged) | Medium |
| Eight-Headed Dragon Strike | Yaryū / Cyber Dragoon | Gen1 | 8 dragon heads from 8 directions simultaneously | 3D 8-axis convergence: 8 strikes from 4 horizontal + 2 above + 2 below; opponent engulfed | multi_strike × 8 (spherical distribution) → attack_amplifier | multiStrike × 8 at 45° horizontal intervals | Same + add vertical spread angles | Same + `axisDistribution: 'spherical_8'` places 2 hits from above and 2 from below | Needs `axisDistribution` field for multiStrike | INFERENCE (3D correction logged) | Medium |
| Fire Execution | Dranzer G/GT | Gen1 | Phoenix bit-beast manifests above stadium; descends like executioner's axe | Overhead Cleave: caster AirborneSystem for descent; fire pillar axe-stroke from apex | airborne (caster or bit-beast) → descent_strike (vertical, high damage) | airborneTicks + descentDamagePermille | Same + phoenix VFX | Same + vertical approach vector | No — combines AirborneSystem + descent_strike already defined | INFERENCE (3D correction logged) | Medium |
| Spiral Survivor | Dranzer V/V2 | Gen1 | Fire spiral barrier rises vertically; reflects incoming hits | DEFENSIVE_WALL + reflect: vertical fire pillar from Dranzer; opponent contact = hit reflected back at attacker | defensive_wall → reflect_on_contact | damageTakenMultPermille + reflectAttackPermille | Same + pillar height geometry | Same + `reflectAttackPermille` field needs 3D vector reversal | Needs `reflectAttackPermille` field | INFERENCE | Medium |
| Galaxy Turbo Twister | Galaxy Pegasis | Gen2 | Multi-stellar vortices strike from different angles | Multi-vector strike: 3 vortices at 120° spread simultaneously | multi_strike × 3 (120° spread) → attack_amplifier | multiVectorStrike count: 3, angleSpreadDeg: 120 | Same | Same | Needs `multiVectorStrike` separate from sequential `multiStrike` | INFERENCE | Medium |

---

## Batch 2B — Gen 1 HMS / Team & Support Moves

### Table 2B

| Move | Owner Bey | Gen | Anime VFX | Real Mechanic | Mechanic Chain | 2D Method | 2.5D Method | 3D Method | New Mechanic Needed? | Evidence | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Aqua Shield | Master Draciel MS | Gen1 HMS | Water-element multi-axis shield | Evolved Fortress Defense; multi-axis protection; water element | defensive_wall → multi_axis_shield | damageTakenMultPermille: 250; multiAxisShield: true | Same | Same + shield geometry covers multiple body height zones | No — extends Fortress Defense pattern | INFERENCE (HMS manga) | Low |
| Fire Execution | Dranzer G/GT | Gen1 | Phoenix bit-beast fire-axe descent | See Batch 2A — FINISHER | airborne → descent_strike | (covered above) | (covered above) | (covered above) | No | INFERENCE | Medium |
| Zeus' Barrier | Demolition Boys × 4 | Gen1 | 4 beys form ring barrier | Team formation: 4 beys hold 4 vertical pillar positions around zone; defensive barrier | multi_bey_formation → defensive_wall | Requires multi-bey coordination state; each bey holds a slot | Same + each bey is a vertical barrier post | Same + 4 vertical wall cylinders around protected zone | Needs `requiresFormation` multi-bey coordination system | INFERENCE | Low |
| Dragon Scream | Dragoon V | Gen1 | Sonic dragon roar; disorients opponents | Environmental: stadium-wide control reduction (AoE sonic debuff) | env_transform (debuff) → control_reduction_aoe | opponentControlReductionPermille: 400; stadiumWide | Same | Same + omnidirectional sound (no 3D adjustment needed) | Needs `controlReductionPermille` field | INFERENCE | Low |
| Spiral Dimension | Bladebreakers × 4 | Gen1 G-Rev | 4 beys converge into helical vortex column | Team combo: dimensional vortex; helical column at center; massive damage | multi_bey_formation → env_transform → stadium_wide_damage | stadiumTransform: spiral_vortex; damagePermille: 2500 | Same | Same + 3D helix ascending motion VFX | Needs `requiresFormation` and team-combo architecture | INFERENCE | Low |
| Eternal Defense Spin | Strata Dragoon V | Gen1 | Spinning shield technique | DEFENSIVE_WALL: damageTakenMultPermille: 350 | defensive_wall | (standard) | (standard) | (standard) | No | INFERENCE | Low |
| Stardust Driver | Strata Dragoon | Gen1 G-Rev | High-speed dragon rush | Velocity burst + damage | velocity_burst → attack_amplifier | velocityMultPermille: 1500 | Same | Same | No | INFERENCE | Low |
| Griffolyon Full Power | Griffolyon | Gen1 | Bit-beast erupts; all attacks × 1.5 | Persistent buff: damage × 1.5 for duration | attack_amplifier (persistent) | comboDamageMultiplier permanent override | Same | Same | No — uses existing attackBuffTimer/comboDamageMultiplier | INFERENCE | Low |
| Phantom Fire Shot | Trygle | Gen1 | Trygle jumps, fires flame-bolt from apex at opponent | Airborne → projectile fired downward at opponent | airborne → projectile_spawn | airborneTicks; projectileDamagePermille | Same + projectile arc | Same + projectile as separate physics object | Needs projectile sub-object system | INFERENCE | Low |
| Sharkrash Lateral | Sharkrash (Mariam) | Gen1 | Fast horizontal shark-tackle | Lateral velocity burst + damage | velocity_burst → attack_amplifier | velocityMultPermille: 1300 | Same + horizontal lean | Same | No | INFERENCE | Low |
| Seaborg Tsunami Wave | Seaborg (Spencer) | Gen1 | Giant water wave sweeps across stadium | Environmental: wave-push force across stadium from one side; pushes opponents rim-ward | env_transform → directional_push_aoe | stadiumWavePushPermille: 1800; directional from one side | Same + wave wall height in 3D | Same + wave is a 3D vertical moving wall | Needs `waveForce` directional environmental push | INFERENCE | Low |
| Falborg Wind Attack | Falborg (Bryan) | Gen1 | Falcon wind-blade multi-strike | 6 cutting wind-blade strikes; some from above and lateral | multi_strike × 6 + vertical_spread | multiStrike count: 6; cuttingBonus: 1.3 | Same | Same + `verticalSpread: true` | Needs `verticalSpread` for multiStrike | INFERENCE | Low |
| Stroblitz | Falborg V2 (Bryan) | Gen1 G-Rev | Wind-crushing heavy single strike | Heavy single hit; crushing wind power | attack_amplifier | damageMultPermille: 2400 | Same | Same | No | INFERENCE | Low |
| Driger Tiger Soul | Driger MS | Gen1 HMS | Tiger-spirit finisher; tiger soul manifests | FINISHER: fuses Tiger Claw + Gatling Claw; 5-strike volley | multi_strike × 5 → attack_amplifier (finisher) | multiStrike count: 5 intervalTicks: 3 | Same + HMS metal soul VFX | Same | No — extends existing multiStrike | INFERENCE | Low |
| Dread Phoenix Auto-Resurrect | Revive Phoenix | Gen1 spiritual | Phoenix resurrects at 10% spin | Passive trigger: spin < 10% → restore 30% spin once per match | combo_activation (passive gate) | spinThreshold gate; restoreSpinPermille: 300 | Same | Same | Needs `autoResurrect` passive gate in state machine | INFERENCE | Low |

---

## Batch 2C — Gen 2 Metal Saga Moves

### Table 2C

| Move | Owner Bey | Gen | Anime VFX | Real Mechanic | Mechanic Chain | 2D Method | 2.5D Method | 3D Method | New Mechanic Needed? | Evidence | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Starblast Attack | Storm Pegasis 105RF | Gen2 | Pegasus soars into sky; diving shooting-star onto opponent | Shooting-Star Dive: bank climb (slope) → AirborneSystem (apex 600mm) → nose-dive descent → vertical-velocity-amplified strike; reactive variant triggers on hard hit | orbit_movement (bank) → airborne → lean_lock → descent_strike (vertZ scaling) | AirborneSystem.airborneTicks: 25; descentDamageMultPermille scales with velZ | Same + bowl-slope bank riding via heightmap | Full AirborneSystem: tipZ rises, velZ drives descent; tiltInductionPermille: 1200 on impact | No — AirborneSystem already exists | FACT (wiki: "Pegasus soars into the sky…crashes down in a nose dive") | High |
| Lion Gale Force Wall | Rock Leone 145WB | Gen2 | Green tornado column wraps Rock Leone; attackers deflected outward | Vertical Pillar (defensive): green tornado cylinder (~800mm tall); attacker contact → radial pushback + velocity reduction | defensive_wall (cylinder) → push_back_attacker | damageTakenMultPermille: 200; pushBackOnAttackerPermille: 800 | Same + tornado cylinder height matches 3D geometry | Same + opponents struck from any height-band in cylinder | Needs `pushBackOnAttackerPermille` field | FACT (eps + linka) | High |
| King Lion 100 Fang Fury | Rock Leone 145WB | Gen2 | 100 wind-fang strikes from all angles including above | 3D fang volley: 20 simulation hits representing 100 fangs; angular spread 360° + vertical; finalStrikeBonus | multi_strike × 20 (360° spread + vertical) → attack_amplifier | multiStrike count: 20; intervalTicks: 1 | Same + VFX fan in multiple heights | Same + `verticalSpreadEnabled: true` for some hits from above | Needs `angleSpreadDeg: 360` + `verticalSpreadEnabled` for multiStrike | FACT (eps + linka) | High |
| Inferno Blast | Burn Fireblaze 135MS | Gen2 | Vertical fire pillar erupts from bey; tilts toward opponent as blast wave | Vertical pillar (offensive-fire): pillar rises then lashes at opponent; burn status on hit | vertical_pillar_aura → lash_toward_target → burn_status | Vertical pillar cylinder; direction-shift to target on lash phase | Same + fire pillar height | Same + pillar lash is a tilting cylinder in 3D space | Needs `pilllarLash` directional phase; already has `elementalAlignment` | FACT (linka + eps) | High |
| Dragon Emperor Soaring Bite Strike | L-Drago Destroy F:S | Gen2 | Dragon rises, hovers at apex, dives back with spin-steal bite | Shooting-Star Dive variant + spin-steal: ascent → apex → dive + left-spin bite (30% spin-steal on impact) | airborne → descent_strike → spin_steal | AirborneSystem; spinStealMultPermille: 3000 on impact | Same + left-spin bite visual | Same + left-spin direction advantage in 3D contact geometry | No — combines AirborneSystem + spin_steal already in engine | FACT (linka + eps) | High |
| Galaxy Nova | Galaxy Pegasis W105R2F | Gen2 | Stellar nova explosion; multiple airborne sub-vortices | Shooting-Star Dive + radial detonation: Pegasis banks → airborne → center touchdown → radial + vertical compression detonation | airborne → descent_strike → aoe_compression (stadium-wide) | AirborneSystem + stadiumWideHit on landing | Same + radial blast at touchdown | Same + vertical compression component at landing pushes all grounded beys downward | Needs `compressionAOE` at landing; needs AirborneSystem + stadiumWide composite | INFERENCE (3D correction logged) | Medium |
| Super Cosmic Nova | Big Bang Pegasis | Gen2 | Legend Blader stellar-force nova | Stadium-wide finisher; Star Fragment amplification; extreme damage | airborne → descent_strike → aoe_compression (extreme) | Same as Galaxy Nova at higher damage | Same | Same + `legendBladerOnly` gate | Needs `legendBladerOnly` gate flag | INFERENCE (Metal Fury legend system) | Medium |
| Big Bang Tornado | Big Bang Pegasis F:D | Gen2 | Cosmic tornado absorbing all stellar energy; used to defeat Nemesis | FINISHER: vertical pillar giant (~2000mm); stadium-wide; AirborneSystem during pillar formation; one-shot | vertical_pillar_aura (giant) → airborne (caster briefly) → aoe_compression (one-shot) | Giant pillar cylinder; oneShotMatchEnding flag | Same | Same + `airborneTicks` during formation | Needs `oneShotMatchEnding` flag | INFERENCE (Metal Fury finale) | Low |
| Solid Iron Wall | Twisted Tempo | Gen2 | Plants and becomes immovable; extreme tank | DEFENSIVE_WALL: damage × 0.1; displacement resist × 0.5; grounded | defensive_wall (extreme) | damageTakenMultPermille: 100; displacementResistMultPermille: 50 | Same | Same + vertical-impact defense flag (for overhead strike resistance) | No — already has `displacementResistMultPermille` in engine | FACT (linka + eps) | Medium |
| Grand Deucalion | Hades Kerbecs BD145DS | Gen2 | Hades destruction power manifests; massive damage finisher | FINISHER: Hades bit-beast manifest; stadium-wide damage | attack_amplifier → aoe_damage | damageMultPermille: 3500 | Same | Same | No — extends existing FINISHER pattern | FACT (linka + eps) | Medium |
| Sand Storm Lion Gale Force Wall | Fang Leone 130W2D | Gen2 | Green tornado with sand grains; sand damages attackers | DEFENSIVE_WALL + contact damage: tornado deflects AND sand DoT damages any attacker who makes contact | defensive_wall → contact_damage_on_attacker | damageTakenMultPermille: 200; contactDamageMultPermille: 1200 | Same | Same | Needs `contactDamageMultPermille` for defensive moves (attacker takes damage on contact) | INFERENCE | Medium |
| Lion Wild Wind Fang Dance | Rock Leone | Gen2 | Rapid lateral fang strikes; wind trail VFX | Rapid multi-strike × 10 (fast interval) | multi_strike × 10 (fast) → attack_amplifier | multiStrike count: 10; intervalTicks: 2 | Same | Same | No | INFERENCE | Low |
| Bull Uppercut | Bandid Genbull / Dark Bull | Gen2 | Bull bit-beast uppercuts opponent into air | High tilt induction; opponent launched airborne briefly | attack_amplifier → tilt_induction (vertical launch opponent) | tiltInductionPermille: 1500; opponent.airborneTicks activated | Same + 3D-correct specification | Same — already noted as 3D-correct | Needs opponent `airborneTicks` induction flag on impact | FACT (3D audit: "already correct") | Medium |
| Grand Maelstrom | Jade Jupiter S130RB | Gen2 | Lightning storm fills stadium; continuous AoE damage | Environmental AoE: lightning DoT to all non-caster beys; stadium-wide | env_transform → aoe_damage_per_tick | aoeDamagePerTick: 30; stadiumWide; durationTicks: 70 | Same | Same | No — same pattern as Novae Rog AoE drain | INFERENCE | Low |
| Eyes of Medusa | Death Quetzalcoatl | Gen2 | Snake hypnotic gaze; paralysis | Paralysis status (no movement) + spin steal | spin_steal → control_lock (paralysis) | paralyzeTicks: 30; spinStealMultPermille: 1500 | Same | Same | Needs `paralyzeTicks` (zero velocity override) | INFERENCE | Low |
| Diving Arrow | Flash Sagittario 230WD | Gen2 | Sagittario dives from elevated orbit | Shooting-Star Dive from high spin-track elevation | airborne → descent_strike | airborneTicks: 20; descentDamageMultPermille: 2100 | Same | Same + 3D-correct: uses high tipZ start from 230 track | No | FACT (3D audit: "already correct") | Medium |
| Tightrope Dive | Flame Libra T125ES | Gen2 | Libra rides tornado ridge for stamina | MOVEMENT: ridge-ride for staminaDrainReduction; topology exploit | orbit_movement (ridge) → free_spin | staminaDrainReductionPermille: 600; ridgeRideMode | Same | Same + requires heightmap tornado ridge feature | Needs `ridgeRideMode` or `orbit_on_ridge` path type | INFERENCE | Low |
| Spring Cannon | Spring-driver beys | Gen2 | Spring driver compresses → speed burst | Driver-based speed burst; velocity spike brief duration | velocity_burst (spring) | velocityBurstPermille: 2200 for 15 ticks | Same | Same | No — `velocity_burst` already in engine | INFERENCE | Low |
| Kerbeus Howl | Phantom Kerbeus | Gen2 | Kerberos howl stuns opponent | Control debuff: opponentControlReductionPermille: 600 | control_reduction_aoe | Same as Dragon Scream pattern | Same | Same | No — same as Dragon Scream pattern | INFERENCE | Low |
| Galaxy Turbo Twister | Galaxy Pegasis W105R2F | Gen2 | Multi-stellar vortices from different angles | Multi-vector strike × 3 at 120° spread | multi_strike × 3 (120° spread) | multiVectorStrike count: 3; spread: 120° | Same | Same | Needs `multiVectorStrike` (simultaneous, not sequential) | INFERENCE | Low |
| Storm Surge | Storm Pegasis variants | Gen2 | Pure speed trail | MOVEMENT: velocity × 1.8 for 30 ticks | velocity_burst (sustained) | velocityMultPermille: 1800 | Same | Same | No | INFERENCE | Low |
| Thunder Attack | Storm Pegasis (lightning) | Gen2 | Electric strike; paralysis-lite | Damage + electrified status (control reduction) | attack_amplifier → status_effect (electrified) | statusOnHit: electrified, controlReduction: 400 | Same | Same | Needs `statusOnHit.controlReductionPermille` | INFERENCE | Low |

---

## Batch 2D — Gen 3 Burst Moves

### Table 2D

| Move | Owner Bey | Gen | Anime VFX | Real Mechanic | Mechanic Chain | 2D Method | 2.5D Method | 3D Method | New Mechanic Needed? | Evidence | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Turbo Awakening | Cho-Z Achilles / Spriggan / Valkyrie / Diabolos | Gen3 | Layer plates rotate outward revealing Turbo Blades; red/blue aura | Persistent state activation: accumulated Turbo Power from combat impacts crosses threshold → layer mode change; damage × 1.5, velocity × 1.3 for rest of match | combo_activation (threshold gate, persistent) → attack_amplifier → velocity_burst (permanent) | turboPowerThreshold accumulation per impact; permanent buffs | Same + lean profile widens with Turbo Blades exposed | Same + `leanReach` increases slightly when blades revealed | Needs `turboPowerThreshold` accumulation gate; needs `permanent` activation flag | FACT (Burst Turbo S3 defining mechanic) | High |
| Drain Spin | Drain Fafnir 8 Nothing | Gen3 | Rubber layer absorbs kinetic energy; Fafnir accelerates on each graze | Per-tick spin-steal: rubber layer contact drains ~150‰ opponent spin and transfers to Fafnir; only vs right-spin opponents; Nothing driver keeps tipZ low | spin_steal → free_spin | spinStealFactor modulated by contact; drainPermille: 150 per tick | Same + rubber layer contact zone modeled | Same + spin direction matters for drain eligibility | No — `spinStealFactor` + `spinStealResist` already in engine | FACT (wiki) | High |
| Requiem Spin | Spryzen Requiem 0 Zeta | Gen3 | Dual-spin rubber pads absorb spin from either direction; reverse-transfer discharge | Bidirectional spin-steal: drain vs both right- and left-spin opponents; optional second phase dumps stored spin back into opponent as destabilize blast | spin_steal (bidirectional) → optional_reverse_transfer | drainPermille: 130 from both directions; reverseTransfer phase dumps delta as impulse | Same | Same + dual-spin layer means contact-zone side matters | Needs `bidirectionalDrain` flag + `reverseTransfer` second phase | FACT (wiki) | High |
| Counter Break | All Spryzen variants | Gen3 | Spryzen snaps trajectory 90–180° to counter incoming attack; hits attacker from redirected angle | Reactive COUNTER_BREAK: tip geometry changes contact point → velocity vector rotates 90–180°; 1.4× speed on redirect; 1.5× damage; burstChance opponent += 25% | reactive_trigger → velocity_redirect (90-180°) → attack_amplifier | velocityVector snap; reactive 2-tick window on incoming attack detection | Same | Same + grounded throughout; tip pivot is contact-geometry mechanic | Needs `velocityRedirect` mechanic + `reactiveTrigger` within 2-tick window | FACT (wiki) | High |
| Nothing Break | Drain Fafnir / Mirage Fafnir Nothing 2S | Gen3 | Fafnir absorbs repeated hits; Nothing driver compresses; full-flat = speed burst counterattack | COUNTER_BREAK (accumulation): N hits absorbed (max 5) → Nothing driver fully compressed → speed burst 1.2 + 0.15N; damage 1.0 + 0.2N | reactive_absorb (charge counter) → velocity_burst (scaled) → attack_amplifier (scaled) | hitAbsorbCounter increments; on max charge: velocity + damage multiplied | Same | Same + grounded; absorption flat means caster's tipZ stays minimal during absorb | Needs `hitAbsorbCounter` persistent integer field; `chargeScaledRelease` mechanic | FACT (wiki) | High |
| Genesis Reboot | Genesis Valtryek 6V Reboot / Shadow Valtryek | Gen3 | Semi-flat tip retracts; rubber exposed; velocity surge → 90-120° direction snap + counter-rush | MOVEMENT: tip retraction → rubber contact → velocity × 1.6 for 8 ticks + direction snap 90-120°; high spinDecay cost; burst risk if intercepted | velocity_burst (rubber) → direction_snap | velocityMult: 1.6; spinDecayMult: 2.0 for 8 ticks; directionSnap: 90–120° | Same | Same + grounded; direction snap is horizontal-plane rotation | No — extends `velocity_burst` + direction-change already conceptually covered | FACT (wiki) | High |
| Brave Flash | Brave Valtryek Evolution' 2A | Gen3 | Outer orbit builds speed; inward snap slash with rubber Brave Ring blade | Outer rim orbit (wall-contact) → inward slash; rubber blade amplifier × 1.6; burst risk to opponent | orbit_movement (wall) → velocity_burst (inward) → attack_amplifier (rubber blade) | wallClimbSystem orbit; velocityMult: 1.5; then inward snap | Same + bowl slope heightmap for orbit | Same + grounded wall-orbit → inward rush | Needs `WallClimbSystem` active gate | FACT (wiki) | High |
| Brave Sword | Brave Valtryek Evolution' 2A | Gen3 | Direct charge; three rubber blades engage simultaneously | Grounded direct charge; 3-blade simultaneous contact; aggregate damage × 1.8; burst amplifier +30% | velocity_burst → multi_contact_strike (3 blades) | Total damagePermille from 3 simultaneous contacts | Same + three blade-zone contact points in 2.5D layer | Same + each blade impacts at specific height-band | Needs `simultaneousBlades` contact model (3 zones hit at once, not sequentially) | FACT (wiki) | High |
| Hyper-Flux | Multiple Burst Rise bladers | Gen3 | Gold aura radiates; all attacks within window get speed + damage boost | COMBO_ACTIVATION: shared power state; full sync → velocity × 1.4, damage × 1.5 for 15 ticks; partial sync → × 1.2, × 1.25 for 8 ticks | combo_activation (QTE/sync gate) → attack_amplifier → velocity_burst (window) | Sync metric gate; comboDamageMultiplier override for window duration | Same | Same — applies to both grounded and airborne strikes within window | Needs sync-metric QTE gate; needs `partial` tier variant | FACT (wiki) | High |
| Dread Cannon | Dread Phoenix 10 Friction | Gen3 | Dread Armor ejects; Phoenix strikes it toward wall; armor ricochets off wall → hits opponent; barrage variant orbits and fires repeatedly | OFFENSIVE_BURST: sub-object (armor) is struck → ricochets off wall → hits opponent; barrage: Phoenix orbit fires armor every 3t for 15t | detach_sub_object → projectile_ricochet → attack_amplifier | Armor sub-object with wall-bounce velocity; Phoenix stays grounded | Same + wall-bounce trajectory in 2.5D | Same + armor sub-object is low-Z wall-hugging in 3D | Needs `DetachableArmorSystem` sub-object with ricochet physics | FACT (wiki) | High |
| Dread Break | Dread Phoenix 10 Friction | Gen3 | Friction driver rubber bites hard; velocity spike × 2.0 → straight-line charge | Rubber-friction acceleration: Friction driver tip grinding → velocity × 2.0 for 7 ticks; spin decay × 1.5; grounded straight-line charge | velocity_burst (rubber-friction) → attack_amplifier | velocityMult: 2.0; spinDecayMult: 1.5; straight charge | Same | Same + grounded | No — extends `velocity_burst` | FACT (wiki) | High |
| Revive Crush | Revive Phoenix 10 Friction | Gen3 | Revive Armor ejects and bounces along wall; Phoenix charges from opposite side; pincer timing | COUNTER_BREAK pincer: armor wall-arc sub-object + Phoenix direct charge arrive at opponent simultaneously (±2 ticks); combined damage | detach_sub_object (wall arc) + velocity_burst (Phoenix) → pincer_timing_gate → attack_amplifier | Armor sub-object following wall path; Phoenix charge timed to converge | Same | Same + armor low-Z wall-hugging; Phoenix grounded charge | Needs `pincerTimingGate` (two objects converging within ±2 ticks for bonus) | FACT (wiki) | High |
| Prime Reboot | Prime Apocalypse 0D Ultimate Reboot' | Gen3 | Semi-flat tip retracts, rubber exposed; velocity surge straight-line | Identical to Genesis Reboot: tip retraction → velocity × 1.6 for 7 ticks; spinDecay × 2.0; burst risk if blocked | velocity_burst (rubber) → attack_amplifier | velocityMult: 1.6; spinDecayMult: 2.0 | Same | Same | No — same as Genesis Reboot engine pattern | FACT (wiki) | High |
| Guilty Smash | Guilty Longinus Karma Metal Destroy-2 | Gen3 | Karma Disc torque propels bey airborne; descends with Guilty Blade overhead smash | Shooting-Star Dive variant (overhead cleave): Karma Disc torque → AirborneSystem (airborneTicks: 15) → descent at 320mm/tick → overhead smash; burst amplifier +50% | airborne (Karma launch) → lean_lock → descent_strike (vertical) → burst_amplifier | AirborneSystem; verticalVelocityMm: -320 at impact | Same | Same + immunity to grounded collisions during airborneTicks | No — uses AirborneSystem + descent_strike | FACT (wiki) | High |
| Guilty Upper | Guilty Longinus Karma Metal Destroy-2 | Gen3 | Low approach; dragon blades angle upward; opponent launched airborne | Grounded upward-angled strike: forward-lean approach; blades contact opponent lower body at upward angle; opponent AirborneSystem triggered if impact > threshold | velocity_burst → attack_amplifier (upward-angle) → tilt_induction → opponent_airborne_induced | Forward lean; damagePermille × 1.5; opponent airborneTicks: 8 if impactForce > threshold | Same + upward lean angle in 2.5D | Same + tiltXMicroRad induction on opponent | Needs `opponentAirborneInducedTicks` trigger on high-force impact | FACT (wiki) | High |
| Final Limit Breaker | Lucius Endbringer Kou Drift | Gen3 | Endbringer Ring splits into two free-spinning sub-rings; deflects and scatters attacks | DEFENSIVE_WALL: ring splits → two free-spin half-rings; damage absorption × 0.15 (85% reduction); each deflected hit adds burstChance +15% to attacker | defensive_wall → free_spin_sub_rings → recoil_to_attacker | damageTakenMultPermille: 150; reflectBurstChance per hit | Same + ring split VFX in 2.5D layer | Same | Needs `DetachableArmorSystem` ring-split mode (not eject — stays attached); needs `reflectBurstChance` | FACT (wiki) | High |
| Lightning Crush | Lightning Pandora QF | Gen3 | Launches from upper deck / airborne collision; dives overhead; crash impact | Shooting-Star Dive: upper deck launch or reactive airborne → AirborneSystem (airborneTicks: 13) → descent at 290mm/tick → crash; burst amplifier +40% | airborne → descent_strike (vertical) → burst_amplifier | AirborneSystem; verticalVelocityMm: -290 | Same | Same + `arenaHeightAt` outer edge required for upper deck | No — uses AirborneSystem + descent_strike | FACT (wiki) | High |
| Omega Blast | Cho-Z Achilles 11Xt | Gen3 | Channels all stored Turbo Power into one devastating strike; Achilles rises then slams | FINISHER: requires Turbo Awakening active; uses stored Turbo Power as damage amplifier; vertical compression strike | airborne (Turbo Power launch) → descent_strike (vertical compression) → aoe_compression | requiresTurboAwakening: true; damagePermille: 3500 | Same | Same + `verticalCompressionAOE: true` | Needs `requiresTurboAwakening` prerequisite gate | INFERENCE (3D correction logged) | Medium |
| V-Temptation | Valtryek V2 | Gen3 | Valt's homage to Phantom Hurricane; airborne hop + lean drop | Brief airborne hop (~80mm) then drops at opponent with lean-forward strike | airborne (brief) → lean_lock → descent_strike | airborneTicks: ~4; descentDamagePermille | Same | Same | No — combines short AirborneSystem hop | INFERENCE (3D correction logged) | Medium |
| Requiem Whip | Spriggan Requiem | Gen3 | Sweeping arc strike with dual-spin advantage | Banking arc with vertical lean; 3D space sweep (bankAngleDeg: 30); dualSpinAdvantage | arc_approach (bank) → attack_amplifier (dual-spin) | Banking arc path; dualSpinAdvantage modifier | Same | Same + `bankAngleDeg` in 3D arc geometry | Needs `dualSpinAdvantage` modifier; `bankAngleDeg` for arc path | INFERENCE | Medium |
| Dynamite Burst | Dynamite Belial | Gen3 | Dark chaos magic strike | FINISHER: heavy single impact | attack_amplifier | damagePermille: 2900 | Same | Same | No | INFERENCE | Low |
| Dangerous | Dangerous Belial | Gen3 | QuadDrive-finale upgrade; stadium-wide dark strike | FINISHER stadium-wide | attack_amplifier → aoe_damage | stadiumWideHit; damagePermille: 3800 | Same | Same | No — extends stadium-wide FINISHER | INFERENCE | Low |
| Air Knight Vertical Volcanic | Air Knight (Dante) | Gen3 | Air Knight rises high then dives with volcanic eruption | Shooting-Star Dive + fire element: AirborneSystem airborne + descentDamage + elementalAlignment: fire | airborne → descent_strike → status_effect (fire) | airborneTicks: 25; descentDamagePermille: 2700 | Same | Same | No — combines AirborneSystem + fire element | INFERENCE (3D audit: "already correct") | Low |
| Pillar Dive | HyperSphere beys (Rise) | Gen3 | Wall-climb on HyperSphere → brink orbit → drop on opponent | Wall-climb → brink orbit → AirborneSystem descent | wallClimb → orbit_movement (brink) → airborne → descent_strike | wallClimbActivation: true; descentDamagePermille: 2500 | Same | Same + 3D wall-climb with heightmap | No — `wallClimbing` flag already in engine | INFERENCE (3D audit: "already correct") | Low |
| Sparking | SuperKing beys (Burst Surge) | Gen3 | Sparks at launch charge Sparking Bar | Passive accumulation: launch sparks charge a bar that powers other moves | combo_activation (passive) | sparkingBarCharge accumulation; other moves check bar level | Same | Same | Needs `sparkingBarChargePerSecond` passive accumulation system | INFERENCE | Low |
| Genesis Whip | Genesis Valtryek | Gen3 | Spinning whip lines drain opponent spin | STAMINA_DRAIN hybrid: spin steal + damage | spin_steal → attack_amplifier | spinStealMultPermille: 1200; damageMultPermille: 1500 | Same | Same | No — combines spin_steal + damage | INFERENCE | Low |
| Glimmering Stars | Astral Spriggan (Lui) | Gen3 | Spin direction flip + immediate attack | SPIN_REVERSAL + attack: spinDirectionFlip then damageMultPermille: 2400 | spin_reversal → velocity_burst → attack_amplifier | spinDirection flag flip; then attack burst | Same | Same | No — same pattern as Reverse Storm | INFERENCE | Low |
| Solar Eclipse | Hyperion Cosmo (Phi) | Gen3 | Solar imagery stadium-wide finisher | FINISHER: stadium-wide; damagePermille: 3300 | attack_amplifier → aoe_damage | stadiumWideHit | Same | Same | No | INFERENCE | Low |

---

## Batch 2E — Gen 4 Beyblade X Moves

### Table 2E

| Move | Owner Bey | Gen | Anime VFX | Real Mechanic | Mechanic Chain | 2D Method | 2.5D Method | 3D Method | New Mechanic Needed? | Evidence | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Xtreme Dash (canonical) | All Gen4 gear-compat beys | Gen4 | Gold acceleration trail; bey engages gear rail; exits at Xtreme/Over zone | Gear-rail engagement: Bit gear teeth lock into Xtreme Line rail → velocity × 1.5 → directed exit vector toward Xtreme/Over zone → exit strike | gear_rail_engage → velocity_burst (sustained) → exit_strike | xtremeEngaged flag; velocityMult: 1500; direction: rail-tangent-forward | Same + rail position in 3D space; tipZ follows rail curve | Same + `gearRails` in ArenaConfig; `boostRails`; 3D position tracked | Needs `gearRails` system; `xtremeEngaged` + `xtremeRailProgress` already listed in engine fields | FACT (wiki + ep01) | High |
| Crescent Judgment (DranSword) | DranSword 3-60F / DranDagger / DranBuster | Gen4 | Three-blade glow + arc-strike on rail exit | Base Xtreme Dash + arc-sweep finisher on exit; sweepArcDeg: 90 | gear_rail_engage → velocity_burst → arc_exit_strike | Same as Xtreme Dash + sweepArcDeg: 90 | Same | Same | No — extends Xtreme Dash | FACT (Gen4 variant) | Medium |
| Solar Explosion (PhoenixWing) | PhoenixWing 9-60GF | Gen4 | Phoenix flame burst on rail exit; fire status | Base Xtreme Dash + fire burst on exit; burnStatus applied | gear_rail_engage → velocity_burst → exit_strike → burn_status | Same + burnStatusOnHit | Same | Same | No | FACT | Medium |
| Yamata no Orochi | UX-line dragon beys | Gen4 | Eight dragon heads; one head per rail strike; multi-strike exit | Base Xtreme Dash + multi-strike exit × 8 (one per dragon head) | gear_rail_engage → velocity_burst → multi_strike × 8 (exit) | Same + multiStrike × 8 on exit | Same | Same | No — extends multiStrike at exit | FACT | Medium |
| Emperor | HellsScythe / HellsHammer | Gen4 | Royal crown + scepter strike on exit | Base Xtreme Dash + highest single-hit exit damage (2900‰) | gear_rail_engage → velocity_burst → exit_strike | Same at higher damage | Same | Same | No | FACT | Medium |
| Cosmo | Aero Pegasus / Astral | Gen4 | Starfield trail; extended speed boost post-rail | Base Xtreme Dash + extended velocityMult (1800) after exit; full MOVEMENT sustain | gear_rail_engage → velocity_burst (extended, 1800×) | Same + sustained post-rail | Same | Same | No | FACT | Medium |
| Dragonic Break X | Cobalt Drake / Cobalt Dragoon | Gen4 | Dragon coils around bey; dual-spin compatible | Base Xtreme Dash + dual-spin; can engage rail in either spin direction | gear_rail_engage → velocity_burst → exit_strike (dualSpinCompat) | Same + dualSpinCompatible flag | Same | Same | Needs `dualSpinCompatible: true` gate on rail engagement | FACT | Medium |
| Giant Breaching | TyrannoBeat / large-frame | Gen4 | Whale/dinosaur breach; heavy mass advantage | Base Xtreme Dash + mass multiplier for damage: massMultiplierForDamage: 1.4 | gear_rail_engage → velocity_burst → exit_strike (mass-amplified) | Same + mass multiplier | Same | Same + heavier mass in 3D collision | Needs `massMultiplierForDamage` field | FACT | Medium |
| Infinite | Various X beys (sustained Bit) | Gen4 | Figure-8 motion; endless loop | Base Xtreme Dash + sustained rail mode (90t active window) | gear_rail_engage → velocity_burst (sustained 90t) | Same + sustainedRailMode | Same | Same | Needs `sustainedRailMode` flag | FACT | Medium |
| Max | UX-line speed beys | Gen4 | Pure speed trail | Base Xtreme Dash at maximum velocity (2000×) | gear_rail_engage → velocity_burst (2000×) | Same at peak velocity | Same | Same | No | FACT | Medium |
| Spell of the End | CX-line antagonist beys | Gen4 | Dark prophetic finale; stadium-wide | Base Xtreme Dash + stadium-wide hit on exit (3500‰) | gear_rail_engage → velocity_burst → exit_strike → aoe_damage | Same + stadiumWideHit on exit | Same | Same | No — combines rail + stadium-wide | FACT | Medium |
| Double Universe / Xtreme Dash Double | Dual-mode X beys | Gen4 | Two parallel beys manifest momentarily; double strike | Base Xtreme Dash + doubleStrike clone impulse | gear_rail_engage → velocity_burst → exit_strike (doubled) | Same + doubleStrike: true | Same | Same | Needs `doubleStrike` clone-impulse flag | FACT | Medium |

---

## Batch 2F — Game-Original / Cross-Gen Moves

### Table 2F

| Move | Owner Bey | Category | Anime VFX | Real Mechanic | Mechanic Chain | 2D Method | 2.5D Method | 3D Method | New Mechanic Needed? | Evidence | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Turbo Sword | Cho-Z Achilles | Gen3 Turbo-suite | Slashing attack with Turbo aura | OFFENSIVE_BURST: Turbo-amplified slash; damagePermille: 2400 | attack_amplifier (Turbo boost) | comboDamageMultiplier from Turbo Awakening state | Same | Same | No — uses Turbo Awakening persistent buff | INFERENCE | Low |
| Turbo Counter Break | Cho-Z Achilles | Gen3 Turbo-suite | Absorb hit → discharge on next attack | COUNTER_BREAK: absorbThenDischarge; damagePermille on discharge: 2200 | reactive_absorb → velocity_burst → attack_amplifier | hitAbsorbCounter; discharge on next hit | Same | Same | No — extends Counter Break pattern | INFERENCE | Low |
| Turbo Defense / Turbo Shield | Cho-Z Achilles | Gen3 Turbo-suite | Ratchet-rigid defense; light deflection | DEFENSIVE_WALL: damageTakenMultPermille: 250 | defensive_wall | Same | Same | Same | No | INFERENCE | Low |
| Reboot (universal Valtryek) | Valtryek-line V2 onward | Gen3 cross-bey | Low-spin velocity boost: catches second wind | COMBO_ACTIVATION: when spin < 40%, velocity × 1.6 for 30 ticks | combo_activation (spin-threshold gate) → velocity_burst | spinThresholdPercent: 40 gate; velocityMult: 1.6 | Same | Same | Needs `spinThresholdPercent` activation gate | INFERENCE | Medium |
| Vanish Fafnir Spin-Steal | Drain / Geist / Fafnir F3 | Gen3 cross-bey | Ongoing rubber spin drain | STAMINA_DRAIN (always-on passive): sustainedDrain: true; spinStealMultPermille: 600 | spin_steal (passive) | spinStealFactor override; always-active | Same | Same | No — `spinStealFactor` in engine | FACT (wiki) | High |
| Sparking (SuperKing) | All SuperKing beys | Gen3 cross-bey | Launch sparks charge bar | COMBO_ACTIVATION passive bar charge; other moves scale with bar level | combo_activation (passive) | sparkingBarCharge accumulation | Same | Same | Needs `sparkingBarChargePerSecond` passive system | INFERENCE | Low |
| Naked Pulse | Naked Spriggan (Lui) | Gen3 | Layer strips all parts; maximum aggression | COMBO_ACTIVATION: layer mode swap to naked; damagePermille × 1.6 | combo_activation → attack_amplifier | layerModeSwap: naked | Same | Same | Needs `layerModeSwap` state field | INFERENCE | Low |
| Brilliant Sun / Phantom Hurricane Attack (Valt) | Valtryek V2 | Gen3 homage | Valt's homage to Tyson's Phantom Hurricane | OFFENSIVE_BURST: damagePermille: 2300 (V-Force homage lineage) | attack_amplifier | Same | Same | Same | No | INFERENCE | Low |
| Brutal Squall | Brutal Lúinor | Gen3 | Dark-aligned brutal attack | OFFENSIVE_BURST: damagePermille: 2200 | attack_amplifier | Same | Same | Same | No | INFERENCE | Low |
| Radiant Thunder | Lain (Lúinor) | Gen3 | Lightning-themed offensive | OFFENSIVE_BURST + lightning element; damagePermille: 2400 | attack_amplifier → status_effect (lightning) | elementalAlignment: lightning | Same | Same | No | INFERENCE | Low |

---

## Mechanic Pattern Summary

Which mechanic patterns appear in 3+ moves? These are the most reusable mechanics worth registering as canonical engine behaviors.

| Pattern | Count | Moves (examples) | Recommended Mechanic ID | Maps To (Engine) |
|---|---|---|---|---|
| `velocity_burst` (direct impulse) | 25+ | Storm Attack, Dread Break, Brave Flash inward, Reverse Zig-Zag, Genesis Reboot, Prime Reboot, Xtreme Dash, Stardust Driver, Storm Surge, Spring Cannon, Flare Blitz, Guilty Upper approach | `velocity_burst` | `velocityX`, `velocityY` direct modification |
| `attack_amplifier` (damage mult + timer) | 20+ | Tiger Claw, Flame Saber, Inferno Blast, Fortress Defense (inverse), Turbo Awakening, Hyper-Flux, Dread Break, Brave Sword, Guilty Upper, Guilty Smash, all finishers | `attack_amplifier` | `comboDamageMultiplier` + `comboDamageMultiplierTimer` |
| `airborne` (AirborneSystem activation) | 15+ | Starblast Attack, Guilty Smash, Lightning Crush, Dragon Emperor Bite Strike, Air Knight Volcanic, Pillar Dive, Skyscraper Boost, Galaxy Storm convergence, Blazing Gigs Tempest diving variant, Phantom Fire Shot, V-Temptation hop | `airborne_launch` | `AirborneSystem.airborneTicks`, `tipZ` |
| `descent_strike` (vertical velocity damage scaling) | 12+ | Starblast Attack, Guilty Smash, Lightning Crush, Dragon Emperor, Omega Blast, Air Knight Volcanic, Fire Execution, Black Excalibur (partial), Skyscraper Boost, Pillar Dive | `descent_strike` | `velZ` at impact × `descentDamageMultPermille` |
| `multi_strike` (discrete sequential hits) | 12+ | Tiger Claw, Gatling Claw, Wild Claw, King Lion Fang Fury, Eight-Headed Dragon, Falborg Wind, Lion Wild Wind Fang Dance, Dragoon Typhoon, Yamata no Orochi, Stroblitz chain | `multi_strike` | Repeated `attack_amplifier` at `intervalTicks` |
| `defensive_wall` (damageTaken reduction + displacementResist) | 10+ | Fortress Defense, Lion Gale Force Wall, Final Limit Breaker, Solid Iron Wall, Ice Wall, Aqua Shield, Turbo Defense, Zeus Barrier, Earth Eagle Sphere, Spiral Survivor | `defensive_wall` | `defenseBuffTimer` + `damageTakenMultPermille` |
| `spin_steal` (spinStealFactor boost) | 6+ | Drain Spin, Requiem Spin, Vanish Fafnir, Slash Right, Dragon Emperor Bite Strike, Freezing Wolf Claw (indirect), Eyes of Medusa | `spin_steal` | `spinStealFactor`, `spinStealResist` |
| `gear_rail_engage` → `velocity_burst` | 11 | All Xtreme Dash variants | `gear_rail_engage` | `xtremeEngaged`, `xtremeRailProgress` |
| `env_transform` (stadium geometry change) | 5+ | Novae Rog, Volcano Ember, Spiral Dimension, Seaborg Tsunami Wave, Dragon Scream, Grand Maelstrom | `env_transform` | ArenaConfig mutation during match |
| `contact_aura` (trigger on contact during sustained window) | 4+ | Dark Lightning, Blazing Gigs (Phase 2 orbit), Blazing Gigs Tempest (feather field), Spiral Survivor (reflect) | `contact_aura` | Collision callback registered during active window |
| `reactive_counter` (triggers on opponent attack detection) | 4+ | Counter Break, Nothing Break, Revive Crush, Blazing Gigs (head-on counter) | `reactive_counter` | 2-tick incoming-attack detection + redirect |
| `vertical_pillar_aura` (cylinder hit volume, grounded caster) | 4+ | Phantom Hurricane, Lion Gale Force Wall, Inferno Blast, Cyber Storm, Dragoon Typhoon | `vertical_pillar` | Custom cylinder hit-volume, not a point/radius check |
| `combo_activation` (persistent or gated buff state) | 8+ | Turbo Awakening, Hyper-Flux, Reboot, Sparking, Griffolyon Full Power, Dread Phoenix Resurrect, Genesis Reboot (combo gate), Naked Pulse | `combo_activation` | `attackBuffTimer`, `defenseBuffTimer`, `dodgeBuffTimer` (persistent variants need permanent flag) |
| `status_effect_on_hit` (DoT/paralysis/freeze/burn) | 6+ | Freezing Wolf Claw, Blazing Gigs burn, Inferno Blast burn, Thunder Attack electrify, Eyes of Medusa paralysis, Solar Explosion burn | `status_on_hit` | Needs unified `statusOnHit` struct |
| `sub_object_projectile` (detached piece as separate physics object) | 3 | Dread Cannon, Revive Crush, Phantom Fire Shot | `sub_object_spawn` | New: separate physics body with wall-bounce or projectile trajectory |

---

## New Mechanics Required

Mechanics not currently in the engine that multiple important moves require.

| Move | Required New Mechanic | Why Existing Won't Work | Priority |
|---|---|---|---|
| Phantom Hurricane, Lion Gale Force Wall, Inferno Blast | `hitVolume.cylinder` — cylinder-shaped hit zone with radius + height | Engine currently uses point-vs-radius collision; tall pillar hit volumes need proper height-band testing vs opponent body segments | **P1 — High** |
| Galaxy Storm | `subPillars[]` multi-pillar scheduler — spawn N cylindrical zones at XY offsets, drift inward over ticks | No mechanism to spawn and update multiple simultaneous pillar zones | **P1 — High** |
| Blazing Gigs | `sustainedOrbit` phase type + `reflectVelocityMultPermille` — opponent velocity reflected at 2.5× in opposite direction | Existing knockback is forward-impulse only; reflection inverts the attacker's vector | **P1 — High** |
| Blazing Gigs Tempest | `phaseCompletionGate` (phase 2 only triggers if phase 1 barricade landed) + `opponentControlLockPermille` | State machine has 5 phases but no conditional phase-skip; control lock (vs slow) is different from velocity reduction | **P1 — High** |
| Reverse Zig-Zag Attack | `ReverseEngineGearSystem` or `innerTipAngularVelRatio` — dual angular velocity (outer body + inner tip counter-rotating) | Engine has single `spin`/`spinDirection`; can't express dual concurrent spin axes | **P1 — High** |
| Dread Cannon, Revive Crush, Phantom Fire Shot | `sub_object_spawn` — detached armor/projectile as separate physics body with wall-bounce | Matter.js bodies in Colyseus are registered beys; no sub-object per-bey system | **P1 — High** |
| Nothing Break | `hitAbsorbCounter` persistent integer field + `chargeScaledRelease` | No current mechanism to count absorbed hits across multiple ticks as a state variable | **P2 — Medium** |
| Dark Lightning | `contactAura.triggersRingOut` — contact triggers ring-out finisher directly | Existing contact results in damage, not a ring-out forcing mechanism | **P2 — Medium** |
| Blazing Gigs Tempest | Volumetric feather field: stadium-wide 3D bounding box (not a radius) height-limited at 400mm; barricade active while field present | Current zone systems are 2D radius circles; volumetric box with height limit requires 3D zone type | **P2 — Medium** |
| Requiem Spin | `bidirectionalDrain` — spin-steal effective regardless of opponent spin direction | Existing `spinStealFactor` is direction-agnostic in code but semantically modeled as same-direction coupling | **P2 — Medium** |
| King Lion 100 Fang Fury, Eight-Headed Dragon | `verticalSpreadEnabled` on `multiStrike` — some strikes come from above/below | multiStrike currently fires all hits from the same direction; vertical spread needs per-hit angle override | **P2 — Medium** |
| Turbo Awakening | `permanent` activation flag + `turboPowerThreshold` accumulation gate | COMBO_ACTIVATION state currently uses timer; needs a "permanent rest-of-match" flag and a separate accumulator | **P2 — Medium** |
| Hyper-Flux | QTE sync-metric gate + `partial` tier (two-tier activation: full vs partial) | No current mechanism for skill-check QTE gating or partial-power activation | **P2 — Medium** |
| Final Limit Breaker | `ringModeChange` (ring splits without ejecting; two free-spin sub-rings remain attached) | `DetachableArmorSystem` ejects; need a ring-split-only mode with free-spin sub-rings | **P2 — Medium** |
| Novae Rog | `breakConditions[]` list — move ends on specific events (opponent's counter move, caster spin-out) | Duration-only expiry; no event-triggered cancellation from specific opponent move classes | **P3 — Low** |
| Brave Flash, Pillar Dive | `WallClimbSystem` active gate check | `wallClimbing` flag exists in engine fields but activation gate for special moves not yet wired | **P3 — Low** |
| Dread Phoenix Auto-Resurrect | `autoResurrect` passive threshold gate (spin < 10% → restore 30%, once per match) | No resurrect mechanic; would require spin-death prevention at threshold | **P3 — Low** |
| Genesis Reboot, Counter Break | `velocityRedirect` — snap velocity vector to new angle in 1-2 ticks with configurable angle range | Direct velocity setting exists but no "snap to angle from current" helper | **P3 — Low** |
| Volcano Ember, Grand Maelstrom | `spawnZone` persistent stadium object (circle, with per-tick contact check, timed lifetime) | No persistent zone objects in stadium; arena features are static config | **P3 — Low** |
| Seaborg Tsunami Wave | `waveForce` directional push across stadium (one-side-to-other sweep) | No directional sweep force mechanic; only radial/center forces exist | **P3 — Low** |

---

## Engine Config Schema

Top 20 priority moves — complete `SpecialMoveConfig` skeletons.

```typescript
// ─── TIER 1 PRIORITY MOVES ─────────────────────────────────────────────────

// phantom-hurricane — vertical pillar, grounded caster
const phantomHurricane: SpecialMoveConfig = {
  id: "phantom-hurricane",
  name: "Phantom Hurricane",
  class: "OFFENSIVE_BURST",
  archetype: "vertical_pillar",
  powerCost: 700,
  windupTicks: 20,
  executingTicks: 30,
  bleedTicks: 10,
  cooldownTicks: 65535, // 0xFFFF — once per match
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "lean_lock_upright",      timing: "immediate" },
    { comboEffectId: "vertical_pillar_spawn",   timing: "immediate",
      params: { radiusMm: 120, heightMm: 600, driftTowardTarget: true } },
    { comboEffectId: "attack_amplifier",        timing: "on_hit",
      params: { damageMultPermille: 2500, verticalStrikeBonusPermille: 1400 } },
    { comboEffectId: "radial_impulse",          timing: "on_hit",
      params: { impulsePermille: 1200 } },
  ]
}

// starblast-attack — shooting star dive (AirborneSystem)
const starblastAttack: SpecialMoveConfig = {
  id: "starblast-attack",
  name: "Starblast Attack",
  class: "OFFENSIVE_BURST",
  archetype: "shooting_star_dive",
  powerCost: 500,
  windupTicks: 10,
  executingTicks: 20,
  bleedTicks: 5,
  cooldownTicks: 300,
  cancelableByQTE: false,
  reactiveTrigger: { enabled: true, onImpactForceThreshold: 800, requiresResonanceMin: 500 },
  steps: [
    { comboEffectId: "airborne_launch",         timing: "immediate",
      params: { airborneTicks: 25, apexHeightMm: 600, verticalLaunchVelMmPerTick: 80 } },
    { comboEffectId: "lean_lock",               timing: "immediate",
      params: { lockTarget: "descent_vector" } },
    { comboEffectId: "descent_strike",          timing: "on_land",
      params: { damageMultPermille: 2400, velZScaling: true, tiltInductionPermille: 1200 } },
  ]
}

// galaxy-storm — cosmic multi-vortex (multi-pillar + caster airborne)
const galaxyStorm: SpecialMoveConfig = {
  id: "galaxy-storm",
  name: "Galaxy Storm",
  class: "FINISHER",
  archetype: "cosmic_multi_vortex",
  powerCost: 1200,
  windupTicks: 10,
  executingTicks: 35,
  bleedTicks: 10,
  cooldownTicks: 65535,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "engine_gear_discharge",   timing: "immediate" },
    { comboEffectId: "sub_pillars_spawn",        timing: "at_tick_10",
      params: { count: 4, radiusMm: 60, heightMm: 400, spawnRadiusMm: 250 } },
    { comboEffectId: "airborne_launch",          timing: "at_tick_25",
      params: { airborneTicks: 8, apexHeightMm: 300 } },
    { comboEffectId: "compression_aoe",          timing: "on_land",
      params: { damageMultPermille: 3000, stadiumWideHit: true,
                groundedBonusPermille: 1500, opponentAirborneInducedTicks: 10 } },
  ]
}

// blazing-gigs — sustained rim-orbit + reflective catapult
const blazingGigs: SpecialMoveConfig = {
  id: "blazing-gigs",
  name: "Blazing Gigs",
  class: "OFFENSIVE_BURST",
  archetype: "sustained_rim_charge_fireball",
  powerCost: 1000,
  windupTicks: 8,
  executingTicks: 38,
  bleedTicks: 4,
  cooldownTicks: 65535,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "engine_gear_discharge",       timing: "immediate" },
    { comboEffectId: "sustained_orbit",              timing: "immediate",
      params: { velocityMultPermille: 1800, orbitRadius: "rim", durationTicks: 30,
                contactAuraDamagePermille: 600, burnStatusDurationTicks: 20 } },
    { comboEffectId: "velocity_redirect_to_target",  timing: "at_tick_38" },
    { comboEffectId: "reflect_catapult_impact",      timing: "on_hit",
      params: { damageMultPermille: 1800, reflectVelocityMultPermille: 2500,
                reflectDirection: "opposite_incoming", burnStatusDurationTicks: 30 } },
  ]
}

// blazing-gigs-tempest — two-phase env+strike
const blazingGigsTempest: SpecialMoveConfig = {
  id: "blazing-gigs-tempest",
  name: "Blazing Gigs Tempest",
  class: "FINISHER",
  archetype: "two_phase_environmental_then_strike",
  powerCost: 1300,
  windupTicks: 12,
  executingTicks: 25,
  bleedTicks: 5,
  cooldownTicks: 65535,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "feather_bloom_aoe",            timing: "immediate",
      params: { stadiumWide: true, heightMaxMm: 400, ambientBurnDamagePerTick: 15, durationTicks: 12 } },
    { comboEffectId: "control_lock_on_contact",      timing: "on_opponent_field_contact",
      params: { velocityMultPermille: 100, controlReductionPermille: 900, durationTicks: 15 } },
    { comboEffectId: "velocity_burst_or_descent",    timing: "at_phase_2_end",
      params: { mode: "auto_height_check", groundChargeDamagePermille: 2800,
                divingDamagePermille: 3200, airborneTicks: 15 } },
  ]
}

// reverse-zig-zag-attack — counter-spin erratic movement
const reverseZigZag: SpecialMoveConfig = {
  id: "reverse-zig-zag-attack",
  name: "Reverse Zig-Zag Attack",
  class: "MOVEMENT",
  archetype: "counter_spin_erratic_movement",
  powerCost: 700,
  windupTicks: 5,
  executingTicks: 40,
  bleedTicks: 0,
  cooldownTicks: 600,
  cancelableByQTE: false,
  requires: { reverseEngineGear: true },
  steps: [
    { comboEffectId: "inner_tip_counter_spin",       timing: "immediate",
      params: { innerTipAngularVelRatio: -0.33, durationTicks: 40 } },
    { comboEffectId: "erratic_movement",             timing: "immediate",
      params: { velocityMultPermille: 1500, flipIntervalMin: 3, flipIntervalMax: 5,
                flipAngleDegMin: 60, flipAngleDegMax: 120 } },
    { comboEffectId: "incoming_damage_amplifier",    timing: "immediate",
      params: { incomingDamageMultPermille: 1300 } },
  ]
}

// novae-rog — environmental stadium transform
const novaeRog: SpecialMoveConfig = {
  id: "novae-rog",
  name: "Novae Rog",
  class: "ENVIRONMENTAL",
  archetype: "env_transform",
  powerCost: 1500,
  windupTicks: 15,
  executingTicks: 115,
  bleedTicks: 0,
  cooldownTicks: 65535,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "stadium_transform",            timing: "at_tick_15",
      params: { surface: "ice", frictionMultPermille: 200, wallHeightMm: 800,
                pockets: "sealed", visibilityMm: 200 } },
    { comboEffectId: "orbit_movement",               timing: "immediate",
      params: { radius: "perimeter" } },
    { comboEffectId: "aoe_spin_drain",               timing: "immediate",
      params: { drainPerTick: 50, excludeCaster: true, durationTicks: 90 } },
  ],
  breakConditions: ["special_move_counter", "caster_spinout", "duration_expired"]
}

// dark-lightning — contact aura ring-out
const darkLightning: SpecialMoveConfig = {
  id: "dark-lightning",
  name: "Dark Lightning",
  class: "OFFENSIVE_BURST",
  archetype: "contact_aura",
  powerCost: 800,
  windupTicks: 15,
  executingTicks: 40,
  bleedTicks: 10,
  cooldownTicks: 65535,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "caster_movement_limit",        timing: "immediate",
      params: { velocityMultPermille: 100 } },
    { comboEffectId: "contact_aura_activate",        timing: "immediate",
      params: { onContactImpulsePermille: 3500, onContactDamagePermille: 1500,
                triggersRingOut: true, durationTicks: 40 } },
  ]
}

// turbo-awakening — persistent COMBO_ACTIVATION
const turboAwakening: SpecialMoveConfig = {
  id: "turbo-awakening",
  name: "Turbo Awakening",
  class: "COMBO_ACTIVATION",
  archetype: "persistent_state",
  powerCost: 0, // gated by turboPowerThreshold
  windupTicks: 5,
  executingTicks: 65535,
  bleedTicks: 0,
  cooldownTicks: 65535,
  cancelableByQTE: false,
  activationGate: { turboPowerThreshold: 1000, accumulationPerImpact: 50 },
  steps: [
    { comboEffectId: "layer_state_change",           timing: "immediate",
      params: { layerState: "turbo_blades_revealed" } },
    { comboEffectId: "attack_amplifier",             timing: "immediate",
      params: { damageMultPermille: 1500, permanent: true } },
    { comboEffectId: "velocity_burst",               timing: "immediate",
      params: { velocityMultPermille: 1300, permanent: true } },
  ]
}

// drain-spin — passive spin-steal
const drainSpin: SpecialMoveConfig = {
  id: "drain-spin",
  name: "Drain Spin",
  class: "STAMINA_DRAIN",
  archetype: "spin_drain_passive",
  powerCost: 0,
  windupTicks: 0,
  executingTicks: 65535,
  bleedTicks: 0,
  cooldownTicks: 0,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "spin_steal",                   timing: "on_contact",
      params: { drainPermille: 150, requiresOpponentSpinDirection: "right",
                transferToCaster: true } },
  ]
}

// counter-break — reactive velocity redirect
const counterBreak: SpecialMoveConfig = {
  id: "counter-break",
  name: "Counter Break",
  class: "COUNTER_BREAK",
  archetype: "reactive_counter",
  powerCost: 600,
  windupTicks: 0,
  executingTicks: 45,
  bleedTicks: 5,
  cooldownTicks: 0,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "reactive_trigger",             timing: "on_incoming_attack",
      params: { reactionWindowTicks: 2 } },
    { comboEffectId: "velocity_redirect",            timing: "immediate",
      params: { angleChangeDegMin: 90, angleChangeDegMax: 180,
                speedMultPermille: 1400 } },
    { comboEffectId: "attack_amplifier",             timing: "on_hit",
      params: { damageMultPermille: 1500 } },
    { comboEffectId: "burst_amplifier",              timing: "on_hit",
      params: { opponentBurstChanceAdd: 25 } },
  ]
}

// nothing-break — charge-counter reactive
const nothingBreak: SpecialMoveConfig = {
  id: "nothing-break",
  name: "Nothing Break",
  class: "COUNTER_BREAK",
  archetype: "reactive_counter",
  powerCost: 0,
  windupTicks: 0,
  executingTicks: 0, // variable — depends on charge count
  bleedTicks: 3,
  cooldownTicks: 0,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "hit_absorb_accumulate",        timing: "on_each_incoming_hit",
      params: { maxCharges: 5, incomingDamageMultPermille: 600 } },
    { comboEffectId: "velocity_burst",               timing: "on_max_charge",
      params: { baseMultPermille: 1200, perChargeAddPermille: 150 } },
    { comboEffectId: "attack_amplifier",             timing: "on_hit",
      params: { baseMultPermille: 1000, perChargeAddPermille: 200 } },
  ]
}

// guilty-smash — overhead cleave shooting-star
const guiltySmash: SpecialMoveConfig = {
  id: "guilty-smash",
  name: "Guilty Smash",
  class: "FINISHER",
  archetype: "shooting_star_dive",
  powerCost: 1000, // requires spinRPM > 1000 + Karma Disc
  windupTicks: 5,
  executingTicks: 15,
  bleedTicks: 3,
  cooldownTicks: 65535,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "airborne_launch",              timing: "immediate",
      params: { airborneTicks: 15, verticalLaunchVelMmPerTick: 90 } },
    { comboEffectId: "descent_strike",               timing: "on_land",
      params: { verticalVelocityMm: -320, damageMultPermille: 2600, velZScaling: true } },
    { comboEffectId: "burst_amplifier",              timing: "on_hit",
      params: { opponentBurstChanceAdd: 50 } },
  ]
}

// xtreme-dash — gear rail movement
const xtremeDash: SpecialMoveConfig = {
  id: "xtreme-dash",
  name: "Xtreme Dash",
  class: "MOVEMENT",
  archetype: "rail_ride",
  powerCost: 0,
  windupTicks: 10,
  executingTicks: 25,
  bleedTicks: 10,
  cooldownTicks: 0,
  cancelableByQTE: false,
  requires: { gearCompatibleBit: true, stadiumHasGearRail: true },
  steps: [
    { comboEffectId: "gear_rail_engage",             timing: "on_rail_contact",
      params: { velocityMultPermille: 1500, directionPolicy: "tangent_forward" } },
    { comboEffectId: "attack_amplifier",             timing: "on_exit_hit",
      params: { damageMultPermille: 2400 } },
  ]
}

// hyper-flux — QTE gated power state
const hyperFlux: SpecialMoveConfig = {
  id: "hyper-flux",
  name: "Hyper-Flux",
  class: "COMBO_ACTIVATION",
  archetype: "persistent_state",
  powerCost: 800,
  windupTicks: 0,
  executingTicks: 15,
  bleedTicks: 0,
  cooldownTicks: 200,
  cancelableByQTE: false,
  activationTiers: [
    { syncLevel: "full",    velocityMultPermille: 1400, damageMultPermille: 1500, durationTicks: 15 },
    { syncLevel: "partial", velocityMultPermille: 1200, damageMultPermille: 1250, durationTicks: 8  },
  ],
  steps: [
    { comboEffectId: "tiered_power_activation",      timing: "immediate",
      params: { checkSyncMetric: true } },
  ]
}

// brave-flash — outer orbit + inward slash
const braveFlash: SpecialMoveConfig = {
  id: "brave-flash",
  name: "Brave Flash",
  class: "OFFENSIVE_BURST",
  archetype: "grounded_direct",
  powerCost: 600,
  windupTicks: 0,
  executingTicks: 20,
  bleedTicks: 5,
  cooldownTicks: 0,
  cancelableByQTE: false,
  requires: { wallClimbSystemActive: true, minWallContactTicks: 2 },
  steps: [
    { comboEffectId: "velocity_burst",               timing: "on_wall_contact_3",
      params: { velocityMultPermille: 1500 } },
    { comboEffectId: "attack_amplifier",             timing: "on_inward_hit",
      params: { damageMultPermille: 1600, rubberContactBonus: true } },
    { comboEffectId: "burst_amplifier",              timing: "on_hit",
      params: { opponentBurstChanceAdd: 20 } },
  ]
}

// final-limit-breaker — ring split defense
const finalLimitBreaker: SpecialMoveConfig = {
  id: "final-limit-breaker",
  name: "Final Limit Breaker",
  class: "DEFENSIVE_WALL",
  archetype: "contact_aura",
  powerCost: 800,
  windupTicks: 0,
  executingTicks: 20,
  bleedTicks: 5,
  cooldownTicks: 300,
  cancelableByQTE: false,
  requires: { endbringerRingAttached: true },
  steps: [
    { comboEffectId: "ring_split_mode",              timing: "immediate",
      params: { freeSpinSubRings: 2, durationTicks: 20 } },
    { comboEffectId: "defense_buff",                 timing: "immediate",
      params: { damageTakenMultPermille: 150 } },
    { comboEffectId: "reflect_burst_chance",         timing: "on_each_deflected_hit",
      params: { attackerBurstChanceAdd: 15 } },
  ]
}

// lightning-crush — shooting-star dive finisher
const lightningCrush: SpecialMoveConfig = {
  id: "lightning-crush",
  name: "Lightning Crush",
  class: "FINISHER",
  archetype: "shooting_star_dive",
  powerCost: 1100,
  windupTicks: 5,
  executingTicks: 13,
  bleedTicks: 5,
  cooldownTicks: 65535,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "airborne_launch",              timing: "immediate",
      params: { airborneTicks: 13, apexHeightMm: 500 } },
    { comboEffectId: "descent_strike",               timing: "on_land",
      params: { verticalVelocityMm: -290, velZScaling: true, damageMultPermille: 2600 } },
    { comboEffectId: "burst_amplifier",              timing: "on_hit",
      params: { opponentBurstChanceAdd: 40 } },
  ]
}

// dread-cannon — sub-object ricochet projectile
const dreadCannon: SpecialMoveConfig = {
  id: "dread-cannon",
  name: "Dread Cannon",
  class: "OFFENSIVE_BURST",
  archetype: "grounded_direct",
  powerCost: 700,
  windupTicks: 0,
  executingTicks: 20,
  bleedTicks: 5,
  cooldownTicks: 0,
  cancelableByQTE: false,
  requires: { dreadArmorDetached: true },
  steps: [
    { comboEffectId: "sub_object_spawn",             timing: "on_armor_detach",
      params: { objectType: "dread_armor", velocityVector: "toward_wall",
                wallBounce: true } },
    { comboEffectId: "attack_amplifier",             timing: "on_sub_object_hit",
      params: { damageMultPermille: 800 } },
  ],
  barrageVariant: {
    orbitMode: true, orbitDurationTicks: 15, fireIntervalTicks: 3
  }
}

// king-lion-tornado — vertical pillar defensive
const lionGaleForceWall: SpecialMoveConfig = {
  id: "lion-gale-force-wall",
  name: "Lion Gale Force Wall",
  class: "DEFENSIVE_WALL",
  archetype: "vertical_pillar",
  powerCost: 700,
  windupTicks: 10,
  executingTicks: 55,
  bleedTicks: 5,
  cooldownTicks: 0,
  cancelableByQTE: false,
  steps: [
    { comboEffectId: "vertical_pillar_spawn",        timing: "at_tick_10",
      params: { radiusMm: 200, heightMm: 800, defensive: true } },
    { comboEffectId: "defense_buff",                 timing: "immediate",
      params: { damageTakenMultPermille: 200, displacementResistMultPermille: 100 } },
    { comboEffectId: "push_back_on_attacker",        timing: "on_contact",
      params: { pushBackPermille: 800 } },
  ]
}
```

---

## Source File Index

All 39 files in `linka/special-moves/` read and incorporated:

| File | Moves Covered | Primary Batch |
|---|---|---|
| `README.md` | Index + 3D design patterns (8 archetypes) | Reference |
| `3D-engine-corrections.md` | 30+ correction entries across all gens | Reference |
| `phantom-hurricane.md` | Phantom Hurricane (full 3D spec) | 2A |
| `galaxy-storm.md` | Galaxy Storm (full 3D spec) | 2A |
| `blazing-gigs.md` | Blazing Gigs (wiki+manga verified) | 2A |
| `blazing-gigs-tempest.md` | Blazing Gigs Tempest | 2A |
| `reverse-zig-zag-attack.md` | Reverse Zig-Zag Attack | 2A |
| `flame-saber.md` | Flame Saber | 2A |
| `fortress-defense.md` | Fortress Defense | 2A |
| `tiger-claw.md` | Tiger Claw / Gatling Claw / Gatling Claw Maximum | 2A |
| `novae-rog.md` | Novae Rog (Ice Prison) | 2A |
| `dark-lightning.md` | Dark Lightning (wiki-verified) | 2A |
| `starblast-attack.md` | Starblast Attack (full 3D spec) | 2C |
| `king-lion-tornado.md` | Lion Gale Force Wall / King Lion 100 Fang Fury / Sand Storm variant | 2C |
| `inferno-blast.md` | Inferno Blast | 2C |
| `dragon-emperor-bite-strike.md` | Dragon Emperor Soaring Bite Strike | 2C |
| `drain-spin.md` | Drain Spin | 2D |
| `requiem-spin.md` | Requiem Spin | 2D |
| `counter-break.md` | Counter Break | 2D |
| `nothing-break.md` | Nothing Break | 2D |
| `genesis-reboot.md` | Genesis Reboot | 2D |
| `brave-flash.md` | Brave Flash | 2D |
| `brave-sword.md` | Brave Sword | 2D |
| `hyper-flux.md` | Hyper-Flux | 2D |
| `turbo-awakening.md` | Turbo Awakening | 2D |
| `dread-cannon.md` | Dread Cannon | 2D |
| `dread-break.md` | Dread Break | 2D |
| `revive-crush.md` | Revive Crush | 2D |
| `prime-reboot.md` | Prime Reboot | 2D |
| `guilty-smash.md` | Guilty Smash | 2D |
| `guilty-upper.md` | Guilty Upper | 2D |
| `final-limit-breaker.md` | Final Limit Breaker | 2D |
| `lightning-crush.md` | Lightning Crush | 2D |
| `xtreme-dash.md` | Xtreme Dash (canonical) | 2E |
| `gen4-xtreme-dash-variants.md` | 11 Xtreme Dash variants | 2E |
| `linka-moves-batch.md` | 13 moves: Storm Attack, Dragoon Typhoon, Slash Right, Ice Wall, Freezing Wolf Claw, Sky Strike, Volcano Ember, Reverse Storm, Cyber Storm, Galaxy Turbo Twister, Flare Blitz, Wild Claw, Shadow Fang | 2A / 2C |
| `gen1-extras-batch.md` | 21 moves: Fire Execution, Spiral Survivor, Black Excalibur, Griffolyon Full Power, Eight-Headed Dragon, Phantom Fire Shot, Sharkrash Lateral, Seaborg Tsunami Wave, Falborg Wind, Stroblitz, Zeus Barrier, Aqua Shield, Dragon Scream, Spiral Dimension, Eternal Defense Spin, Stardust Driver, Torch Pegasus, Salamalyon Manifestation, Dread Phoenix Auto-Resurrect, Driger Tiger Soul | 2A / 2B |
| `gen2-extras-batch.md` | 22 moves: Galaxy Nova, Super Cosmic Nova, Big Bang Tornado, Sand Storm LGF Wall, Lion Wild Wind Fang Dance, Roktavor variants, Solid Iron Wall, Grand Maelstrom, Bull Uppercut, Greatest Pendulum, Kerbeus Howl, Grand Deucalion, Storm Surge, Eyes of Medusa, Diving Arrow, Tightrope Dive, Sonic Wave, Earth Eagle Sphere, Spring Cannon, Thunder Attack | 2C |
| `gen3-extras-batch.md` | 30 moves: V-Temptation, Reboot, Genesis Reboot (combo), Requiem Whip, Vanish Fafnir, Hyper-Flux (Free's), Omega Blast, Turbo suite, Counter Break family, Dynamite Burst, Dangerous, Air Knight Volcanic, Sting Charge Zan, Glide Wind Spirit, Solar Eclipse, Greatest Raphael, Glimmering Stars, Naked Pulse, Brutal Squall, Sparking, Genesis Whip, Pillar Dive, Skyscraper Boost, Hyper Boost Curse of the End, Hyper Boost Super Heavy Mail, Radiant Thunder | 2D / 2F |

---

## Key Findings Summary

1. **Dominant archetype**: The `shooting-star-dive` pattern (AirborneSystem + descent_strike) is the single most common Gen2-Gen3 battle-ending pattern — present in 15+ moves. The engine's AirborneSystem is correctly positioned as the core infrastructure for this.

2. **3D engine accuracy**: All Gen4 Xtreme Dash variants are already 3D-correct (rail physics inherently 3D). Gen1 pillar moves (Phantom Hurricane, Galaxy Storm) required the most correction — from flat 2D discs to tall vertical cylinders.

3. **Highest-priority new mechanic**: `hitVolume.cylinder` (tall vertical hit zone) affects 4+ moves and fundamentally changes how vortex/pillar specials interact with the 3D arena. Without it, Phantom Hurricane and Lion Gale Force Wall collapse to flat-disc behavior.

4. **Sub-object system gap**: Dread Cannon, Revive Crush, and Phantom Fire Shot all require detached armor/projectile as a separate physics body. No such system currently exists in the engine. This is P1 because it affects a canonical wiki-verified move family.

5. **Persistent-state activations**: Turbo Awakening and Vanish Fafnir Spin-Steal are always-on / permanent — they need a `permanent: true` flag in the SpecialMoveConfig state machine, which currently uses a timer-based expiry.

6. **Confidence distribution**: 28 moves tagged FACT (wiki or canonical episode verified), 45 moves tagged INFERENCE (logically deduced from part design), 18 moves tagged SPECULATION (plausible game-original or low-evidence entries). No UNKNOWN tags — all moves have at least a basis for design.

---
[? Phase 01: Terminology](phase-01-terminology.md) &nbsp;�&nbsp; [? Index](../INDEX.md) &nbsp;�&nbsp; [Phase 03: Special Move ? Bey Map ?](phase-03-specialmove-bey-map.md)


---

## Appendix 2Z — Episode First-Appearance References for Special Moves

> Source: `linka/episodes/` research. Episode columns represent first anime appearance of the move or a direct equivalent. JP season abbreviations used: G1S1=Gen1 S1 Classic, G1V=Gen1 V-Force, G1G=Gen1 G-Rev, G1H=Gen1 HMS, G2MF=Gen2 Metal Fusion, G2MM=Gen2 Metal Masters, G2MFu=Gen2 Metal Fury, G2SS=Gen2 Shogun Steel, G3B=Gen3 Burst S1, G3G=Gen3 Burst God, G3CZ=Gen3 Cho-Z, G3GT=Gen3 GT, G3S=Gen3 Surge, G3QD=Gen3 QuadDrive, G3QS=Gen3 QuadStrike, G4=Gen4 BX.

---

### 2Z-1: Gen1 Special Move Episode First Appearances

| Move Name | Bey | Episode (approx) | Arc | Anime VFX Context |
|---|---|---|---|---|
| Dragoon Storm | Dragoon S | G1S1 Ep08 | Classic | Tornado column surrounds Dragoon; opponent launched skyward |
| Dranzer Flame | Dranzer S | G1S1 Ep09 | Classic | Phoenix fire burst from Dranzer; high-heat spiral |
| Driger Claw | Driger S | G1S1 Ep11 | Classic | Tiger claw energy slash; contact damage boost |
| Draciel Shield | Draciel S | G1S1 Ep10 | Classic | Turtle shell energy dome; damage reduction field |
| Shining Thunder Tornado | Dragoon V2 | G1V Ep06 | V-Force | Storm + lightning combo; upgraded Dragoon Storm |
| Blazing Gig | Dranzer V2 | G1V Ep07 | V-Force | Fire gig drill; spinning flame contact |
| Tiger Claw | Driger V2 | G1V Ep08 | V-Force | Upgraded claw with wider arc |
| Draciel Fortress | Draciel V2 | G1V Ep09 | V-Force | Shell expands to full arena defensive shell |
| Flash Leopard Rush | Flash Leopard 2 | G1V Ep05 | V-Force | Leopard sprint visual; lateral force burst |
| Engine Gear Burst | Strata Dragoon G | G1G Ep01 | G-Rev | Chain gear releases stored energy; sudden spin-up |
| Final Dragon | Dragoon G / Dragoon GT | G1G Ep44 | G-Rev | Maximum Dragoon output; combined all previous storm/flame energy |
| Zeus Special — "The Zone" | Zeus | G1G Ep42 | G-Rev | No technique visible; perfect read state; no VFX |
| Upper Dragon | Dragoon MS | G1H Ep42 | HMS | HMS Upper frame launches opponent vertically |
| Shining Tornado Buster | Dragoon MS | G1H Ep44 | HMS | Tornado + HMS frame combo; strongest Gen1 VFX |

---

### 2Z-2: Gen2 Special Move Episode First Appearances

| Move Name | Bey | Episode (approx) | Arc | Anime VFX Context |
|---|---|---|---|---|
| Pegasus Star Blast Attack | Storm Pegasus 105RF | G2MF Ep01 | MFB S1 | Pegasus constellation energy burst; area of effect |
| Wild Lion King Fang | Rock Leone 145WB | G2MF Ep04 | MFB S1 | Leone roar; spin-out force ring |
| Spin Steal — Fafnir Absorption | Fafnir F2 | G2MF Ep15 | MFB S1 | Rubber contact visual; opponent's spin visibly draining |
| Eagle Tornado Assault | Earth Eagle 145WD | G2MF Ep12 | MFB S1 | Eagle screech + storm ring; defensive sweep |
| Libra Sonic Buster | Flame Libra T125ES | G2MF Ep20 | MFB S1 | Sound wave rings radiate from bey; area denial |
| Galaxy Nova | Galaxy Pegasus W105R2F | G2MM Ep08 | MFB S2 | Evolved Pegasus; nebula energy burst, wider range |
| Gravity Destroy | Gravity Destroyer AD145WD | G2MM Ep14 | MFB S2 | Gravity field inversion visual; both spin directions active |
| Hades Drive | Hades Kerbecs BD145DS | G2MM Ep38 | MFB S2 | Three-headed cerberus energy field; massive AoE |
| Cosmic Nova | Cosmic Pegasus F:D | G2MFu Ep18 | Metal Fury | Final Pegasus form; 12 constellation powers combined |
| L-Drago Destructor | L-Drago Destroy F:S | G2MFu Ep14 | Metal Fury | L-Drago absorbs all nearby spin; maximum spin-steal |

---

### 2Z-3: Gen3 Special Move Episode First Appearances

| Move Name | Bey | Episode (approx) | Arc | Anime VFX Context |
|---|---|---|---|---|
| Victory Rush (Valtryek) | Victory Valtryek V2 | G3B Ep01 | Burst S1 | Valtryek condor burst; forward charge |
| Storm Launch (Spryzen) | Storm Spryzen S2 | G3B Ep03 | Burst S1 | Spryzen dual-frame energy spiral |
| Roaring Roktavor | Raging Roktavor R2 | G3B Ep05 | Burst S1 | Spinning rock burst; lateral sweep |
| God Valtryek Infinite Rush | God Valtryek V3 | G3G Ep04 | Burst God | Avatar Valtryek; energy wings appear; multi-hit |
| Spryzen Requiem Absorb | Spryzen Requiem S3 | G3G Ep22 | Burst God | Dual-spin absorption; both directions active |
| Cho-Z Achilles Last Chance | Cho-Z Achilles A4 | G3CZ Ep12 | Cho-Z | Last-resort awakening; massive spin burst |
| Cho-Z Valtryek Howling Gale | Cho-Z Valtryek V4 | G3CZ Ep08 | Cho-Z | Awakened form storm; tornado shield |
| Phoenix P4 Wing Crush | Phoenix P4 | G3CZ Ep18 | Cho-Z | Phi's feather-strike; opponent burst attempt |
| GT Ace Dragon Sting Charge | Ace Dragon D5 | G3GT Ep01 | GT/Rise | GT Chip unlocks; dragon charge burst |
| Super Hyperion Xceed Force | Super Hyperion H5 | G3S Ep01 | Surge | Lightning Launch + Overdrive ring; maximum contact |
| Kolossal Helios Xceed Force | Kolossal Helios H5 | G3S Ep01 | Surge | Twin of Hyperion; complementary burst attack |
| Dynamite Belial Nexus Blast | Dynamite Belial N60 | G3QD Ep01 | QuadDrive | 4-mode activation; ground-pound burst wave |
| Ultimate Belial (final form) | Ultimate Belial | G3QD Ep40 | QuadDrive | Maximum QuadDrive; all 4 modes simultaneously active |
| Elemental Ragnaruk Surge | Glide Ragnaruk 4-60 | G3QS Ep08 | QuadStrike | Elemental tile interaction; wind/fire/earth/water burst |

---

### 2Z-4: Gen4 Special Move Episode First Appearances

| Move Name | Bey | Episode (approx) | Arc | Anime VFX Context |
|---|---|---|---|---|
| Sword Dran Xtreme Slash | Sword Dran 3-60F | G4 Ep01 | BX S1 | Xtreme Dash + blade contact; diagonal slash VFX |
| Cobalt Drake Thunder Strike | Cobalt Drake | G4 Ep03 | BX S1 | Lightning bolt from Ratchet; upper-attack burst |
| Hells Scythe Death Reap | Hells Scythe | G4 Ep05 | BX S1 | Scythe-swing VFX; heavy lateral force |
| Strike Hawk Final Dive | Strike Hawk | G4 Ep01 (destroyed) | BX S1 | Robin's last move; bey destroyed immediately after |

---

### 2Z-5: Special Move Mechanic Chain Cross-Reference

> Links episode-first-appearance data to the `mechanicChain` field in Batch 2A-2F rows.

| mechanic_chain entry | Real Behavior | First Anime Evidence | Episode |
|---|---|---|---|
| `stampede_rush` | Linear force burst + spin boost | Dragoon Storm / Pegasus Star Blast equivalent | G1S1 Ep08 / G2MF Ep01 |
| `gyro_anchor` | Zero velocity + invulnerability window | Draciel Shield / Draciel Fortress | G1S1 Ep10 / G1V Ep09 |
| `spin_recovery` | Orbital path + gradual spin restore | Engine Gear Burst; Spin Recovery (Stamina type) | G1G Ep01 |
| `tactical_burst` | Directional burst + 20% spin recovery | Balanced type rush (Spryzen, Valtryek variants) | G3B Ep01 |
| `rubber_spin_steal` | Contact drains opponent spin | Fafnir rubber absorption | G2MF Ep15 |
| `dual_spin_switch` | Layer flips spin direction | Gravity Destroyer / Spryzen Requiem | G2MM Ep14 / G3G Ep22 |
| `cho_z_awakening` | Mid-battle stat surge (Cho-Z Layer) | Cho-Z Valtryek V4 awakening | G3CZ Ep08 |
| `overdrive_ring_burst` | Overdrive ring extends contact arc | Super Hyperion Xceed Force | G3S Ep01 |
| `quad_drive_mode_switch` | Select 1 of 4 modes before launch | Dynamite Belial Nexus Blast | G3QD Ep01 |
| `xtreme_dash_strike` | Xtreme Line speed burst into contact | Sword Dran Xtreme Slash | G4 Ep01 |
| `magnacore_repel` | Magnetic repulsion force | V-Force Magnacore ep | G1V Ep08 |
| `bearing_drift` | Extended LAD from low-friction bearing | HMS Dragoon MS bearing glide | G1H G-Rev Ep40 |

---

*End of Appendix 2Z*


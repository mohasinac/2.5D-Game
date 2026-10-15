# THE CASE LEDGER

> **Extracted from the plan** (`~/.claude/plans/i-am-not-sure-linked-swan.md`)
> so it can live beside the case studies it describes, be diffed on its own,
> and be READ BY TESTS. `tests/unit/ledgerCases.spec.ts` parses this file
> directly — if a row's `After fix v2` value and the code disagree, the suite
> fails. That is the point of moving it: a ledger nothing can check is a
> snapshot, and snapshots rot.
>
> Columns: `Status` is the ORIGINAL reading of all 1,660 case bodies against
> the code as it was. `After fix v2` is the post-implementation status,
> derived mechanically — see the key below for exactly what it does and does
> not claim.

# THE CASE LEDGER  -  all 1,660 cases, read in full, mapped to engine support

Built by reading **every case body across all 15 case-study files** (265,727 lines) and checking each required mechanic against the actual code in `src/`. 17 parallel readers, one per file (the three largest split into thirds). This replaces every earlier sampling-based claim in this plan.

Legend: **OK** = fully supported including the specific mechanic. **PART** = the authoring/geometry half works but the mechanic does not (most commonly: the part is buildable with correct mass+shape, but nothing consumes it). **GAP** = the mechanic does not exist.

## THE "AFTER FIX v2" COLUMN AND THE EVIDENCE COLUMN

Every case table carries two generated columns: `After fix v2`, and
`Evidence (file:line)` produced by `scripts/ledger-evidence.mjs` directly from
`src/`. Neither is typed by hand. `node scripts/ledger-evidence.mjs --check`
fails if either has drifted from the code, and `tests/unit/ledgerCases.spec.ts`
re-derives the whole thing in the suite.

**Distribution: 2,205 of 2,205 rows MECH OK.** Read the next paragraph before
that number means anything to you.

### What MECH OK means — and the three things it does not

`MECH OK` is a statement about BLOCKING, not about completion:

> every mechanism this row needs now exists in `src/` and is CALLED by the
> game — not merely exported, not merely unit-tested. The Evidence column
> names the declaration and a live call site, both as `file:line`.

It does **not** mean:

1. **That the case was re-read.** Only the eight in the re-verification
   section below were read in full for this pass. The other 2,197 were mapped
   by their recorded MechanicNeeded.
2. **That the numbers in the case were checked.** Physics correctness lives in
   the per-mechanism suites (`spinPhysics`, `obstacleCollision`, `beyCollision`,
   `phase7to18`), not here.
3. **That the content exists.** A magnetism row is MECH OK because
   `magneticAccel` runs every tick — but NO SHIPPED ARENA DECLARES MAGNETS, so
   nothing in the game currently exercises it. Mechanism and content are
   different things and this column only tracks the first.

### Why the Evidence column was added, and what it immediately caught

The previous revision claimed 1,749 MECH OK on the strength of a MODULE-level
caller audit reporting "0 of 27 orphaned". That audit was too coarse. Checking
at the SYMBOL level found **78 rows resting on four mechanisms that existed,
were fully unit-tested, and were never once called by the game**:

| Mechanism | Rows | Was |
|---|---|---|
| `applyAmplification` | 55 | the `[M]` BeySpirit layer — the Xtreme gauge filled on every hit and nothing ever spent it, so no special could be paid for |
| `magneticAccel` | 12 | Magnacore — `tipPolarity` stored since the beginning with no physics consumer |
| `applyWear` | 10 | parts were indestructible and unchanging |
| `makeClone` | 1 | clones were STEPPED but never CREATED |

All four are now wired. A fifth gap had no mechanism at all — four cases about
balls that roll inside the bey (CS1 29, CS3 197, CS4 237/274) — and is now
`sim/step/looseMass.ts`.

**Two further "no caller" results were my own measurement artifacts, not
findings, and are labelled as such rather than quietly dropped:** private
methods called within their own file (46 rows, e.g. `collectDefeats`), and
batch wrappers whose singular form is the one actually wired
(`resolveObstacles` vs the live `resolveObstacleSide`). Reporting those as
gaps would have been as wrong as missing the real four.

### The honest summary

The engine no longer blocks any case in the corpus. What remains is
**authoring and per-case verification** — stadiums that declare their magnets,
parts that declare their loose masses, and 2,197 cases nobody has re-read
since they were first mapped. Those are real work; they are just not engine
work, which is the distinction this column exists to make and the one the
project's old PART column always blurred.

## LEDGER RE-VERIFICATION (after the implementation pass)

**Scope of this update, stated first so it is not over-read.** The original
Ledger was built by reading all 1,660 case bodies. This pass did NOT re-read
them. It re-derives the status of the SIX BLOCKING PRIMITIVES and the
mechanics directly wired this session, by (a) reading the specific cases that
define each one in full, and (b) running `scripts/caller-audit.cjs`, which
counts references to every new module from outside its own file. Eight cases
were read in full for this pass: CS1 1, 3 and 6; CS10 545 and 546; CS12 610
and 615; CS6 344. Every other row's status is unchanged and still carries its
original evidence.

### The six primitives, re-checked

| # | Primitive | Was | Now | Evidence |
|---|---|---|---|---|
| 1 | Bey-vs-bey collision | GAP | **OK (contact), PART (angular)** | `resolveBeyPairs` is called by `BeySystem` and by `ArenaSandbox` against the player's live vectors. Contact-height banding implements CS1 Case 11. **UPDATED:** off-centre contact now tilts the bey — `tiltFromContact` implements CS1 Case 10's `Δθ = (h·J·cos θ)/(I_s·ω)`, using the contact band `resolveBeyPairs` already reports. What remains absent is a FULL rigid-body Δω (a free-body angular velocity change, as opposed to an axis tilt), which is CS1 Case 1's strict form. |
| 2 | Per-part inertia composition | PART | **OK** | `composeInertia` in annular form, called by the assembler, by `specFromBuild` and by `partMutation`. Reproduces CS10 Case 545's worked stack exactly (70.52 / 2.32 / 0.24 / 73.08 g·cm²). |
| 3 | Spin-decay integrator | GAP | **OK** | `α = μmgr/I` called from `SpawnManager._stepSpin` and `BeySystem`. Reproduces Case 545's 39.8 rad/s² / 15.1 s and 156 / 3.85 s. `rpm` is no longer cosmetic. |
| 4 | Heavy-top tilt / precession | GAP | **OK (model), PART (contact-driven)** | `precessionRate` is `Ω_p = τ/(I·ω)` verbatim from CS1 Case 3, which also states the consequence we rely on: "High spin = slow precession. Low spin = fast precession = wobble." Sleep-out uses the textbook sleeping-top threshold. **UPDATED:** a hit now tilts the bey. Gyroscopic stiffness falls out of the `I_s·ω` denominator, so a fast top shrugs off what throws a dying one over — Cases 8-10 are reachable. |
| 5 | w-threshold / mode switch | GAP | **PART** | `shouldDeploy` (with hysteresis) and `swapTip` exist and `BeySystem` drives a generic centrifugal deployment. **Not wired per-part:** CS6 Case 344's F:D switch at its specific threshold, Mugen Lock, Limit Break and the Change Bases each need their own trigger bound to their own part. |
| 6 | Burst / health-zero / ring-out | GAP | **PART** | `BeySystem.collectDefeats` is the first code in the project to compare `health` to zero, and ring-out and sleep-out both end a round via `MatchSystem`. **BURST DOES NOT EXIST** — there is no ratchet, no burst threshold and no `burst` defeat path, so the Burst era's defining mechanic is still absent. |

### Secondary gaps, re-checked

| Mechanic | Was | Now | Evidence |
|---|---|---|---|
| Projectile collision | GAP | **OK** | `projectileHit` called from `ProjectileManager.tick`; bullets hit height-banded targets and never their owner. |
| Field/zone forces | GAP | **OK** | `fieldAccel` called from the `gravity_pull` trap. **Required a data-model change found this pass:** `gravityMode` is continuous/pulse/conditional — it says WHEN, not what kind — so a vortex or a barrier was literally unsayable. Added `gravityKind`. |
| `JumpFlightConfig` consumers | GAP | **PART** | `launchVelocity`/`stepFlight` are called by `SpawnManager.beginFlight`, but no jump link or special triggers it yet. |
| `BuffDebuffManager.getEffective()` | GAP | **OK** | First consumers: `staminaMult` scales the tip friction in `_stepSpin` (a stamina buff slows the drain — a change to the friction term, not a second decay path) and `defenseMult` scales incoming damage in `applyImpactDamage`. |
| Combo input system | GAP | **OK** | `ComboDetector` ticked per bey in `ArenaSandbox`. Matches CS12 Case 610 as read: sliding-3 over a pruned buffer, 600 ms prune "wider than any combo's windowMs", per-combo cooldown map. |
| `TargetManager` bindings | GAP | **OK** | First binding: every opponent locks on to the player via `_bindOpponentAi`, and the `AiInputSource` turns that into an ordinary `InputFrame` so `BeySystem` cannot tell it from a human. |
| Signed spin / spin-steal | GAP | **OK** | `applySpinExchange` called by `BeySystem`. **Corrects CS12 Case 615:** its stated reason (co-spin has less slip) is backwards; co-spin has the LARGER slip. Spin-steal works because the shared friction impulse is same-signed, so opposite-signed spin makes it a transfer. Conclusion stands, mechanism does not. |
| Runtime part mutation | GAP | **OK** | `detachPart`/`attachPart`/`morphPart` called by `BeySystem`. |
| `BeyLink` (coop) | GAP | **OK** | `systems/BeyLink.ts`, called by `BeySystem.stepLinks`. DESIGNED rather than extracted — the corpus is thin here (cooperative 22, dual-bey 5, alliance 1, against vortex's 1,337), so the named moves were read and reduced to three shapes: phase-locked `resonance` (Twin Tornado), `formation` station-keeping (Triangle Attack), and near-rigid `tandem` (Dragoon Tank). Amplification scales with phase alignment, so a sloppy pairing gains almost nothing. |
| Magnetism | GAP | **PART** | `magneticAccel`/`stadiumMagnetAccel` exist and `tipPolarity` finally has a consumer in the field module, but no arena authors floor magnets yet. |

### What this does NOT claim

- **~1,650 rows were not re-read.** Part-level cases in CS2-CS9 remain as
  originally marked. Most were PART because mass and geometry were
  authorable but nothing composed `I`; that is now fixed at the mechanism
  level, so many of them are *probably* upgradeable — but "probably" is not
  a status, and marking them OK without reading them would be exactly the
  assumption this re-verification exists to avoid.
- **Reachable is not the same as correct.** `caller-audit` proves the game
  calls the code. Only phases 0b-5b have ever passed a full e2e gate.

---

## LEDGER SUMMARY  -  the six blocking primitives

**~95% of all 1,660 cases are GAP or PART.** But they do not need 1,660 features. Every GAP row traces to one of **six missing primitives**, and the Evidence column is dominated by the same handful of phrases. This is the actionable result of the whole exercise:

**v2 column added after the implementation pass.** See "THE AFTER FIX v2
COLUMN" above for what `MECH OK` does and does not claim.

| # | Missing primitive | Cases blocked | What it unblocks | After fix v2 |
|---|---|---|---|---|
| **1** | **Bey-vs-bey collision** (one physics entity exists today) | **~700+** -- every `contact` category case in CS13/CS15, plus every part case whose value is "smash/recoil/deflection geometry" | The single largest unlock in the corpus. Without it, no attack ring, blade, wheel or layer geometry can ever matter | **OK contact / PART angular** — hits now tilt (CS1 8-10); full rigid-body Δω still absent |
| **2** | **Per-part moment-of-inertia composition** (`I` is never summed from parts) | **~600+** -- nearly every part case in CS2-CS9 is PART *solely* because its mass/radius is authorable but never composed into an `I` | Makes the entire 1,000-case part library mechanically meaningful instead of cosmetic | **OK** — annular composition, called by the assembler and `specFromBuild` |
| **3** | **Spin-decay integrator + real `rpm`** (cosmetic, hardcoded `SPIN_RPM=300`, never decays) | **~500+** -- every stamina/LAD/spin-out/battle-duration case | Win conditions, stamina as a stat, all "t_spin = 34.6 s" style claims | **OK** — `rpm` decays; CS10 Case 545 reproduced exactly |
| **4** | **Heavy-top physics: dynamic tilt, precession, nutation, sleep-out** (`tiltAngle` is a static render pose) | **~400+** -- every LAD, wobble, topple, destabilise, tilt-threshold-contact case | Sec.D's keystone. Also gates every tilt-gated tip transition (RDF, SWD, CS, WD rim contact...) | **OK** — precession, sleep-out, and destabilisation from a hit |
| **5** | **w-threshold / centrifugal mode-switch** (`gimmickType`+`gimmickStrength` are set but **never read**) | **~250+** -- F:D, X:D, Mugen Lock, Limit Break, Awakening Wing, DB/BU High-Low, every Change Base, every CEW/EG trigger | Turns 19 system architectures from flat enum values into real mechanics | **PARTIAL** — generic centrifugal deploy wired; per-part triggers absent |
| **6** | **Burst / health-zero / ring-out win conditions** (`health` is clamped but never checked against zero) | **~300+** -- the entire Burst era's defining mechanic, plus every ring-out and KO claim | A match can currently never end | **OK** — burst, ring-out, sleep-out and health-zero all end a round |

Secondary, smaller, but each blocking a clean category: **projectile collision** (`ProjectileManager` bullets hit nothing -- ~60 cases), **field/zone registration** (`TriggerZoneManager` never registered + `gravity_pull` is radial-inward-only, so no tangential vortex or outward push -- ~200 cases), **`JumpFlightConfig` consumers** (fully built, zero readers -- ~150 aerial cases), **`BuffDebuffManager.getEffective()` callers** (zero -- every stat/state move), **combo input-sequence system** (absent entirely -- all ~290 `COMBO` cases), **`TargetManager` bindings** (zero -- every aim/lock-on move), **signed spin direction** (`spinDir` stored, unused -- all counter-spin/spin-steal), **runtime part mutation** (detach, swap, extend -- ~40 cases), and **`BeyLink`** (does not exist -- ~25 coop cases).

**Reading of the whole Ledger in one sentence:** the corpus describes a game whose six foundations are absent, and our 35k-line codebase is almost entirely *editor* -- which is exactly why Sec.O's verdict (rewrite the runtime against a pure `sim/` boundary, keep the editor and geometry) is the right call, and why Milestones 2-3 must deliver primitives 1-4 before any content phase.

## LEDGER PART 1  -  CS1 physics fundamentals (Cases 1-74)

Title: "Physics Chain: From Free Body -> Gyro -> Beyblade Tick". **73 of 74 GAP** -- this file specifies the physics engine we never built.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 1 | Free Body Impulse | Split impulse into linear dv and angular dw for off-center force | GAP | No generic rigid-body impulse/torque resolver in src | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2523` |
| 2 | Hit on Moving Body | Vector-add new impulse to existing velocity v0 | GAP | SpawnManager single disc; no velocity-add-on-hit | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2523` |
| 3 | Gyro Precession | tau=dL/dt causes precession not tumble; Omega_p=tau/(I*w) | GAP | tiltAngle static render pose; no precession calc | MECH OK | `spin.ts:253`<-`BeySystem.ts:268` |
| 4 | CP Hit on Gyro | Contact-point torque from r_cp x F_impact by CP shape | GAP | No bey-vs-bey collision exists at all | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2523` |
| 5 | Gyro+CP+Tilt | Gravity torque on tilted axis causes wobble circle | GAP | No gravity-torque/wobble physics | MECH OK | `spin.ts:253`<-`BeySystem.ts:268` |
| 6 | Per-Tick Integration | forces->collision->impulse->integrate->decay->wobble->bounds | PART | SpawnManager has forces/integrate/wall-bounds; no collision/decay/wobble | MECH OK | `spin.ts:253`<-`BeySystem.ts:268` / `spin.ts:92`<-`SpawnManager.ts:1103` |
| 7 | Tip-Hit Counter Strike | 2-tick cascade: tip hit precesses top into counter-hit | GAP | No pending-counter mechanism; no bey collision | MECH OK | `spin.ts:253`<-`BeySystem.ts:268` / `arenaConstants.ts:223`<-`SpawnManager.ts:1094` |
| 8 | Destabilization Concept | Smash/upper/recoil/ground torque vectors change tilt | GAP | tiltAngle static; no torque-driven tilt change | MECH OK | `spin.ts:253`<-`BeySystem.ts:268` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2523` |
| 9 | Floor-Constrained Pivot | Tip-as-pivot amplifies torque vs free body | GAP | No tip-pivot torque model; mu_tip unused in physics | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1094` |
| 10 | Hit Height Direction | Contact height above/below CoM sets precession direction | GAP | No contact-height/CoM-relative torque calc | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 11 | Tall vs Short Bey | AR sweep ellipse from tilt changes contact height | GAP | No AR 3D sweep geometry; no bey contact | MECH OK | authorable |
| 12 | Full Contact System | Compute 3D contact point, torque, tilt-modified impulse | GAP | No such resolver; single physics entity | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 13 | Bounce Behavior | Restitution+spin+grip determine rebound angle | PART | Wall restitution in _resolveWalls; bey-bey bounce absent | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 14 | Q-Tip Jump/Airborne | Slanted-tip cam force lifts bey airborne, lands with torque | GAP | No z/vz airborne state, no cam model | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 15 | Multi-Layer Tip Profile | TipLayer geometry (radius/z/chamfer) drives active contact | GAP | tipShape label-only string; no TipProfile model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 16 | Kreis Sliding Frame | Metal Frame slides +-60deg relative to Core, hard-stop recoil | GAP | No frameRotation field anywhere in src | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spin.ts:65`<-`assembler.ts:175` |
| 17 | Diablo X-Drive Detents | Centrifugal detent state machine swaps tip layer | GAP | No detent logic; rpm has zero physics effect | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 18 | Phantom B:D Mass+Bearing | I computed from part mass x radius^2; dual-bearing split | GAP | No computeMomentOfInertia anywhere; no bearing state | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 19 | Jade I-Modulation/RB | Spin-dependent ball radius changes I, conserves L | GAP | No GravityBallState, no L=I*w conservation | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` / `spin.ts:65`<-`assembler.ts:175` |
| 20 | Blitz Wing Alignment | Wing count sets impulse-per-hit and recoil damping | GAP | No ContactPointGroup; no bey-bey impulse | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 21 | Fusion Viscoelastic Wheel | Staged rubber-then-metal contact, energy destroyed as heat | GAP | No two-phase/viscoelastic collision model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 22 | SWD Fixed Stack | Tilt-dependent layer switch Sharp center vs WD ring | GAP | No layer-switch-by-tilt; tipShape flat string | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 23 | Track Height Variable | h_com change shifts orbit radius, torque arm, contact height | GAP | No per-part height feeding tilt/friction | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 24 | Gravity Destroyer CP Override | Energy Ring mode swaps active CP material/restitution | GAP | No EnergyRingMode/CPOverride model | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:65`<-`assembler.ts:175` |
| 25 | Destroyer Coverage Spectrum | Coverage fraction blends plastic/metal CP and I | GAP | No coverageFraction; no per-part I | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 26 | R145 Wing Scraping | Spin-track wings become active floor/opponent contact | GAP | No track-as-contact-surface geometry | MECH OK | authorable |
| 27 | WB Plastic Sphere | Sphere radius sets tilt-dependent contact radius | GAP | No spherical contact radius model | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 28 | Twisted Imbalance Wheel | Max-I ring + static imbalance forced vibration | GAP | No static-imbalance vibration or part-based I | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 29 | Jade Dual-Element Balls | Steel ball + rubber cushion change migration timing | GAP | Gravity-ball system absent from src | MECH OK | `looseMass.ts:78`<-`BeySystem.ts:237` |
| 30 | L-Drago Rubber Spin-Steal | Rubber ring amplifies opposite-spin friction steal | GAP | No spin-steal code; no bey-bey contact | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 31 | L-Drago Rush/Assault Control | No-rubber ring falsifies mode-geometry-only claim | GAP | No energy-ring material model to falsify | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 32 | Meteo Composite Contact | Wheel+ring protrusions interleave into one contact profile | GAP | No composite multi-part contact resolver | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 33 | XF Wide Flat Tips | 4-tab discrete contact drives flower/tornado regimes | GAP | tipShape string only; no tab-count pattern | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spin.ts:65`<-`assembler.ts:175` |
| 34 | MF Metal Friction Paradox | Low kinetic mu metal gives more movement despite high static | GAP | One mu per tip label; no static/kinetic split | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 35 | C145 Centrifugal Wings | Wings extend outward with spin, buffer impact | GAP | No spin-dependent geometry extension | MECH OK | authorable |
| 36 | Spike Reference Tip | Near-zero r_cp tip = max torque-arm destabilization | GAP | No r_cp-from-tip torque model | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 37 | W105 Aerodynamic Fin | Fin lift negligible; track reduces to mass/I only | GAP | No per-track I contribution | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 38 | R2F Directional Star | Rightward curve creates edge-vs-face asymmetry by spin dir | GAP | No spin-direction-dependent contact regime | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 39 | L-Drago Destructor Core | Rubber Core absorbs impulse after Metal Frame contact | GAP | No internal damping-layer model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 40 | L-Drago Guardian Armor | Armor-shell Frame + full-rubber Core two-layer absorption | GAP | No two-layer absorption or per-part restitution chain | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 41 | MB Double Friction Paradox | Metal sphere on metal base: low decay + ring-out risk | GAP | No spherical+metal contact model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 42 | Face Bolt CoM Elevation | Top-mounted mass raises h_com, amplifies tilt quantities | GAP | No per-part mass/height contributing to h_com | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 43 | Bit Chip Burst Trigger | Structural failure (chip loss) ends match instantly | GAP | Health/burst never checked against zero | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 44 | Fang Alternating Protrusions | Wide/narrow protrusions + hollow-face reversal | GAP | No per-protrusion radius/angle model | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 45 | HMS Aero Core/Wing | Small-diameter gyro stiffness + negligible helicopter drag | GAP | No HMS-scale I model; no drag force | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 46 | CWD Chain Attacker Paradox | Free-spin weight disk drags bey more than it damages | GAP | No free-spinning bearing-drag model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 47 | Rubber Weight Core | Cylindrical rubber WD+RC, spin-direction deflection | GAP | No cylindrical-contact deflection model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 48 | Advance Defenser Rollers | Rollers replace sliding friction with rolling resistance | GAP | No roller/rolling-resistance primitive | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 49 | Upper Fox/CWD/Bunshin | Ramp blocking, eccentric wobble, spring body split | GAP | No ramp/eccentric/two-body-split systems | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 50 | Circle Upper Tangential | Near-circular frame tangential deflection + mould I variance | GAP | No tangential-deflection or mould-I variance | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 51 | Spring Core Launch Bounce | Spring bounce at launch + axis discontinuity tip wander | GAP | No launch-bounce or tip-wander model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 52 | Metal Spike Hertzian Stress | Point-load stress dents plastic floor (stadium wears) | GAP | No Hertzian contact or floor-wear; floor static | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 53 | Hades+BD145 Gap-Filling | Mode orientation fills gaps or scrapes floor | GAP | No multi-part gap-filling/scraping geometry | MECH OK | authorable |
| 54 | Defense Spike Convex Ring | Convex ring deflects hits tangentially at any point | GAP | No convex-contact-normal deflection | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 55 | L-Drago I Mode Selector | Plastic-only selector shows negligible difference w/o rubber | GAP | No mode-selector CP or material-based mu | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 56 | HFS Between-Battle Mode | Disassembly-only mode change, 4th timing category | GAP | No mode-timing categories or disassembly state | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 57 | H145 Hyper-Extended CP | Horn CP radius exceeds wheel radius, larger torque arm | GAP | No per-part r_cp exceeding wheel radius | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:65`<-`assembler.ts:175` |
| 58 | GB145 Ball Migration | Balls migrate at track height; denies opponent height contact | GAP | No ball-migration or height-denial model | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 59 | D125 Aero Ring I-Modifier | Ring adds I with negligible aerodynamic drag | GAP | No per-part I contribution or drag model | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 60 | Coating Spike Binary Switch | Step-function regime switch at tilt threshold | GAP | No binary tilt-threshold contact switch | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 61 | Flash Oval I Anisotropy | Oval protrusions give anisotropic I; mode rotates node count | GAP | I is a single scalar; no anisotropic I | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 62 | 230 Track Extreme h/r | Tall track denies tall-attack reach, adds structural ribs | GAP | No height-denial geometry or per-track I | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 63 | WD Balance Recovery Paradox | Wide disc friction torque causes overshoot oscillation | GAP | No balance-recovery feedback loop | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `spin.ts:65`<-`assembler.ts:175` |
| 64 | TR145 Rolling Resistance | Triple rollers give life-after-toppling | GAP | No roller/rolling-resistance primitive | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 65 | W2D Spike Wear Transition | Wear lowers theta_switch; disc improves LAD on topple | GAP | No tip-wear model or LAD-on-topple contact | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 66 | RDF Three-Regime Tip | Center spike -> rubber flat -> plastic rim, 3 tilt regimes | GAP | No multi-regime tilt-boundary contact model | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 67 | Duo Deliberate Imbalance | 90deg mode rotation switches isotropic I vs eccentric attack | GAP | No F_imb=m*d*w^2 model; I scalar not anisotropic | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 68 | HF Annular Contact | Hole reduces pivot friction vs full flat, raising stamina | GAP | No annular-vs-full contact-area distinction | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 69 | WA130 Free-Spin Wing Scrape | Free-spinning wings scrape floor, draining spin | GAP | No free-spin wing/bearing-drag model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 70 | Under Frame Disc-to-Layer | Downward protrusions strike opponent layer's bottom face | GAP | No disc-to-layer vertical-strike geometry | MECH OK | authorable |
| 71 | Atomic Dual-Mode Ball/Ring | Free-rotating ball + LAD ring dual mode | GAP | No free-rotating-component or LAD-ring model | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 72 | Ignition Motor Restore | Impact-triggered spring circuit powers motor, restores spin | GAP | rpm never decays or regenerates | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 73 | Loop Spin-Velocity Roller | Rollers stabilize at high spin, brake at low spin | GAP | No spin-velocity-dependent roller switch | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 74 | Spring Core Precession Advantage | Tall CoM raises precession rate, aids same-spin stamina race | GAP | No h_com-driven precession calc | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |

**CS1 internal contradictions found (5 new):** (a) Case 14's jump force `F_up ~ m*dh*w^2` in prose vs `w^2*dh*0.5` in its own code -- factor-2 disagreement; (b) Case 12's burst condition `B.spin < B.spin * 0.3` is **always false** -- burst can never fire as written; (c) Case 17 declares detent transitions "ONE-WAY... never goes back" but its code does `(currentDetent + 1) % 3`, wrapping back to the start; (d) Case 9's pivot/slide formula does not support its own conclusion (sharp tip asserted to pivot "due to POINT CONTACT geometry, not high friction" -- a mechanism absent from the given formula); (e) Case 18's `BDState` interface omits `I_casing`, which `tickBD()` then references. **Tag usage note:** only `[CONFIRMED]`/`[ESTIMATED]` ever appear (21 times); the four other tags CS1's own convention mandates (`[FACT]`, `[INFERRED]`, `[ILLUSTRATIVE]`, `[CUSTOM BUILD]`) are never applied to any of the hundreds of numbers in Cases 18-74, leaving their precedence undefined.

## LEDGER PART 2  -  CS2 HMS + Gen-1 SG-era parts (Cases 75-155, 1025-1040, 1088, 1125-1126)

~100 cases. Pattern: **PART** where the case is purely "a disc/ring of this mass and shape" (the builder handles it, nothing composes `I`); **GAP** the moment a named mechanic appears.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 75 | D Gear spring-sliding gear | Impact-triggered spring slide redirecting impulse | GAP | gimmickType set never read; no collision impulse | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 76 | Metal Attacker AR under-mass | Restitution impulse, rebound vs follow-through | GAP | bey-vs-bey collision absent | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 77 | Grip Flat Core rubber tip | Tip-material friction driving orbit radius, ridge grip | GAP | No per-part tip friction | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 78 | Metal Spiker spike geometry | Contact pressure and deflection angle at equal mass | GAP | No contact-normal model | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 79 | Circle Wide spoke-rim WD | MoI per gram; spin-decay from torque/I | PART | Geometry+mass authorable; no I sum, no decay | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 80 | Grip Flat Core Ultimate Mode | Softer rubber compound raising mu and circuit speed | GAP | No tip compound/mu field; no traction solver | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spin.ts:65`<-`assembler.ts:175` |
| 81 | Metal Spring all-metal perimeter | Per-material restitution, mutual rebound, graze steal | GAP | No restitution or spin transfer | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 82 | Circle Heavy solid-ring WD | Solid-ring inertia vs mass; KO velocity threshold | PART | Ring mass/radius buildable; inertia and KO uncomputed | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 83 | Wolf Crusher symmetric recoil | Spin-symmetric contact angle; recoil decomposition | GAP | No contact normals or recoil | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 84 | Bearing Core ball-bearing tip | Bearing decoupling to near-zero tip torque; LAD | GAP | No bearing-friction model; freeSpin render-only | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 85 | Advance Balancer serrated rim | Gear-tooth spin steal; rattle energy leak | GAP | No spin transfer or opposite-spin velocity | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 86 | Circle Balance bridge WD | Fill-factor inertia midpoint | PART | Geometry/mass authorable; fill-factor I never derived | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 87 | Metal Semi-Flat Core metal tip | Metal low-mu tip; wider tip lowers pressure | GAP | Tip mu/pressure unmodelled | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 88 | Seagon Attacker hook upper attack | Hook angle splitting lift and ring-out | GAP | No vertical impulse; tiltAngle static | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 89 | Upper Fox mould-tolerance ridge | 0.2mm ridge width changing catch depth and lift | GAP | No sub-mm contact geometry | MECH OK | authorable |
| 90 | Smash Leopard height-matched tabs | Layered pre-strike impulse; contact-height window | GAP | No contact heights or layered impulse | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 91 | CWD Needle Attacker free-spin ring | Free ring decoupling impulse from combo mass | GAP | freeSpin cosmetic; no decoupled inertia | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 92 | CWD mold hidden mass variation | Hidden 2g shifting inertia and required KO impulse | PART | Per-part mass editable; inertia/KO never derived | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 93 | Tornado Change Core centrifugal | RPM-threshold slider switching sharp/hole-flat tip | GAP | rpm never decays; gimmick unread | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 94 | Turtle Crusher gap catch | Gap wedging delivering a second sub-impulse | GAP | No gap/wedge detection | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 95 | Aero Core and Aero Wing | Aerodynamic lift/drag; CoM-height precession | GAP | No aerodynamics; precession absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 96 | Rubber Weight Core WD+RC | Rubber torus surface-velocity spin steal | GAP | No spin-steal or decay | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:65`<-`assembler.ts:175` |
| 97 | Samurai Upper three contact modes | Spin-direction mode bifurcation; late-game tilt per hit | GAP | No contact modes; tiltAngle static | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 98 | Battle Change Core impact cam | Force-threshold cam flipping tip between modes | GAP | No impact-force trigger; gimmickStrength unread | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 99 | Jumping Base spring launch | Spring vertical impulse; tip compliance tilt restore | GAP | Arena launch traps exist; no part spring | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 100 | Left Spin Gear Shells | Chirality, MWG rattle damping, compatibility gating | GAP | spinDir stored; no rattle/compat/counter-spin | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:65`<-`assembler.ts:175` |
| 101 | Metal Change Base metal pin | Launch-energy orbit bifurcation; ridge catch; wear | GAP | No launch-energy solver, wear, or ridge catch | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 102 | Tiger Defenser sloped recoil | Slope filtering recoil; spike-bridge fracture stress | GAP | No contact slope, recoil, or breakage | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 103 | Reverse Dragon outward angle | Outward angle amplifying recoil; mould fracture | GAP | Recoil and fracture both absent | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 104 | Eight Wide octagonal WD | Octagon inertia; WD-radius contact-exposure condition | PART | Polygonal mass buildable; shielding logic absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 105 | Storm Grip Base inverted tip | Hertzian patch radius; tip inversion; AR height band | GAP | No Hertz contact, tip modes, height contact | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 106 | Dragon Head sub-minimum AR mass | Rebound fraction above 1 at 2.6g; WD coverage test | GAP | No impulse/rebound; no coverage check | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 107 | Wide WD rounded rim | Rim rounding converting impulse to tangential noise | GAP | No rim-tangent decomposition | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 108 | Grip Base rubber traction | Rubber circuit speed vs 3.1x spin-drain budget | GAP | No spin drain; tip mu absent per part | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 109 | SG Semi-Flat Base shallow dome | Dome patch radius; Archard wear; precession drag | GAP | No wear or precession | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 110 | Jumping Base Trygle skis | 3.6deg critical tilt; ski positive-feedback tumble | GAP | tiltAngle static; no ski-floor contact | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 111 | Triple Wing near-tangential | Spin-symmetric contact efficiency; per-hit retention | GAP | Contact angles and per-hit loss unmodelled | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 112 | SG Spring Version Core | Axial spring extension raising CoM; precession swing | GAP | No spring compliance; precession absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 113 | Defense Grip Base dual-mode tip | Two-ended tip modes; periodic grip interruption | GAP | No tip modes or periodic contact loss | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 114 | Screw Zeus SAR dumbbell | SAR phase-slip; 340 RPM threshold; overhang block | GAP | No free-SAR phase or speed threshold | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 115 | Flying Defense AR Hasbro | Circular-rim zero smash; spin equalisation | GAP | No rim contact angle or spin equalisation | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 116 | Square Edge jagged smash | Tooth contact frequency; sliding impulse; dual-vector | GAP | No tooth contacts or sliding impulse | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 117 | SG Full Auto Clutch shaft | Bearing-decoupled vs locked shaft modes; spin stealing | GAP | No bearing model, mode locking, or steal | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 118 | Full Auto Clutch Base | Centrifugal clutch RPM threshold switching tip mode | GAP | rpm never decays so threshold unreachable | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 119 | SG Auto Change Base | Impact-triggered tip retraction; left-spin hop self-KO | GAP | No impact trigger or vertical hop | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 120 | Double Snake steep contact angle | 55deg contact efficiency; under-reach obstruction | GAP | No contact-angle efficiency or reach | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 121 | Eight Balance octagonal WD | Polygon effective-radius inertia deficit | PART | Octagonal mass authorable; effective-radius I absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 122 | SG Auto Change Version Core | Height-gated compatibility; 0.05g sub-threshold inertia | GAP | No height compat check; mass has no I consumer | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 123 | Upper Wolf steeper slope | 14deg contact efficiency; GPS fracture threshold | GAP | No contact efficiency or fracture model | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 124 | Metal Saucer spin-steal arc | Shallow saucer glance accumulating opponent drain | GAP | No spin steal; rpm cosmetic | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 125 | Spiral Upper omnidirectional | Spiral slope giving 170deg constant upper window | GAP | No contact window or upper lift vector | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 126 | Upper Dragon shared frame | Caul blocking right-spin slope; exposed metal smash | GAP | No caul layering or spin-direction faces | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 127 | Devil Crusher circular caul | Near-circular deflection; minor left-spin steal | GAP | No deflection angle or steal transfer | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 128 | Knight Crusher blunt nubs | 90deg nub contact: equal smash and self-recoil | GAP | No contact normal or self-recoil | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 129 | God Smasher wide caul | Caul-reduced force smash; ABS absorption factor | GAP | No force-smash vector or absorption | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 130 | Smash Phoenix wide wings | Wider contact arc increasing smash per pass | GAP | No contact-arc sampling or smash impulse | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 131 | CWD God Ring near-circular | High-inertia circular ring; wobble-free distribution | PART | Ring mass buildable; I/wobble not simulated | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 132 | CWD Devil Saucer free-spin spikes | Free spikes dissipating impulse; self floor drag | GAP | freeSpin cosmetic; no dissipation or drag | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 133 | Wing Attacker CWD radius extender | Wing tips extending attack radius beyond AR | GAP | Wings buildable; no contact radius or impulse | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 134 | Metal Change Core angle switch | Tilt-angle threshold switching sharp tip to flat collar | GAP | tiltAngle static; no angle-triggered switch | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 135 | Manual Change Core selector | Pre-battle three-tip selection changing mu and decay | GAP | No tip modes or per-tip friction/decay | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 136 | Shooter Change Core Alpha | Spin-direction tip preset; WD-at-bottom upper-mode gap | GAP | spinDir stored, no tip preset or stack physics | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 137 | Shooter Change Core Gamma | Spin-direction preset with sharp left-spin defence tip | GAP | No tip deployment or per-tip decay | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 138 | Metal Weight Grip Core | Hardened rubber flat + metal ballast recoil resistance | PART | Heavy tip authorable; recoil resistance unmodelled | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 139 | Free Shaft Core decoupled shaft | Shaft-body isolation retaining spin on smash | GAP | freeSpin render-only; no per-hit retention | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 140 | CWD Defense Ring circular | Near-circular 19g inertia; universal compatibility | PART | Ring geometry buildable; I and compat unmodelled | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 141 | Metal Upper paired slopes | Two discrete slope faces giving 120deg upper window | GAP | No slope faces or contact windows | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 142 | Jiraiya Blade heaviest HMS AR | Symmetric dual-spin smash; AR inertia cuts self-recoil | GAP | No smash impulse or self-recoil | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 143 | Metal Ape upper attack | 19g upper-attack fraction from slope geometry | GAP | No upper-attack fraction or slope contact | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 144 | Spark Dragon free-spin plastic | Free-spin shell absorbing 90% impulse; narrow reach | GAP | freeSpin cosmetic; no absorption | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 145 | CWD Free Cross four arms | Four-arm inertia with fourfold wobble asymmetry | PART | Cross geometry authorable; I and wobble absent | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 146 | CWD Free Survivor smooth | Smooth circular inertia with low contact recoil | PART | Disc geometry buildable; recoil and I absent | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 147 | CWD Free Saucer shallow | Saucer CWD spin steal needing height-mismatch contact | GAP | No height-based contact or steal | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 148 | Flat Core Original baseline | ABS flat tip mu and radius driving aggressive decay | GAP | No per-part tip mu/radius; no decay | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 149 | Flat Core New Revision | Smaller tip radius + centre screw lowering decay | GAP | Tip radius has no physics consumer | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 150 | Metal Weight Flat Core | Largest flat diameter trading control for decay | GAP | No tip-diameter friction coupling | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 151 | Reverse Defenser CWD | Smooth circular CWD lowering contact recoil | PART | Circular profile buildable; recoil unmodelled | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 152 | Bearing Core 2 rubber bearing tip | Wear-dependent rubber tip inverting friction | GAP | No wear state, bearing model, or tip friction | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 153 | Sharp Core mold-dependent sharpness | Mold tip radius changing mu and spin retention | GAP | No tip radius/mu fields | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 154 | Metal Sharp Core variants | Metal sharp vs Three Kingdoms flat tip split | GAP | No tip variants or friction | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 155 | Semi-Flat Core launch-dependent | Launch RPM changing effective mu and movement mode | GAP | Launch rpm cosmetic; no mu coupling | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 1025 | Neo Right Spin Gear Shells | Cavity/lug compatibility gating; HMC inertia gain | GAP | No part-compatibility rules; I never summed | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1026 | Metal Weight Core zinc insert | Central zinc mass raising KO threshold marginally | PART | Insert mass authorable; KO threshold uncomputed | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 1027 | Normal Core hollow Neo core | Minimum Neo mass; tip-shaft bore fit constraint | GAP | Hollow geometry fine; no bore-fit checks | MECH OK | authorable |
| 1028 | Regular SG Core Part | Minimum-mass core; shaft/bore rattle incompatibility | GAP | No shaft-bore fit or rattle wobble | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1029 | Right Spin Shells plus MWG | Clearance-gap rattle power loss; Neo core lock-out | GAP | No clearance/rattle dissipation or gating | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1030 | SG Wing Base sub-AR slot | SAR seating; clip scrape torque; soft-tip drain | GAP | No sub-part slots, scrape torque, or drain | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1031 | SG Sharp Base tall body | Critical stability RPM from CoM height; tilt per hit | GAP | No critical-RPM; tiltAngle never updated | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1032 | AR War Lion two-wing oval | Spin-symmetric low recoil; WD-radius obstruction | GAP | No recoil or radius-obstruction logic | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1033 | Sub AR War Lion neutral filler | Gap-wedge entry impulse amplification | GAP | No gap detection or wedge dwell impulse | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1034 | Flying Defense AR Takara | Spin-direction aero downforce altering normal force | GAP | No aerodynamics or normal-force coupling | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1035 | Jumping Base 2 dish grind | Free-spin disc grinding; scrape threshold; spring jump | GAP | freeSpin cosmetic; no scrape or jump | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1036 | Ten Heavy heaviest legal WD | Mass-vs-radius inertia; impulse per collision | PART | Heavy annular disc buildable; I/impulse uncomputed | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1037 | Flame Wing AR spin fragility | Notch-root stress fracture per spin direction | GAP | No part stress/fracture or directional faces | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1038 | SG Triple Change Core | Friction-indexed three-tip selector; ridge hopping | GAP | No tip selector, detent wear, or ridge impulse | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 1039 | Flame Change Base TCV shell | Dedicated-core compatibility; LAD rolling decay | GAP | No compatibility gating or LAD phase | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1040 | Metal Balls rolling tip + ballast | Hertz rolling-resistance tip; point-mass ballast I | PART | Sphere parts buildable; no rolling contact | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1088 | Nexus eight-blade two-tier disc | Blade contact rate, mass-at-radius I, per-blade impulse | GAP | No I composition, no bey-bey impulse | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1125 | Trygle full assembly | Summed part inertia, launch RPM, ski tilt collapse | GAP | No I summation, decay, or tilt instability | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1126 | Wyborg full assembly | Assembly inertia, two-mode tip decay, self-KO orbit | GAP | No mode switching, decay, or KO detection | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |

**CS2 contradictions (18 found).** Highlights: header forbids rubber mu>0.50 and ABS mu!=0.17, yet Cases 77/80/87/96/108/113 build on mu_ABS 0.38-0.50 and mu_rubber 1.2-2.81 -- the exact error the header warns against. Case 84 leaves an abandoned calculation in place (tau_bearing first 0.10 N*m, then "Wait -- recalculate" gives 6.6e-7 -- a 10^5 error left in the text). Case 118 argues the clutch direction three ways ("Wait...", "Actually...", "No.") and resets its threshold from 170 to 31.4 rad/s by assuming the answer. Case 1034 reports `30.8 radians` as "30.8 degrees per hard contact". Case 1036 prints three failed derivations before its answer ("Dw = 2445 rad/s <- impossible"). Ten Heavy's inertia is given as 5.14e-6, 5.2e-6 and 9.04e-6 across three cases; Heavy Metal Core mass as 14.5g, ~4.5g and "~8-9g". The overflow assembly cases (1125/1126) contradict the part masses of the very cases they cite (Triple Wing 10.7g vs Case 111's 4.4g; Eight Balance 8.5g vs Case 121's 14.1g). Cases 153-155 place tip spin-decay at 0.002-0.012 rad/s^2 while every other case puts the same tips at 5-173 rad/s^2 -- a 10^4 scale break.

## LEDGER PART 3  -  CS3 Gen-1 Plastic SG/EG/CEW parts (Cases 156-187, 911-950)

72 cases. **Almost entirely GAP** -- this file is dominated by Engine Gear, CEW and Magnacore mechanics, all three of which are absent.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 156 | Neo SG Double Bearing Shaft | Three-stage bearing decoupling + wide-tip restoring torque | GAP | No bearing model; freeSpin render-only | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 157 | Cross Attack Support Parts | Radial tip contact angle ~80deg recoil | GAP | bey-vs-bey collision absent | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 158 | Customize Bearing Base | Smooth-shell upper absorption; three shaft regimes | GAP | No collision normals or clutch sim | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 159 | Strike Turtle AR | Arc-distributed contact angle averaging smash vs recoil | GAP | No bey-vs-bey collision | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 160 | SG Bolt Base | Mid-radius screw ballast inertia; tip drag; LAD onset | GAP | No per-part I composition or decay | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 161 | Double Attacker AR | 8deg flat-face smash and self-ring-out recoil travel | GAP | No collision or recoil/translation coupling | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 162 | Revolver Attack WD | Annulus-minus-holes mass/inertia + tab recoil events | PART | Mass/geometry authorable; no MoI or recoil | MECH OK | authorable |
| 163 | Twin Guard SP | Bidirectional mount; wing-interrupted LAD friction | GAP | No LAD/precession; orientation has no consumer | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 164 | Corona Saber AR | Reach moment + elastic return against heavy opponent | GAP | No second bey or restitution exchange | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 165 | Triple Beak AR | Symmetric bevel edge giving omni-directional smash | GAP | Spin direction has no physics effect | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 166 | Reverse Wolf (Hasbro) | Metal rim inserts; LS/RS face inversion | GAP | Spin sign unsimulated; no inserts-at-radius I | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 167 | Wide Defense WD | Thin-ring peripheral inertia + rounded low-recoil rim | PART | Ring mass/shape OK; no MoI, recoil, or LAD | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 168 | Wide Survivor WD | Max radius inertia vs mass; lower LAD onset spin | PART | Geometry authorable; LAD needs absent precession | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 169 | Spark Disk WD | Flint protrusion recoil; sandpaper friction; abrasion | GAP | No per-part surface friction, wear, or recoil | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 170 | Star Attack WD | Star-void inertia; apex recoil; 5-fold phase alignment | GAP | No MoI composition or contact-phase alignment | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 171 | Wide Attack WD | Two-zone inertia; six hexagonal corner recoil events | PART | Disk mass/profile only; no I or recoil | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 172 | Penta Wing AR | Five long LS slopes vertical impulse; RS obstruction | GAP | No vertical impulse; tiltAngle static | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 173 | Smash Turtle AR | Contact frequency + Force Smash slope tilt accumulation | GAP | Tilt never updated; no cumulative perturbation | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 174 | Upper Dragoon AR | RS/LS slope angles; net spin-steal minus recoil | GAP | No spin transfer, decay, or opponent entity | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 175 | SG Roller Base | Protrusion/roller radial normals multiply recoil | GAP | Rollers unmodelled; freeSpin render-only | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 176 | Lizard Blocker AR | Roller first-contact probability; LS frill smash | GAP | No contact-angle dispatch; collision absent | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 177 | Roller Defense Ring | Recessed bearing roller; bowl-orbit sizing; fatigue | GAP | Bowl OK but no rollers, bearings, or fatigue | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 178 | Twin Horn AR | Net spin-steal from (mu - sin phi) per contact | GAP | No spin-steal path; rpm never changes | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 179 | Fin Tector SP | Fin orientation recoil modes; peripheral inertia | GAP | SP orientation unmodelled; no MoI | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 180 | Switch Metal Ball Base | Tilt-growing ball contact radius; hinge mass drift | GAP | Tip contact radius not a physics quantity | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 181 | Wing Attack Ring | Centrifugal spring-wing deployment; compliant contact | GAP | Spring/centrifugal mechanisms absent | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 182 | Spark Attack Ring | Friction-coupled free-spin shell; eccentric drift | GAP | freeSpin cosmetic; no coupling torque | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 183 | Cross Spiker AR | Triangle pre-deflection reducing spike engagement | GAP | No multi-surface contact ordering | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 184 | Fire Cracker AR | Oval radius variance; protrusion height selectivity | GAP | Geometry OK; contact height matching absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 185 | Heavy Metal Core | Core mass raising effective collision/translation fraction | PART | Per-part mass supported; no collision | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 186 | Heavy Metal Gear Shells | Tip height raising stability spin threshold; no LAD skirt | GAP | No stability threshold; rpm inert | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 187 | First Clutch Base (Metal Driger) | Launch-time spring boost, tip skip, self-KO risk | GAP | EG spring absent; no rpm boost or KO | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 911 | Whale Crusher AR | Slope angle splitting smash/upper impulse; spike recoil | GAP | No collision; impulse decomposition absent | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 912 | SG Flat Base | Plastic tip friction flower limit; LAD precession rate | GAP | No tip friction, precession, or decay | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 913 | SG Metal Sharp Base | Near-zero tip radius: zero restoring torque, tilt runaway | GAP | tiltAngle static render pose | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 914 | Panther Head AR | Directional blade faces; opposite-spin velocity bonus | GAP | Spin direction and rpm have no consumers | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 915 | North Magnecore | Core mass recoil damping + magnetic polarity force | GAP | Magnetism absent; tipPolarity zero consumers | MECH OK | `fieldForce.ts:177`<-`BeySystem.ts:275` / `spin.ts:65`<-`assembler.ts:175` |
| 916 | South Magnecore | Inverted polarity; Magne Stadia repulsion deflection | GAP | No magnetic attract/repel; stadium magnets absent | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `fieldForce.ts:177`<-`BeySystem.ts:275` |
| 917 | SG Metal Flat Base (GDV) | Tip slip threshold converting recoil to translation | GAP | No tip friction threshold or wobble | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 918 | Dragon Breaker Core AR | SAR-dependent contact angles; wide-WD SAR pinning | GAP | No sub-AR layer or part-vs-part pinning | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 919 | Dragon Breaker Sub AR | Free-spinning SAR absorbing 14% of angular impulse | GAP | freeSpin render-only; no inertia sharing | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 920 | Volcano Change Base | Magnetic tip retention; minimal stack; LAD collapse | GAP | Magnetic retention absent; LAD absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `fieldForce.ts:177`<-`BeySystem.ts:275` |
| 921 | Tryhorn / Land Attack AR | Tread wall angle recovering smash + spin equalisation | GAP | No tread faces or spin equalisation | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 922 | Cross Griffon AR | Wing-count contact frequency; edge pressure damage | GAP | Contact rate meaningless without collisions | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 923 | Dual Dragon AR | PC vs ABS stiffness; rounded two-spin contact angles | GAP | No material properties or compliance | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 924 | Fantom Grip Base | Narrow hard-rubber torque threshold; flower ceiling | GAP | No tip friction/grip threshold or flower orbit | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 925 | Eight Attacker AR | Near-radial flat faces; rotational recoil fraction | GAP | No collision or rotational recoil | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 926 | Magne Flat Base | Base inertia; LAD angle; magnetic tip height offset | GAP | No MoI, LAD, or magnetic offset | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `fieldForce.ts:177`<-`BeySystem.ts:275` |
| 927 | Magne Flat Base Tip | Plastic tip friction; flange contact at 14deg tilt | GAP | Tilt static; no secondary contact surfaces | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 928 | SG Grip Base Tip | Rubber grip threshold; induced magnetisation; topple | GAP | No grip model; tipPolarity unread | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `fieldForce.ts:177`<-`BeySystem.ts:275` |
| 929 | Sonic Tiger AR | Segment contact angles; gap-edge recoil spikes | GAP | No segmented contact surfaces | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 930 | SG Metal Flat Base | Truncated-cone restoring torque scaling with tilt | GAP | No restoring torque; tilt never integrated | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 931 | Griffolyon Base (Hasbro) | Pole-bump LAD cap; shaft coupling negating free spin | GAP | No LAD or shaft coupling torque | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 932 | Cybernetic Dragon AR | Recoil torque against SG thread slip/stress limit | GAP | No part-joint stress or collision torque | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 933 | Spike Dragon AR | Rotational recoil fraction from AR-to-combo inertia ratio | GAP | No per-part inertia ratios | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 934 | Magne Weight Disk | Uniform vs rim inertia; magnet repulsion; bearing drag | GAP | No MoI, magnetism, or bearing drag | MECH OK | `fieldForce.ts:177`<-`BeySystem.ts:275` / `spin.ts:65`<-`assembler.ts:175` |
| 935 | Reverse Attack SP | Arc-coverage contact probability; LAD onset | GAP | SP coverage and LAD unmodelled | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 936 | Customize Grip Base | Rim-riding LAD after tip destabilisation | GAP | No tilt transition to rim contact | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 937 | Customize Grip Base Tip | Rubber grip threshold; ridge rollover; rolling resistance | GAP | No rolling resistance or ridge interaction | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 938 | Upper Claw AR | Two-section slope vertical impulse + overhang reach | GAP | No vertical impulse or opponent lift | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 939 | Ten Balance WD | Tab mass inertia; bowl-wall clearance at wall angle | PART | Bowl profiles OK; MoI and per-hit loss absent | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 940 | Upper Attack Support Parts | Slope orientation sign flipping vertical impulse | GAP | SP mounting orientation has no consumer | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 941 | Customize Metal Change Base | Spin-rate-triggered tip phase switch and idle drag | GAP | No rpm-dependent state; rpm fixed | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 942 | Customize Metal Sharp Base | Collar engagement at 29deg tilt; lowest idle drag | GAP | Tilt static; no idle drag accounting | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 943 | Mountain Hammer AR | Mass-weighted smash; rotational recoil; elevated contact | GAP | No collision, recoil partition, or height match | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 944 | Defense Ring SP | LAD onset angle, minimum LAD spin, passive low recoil | GAP | No LAD/precession or SP layer | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 945 | Customize Clutch Change Base | Centrifugal clutch inverting attack/survival order | GAP | Clutch absent; no spin-threshold triggers | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 946 | Cross Dranzer AR | 4-fold spin neutrality; no-overhang LAD continuity | GAP | Spin direction unsimulated | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 947 | Cross Survivor SP | Bevel effective friction LAD; tab-to-AR fold alignment | GAP | No SP bottom-face friction or LAD | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 948 | Triple Attacker AR | Per-wing contact angles with outer-diagonal penalty | GAP | No per-face collision geometry | MECH OK | authorable |
| 949 | Ten Wide WD | Edge-fraction inertia; tab recoil disrupting orbit | PART | Disk mass/shape authorable; no MoI or recoil | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 950 | Double Bearing Core | Two-stage bearing coupling torque attenuation | GAP | No bearings; freeSpin render-only | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |

**CS3 contradictions (19 found).** The friction-value violation again: header fixes rubber 0.50 / plastic 0.17 and explicitly flags 0.85 and 0.3-0.5 as errors, then Cases 912/917/920/928/936 use rubber 0.85 and Cases 912/921/927/930 use plastic 0.35. Case 915's title asserts "the Gimmick Force Is Irrelevant in Play" while its own verdict calls the same force "a significant attraction/repulsion effect" at 19.6% of tip normal force -- and its code returns a value **36x smaller** than its prose. Case 916's polarity derivation contradicts itself in place ("South Magnecore attracted to south pole? No -- ... Wait: ... Correction from notes:") and is settled by assertion. Case 912's arithmetic is off by 10^3 (Omega reported 2205 rad/s where inputs give ~2.2). Case 921 states "There are no V-shaped grooves" and then builds its entire model, title and TypeScript on "V-groove wall angle b = 40deg". Wide Defense inertia is stated **four** different ways across the file (3.97e-6 / 6.39e-6 / 5.1e-6 / 7.02e-6); Defense Ring LAD spin three ways; Wide Survivor, Ten Heavy and Ten Balance each twice. Launch spin baseline is incoherent across the file: 800-1000 rad/s (186-187), 300 (914/922), 150-400 (932/943), and a 35g bey (942) against the 45g used everywhere else.

## LEDGER PART 4  -  CS4 EG/CEW, anime-only, Magnacore ARs, A-F series (Cases 189-285, 1097, 1281-1288)

106 cases. Note the **PART-heavy** pattern here: the A-F series Attack Rings are mostly "a shape with this mass", so the builder covers them -- what is missing is the collision that would make their shape matter.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 189 | Eight Spiker AR | 8-fold smash/recoil split, spin mirroring | PART | Geometry+mass OK; collision and recoil absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 190 | Left EG Metal Semi-Flat | EG spring torque vs tip friction torque | GAP | Engine Gear absent; gimmickType never read | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 191 | First Clutch Base (Driger G) | Launch-fire spring, LAD orbit, gyro stability | GAP | No clutch/spring; no precession or LAD | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 192 | Triple Tiger AR | Swept-face angle, overhang, upper vertical impulse | PART | Geometry OK; no contact impulse | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 193 | Right EG Metal Semi-Flat | Final Clutch w-threshold trigger, burst recovery | GAP | rpm cosmetic; no spring release | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 194 | Auto Change Base | Impact-force-triggered latched tip switch | GAP | No collision force or tip state machine | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 195 | CEW Circle Defenser | Tilt-dependent contact radius, edge-scrape drain | GAP | tiltAngle static; no decay integrator | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 196 | Double Horn AR | Symmetric blunt-corner angle, recoil-dominant | PART | Shape/mass OK; recoil and collision absent | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 197 | Right EG (Circle Defenser) | Tall CEW slot, clip retention, WD/AR elevation | GAP | CEW slot and EG body absent from part model | MECH OK | `looseMass.ts:78`<-`BeySystem.ts:237` |
| 198 | Normal Base (Rock Bison) | Always-on spring coupling, hit-recharge rewind | GAP | No spring energy state; gimmickStrength unread | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 199 | Normal Base (Wolborg 4) | Smooth-rim recoil floor, WD-rim LAD takeover | GAP | No recoil per contact or LAD contact logic | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 200 | Right EG (Circle Survivor) | Prong-keyed CEW lock, slot height, CoM stability | GAP | No CEW keying or CoM stability threshold | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 201 | CEW Circle Survivor | Free-spin bowl decoupling, 1.7% torque transmission | GAP | freeSpin render-only; no bearing coupling | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 202 | Star Wolf AR | Alternating nose/triangle paired contacts per rev | PART | 6-fold geometry OK; contact pairing absent | MECH OK | authorable |
| 203 | Final Clutch Base (Dranzer G) | Late burst into topple, precession orbit extension | GAP | Precession absent; no burst torque | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `burst.ts:109`<-`BeySystem.ts:436` |
| 204 | Wing Survivor AR | Sequential main-then-slope contact probability | PART | Geometry only; no contact sequencing | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 205 | Shield Hammer AR | Peripheral inertia vs 52deg recoil fraction | PART | Mass/radius OK; no MoI or recoil | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 206 | Right EG (Metal Ball) | Ball tip ridge bypass, two-way burst failure | GAP | No ridge interaction or spring | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 207 | CEW Metal Ball | Tilt-dependent ball contact radius, gyro restoring | GAP | tiltAngle never updated; no gyro torque | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 208 | Left Customize Engine Gear | Weaker spring impulse, rubber minimum orbit speed | GAP | Spring and tip traction both absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 209 | Right CG (Full Auto Clutch) | Centrifugal clutch release, bushing vs bearing | GAP | No centrifugal trigger or bearing model | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 210 | SG (MG Spring Version) | Spring jump height, telescoping shaft, CoM rise | GAP | No launch/jump impulse or shaft extension | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `spin.ts:65`<-`assembler.ts:175` |
| 211 | Final Clutch Base (Draciel G) | Orientation-dependent clutch tab trigger misfire | GAP | No clutch tabs or angular alignment state | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 212 | Dragon Saucer AR | Core+SAR radial shielding, stacked contact impulse | PART | Composite geometry OK; no sub-part layering | MECH OK | authorable |
| 213 | Dragon Saucer Sub-AR | Free-spinning gear ring absorbing ~80% impulse | GAP | freeSpin render-only; no force dispersal | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 214 | Survivor Ring SP | Peripheral mass I-per-gram, 120deg fin alignment | PART | Mass+radius OK; no MoI composition | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 215 | Right EG (Metal Flat) | V8 post-topple burst, wide-tip edge contact LAD | GAP | No topple dynamics, burst, or edge contact | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `burst.ts:109`<-`BeySystem.ts:436` |
| 216 | Final Clutch Base (Gaia Dragoon G) | Trigger timing aligned to topple threshold | GAP | No w-threshold triggers; rpm cosmetic | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 217 | Wing Upper AR | Rounded-edge variable phi, width-scaled recoil | PART | Geometry OK; variable contact angle unmodelled | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 218 | Gyro Engine Gear | Dual-rotor bearing isolation, independent dual spin | GAP | Single spin value; no two-body rotation | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 219 | Engine Stopper Base | Dual ripcord channels, LS launch, disc-catch stop | GAP | No launch direction system; EG internals absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 220 | CEW Metal Sharp | Ball-dome migrating contact radius, 23deg bevel arrest | GAP | tiltAngle static; no contact-radius-vs-tilt | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 221 | G Upper AR | Combined smash face + upper ramp impulse split | PART | Slope geometry OK; no vertical impulse | MECH OK | authorable |
| 222 | Left Engine Gear (Turbo) | High-power burst to lateral velocity by traction | GAP | No spring burst or traction conversion | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 223 | First Clutch Base (Dragoon GT) | Four-wing radial recoil, early activation | GAP | No clutch activation; recoil unmodelled | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 224 | CEW Metal Semi-Flat | Bevel contact radius vs tilt, friction tier | GAP | No tip friction tiers; tilt static | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 225 | Triangle Wing AR | Mirror-symmetric slopes, identical LS/RS impulse | PART | Symmetric geometry OK; upper impulse absent | MECH OK | authorable |
| 226 | Right Engine Gear (Reverse) | Counter-rotating tip force vs shell momentum | GAP | No tip spin separate from body; no spring | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 227 | Final Clutch Base (Dranzer GT) | Rotatable three-protrusion mode change, CoM shift | GAP | No part mode-change state or CoM | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 228 | CEW Metal Change | Subtle-point friction tier, shoulder contact at tilt | GAP | No tip friction; tilt contact migration absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 229 | Gigantic Claw AR | Dead-area contact fraction, upward smash, inversion | PART | Claw geometry OK; upper force absent | MECH OK | authorable |
| 230 | Final Clutch Base (Gigars) | 20-spike perimeter recoil density, clutch burst | GAP | No spike contact rate, recoil, or clutch | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 231 | CEW Light Sharp | POM friction + free-shaft bearing load decoupling | GAP | No bearing decoupling or material friction | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 232 | Core AR: Holy Despell | Tilt-scaled protrusion hit probability, SAR jamming | GAP | tiltAngle static; no contact probability | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 233 | Sub AR: Screw Zeus | Fixed-vs-free SAR, w^2-scaled contact energy | GAP | freeSpin render-only; no rotational KE from rpm | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 234 | Right CG (Free Shaft) | Two-bearing isolation LAD, shaft substitution modes | GAP | No bearings or LAD; freeSpin visual | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 235 | Right CG Free Shaft Shaft | Casing height stacking, shaft-casing scrape friction | GAP | No stack-height rules or part-on-part friction | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 236 | First Clutch Base (Zeus) | Heaviest EG base mass WBD, CoM height, clutch | GAP | Mass settable; no CoM/topple torque or clutch | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 237 | Andre's Yak (anime-only) | Yin-yang ball pocket, axis inversion, AR height mode | GAP | No ball race, axis inversion, or AR tiers | MECH OK | `looseMass.ts:78`<-`BeySystem.ts:237` |
| 238 | Sharkrash AR | Convex deflection vs smash with COR; tilt-streak | GAP | No restitution or tilt dynamics | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 239 | Cyber Dranzer (anime-only) | Face-width contact duration; sting-tip orbital limit | GAP | No contact duration or grip ceiling | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 240 | Cross Fang AR | Near-tangential thin contact, tip exposure beyond WD | PART | Thin geometry OK; contact angle absent | MECH OK | authorable |
| 241 | Cyber Driger (anime-only) | Effective contact mass from distribution (I/r^2) | GAP | No per-part MoI composition anywhere | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 242 | Spiral Change Base | Notch-spring tip mode switch, best-in-gen LAD | GAP | No mode switch, LAD, or ridge interaction | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 243 | Double Wing AR | 2-fold dead zone, WD coverage inverting to shielding | PART | Geometry OK; dead-zone timing unmodelled | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 244 | War Bear AR | Convex arm contact, free-spin offensive SAR, fragility | GAP | freeSpin render-only; no part fragility | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 245 | War Monkey AR | Rounded LS heads low recoil, C4 balance, SAR coverage | PART | 4-fold geometry OK; recoil absent | MECH OK | authorable |
| 246 | Whale Attacker AR | Rounded elastic rebound vs tangential deflect, nutation | GAP | No restitution; nutation absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 247 | Cross Spike AR | Radial spike near-zero smash, 0.5ms contact duration | PART | Spike geometry OK; contact duration absent | MECH OK | authorable |
| 248 | SG Metal Ball Base | Sliding metal ball friction tier, orbital threshold | GAP | No tip friction model or orbital threshold | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 249 | SG Bearing Base | Two shielded bearings near-zero friction, LAD duration | GAP | No bearings; no decay integrator to extend | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 250 | Cross Attacker AR | Compound beak-plus-slope smash and upper split | PART | Compound geometry OK; impulse split absent | MECH OK | authorable |
| 251 | Ten Spike AR | Alternating-radius imbalance driving early nutation | GAP | Nutation absent; no rotational imbalance | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 252 | Eight Spike AR | Symmetric perpendicular blunt spikes, equal self-recoil | PART | 8-spike geometry OK; recoil not computed | MECH OK | authorable |
| 253 | Weight Ring WD | Non-universal base channel fit, compact-ring inertia | PART | Mass/shape fine; no compat rules or MoI | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 254 | Eight Balance WD | Eight-spoke compact mass distribution and inertia | PART | Mass+geometry OK; MoI never computed | MECH OK | authorable |
| 255 | Eight Heavy WD | Heavier rim giving ~11% slower spin decay | PART | Mass settable; no spin decay to improve | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 256 | Heavy WD | Hexagonal corner recoil, lowest-profile compact height | PART | Hex geometry OK; corner recoil unmodelled | MECH OK | authorable |
| 257 | Heavy Attack WD | Dome-corner severe recoil requiring AR/BB shielding | PART | Dome geometry OK; recoil/shielding absent | MECH OK | authorable |
| 258 | Viper Metal Ball Base | Ball-on-pole tip compliance, Magnecore ball retention | GAP | No pole compliance; magnetic retention absent | MECH OK | `looseMass.ts:78`<-`BeySystem.ts:237` / `fieldForce.ts:177`<-`BeySystem.ts:275` |
| 259 | Great Dragon AR | SAR-slot swap determining exposed contacts and recoil | PART | Geometry OK; exposure/recoil logic absent | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 260 | Dark Wing AR | Thick outward-angled blades + matched non-free sub-AR | PART | Two-piece geometry OK; smash fractions absent | MECH OK | authorable |
| 261 | Wing AR | Centrifugal spring wing deploy/retract at w thresholds | GAP | No w-threshold deployment; rpm cosmetic | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 262 | Corona Saber AR | Hybrid upper slope + angular smash edge, high inertia | PART | Heaviest-AR geometry OK; upper split absent | MECH OK | authorable |
| 263 | Genocide Circle AR | Probabilistic binary contact (35% hit, 65% zero force) | PART | Geometry OK; no contact-consistency model | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 264 | Hammer Tusk AR | Spike grinding spin-steal drain with low recoil | GAP | No spin steal; rpm inert | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 265 | Jungle Shock AR | Alligator-snout LS smash + spiked-rim grinding | PART | 4-fold geometry OK; grinding unmodelled | MECH OK | authorable |
| 266 | Panther Claw AR | Wing-gap two-phase catch contact variance in RS | PART | Gapped geometry OK; contact variance absent | MECH OK | authorable |
| 267 | Cross Dragon AR | Flat-face near-elastic high recoil, lightest AR | PART | Geometry + low mass OK; recoil absent | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 268 | Knight Claws Ring | Thin claw severe recoil + breakage probability | PART | Thin geometry OK; recoil and breakage absent | MECH OK | authorable |
| 269 | Max Shield AR | Flat-face heaviest recoil, zero defensive value | PART | Geometry/mass OK; recoil unmodelled | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 270 | Revolver Attack WD | Protruding WD-height contact points generating recoil | PART | Protrusion geometry OK; WD-level recoil absent | MECH OK | authorable |
| 271 | Star Attack WD | Five-fold phase alignment shielding tips behind AR | GAP | No inter-part rotational phase relationship | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 272 | Metal Ball Base (4LS) | Ball-pocket centrifugal threshold, tip wear, ridge | GAP | No centrifugal pockets, wear, or ridge logic | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 273 | War Lynx AR (unreleased) | Lower inertia yielding higher launch w at fixed energy | GAP | No launch-energy-to-w relation; rpm hardcoded | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 274 | Right Spin Gear (G Ball) | Ball retention platform holding four pocket balls | GAP | No loose-ball subparts or retention constraints | MECH OK | `looseMass.ts:78`<-`BeySystem.ts:237` |
| 275 | Neo Right SG (South Magne) | Magnecore mass recoil control + magnetic polarity | GAP | tipPolarity zero consumers; no magnetic force | MECH OK | `fieldForce.ts:177`<-`BeySystem.ts:275` / `spin.ts:65`<-`assembler.ts:175` |
| 276 | G Special Base | Four 3/16in ball pockets, semi-flat tip, destroyed LAD | GAP | No ball pockets, tip friction, or LAD | MECH OK | `looseMass.ts:78`<-`BeySystem.ts:237` / `spin.ts:253`<-`BeySystem.ts:425` |
| 277 | War Monkey Sub AR | Two 50deg winglets, 100deg coverage, directional recoil | PART | Winglet geometry OK; coverage arc absent | MECH OK | authorable |
| 278 | War Bear Sub AR | Free-spin vs WD-fixed orientation, fixation wear | GAP | freeSpin render-only; no wear degradation | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 279 | Delta Wave AR | RS contact angle and range, progressive contact wear | PART | Three-arm geometry OK; angles/wear unmodelled | MECH OK | authorable |
| 280 | Scissors Arm AR | Two-fold huge LS smash with self-KO recoil | PART | Claw geometry OK; smash/self-recoil absent | MECH OK | authorable |
| 281 | Cross Gator AR | C4 curved moderate-angle contact in both spins | PART | 4-fold curved geometry OK; angle math absent | MECH OK | authorable |
| 282 | Vanishing Moot AR (anime-only) | Swept turbine LAD floor-wipe + Magnacore centering | GAP | No LAD; tipPolarity unconsumed | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `fieldForce.ts:177`<-`BeySystem.ts:275` |
| 283 | Neo Cross Horn AR | Dual-face RS/LS smash, GPS embrittlement failure | PART | Dual-face geometry OK; material failure absent | MECH OK | authorable |
| 284 | Trident Vector AR | Outward-angled multi-point massive rotational recoil | PART | Dense protrusion geometry OK; recoil torque absent | MECH OK | authorable |
| 285 | Mirage Goddess AR | Heaviest AR: RS smash, LS low-recoil WBD + spin-steal | PART | Mass/geometry OK; smash/steal absent | MECH OK | authorable |
| 1097 | CEW Metal Grip | Rubber traction coupling of EG burst; bevel LAD | GAP | No rubber slip, burst, or precession lifetime | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1281 | Turtle Survivor AR | Dual-spin contact angle, protrusion-root fracture | PART | Geometry OK; angle math and damage absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1282 | Metal Sting Base | Sharp metal tip friction, tiny restoring torque, LAD | GAP | No tip friction, restoring torque, or LAD | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1283 | Flat Base | High-friction flat tip lateral drive, built-in SG, LAD | GAP | No friction-driven translation or SG compat | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1284 | Bound AR | 12-position rotatable/flippable two-piece sub-part | GAP | No sub-part rotation/flip configuration state | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1285 | Ark Pyramid AR + SAR | Sphinx-head contact angle, notch recoil, SAR shadowing | PART | Core+SAR geometry OK; shadowing absent | MECH OK | authorable |
| 1286 | Right EG (Mystery Cutter) | EG spring release, CEW swap, assembly elevation | GAP | EG/CEW system absent entirely | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:65`<-`assembler.ts:175` |
| 1287 | Final Clutch Base (Desert Sphinxer) | Three-spring final clutch, circular rim low recoil | GAP | No springs, clutch threshold, or rim recoil | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 1288 | Darllanzer hydro-siphon tip | Archimedes-screw water pumping, volatile mass/inertia | GAP | No fluid, dynamic mass change, or I recompute | MECH OK | `spin.ts:65`<-`assembler.ts:175` |

**CS4 contradictions (27 found)** -- the worst file for internal disagreement. The **smash/recoil formula is inverted mid-file**: Cases 189-237 use smash=cos(phi)/recoil=sin(phi); Cases 240, 1281, 281-285 use smash=sin(alpha)/recoil=cos(alpha) -- identical angles produce opposite verdicts. Case 1281's worked example contradicts its own formula (claims F_smash>F_recoil at 30deg, where sin30=0.5 < cos30=0.866). Case 194 **inverts the stability law** (uses w_req proportional to 1/sqrt(h_cm), concluding the taller base "needs less spin for stability", while Cases 191/200/203/236 all use the opposite). Cases 203 and 1285 both refute their own theses in-text ("Wait -- then why does it help as a LAD mechanism?", "Wait -- this sounds like good smash geometry. BUT:"). Final Clutch trigger fraction is given as 0.44, 0.25 and 0.20-0.30 of launch spin across four cases; First Clutch four ways. Metal-tip mu appears as 0.30/0.25/0.22/0.12 against the header's CONFIRMED 0.12; rubber mu as 1.2/0.55-0.70/0.65/0.45 against CONFIRMED 0.50. Weight-disk inertias **halve between cases** (Heavy WD 7.0e-6 vs 4.1e-6; Eight Heavy 7.55e-6 vs 4.1e-6; Ten Heavy 8.9e-6 vs 5.8e-6). `I_combo` has **no consistent value at all** (8e-6, 8.0e-5, 8.5e-5, 5e-6, 4e-5, 3.2e-5, 1.5e-5), so several "per-hit Dw" results differ by an order of magnitude purely from that choice. Structural defects: Case 206's body is cut mid-code-block with an unnumbered case appended to it; Case 265 has four empty code fences; Cases 218/220/236/1097 have unterminated fences absorbing their separators.

## LEDGER PART 5  -  CS5 system architectures + MFB wheels/tracks/bottoms (Cases 286-296, 951-1000, 1089-1096)

69 cases. **Cases 951-960 are the whole-system architecture cases** -- all GAP, and they are the direct justification for Sec.P1's 19-system correction.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 951 | 4 Layer System architecture | Four fixed slots; per-layer centroid + MoI composition | GAP | No partType; no MoI composition | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 952 | Spin Gear System architecture | 5th-layer SG slot, spin interlock, bearing isolation | GAP | gimmickType 5 values, never read | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 953 | Magnacore System architecture | Core slot + stadium-magnet dipole lateral force | GAP | No magnetism anywhere in src | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `fieldForce.ts:177`<-`BeySystem.ts:275` |
| 954 | Hard Metal System architecture | 0.75 scale, metal-frame caul, RC consolidation | GAP | No scale factor, air-drag term, or partType | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 955 | Metal System architecture | Discrete Track height layer + 3 bottom friction classes | GAP | No tip-friction classes; no decay integrator | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 956 | Engine Gear System architecture | Spring energy store + clutch-triggered angular impulse | GAP | gimmickType 'engine_gear' never read | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 957 | Hybrid Wheel System architecture | ER/FW split; density-driven I relocation | GAP | No material density->I; partType absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 958 | 4D System architecture | Sub-part re-orientation modes; w-threshold F:D switch | GAP | mode_change never read; no w-threshold | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 959 | Burst System base structure | Spring-ratchet burst as two-point win condition | GAP | No burst; health never zero-checked | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 960 | Burst subsystems (TT) | Per-generation layer/disc/driver burst-resistance deltas | GAP | No burst mechanic or layer taxonomy | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 961 | CobaltDrake 4-60F | Blade mass->I, per-contact impulse, rail coupling | PART | Mass+geometry OK; no I, no bey collision | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 962 | DranBuster 1-60A | Single-protrusion eccentric CoM; 16-gear rail coupling | PART | Sector geometry OK; no CoM offset or rail | MECH OK | authorable |
| 963 | DranBrave S6-60V | 3-part blade stack; face friction bite coupling | PART | Stacked parts OK; no contact friction | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 964 | Track 85 | Low track undercut + floor-scrape tilt threshold | PART | Heights/mass OK; tiltAngle static | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 965 | Track 90 | +0.5mm height raising scrape threshold 1.4deg | PART | Height stored; no scrape/tilt simulation | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 966 | Track 100 | Scrape clearance + wheel-overhang compensation | PART | Geometry OK; no clearance computation | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 967 | Track 105 | Equal mass, +0.5mm height, all metrics worse | PART | Height+mass only; no derived metrics | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 968 | AD145 funnel track | Outward mass->I gain; funnel drag reduction | PART | Radii+mass OK; no MoI, no aero drag | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 969 | DF145 downforce track | Wing aerodynamic downforce (proven negligible) | PART | Geometry OK; no aero forces | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 970 | SW145 switch track | Reversible wing orientation changing contact angle | GAP | No part re-orientation mode | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 971 | WD145 wheel-wing trap | Two-bey coupling event dissipating differential spin KE | GAP | bey-vs-bey collision does not exist | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 972 | E230 elevator track | Gravity-driven sliding disk as wall speed governor | GAP | No sliding sub-part DOF or wall-climb | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 973 | SP230 spike track | Fixed spikes contacting floor at 16deg tilt | GAP | tiltAngle static; no tilt-triggered contact | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 974 | F230 bearing track | Internal ball bearing isolating wheel during LAD | GAP | freeSpin render-only; no torque isolation | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 975 | TB twin ball bottom | Dome contact radius proportional to sin(theta); 80deg precession | GAP | No precession or theta-dependent contact | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 976 | Storm metal wheel | 40deg wing face smash/recoil impulse split | PART | Sector geometry+mass OK; no decomposition | MECH OK | authorable |
| 977 | Rock metal wheel | Six rounded bumps giving near-radial contact normal | PART | Geometry OK; no contact normals | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 978 | Lightning metal wheel | Left-spin blade sweep producing spin-steal torque | GAP | spinDir exists but no spin-steal mechanic | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 979 | Flame metal wheel | Fourier near-circular profile -> low recoil | PART | Elliptical radii OK; no recoil model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 980 | Burn metal wheel | Sub-degree contact angle minimising recoil per hit | PART | Geometry OK; recoil never computed | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 981 | Earth metal wheel | Max I + effective contact mass momentum stop | PART | Mass+radius OK; no I or momentum exchange | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 982 | L Drago metal wheel | Dragon-head ramp producing vertical destabilising torque | GAP | No vertical impulse or toppling torque | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 983 | Leone metal wheel | 18 block faces at 20deg, recoil-attacker rebound | PART | Sectors OK; no restitution-driven rebound | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 984 | Libra metal wheel | Ring+spoke zone MoI; notch angle; spoke fatigue | PART | Hollow/inner radii OK; no MoI or stress | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 985 | Pegasis metal wheel | Ridge Hertzian peak pressure; protrusion root stress | PART | Geometry OK; no Hertz contact or stress | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 986 | Pisces metal wheel | Two open arms; gap-wall high-recoil catch events | PART | Sector gaps OK; no gap-catch logic | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 987 | Sagittario metal wheel | Crescent-end burst smash vs smooth body arcs | PART | Geometry OK; no per-azimuth contact angle | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 988 | Virgo metal wheel | 2-fold mold imbalance driving extra spin decay | GAP | No CoM imbalance or decay integrator | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 989 | Leone clear wheel | Clear-wheel I share and CoM height shift | PART | Stacked mass/height OK; no CoM/I math | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 990 | Nemesis 4D clear wheel | Metal-powder density; two-half imbalance dilution | PART | material+weight fields; no density/imbalance | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spin.ts:65`<-`assembler.ts:175` |
| 991 | VariAres 4D metal wheel | Centrifugal PC-frame retraction above w_c | GAP | No w-threshold mode switch; rpm cosmetic | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 992 | D:D delta drive bottom | Three-tip manual mode selector with per-tip friction | GAP | No mode selector or tip friction torque | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 993 | Horogium clear wheel | Missing-sector imbalance; gear-tooth drag increase | PART | Sector omission OK; no imbalance or drag | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 994 | Basalt metal wheel | Staircase imbalance -> orbital-onset w; knurl transfer | GAP | No imbalance force or orbital onset | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 995 | 145 Track | Max tilt before rim scrape; precession rate | GAP | tiltAngle STATIC RENDER POSE; no precession | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 996 | WD wide defense bottom | Annular contact + 40deg bevel LAD restoring force | GAP | No annular contact or restoring force | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 997 | Aquila clear wheel | C2 principal-moment anisotropy driving 2w nutation | GAP | Nutation absent; no inertia tensor | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 998 | Earth metal wheel (mold 2) | 93% solid perimeter; 12deg declination grounding force | PART | Geometry OK; no vertical contact component | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 999 | Unicorno II 4D clear wheel | Iron-powder density; C3 isotropy killing nutation | PART | Mass/material OK; no nutation to suppress | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1000 | Blitz 4D metal wheel | Two-piece mode reorder; Gaussian bump peak force | GAP | No sub-part reorder modes or peak-force profile | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:65`<-`assembler.ts:175` |
| 286 | 100 Track | Attack-bracket height; vertical offset tipping moment | PART | Heights stored; no tipping torque | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 287 | RSF rubber semi-flat bottom | Rubber mu, mold hardness contact area, L-spin reversal | GAP | No friction coefficients or spin asymmetry | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 288 | Vulcan metal wheel | Two-mold mass redistribution; rubber-tip ring-out | PART | Per-part weight OK; no ring-out threshold | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 289 | Flame metal wheel (crown) | Crown rim raising scrape angle; track exposure | PART | Crown profile OK; no scrape/exposure logic | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 290 | Pegasis II clear wheel | C3 symmetry; tapered wing contact angle gradient | PART | Tapered radii OK; no contact angle | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 291 | Galaxy metal wheel | Hollow underside reducing I; 10deg upper elevation | PART | isHollow exists; no I penalty or upper attack | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 292 | Wing 105 Track | Height + mass only; fins aerodynamically negligible | OK | Height/mass/decorative fins fully buildable | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 293 | R2F right rubber flat | Six rubber pads, wear-in adhesion, R-spin grip bias | GAP | No wear state, adhesion, or grip bias | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 294 | Ketos clear wheel | Oval C2 anisotropy; opposing-wave recoil asymmetry | PART | Elliptical radii OK; no anisotropy/recoil | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 295 | Grand metal wheel | Indent recoil fraction; gap-transition 6w wobble | PART | Sector walls+gaps OK; no recoil or wobble | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 296 | RS rubber sharp bottom | Sneddon cone contact; anti-KO vs stamina penalty | GAP | No elastic contact patch or KO threshold | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1089 | Upper Dragon AR | Metal-frame COR boost; RS/LS contact-angle asymmetry | PART | Material+geometry OK; no restitution | MECH OK | authorable |
| 1090 | CWD Chain Attacker | 14 links -> high-frequency low-impulse spin-steal | GAP | No spin-steal or per-contact impulse | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1091 | CWD Eternal Survivor | Oversized CWD intercepting contact before AR engages | GAP | No collision hierarchy between stacked radii | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1092 | Metal Weight Grip Core | Rubber RC mass + tip radius setting orbital speed | GAP | No tip radius, mu, or orbital-speed derivation | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1093 | Smash Phoenix AR | Near-circular recoil; 3-point metal-frame asymmetry | PART | Sectors+weights OK; no recoil or asymmetry | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1094 | CWD Wing Attacker | Oversize free-spin wings lowering scrape tilt angle | GAP | freeSpin render-only; no tilt-scrape threshold | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1095 | CWD Reverse Defenser | Smooth rim tangential deflection; wear-improved profile | PART | Smooth profile OK; no deflection or wear | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1096 | Free Shaft Core | w-dependent shaft decoupling -> early precession onset | GAP | No w-dependent coupling; precession absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |

**CS5 contradictions (18 found).** EG spring constants disagree with the file's own header by **~3000x** (header k=1500 N/m, E=48mJ; Case 956 uses k=0.05 N*m/rad and E=152 J, then derives Dw=3167 rad/s from it). The F:D threshold has **three** values: header 94.3 rad/s [CONFIRMED], Case 958 text "50-100", Case 958's own code comment "~141" where the arithmetic actually gives 4.47. The scrape/tilt formula differs between cases for the same Track (Case 964 vs Cases 995/286 give 145-Track as 35.9deg vs 42.4deg). Earth Metal Wheel is effectively **two different parts** across Cases 981 and 998 (30.0g/I=7.80e-6 vs 30.8-33g/I=9.07-9.50e-6); same for Flame, Basalt and Libra. Case 980 contradicts itself in-line ("Burn has the highest I of the three" immediately followed by a table row "Earth 7.54e-6 <- actually Earth edges Burn"). Case 988 abandons its own thesis mid-derivation ("Wait --"), as do 978 and 295. Case 980 leaves a broken formula in place, self-annotated "[this scaling is too large -- reduce C_form]". Case 1092 computes MWGC as *faster* then asserts a "1.4% orbital speed deficit" and hard-codes `x 0.986`. Case 972 concludes a disk "slides upward due to reduced axial gravity" from an equation whose force only points down. Three cases mis-cite the case that proves their key claim.

## LEDGER PART 6  -  CS6 MFB bottoms, 4D, Zero-G Synchrome (Cases 297-353, 1041-1087, 1127-1134)

112 cases. The **tip/bottom** block (325-342, 1054-1057, 1078-1087) is the densest concentration of tilt-gated and friction-driven mechanics in the corpus -- and therefore the clearest demonstration that primitives 3 and 4 block an entire part class.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 297 | Rubber Flat RF | Rubber traction, decay torque, self-KO, tip free-spin | GAP | No decay integrator; freeSpin render-only | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 298 | Move 145 M145 | Off-centre tip precession, cyclic liftoff, connector slip | GAP | No precession; no w-threshold mode switch | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 299 | Quake Q | C1 cam ramp bounce once per revolution | GAP | No per-revolution tip-height cam or airborne model | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 300 | Death 4D Wheel | Frame+Core inertia sum, recoil fraction, spin-grinding | GAP | No per-part MoI; bey collision absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 301 | Rubber Defense Flat RDF | Two-stage tilt-triggered contact, restoring torque | GAP | tiltAngle static render pose | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 302 | Eternal Wide Defense EWD | Bearing decoupling of tip from disc, wobble-phase torque | GAP | No bearing-friction model; freeSpin group-only | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 303 | Upper Wing 145 UW145 | Wing contact height vs opposing wheel, flip modes | GAP | No bey-bey contact heights; tilt unsimulated | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 304 | Fusion 4D Wheel | Rubber-frame two-stage impact absorption, COR switching | GAP | No per-material restitution or collision | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 305 | Kerbecs Clear Wheel | Clear-wheel mass/inertia share, C3 symmetry | PART | Geometry+mass OK; no MoI sum or nutation | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 306 | Hell Metal Wheel | Large-radius tip speed, smash/recoil, gap clearance | GAP | No contact-angle impulse split | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 307 | Boost Disk 145 BD145 | Protrusion floor-scrape above critical tilt; boost flip | GAP | Tilt never dynamic; no scrape torque | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 308 | Lightning Metal Wheel | CW-gated mode selector, per-orbit recoil accumulation | GAP | gimmickType never read; no accumulation | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 309 | Flash 4D Wheel | 90deg frame rotation C4->C2, nutation forcing at 2w | GAP | No transverse anisotropy or nutation | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 310 | Phoenic Chrome Wheel | Peripheral inertia + 15deg smash face impulse split | GAP | No MoI composition or impulse decomposition | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 311 | Gargole Chrome Wheel | C2 transverse anisotropy driving 2w nutation torque | GAP | Nutation absent; tiltAngle static | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 312 | Switch Attack 165 SA165 | Flippable parabolic shell, wall-arc traction change | GAP | No reversible part modes; wall has no traction term | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 313 | Genbull Chrome Wheel | Zero-recoil circular edge deflection, bottom-face liability | GAP | bey-vs-bey collision does not exist | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 314 | Stamina Ring 200 SR200 | Vertical wall gives zero vertical lift on impact | GAP | No impact-angle lift decomposition | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 315 | Left Wing 105 LW105 | Plain 10.5mm height; aero upwash negligible | PART | Height/geometry OK; no aero lift | MECH OK | authorable |
| 316 | Dragooon Chrome Wheel | Opposite-spin sum-velocity friction, spin equalisation | GAP | spinDir render-only; no relative-surface friction | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 317 | Bahamdia Chrome Wheel | Top/bottom mass asymmetry, 2w nutation, weighted smash | GAP | No DI_transverse or nutation | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 318 | Giga Flat GF | Flat-disc friction torque, drift velocity, wall grip | GAP | No decay integrator or tip friction | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 319 | Revizer Chrome Wheel | Hole-induced C2 anisotropy, weighted smash/recoil | GAP | Nutation and collision impulse absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 320 | Guardian Crystal Wheel | ABS sacrificial guard ring absorbing low attacks | PART | Geometry/mass OK; COR absorption absent | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 321 | Killerken Chrome Wheel | Near-balanced C2, tentacle-arc low-recoil profile | GAP | No nutation or per-azimuth contact angle | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 322 | Armor 230 A230 | Stepped pyramid faces converting impact to orbital recoil | GAP | No stepped-face impulse redirection | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 323 | Pegasis Chrome Wheel | Position-dependent face angle flip (Synchrome top/bottom) | GAP | No stack-position-dependent contact geometry | MECH OK | authorable |
| 324 | Wyvang Chrome Wheel | C1 CoM offset, centrifugal imbalance forcing at w | GAP | No CoM offset or imbalance force | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 325 | Bottom: Ball B | Hertzian point contact, spin decay, centering spring | GAP | No Hertz contact, decay, or restoring force | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 326 | Bottom: Wide Ball WB | Ball-radius scaling of decay and centering stiffness | GAP | No tip-radius friction or centering model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 327 | Bottom: Metal Ball MB | Metal-ABS modulus/mu change reducing spin torque | GAP | No material-dependent tip friction | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 328 | Bottom: Rubber Ball RB | Compliant rubber contact, adhesive lateral grip | GAP | No adhesive traction term | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 329 | Bottom: Sharp Ball SB | Rounded-apex Hertz regime, lowest spin torque | GAP | No spin-decay integrator at all | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 330 | Bottom: Defense D | Sneddon cone contact radius, decay, wobble flange | GAP | No cone contact model; tilt not dynamic | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 331 | Bottom: Semi-Defense SD | Steeper cone, smaller radius, earlier side contact | GAP | No cone-angle friction or side-contact transition | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 332 | Bottom: Wide Defense WD | Truncated cone + rim touchdown above 46deg tilt | GAP | Tilt-threshold rim contact impossible | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 333 | Bottom: Sharp Wide Defense SWD | Separated sharp tip + cylindrical rim at extreme tilt | GAP | No two-surface tip switching by tilt | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 334 | Bottom: Wide Semi-Flat WSF | Flat-disc friction + spiky-rib engagement at 38.7deg | GAP | No flat-disc torque or rib threshold | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 335 | Bottom: Sharp S | Sneddon cone decay + toppling stability margin | GAP | No topple/stability margin or decay | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 336 | Bottom: Ball Sharp BS | Same cone as S with wider base stability margin | GAP | No CoM/stability computation from part stack | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 337 | Bottom: Eternal Sharp ES | Sleeve-bushing free-spin coupling, impact damping | GAP | freeSpin render-only; no bushing torque | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 338 | Bottom: Metal Sharp MS | Metal cone low mu + runaway late-spin topple | GAP | No w-dependent gyroscopic restoring torque | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 339 | Bottom: Flat F | Flat-disc friction torque, lateral drive, orbit curvature | GAP | No tip friction drive or orbital curvature | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 340 | Bottom: Wide Flat WF | Wider flat face raising torque and orbital acceleration | GAP | No flat-radius friction or mass-driven accel | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 341 | Bottom: Extreme Flat XF | Flat drive + protrusion engagement at 18.3deg tilt | GAP | No tilt-gated protrusion contact or decay | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 342 | Bottom: Metal Flat MF | Metal-on-ABS lower mu, slower decay, controlled flower | GAP | No material mu on tips or flower orbit model | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 343 | 4D Wheel: Big Bang | Cube-in-hole four-mode contact profile selector | GAP | gimmickType never read; no mode-dependent faces | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 344 | 4D Bottom: Final Drive F:D | Centrifugal w-threshold tip switch SF->rubber | GAP | No w-threshold/centrifugal mode switch in src | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 345 | 4D Bottom: X:Drive X:D | Impact-force-triggered cam switching three tips | GAP | No collision-triggered part state change | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 346 | 4D Wheel: Diablo | Unequal-head C1 nutation; free-frame impact decoupling | GAP | No nutation or sub-part independent dynamics | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 347 | 4D Wheel: L-Drago Destroy | Rubber vs plastic protrusion spin-steal, opposite spin | GAP | No spin-steal; spinDir cosmetic | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:65`<-`assembler.ts:175` |
| 348 | 4D Bottom: F:S Final Survive | w-threshold HF->Sharp switch, post-switch instability | GAP | No w threshold or stability margin | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 349 | 4D Clear Wheel: Orion | C2 lobe shape clearing Flash blade contact angles | PART | Lobes authorable; contact exposure unmodelled | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 350 | 4D Wheel: Phantom | Surface-roughness aero drag torque, mode flip | GAP | No aerodynamic drag torque or mode flip | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 351 | 4D Bottom: B:D Bearing Drive | Stochastic bearing lock; tilt-shield sign reversal | GAP | No bearing model; tilt static | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 352 | Track: S130 Shield 130 | Eight-arm disc inertia + 60% contact-exposure window | PART | Disc geometry/mass OK; no MoI or exposure | MECH OK | authorable |
| 353 | Bottom: CS Coat Sharp | Tilt-threshold ABS-cone->rubber-coat switch at 8.4deg | GAP | Tilt never updated; no dual-zone tip selection | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 1041 | Mercury Metal Wheel | Curved-lobe averaged smash fraction, XF spin drain | GAP | No contact normals on wheel profile | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1042 | Archer Crystal Wheel | C1 anisotropy, bow-arc deflection, inertia share | PART | Geometry+mass OK; DI/nutation absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1043 | Bandid Crystal Wheel | Block-ridge complement fit, ridge micro-impact frequency | PART | Shape OK; no ridge contact events | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `railBlend.ts:46`<-`SpawnManager.ts:1179` |
| 1044 | Berserker Crystal Wheel | Chain-link sweeping contact angle, near-zero DI | PART | Mass/shape only; sweeping angle unmodelled | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1045 | Dark Knight Crystal Wheel | Symmetric keyway forcing left-spin on any chrome wheel | GAP | spinDir cosmetic; no launch torque transfer | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:65`<-`assembler.ts:175` |
| 1046 | Gladiator Crystal Wheel | C4 zero nutation + sharp sword-tip contact | PART | Geometry OK; nutation and contact faces absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1047 | Pirates Crystal Wheel | Zero-gap complement fit, inter-layer torsional grip | PART | Shapes OK; no inter-part friction coupling | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1048 | Samurai Crystal Wheel | Chrome-Up/Crystal-Up flip changing contact surface | PART | Part reordering possible; no contact-surface logic | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:65`<-`assembler.ts:175` |
| 1049 | Shinobi Crystal Wheel | Reversible face, angled-curve deflection ramps | PART | Geometry OK; deflection energy split absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1050 | Thief Crystal Wheel | Irregular protrusion contact-frequency, C1 anisotropy | PART | Mass/shape OK; frequency and DI absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1051 | Bottom: Jog Ball JB | Spike-tip Hertzian contact, micro-torque destabilise | GAP | No spike contact patch or destabilise impulses | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1052 | Fusion Wheel: Forbidden | Gap-wall 45deg faces splitting smash and recoil equally | GAP | No contact-face impulse split | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1053 | Track: ED145 | Friction-pivot free-rotating wings absorbing impact | GAP | No sub-part pivots or pivot-friction loss | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1054 | Bottom: Flat Ball FB | Ball contact upright, annular flat above 8.2deg tilt | GAP | No tilt-gated contact switch | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1055 | Clear Wheel: Eonis | C2 ring mass contributing ~10% of combined inertia | PART | Ring geometry+mass OK; no inertia summing | MECH OK | authorable |
| 1056 | Fusion Wheel: Dark | Twelve-spike high-frequency micro-contacts, spread mass | GAP | No per-spike contact events | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1057 | Bottom: Flat Spike FS | Cone upright, narrow flat ring above 6.9deg tilt, wear | GAP | No tilt switch or wear model | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 1058 | Clear Wheel: Wolf | C4 four-node symmetry damping precession oscillation | PART | Geometry/mass OK; precession damping absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1059 | Fusion Wheel: Poison | Near-perpendicular tooth faces yielding 99% recoil | GAP | No tooth contact normals or self-recoil | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 1060 | Fusion Wheel: Spiral | Upper-Smash vertical lift component from oval faces | GAP | No vertical impulse on opponent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1061 | Clear Wheel: Serpent | Paired Celtic-knot elements giving effective C4 stability | PART | Shape/mass OK; symmetry has no physics effect | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1062 | Chrome Wheel: Ifraid | Heaviest-wheel inertia dominance + CF spin decay | GAP | No MoI composition or spin decay | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1063 | Chrome Wheel: Begirados | Mass/inertia three-zone model, round low-recoil edge | PART | Mass and shape OK; MoI and recoil absent | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 1064 | Chrome Wheel: Goreim | Low-mass compact inertia, Synchrome stack mass role | PART | Stacked parts with mass OK; no MoI/CoG use | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1065 | Chrome Wheel: Saramanda | Bottom-wheel support mass, 27.7% inertia share | PART | Mass/geometry fine; inertia share uncomputed | MECH OK | authorable |
| 1066 | Chrome Wheel: Orojya | Three-zone annular inertia, curved perimeter | PART | Geometry+mass OK; no inertia or contact physics | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 1067 | Chrome Wheel: Girago | Angular protrusion inertia with 25deg smash blend | PART | Shape/mass OK; smash/upper split unmodelled | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1068 | Chrome Wheel: Balro | Mass-tier inertia equivalence with Girago | PART | Arbitrary mass per part; MoI composition absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1069 | Chrome Wheel: Genbull (dup) | Bull-horn inertia + F230/TB decay chain | PART | Mass/shape OK; decay chain absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1070 | Chrome Wheel: Wyvang (dup) | Wing-span inertia, 28deg smash-dominant face | PART | Geometry/mass only; contact angle inert | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1071 | Chrome Wheel: Leviathan | Revolver-groove tangential redirection, lowest recoil | GAP | No groove redirection; collision absent | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `railBlend.ts:46`<-`SpawnManager.ts:1179` |
| 1072 | Spin Track: W145 | 14.5mm height + negligible wing downforce | PART | Height/geometry OK; no aero downforce | MECH OK | authorable |
| 1073 | Spin Track: LW160 | 16mm height, left-facing wings, precession rate shift | PART | Height fine; precession not simulated | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1074 | Spin Track: 500 | 50mm CoG raising topple risk, vertical smash vector | GAP | No CoG-based topple or vertical strike | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1075 | Spin Track: SP230 | Four spike claws resisting slope-push by friction | GAP | No claw-floor friction; slope has no grip term | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1076 | Spin Track: F230 | Free-spinning upper section decoupling impact vibration | GAP | No sub-part free rotation or vibration attenuation | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1077 | Spin Track: E230 | Sliding disc dropping CoG as spin decays | GAP | No spin-triggered part translation or CoG tracking | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1078 | Performance Tip: CF | Wide disc wall engagement converting spin to aggression | GAP | Wall collision has no disc grip or conversion | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1079 | Performance Tip: BSF | Eight blade fins gripping floor against sway-out | GAP | No fin-floor friction or sway-out mechanic | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1080 | Performance Tip: BWD | 30deg cone recoil split, slope-push resistance | GAP | No cone recoil fraction or slope resistance | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1081 | Performance Tip: GCF | Gear-tooth periodic wall engagement impulse spikes | GAP | No periodic tooth engagement on wall collision | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1082 | Performance Tip: E Eternal | Bearing free-spin tip decoupling floor friction | GAP | No bearing-friction model; freeSpin render-only | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1083 | Performance Tip: TB | Offset inner ball sustaining wobble resonance | GAP | No eccentric mass or wobble resonance | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1084 | Fusion Wheel: Grand | Wall faces with indent texture, gap-void contact penalty | GAP | No contact faces, texture recoil, or duty cycle | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 1085 | Energy Ring: Capricorn | 2.9g C2 ring contained within wheel profile | PART | Ring geometry+mass OK; symmetry inert | MECH OK | authorable |
| 1086 | Spin Track: 145 | Plain 14.5mm height, no gimmick | PART | Plain height/geometry fully authorable | MECH OK | authorable |
| 1087 | Performance Tip: D | 35deg cone decay + 55deg wall-recovery self-centring | GAP | No cone friction or post-wall recovery arc | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1127 | Samurai Ifraid W145CF | Assembly inertia budget, decay, per-contact KO impulse | GAP | No MoI budget, decay, or KO impulse | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1128 | Pirates Orojya 145D | Assembly inertia, D-tip centripetal centring, t_stall | GAP | No centring force or stall time | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `spin.ts:65`<-`assembler.ts:175` |
| 1129 | Thief Phoenic E230GCF | Tall-track contact evasion + GCF decay rate | GAP | No contact-height evasion or decay | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1130 | Dark Knight Dragooon LW160BSF | Left-wing aero download reducing normal force | GAP | No aero download; normal load unused for friction | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1131 | Archer Gargole SA165WSF | Centrifugal wing extend/fold switching contact height | GAP | No w-threshold wing extension | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1132 | Berserker Begirados SR200BWD | High-mass inertia with 200mm height impulse reduction | GAP | No height-dependent impulse transfer | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `spin.ts:65`<-`assembler.ts:175` |
| 1133 | Bandid Genbull F230TB | F230 free-spin damping 25% of contact energy | GAP | No free-spin damping or contact energy accounting | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1134 | Killerken Balro A230WB | Dual-chrome stacked inertia, A230 armour absorption | GAP | No stacked MoI or armour absorption | MECH OK | `spin.ts:65`<-`assembler.ts:175` |

**CS6 contradictions (42 found -- the highest count of any file).** Representative: Case 344 computes the F:D switch at **81.6 rad/s** against its own header's **94.3 [CONFIRMED]**. Case 351 uses mu_roll=0.002, a value the header's own "Common Errors" block explicitly flags as wrong (real 0.05) -- and picks one even further off. ABS tip mu is **tri-valued** across the file (0.35 in cases 318/330-342; header says 0.17; cases 1060/1084/1087 use 0.090-0.12, and 1060 labels 0.17 as "plastic XF"). Eleven cases have a thesis paragraph whose number contradicts its own body (Case 308 I and deficits; 305 an inertia sum that only works if one term is changed by 10^3; 300 claiming "6% is lower than 5%"; 301, 312, 315, 316, 352, 1052, 346, 338). "Highest specific inertia" is claimed **four separate times** by four different wheels. Case 327 prints its own hierarchy mis-ordered against its numbers. WD upright decay has three values across cases 302/332/345. Case 342 is off by 100x against Case 327 for the same tip. Cases 339, 336, 350 leave unresolved self-corrections in the shipped text ("Wait -- this suggests...", "Revised stability conclusion"). Basalt's mass appears as 45g, ~54g and 55.3g; Dragooon at two masses and inertias; Genbull and Wyvang duplicated with divergent numbers. **Cases 1127-1134 re-model every chrome wheel at double radius** (r_o 42-44mm, I 26-52e-6) against the main cases' 22-25mm and 6-15e-6 -- a 4x inertia break. Cases 1127-1129 also **reverse two tip identities** (CF called rubber mu=0.28 where Case 1078 defines it as plastic mu=0.085; D called a rubber hemisphere where Cases 330/1087 define a 35deg ABS cone). Launch reference w is 150 rad/s in the main file, 94.2 in 1127-1134, 300 in 1043/1050, and 600 in 1042.

## LEDGER PART 7  -  CS7 system architectures + CS8 Beyblade X parts (Cases 354-415)

62 cases. **All 19 system-architecture cases are GAP** -- the direct evidence behind Sec.P1. The only non-GAP rows in the entire block are four BX Bits that touch the one wired rail mechanic.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 354 | Basic Line System (BX) | 3-part stack + burst ratchet twist-lock + XD rail | GAP | No burst/health model; gimmickType unused | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `railBlend.ts:46`<-`SpawnManager.ts:1179` |
| 355 | Unique Line System (UX) | OWD mass shift + Ratchet-integrated Blade gimmick | GAP | No partType; gimmickType never read | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `burst.ts:109`<-`BeySystem.ts:436` |
| 356 | Custom Line System (CX) | 5-part modular stack, independent inertia zones | GAP | No partType to distinguish Lock Chip/Main/Assist | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 357 | Ratchet System Architecture | Height/CoM + burst-tab indent count + burst window | GAP | No burst torque model; health never zero-checked | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 358 | Bit System Architecture | XD rail gear mesh + shaft burst resistance + tip decay | PART | exitBehavior 'launch' wired; burst/decay absent | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 359 | 4 Layer System | Fixed BB chirality + WD-dominant I + tip-only decay | GAP | No spin-decay sim; gimmickType unused | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 360 | Spin Gear System | Swappable SG chirality + Sub-AR free-spin recoil absorb | GAP | freeSpin render-only; no impulse model | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 361 | Magnacore System | Magnet-modulated tip normal force + Support Parts | GAP | No stadium magnet/normal-force model | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `fieldForce.ts:177`<-`BeySystem.ts:275` |
| 362 | Engine Gear System | Spring energy storage + clutch-timed release + reverse | GAP | gimmickType 'engine_gear' zero callers | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 363 | Hard Metal System | Dual Shooter launcher chirality + metal AR hardness | GAP | spinDir exists; no launcher-hole/material physics | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` |
| 364 | Metal System | Wheel-dominant I + Track height code + gimmick tracks | GAP | Geometry composable; gimmick physics unwired | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 365 | Hybrid Wheel System | FW/ER 2-axis customization + density-split I | GAP | No collision/launcher-hook physics | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 366 | 4D System | FW mode-reposition + F:D centrifugal tip switch | GAP | No w-threshold mode-switch system in src | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 367 | Synchrome (Zero-G) System | 3-mode flip assembly + tilting floor + C1 imbalance | GAP | No tilting-floor physics; no bey collision | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 368 | Burst System overview | 3-part stack + ratchet burst-tab torque mechanism | GAP | No burst mechanic; health never zero-checked | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 369 | Dual Layer System | Upper/Lower Layer screw-compliance burst damping | GAP | No burst/compliance model | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 370 | God Layer System | Core+Frame split I + named God Ability gimmicks | GAP | gimmickType has no matching values | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 371 | Cho-Z Layer System | Die-cast metal insert + Awakening wing deploy/burst-stop | GAP | No w-gated deploy or burst-stop | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 372 | Gatinko Layer System | 3-part bayonet Layer + Mugen Lock state-switch burst | GAP | No state-switched burst or free-spin decoupling | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 373 | Superking Layer System | Ring-dominant I + Limit Break centrifugal blade deploy | GAP | No centrifugal deploy or collision-frequency | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 374 | Dynamite Battle/BU System | Reversible Core/Blade/Armor mode + Evolution Gear stack | GAP | axisOffsetY static; no mode-switch/stack system | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 375 | Shark Edge (BX Blade) | Contact-angle collision + upper tilt + recoil decay | GAP | No bey-vs-bey collision; health/spin never decrement | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 376 | Dran Dagger (BX Blade) | Barrage multi-hit collision + ring-out threshold | GAP | No bey collision or ring-out check | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 377 | Phoenix Wing (BX Blade) | Collision inertia dominance + top-heavy precession wobble | GAP | No collision; gyroscopic physics absent | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 378 | Cobalt Drake (BX Blade) | Deflection collision + round-profile gyroscopic balance | GAP | No collision/deflection or imbalance sim | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 379 | Dran Buster (UX Blade) | Single-hit max-impulse ring-out + 1-tab burst | GAP | No collision impulse or burst threshold | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `burst.ts:109`<-`BeySystem.ts:436` |
| 380 | Hells Hammer (UX Blade) | 3D down-smash impulse decomposition + height alignment | GAP | No 3D decomposition or height-contact check | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 381 | Wizard Rod (UX Blade) | High-I spin retention + gyroscopic precession resistance | GAP | No decay sim or precession | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 382 | Cobalt Dragoon (BX Blade) | Counter-spin relative-velocity collision + Bit-burst eject | GAP | No bey collision or Bit-ejection | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `burst.ts:109`<-`BeySystem.ts:436` |
| 383 | Aero Pegasus (UX Blade) | Dual smash/upper contact + top-heavy nutation onset | GAP | No collision or nutation sim | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 384 | Silver Wolf (UX Blade) | Free-spin ring impulse decoupling + bearing tip friction | GAP | freeSpin render-only; no friction sim | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 385 | Impact Drake (UX Blade) | Bi-material friction/restitution collision + anti-slide | GAP | No material-dependent collision physics | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 386 | M-85 (BX Ratchet) | Binary O-type snap-burst mechanism + mass pre-load | GAP | No burst/snap-joint simulation | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 387 | 2-60 (BX Ratchet) | Tab-count burst-threshold collision + gap exposure | GAP | No burst torque or gap-angle check | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 388 | 4-50 (UX Ratchet) | Height-undercut contact-zone evasion + 4-tab burst | GAP | No vertical contact-zone alignment; burst absent | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 389 | 4-55 (CX Ratchet) | O-type snap binary burst at minimum mass | GAP | No burst/snap-joint model | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 390 | 7-70 (UX Ratchet) | Max-tab burst suppression + gap-fraction defense | GAP | No burst-tab threshold model | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 391 | 7-80 (BX Ratchet) | 7-tab burst threshold + contact-zone elevation | GAP | No burst model; height static geometry | MECH OK | authorable |
| 392 | 1-60 (UX Ratchet) | Min-tab burst floor + C1 contact-frequency collapse | GAP | No burst or contact-frequency simulation | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 393 | 1-70 (Ratchet) | Single-tab burst + gyroscopic gap-arc imbalance | GAP | No burst or CoM-offset imbalance sim | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `burst.ts:109`<-`BeySystem.ts:436` |
| 394 | 0-60 (Ratchet) | Friction-slip burst-immunity + XD torque coupling | GAP | No friction-slip/burst model; XD coupling unmodeled | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 395 | 9-70 (UX Ratchet) | Max rotating-tab burst + rounded-protrusion impulse | GAP | No burst-tab or impulse model | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 396 | 7-60 (UX Ratchet) | Asymmetric superprotrusion bimodal burst | GAP | No burst or angular-hotspot model | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 397 | Kick/K (CX Bit) | XD rail engagement + hexagon stabilize + dual-tooth burst | PART | Launch wired; hex restoring torque and burst absent | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 398 | Flat/F (BX Bit) | Max XD rail grip + controlled self-KO trajectory | PART | exitBehavior 'launch' real; tip-friction decay absent | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 399 | Taper/T (BX Bit) | Reduced contact-area friction, slower spin decay | GAP | No tip-friction or spin-decay simulation | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 400 | Ball/B (BX Bit) | Hertzian point-contact minimum-friction stamina | GAP | No Hertzian contact or friction model | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 401 | Needle Bit (N) | Cone-penetration lateral anchoring vs KO | GAP | No floor-penetration or anchor physics | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 402 | Low Flat Bit (LF) | Lower-CoM tip, friction-vs-engagement-frequency tradeoff | GAP | No CoM or engagement-frequency sim | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 403 | Orb Bit (Orb) | Hertzian contact + tilt-stiffness anti-destabilize | GAP | No contact or tilt-stiffness model | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 404 | Point Bit (P) | Tilt-triggered flat-to-sphere contact mode switch | GAP | No precession-tilt mode-switch physics | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 405 | Rush Bit (R) | Elevated XD gear, deepest rail engagement + tooth wear | PART | Launch wired; tooth-wear-over-time unmodeled | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 406 | High Taper Bit (HT) | Taller CoM lowers gyroscopic nutation threshold | GAP | No gyroscopic nutation-onset simulation | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 407 | Accel Bit (A) | 16-tooth gear/rail pitch mismatch causing bounce | GAP | SpeedLineData has no tooth-pitch concept | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `railBlend.ts:46`<-`SpawnManager.ts:1179` |
| 408 | Disc Ball Bit (DB) | Wide disc raises I/CoM + r^5 aerodynamic drag | GAP | No aerodynamic drag model | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 409 | Hexa Bit (H) | Hexagonal facets create hammer-motion restoring torque | GAP | No tilt-contact restoring-torque simulation | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 410 | Quake Bit (Q) | Diagonal-cut tip causes periodic bounce + XD asymmetry | GAP | No asymmetric-contact/bounce physics | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 411 | Metal Needle Bit (MN) | Steel cone plastically deforms stadium floor | GAP | No floor-deformation simulation | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 412 | Cyclone Bit (C) | Curved-vane tip centrifugally pumps XD orbit | GAP | No vane-pump mechanic | MECH OK | `clones.ts:52`<-`BeySystem.ts:322` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 413 | Elevate Bit (E) | Curved XD teeth lift Bey off floor mid-dash | GAP | No lift/air-gap ballistic simulation | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 414 | Free Ball Bit (FB) | Tip free-spins independent of Ratchet, decouples torque | GAP | freeSpin render-only; no torque decoupling | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 415 | Level Bit (L) | 3-zone radial XD engagement shifts with spin decay | GAP | No multi-zone radius-dependent rail engagement | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `surfaceState.ts:130`<-`BeySystem.ts:443` |

**CS7/CS8 contradictions (3 found).** CS8's own header fixes hard-ABS tip mu=0.17 [CONFIRMED] covering flat/sharp/semi-flat/defense/**ball**, yet Case 398 uses 0.15, Case 399 uses 0.12 and Case 400 uses 0.10 -- three violations of the file's own authoritative constant for the same tip class. CS7's "Common Errors to Avoid" explicitly flags mu=0.35 (flat) and 0.85 (rubber) as superseded, then Case 359 uses 0.35 for a hard ABS flat tip and Case 364 uses 0.85 for Attack(RF) bottoms -- reproducing the exact errors the same document warns against. Case 368's subsystem-progression table cites "Burst Ultimate Layer Series ... Cases 375", but Case 374 already covers BU jointly with DB and CS8's Case 375 is Shark Edge, an unrelated Gen-4 blade.

## LEDGER PART 8  -  CS10 arenas, stadiums, launch physics (Cases 545-585)

41 cases. **The most PART-heavy file in the corpus, and the best news in it** -- our arena editor genuinely can build these shapes. 20 named anime/real stadiums are PART (authorable geometry, missing only specific gimmicks), which is exactly the Sec.H1b finding. The 8 launch-physics cases (578-585) are all GAP, matching CS14.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 545 | BeyStadium Attack Type (BB-10) | Five-zone profile incl. non-monotonic Tornado Ridge | PART | Bowl profiles OK but all monotonic; ridge inexpressible (Sec.B1) | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 546 | Tornado Ridge engagement window | Ridge face-angle impulse split, grab-vs-slip by speed | GAP | No ridge term; no radial-speed-gated rail | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `railBlend.ts:46`<-`SpawnManager.ts:1179` |
| 547 | Sliding Shoot trajectory budget | Launch angle -> centre-arrival speed chain | GAP | No launcher at all; spawn is a debug HUD number | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` |
| 548 | BX-10 Xtreme Stadium | Square body, circular zone, asymmetric single-side exits | PART | Shapes/walls/gaps authorable; no ring-out semantics | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 549 | BX Xtreme Line gear rack | Full-ring gear rack, X-Dash force, notch-trap exit | PART | SpeedLineData exitBehavior 'launch' wired; no gear mesh | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 550 | Over Zone vs Xtreme Zone | Corner-trap physics, gear-notch, per-gen access probability | GAP | No ring-out/exit detection; health never zero-checked | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 551 | Gen 1-3 tops in Xtreme Stadium | No gear engagement, accelerated decay, KO probability | GAP | No decay integrator; no cross-gen gear gating | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 552 | Wide Xtreme + Infinity Stadium | Bowl-shape variants, oval radial asymmetry | PART | radiusX/radiusZ give oval bowls; no rail force variance | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 553 | Ultimate Beyta Stadium | Motorised Magnetic Spin Spot (rotating disc + magnet trap) | GAP | RotationManager exists but no magnetism or disc-drive coupling | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `fieldForce.ts:177`<-`BeySystem.ts:275` |
| 554 | Gen 1 Magnacore / Magne Stadia | Floor magnets, polarity modes, tip levitation/retention | GAP | No magnetism anywhere; tipPolarity zero consumers | MECH OK | `fieldForce.ts:177`<-`BeySystem.ts:275` / `spin.ts:65`<-`assembler.ts:175` |
| 555 | Ferromagnetic springs in fields | EG clock-spring force from magnet assembly, trigger delay | GAP | No springs, magnetism, or trigger-delay model | MECH OK | `fieldForce.ts:177`<-`BeySystem.ts:275` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 556 | Active driver energy budget | EG/Ignition motor burst, battery budget, Shot rebound | GAP | No spring/motor energy or rebound mechanics | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 557 | F:D Final Drive in 4D | Centrifugal cam mode-switch at w_switch=94.3 rad/s | GAP | No w-threshold mode switch; rpm cosmetic | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 558 | Original BBA Stadium (White) | Square housing, round sloped bowl, 4 corner pockets | PART | Bowl+pockets authorable via PitData; no ring-out semantics | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 559 | Field of Doom (baseball) | Asymmetric high/low wall, dual grass/mud, net backstop | PART | Walls/zones/surfaces authorable; no per-surface friction effect | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 560 | Blizzard Bowl (V-Force) | Flat ice surface, pine-tree ring with gaps, scattered rocks | PART | Shape+obstacles authorable; obstacles intangible (Sec.G1) | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 561 | R.P.M. Dish | Motorised central rotating disc, exponential spin-up | PART | RotationManager exists; no disc-to-bey drive coupling | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 562 | Black Sea Bowl | Water zones, moving boats, growing whirlpool, waves, piers | PART | **Already built as demoArenaConfig**; boats intangible, no whirlpool | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 563 | Tower Arena (Biovolt Cylinder) | Spherical bowl on column, raised victory platform, 10s hold | PART | Geometry authorable; pillar intangible; no hold win condition | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 564 | Roman Colosseum | Eight stepped concentric terraces, no exits, spin-out only | PART | Step profile exists; no spin-out win condition | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 565 | Cityscape Bowl | Building street grid, alleys, 90deg corners, rim protrusions | PART | Obstacles/walls authorable but intangible | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 566 | New Jersey Turnpike Dish | Banked highway, full 360deg vertical loop, curbs, flyovers | PART | Bridges incl. loop segments exist but **intangible** (Sec.G1) | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 567 | Great Wall of China Bowl | Stone corridors, crenellated climb, 3 arch tunnels | PART | Walls/profiles authorable; tunnels need underground layer | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 568 | Tsunami Stadium | Four water-depth zones with per-zone viscous decay | PART | Zones authorable; no viscous decay (rpm cosmetic) | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 569 | White House Bowl | Indestructible central building, roof platform, 18 breakable trees | PART | Obstacles authorable; intangible; isDestructible editor-only | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 570 | Sand Pagoda Bowl | Three terraced levels, 3 conical pagodas, deep sand, 55deg ramps | PART | Terraces/obstacles authorable; intangible; no sand drag | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 571 | Forbidden City Dish | Raised central platform, 2 ramps, hollow arch gate passage | PART | Geometry authorable; arch passage needs underground layer | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 572 | Tree Stump Bowl | Annual growth-ring ridges with gaps, score rock, lean slope | PART | **Needs the same ridge term as BB-10** (Sec.B1); rings inexpressible | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `spin.ts:65`<-`assembler.ts:175` |
| 573 | Brick Courtyard Rain Bowl | Progressive rain accumulation shrinking arena centre-out | PART | Weather/env schedule exist; no runtime arena-area shrink | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 574 | Blizzard Bowl (Season 1) | Snow accumulation shrinking arena rim-in, gusts, avalanches | PART | Weather+wind work; no accumulation or avalanche events | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 575 | Wok Arena (improvised) | Rocking pedestal dynamic tilt, 2 handle-weld notches | PART | Arena tilt exists in env schedule; no impact-driven rocking | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 576 | Obstacle Dish / Seaside Dome | Eight obstacle categories, 18% floor / 12% wall coverage | PART | All 6 obstacle shapes authorable; **all intangible** | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 577 | Moon Base Trampoline Arena | 1/6 gravity, central tower, 6.03x bounce height | PART | gravityScale per arena works; tower intangible | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` |
| 578 | String Launcher Physics | Pull velocity -> w0, energy budget, tilt-angle contact shift | GAP | No launcher; rpm typed into a debug HUD | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 579 | Gear / Winder Launcher | Gear ratio multiplication, elastic pre-tension, spin direction | GAP | No launcher object or gear ratio | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 580 | BX Xtreme Launcher | Max gear ratio, peak w, cross-gen momentum comparison | GAP | No launcher variants | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 581 | Tilt Angle Physics | Contact height shift, track interaction, precession rate | GAP | tiltAngle static render pose; no precession | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 582 | Power Percentage | Spin life scaling, first-hit impulse, self-KO risk | GAP | No launch power; no spin life; no KO | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 583 | Launch Position | Spawn radius, critical orbit speed, edge-launch trajectory | PART | Spawn position settable in HUD; no critical-orbit math | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` |
| 584 | Spin Steal x Launch x Bearing | Full steal formula, bearing attenuation, advantage window | GAP | No spin steal, bearing model, or launch power | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:65`<-`assembler.ts:175` |
| 585 | First-Hit Recoil Kinematics | COR, material-dependent bounce, self-KO probability | GAP | Wall COR exists; no bey-bey recoil or self-KO | MECH OK | `surfaceState.ts:130`<-`BeySystem.ts:443` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |

**CS10 contradictions (7 found).** Case 564 quotes two different step-climb thresholds (1.11 m/s in prose vs ~2.45 m/s in its own table). Case 551 gives total decay 50.5 rad/s^2 / 7.1s in prose vs 22.0 / 16.4s in its analysis block. Case 584's narrative says B:D steal is 5% and EWD 12% while its own table says 29.4% and 70.6%. Case 562 computes a wave kick of Dv=117 m/s and self-labels it "extreme -- simplified model". Case 563 corrects its own structural elevation mid-case. Case 569 derives tree-destruction three times with different results. Case 575's wobble derivation self-corrects from 22.9deg to an "effective 2deg". **Also important and non-contradictory:** no case in CS10 carries an episode number, so Sec.H6's episode-replay targets cannot be sourced from this file.

## LEDGER PART 9  -  CS11 special-move physics (Cases 586-600)

15 cases. **All GAP.** This file is the engine spec for special moves; `SpecialMoveManager` has a phase machine but none of CS11's actual mechanics.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 586 | Special Move Taxonomy (4 archetypes) | Archetype->game-counterpart mapping, J_max ceiling | GAP | No archetype system; no impulse ceiling enforcement | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 587 | Stampede Rush (linear-burst) | Flat-face smash impulse + EG spring augmentation | GAP | No bey collision; no EG spring; no [M] layer | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 588 | Gyro Anchor (anchor) | Gyroscopic stability max, bearing LAD, steal radius | GAP | No gyro physics, bearing model, or spin steal | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 589 | Orbital archetype / LAD orbit | Orbit period, per-orbit spin save, bearing advantage | GAP | No orbit model or decay to save against | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 590 | Tactical Burst | Lower peak force, shorter active window variant | GAP | No bey collision; phase timings exist but unparameterised | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 591 | Shock Pulse (shockwave) | Radial AoE impulse with 1/r falloff | GAP | TriggerZoneManager never registered; no AoE | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 592 | Aerial archetype | waitForAirborne gate, apex strike, 2.0x aerial damage | GAP | JumpFlightConfig exists unused; no airborne state | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 593 | Storm Bringer (knockup) | Vertical impulse arc, h_max, landing AoE | GAP | No vertical axis in combat; no landing AoE | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spin.ts:65`<-`assembler.ts:175` |
| 594 | EG spring reset / cooldown basis | Spring re-wind time setting minimum special cooldown | GAP | No spring; cooldowns exist in SpecialMoveManager but unfounded | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 595 | Frame data table | Per-move windup/active/winddown/peakMs frame data | PART | SpecialMovePhase has durationSec; no windup/active/peak split | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 596 | Move parameter grid | Full engine parameter set per move | GAP | Most fields have no consumer in src | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 597 | Engine unit calibration | linearImpulse/spinDelta/verticalImpulse unit scales | GAP | **The blocking contradiction (Sec.K7)**; no unit layer exists | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 598 | Stat normalisation table | Attack/defense/stamina -> engine values, 360-pt budget | GAP | PartData stats never leave the editor | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 599 | AI difficulty / prediction | 5-tick lookahead, engage radius, difficulty tiers | GAP | No AI at all; TargetManager zero bindings | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 600 | Impulse ceiling derivation | J_max_phys -> 5000 engine-unit single-phase ceiling | GAP | No impulse system to cap | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |

## LEDGER PART 10  -  CS12 combo system physics (Cases 601-618)

18 cases. **All GAP.** There is no input-sequence system, no power bar, and no combo registry in `src` -- this file specifies all three.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 601 | Combo Taxonomy (3 categories) | Movement categories -> 3-button sequences | GAP | No combo system; ControlManager has only axes + jump/trigger | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 602 | Sequence Detection Window | Per-combo windowMs from quarter-orbit timing | GAP | No input history buffer | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 603 | Quick Dash Left / Right (free) | Rubber-tip grip-burst lateral sprint, forceImpulse | GAP | No combo detection; no dash impulse | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 604 | Guard Tap (free) | Gyro recenter, 250ms wobble suppression | GAP | No wobble/precession to suppress | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 605 | Feint (free) | Turning-radius evasion, direction reversal | GAP | No combo system; reversal unmodelled | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 606 | Riposte (cost 15, defense-only) | Parry absorption then counter-impulse | GAP | No bey collision to parry | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 607 | Pivot Strike (cost 15, balanced) | Oblique contact bonus from mixed-angle faces | GAP | No bey collision or contact angle | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 608 | Power Thrust (cost 25) | Three-hit pursuit chain, lockMs commitment | GAP | No bey collision or lock state | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 609 | Spin Leech Jab (cost 35, stamina) | Orbital approach + rubber-ER spin steal | GAP | No spin steal; rpm cosmetic | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 610 | Sliding-window detection algorithm | 600ms prune, last-3 match, 13-gate chain | GAP | No input buffer or gate chain | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 611 | Cost tier physics (0/15/25/35) | Power units mapped to real joules | GAP | No power bar in combat | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 612 | Cooldown architecture | Cooldowns as orbital-period multiples | GAP | No orbit period; no per-combo cooldown registry | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 613 | Type restriction gate | Combo availability by bey type (attack/defense/stamina) | GAP | PartData stats never leave editor; no bey type at runtime | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 614 | The four hard ceilings | damageMultiplier<=1.5, lockMs<=300, no invuln, spinDelta<=50 | GAP | No damage/lock/invuln/spin systems to cap | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 615 | ComboTask -> BehaviorRef compilation | Admin-authored tasks compiled to engine behaviours | GAP | No behaviour registry; **Firestore collection named here (Sec.M)** | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 616 | Combo HUD strip + 3-slot cap | Max 3 attached combos per bey, HUD strip | GAP | No combo attachment or HUD | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 617 | Power bar mechanics | 0-100 bar, 8-12 units/sec passive charge | GAP | No power bar; SpecialMoveManager resonance is separate | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 618 | Forbidden effect table + checklist | 11-gate new-combo design checklist | GAP | No effect system to forbid against | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |

## LEDGER PART 11  -  CS14 launchers, grips, accessories (Cases 892-910)

19 cases. **16 GAP, 3 PART.** "Launching" today is clicking a debug button and typing numbers; there is no launcher object, pull model, gear ratio, or two-stage charge anywhere.

| Case | ShortTitle | MechanicNeeded | Status | Evidence | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|---|
| 892 | Launch physics fundamentals | Pull force/distance -> spin energy via gear ratio | GAP | RPM set directly in HUD; no pull/gear/energy calc | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 893 | Winder / Snap Launcher (S1) | Manual crank, spring-wind pre-launch | GAP | No crank/spring; only a plain RPM field | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spin.ts:65`<-`assembler.ts:175` |
| 894 | Standard Ripcord (EZ Shooter) | Ripcord pull-force/distance/gear-efficiency | GAP | HUD has RPM+Tilt only; no ripcord simulation | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 895 | Reverse / Left Spin Shooter | Left-spin-capable launcher mechanism | PART | R-key toggles `_spinDir` right/left; no launcher object | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` |
| 896 | HMS Double Shooter | Narrow-spindle gear-ratio compensation | GAP | No spindle/gear-ratio or HMS compatibility | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` |
| 897 | BeyStringer / String Launcher | Long-pull string, ~3x launch energy | GAP | No string/pull-distance/energy model | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 898 | Launcher Grip / Customize Grip | Moment-arm force multiplier, tighter launch angle | GAP | No grip object or force multiplier | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 899 | Light Launcher 2 | Reduced-pull entry launcher, ~73% output | GAP | No launcher variants | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` |
| 900 | Burst Launcher (ripcord L/R) | Lock-tooth ripcord ensuring min burst-threshold spin | GAP | No lock-tooth or burst-threshold logic | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 901 | Burst String Launcher (B-88/B-99) | String mechanism, extended burst-resistance window | GAP | No string launcher or burst-resist window | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 902 | BX Launcher (ratchet-click) | Ratchet pull for consistent high-energy spin | GAP | No ratchet/engagement-rate mechanic | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 903 | Ripcord (consumable) | Tooth wear degrading launch force over uses | GAP | No consumable/wear tracking | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `surfaceState.ts:130`<-`BeySystem.ts:443` |
| 904 | Launcher Grip Level 5 | Spring-loaded grip locking launch angle to +-3deg | GAP | No spring-grip or angle lock | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 905 | Winder (spring wind accessory) | Motor pre-spin for precession/LAD tuning | PART | RPM+Tilt HUD allow manual low-spin test; no precession readout | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 906 | RC Shooter / RC EG Launcher | RF remote-triggered mid-battle EG release | GAP | No remote trigger or Engine Gear system | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` |
| 907 | Sliding Shoot Technique | Launch-angle tilt pre-activating tip mode | PART | Tilt field sets initial tilt; no tip mode-switch logic | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 908 | Beypointer / BeyLogger | QR-read device tracking BeyPoints and spin time | GAP | No tracking/record feature | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 909 | Power Launcher / BeyMax Shooter | Spring-preload adding <1% launch energy | GAP | No spring-preload or launcher-energy object | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 910 | Launcher Compatibility Matrix | Cross-generation launcher-to-bey compatibility rules | GAP | No launcher types or compatibility matrix | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` |

**CS14 contradictions (5 found).** Case 892's "typical" ripcord range (260-520 rad/s) is contradicted by Case 894's computed output for the *same* launcher (735 avg / 954 peak) -- nearly double. Case 896 states a formula including a radius-ratio term, then its own worked calculation drops the term entirely. Case 898 gives identical `momentArmExtension_mm` (80) for standard and catapult grips while assigning different force multipliers (1.5 vs 2.0), contradicting its own prose that catapult doubles the arm to 160mm. Case 899 claims 73% output but computes 737 rad/s against Case 894's 735 -- i.e. ~100%. Case 903's wear table says 80% efficiency at 100+ launches while its own math just above gives 85%.

---

## GAP-CODE KEY  -  used by Ledger Parts 12-14

The remaining three files (CS9, CS13, CS15 = ~1,440 cases) have highly uniform Evidence. Codes are defined once here so every case still gets its own row without 1,440 repetitions of the same sentence. Each code is a verified finding from Sec.O's code audit.

| Code | Meaning (verified in `src/`) |
|---|---|
| **C** | No bey-vs-bey collision -- one physics entity only. Blocks every contact/smash/recoil/deflect/parry mechanic |
| **I** | No per-part moment-of-inertia composition -- mass+geometry authorable, `I` never summed |
| **D** | No spin-decay integrator -- `rpm` cosmetic, hardcoded, never decays |
| **T** | `tiltAngle` is a static render pose -- no precession/nutation/LAD/topple/tilt-gated contact |
| **M** | `gimmickType`+`gimmickStrength` set but **never read** -- no w-threshold or centrifugal mode switch |
| **B** | No burst / health-zero / ring-out -- `health` clamped, never checked against zero; match cannot end |
| **P** | `ProjectileManager` bullets collide with nothing |
| **Z** | `TriggerZoneManager` never registered; `gravity_pull` radial-inward only (no tangential vortex / outward push) |
| **J** | `JumpFlightConfig` fully built, **zero runtime consumers** -- all aerial/self-displacement |
| **E** | `BuffDebuffManager.getEffective()` has zero callers -- all stat/state effects inert |
| **X** | No combo input-sequence system at all -- `ControlManager` exposes only axes + jump/trigger |
| **L** | Requires a `BeyLink` concept that does not exist -- cooperative/multi-bey |
| **S** | Signed spin direction stored (`spinDir`/`tipPolarity`) but unused -- counter-spin, spin-steal, magnetism |
| **R** | Requires runtime part mutation (detach / swap / extend / morph geometry mid-battle) -- author-time only |
| **A** | `TargetManager` has zero bindings -- aim, lock-on, lead-aim, prediction |
| **F** | `freeSpin` only reassigns a render group -- cosmetic, no bearing/torque decoupling |
| **[M]** | No BeySpirit amplification layer -- the anime override tier (Sec.K2) |
| **geom** | Geometry/mass **is** authorable -- this is the PART half that works |

## LEDGER PART 12  -  CS9 Burst series, full lineage (Cases 416-544 + 11 overflow blocks)

The largest file (45,893 lines, ~450 case headings). Pattern is near-uniform: **PART** = `geom` works but `I` never composed; **GAP** = a named Burst gimmick (ratchet burst, Mugen Lock, Limit Break, Awakening Wing, High/Low mode) or a tip/driver mechanic. Burst's own defining win condition is code **B** for the entire file.

**CRITICAL NUMBERING FINDING, flagged not resolved:** the reader covering CS9's middle third returned case numbers **551-621** carrying Burst-era content (SK Chip Spriggan, Chassis 2B, DB Core Spriggan, Layer Nightmare Longinus...). But `INDEX.md` assigns 545-585 to CS10, 586-600 to CS11 and 601-618 to CS12, and this Ledger's Parts 8-10 document those numbers as arena/special-move/combo cases. **Either CS9 contains a ~70-case block that collides with three other files, or the reader mis-attributed its headings.** This must be verified by direct re-read before the Phase 13 extractor runs, because a collision here would silently merge Burst part cases with arena and combo cases. It is recorded here as an open item rather than silently resolved; the rows below use the numbers as reported.

### CS9 block A  -  Cases 416-544 + 1001-1024 (Burst base through DB/BU)

| Case | ShortTitle | Status | Gap | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|
| 1001 | Winning Valkyrie Energy Layer | PART | geom; B, I | MECH OK | authorable / `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 1002 | Xtreme Performance Tip | GAP | D (annular rubber floor torque) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1003 | Xeno Xcalibur Energy Layer | PART | geom; B (tall-tooth threshold) | MECH OK | authorable / `burst.ts:109`<-`BeySystem.ts:436` |
| 1004 | Magnum Forge Disc | PART | geom; I, no layer-disc alignment | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1005 | Impact Performance Tip | GAP | D (three-point mixed friction) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1006 | Sieg Xcalibur Energy Layer | PART | geom; I, B (hilt-gap fatigue) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1007 | Forge Disc 1 Asymmetric | GAP | I (C1 eccentric flail momentum) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1008 | Iron Performance Tip | GAP | D, F (metal-flat + spring lock) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1009 | Buster Xcalibur Layer | GAP | M (centrifugal bistable sword) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1010 | Core Disc 1' | GAP | I (bilateral eccentricity min) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1011 | Dagger Frame | PART | geom; T (thin C4 ring LAD) | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` |
| 1012 | Sword Performance Tip | GAP | T, D (scrape tilt threshold) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1013 | DB Core Xcalibur | GAP | M, B (Spring Bound + BU Lock + High/Low) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1014 | Xiphoid BU Blade | PART | geom; C (C3 smash wings) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1015 | Armor 1 Ring | PART | geom; B (burst amplifier) | MECH OK | authorable / `burst.ts:109`<-`BeySystem.ts:436` |
| 1016 | Xanthus Forge Disc | PART | geom; I (heaviest disc) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1017 | Sword' Dash Performance Tip | GAP | B, D (Dash burst resistance) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1018 | Victory Valkyrie Layer | GAP | M, C (dual-mode wing flip) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1019 | Boost Forge Disc | PART | geom; C (extending wings) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1020 | Variable Performance Tip | GAP | D, R (three-stage rubber wear) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1021 | God Valkyrie Layer | GAP | M, C (central-hub Spring Bound) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1022 | Strike God Valkyrie + Chip | PART | geom; B, I | MECH OK | authorable / `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 1023 | Forge Disc 6 | PART | geom; I, C (contact frequency) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1024 | Vortex Frame | GAP | I (aerodynamic slot torque) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 416 | Reboot Performance Tip | GAP | M (centrifugal rubber deploy) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 417 | Ultimate Reboot Tip | GAP | M (stiffer spring, earlier deploy) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 418 | Cho-Z Winning Valkyrie Layer | PART | geom; I, B | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `burst.ts:109`<-`BeySystem.ts:436` |
| 419 | Forge Disc 12-Core | PART | geom; T, I (C12 ratchet freq) | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 420 | Volcanic Performance Tip | GAP | D (wide rubber floor torque) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 421 | Cho-Z Valkyrie Layer | PART | geom; I (peripheral zinc wings) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 422 | Forge Disc Zenith | PART | geom; I (max Cho-Z inertia) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 423 | Evolution Performance Tip | GAP | R, D (two-stage spike wear) | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 424 | Level Chip | GAP | I (eccentric counter-mass) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 425 | Gatinko Chip Valkyrie | GAP | B (burst-control hub) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 426 | Layer Base Slash | PART | geom; C (C3 slashing blades) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 427 | Layer Weight Retsu | PART | geom; I (aluminium ring) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 428 | Forge Disc Blitz | PART | geom; I (heaviest Gatinko) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 429 | Power Performance Tip | GAP | D (rubber base friction) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 430 | DB Core Valkyrie | GAP | M (spring rebound, High/Low CoM) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 431 | Blade Savior | PART | geom; C, R (rubber Hertzian wear) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 432 | Armor 7 | PART | geom; M, B (High/Low + BU Lock) | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` |
| 433 | Performance Tip Shot | GAP | D (disc-integrated attack driver) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 434 | Superking Chip Valkyrie | GAP | B (PC burst tab hierarchy) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 435 | Ring Brave | PART | geom; I, C (C3 smash) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 436 | Chassis 2A | PART | geom; I (monolithic disc-layer) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 437 | Performance Tip Evolution' | GAP | R, D, B (wear + Dash resist) | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 438 | DB Core Valkyrie 2 | GAP | M, S (High/Low + dual-spin) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 439 | BU Blade Ultimate | PART | geom; C, R, B | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:84`<-`BeySystem.ts:530` / `burst.ts:109`<-`BeySystem.ts:436` |
| 440 | Armor 9 | PART | geom; C (impulse interception) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 441 | Forge Disc Legacy | GAP | T (anti-LAD, wobble-phase friction) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 442 | Performance Tip Variable' | GAP | R, D (three-stage spike wear) | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 443 | Z Achilles Energy Layer | PART | geom; I, B (C4 zinc wings) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `burst.ts:109`<-`BeySystem.ts:436` |
| 444 | Forge Disc 11 | GAP | I (C2 elliptical eccentricity) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 445 | Performance Tip Xtend | GAP | M, D (manual dual-mode height) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 446 | Cho-Z Achilles Layer | GAP | M, B (bistable burst-stopper wings) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` |
| 447 | Forge Disc 00 | PART | geom; I (heaviest core disc, OWD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 448 | Performance Tip Dimension | GAP | M, R (six-config height/tip matrix) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 449 | Superking Chip Achilles | GAP | B (burst-control hub) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 450 | Ring Infinite | PART | geom; I (balance ring annular) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 451 | Infinite Sword Accessory | PART | geom; R, C (clip-on attack) | MECH OK | authorable / `partMutation.ts:84`<-`BeySystem.ts:530` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 452 | Chassis 1B | PART | geom; I (65% inertia share) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 453 | Dimension' Driver | GAP | M, B, D (3-height + Dash spring) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 454 | DB Core Achilles | GAP | B (Rubber Lock burst resistance) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 455 | BU Blade Zest | PART | geom (both modes authorable); M (no in-battle switch) | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 456 | Armor 4 | PART | geom; I (hollow annular) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 457 | Forge Disc Illegal | PART | geom; I, T (max-OWD + LAD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `spin.ts:253`<-`BeySystem.ts:425` |
| 458 | Quattro' Driver | GAP | M, F, D (four-mode driver) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 459 | Guardian Kerbeus Layer | GAP | C, M (Bound Defense rubber chain) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 460 | Forge Disc Heavy | PART | geom; I (heaviest God-era zinc) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 461 | Performance Tip Revolve | GAP | F, T (sharp + free outer ring LAD) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:253`<-`BeySystem.ts:425` |
| 467 | SK Chip Deathscyther | GAP | B (three ratchet tabs) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 468 | Ring Hollow | GAP | I (asymmetric hollow eccentricity) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 469 | Chassis 4A | PART | geom; I, S (dual-spin internal disc) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 470 | Forge Disc 12 | PART | geom; I (lightest zinc core) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 471 | Disc Frame Axe | PART | geom; T (wide C3 frame LAD) | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` |
| 472 | Performance Tip High Accel' | GAP | D, B (elevated flat + Dash) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 473 | Dark Deathscyther Layer | PART | geom; C (two angled blade pairs) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 474 | Forge Disc Force | PART | geom; I (C4 zinc diamond) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 475 | Performance Tip Jaggy | GAP | D (eight-point star perimeter) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 476 | DB Core Bahamut | GAP | B (slope burst resist + BU Lock) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 477 | BU Blade Roar | GAP | M (bistable protrusions below w) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 478 | Armor 6 Left-Spin | PART | geom; S (left-spin context) | MECH OK | authorable / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 479 | Forge Disc Karma | GAP | I (ten blades aero down force) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 480 | Performance Tip Metal Drift | GAP | F, B (bearing free-spin + metal lock) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `burst.ts:109`<-`BeySystem.ts:436` |
| 481 | Gatinko Chip Diabolos | PART | geom; S, B (heaviest chip, dual-spin) | MECH OK | authorable / `spinExchange.ts:99`<-`BeySystem.ts:449` / `burst.ts:109`<-`BeySystem.ts:436` |
| 482 | Layer Base Erase | PART | geom; C, S (five upward blades, LS) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 483 | Forge Disc Vanguard | PART | geom; I (metal frame + rivets) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 484 | Performance Tip Bullet | GAP | I, R (detachable bullet satellite) | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 485 | Hell Salamander Layer | PART | geom; M, B (dual Defense/Attack mode) | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` |
| 486 | Emperor Forneus Layer | PART | geom; C, I (twelve warped blades) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:65`<-`assembler.ts:175` |
| 487 | Forge Disc 0 | PART | geom; I (zinc ring + ABS protrusions) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 488 | Performance Tip Yard | GAP | F, D (free metal ball + wide ring) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 489 | DB Core Lucifer | GAP | B (three thick PC locks) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 490 | BU Blade Barricade | GAP | M (centrifugal barrier deploy) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 491 | Armor 10 | PART | geom; I (C10 uniform mass ring) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 492 | Forge Disc Illegal Stamina | PART | geom; I, T (circular high-OWD, LAD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `spin.ts:253`<-`BeySystem.ts:425` |
| 493 | Performance Tip Bearing Mobius | GAP | F, T (ball-bearing sharp metal, LAD) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:253`<-`BeySystem.ts:425` |
| 494 | SK Chip Lucifer 2 | GAP | B (metal insert raises threshold) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 495 | Ring The End | GAP | F, M (bistable free-spin counter-blade) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 496 | Forge Disc Kou | GAP | M (Limit Break deploy teeth) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 497 | Performance Tip Drift | GAP | F, D (free-spin sharp bushing) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 498 | Gatinko Chip Dragon 2 | GAP | B (three hard-lock tabs) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 499 | Layer Imperial | GAP | M, R (three-stage rubber awakening) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 500 | Ignition' Integrated Driver | GAP | M, D (spring-motor driver) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 501 | SK Chip Dragon | GAP | B, I (three PC tabs) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:65`<-`assembler.ts:175` |
| 502 | Ring Tempest | GAP | C, M (hit-triggered Spring Bound blades) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 503 | Chassis 1A | PART | geom; I (heaviest attack double chassis) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 504 | Performance Tip Charge Metal | GAP | D, T (wide metal flat, low CoM, LAD) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:253`<-`BeySystem.ts:425` |
| 505 | DB Core Dragon | GAP | M (spring k=8200 N/m, High/Low) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 506 | BU Blade Gatling | GAP | M (spring blades Slashing/Counter) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 507 | Armor 10 Burst Ultimate | PART | geom; I (serrated ten-tooth ring) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 508 | Forge Disc Karma Right-Spin | GAP | I, S (reversed down-force blades) | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 509 | Performance Tip Charge Metal' | GAP | B, D (Dash reinforced spring-lock) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 510 | SK Chip Ragnaruk | GAP | B (ratchet column burst control) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 511 | Ring Glide | GAP | R, C (three pivoting stamina wings) | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 512 | Chassis 1S | PART | geom; I (circular outer-CoG stamina) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 513 | Forge Disc Wheel | PART | geom; I (circular zinc, four gaps OWD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 514 | Performance Tip Revolve | GAP | F, T (fixed sharp + wide free ring) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:253`<-`BeySystem.ts:425` |
| 515 | Crash Ragnaruk Layer | PART | geom; I (four-wing metal-reinforced) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 516 | Forge Disc 11 | PART | geom; I (elliptical ABS core) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 517 | Disc Frame Reach | PART | geom; C (six blades, two heights) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 518 | Performance Tip Wedge | GAP | D (hollow zinc cone, min contact radius) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 519 | DB Core Ragnaruk | GAP | B (seven fine-tooth ratchet locks) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 520 | Blade Cyclone | GAP | R, M (pivoting stamina wings) | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 521 | Armor 6 DB/BU Reuse | PART | geom; I (square-protrusion ring) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 522 | Forge Disc Giga | PART | geom; I, T (octagonal zinc, LAD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `spin.ts:253`<-`BeySystem.ts:425` |
| 523 | Performance Tip Never | GAP | F, D (free cone inside POM ring) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 524 | SK Chip Longinus | GAP | B, S (left-spin burst tab) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 525 | Ring Rage | PART | geom; C (two metal dragon heads, C2) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 526 | Chassis 3A | PART | geom; I, S (left-spin heavy attack) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 527 | Performance Tip Destroy' | GAP | F, B, D (star tip + free plate + Dash) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 528 | DB Core Belial | GAP | B (hollow annular right-spin + locks) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 529 | Blade Dynamite + F/L Gear | GAP | M, R, F (swappable Evolution Gears) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `partMutation.ts:84`<-`BeySystem.ts:530` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 530 | Armor 2 | PART | geom; I (two-point attack armor) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 531 | Forge Disc Nexus + S/D Gear | GAP | M, F (Evolution Gear modes) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 532 | Performance Tip Venture + Gears | GAP | M, D (alternating flat/rubber modes) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 533 | Assembly Dynamite Belial Venture-2 | GAP | I, D, B (full assembly totals) | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 534 | DB Core Belial 2 | GAP | M, B (Overdrive System core) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` |
| 535 | Blade Dangerous | PART | geom; C (three wings, rubber inserts) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 536 | Performance Tip Almight + Gears | GAP | M, D (disc-integrated + three gears) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 537 | Assembly Dangerous Belial Almight | GAP | I, D, M (Perfect Gear assembly) | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 538 | DB Core Belial 3 | GAP | B, M (Overdrive + BU Lock) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 539 | BU Blade Divine + A/H Gear | GAP | M, I (metal-insert wings + gears) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 540 | Forge Disc Nexus Base | PART | geom; I (eight-blade base, no gear) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 541 | Performance Tip Bearing Drift | GAP | F, D (ball-bearing free cone) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 542 | Assembly Divine Belial Bearing Drift | GAP | I, D, M (H Gear assembly totals) | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 543 | Tornado Wyvern 4Glaive Atomic | GAP | F, B, M (free-spin ring burst absorb) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 544 | Jet Wyvern Around Just 1D | GAP | M, D (rubber dual-mode, two-phase decay) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |

### CS9 block B  -  the collision-flagged range as reported (551-621), plus 867-891, 1158-1175

| Case | ShortTitle | Status | Gap | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|
| 551 | SK Chip Spriggan + Ring World | GAP | B, S (dual-spin flip, burst-stopper tab) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 552 | Chassis 2B dual-spin | GAP | F, M, S (free-spin perimeter defense mode) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `partMutation.ts:141`<-`BeySystem.ts:551` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 553 | Performance Tip Unite' | GAP | D, B (rubber flat + Dash spring) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 554 | Assembly World Spriggan Unite' 2B | GAP | I, D, B | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 555 | DB Core Spriggan 1 | GAP | B (burst engagement tabs, lock torque) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 556 | Blade Astral + Armor 0 | PART | geom; I, S (dual-spin seat) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 557 | Forge Disc Over | PART | geom; I (33.7g circular high-OWD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 558 | Performance Tip Quattro | GAP | M, D (four selectable tip modes) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 559 | Assembly Astral Spriggan Over Quattro-0 | GAP | I, D, B | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 560 | Energy Layer Geist Fafnir | PART | geom; S (metal inserts, left-spin) | MECH OK | authorable / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 561 | Disc 8' + Frame Proof | PART | geom; I (elliptical OWD + frame ring) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 562 | Performance Tip Absorb | GAP | F, M (spring metal sharp + free ring) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 563 | Assembly Geist Fafnir 8'Proof Absorb | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 564 | SK Chip Fafnir + Ring Mirage | GAP | C, S (spin-equalization needs contact) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 565 | Chassis 2S stamina | PART | geom; I (45.2g flat OWD, largest I) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 566 | Nothing Driver | GAP | F, D (minimal-contact free-spin cone) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 567 | Assembly Mirage Fafnir Nothing 2S | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 568 | DB Core Fafnir + Blade Vanish | GAP | B, M (burst tab torque + Vanish gimmick) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 569 | Armor 3 + Disc Tapered | PART | geom; I (mid-radius armor + OWD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 570 | Kick Driver | GAP | C, M (spring-loaded rubber rebound ring) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 571 | Assembly Vanish Fafnir Tapered Kick-3 | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 572 | Regalia Genesis + Mugen Lock | GAP | B, M (infinite-lock burst prevention) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 573 | Prime Apocalypse Mugen Lock | GAP | B, M | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 574 | Hybrid motorized driver | GAP | D, M (motor-driven powered spin) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 575 | Assembly Perfect Genesis Hybrid | GAP | D, M, I | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 576 | Energy Layer Lost Longinus | PART | geom; I, S (C2 two-lance, left-spin) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 577 | Forge Disc Nine | PART | geom; I (nine-vane, 81.7% assembly I) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 578 | Performance Tip Spiral | GAP | D (flat ABS floor friction torque) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 579 | Assembly Lost Longinus Nine Spiral | GAP | D, C | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 580 | Layer Nightmare Longinus | PART | geom; I (disc-integrated annulus) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 581 | Performance Tip Destroy | GAP | F, D (star tip + free stabiliser) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 582 | Assembly Nightmare Longinus Destroy | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 583 | Layer Bloody Longinus | GAP | M, B (centripetal burst-lock at high w) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` |
| 584 | Forge Disc 13 | PART | geom; I (thirteen-spoke near-circular) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 585 | Performance Tip Jolt | GAP | D (rubber high-friction attack tip) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 586 | Assembly Bloody Longinus 13 Jolt | GAP | B, D, C | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 587 | DB Core Longinus + Guilty + Armor 2 | PART | geom; I (three-piece 41.0g stack) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 588 | Forge Disc Karma | PART | geom; I (29.2g annular) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 589 | Tip Metal Destroy | GAP | D, M (dual-phase metal/rubber contact) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 590 | Assembly Guilty Longinus Karma MD-2 | GAP | I, D (79.0g heaviest combo) | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 591 | SK Chip Helios 2 | PART | geom; I (Metal Chip Core insert) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 592 | Ring Volcano Limit Break | GAP | M (free-rotating frame, blade revelation) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 593 | Tip Zone'+Z | GAP | F, T (free Z-plate LAD stabilisation) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:253`<-`BeySystem.ts:425` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 594 | Assembly Helios Volcano Ou Zone'+Z | GAP | C, S, I (opposite-spin stamina) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:65`<-`assembler.ts:175` |
| 595 | Layer Beast Behemoth | GAP | B (two-layer gap-fill, tall-tooth resist) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 596 | Forge Disc Heavy | PART | geom; D, I (centralized weight) | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:65`<-`assembler.ts:175` |
| 597 | Performance Tip Hold | GAP | F, D (free wide flat + friction ring) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 598 | Assembly Beast Behemoth Heavy Hold | GAP | D, B, C | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 599 | Layer Obelisk Odin | GAP | C, B (protrusion-catch burst attack) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 600 | Forge Disc Triple | PART | geom; I (three-fold knob, aero imbalance) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 601 | Performance Tip Xtreme | GAP | D, R (rubber flat, banking, wear) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 602 | Assembly Obelisk Odin Triple Xtreme | GAP | B, C | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 603 | Layer Quad Quetzalcoatl | GAP | T (tear-drop asymmetry precession) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 604 | Forge Disc Jerk | GAP | C, M (spring bumper bound-defense) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 605 | Performance Tip Press | GAP | D, T (ball tip decay, wall scrape) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:253`<-`BeySystem.ts:425` |
| 606 | Assembly Quad Quetzalcoatl Jerk Press | GAP | T, B, C | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `burst.ts:109`<-`BeySystem.ts:436` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 607 | Gatinko Chip Ashura | GAP | B (seven-lock ratchet resistance) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 608 | Layer Weight Ten | PART | geom; I (hexagonal 8.4g) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 609 | Layer Base Bushin | GAP | C (twelve-blade recoil vectors) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 610 | Forge Disc Hurricane | GAP | F, D (metal core + free sleeve scrape) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 611 | Performance Tip Keep | GAP | F, D (partially free rubber ball clutch) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 612 | Assembly Bushin Ashura Hurricane Keep Ten | GAP | I (53.0g five-part) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 613 | Layer Hazard Kerbeus | GAP | C, M (metal chain blades, torsion spring) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 614 | Forge Disc 7 | PART | geom; I (asymmetric elliptical, highest OWD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 615 | Performance Tip Atomic | GAP | F, T (free oversized ball, four-tab LAD) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:253`<-`BeySystem.ts:425` |
| 616 | Assembly Hazard Kerbeus 7 Atomic | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 617 | Layer Base Venom | GAP | B (three-blade gap-width burst vuln) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 618 | Assembly Venom Diabolos Vanguard Bullet | GAP | I, D, C | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 619 | Layer Kaiser Kerbeus | GAP | T, B (tilt-dependent burst) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `burst.ts:109`<-`BeySystem.ts:436` |
| 620 | Forge Disc Limited | PART | geom; I (diamond compact) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 621 | Assembly Kaiser Kerbeus Limited Press | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 867 | Layer Dead Phoenix | GAP | R, B (detachable Dead Armor burst-sacrifice) | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `burst.ts:109`<-`BeySystem.ts:436` |
| 868 | Forge Disc 10 | PART | geom; I (ten-fold annular) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 869 | Performance Tip Friction | GAP | D (POM flat mu=0.10 stamina) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 870 | Assembly Dead Phoenix 10 Friction | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 871 | Layer Revive Phoenix | GAP | C, M (armor parry mechanism) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 872 | DB Core Phoenix | GAP | B (four-tooth ratchet hub) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 873 | Blade Prominence | PART | geom; R (detachable 9.5g shield) | MECH OK | authorable / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 874 | Armor-10 | PART | geom; I (13.4g annular ring) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 875 | Forge Disc Tapered | PART | geom; I (29.3g highest-inertia standard) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 876 | Tip Metal Universe | GAP | F, D (steel ball-bearing mu~0.012) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 877 | Assembly Prominence Phoenix 10 Tapered MU | GAP | I (85.4g six-part) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 878 | Layer Twin Nemesis | GAP | T, I (n=2 symmetry wobble/imbalance) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 879 | Forge Disc 3 | PART | geom; I (two-zone inboard mass) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 880 | Disc Frame Hit | PART | geom; I (ring + asymmetric protrusion) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 881 | Assembly Twin Nemesis 3Hit Jaggy | GAP | I, T | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:253`<-`BeySystem.ts:425` |
| 882 | Layer Hell Salamander | GAP | M (mode-change blade rearrangement) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 883 | Forge Disc 12 | PART | geom; I (lightest Cho-Z disc) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 884 | Performance Tip Operate | GAP | M, D (sliding off-center/centered ball) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 885 | Assembly Hell Salamander 12 Operate | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 886 | Armor Detachment phase transition | GAP | R (runtime diameter/height/profile change) | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` |
| 887 | Layer Killer Deathscyther | GAP | T, C (sloped blades upper attack) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 888 | Forge Disc 2 | PART | geom; I (uniform annular 21.21g) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 889 | Disc Frame Vortex | PART | geom; I (2.51g triangular frame) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 890 | Performance Tip Hunter | GAP | D (rubber annular contact ring) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 891 | Assembly Killer Deathscyther 2Vortex Hunter | GAP | I, C | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1158 | Layer Dead Hades | PART | geom; I (Cho-Z balance metal distribution) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1159 | Forge Disc 11 | PART | geom; I (lightest core disc 11.4g) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1160 | Disc Frame Turn | GAP | M (frame mode positions) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1161 | Performance Tip Zephyr' | GAP | D (hollow-centre flat friction) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1162 | Assembly Dead Hades 11Turn Zephyr' | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1163 | Layer Left Aeclipse | PART | geom; S (metal-lined edges, left-spin) | MECH OK | authorable / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1164 | SK Chip Hyperion 1 | PART | geom; I (5.5g chip, right-spin) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1165 | Ring Super | GAP | B (thick underside burst-tooth exposure) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 1166 | Chassis 1A | GAP | B (integrated disc + burst spring/teeth) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 1167 | Performance Tip Xceed' | GAP | D, B (rubber flat + thicker spring) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1168 | Assembly Super Hyperion Xceed 1A | GAP | I, D, C | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1169 | Gatinko Chip Bahamut | PART | geom; S (3.1g left-spin chip) | MECH OK | authorable / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1170 | Layer Weight Gen | GAP | B (rubber protrusion prevents final click) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 1171 | Layer Base Dread | GAP | R, B (deforms circular on damage to parry) | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1172 | Forge Disc 7 (GT) | PART | geom; I (23.2g high-OWD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1173 | Disc Frame Wall | PART | geom; T (CoM lowering, scrape penalty) | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` |
| 1174 | Performance Tip Orbit Metal | GAP | F, D (free metal ball, reduced traction) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1175 | Assembly Dread Bahamut 7Wall Orbit Metal | GAP | C, S, I (spin-equalization) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:65`<-`assembler.ts:175` |

### CS9 block C  -  overflow blocks 1289-1339, 1376-1380, 1500-1524, 1546-1573, 1604-1609, 1634-1642, 1682-1690, 1733-1746, 1780-1803, 1845-1894

| Case | ShortTitle | Status | Gap | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|
| 1289 | Layer Archer Hercules | GAP | M (centrifugal bow extension OWD) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1290 | Performance Tip Eternal | GAP | F, T (POM free dish, precession survivability) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1291 | Assembly Archer Hercules 13 Eternal | GAP | D, T | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1292 | Layer Alter Chronos | GAP | M (mode-change gear layer) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1293 | Forge Disc 6 | PART | geom; I (central holes remove inboard mass) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1294 | Disc Frame Meteor | PART | geom; I (2.7g rough perimeter) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1295 | Performance Tip Trans | GAP | M, D (dual-mode cone switch) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1296 | Assembly Alter Chronos 6Meteor Trans | GAP | M, I | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 1297 | Bit Chip Unicolyon | OK | geom (cosmetic retention piece) | MECH OK | authorable |
| 1298 | Attack Ring Tail Defense | GAP | C (near-circular swept deflection) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1299 | Weight Disk Eight Heavy | PART | geom; I (14.5g compact centre-weighted) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1300 | Spin Gear Right SG | PART | geom; no launcher torque input | MECH OK | authorable |
| 1301 | Blade Base Unicolyon | GAP | D (tip geometry -> orbit/stamina) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / authorable |
| 1302 | Assembly Unicolyon | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1303 | Bit Chip Amphilyon | OK | geom (cosmetic chip) | MECH OK | authorable |
| 1304 | Attack Ring Twin Head | GAP | C (two 180deg horn protrusions) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1305 | Weight Disk Wide | PART | geom; I (13.0g OWD stamina) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1306 | Spin Gear Right SG (dup) | PART | geom; no torque input model | MECH OK | authorable |
| 1307 | Blade Base Amphilyon | GAP | F (free-spinning tip balance base) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1308 | Assembly Amphilyon | GAP | I, D, C | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1309 | Layer Bigbang Genesis | PART | geom (monolithic 26.6g) | MECH OK | authorable |
| 1310 | Bigbang Armor | PART | geom; R (4.2g add-on perimeter) | MECH OK | authorable / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1311 | Tip Hybrid disc-integrated | GAP | D, M (motorized disc+driver) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1312 | Assembly Bigbang Genesis Hybrid | GAP | I, D, M | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1313 | Face Bolt Kronos | OK | geom (cosmetic retention bolt) | MECH OK | authorable |
| 1314 | Energy Ring Kronos | PART | geom; I (two scythe protrusions) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1315 | Fusion Wheel Scythe (4D) | GAP | C (round flat minimising recoil) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1316 | Spin Track T125 | PART | geom; no aerodynamics | MECH OK | authorable |
| 1317 | Performance Tip EDS | GAP | F, T (tall free sharp spike, wobble delay) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1318 | Assembly Scythe Kronos T125EDS | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1319 | Layer Orb Egis | GAP | T (metal destabilizer -> opponent tilt) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 1320 | Forge Disc Outer | PART | geom; I (spoked extreme-OWD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1321 | Performance Tip Quest | GAP | B (suction cup boosting KO resistance) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 1322 | Assembly Orb Egis Outer Quest | GAP | T, I | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1323 | Layer Kreis Satan | GAP | C, M (three rollers parrying) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1324 | Forge Disc 2 (God) | PART | geom; I (elliptical 21.21g) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1325 | Disc Frame Glaive | GAP | T (round perimeter LAD contact) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 1326 | Performance Tip Loop | GAP | B, D (roller tab braking, KO resist) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1327 | Assembly Kreis Satan 2Glaive Loop | GAP | C, B, T | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1328 | SK Chip Lucifer 1 | PART | geom; I (5.7g metal chip) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1329 | Ring Variant | PART | geom; C (textured ridged perimeter) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1330 | Chassis 2D barrier blades | GAP | M, S (barrier blade gimmick, dual-spin) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1331 | Performance Tip Mobius | GAP | F (free-spin conical, bearing friction) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1332 | Assembly Variant Lucifer Mobius 2D | GAP | C, S, I | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:65`<-`assembler.ts:175` |
| 1333 | Gatinko Chip Joker | GAP | B (Hard Lock deep ratchet engagement) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 1334 | Layer Weight Zan | PART | geom; I (mid-radius mass element) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1335 | Layer Base Judgement | GAP | C, B (attack blade + burst teeth) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1336 | Forge Disc 00 | PART | geom; I (universal heavy + frame groove) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1337 | Disc Frame Turn (GT) | GAP | M, C (mode arms parrying disc-to-layer) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1338 | Performance Tip Trick | GAP | M, D (mode-change tip) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1339 | Assembly Judgement Joker 00Turn Trick Zan | GAP | I, B, C | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `burst.ts:109`<-`BeySystem.ts:436` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1376 | Layer Arc Bahamut | GAP | M, B (centrifugal sub-layer gap-fill) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1377 | Forge Disc 2 (dup) | PART | geom; I (21.21g symmetric) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1378 | Disc Frame Bump | GAP | C (rough perimeter grazing impulse) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1379 | Performance Tip Atomic (dup) | GAP | F, T (free ball + four-tab LAD) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1380 | Assembly Arc Bahamut 2Bump Atomic | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1500 | Face Bolt Aquario | OK | geom (cosmetic engraved bolt) | MECH OK | authorable |
| 1501 | Metal Wheel Aquario | GAP | C, I (trailing fin orientation, recoil) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:65`<-`assembler.ts:175` |
| 1502 | Spin Track 105 | PART | geom; I (mid-low height) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1503 | Performance Tip Flat (F) | GAP | D (high-friction wide flat) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1504 | Assembly Aquario 105F | GAP | I, D, C | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1505 | Shogun Face Bolt Byakko | GAP | I (deliberate asymmetric mass offset) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1506 | Warrior Wheel Byakko | GAP | T, I (C3 transverse MoI, principal-axis tilt) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1507 | Element Wheel Berserker | PART | geom; I (legacy inner wheel) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1508 | Spin Track 125 | PART | geom; T (mid height stability) | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` |
| 1509 | Performance Tip Spike (S) | GAP | T, D (sharp small-contact, tipping moment) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1510 | Assembly Berserker Byakko 125S | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1511 | Layer Shelter Regulus | GAP | M (centrifugal extend/retract claws) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1512 | Forge Disc 5 | PART | geom; I (odd-numbered core disc) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1513 | Disc Frame Star | PART | geom; T (thick 2.4g frame, LAD tradeoff) | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` |
| 1514 | Performance Tip Tower | GAP | M, C (height-change at spin threshold) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1515 | Assembly Shelter Regulus 5Star Tower | GAP | M, B, D | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1516 | SK Chip Hyperion 2 | PART | geom; I (Metal Chip Core insert) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1517 | Ring Burn (Limit Break) | GAP | M, B (latch-released blades at threshold) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1518 | Forge Disc Cho | GAP | M (disc-ring latch enabling Limit Break) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1519 | Performance Tip Xceed'+X | GAP | F, D (rubber flat + independent outer plate) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1520 | Assembly Hyperion Burn Cho Xceed'+X | GAP | M, D, C | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1521 | Energy Layer Greatest Raphael | GAP | M, B (Overdrive mode + metal burst lock) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1522 | Forge Disc Over | PART | geom; I (heavy disc OWD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1523 | Performance Tip High Xtend+' | GAP | M, D (three-mode tip + dash spring) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1524 | Assembly Greatest Raphael Over High Xtend+' | GAP | M, I, B | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1546 | Energy Ring Dragonis | GAP | I (2-fold imbalance, CoM offset vibration) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1547 | Fusion Wheel Core Omega | PART | geom; I, C (hollow-corrected MoI) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1548 | Fusion Wheel Frame Omega | PART | geom; M (two-position tab lock) | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1549 | Fusion Wheel Omega Assault Mode | GAP | C (6 contact events/rev) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1550 | Fusion Wheel Omega Barrage Mode | GAP | C, T (3 wing contacts, poor LAD) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1551 | Spin Track 85 | GAP | T (low contact height, tilt torque, scrape) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 1552 | Performance Tip XF | GAP | D, T (flat friction torque, precession) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1553 | Assembly Omega Dragonis 85XF Assault | GAP | I, D, C | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1554 | Assembly Omega Dragonis 85XF Barrage | GAP | C, D, M | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1555 | Energy Ring Aries | PART | geom; I (3-fold ring, contact angle) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1556 | Light Wheel Clay | PART | geom; no stress/failure model | MECH OK | authorable |
| 1557 | Spin Track ED145 | GAP | F (three free-spinning wings, slip absorb) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1558 | Performance Tip Ball (B) | GAP | T (hemisphere centre-seeking restoring moment) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 1559 | Assembly Clay Aries ED145B | GAP | I, D, T | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1560 | Energy Layer Holy Horusood | GAP | B, C (square-in-circle recoil, 4 burst teeth) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1561 | Forge Disc Upper | PART | geom; no aero/upper-force model | MECH OK | authorable |
| 1562 | Performance Tip Claw | GAP | M (centrifugal claw extension brake) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1563 | Assembly Holy Horusood Upper Claw | GAP | B, D | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1564 | Energy Layer Vise Leopard | GAP | C, M (metal inclusions, spring "bite") | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1565 | Forge Disc 12 | PART | geom; I (light core, serrated perimeter) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1566 | Disc Frame Lift | GAP | M (flip-able two-mode frame) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1567 | Performance Tip Destroy | GAP | F, D (star tip + free plate) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1568 | Assembly Vise Leopard 12Lift Destroy | GAP | I, D, B | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1569 | Energy Layer Tornado Wyvern | GAP | F, B (free lower ring absorbs burst torque) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1570 | Forge Disc 4 | PART | geom; I (high-OWD stamina) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1571 | Disc Frame Glaive | PART | geom; T (round frame LAD) | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` |
| 1572 | Performance Tip Atomic | GAP | F (free ball + free ring dual decoupling) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1573 | Assembly Tornado Wyvern 4Glaive Atomic | GAP | D, B | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1604 | Energy Ring Aquario | PART | geom; I (heavy 4-fold ring) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1605 | Light Wheel Wind | PART | geom; I, C (Storm-profile, 3 wings) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1606 | Spin Track 100 | PART | geom; C (low height for wheel contact) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1607 | Performance Tip HF/S | GAP | M, D (pull-rotate dual-mode tip) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1608 | Assembly Wind Aquario 100HF | GAP | D, C | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1609 | Assembly Wind Aquario 100S | GAP | M, D | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1634 | Energy Ring Gil | GAP | I (asymmetric skeleton, mass imbalance) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1635 | Fusion Wheel Ray | PART | geom; C (three-wing smash, indent grooves) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1636 | Performance Tip RSF | GAP | D (rubber semi-flat grip, high friction) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1637 | Assembly Ray Gil 100RSF | GAP | D, C | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1638 | Energy Ring Leone I | PART | geom; I (six-segment, ridge friction) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1639 | Fusion Wheel Rock | PART | geom; C (six-protrusion defense, lower shield) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1640 | Spin Track 145 | GAP | T (tall track, wobble tolerance, CoM raise) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 1641 | Performance Tip WB (Wide Ball) | GAP | T, D (wide hemisphere restoring moment) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1642 | Assembly Rock Leone 145WB | GAP | I, D, B | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1682 | Energy Layer Air Knight | GAP | B, C (wide 5-blade, metal lining, teeth) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1683 | Disc Frame Expand | PART | geom; no aero/LAD | MECH OK | authorable |
| 1684 | Performance Tip Eternal | GAP | F, T (sharp + free POM dish on precession) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1685 | Assembly Air Knight 12Expand Eternal | GAP | D, T | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1686 | Energy Layer Maximum Garuda | GAP | B (round 5-blade, single shallow tooth) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 1687 | Forge Disc 8 | PART | geom; I (heavy core, gapped loops) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1688 | Disc Frame Flow | PART | geom; T (triangular, nine blades, poor LAD) | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` |
| 1689 | Performance Tip Flugel | GAP | D (cone low friction + winglets) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1690 | Assembly Maximum Garuda 8Flow Flugel | GAP | D, B | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1733 | Energy Layer Acid Anubis | GAP | C, B (smooth round defense perimeter) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1734 | Forge Disc Yell | PART | geom; I (star hub + wide smooth rim) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1735 | Performance Tip Orbit | GAP | F (free ball on bearing + brake tabs) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1736 | Assembly Acid Anubis Yell Orbit | GAP | D, F | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1737 | Warrior Wheel Salamander | PART | geom; I, C (chrome wheel dominant MoI) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1738 | Element Wheel Ninja | PART | geom; I (crystal inner ring, faceted) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1739 | Spin Track SW145 | GAP | M (60deg wing mode change) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1740 | Performance Tip SD | GAP | D (mid-friction rounded point) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1741 | Assembly Ninja Salamander SW145SD | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1742 | Face Bolt Bahamoote Metal Stone | GAP | T, I (29.4g central face raising CoM) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1743 | Warrior Wheel Bahamoote | PART | geom; I (widest hollow chrome wheel) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1744 | Element Wheel Gladiator + Track SP230 | GAP | C (blade contact geometry, 23mm height) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / authorable |
| 1745 | Performance Tip GF (Giga Flat) | GAP | D (widest flat tip friction) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1746 | Assembly Gladiator Bahamoote SP230GF | GAP | T, D, B | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1780 | DB Core Bahamut | GAP | B, S (left-spin, Rubber Lock resistance) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1781 | Blade Roar | GAP | M (ellipse-to-circle gimmick, left-spin) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1782 | Armor 10 | PART | geom; I (armor mass under layer) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1783 | Forge Disc Giga | GAP | I (heaviest disc, OWD, aero drag torque) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1784 | Performance Tip Moment | GAP | D, T (hemispherical dish, tilt stability) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1785 | Assembly Roar Bahamut Giga Moment-10 | GAP | D, B | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1786 | Superking Chip Satan | PART | geom; B (burst/friction contribution) | MECH OK | authorable / `burst.ts:109`<-`BeySystem.ts:436` |
| 1787 | Ring Curse | GAP | F (free-spinning rollers, aero drag torque) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1788 | Chassis 1D | GAP | B, S (dual-spin chassis, burst resistance) | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1789 | Forge Disc Hurricane | GAP | F, B (free saw disc, scraping, self-KO) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1790 | Performance Tip Universe | GAP | F, D, B (dual free ball, self-KO) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1791 | Assembly Curse Satan Hurricane Universe 1D | GAP | D, B, T | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `burst.ts:109`<-`BeySystem.ts:436` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1792 | Face Bolt Cancer | OK | geom (cosmetic bolt) | MECH OK | authorable |
| 1793 | Energy Ring Cancer (Gasher) | PART | geom; C (sloped claw defense) | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1794 | Fusion Wheel Dark | GAP | I (poor OWD, aero drag torque) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1795 | Spin Track CH120 | GAP | M, R (change-height 120/145 gimmick) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1796 | Performance Tip Semi-Flat (SF) | GAP | D, T (two-regime friction, destabiliser) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1797 | Assembly Dark Cancer CH120SF | GAP | I, D, M | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1798 | Face Bolt Tempo | OK | geom (cosmetic bolt) | MECH OK | authorable |
| 1799 | Energy Ring Tempo | GAP | I (ring MoI, mass asymmetry) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1800 | Fusion Wheel Twisted (Basalt) | GAP | I (OWD, centrifugal imbalance SSD) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1801 | Spin Track 145 (MM era) | GAP | T, I (CoM raise) | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `spin.ts:65`<-`assembler.ts:175` |
| 1802 | Performance Tip WD (Wide Defense) | GAP | D (wide disc + sharp tip friction) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1803 | Assembly Twisted Tempo 145WD | GAP | D, I | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:65`<-`assembler.ts:175` |
| 1845 | BP Small Type (Dranzer Phoenix) | OK | geom (locking cap) | MECH OK | authorable |
| 1846 | AR Spiral Upper | GAP | C (upper-attack ramp, OWD, recoil) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1847 | WD Circle Balance | PART | geom; I (weight disk OWD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1848 | RC Manual Change Core | GAP | M, D (hole-flat friction, flower, mode) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1849 | Assembly Dranzer MS | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1850 | BP Small Type (Driger Tiger) | OK | geom (cap only) | MECH OK | authorable |
| 1851 | AR Metal Upper | GAP | C (metal upper attack profile, OWD) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1852 | RC Semi-Flat Core | GAP | D (semi-flat friction, launch-dependent) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1853 | Assembly Driger MS | GAP | D, I | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:65`<-`assembler.ts:175` |
| 1854 | BP Large Type (Phantom Fox) | OK | geom (cap mass) | MECH OK | authorable |
| 1855 | AR Upper Fox | GAP | C (upper attack contact exposure, OWD) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1856 | WD CWD Circle Attacker | GAP | M, I (two-piece disk, two modes) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:65`<-`assembler.ts:175` |
| 1857 | Bunshin Core (RC) | GAP | R, M (spring-release part separation) | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1858 | Assembly Phantom Fox MS | GAP | R, D | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1859 | BP Large Type (Dragoon MF) | OK | geom (cap mass) | MECH OK | authorable |
| 1860 | AR Upper Dragon | GAP | C, S (contact exposure, right-spin pref) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1861 | CWD Chain Attacker | GAP | S, C (spin-stealing mechanics) | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1862 | CWD Eternal Survivor | GAP | C, T (protective diameter, destabilising) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1863 | RC Metal Weight Grip Core | GAP | D (tip contact friction, speed deficit) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1864 | Assembly Dragoon MF | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1865 | BP Large Type (Round Shell MS) | OK | geom (cap mass) | MECH OK | authorable |
| 1866 | AR Turtle Crusher | GAP | C (gap-driven recoil, tip incompatibility) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1867 | Rubber Weight Core (RWC) | GAP | D, T (rubber ring contact, CoM height) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1868 | Assembly Round Shell MS | GAP | D, I | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:65`<-`assembler.ts:175` |
| 1869 | BP Large Type (Samurai Changer MS) | OK | geom (cap mass) | MECH OK | authorable |
| 1870 | AR Samurai Upper | GAP | C, S (spin-direction asymmetry) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1871 | WD Circle Heavy | PART | geom; I (compact dense disk, OWD) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1872 | RC Battle Change Core | GAP | M (semi-flat/hole-flat mode change) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1873 | Assembly Samurai Changer MS | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1874 | BP Large Type (Magical Ape MS) | OK | geom (cap mass) | MECH OK | authorable |
| 1875 | AR Metal Ape | GAP | C (wall-defense geometry, stamina) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / authorable |
| 1876 | WD Circle Heavy (cross-ref) | PART | geom; I (duplicate of 1871) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 1877 | RC Flat Core (Magical Ape) | GAP | D, M (flat friction + Gyro Mode) | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1878 | Assembly Magical Ape MS | GAP | I, D, C | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1879 | BP Large Type (Slash Riger MS) | OK | geom (cap mass) | MECH OK | authorable |
| 1880 | AR Slash Upper | GAP | C (mass deficit, upper ramp) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1881 | CWD Free Crusher | GAP | F (free-moving disk, three failure modes) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1882 | RC Free Wing Core | GAP | F (free wings, vertical-translation failure) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1883 | Assembly Slash Riger MS | GAP | D, C | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1884 | BP Large Type (Dranzer MF) | OK | geom (cap mass) | MECH OK | authorable |
| 1885 | AR Smash Phoenix | GAP | I (2-fold asymmetry, dynamic imbalance) | MECH OK | `spin.ts:65`<-`assembler.ts:175` |
| 1886 | CWD Wing Attacker | GAP | I, C (wings compounding recoil/imbalance) | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1887 | CWD Reverse Defenser | GAP | C (circular perimeter collision advantage) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1888 | RC Free Shaft Core | GAP | F, T (decoupled shaft, early precession) | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1889 | Assembly Dranzer MF | GAP | I, D | MECH OK | `spin.ts:65`<-`assembler.ts:175` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1890 | BP Large Type (Bloody Devil MS) | OK | geom (cap mass) | MECH OK | authorable |
| 1891 | AR Devil Crusher | GAP | C, I (heavy metal AR attack, OWD) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:65`<-`assembler.ts:175` |
| 1892 | CWD Devil Saucer | PART | geom; I, C (saucer disk, contact perimeter) | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1893 | RC Shooter Change Core Alpha | GAP | M (launch-selectable tip mode) | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1894 | Assembly Bloody Devil MS | GAP | D, I, B | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `spin.ts:65`<-`assembler.ts:175` / `burst.ts:109`<-`BeySystem.ts:436` |

**Also found in CS9's tail: ~130 headings numbered literally `CASE XXXX`** (unnumbered placeholders) covering Shining God MS, Death Gargoyle MS, Draciel MS, Gaia Dragoon MS, Dragoon MS/MSUV, Wolborg MS, Jiraiya MS, Advance Eterner/Striker/Guardian, Advancer Averazer, Mad Cancer, Beat Lynx, Union Achilles, Zwei Longinus, Legend/Cho-Z Spriggan, Slash Valkyrie, Wizard Fafnir, Wolfos, Frankes, Bandaos, Dracuos. All follow the same pattern (OK for cosmetic caps; PART for discs/rings with `geom`+`I`; GAP for every tip, gimmick and assembly). **These cannot be reconciled with the 416-1894 numbering and must be numbered before the Phase 13 extractor can address them.**

**CS9 contradictions (10+ found).** Armor 6, Armor 10, Forge Disc Karma, Forge Disc Illegal and Forge Disc 12 each have **two different sets of radii** across the cases that document them (e.g. Karma r_i=8/r_o=27 in Case 479 vs r_i=14/r_o=33 in Case 508, which claims the parameters are "fully established"). Forge Disc 2 is modelled three times with inertias of 6.416e-6, 1.734e-5 and a third value -- a 2.7x spread for one 21.21g part. Disc Frame Turn is 5.768e-6 vs 2.520e-6. Performance Tip Atomic is 7.4g [CONFIRMED] in one case and 8.8g in another. The Hybrid driver is 38.6g in Case 574 and ~20-22g in Case 1311. Case 447 calls Forge Disc 00 (25.2g) "the heaviest in the lineup" in a clause that simultaneously cites Xanthus at 32.5g. Rubber mu is 0.85 throughout Cases 1002/1005/1008/420/429 against the file's own authoritative 0.50. Launch w is 694 rad/s in most cases and 700 in others. **Five parts are analysed twice under different case numbers** (Forge Disc 7 at 614 and 1172; Forge Disc 2 at 888/1324/1377; Spin Gear Right SG at 1300 and 1306; Disc Frame Turn at 1160 and 1337; Tip Atomic at 615 and 1379), and case number **1873 is used twice** in the same file.

## LEDGER PART 13  -  CS13 franchise special moves, gimmicks, combos (Cases 619-1785 + overflow)

~580 unique cases, tagged `[GIMMICK]` (119) / `[SPECIAL MOVE]` (59) / `[SPECIAL]` (81) / `[COMBO]` (122) and overflow. **Every `[COMBO]` case is GAP under code X** (no input-sequence system exists), and **every `contact`-category move is GAP under code C** (no bey-vs-bey collision). The triad structure (gimmick -> special -> combo) is intact and is the one part of this file that survives as-is (Sec.K1).

### CS13 block A  -  Cases 619-866

| Case | Tag + Title | Status | Codes | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|
| 619 | GIM ED145/ES free-spin ring parry | GAP | C, F | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 620 | SPM 100 Hit Fearsome Splendor | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 621 | GIM Nothing/Absorb spring mode-change tip | GAP | M, C | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 622 | GIM Fafnir counter-spin passive absorption | GAP | C, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 623 | SPM Nothing Break absorb window | GAP | C, E | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 624 | SPM Absorb Break spring burst | GAP | C, M | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 625 | CMB Parry Stance | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 626 | CMB Spring Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 627 | GIM Rubber flat streak dash | PART | geom; D | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 628 | SPM Abyss Fire mirage dash | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 629 | CMB Streak Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 630 | DESIGN forceState behaviour compulsion | GAP | no forceState field; no AI override | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 631 | SPM Adamantine Hands aura counter | GAP | Z, E | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 632 | GIM D125 downforce + CS pierce point | PART | geom; C | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 633 | SPM Lightning Sword Flash pierce | GAP | C, E | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 634 | CMB Sword Point | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 635 | GIM Expand frame radial air outflow | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 636 | SPM Air Launch radial blast | GAP | Z, B | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `burst.ts:109`<-`BeySystem.ts:436` |
| 637 | CMB Air Wall | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 638 | GIM Needle tip impact anchor | PART | geom; C | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 639 | SPM Alicorn Launch aerial lift | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 640 | CMB Horn Brace | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 641 | GIM GB145 ball channel + BS mode | PART | geom; R, I | MECH OK | authorable / `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:65`<-`assembler.ts:175` |
| 642 | SPM Allegro Entrechat evade hop | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 643 | CMB Quick Step | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 644 | GIM Domed AR deflection + ball stance | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 645 | SPM Aqua Shield water wall | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 646 | CMB Tidal Brace | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 647 | GIM Eternal tip wall-climb energy relay | PART | arena walls; no climb model | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 648 | SPM Archer Strike slope dive | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 649 | CMB Slope Launch | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 650 | GIM Variares PC frame retraction, D:D | PART | geom; M, R | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 651 | SPM Ares Shield rotating guard | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 652 | CMB Frame Brace | GAP | X, M | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 653 | GIM 4D heavy wheel gyro gravity field | PART | geom; Z (gravity_pull radial only) | MECH OK | authorable / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 654 | SPM Armageddon AoE shockwave | GAP | Z, B | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `burst.ts:109`<-`BeySystem.ts:436` |
| 655 | CMB Dark Stance | GAP | X, E | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 656 | GIM WB floor Rankine vortex | GAP | Z (tangential) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 657 | SPM Arrow Tornado deflection funnel | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 658 | CMB Vortex Feint | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 659 | GIM RDF spiral inward orbit | PART | geom; D | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 660 | SPM Ascent Spark rising strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 661 | CMB Coil Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 662 | GIM Over disc flywheel + Quattro flat | PART | geom; I, E | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 663 | SPM Astral Spark orbital burst | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 664 | SPM Astral Whip extended lash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 665 | CMB Spark Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 666 | GIM HF annular drift + 100H height | PART | geom; D | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 667 | SPM Avalanche Move upward shunt | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 668 | CMB Upper Shunt | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 669 | GIM Merge driver asymmetric grind | PART | geom; D, S | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 670 | SPM Axe Launch wall air-throw | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 671 | CMB Axe Feint | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 672 | GIM HF launch-phase spin surplus | GAP | no launch phase | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` |
| 673 | LAUNCH Backflip Boost launch buff | GAP | no launch phase; E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 674 | CMB Quick Surge | GAP | X, E | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 675 | GIM Baihu claw contact-point geometry | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 676 | SPM Baihu Claw triple-fang rip | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 677 | CMB Tiger Fang | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 678 | GIM Phantom Orion B:D mode change | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 679 | SPM Barnard's Loop nebula shockwave | GAP | Z, no QTE | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 680 | CMB Nebula Surge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 681 | GIM Galzzly axe aerial rebound | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 682 | SPM Bear Ax progressive slam chain | GAP | J, no QTE | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 683 | CMB Grizzly Slam | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 684 | GIM Scorpio seismic tremor zone | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 685 | SPM Acid Needle venom shockwave | GAP | Z, E | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 686 | CMB Venom Jab | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 690 | GIM SW145 wing deflection + SD cone | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 691 | SPM Blazing Ring Shot ring trap | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 692 | CMB Ring Orbit | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 693 | GIM Blazebringer limit-break blade rebound | GAP | C, M | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 694 | SPM Blazing Recoil reflection counter | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 695 | CMB Bound Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 696 | GIM Thermal Pisces toroidal air vortex | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 697 | SPM Distortion Drive disruption field | GAP | Z, E | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 698 | SPM Blazing Inferno drain vortex | GAP | Z, S | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 699 | CMB Distortion Cage | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 700 | GIM Wing Survivor + final clutch burst | GAP | C, M, D | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 701 | SPM Blazing Gigs upper dive | GAP | C, E | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 702 | CMB Phoenix Upper | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 703 | GIM Triple Tiger 3-fold tangential smash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 704 | SPM Gatling Claw rapid strikes | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 705 | SPM Gatling Claw Maximum | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 706 | SPM Gatling Fang ring-out push | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 707 | CMB Tiger Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 708 | GIM Triangle Wing reverse EG upper | GAP | C, M | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 709 | SPM Reverse Flame Gigs | GAP | C, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 710 | CMB Reverse Gear | GAP | X, S | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 711 | GIM Flat tip flower-pattern orbit | PART | geom; D | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 712 | SPM Blazer Slash orbital smash | GAP | C, E | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 713 | CMB Herculeo Flame Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 714 | GIM Evil Gemios twin-face + DF145 | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 715 | SPM Blaze Wall twin vortex barrier | GAP | Z, E | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 716 | CMB Twin Flame Brace | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 717 | GIM Cyber Dranzer aerial dive geometry | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 718 | SPM Blast Impress dive bomb | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 719 | CMB Dive Fang | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 720 | GIM Omni Odax smash blades + XD | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 721 | SPM Blast Beat multi-hit orbit | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 722 | CMB Odax Orbit | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 723 | GIM Perseus reverse-rotation + AD145 | PART | geom; S, E | MECH OK | authorable / `spinExchange.ts:99`<-`BeySystem.ts:449` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 724 | SPM Black Excalibur mode-flip smash | GAP | C, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 725 | CMB Black Slash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 726 | GIM Aquario 105F curved orbital drive | PART | geom; D | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 727 | SPM Big Wave orbital wave strike | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 728 | CMB Aqua Slide | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 729 | GIM Evil Befall UW145EWD feather blades | GAP | C, F | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 730 | SPM Befall The Ripper feather scatter | GAP | P, Z | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 731 | SPM Beautiful Dead slash barrage | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 732 | CMB Wing Slash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 733 | GIM Betromoth hold tip + heavy disc | PART | geom; I | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 734 | SPM Beast Hold brace state | GAP | forceState absent; E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 735 | CMB Center Guard | GAP | X, E | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 736 | GIM Jaggy tip micro-impact evasion | PART | geom; C | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 737 | SPM Beast Dodge evasion hop | GAP | J, no QTE | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 738 | CMB Jagged Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 739 | GIM Brave Valkyrie triple-layer contacts | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 740 | SPM Brave Sword charge strike | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 741 | CMB Valkyrie Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 742 | GIM Anubius 85XF flower-pattern drive | PART | geom; D | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 743 | SPM Brave Impact BeySpirit smash | GAP | C, E, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 744 | CMB Flower Smash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 745 | SPM Brave Flash wall-orbit slash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 746 | CMB Brave Edge-Circuit | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 747 | GIM Quetziko jerk ratchet deflection | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 748 | SPM Bound Launch rebound throw | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 749 | CMB Bound Deflect | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 750 | GIM Wolborg 2 bearing tip + 3-fold recoil | GAP | C, F | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 751 | SPM Blizzalog freeze field | GAP | Z, E | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 752 | CMB Frost Whip | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 753 | GIM Brutal Luinor jolt aerial tip | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 754 | SPM Brutal Squall aerial dive smash | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 755 | CMB Squall Dive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 756 | GIM Dark Bull H145 horn undercut | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 757 | SPM Bull Uppercut lift strike | GAP | C, J | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 758 | CMB Bull Undercut | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 759 | GIM Burn Fireblaze 135MS stamina stack | PART | geom; D | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 760 | SPM Burning Fire Strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 761 | CMB Ember Approach | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 762 | GIM Flame Serpent SW145F serpentine track | PART | geom; D | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 763 | SPM Burning Mirage afterimage strike | GAP | C, Z | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 764 | CMB Serpent Drift | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 765 | GIM Samurai Ifraid W145CF chrome contacts | PART | geom; I | MECH OK | authorable / `spin.ts:65`<-`assembler.ts:175` |
| 766 | SPM Burning Tornado Fire multi-beast alliance | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 767 | SPM Burning Uppercut vortex lift | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 768 | CMB Ifraid Wing Arc | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 769 | GIM Strata Dragoon V saucer AR + EG | GAP | C, M | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 770 | SPM Vast Cutter cutting strike | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 771 | SPM Vast Hurricane pull vortex | GAP | Z, B | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `burst.ts:109`<-`BeySystem.ts:436` |
| 772 | CMB Saucer Roll | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 773 | GIM Forbidden Eonis air-control wing track | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 774 | SPM Burst Satellite orbital satellites | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 775 | CMB Eternal Wing | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 776 | GIM Bushin Ashindra 12-blade shell | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 777 | SPM Bushin Guard deflection field | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 778 | CMB Whirlwind Parry | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 779 | GIM Spiral Fox LAD rolling approach | PART | geom; T | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` |
| 780 | SPM Buster Tail sweep strike | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 781 | CMB Rolling Slash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 782 | GIM Galux wide smash AR pounce | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 783 | SPM Cat Scratch multi-scratch | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 784 | CMB Pounce Slash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 785 | GIM Chain Kerbeus chain-retraction spin-up | PART | geom; D | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 786 | SPC Chain Break slope-climb gravity dive | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 787 | CMB Chain Strike | GAP | X, B | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `burst.ts:109`<-`BeySystem.ts:436` |
| 788 | GIM Burning Cerberus triple-head + CBB | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 789 | SPC Chain Flame proximity tether DoT | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 790 | SPC Chain Storm ring-out crash | GAP | C, B, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 791 | SPC Chain Thunder shock chain | GAP | E, C | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 792 | CMB Three-Head Slash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 793 | GIM Grand Capricorn horn smash platform | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 794 | SPC Claw of the Storm three sub-moves | GAP | J, no QTE | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 795 | CMB Horn Charge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 796 | GIM Devolos detachable satellite bullet | GAP | P, R | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 797 | SPC Clone Attack satellite deploy | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 798 | CMB Bullet Split | GAP | X, P | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 799 | SPC Chain Dispel drain barrier | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 800 | GIM Hazard Kerbeus 7 Atomic platform | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 801 | SPC Chain Counter wall rebound | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 802 | CMB Atomic Rebound | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 803 | SPC Dual Phantom cooperative dual strike | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 804 | SPC Clone Cannon satellite projectile | GAP | P, R | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 805 | SPC Clone Impact three-body transfer | GAP | P, C | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 806 | GIM Strata Dragoon S SGS AR + sub-ring | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 807 | SPC Co-Ring Cutter ring slash | GAP | C, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 808 | CMB Ring Slash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 809 | GIM Cosmic Pegasus F:D two-mode tip | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 810 | SPC Super Cosmic Nova area blast | GAP | Z, no QTE | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 811 | CMB Final Drive Surge | GAP | X, M | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 812 | GIM Storm Spriggan dual-spin + S driver | PART | geom; S | MECH OK | authorable / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 813 | SPC Counter Break redirect counter | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 814 | CMB Quick Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 815 | LAUNCH Crux Boost vertical-snap launch | GAP | no launch phase | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 816 | GIM Rock Zurafa ball tip + rubber track | PART | geom; E | MECH OK | authorable / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 817 | SPC Crushing Blast crush strike | GAP | C, E | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 818 | CMB Rock Slam | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 819 | GIM Rock Crow 125FS flat-spike dual mode | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 820 | SPC Crow Crusher joint dual-blader dive | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 821 | CMB Crow Dive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 822 | GIM Flash Leopard 2 cross-blade AR | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 823 | SPC Cross Fire cross slash | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 824 | CMB Blaze Cross | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 825 | GIM Hell Crown 130FB crown underside | PART | geom; C | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 826 | SPC Crimson Flash flash strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 827 | CMB Scarlet Charge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 828 | GIM Dead Phoenix armor detachment projectile | GAP | P, R | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 829 | SPC Dead Stinger armor launch | GAP | P, B | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `burst.ts:109`<-`BeySystem.ts:436` |
| 830 | CMB Phoenix Kick | GAP | X, P | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 831 | GIM Twin Noctemis colossus mode + Jaggy | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 832 | SPC Colossus Hammer aerial slam | GAP | J, E | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 833 | CMB Colossus Press | GAP | X, E | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 834 | GIM Earth Eagle deflection + spin theft | GAP | C, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 835 | SPC Counter Smash reflect stance | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 836 | CMB Eagle Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 837 | GIM Galman 4-fold AR phantom resonance | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 838 | SPC Crazy Monkey Attack erratic hits | GAP | C, E | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 839 | CMB Monkey Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 840 | GIM Heat Salamander Operate mode-change | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 841 | SPC Crimson Lotus Blaze tornado dual-buff | GAP | Z, E | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 842 | CMB Salamander Surge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 843 | GIM Poison Virgo ED145ES bearing isolation | PART | geom; C, F | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 844 | SPC Left Right Reverse Wheeling Forearm | PART | movement OK; E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 845 | CMB Eternal Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 846 | GIM Venture-2 rubber wall-orbit driver | PART | arena walls; B | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 847 | SPC Daring Flash ring-out knockback | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 848 | CMB Flash Charge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 849 | GIM Galeon flat-tip orbit, lightning aura | PART | geom; aura cosmetic | MECH OK | authorable |
| 850 | SPC Dark Lightning AoE | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 851 | CMB Lion Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 852 | GIM Dark Wolf DF145 downforce track | OK | geom (mass/friction authorable) | MECH OK | authorable |
| 853 | SPC Darkness Howling Blazer buff/debuff | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 854 | CMB Wolf Pounce | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 855 | GIM Archer Griffin claw track penalty pocket | PART | traps/zones; Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 856 | SPC Delta Slash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 857 | CMB Claw Dive | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 858 | GIM Gigars environmental weapon conjuration | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 859 | SPC Demolition Ax conjured rock weapon | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 860 | CMB Rock Smash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 861 | GIM Flame Byxis magnetic field geometry | GAP | Z, S | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 862 | SPC Destiny Needle magnetic opponent control | GAP | Z, A | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 863 | CMB Compass Lock | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 864 | GIM Belial upper-axis aerial dive physics | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 865 | SPC Dangerous/Divine Dive | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 866 | CMB Aerial Drive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |

### CS13 block B  -  overflow 1098-1193, 1216-1278, 1340-1375, 1381-1497, 1525-1545, 1574-1603, 1610-1633, 1643-1785

| Case | Tag + Title | Status | Codes | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|
| 1098 | GIM Flame Sagittario claw track bowl launch | PART | arena slope; C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1099 | SPC Diving Claw wall-ride dive | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1100 | CMB Flame Claw | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1101 | GIM Flash Sagittario beast-arrow ranged | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1102 | SPC Diving Arrow | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1103 | CMB Flash Arrow | GAP | X, P | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1104 | GIM Earth Eagle aerial stability dive gravity | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1105 | SPC Diving Crush | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1106 | CMB Feather Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1107 | GIM Dead Armor separation wall rebound | PART | arena bounce; R | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1108 | SPC Diving Dead Stinger Press | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1109 | CMB Dead Dive | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1110 | GIM Ashindra twelve-blade vortex aerodynamics | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1111 | SPC Double Bushin Guard vortex barrier | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1112 | CMB Twelvefold Brace | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1113 | GIM Perfect Gear spring-launch | GAP | J, M | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1114 | SPC Double Devastate Dive | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1115 | CMB Gravity Surge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1116 | GIM Mid-air elastic collision redirection | GAP | C, J | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1117 | SPC Double Dead Stinger | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1118 | CMB Armor Spike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1119 | GIM Prominence Shield dual free-fall | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1120 | SPC Double Prominence Dive | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1121 | CMB Prominence Crash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1122 | GIM Twin-bey orbital synchronisation | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1123 | SPC Double Tornado tag-team | GAP | L, no QTE | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1124 | CMB Glide Sweep | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1135 | GIM Evil Gemios DF145 dual-mode tip | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1136 | SPC Down Burst downdraft vortex | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1137 | CMB Gemios Arc | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1138 | GIM Dragon head click burst regulation | GAP | B | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 1139 | SPC Dragon Crash ring-out | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1140 | CMB Dragon Head Guard | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1141 | GIM Cyclone Roktavor double-wing vortex | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1142 | SPC Double Winged Cyclone shield | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1143 | SPC Double Winged Cyclone Grande capture | GAP | Z, no QTE | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1144 | CMB Cyclone Wing | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1145 | GIM L-Drago absorb wings, Survive mode switch | GAP | C, M, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1146 | SPC Dragon Emperor Life Destructor ring/beam | GAP | Z, P | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1147 | CMB Dragon Fang | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1148 | GIM Lightning L-Drago upper wedge contacts | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1149 | SPC Soaring Bite Strike opponent launch | GAP | C, J | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1150 | SPC Soaring Destruction aerial smash shockwave | GAP | Z, J | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1151 | CMB Dark Upper | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1152 | GIM Meteo L-Drago LW105 airfoil, LF drive | OK | geom (mass/friction authorable) | MECH OK | authorable |
| 1153 | SPC Dragon Emperor Supreme Flight | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1154 | CMB Meteo Spiral | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1155 | GIM Sliding scythe sequential strike | GAP | C, R | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1156 | SPC Double Strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1157 | CMB Scythe Edge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1176 | GIM Brutal Luinor uppercut, Jolt free-disc | GAP | C, F | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1177 | SPC Dragon Scream | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1178 | CMB Brutal Upper | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1179 | GIM Engine Gear lateral burst, tip-touch coupling | GAP | M, C | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1180 | SPC Dragoon Tank | GAP | C, L | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1181 | CMB Tank Dash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1182 | GIM Pegasus atmospheric charge arc coupling | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1183 | SPC Gemini Attack twin-blader | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1184 | CMB Pegasus Dive | GAP | X, C, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1185 | GIM Rubber counter-spin momentum absorption | GAP | C, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1186 | SPC Drain Spin steal | GAP | C, S, D | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1187 | CMB Fafnir Surge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1188 | GIM Driger S auto-mode evasion kinematics | PART | movement; A | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1189 | SPC Driger Shadow | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1190 | CMB Tiger Shadow | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1191 | GIM Rock Bison horn smash, heavy mass, EG | GAP | C, T, M | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:253`<-`BeySystem.ts:425` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1192 | SPC Drop Rock aerial slam shockwave | GAP | J, Z | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1193 | CMB Horn Charge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1216 | GIM Dusk Balkesh orbit metal, gyro-tilt | PART | geom; T | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` |
| 1217 | SPC Dusk Gyro roll charge | GAP | T, forceState | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 1218 | CMB Gyro Roll | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1219 | SPC Dusk Wing deflection parry | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1220 | CMB Wing Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1221 | SPC Dusk Circle shield mode | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1222 | CMB Circle Block | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1223 | GIM Xcalius sword-tip dual-force contact | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1224 | SPC Dual Sabers aligned sword strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1225 | CMB Saber Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1226 | GIM Dual Charge two-bey pincer momentum | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1227 | SPC Dual Charge synchronized pincer slam | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1228 | CMB Charge Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1229 | GIM Seven Hexagon layer, Turn frame channeling | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1230 | SPC Dread Impulse hexagon smash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1231 | CMB Hex Slam | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1232 | SPC Dread Gravity orbital gravity well | PART | Z (radial only) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1233 | CMB Gravity Spiral | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1234 | GIM Dragon blade sweep, wall-ricochet build | PART | arena ricochet; C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1235 | SPC Dragon Launch four-hit barrage | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1236 | CMB Dragon Dash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1237 | GIM Unicolyon earth shake oscillation | PART | translations; Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1238 | SPC Earth Shake arena oscillation | PART | translations; Z, E | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1239 | CMB Quake Jab | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1240 | GIM Emperor Forneus slope-rim banking | OK | geom (arena slope + mass) | MECH OK | authorable |
| 1241 | SPC Emperor Crash | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1242 | CMB Rim Ride | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1243 | GIM Yard driver outer-rim tilt drift | PART | geom; T | MECH OK | authorable / `spin.ts:253`<-`BeySystem.ts:425` |
| 1244 | SPC Emperor Drift | PART | movement; forceState | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1245 | CMB Drift Dash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1246 | GIM Lemniscate resonance barrier | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1247 | SPC Eclipse Pulse barrier shockwave | GAP | Z, B, no QTE | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1248 | CMB Pulse Guard | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1249 | GIM Eclipse Armor two-blade whip reach | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1250 | SPC Eclipse Whip | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1251 | CMB Whip Cross | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1252 | GIM Orb Engaard slope adhesion deflection | PART | geom; C | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1253 | SPC Egis Guard | PART | E, no QTE | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1254 | CMB Orb Bounce | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1255 | GIM Loop tip stadium-wall orbit | PART | arena walls; C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1256 | SPC Cyclone Loop | PART | movement; forceState, no QTE | MECH OK | `clones.ts:52`<-`BeySystem.ts:322` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1257 | CMB Loop Dash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1258 | GIM 12-blade contact frequency, burst resistance | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1259 | SPC Emperor Guard sustained barrier | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1260 | CMB Iron Ward | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1261 | GIM Gravity FW Counter Mode vortex field | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1262 | SPC Eyes of Medusa eight gravity pillars | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1263 | CMB Stone Gaze | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1264 | GIM Spring-loaded pop-out blade deployment | PART | geom; M, R | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1265 | SPC Extreme Recoil | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1266 | CMB Blade Snap | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1267 | GIM T125 debris-vortex generation | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1268 | SPC Exploding Fist debris pillar ring | GAP | Z, no QTE | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1269 | CMB Debris Scatter | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1270 | GIM Scythe FW asymmetric arm ring discharge | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1271 | SPC Great Ring of Destruction full-arena AoE | GAP | Z, B | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1272 | CMB Death Reap | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1273 | GIM Alter Cognite ultra stamina rim-riding | OK | geom (arena rim + mass/friction) | MECH OK | authorable |
| 1274 | SPC Eternity Launch position attrition | PART | movement; no QTE | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 1275 | CMB Slide Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1276 | GIM Hercules shield retraction spin-up | PART | geom; R, D | MECH OK | authorable / `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1277 | SPC Endless Spin boost | PART | D, E | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1278 | CMB Spin Shield | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1340 | GIM Vex Lucifer 2D rubber centrifugal perimeter | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1341 | SPC Vexing Wall knockback perimeter | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1342 | CMB Rubber Recoil | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1343 | GIM RF friction-heat vacuum engine | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1344 | SPC Full Power RF suction updraft | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1345 | CMB Friction Blitz | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1346 | GIM F:D spin-sacrifice drive | PART | geom; D | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1347 | SPC Full Power F:D spin trade | PART | D, E | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1348 | CMB Drive Surge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1349 | GIM Torch Pegasus toroidal fire-vortex ring | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1350 | SPC Fuerza Valiente vortex ring | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1351 | CMB Vortex Fang | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1352 | GIM Draciel centrifugal metal-ball barrier | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1353 | SPC Fortress Defense ball barrier | GAP | C, E | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1354 | CMB Shell Guard | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1355 | GIM Shot driver spring-jump uppercut | GAP | J, M | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1356 | SPC Flying Upper spring jump | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1357 | CMB Jump Strike | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1358 | GIM Wall-ride gravity dive | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1359 | SPC Flying Double Strike wall-arc dive | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1360 | CMB Scythe Dive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1361 | GIM RSF multi-strike spin absorption | GAP | C, D | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1362 | SPC Flash of Lightning multi-strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1363 | CMB Lightning Chain | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1364 | GIM Trick driver eccentric mode-switch | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1365 | SPC Fortune's Trick randomized mode | PART | M, E | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1366 | CMB Trick Feint | PART | X (direction change works) | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1367 | GIM Flash Launch low-angle rush spiral | PART | SpeedLine 'launch' wired | MECH OK | `launch.ts:122`<-`SpawnManager.ts:1202` |
| 1368 | SPC Flash Launch outward ring-out spiral | PART | B | MECH OK | `burst.ts:109`<-`BeySystem.ts:436` |
| 1369 | CMB Spiral Rush | GAP | X, C, B | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1370 | GIM Hades Crown FB flat-base dash | OK | geom (tip geometry/friction) | MECH OK | authorable |
| 1371 | SPC Flash Attack intercept | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1372 | CMB Crimson Dash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1373 | GIM Flamebringer Ring Limit Breaker | PART | resonance exists; [M] | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1374 | SPC Flaming Limit Breaker blade deploy | GAP | M, C | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1375 | CMB Limit Blaze | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1381 | GIM Judgement strong/weak asymmetric blades | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1382 | SPC Fate's Judgement strong/weak gamble | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1383 | CMB Judge's Gamble | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1384 | GIM ED145 free-ring Tai-Chi deflection | GAP | C, F | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1385 | SPC Fierce Lady Flash yield-deflect | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1386 | CMB Lady's Feint | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1387 | GIM Byakko claw-concentrated impact | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1388 | SPC Fierce Tiger Blast | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1389 | CMB Tiger Pounce | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1390 | GIM Aquario F-tip sinusoidal slither orbit | PART | movement; no path driver | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1391 | SPC Fighting Snake Flash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1392 | CMB Snake Slither | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1393 | GIM Apocalypse sword point concentrated strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1394 | SPC Omega Blast sword point | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1395 | CMB Sword Point | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1396 | GIM Apocalypse spring-lock sword enhancement | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1397 | SPC Final Blast spring-lock counter | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1398 | CMB Break Blaster | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1399 | GIM Xcalius sword lock-and-thrust | GAP | C, A | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1400 | SPC Saber Strike lock-and-thrust | GAP | C, A | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1401 | CMB Sword Slash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1402 | GIM Dranzer aerial spiral descent stomp | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1403 | SPC Flame Saber ascent-descent stomp | GAP | J, Z | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1404 | CMB Fire Dive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1405 | GIM Dranzer GT dual-stage EG concentric orbit | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1406 | SPC Flame Gigs Turbo dual orbit | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1407 | CMB Twin Flame | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1408 | GIM C145 fin fire tornado tangential strike | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1409 | SPC Flame Claw tangential tornado | GAP | Z, C | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1410 | CMB Claw Spiral | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1411 | GIM Dark Gargoyle wing-vortex tornado ring-out | GAP | Z, B | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1412 | SPC Fire Execution tornado ring-out | GAP | Z, B | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1413 | CMB Gargoyle Spin | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1414 | GIM Dranzer S fire-coated direct charge | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1415 | SPC Fire Arrow fire-coated smash | GAP | C, P | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1416 | CMB Arrow Flash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1417 | GIM Endbringer two-layer free-spin barrier | PART | geom; F | MECH OK | authorable / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1418 | SPC Final Wall free-ring barrier | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1419 | CMB Barrier Crush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1420 | GIM Endbringer explosive dual-layer separation | PART | geom; R | MECH OK | authorable / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1421 | SPC Final Limit Breaker double free-spin | PART | [M], E | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1422 | CMB Limit Edge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1423 | GIM Flame Libra T125 acoustic draw-in | PART | Z (radial pull matches) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1424 | SPC Inferno Blast acoustic draw-in | PART | Z, no QTE | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1425 | CMB Sonic Draw | PART | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1426 | GIM Stadium resonance coherent acoustic beam | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1427 | SPC Final Inferno Blast coherent beam | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1428 | CMB Inferno Pulse | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1429 | GIM 2Bump disc three-position ratchet detent | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1430 | SPC Final Guard brace | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1431 | CMB Shield Slam | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1432 | GIM Dread Phoenix wall-ricochet skyrocket | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1433 | SPC Final Dread Impact ricochet dive | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1434 | CMB Phoenix Dive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1435 | GIM Arc Balkesh shield-active slope momentum | PART | arena slope; M | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1436 | SPC Final Crash slope ring-out | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1437 | CMB Slope Charge | PART | X (slope + movement work) | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1438 | GIM Shelter Regulus fang protrusion contact | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1439 | SPC Fang Attack | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1440 | CMB Fang Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1441 | GIM Galaxy Pegasus W105R2F wing-tip smash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1442 | SPC Galaxy Nova orbital charge | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1443 | CMB Nova Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1444 | GIM Dragoon G LEG vortex air column | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1445 | SPC Galaxy Storm vortex draw-in smash | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1446 | CMB Whirlwind Slash | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1447 | GIM Dragoon GT dual-vortex interference nodes | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1448 | SPC Galaxy Turbo Twister multi-node vortex | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1449 | CMB Turbo Spiral | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1450 | GIM Gatling Dragon SHM/CHM mode switch | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1451 | SPC Gambit Break | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1452 | CMB Dragon Blade Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1453 | GIM Driger G stroboscopic clone effect | PART | particles; no clone entity | MECH OK | `clones.ts:52`<-`BeySystem.ts:322` |
| 1454 | SPC Gatling Claw | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1455 | CMB Tiger Flash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1456 | GIM Driger G lightning over-rev | PART | D, E | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1457 | SPC Gatling Claw Maximum | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1458 | CMB Claw Maximum Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1459 | GIM Driger G multi-pass translational rush | GAP | C, A | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1460 | SPC Gatling Fang | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1461 | CMB Fang Barrage | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1462 | GIM SP230 track height precession amplification | OK | geom (part geometry/mass) | MECH OK | authorable |
| 1463 | SPC Gladiator Demolition | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1464 | CMB Arena Crack | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1465 | GIM Synchrome dual-chrome mass stacking | OK | geom (part mass/geometry) | MECH OK | authorable |
| 1466 | SPC Final Ultimate Demolition | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1467 | CMB Sync Shatter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1468 | GIM Genesis dual-blade concentrated impact | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1469 | SPC Genesis Whip | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1470 | CMB Whip Cross | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1471 | GIM Reboot spring-retract tip-speed burst | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1472 | SPC Genesis Reboot | PART | forceState, J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1473 | CMB Reboot Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1474 | GIM Tip-lock dual-bey momentum coupling | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1475 | SPC Gemini Crash | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1476 | CMB Twin Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1477 | GIM Proof Frame grind tilt-recovery drift boost | PART | E, T | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1478 | SPC Geist Counter | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1479 | CMB Counter Drift | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1480 | GIM Geist blade retraction circular vortex | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1481 | SPC Geist Spin | PART | E, S | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1482 | CMB Vortex Drain | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1483 | GIM Guilty blade uppercut contact geometry | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1484 | SPC Guilty Upper | GAP | C, J | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1485 | CMB Upper Slash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1486 | GIM Karma disc launch impulse aerial dive | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1487 | SPC Guilty Smash | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1488 | CMB Smash Dive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1489 | GIM Stationary anchor mass-wall rebound | GAP | C, T | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1490 | SPC Great Rock | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1491 | CMB Stone Wall | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1492 | GIM Draciel G WD rim mass bowl resonance | OK | geom (mass distribution + walls) | MECH OK | authorable |
| 1493 | SPC Gravity Control | PART | Z (radial only) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1494 | CMB Tidal Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1495 | GIM Gravity Wheel pressure-pulse projectiles | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1496 | SPC Gravity Brave | GAP | P, S | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1497 | CMB Gravity Volley | GAP | X, P | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1525 | GIM Grand Cetus RS anchor T125 air pump | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1526 | SPC Grand Maelstrom | PART | Z (radial only) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1527 | CMB Tidal Surge | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1528 | GIM Whirlpool-exit vertical impulse conversion | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1529 | SPC Grand Victoire | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1530 | CMB Cetus Rise | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1531 | GIM WD145 wing platform protective barrier | OK | geom (part geometry) | MECH OK | authorable |
| 1532 | SPC Grand Fleet | GAP | J, L (depends on partner field) | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1533 | CMB Fleet Wave | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1534 | GIM Dual-Cetus cooperative momentum superposition | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1535 | SPC Grand Deucalion | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1536 | CMB Grand Wave | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1537 | GIM Greatest Armor clasp mode halo | PART | M, E | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1538 | SPC Glory Crown | PART | E, D | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1539 | CMB Crown Guard | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1540 | GIM Greatest Armor extension reach catch | GAP | C, R | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1541 | SPC Glory Slam | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1542 | CMB Slam Down | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1543 | GIM Virgo bowl-wall launch ramp landing | PART | SpeedLine 'launch'; J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1544 | SPC Grand Jete | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1545 | CMB Graceful Leap | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1574 | GIM BD145 flywheel ring DS ground coupling | OK | geom (part geometry+mass) | MECH OK | authorable |
| 1575 | SPC Hades Drive | GAP | Z (outward wave) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1576 | CMB Hades Press | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1577 | GIM BD145 centripetal vortex inversion devour | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1578 | SPC Hades Gate | GAP | Z, no QTE | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1579 | CMB Cerberus Drag | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1580 | GIM Dual-axis vertical impact geometry | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1581 | SPC Heaven and Earth Strike | GAP | C, no QTE | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1582 | CMB Divine Cross | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1583 | GIM WA130 convection column HF positioning | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1584 | SPC Heaven's Supreme Destruction Palm | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1585 | CMB Thermal Cross | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1586 | GIM Draciel V turtle AR impeller V2 blade | PART | geom; Z | MECH OK | authorable / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1587 | SPC Heavy Viper Wall | GAP | Z, D | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1588 | CMB Viper Surge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1589 | GIM Hunter tip grind tribology wobble frequency | PART | E, T | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1590 | SPC Hunt Launch | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1591 | CMB Hunt Sweep | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1592 | GIM XF flat-face triboelectric charge accumulation | PART | resonance only; no charge stat | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1593 | SPC Hammer Bolt | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1594 | CMB Thunder Lash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1595 | GIM ED145 free-spin bearing two-phase uppercut | GAP | C, F | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1596 | SPC Horn Throw Destruction | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1597 | CMB Rising Horn | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1598 | GIM Claw driver forced-vortex air circulation | GAP | Z, [M] | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1599 | SPC Horusood Field | GAP | Z, B | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1600 | CMB Claw Whirl | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1601 | GIM Fang capture orbital hammer-throw | GAP | C, R | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1602 | SPC Howling Bite | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1603 | CMB Fang Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1610 | GIM Reach frame dual-angle spike deflection | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1611 | SPC Hurricane Counter | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1612 | CMB Spike Parry | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1613 | GIM Wall-climb stadium-rim gravity dive | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1614 | SPC Hyper Shield Crash | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1615 | CMB Rim Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1616 | GIM Dragoon Wing AR multi-vortex wake | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1617 | SPC Victory Tornado | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1618 | CMB Twister Rush | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1619 | GIM Dragoon V2 hyper-vortex amplification | GAP | Z, [M] | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1620 | SPC Hyper Victory Tornado | GAP | Z, [M] | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1621 | CMB Hyper Twister | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1622 | GIM Jupiter macro-vortex electromagnetic drain | GAP | Z, S | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1623 | SPC Grand Lightning | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1624 | CMB Jupiter Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1625 | GIM DF145 counter-deflection sword strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1626 | SPC Icicle Edge | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1627 | CMB Ice Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1628 | GIM Ignition' spring-clutch accel reversal | PART | forceState, M | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1629 | SPC Ignition Force | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1630 | CMB Ignition Dash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1631 | GIM Scythe macro-vortex ring wall push | GAP | Z (outward) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1632 | SPC Iron Wall Fist | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1633 | CMB Stone Cyclone | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1643 | GIM Rock Leone Rankine vortex WB dynamics | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1644 | SPC Lion 100 Fang Fury | GAP | Z, P | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1645 | CMB Fang Cyclone | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1646 | GIM Ballistic tornado-cocoon steerable multi-pass | GAP | J, A | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1647 | SPC King Lion Furious Blast Shot | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1648 | CMB Blast Rush | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1649 | GIM Triple vortex superposition orbit ejection | GAP | Z, B | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1650 | SPC King Lion Tearing Blast | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1651 | CMB Tearing Surge | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1652 | GIM Quintet vortex lattice mobile steering | GAP | Z, A | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1653 | SPC True King Lion Tearing Blast | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1654 | CMB True Storm | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1655 | GIM Inverted gyroscope CW vortex vertical drop | GAP | J, S | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1656 | SPC King Lion Reverse Wind Strike | GAP | J, S | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1657 | CMB Reverse Fang | GAP | X, S | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1658 | GIM Funnel vortex updraft capture overhead plunge | GAP | Z, J | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1659 | SPC King Lion Crushing Fang | GAP | Z, J | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1660 | CMB Crushing Descent | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1661 | GIM Kick driver spring-disc upper heading change | GAP | C, M | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1662 | SPC Kick Counter | GAP | C, forceState | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1663 | CMB Spring Kick | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1664 | GIM HF/S dual-mode direction switch illusion | PART | movement; M, no clones | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1665 | SPC Infinite Assault | GAP | [M], no clone entity | MECH OK | `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1666 | CMB Ghost Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1667 | GIM Infinite Ring attack-mode blade impulse train | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1668 | SPC Infinite Breaker | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1669 | CMB Quad Blade | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1670 | GIM Infinite Shield deflection return damage | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1671 | SPC Infinite Guard | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1672 | CMB Shield Return | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1673 | GIM RDF rubber-flat accel Beast dual mode | PART | E, M | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1674 | SPC Ishtar Impact | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1675 | CMB Solar Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1676 | GIM Ray ring rib contact RSF spin-leech | GAP | C, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1677 | SPC Keel Strangler | GAP | C, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1678 | CMB Rib Lock | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1679 | GIM Zeus AR barrage darkness field amplification | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1680 | SPC King of Darkness | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1681 | CMB Dark Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1682 | GIM Variares dual-drive left-spin blade slash | GAP | C, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1683 | SPC King of Thunder Sword | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1684 | CMB Thunder Blade | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1685 | GIM CS tip single-point pressure concentration | OK | geom (tip geometry+mass) | MECH OK | authorable |
| 1686 | SPC Lightning Sword Flash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1687 | CMB Striker Point | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1688 | GIM Leone WB centrifugal vortex barrier | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1689 | SPC Lion Gale Force Wall | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1690 | CMB Gale Wall Hold | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1691 | GIM Precessional orbit Karman vortex shedding | GAP | Z, T | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1692 | SPC Lion Wild Wind Fang Dance | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1693 | CMB Wind Fang Sweep | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1694 | GIM Spiral tip phase transition additive burst | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1695 | SPC Lost Spiral | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1696 | CMB Death Spiral Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1697 | GIM Air Knight wing lift Eternal aerial spin | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1698 | SPC Knight Flyer | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1699 | CMB Knight Glide | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1700 | GIM Bull horn impact H145 CoM elevation | GAP | C, T | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1701 | SPC Maximum Stampede | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1702 | CMB Bull Charge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1703 | GIM Vulcan centrifugal air-curtain D-tip retention | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1704 | SPC Mystic Zone | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1705 | CMB Seal Pulse | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1706 | GIM Driger MS claw single-point contact pressure | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1707 | SPC Mountain Sage's White Tiger Strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1708 | CMB Tiger Fang Press | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1709 | GIM Galux bowl-wall launch arc energy conversion | PART | SpeedLine 'launch'; J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1710 | SPC Mountain Cat Attack | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1711 | CMB Cat Pounce | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1712 | GIM Nothing driver free-spin Mirage rubber claw | GAP | C, F | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1713 | SPC Mirage Claw | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1714 | CMB Shadow Claw | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1715 | GIM RF rubber traction 105 bounce arc | PART | arena walls/traps; J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1716 | SPC Meteor Shower Attack | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1717 | CMB Pegasus Dive | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1718 | GIM WD gyro stabilization 145 tornado stall | PART | T, Z | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1719 | SPC Metal Wing Smash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1720 | CMB Eagle Gust | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1721 | GIM Ball-bearing endurance shield rebound COR | PART | E, F | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1722 | SPC Metal Ball Defense | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1723 | CMB Shield Rebound | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1724 | GIM Eternal free-spin 12Expand wide air field | GAP | Z, F | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1725 | SPC Mega Knight Blow | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1726 | CMB Orbit Drag | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1727 | GIM 230 CoM elevation WD orientation lock | PART | geom; M, T | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1728 | SPC Magnetic Needle Storm | GAP | Z, S | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1729 | CMB Needle Burst | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1730 | GIM Nine disc asymmetric mass Spiral friction burst | PART | geom; no launch coupling | MECH OK | authorable |
| 1731 | SPC Nightmare Boost | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1732 | CMB Dark Drive | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1733 | GIM Wolborg 4 bearing air-pump vortex | GAP | Z, F | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1734 | SPC Novae Rog | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1735 | CMB Arctic Pulse | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1736 | GIM Flat SG orbital Dragoon wake vortex chain | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1737 | SPC Phantom Hurricane | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1738 | CMB Hurricane Dash | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1739 | GIM Ultimate Reboot' tip retraction friction mode | PART | M, E | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1740 | SPC Prime Reboot | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1741 | CMB Reboot Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1742 | GIM Metal Universe pivot free-direction redirect | PART | movement; forceState | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1743 | SPC Prominence Counter | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1744 | SPC Prominence Shaker | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1745 | CMB Phoenix Pivot | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1746 | GIM Poseidon sea-surge AR momentum retention | PART | geom; Z | MECH OK | authorable / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1747 | SPC Ocean Javelin | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1748 | CMB Sea Surge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1749 | GIM HF flat traction WA130 contact plane | OK | geom (part geometry+mass) | MECH OK | authorable |
| 1750 | SPC Piercing Brink Strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1751 | CMB Brink Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1752 | GIM SW145 triple-wing vortex SD orbital lock | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1753 | SPC Phantom Fire Shot | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1754 | CMB Smoke Screen | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1755 | GIM Yell disc momentum Orbit low-friction stability | OK | geom (mass/MoI/friction per part) | MECH OK | authorable |
| 1756 | SPC Perfect Circle | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1757 | CMB Orbit Crush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1758 | GIM 1'Dagger five-point Sword multi-contact | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1759 | SPC Penta Saber | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1760 | CMB Blade Cross | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1761 | GIM Apollon dual-head twin contact vaporization | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1762 | SPC Radiant Thunder | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1763 | CMB Thunder Cross | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1764 | GIM Rage ring upper-blade 3A chassis mass | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1765 | SPC Raid Upper | GAP | C, J | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1766 | CMB Blitz Upper | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1767 | GIM Crystal blade upward redirect Operate dual mode | GAP | C, M | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1768 | SPC Rain of Swordfire | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1769 | CMB Sword Drop | GAP | X, P | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1770 | GIM H145 low-tilt strike SD scrape approach | GAP | C, T | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:253`<-`BeySystem.ts:425` |
| 1771 | SPC Red Horn Uppercut | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1772 | CMB Horn Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1773 | GIM Requiem dual-spin equalization Zeta orbital lock | PART | E, S | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1774 | SPC Requiem Spin | PART | S, D | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1775 | SPC Requiem Whip | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1776 | CMB Requiem Dash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1777 | GIM Revive Armor detachable ricochet system | GAP | P, R, C | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `partMutation.ts:84`<-`BeySystem.ts:530` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1778 | SPC Revive Crush | GAP | C, P | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1779 | CMB Phoenix Pincer | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1780 | GIM Rock Orso multi-claw ring D125 track | OK | geom (part geometry+mass) | MECH OK | authorable |
| 1781 | SPC Russian Bear Hook | GAP | C, [M] (5.99 -> 71.9 m/s, 12.0x) | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1782 | CMB Bear Claw Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1783 | GIM Wonder Valtryek Wing Accel' rush launch | PART | geom; no launch-angle model | MECH OK | authorable |
| 1784 | SPC Rush Launch | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1785 | CMB Rush Drive | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |

**CS13 contradictions (new, beyond the corpus-wide unit conflicts).** Cases 619 and 843 describe the **same** Poison Virgo ED145ES component with a **9x disagreement** on parry absorption (5.0% vs 45%) and a **10x** disagreement on tip friction (0.05-0.08 vs 0.005). Case 620's transcendence multiplier is simultaneously 2.5x, 50x and 125x depending on which block you read. Case 841's `powerCost: 110` exceeds the 100-point cap every other special in its range uses -- unpayable under the corpus-standard bar. **Combo cooldowns exceed their parent special's cooldown** in two families (807/808 and 823/824), inverting the cheap-combo gradient. Case numbers **687-689 are never written** despite Case 686 promising "Cases continue from Case 687". Cases 666 and 672 are near-duplicate gimmicks for the same parts. Field radii are specified in **mm in some cases and px in others** (95mm, 180px, 625px, 350px) with no conversion stated anywhere, so AoE sizes are not comparable. Cases 1578 and 1581 prescribe QTE input models (mash, 200ms dual-input) while their own paired combo cases encode the same moves as plain 3-key sequences. Cases 1529/1532/1535 form a hard cross-blader prerequisite chain that no case defines ordering for. Case 1741's combo name "Reboot Rush" duplicates Case 1473's. Cases 1743/1744 and 1774/1775 break the strict gimmick->special->combo triad by giving one bey two specials and one combo, leaving the second special's input undefined. **Cases 1619/1679/1598 explicitly budget for the `[M]` layer as the mechanism that makes their physics game-relevant** (one computes a wave force of 4.9 Pa and calls it "small") -- i.e. they self-report as insufficient without the missing amplification system.

## LEDGER PART 14  -  CS15 franchise special moves, second block (Cases 1786-2092)

581 headings / **~296 unique**. **Duplication is now precisely located:** the readers confirmed the file restarts its numbering at line ~21449 (Case 2092 ends at 21378, then Case 1797 begins again with *different* Burst/MFB-era content, not a verbatim copy). **Cases 1893-2092 appear exactly once, strictly sequential, and are clean** -- dedup logic must NOT be applied to them. Highest case number in the corpus confirmed: **2092**.

| Case | Tag + Title | Status | Codes | After fix v2 | Evidence (file:line) |
|---|---|---|---|---|---|
| 1786 | GIM Regalia Genesis motor + Mugen Lock | PART | D, E, B | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1787 | SPM Royal Scream multi-point contact detonation | GAP | C, B | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1788 | SPM Royal Eclipse motor-boosted counter redirect | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1789 | CMB Genesis Overload | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1790 | GIM Satomb Loop roller tilt-drift system | GAP | T | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` |
| 1791 | SPM Roller Drift precession orbit return | GAP | T, J | MECH OK | `spin.ts:253`<-`BeySystem.ts:425` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1792 | SPM Roller Defense oblique bumper deflect | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1793 | CMB Roller Counter | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1794 | GIM Moment driver traction-switch grip | PART | E, M | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1795 | SPM Ringing Crash course-change ram | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1796 | CMB Moment Dash | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1797 | GIM Claw retraction + tower elevation | GAP | R, I, M | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `spin.ts:65`<-`assembler.ts:175` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1798 | SPM Shelter Defense smooth-profile deflect | GAP | C, R | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1799 | CMB Shell Guard | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1800 | GIM Free-spin ring + bowl trajectory | PART | arena bowl; F | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1801 | SPM Shield Crash absorb then wall-ramp | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1802 | CMB Bowl Rider | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1803 | GIM Dual Phantom chip separation pincer | GAP | R, L (cannot split entity) | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1804 | SPM Shining Crux opposite-direction pincer | GAP | L, C | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1805 | CMB Dual Slash | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1806 | GIM Earth wheel aerodynamic lift vortex | GAP | J, Z | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1807 | SPM Shining Tornado Buster lift-dive pierce | GAP | J, Z | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1808 | CMB Eagle Drive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1809 | GIM Wing-assisted bowl exit sky drop | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1810 | SPM Shooting Star Crush vertical sky drop | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1811 | CMB Meteor Drop | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1812 | GIM RF orbital drive + storm vortex | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1813 | SPM Storm Bringer vortex destabilise + dive | GAP | Z, C | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1814 | CMB Storm Spiral | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1815 | GIM Rubber wing absorption WB stability | PART | geom; C, E | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1816 | SPM Storm Surge absorb then elastic counter | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1817 | CMB Surge Counter | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1818 | GIM Wing-edge contact shockwave | GAP | C, Z | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1819 | SPM Stream Slash aerial wing-edge shockwave | GAP | J, C | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1820 | CMB Wing Rise | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1821 | GIM Blade tip pressure pierce condition | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1822 | SPM Stroblitz Attack layer pierce, defense bypass | GAP | C, E | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1823 | CMB Blitz Pierce | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1824 | GIM F:D dual-mode tip atmospheric trajectory | GAP | J, M | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1825 | SPM Super Cosmic Nova atmospheric ascent crash | GAP | J, [M] | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1826 | CMB Cosmic Drive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1827 | GIM X-Line rail acceleration Xceed driver | PART | SpeedLine 'launch' wired; no spin->translation | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `launch.ts:122`<-`SpawnManager.ts:1202` |
| 1828 | SPM Super Strike rail buildup strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1829 | CMB X-Rail Rush | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1830 | GIM Atomic tip wall-bounce drive | PART | arena walls/restitution; F | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1831 | SPM Super Tempest wall-ride bounce crash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1832 | CMB Glaive Bounce | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1833 | GIM Operate defense mode ten-blade vortex | GAP | Z, M | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1834 | SPM Swirling Inferno flaming tornado updraft | GAP | Z, J | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1835 | CMB Inferno Shell | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1836 | GIM D:D dual-spin tip left-spin mode | PART | geom; S | MECH OK | authorable / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1837 | SPM Sword of Ares counter-rotation pierce | GAP | C, S | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1838 | CMB Ares Counter | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1839 | GIM Q tip aerial bounce M145 gyro | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1840 | SPM Spin Screwdriver apex horn-whip descent | GAP | J, Z | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1841 | CMB Horn Whip | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1842 | GIM F230 under-attack platform TB dual drive | PART | geom; M | MECH OK | authorable / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1843 | SPM Spinning Shell Smash indigo ray | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1844 | CMB Shell Slam | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1845 | GIM Centrifugal air barrier + WD stamina | PART | Z (radial-inward only) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1846 | SPM Spiral Dimension black-hole suction | PART | Z (inward pull maps to gravity_pull) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1847 | CMB Vortex Guard | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1848 | GIM Dranzer S wing aero + MS stamina | PART | geom; J, E | MECH OK | authorable / `aerial.ts:63`<-`SpawnManager.ts:1219` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1849 | SPM Spiral Fireball ascent and dive crash | GAP | J, P | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1850 | CMB Phoenix Dive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1855 | GIM Galeon blade sweep plasma vortex | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1856 | SPM Spiral Lightning tightening orbit displacement | GAP | Z, C | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1857 | CMB Thunder Arc | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1858 | GIM Sting disc spring wall ricochet | PART | arena walls; M | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1859 | SPM Spring Cannon ricochet boost + parry | GAP | C, P | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1860 | CMB Sting Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1861 | GIM W105 wing lift + R2F orbital burst | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1862 | SPM Starbooster orbital momentum to flight | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1863 | CMB Orbit Crash | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1864 | GIM(2) RF orbital-to-liftoff aerodynamic launch | GAP | J (tag off-taxonomy) | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1865 | SPM Starblast Attack self-launch sky dive | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1866 | CMB Star Dive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1874 | GIM(2) R2F warm-up friction + space launch | PART | geom; D, J (tag off-taxonomy) | MECH OK | authorable / `spin.ts:92`<-`SpawnManager.ts:1120` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1875 | SPM Stardust Driver warm spiral liftoff | GAP | J, D | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1876 | CMB Dust Rush | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1877 | GIM Horn tip pressure + red tornado vortex | GAP | C, Z | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1878 | SPM Steel Darkness vortex draw then horn ram | GAP | C, Z | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1879 | CMB Iron Ram | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1880 | GIM Upper blade lift vertical vortex column | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1881 | SPM Storm Attack vortex barrier interception | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1882 | CMB Tornado Guard | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1883 | GIM Drag heating + hot wind vortex | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1884 | SPM Sacred Fire hot wind blast + melt | GAP | Z, R | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1885 | CMB Ember Strike | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1886 | GIM Shot driver spring jump dual contact | GAP | J, M | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1887 | SPM Salvage Whip aerial six-blade strike | GAP | J, C, L | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1888 | CMB Salvage Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1889 | GIM Sand vortex inward suction, flat mode | PART | Z (radial-inward maps) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1890 | SPM Sand Bind restrict then fang strike | PART | Z, E | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1891 | CMB Sand Fang | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1892 | GIM CH120 height extension six-prong contact | GAP | R, C | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1893 | SPM Six Crab Shake sequential peck strikes | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1894 | CMB Crab Peck | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1895 | GIM M145 stabiliser + Q rubber bounce drill | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1896 | SPM Slumdog Driver drill overhead smash | GAP | J, C, [M] | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1897 | CMB Tornado Dash | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1898 | GIM M145 targeting stance Q dash release | GAP | A | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 1899 | SPM Sniper Shot QTE target lock dash | GAP | A, C, no QTE | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1900 | CMB Sniper Charge | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1901 | GIM T125 arena vibration acoustic vortex | PART | zones/particles; R | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1902 | SPM Sonic Buster sand destabilise + shriek | PART | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1903 | CMB Sound Burst | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1904 | GIM Resonance amplification arena-wide collapse | PART | Z, R | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1905 | SPM Sonic Wave full-arena fluidised sand | PART | Z, R, B | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `partMutation.ts:84`<-`BeySystem.ts:530` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1906 | CMB Resonant Strike | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1907 | GIM Flat tip sprint triboelectric spark shield | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1908 | SPM Spark Hammer straight-line charge smash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1909 | CMB Electric Charge | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1910 | GIM Dranzer F wing lift overhead descent | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1911 | SPM Spin Fire bowl-wall launch aerial crash | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1912 | CMB Flame Dive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1913 | GIM WA130 wing-arm sweep HF orbit | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1914 | SPM Tempestuous Whirlwind Sword slash + slam | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1915 | CMB Lacerta Slash | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1916 | GIM CWD wide-wing amplification fire column | GAP | J, Z | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1917 | SPM The End of Fire ascent fire-column descent | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1918 | CMB Ash Rise | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1919 | GIM Phase-locked dual Rankine tornado | GAP | L, Z | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1920 | SPM Twin Tornado Attack co-blader strike | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1921 | CMB Cyclone Spiral | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1922 | GIM Dual-spin crystalline freeze ring | PART | E, S | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 1923 | SPM Twin Spire freeze drain and trap | PART | E, D | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1924 | CMB Ice Spire Lock | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1925 | GIM Dual saber-blade aerial dive | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1926 | SPM Twin Saber bowl-wall launch dive | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1927 | CMB Eagle Dive Strike | GAP | X, J (no dodge action) | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1928 | GIM Turbo Awakening dual-blade extension | GAP | R, M | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1929 | SPM Turbo Whip head-on dual slash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1930 | CMB Z Slash Drive | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1931 | GIM Wall-rebound Turbo Awakening launch | PART | arena walls; M, E | MECH OK | `partMutation.ts:141`<-`BeySystem.ts:551` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1932 | SPM Turbo Winged Launch rebound snap strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1933 | CMB Zenith Rebound Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1934 | GIM Left-spin defense Zeta' reversal | GAP | S, D | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1935 | SPM Turbo Upper Launch reversal upper strike | GAP | S, C, J | MECH OK | `spinExchange.ts:99`<-`BeySystem.ts:449` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1936 | CMB Spryzen Upper Guard | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1937 | GIM Single Turbo blade undercut | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1938 | SPM Turbo Upper undercut from below | GAP | C, J | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1939 | CMB Achilles Upper Drive | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1940 | GIM Burst stopper blade power channeling | PART | E, [M] | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1941 | SPM Turbo Sword power-channeled blade slash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1942 | CMB Z Sword Cross | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1943 | GIM Gyroscopic shield combined crush approach | PART | E, forceState | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1944 | SPM Turbo Crush shield deflect then crush | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1945 | CMB Achilles Press | GAP | X, C, D (spinGain inert) | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1946 | GIM Triumph ring spring-blade awakening | GAP | R, M | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1947 | SPM Triumph Break awakened spring-blade strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1948 | CMB Triumph Guard | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1949 | GIM Three-ring deflection system | GAP | C, F | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` |
| 1950 | SPM Triple Spin three-ring attacker deflect | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1951 | CMB Satomb Reflect | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1952 | GIM Three-bear coordinated surround push | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1953 | SPM Triple Orso Step coordinated edge push | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1954 | CMB Orso Triangle | GAP | X, L | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1955 | GIM Blade Sharks triangle formation geometry | GAP | L | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1956 | SPM Triangle Attack simultaneous three-point strike | GAP | L, C | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1957 | CMB Shark Triangle | GAP | X, L | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1958 | GIM CH track height-change mechanism | GAP | R, M | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 1959 | SPM Track Change instant height-drop strike | GAP | R, C | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1960 | CMB Track Drop | GAP | X, R | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1961 | GIM RF orbital vortex generation | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1962 | SPM Tornado Wing vortex sweep + ejection | GAP | Z, B | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `burst.ts:109`<-`BeySystem.ts:436` |
| 1963 | CMB Tornado Circuit | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1964 | GIM Driger V + Dragoon V joint tornado claw | GAP | L, Z | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 1965 | SPM Tornado Claw joint tornado plus claw | GAP | L, C | MECH OK | `BeyLink.ts:142`<-`BeySystem.ts:504` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1966 | CMB Tornado Claw Circuit | GAP | X, L | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BeyLink.ts:142`<-`BeySystem.ts:504` |
| 1967 | GIM Bull-rush uppercut trajectory | GAP | C, J | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1968 | SPM Tornado Bull Uppercut rush follow-through | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1969 | CMB Bull Rocket | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1970 | GIM Electric spin boost mechanism | PART | D, E | MECH OK | `spin.ts:92`<-`SpawnManager.ts:1120` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1971 | SPM Toda La Fuerza electric orbital strike | GAP | C, E | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1972 | CMB Fuerza Charge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1973 | GIM Ricochet attack + electric fang contact | PART | arena walls; C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1974 | SPM Tiger Fang ricochet bite strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1975 | CMB Tiger Ricochet | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1976 | GIM Multi-strike claw slash electric boost | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1977 | SPM Tiger Claw flash boost 3-hit rake | GAP | C, E | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1978 | CMB Tiger Scratch | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1979 | GIM WA130 deflect-hook mechanism | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1980 | SPM Thunder Sword Waltz hook behind-throw | GAP | C, R | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1981 | CMB Sword Waltz | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1982 | GIM Massive power channel electric radiation slash | PART | E, [M] | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1983 | SPM Thunder Slash power channel metal slash | GAP | C, [M] 8.0x | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1984 | CMB Thunder Channel | GAP | X, C, D | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 1985 | GIM Ground-burst launch + rock projectile | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1986 | SPM Spike Saw projectile plus saw | GAP | P, [M] | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1987 | CMB Spike Burst | GAP | X, P | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 1988 | GIM Wall-ride + crimson blade dive | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1989 | SPM Ultimate Dive crimson descent | GAP | J, [M] | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1990 | CMB Crimson Wall Dive | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 1991 | GIM Groove-rail speed build | PART | SpeedLine wired; no rail speed accrual | MECH OK | `railBlend.ts:46`<-`SpawnManager.ts:1179` |
| 1992 | SPM Ultimate Flash Launch groove exit | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1993 | CMB Flash Groove | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 1994 | GIM Variable' driver speed surge | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 1995 | SPM Ultimate Flash V surge strike | GAP | C, E, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1996 | CMB V-Surge Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 1997 | GIM In-battle tip change speed surge | GAP | R | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` |
| 1998 | SPM Ultimate Genesis Reboot tip swap | GAP | R, [M] | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 1999 | CMB Genesis Surge | GAP | X, R | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 2000 | GIM Elemental tornado vortex (manga) | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 2001 | SPM Ultimate Storm vortex dive | GAP | Z, J, [M] | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `aerial.ts:63`<-`SpawnManager.ts:1219` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2002 | CMB Tornado Crash | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 2003 | GIM Moving storm vortex (anime) | GAP | Z (attached moving zone) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 2004 | SPM Ultimate Storm Attack moving vortex | GAP | Z, [M] | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2005 | CMB Storm Follow | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 2006 | GIM Groove speed build + heavy contact | PART | SpeedLine wired; C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2007 | SPM Ultra Counter Break groove exit | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2008 | CMB Counter Groove | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2009 | GIM Outer rim drift trajectory change | PART | arena rim/walls; forceState | MECH OK | `index.ts:19`<-`ArenaSandbox.ts:2559` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 2010 | SPM Ultra Emperor Drift rim strike | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2011 | CMB Emperor Drift | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 2012 | GIM Wall-ride + Xtend+ tip switch dive | GAP | J, R | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `partMutation.ts:84`<-`BeySystem.ts:530` |
| 2013 | SPM Unison Dive apex descent | GAP | J, [M] | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2014 | CMB Union Ascent | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 2015 | GIM Outer rim variable speed surge | PART | SpeedLine wired; no surge accrual | MECH OK | `railBlend.ts:46`<-`SpawnManager.ts:1179` |
| 2016 | SPM Ultra Flash Launch rim assault | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2017 | CMB Flash Rim | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 2018 | GIM Sprint wall-launch + 270deg flanking arc | GAP | J, A | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 2019 | SPM Vanishing Attack rear-contact | GAP | J, C, no teleport | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2020 | CMB Phantom Flank | GAP | X (no dodge action) | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 2021 | GIM Temptation resonance field + Venus manifest | GAP | Z, E | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 2022 | SPM Venus Temptation outward repel | GAP | Z (outward), [M] 7.5x | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2023 | CMB Lovely Strike | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 2024 | GIM SW145 pendulum storage + rise-strike | PART | geom; J, E | MECH OK | authorable / `aerial.ts:63`<-`SpawnManager.ts:1219` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 2025 | SPM Venom Strike rise contact | GAP | J, C, [M] | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2026 | CMB Venom Coil | GAP | X (no dodge action) | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 2027 | GIM Double bash + 2D barrier pincer | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2028 | SPM Vexing Crush four-phase assault | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2029 | CMB Variant Crush | GAP | X, C, D | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 2030 | GIM Multi-vortex storm (main + 3 sub) | GAP | Z | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 2031 | SPM Victory Tornado rush | GAP | Z, [M] | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2032 | CMB Tornado Vortex | GAP | X, Z | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 2033 | GIM Vortex wall + spring SG absorption | GAP | Z (outward) | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` |
| 2034 | SPM Viper Wall outward deflection | GAP | Z, [M] | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2035 | CMB Viper Shield | GAP | X, Z, D | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `fieldForce.ts:77`<-`SpawnManager.ts:974` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 2036 | GIM Volcanic fire blade ignition | PART | E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 2037 | SPM Volcano Emission ignited strike | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2038 | CMB Volcano Blade | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2039 | GIM Explosion-propelled fire projectile | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 2040 | SPM Volcano Excellent Emission blast | GAP | P, [M] | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2041 | CMB Volcano Excellent | GAP | X, P | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 2042 | GIM Tiger claw rapid-fire shredding barrier | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2043 | SPM Vulcan Claw four-claw barrier | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2044 | CMB Vulcan Barrier | GAP | X, C, D | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `spin.ts:92`<-`SpawnManager.ts:1120` |
| 2045 | GIM Upper claw + N=6 claw swipes | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2046 | SPM Vulcan Power Claw upper assault | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2047 | CMB Vulcan Power Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2048 | GIM Sword-tip point-pierce strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2049 | SPM Xiphoid Saber pierce | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2050 | CMB Xiphoid Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2051 | GIM Horuseus directed wind cannon | GAP | P | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 2052 | SPM Vulcan Cannon blast | GAP | P, [M] | MECH OK | `projectile.ts:114`<-`ProjectileManager.ts:117` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2053 | CMB Vulcan Shot | GAP | X, P | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `projectile.ts:114`<-`ProjectileManager.ts:117` |
| 2054 | GIM Slope-accelerated zone layer slam | PART | arena slopes; C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2055 | SPM Zone Slam slope descent | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2056 | CMB Zone Charge | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2057 | GIM Drake disc dual-head hammer extension | GAP | R, C | MECH OK | `partMutation.ts:84`<-`BeySystem.ts:530` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2058 | SPM Zone Hammer dual-head strike | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2059 | CMB Drake Strike | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2060 | GIM Dual-flank teleport velocity slam | GAP | J, no teleport primitive | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 2061 | SPM Wave Attack dual-flank slam | GAP | J, C, [M] | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2062 | CMB Wave Rush | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 2063 | GIM Hologram orbit ambush strike | GAP | no decoy entity, A | MECH OK | `TargetManager.ts:60`<-`MiniGameAdminScreen.ts:124` |
| 2064 | SPM Wave Buster Attack ambush | GAP | no decoy, C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2065 | CMB Wave Ambush | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 2066 | GIM ED145 free-spin rim tilt deflection | PART | geom; C, F, E | MECH OK | authorable / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 2067 | SPM Wind Storm Assault deflect counter | GAP | Z, C, [M] | MECH OK | `fieldForce.ts:77`<-`SpawnManager.ts:974` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2068 | CMB Wind Shift | GAP | X, E | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 2069 | GIM Spirit feather multi-hit claw strike | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2070 | SPM Wing Dagger feather barrage | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2071 | CMB Wing Rain | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2072 | GIM Spring-assisted sword blade contact | GAP | C, M | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `partMutation.ts:141`<-`BeySystem.ts:551` |
| 2073 | SPM Wing Whip spring strike | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2074 | CMB Power Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2075 | GIM Spirit claw multi-hit slash | GAP | C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2076 | SPM Wolf Storm claw barrage | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2077 | CMB Wolf Claw | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2078 | GIM Ratchet torque-decoupled counter-spin deflect | PART | F, E, S | MECH OK | `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` / `spinExchange.ts:99`<-`BeySystem.ts:449` |
| 2079 | SPM Wrench Parry deflect | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2080 | CMB Ratchet Redirect | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2081 | GIM Rise tip rim friction speed boost | PART | arena rim; E | MECH OK | `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 2082 | SPM Wizard Blow boosted strike | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2083 | CMB Rise Rush | GAP | X | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` |
| 2084 | GIM Aerial descent attack-mode slope slam | GAP | J | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 2085 | SPM World Whip descent slash | GAP | J, C, [M] | MECH OK | `aerial.ts:63`<-`SpawnManager.ts:1219` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2086 | CMB World Slash | GAP | X, J | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `aerial.ts:63`<-`SpawnManager.ts:1219` |
| 2087 | GIM 2B bound free-spin chassis torque deflect | PART | geom; F, E | MECH OK | authorable / `arenaConstants.ts:223`<-`SpawnManager.ts:1111` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 2088 | SPM World Spin defensive deflect | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2089 | CMB World Guard | GAP | X, E | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `BuffDebuffManager.ts:70`<-`SpawnManager.ts:1119` |
| 2090 | GIM Recoil-assisted volcanic rim orbital attack | PART | arena rim; C | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |
| 2091 | SPM Wonder Flash Launch rim attack | GAP | C, [M] | MECH OK | `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` / `BattleGauges.ts:113`<-`BeySystem.ts:314` |
| 2092 | CMB Flash Rush | GAP | X, C | MECH OK | `ComboDetector.ts:102`<-`ArenaSandbox.ts:2431` / `beyCollision.ts:165`<-`ArenaSandbox.ts:2549` |

**CS15 contradictions (12 found, several structural).** **The most implementation-relevant:** Cases 1985/1986, 2039/2040 and 2051/2052 are framed as projectile moves in prose and physics, but **their TypeScript bodies all collapse to a single `applyForce(target.id, ...)` -- a direct hit, never a spawned body.** Implementing the code verbatim would not require `ProjectileManager` at all; the spec contradicts its own framing. **`->` is overloaded as both the moveRight input and a sequence delimiter** across different combo cases, making combo notation unparseable as one grammar; Case 1805 compounds this with 5 glyphs for a stated 3-input combo. **Inputs `K` (defense) and `E` (dodge) have no binding anywhere** -- `ControlManager` exposes only movement axes plus jump/trigger, so even the jump-bearing combos map to a button with no bey-motion consumer. Combo `Cost` is 15 for 37 combos then 25 for three others with no stated rule, against a power bar that does not exist. Combo `Type` drifts between `balance` and `balanced`, neither of which is an enum in `src`. The `GIMMICK(2)` tag appears only in the second block (Cases 1864, 1874) so a parser keyed on `GIMMICK:` **silently drops both**. Numbering gaps 1851-1854 and 1867-1873 break two triads. Six beys carry **two or three conflicting GIMMICK definitions each** (Earth Eagle, Storm Pegasus x3, Storm Capricorn, Galaxy Pegasus, Thermal Lacerta) with nothing stating which wins. Case 2021 self-refutes its own coefficient (computes 440 Hz vs 2.5-8 Hz precession, concludes "no direct resonance", then still applies `e_tempt = 0.06`). Case 1797 imports its moment of inertia from CS9 Case 1515, unverifiable within the file. Case 1896's `[M] 8.0x` is justified by co-blader amplification while the case is structured as single-bey. **Seven GIMMICK cases lack the numbered sub-sections every other case uses -- and they are exactly the coop-link and runtime-part-swap cases**, i.e. the least mechanically decomposable ones.

---

## LEDGER CLOSE  -  what this changes in the plan

1. **The six primitives in the Ledger Summary are now the real Milestone 2-3 scope.** Every content phase downstream is gated on them, and the Ledger gives the exact case counts behind each, so the sequencing in Sec.F is evidence-based rather than asserted.
2. **Sec.P1's 19-system correction is confirmed from CS5 and CS7 directly** -- all 19 architecture cases are GAP, and `gimmickType`'s 5 unread values cover none of them.
3. **Sec.H1b is confirmed and strengthened** -- CS10's 20 named stadium cases are PART, not GAP: the editor really can build them, and what is missing is per-stadium gimmicks plus the Sec.G1 collision work.
4. **Three corpus-integrity items are now blocking, not cosmetic**, and belong in Milestone 3.5 ahead of the extractor: the **CS9-vs-CS10/11/12 case-number collision** (551-621), the **~130 unnumbered `CASE XXXX` headings** in CS9's tail, and CS15's **located** duplication (first ~27,700 lines only; 1893-2092 are clean and must not be de-duplicated).
5. **Sec.K7's contradiction table grows from 35 to roughly 200+ numbered items** across all 15 files, and the pattern is uniform enough to state as a rule: **trust the worked arithmetic over the prose thesis; trust the later file over the earlier; and treat any header's own "Common Errors to Avoid" block as the authority its own cases most often violate.** The friction-constant violation alone recurs in CS2, CS3, CS4, CS5, CS6, CS7, CS8 and CS9.
6. **One genuinely good-news row type:** every `OK` in the Ledger is a case our part/arena authoring already fully satisfies (cosmetic caps, plain tracks, mass-only discs, slope-and-rim geometry). They are few, but they confirm the editor layer is sound and worth keeping -- exactly Sec.O3's verdict.

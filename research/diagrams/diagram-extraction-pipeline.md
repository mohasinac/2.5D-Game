# Diagram 9 — Part Shape Extraction + Geometry Intelligence Pipeline

Research determines not only what a part DOES but what it LOOKS LIKE, what it IS MADE OF, how it CHANGES, how it MOVES, how it CONTACTS, how it BEHAVES, and how it should be GENERATED. Geometry is gameplay.

```mermaid
flowchart TD
  subgraph Collection["Image Collection (2–5 sources minimum per part)"]
    IMG_TOP[Top view]
    IMG_UNDER[Underside / bottom]
    IMG_SIDE[Side profile]
    IMG_ANGLE[Angled / 3/4 view]
    IMG_CLOSE[Close-up of contact features]
    IMG_OPEN[Opened / transformed mode]
    IMG_LAUNCHER[Launcher attached view]
    IMG_ROTATE[Multiple rotation angles]
  end

  subgraph Extraction["Shape Feature Extraction"]
    SE_CONTACT[Contact points extraction\ncount, angle, radius, thickness]
    SE_DIMS[Dimensions\ndiameter, height, thickness, slope angle]
    SE_CENTER[Center shape\nring profile, blade geometry]
    SE_WEIGHT[Weight distribution\nlocation of heavy areas]
    SE_SYMMETRY[Symmetry analysis\nsymmetric / asymmetric / N-fold]
    SE_PROTRUSIONS[Surface features\nprotrusions, cutouts, recesses, rails, holes]
    SE_LAYERS[Layer sections\ninner layer, outer layer, sub-layer, chassis]
    SE_MATERIAL[Material boundaries\nABS / rubber / metal / POM / polycarbonate]
    SE_TIP[Tip profile\nflat, point, ball, semi-flat, bearing]
    SE_ROTATION[Rotation features\nbearing locations, free-spin areas]
    SE_LOCKING[Locking systems\nburst tabs, sub-layer catches, gear tabs]
    SE_HOLLOW[Hollow areas\nweight-saving cutouts, hollow center]
  end

  subgraph Analysis["Geometry Analysis"]
    GA_CLASS[Geometry Classification\nPart Category Table]
    GA_CONTACT[Contact Profile\nangle-gated multipliers → getContactPointMultiplier()]
    GA_MATERIAL[Material Profile\nABS/rubber/metal/POM/PC → MATERIAL_MULTIPLIERS]
    GA_MECHANIC[Mechanic Discovery\nWhat behavior emerges from this geometry?]
  end

  subgraph Profiles["Geometry Representations (7 profiles)"]
    PROF_2D[2D Profile\nTop collision profile\nangle → radius function]
    PROF_25D[2.5D Profile\nHeight approximation\nz-layer transitions]
    PROF_3D[3D Profile\nFull mesh geometry]
    PROF_CONTACT[Contact Profile\nCollision points\nangle/width/radius/thickness\nOR arcStart/arcEnd/rInner/rOuter]
    PROF_PHYS[Physical Profile\nmass + material + center of mass]
    PROF_VIS[Visual Profile\nRender mesh / sprite / Fourier profile]
    PROF_BEH[Behavior Profile\nRuntime mechanics + gimmick IDs\ngimmickIds[] → mechanic handlers]
  end

  Collection --> Extraction
  IMG_TOP --> SE_CONTACT
  IMG_UNDER --> SE_LOCKING
  IMG_SIDE --> SE_DIMS
  IMG_ANGLE --> SE_SYMMETRY
  IMG_CLOSE --> SE_MATERIAL
  IMG_OPEN --> SE_ROTATION
  IMG_LAUNCHER --> SE_LAYERS
  IMG_ROTATE --> SE_PROTRUSIONS

  Extraction --> Analysis
  SE_CONTACT --> GA_CONTACT
  SE_MATERIAL --> GA_MATERIAL
  SE_DIMS --> GA_CLASS
  SE_WEIGHT --> GA_CLASS
  SE_ROTATION --> GA_MECHANIC
  SE_LOCKING --> GA_MECHANIC
  SE_TIP --> GA_MECHANIC

  Analysis --> Profiles
  GA_CONTACT --> PROF_CONTACT
  GA_MATERIAL --> PROF_PHYS
  GA_CLASS --> PROF_2D
  GA_CLASS --> PROF_25D
  GA_CLASS --> PROF_3D
  GA_MECHANIC --> PROF_BEH
  GA_CLASS --> PROF_VIS
```

## Part Category Table

| Part Type | System | Purpose | Key Behaviors | Shared Mechanics |
|-----------|--------|---------|---------------|----------------|
| Attack Ring (AR) | Plastic Gen | Primary contact surface | Smash/upper/burst attack, deflect | `contact_deflect`, `spring_recoil`, `rubber_grip` |
| Weight Disk (WD) | Plastic Gen | Weight distribution | Heavy spin momentum, inertia | `weight_shift` |
| Blade Base / Spin Gear | Plastic Gen | Base + tip | Movement character, stamina | `bearing_drift`, `surface_friction_modifier` |
| Engine Gear | Plastic Gen (V2) | Power reserve burst | Spin injection burst on contact | `energy_reserve`, `velocity_burst` |
| Running Core | Plastic Gen (V2) | Internal core swap | Mode switch inner mechanism | `mode_switch` |
| Bit Chip | Plastic Gen | Beyblade identity | Bit-beast visualization | visual only |
| Layer (Upper) | MFB | Main contact body | Multi-contact attack | `contact_deflect`, `rubber_grip` |
| Energy Ring | MFB | Outer decoration + weight | Weight balance | `weight_shift` |
| Fusion Wheel | MFB | Wide contact + weight | Smash/upper attack, gyroscopic | `spin_steal_coupling`, `contact_deflect` |
| Performance Tip | MFB | Base movement | Movement character | `bearing_drift`, `rubber_grip`, `surface_friction_modifier` |
| 4D Frame | MFB (4D) | Mode-switch outer | Attack/stamina mode | `mode_switch`, `spin_threshold_switch` |
| Layer (Burst) | Burst | Burst-tab contact | Burst resistance + contact | `burst_suppress`, `contact_deflect` |
| Disc (Forge Disc) | Burst | Weight + sub-disc | Weight distribution + stamina | `weight_shift`, `free_spin` |
| Driver (Burst) | Burst | Base movement | Movement character | all tip mechanics |
| Layer (Cho-Z/GT) | Burst Cho-Z/GT | Rubber + metal contact | Counter-rubber attack | `rubber_grip`, `spin_steal_coupling` |
| Blade (BX) | BX | Main contact blade | X-attack, gear rail compat | `rail_lock`, `contact_deflect` |
| Ratchet (BX) | BX | Mid-section weight | Burst protection + weight | `burst_suppress`, `weight_shift` |
| Bit (BX) | BX | Driver/tip | Gear-rail compatibility flag | `rail_lock` (gearCompatibleBit) |
| Metal Face | MFB HWS | Face bolt metal | Weight boost | `weight_shift` |
| Chassis (DB) | Burst DB | Frame + blade combined | Combined attack + defense | `contact_deflect`, `weight_shift` |

## Visual Fact Extraction Table (Template — used in every parts batch)

| Feature | Observation | Source | Confidence |
|---------|------------|--------|-----------|
| Contact points | (from image analysis) | image URL / HMSDB / WBO | FACT/INFERENCE |
| Tip profile | (flat/ball/point/bearing/rubber) | underside image | FACT/INFERENCE |
| Material at contact | (ABS/rubber/metal) | close-up image + description | FACT/INFERENCE |
| Weight distribution | (uniform/rim-heavy/center-heavy) | side + angled image | INFERENCE |
| Layer geometry | (symmetric/asymmetric, blade count) | top view | FACT |
| Locking features | (burst tabs, sub-layer catch, gear) | underside image | FACT/INFERENCE |
| Mode change mechanism | (manual/spring/wear/spin-threshold) | opened + description | FACT/INFERENCE |

## Part Behavior Table (Template — used in every parts batch)

| Part | Behavior | Trigger | Runtime Effect | Confidence |
|------|---------|---------|----------------|-----------|
| Engine Gear | Spring-load energy burst | Contact impact compresses spring | `coreReserveRemaining` charge → `velocity_burst` fire | FACT (Plastic V2 mechanics) |
| Final Drive tip | Mode switch from flat to flat+rubber | Spin speed drops below threshold | `spin_threshold_switch` → aggressiveness/gripFactor/surfaceFriction change | FACT (MFB mechanic) |
| Bearing Driver | Free spin independent of body | Always spinning freely | `free_spin` → lower `spinDecayRate` + `spinStealResist` boost | FACT (Burst LAD strategy) |
| Rubber Flat tip | High traction, aggressive movement | Contact with arena floor | `rubber_grip` → `gripFactor`↑ + `aggressiveness`↑ | FACT |
| Sub-layer (Burst) | Burst resistance boost | Sub-layer active | `burst_suppress` → `burstResistance` dynamic boost | INFERENCE (sub-layer mechanic) |
| X-Bit (BX) | Gear rail compatibility | Bit profile matches rail | `gearCompatibleBit = true` → `rail_lock` eligible | INFERENCE (BX system) |

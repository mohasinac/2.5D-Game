# Diagram: Image Extraction Pipeline → Part Geometry

> **Stage 0C Diagram 9** — Rule 8: Geometry is gameplay.

```mermaid
flowchart TD
  subgraph "Source Material"
    IMG[Part Images<br/>2–5 sources per part<br/>top/side/3/4-view]
    WIKI[Beyblade Wiki<br/>official part renders]
    PHOTOS[Community Photos<br/>actual part measurements]
  end

  subgraph "Shape Extraction"
    SE[Shape Extraction<br/>outline tracing]
    MA[Multi-angle Analysis<br/>top view → contact radii<br/>side view → height profile]
  end

  subgraph "Geometry Analysis"
    CP_EXT[Contact Point Extraction<br/>angle, width, radius, material<br/>or arcStart, arcEnd, rInner, rOuter]
    MTL[Material Analysis<br/>ABS/rubber/metal/POM/PC]
    GEO[Geometry Classification<br/>flat/round/sharp/spike/ball/bearing]
    PROFS[Shape Profiles<br/>Fourier series for 2.5D renderer]
  end

  subgraph "Mechanic Discovery"
    MEC_D[Mechanic Discovery<br/>what behavior does this geometry cause?]
    GIMMICK_D[Gimmick Discovery<br/>what reusable system does this map to?]
    MODE_D[Mode/Config Discovery<br/>does this part switch behavior?]
  end

  subgraph "Engine Mapping"
    E2D[2D Profile<br/>pointsOfContact[], spinStealPoints[]]
    E25D[2.5D Profile<br/>ContactPoint (arc or legacy)<br/>pockets[], configurations[]<br/>PartSystemManager state machine]
    E3D[3D Profile<br/>❌ Not built]
    PHYS[Physical Profile<br/>mass, radius, material<br/>abs/rubber/metal/pom/pc]
    VIS[Visual Profile<br/>sprite images, rendererData<br/>PNG/JPG/GIF/WebP — GIF = no destructive edit]
    BEH[Behavior Profile<br/>gimmickIds[] → MechanicRegistry handlers<br/>via gimmickExpander.ts → MechanicInstance[]]
  end

  IMG --> SE
  WIKI --> SE
  PHOTOS --> MA
  SE --> MA
  MA --> CP_EXT
  MA --> MTL
  MA --> GEO
  MA --> PROFS

  CP_EXT --> MEC_D
  MTL --> MEC_D
  GEO --> MEC_D
  MEC_D --> GIMMICK_D
  GIMMICK_D --> MODE_D

  CP_EXT --> E2D
  CP_EXT --> E25D
  MTL --> PHYS
  GEO --> E25D
  PROFS --> E25D
  GIMMICK_D --> BEH
  MODE_D --> E25D
  PHYS --> E2D
  PHYS --> E25D
```

## Contact Point Shapes

| Shape | Fields | Usage |
|-------|--------|-------|
| Legacy | angle, width, radius, thickness | 2D renderer Fourier profile |
| Arc-segment (new) | arcStart, arcEnd, radiusInner, radiusOuter, lineThickness, setId | 2.5D contact geometry |

Both coexist. `resolveCpBounds(cp)` normalises to `{arcStart, arcEnd, rInner, rOuter, lineThickness}`.

---
[? Engine Capabilities](diagram-engine-capabilities.md) &nbsp;�&nbsp; [? Index](../INDEX.md) &nbsp;�&nbsp; [Input Abstraction ?](diagram-input-abstraction.md)

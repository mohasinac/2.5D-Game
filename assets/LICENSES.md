# Asset licences

Every file under `assets/` is recorded here **at download time**, with its
source and licence. Retrofitting provenance across hundreds of meshes later is
far more expensive than one line now, and it makes the licence position
auditable at a glance.

## Rules

1. **Free and commercially usable only.** In practice that means CC0 sources:
   [Kenney](https://kenney.nl), [Quaternius](https://quaternius.com),
   [KayKit](https://kaylousberg.itch.io), [Poly Haven](https://polyhaven.com),
   [ambientCG](https://ambientcg.com). CC0 does not *require* attribution; we
   record it anyway, and credit the authors in the root `README.md`.
2. **Nothing lands in `assets/` without a row in the table below.** A file with
   no row is treated as unlicensed and must be removed.
3. **Community Beyblade part models are NOT CC0** and must not be placed here.
   Licences vary per file and the designs are Takara Tomy's. They stay outside
   the repo (`D:\3d prints`) and are used for measurement only — the derived
   numbers (mass, inertia, centre of mass) are measurements, not the mesh, and
   carry no such restriction. Shipping any of them requires either a clear
   licence or an own-modelled replacement.
4. **Budget: keep `assets/` under ~15 MB total.** A browser game that takes
   50 MB to start is a browser game nobody waits for. Models go through
   `gltfpack` (quantise + simplify + Meshopt + KTX2) before being committed.

## Models

| File | Source | Author | Licence | Notes |
|---|---|---|---|---|
| `models/boat/boat-row-large.glb` | [Kenney](https://kenney.nl/assets/pirate-kit) | Kenney | CC0 | from `pirate-kit` |
| `models/boat/boat-row-small.glb` | [Kenney](https://kenney.nl/assets/pirate-kit) | Kenney | CC0 | from `pirate-kit` |
| `models/boat/ship-ghost.glb` | [Kenney](https://kenney.nl/assets/pirate-kit) | Kenney | CC0 | from `pirate-kit` |
| `models/boat/ship-large.glb` | [Kenney](https://kenney.nl/assets/pirate-kit) | Kenney | CC0 | from `pirate-kit` |
| `models/boat/ship-medium.glb` | [Kenney](https://kenney.nl/assets/pirate-kit) | Kenney | CC0 | from `pirate-kit` |
| `models/boat/ship-pirate-large.glb` | [Kenney](https://kenney.nl/assets/pirate-kit) | Kenney | CC0 | from `pirate-kit` |
| `models/boat/Textures/colormap.png` | [Kenney](https://kenney.nl/assets/pirate-kit) | Kenney | CC0 | texture atlas for `pirate-kit` |
| `models/castle/Textures/colormap.png` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | texture atlas for `castle-kit` |
| `models/castle/Textures/variation-a.png` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | texture atlas for `castle-kit` |
| `models/castle/Textures/variation-b.png` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | texture atlas for `castle-kit` |
| `models/castle/Textures/variation-c.png` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | texture atlas for `castle-kit` |
| `models/castle/Textures/variation-d.png` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | texture atlas for `castle-kit` |
| `models/castle/Textures/variation-e.png` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | texture atlas for `castle-kit` |
| `models/castle/Textures/variation-f.png` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | texture atlas for `castle-kit` |
| `models/castle/Textures/variation-g.png` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | texture atlas for `castle-kit` |
| `models/castle/tower-base.glb` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | from `castle-kit` |
| `models/castle/tower-hexagon-base.glb` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | from `castle-kit` |
| `models/castle/tower-hexagon-mid.glb` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | from `castle-kit` |
| `models/castle/tower-hexagon-roof-secondary.glb` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | from `castle-kit` |
| `models/castle/tower-hexagon-roof.glb` | [Kenney](https://kenney.nl/assets/castle-kit) | Kenney | CC0 | from `castle-kit` |
| `models/city/building-a.glb` | [Kenney](https://kenney.nl/assets/city-kit-commercial) | Kenney | CC0 | from `city-kit-commercial` |
| `models/city/building-b.glb` | [Kenney](https://kenney.nl/assets/city-kit-commercial) | Kenney | CC0 | from `city-kit-commercial` |
| `models/city/building-c.glb` | [Kenney](https://kenney.nl/assets/city-kit-commercial) | Kenney | CC0 | from `city-kit-commercial` |
| `models/city/building-d.glb` | [Kenney](https://kenney.nl/assets/city-kit-commercial) | Kenney | CC0 | from `city-kit-commercial` |
| `models/city/building-e.glb` | [Kenney](https://kenney.nl/assets/city-kit-commercial) | Kenney | CC0 | from `city-kit-commercial` |
| `models/city/building-f.glb` | [Kenney](https://kenney.nl/assets/city-kit-commercial) | Kenney | CC0 | from `city-kit-commercial` |
| `models/city/Textures/colormap.png` | [Kenney](https://kenney.nl/assets/city-kit-commercial) | Kenney | CC0 | texture atlas for `city-kit-commercial` |
| `models/city/Textures/variation-a.png` | [Kenney](https://kenney.nl/assets/city-kit-commercial) | Kenney | CC0 | texture atlas for `city-kit-commercial` |
| `models/city/Textures/variation-b.png` | [Kenney](https://kenney.nl/assets/city-kit-commercial) | Kenney | CC0 | texture atlas for `city-kit-commercial` |
| `models/rock/rock_largeA.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |
| `models/rock/rock_largeB.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |
| `models/rock/rock_largeC.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |
| `models/rock/rock_largeD.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |
| `models/rock/rock_largeE.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |
| `models/td/Textures/colormap.png` | [Kenney](https://kenney.nl/assets/tower-defense-kit) | Kenney | CC0 | texture atlas for `tower-defense-kit` |
| `models/td/Textures/variation-a.png` | [Kenney](https://kenney.nl/assets/tower-defense-kit) | Kenney | CC0 | texture atlas for `tower-defense-kit` |
| `models/td/tower-round-base.glb` | [Kenney](https://kenney.nl/assets/tower-defense-kit) | Kenney | CC0 | from `tower-defense-kit` |
| `models/td/tower-round-bottom-a.glb` | [Kenney](https://kenney.nl/assets/tower-defense-kit) | Kenney | CC0 | from `tower-defense-kit` |
| `models/td/tower-round-bottom-b.glb` | [Kenney](https://kenney.nl/assets/tower-defense-kit) | Kenney | CC0 | from `tower-defense-kit` |
| `models/td/tower-round-bottom-c.glb` | [Kenney](https://kenney.nl/assets/tower-defense-kit) | Kenney | CC0 | from `tower-defense-kit` |
| `models/tree/tree_blocks_dark.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |
| `models/tree/tree_blocks_fall.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |
| `models/tree/tree_blocks.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |
| `models/tree/tree_cone_dark.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |
| `models/tree/tree_cone_fall.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |
| `models/tree/tree_cone.glb` | [Kenney](https://kenney.nl/assets/nature-kit) | Kenney | CC0 | from `nature-kit` |

## HDRIs

_(none yet)_

## Textures

_(none yet)_

## Audio

| File | Source | Author | Licence | Notes |
|---|---|---|---|---|
| `audio/burst.ogg` | [Kenney](https://kenney.nl/assets/impact-sounds) | Kenney | CC0 | `impactMetal_heavy_000.ogg` from `impact-sounds` |
| `audio/hit-large.ogg` | [Kenney](https://kenney.nl/assets/impact-sounds) | Kenney | CC0 | `impactBell_heavy_000.ogg` from `impact-sounds` |
| `audio/hit-medium.ogg` | [Kenney](https://kenney.nl/assets/impact-sounds) | Kenney | CC0 | `impactPlate_medium_000.ogg` from `impact-sounds` |
| `audio/hit-small.ogg` | [Kenney](https://kenney.nl/assets/impact-sounds) | Kenney | CC0 | `impactPlank_medium_000.ogg` from `impact-sounds` |
| `audio/launch.ogg` | [Kenney](https://kenney.nl/assets/ui-audio) | Kenney | CC0 | `switch2.ogg` from `ui-audio` |
| `audio/round-win.ogg` | [Kenney](https://kenney.nl/assets/ui-audio) | Kenney | CC0 | `switch17.ogg` from `ui-audio` |

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
| _(none yet)_ | | | | |

## HDRIs

| File | Source | Author | Licence | Notes |
|---|---|---|---|---|
| _(none yet)_ | | | | Lighting currently comes from Three's bundled procedural `RoomEnvironment` — no file, no download. See `src/render/environment.ts`. |

## Textures

| File | Source | Author | Licence | Notes |
|---|---|---|---|---|
| _(none yet)_ | | | | Surface colour and normal maps are currently generated procedurally from canvas patterns. See `_paintCanvas` / `_paintNormal` in `src/geometry/materialBuilders.ts`. |

# `assets/`

Static files served at the site root. **This is Vite's `publicDir`**, not the
default `public/`.

## Why not `public/`

Vite's default `publicDir: 'public'` copies into `dist/`, and the bundler
already writes its own output to `dist/assets/`. Pointing `publicDir` at
`assets/` instead keeps shipped art at `dist/models/...` and the bundle at
`dist/assets/...`, so the two never collide. It also matches the folder name
used throughout the plan.

## Layout

```
assets/
  models/    props: boats, towers, trees, buildings, rocks, barriers, seating
  hdri/      one .hdr per arena mood (studio / outdoor / sunset / interior)
  textures/  PBR sets (colour + normal + roughness + AO)
  LICENSES.md
```

A file at `assets/models/boat.glb` is served at `/models/boat.glb` and copied to
`dist/models/boat.glb`.

## Adding a prop

1. Download from a CC0 source and **add its row to `LICENSES.md` immediately**.
2. Run it through `gltfpack` (quantise + simplify + Meshopt + KTX2). Meshopt
   over Draco: it decodes faster, which matters more than file size when an
   arena loads twenty props at once.
3. Add an entry to `ASSET_CATALOGUE` in `src/features/AssetRegistry.ts`. The
   catalogue is an explicit list rather than a directory scan, so a broken id is
   a visible edit here instead of a silent runtime miss.
4. Reference it from `ObstacleData.modelId` / `BaseFootingData.modelId`.

**Collision never uses the model.** A prop is drawn from its glTF and still
collides as its authored primitive (`shape` + `dimX/dimY/dimZ`). That is faster,
more predictable, and means swapping a box for a detailed boat cannot silently
change how an authored stadium plays.

## Budget

Under ~15 MB total. The JS bundle is ~2.7 MB today; the whole point of the
Meshopt/KTX2 pipeline is to keep art from dwarfing it.

# Beyblade Mock Renderer — Notes

## Coordinate System

- **1 unit = 1 cm**, **0.1 unit = 1 mm**
- Grid: 8×8 cm, minor lines every 1 mm, major lines every 1 cm
- X axis — blue
- Z axis — green
- Y axis — red (vertical, height)

## Spin Axis

The Y axis (0, 0, 0) → (0, height, 0) is the **spin axis** — the central rotation axis all beyblade parts share.

- All parts are centered on this axis (x=0, z=0)
- The base of the axis sits on the XZ plane at y=0 (tip contact point)
- Parts stack upward along Y

## Part Stack (bottom → top)

| Layer | Part | Notes |
|-------|------|-------|
| y=0 | Tip contact point | touches the arena floor |
| | Tip | lowest part, smallest radius |
| | Casing | wraps around WD |
| | Weight Disk | heaviest ring, sets moment of inertia |
| | Attack Ring | widest part, contact points live here |
| top | Bit Beast / Face Bolt | decorative cap, holds stack together |

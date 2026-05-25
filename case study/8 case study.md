# Beyblade Case Studies — Part 8: Individual Part Analysis

## How to Read a Case Study

Each case in this file examines a single Beyblade **part** (a specific Attack Ring, Weight Disk, Fusion Wheel, Layer, Driver, Disc, etc.) through four lenses:

1. **Thesis** — one dense paragraph stating the part's core physics claim. No bullets. No em-dashes. Colons and semicolons only. All claims are falsifiable from the geometry.

2. **Geometry** — ASCII cross-section or top-view diagram with labelled dimensions (all in SI units in the physics sections; mm acceptable in diagrams for readability).

3. **Physics** — named sections, each with a display equation followed by numeric substitution in SI (kg, m, N, rad/s, N·m). Results to 3 significant figures. Comparison lines end with a parenthetical label. No `await`, no `Math.random()`.

4. **TypeScript Model** — fenced `typescript` block. Functions only; no classes. Sample call lines as `//` comments below the function. Results annotated inline.

---

## Style Rules (carry forward from Part 7)

- No em-dashes in prose — use colons or semicolons
- No bullets in the Thesis paragraph
- All numeric results to 3 significant figures
- Annular disk inertia: `I = ½m(r_i² + r_o²)`
- Contact fractions: smash = cos(φ), recoil = sin(φ), where φ = contact face angle from radial
- Hertzian contact patch: `a = (3WR/4E*)^(1/3)`; `1/E* = (1−ν₁²)/E₁ + (1−ν₂²)/E₂`
- Spin decay: `dω/dt = −(μ × m × g × r_tip) / I_total`
- Material constants: zinc (E=100 GPa, ρ=6600 kg/m³), ABS (E=2.3 GPa, ρ=1050 kg/m³), PC (E=2.4 GPa, ρ=1200 kg/m³), rubber (E=0.002 GPa, ρ=1200 kg/m³)
- Symmetry labels: C₁ (no repeat), C₂ (180°), C₃ (120°), C₄ (90°), C₆ (60°)

---


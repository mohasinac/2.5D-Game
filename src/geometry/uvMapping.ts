import * as THREE from 'three';

/**
 * UV generation for procedurally-built geometry.
 *
 * Why this exists
 * ───────────────
 * Every mesh in `src/geometry/` was built with a `position` attribute and no
 * `uv` attribute. A `BufferGeometry` without UVs cannot sample a texture at
 * all, so all 13 `SurfaceType`s (checker, grid, hex, concrete, metal, wood,
 * ice, sand, lava_rock …) were silently dead on arenas, walls, bey sectors and
 * speed-line ribbons. `buildSurfaceMaterial` dutifully built and cached the
 * textures; nothing could ever display them. That single omission is the main
 * reason the project reads as "flat untextured plastic".
 *
 * Unit convention
 * ───────────────
 * 1 world unit = 1 cm (project-wide). UVs are emitted as **centimetres divided
 * by UV_REFERENCE_CM**, chosen so it composes with the existing material code:
 * `buildSurfaceMaterial` sets `tex.repeat = 20 / tileScale`, so
 *
 *     effective frequency = (cm / 20) × (20 / tileScale) = cm / tileScale
 *
 * i.e. **one texture repeat every `tileScale` centimetres**, which is what the
 * field name already implies. Changing UV_REFERENCE_CM here without changing
 * that `repeat` expression would silently rescale every texture in the project.
 *
 * Both `uv` and `uv1` are written. `aoMap` requires a second UV set, and Three
 * does not fall back to `uv` for it — an AO map on a geometry with only `uv`
 * renders black.
 */
export const UV_REFERENCE_CM = 20;

/** Writes the same array to `uv` and `uv1` (aoMap needs its own set). */
function setUV(geo: THREE.BufferGeometry, uvs: number[]): void {
  geo.setAttribute('uv',  new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('uv1', new THREE.Float32BufferAttribute(uvs.slice(), 2));
}

/**
 * Top-down planar projection: `u = x / REF`, `v = z / REF`.
 *
 * Correct for predominantly horizontal surfaces — bowl floors, arena top faces,
 * island caps, bridge decks, speed-line ribbons, scoop floors. Texture scale
 * stays uniform in world space regardless of opening shape (circle, ellipse or
 * polygon), and unlike a polar mapping there is no pinch singularity at the
 * bowl centre.
 *
 * Near-vertical faces (a bowl's outer skirt, a wall) get smeared by this
 * projection — use `applyCylindricalUV` or `applyTriplanarUV` for those.
 */
export function applyPlanarUV(geo: THREE.BufferGeometry): void {
  const p = geo.getAttribute('position');
  if (!p) return;
  const uvs: number[] = [];
  for (let i = 0; i < p.count; i++) {
    uvs.push(p.getX(i) / UV_REFERENCE_CM, p.getZ(i) / UV_REFERENCE_CM);
  }
  setUV(geo, uvs);
}

/**
 * Cylindrical projection about the Y axis: `u = arcLength / REF`, `v = y / REF`.
 *
 * For surfaces that wrap a vertical axis — rim walls, bey sector side faces,
 * frustum skirts. `u` uses arc length (`angle × radius`) rather than raw angle
 * so the texture keeps a constant world-space scale instead of stretching on
 * large-radius geometry and compressing on small.
 *
 * @param radiusForArc Radius used to convert angle to arc length. Defaults to
 *   each vertex's own distance from the axis, which is right for a cylinder.
 *   Pass a fixed value for a cone/frustum so the texture does not compress
 *   toward the narrow end.
 */
export function applyCylindricalUV(geo: THREE.BufferGeometry, radiusForArc?: number): void {
  const p = geo.getAttribute('position');
  if (!p) return;
  const uvs: number[] = [];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    // atan2 in [-PI, PI] -> [0, 1) so the seam lands at a single angle.
    const a = (Math.atan2(z, x) + Math.PI) / (Math.PI * 2);
    const r = radiusForArc ?? Math.hypot(x, z);
    uvs.push((a * Math.PI * 2 * r) / UV_REFERENCE_CM, y / UV_REFERENCE_CM);
  }
  setUV(geo, uvs);
}

/**
 * Triplanar projection: each vertex is projected along whichever axis its
 * normal points most strongly, so no face is ever smeared.
 *
 * For arbitrary closed shapes where no single projection works — obstacles and
 * footings (cube, cuboid, sphere, cylinder, pyramid, frustum), trap variant
 * meshes. Seams appear where the dominant axis changes, which is acceptable on
 * tiling/noise textures and is far less objectionable than the stretching a
 * single planar projection produces on vertical faces.
 *
 * Requires normals. Computes them if absent.
 */
export function applyTriplanarUV(geo: THREE.BufferGeometry): void {
  const p = geo.getAttribute('position');
  if (!p) return;
  if (!geo.getAttribute('normal')) geo.computeVertexNormals();
  const n = geo.getAttribute('normal');
  const uvs: number[] = [];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u: number, v: number;
    if (ay >= ax && ay >= az)      { u = x; v = z; }   // floor / ceiling
    else if (ax >= az)             { u = z; v = y; }   // facing +-X
    else                           { u = x; v = y; }   // facing +-Z
    uvs.push(u / UV_REFERENCE_CM, v / UV_REFERENCE_CM);
  }
  setUV(geo, uvs);
}

/**
 * Explicit per-vertex UVs, for builders that already know their own
 * parameterisation better than any projection can infer it.
 *
 * Used by the wall builder (u = distance along the wall arc, v = height up the
 * wall face) and the ribbon builder (u = distance along the path, v = across
 * the ribbon width). Both are strips where the natural parameterisation is
 * exact, so inferring UVs from position would be strictly worse.
 *
 * @param uvsCm Flat `[u0, v0, u1, v1, …]` in **centimetres**; divided by
 *   UV_REFERENCE_CM here so callers never repeat that conversion.
 */
export function applyExplicitUV(geo: THREE.BufferGeometry, uvsCm: number[]): void {
  const scaled = new Array<number>(uvsCm.length);
  for (let i = 0; i < uvsCm.length; i++) scaled[i] = uvsCm[i] / UV_REFERENCE_CM;
  setUV(geo, scaled);
}

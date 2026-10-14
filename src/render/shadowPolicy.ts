import * as THREE from 'three';

/**
 * One rule for "is this object a lit surface, or a diagram element?" — applied
 * at every scene-add site so shadows and tone mapping reach everything without
 * any builder having to know they exist.
 *
 * WHY A POLICY RATHER THAN PER-BUILDER FLAGS
 * ──────────────────────────────────────────
 * Shadow casting and tone mapping are *rendering* decisions. The 21 geometry
 * builders are pure (params -> BufferGeometry) by design (see the import-direction
 * rule in CLAUDE.md), and should not grow render-policy knowledge. There are
 * exactly two scene-add funnels in the project — `RenderManager.add()` for every
 * managed feature and `Sandbox.addToScene()` for arenas/pits/zones/the octagon
 * base — so hooking both covers the whole scene, including objects added long
 * after the renderer mounts.
 *
 * THE DIAGRAM-ELEMENT EXCLUSION IS NOT COSMETIC
 * ─────────────────────────────────────────────
 * `Material.toneMapped` defaults to **true** in Three r165, so enabling ACES
 * would silently desaturate every `LineSegments` edge, every axis/tick sprite,
 * the grid helpers and the accent origin marker — i.e. the exact cyan/orange
 * palette CLAUDE.md fixes as the project's look. Those are authored UI colours
 * that must survive the renderer's exposure curve unchanged, which is what
 * `toneMapped = false` means. Unlit materials are the signal: a Basic or custom
 * Shader material is something we authored the final pixel of, while a Standard
 * material is a surface we want the lighting to decide.
 */

/** Materials whose output is an authored colour, not a lighting result. */
function isUnlit(mat: THREE.Material): boolean {
  return (
    (mat as THREE.MeshBasicMaterial).isMeshBasicMaterial === true ||
    (mat as THREE.ShaderMaterial).isShaderMaterial === true ||
    (mat as THREE.SpriteMaterial).isSpriteMaterial === true ||
    (mat as THREE.LineBasicMaterial).isLineBasicMaterial === true ||
    (mat as THREE.PointsMaterial).isPointsMaterial === true
  );
}

/**
 * A see-through surface must not cast. A water zone fill or a glass wall casting
 * a hard opaque shadow is the single most obvious shadow artefact, and the stencil
 * -clipped zone fills (Sec. zone lids) would cast through their own lid.
 */
function isSeeThrough(mat: THREE.Material): boolean {
  return mat.transparent === true || mat.opacity < 1;
}

function materialsOf(obj: THREE.Object3D): THREE.Material[] {
  const mat = (obj as Partial<THREE.Mesh>).material;
  if (!mat) return [];
  return Array.isArray(mat) ? mat.filter(Boolean) : [mat];
}

/**
 * Apply the shadow + tone-mapping policy to `obj` and everything beneath it.
 *
 * Recurses, because bridge segment meshes live under `seg._animPivot` inside
 * `bridge.group` and wall meshes under `wall._rotatePivot` — both are registered
 * as a Group, so a non-recursive pass would miss every one of them.
 *
 * Idempotent: safe to call again on an object already processed (feature rebuilds
 * re-register through the same funnels).
 */
export function applyRenderPolicy(obj: THREE.Object3D): void {
  /* Lights are emitters, not geometry: on a Light, `castShadow` means "this
     light projects shadows", the opposite of what it means on a Mesh. Without
     this guard the diagram-element branch below clears it — which silently
     disabled the scene's only shadow-casting directional light, because a
     DirectionalLight has no material and so looked like a diagram element.
     Caught by `__demo.getRenderStats()` reporting shadowLights: 0. */
  if ((obj as THREE.Light).isLight === true) return;

  const mats = materialsOf(obj);
  const isMesh = (obj as Partial<THREE.Mesh>).isMesh === true;

  if (!isMesh || mats.length === 0 || mats.some(isUnlit)) {
    /* Diagram element — grid, axis, edge line, tick sprite, origin marker,
       particle Points, or an authored shader surface. Keep its colour exactly
       as written and keep it out of the shadow pass entirely. */
    obj.castShadow    = false;
    obj.receiveShadow = false;
    for (const m of mats) m.toneMapped = false;
  } else {
    /* A lit surface: bowl, wall, bridge deck, obstacle, trap pad, bey part. */
    obj.receiveShadow = true;
    obj.castShadow    = !mats.some(isSeeThrough);
  }

  for (const child of obj.children) applyRenderPolicy(child);
}

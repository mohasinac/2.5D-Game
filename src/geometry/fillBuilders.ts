import * as THREE from 'three';
import { ZONE_FILL_OFFSET } from '../config/arenaConstants';
import { ZoneData, WaveParams } from '../types/arenaTypes';
import { FILL_WAVE, zoneFillConfig } from './surfaceUtils';
import { shapePoints } from './surfaceUtils';

/* ══════════════════════════════════════════════════════════════════════════
   Zone fill builders.
   Responsible for: animated liquid surface shaders, fill geometry, and
   fill material creation. Changes here when a new fill type or shader
   effect is added.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Wave shader sources ─────────────────────────────────────────────────── */
const WAVE_VERT = /* glsl */`
  uniform float uTime, uAmplitude, uFrequency, uSpeed, uTurbulence;
  varying float vHeight;
  void main() {
    vec3 pos = position;
    float h = 0.0;
    if (uAmplitude > 0.0) {
      float r = length(pos.xz);
      float w1 = sin(r * uFrequency * 1.5 - uTime * uSpeed);
      float w2 = sin(pos.x * uFrequency + uTime * uSpeed * 0.7 + 1.5708)
               * cos(pos.z * uFrequency * 0.8 - uTime * uSpeed * 0.9);
      float w3 = sin(pos.x * uFrequency * 2.7 + pos.z * uFrequency * 2.0 + uTime * uSpeed * 2.1 + 0.785)
               * cos(pos.x * uFrequency * 1.8 - pos.z * uFrequency * 2.5 - uTime * uSpeed * 1.6 + 3.14);
      h = w1 * 0.45 + w2 * 0.35 + w3 * uTurbulence * 0.20;
      pos.y += uAmplitude * h;
    }
    vHeight = h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const WAVE_FRAG = /* glsl */`
  uniform vec3 uColor; uniform float uOpacity; uniform vec3 uEmissive; uniform float uEmissiveIntensity;
  varying float vHeight;
  void main() {
    float bright = 1.0 + vHeight * 0.22;
    vec3 col = uColor * bright + uEmissive * uEmissiveIntensity * (1.0 + vHeight * 0.4);
    gl_FragColor = vec4(clamp(col, 0.0, 2.0), uOpacity);
  }
`;

/* ── Fill material factory ───────────────────────────────────────────────── */
export function buildFillShaderMaterial(
  fc: { color: number; opacity: number; emissive: number; emissiveIntensity: number },
  wave: WaveParams,
  stencilRef = 0,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime:             { value: 0 },
      uAmplitude:        { value: wave.amplitude },
      uFrequency:        { value: wave.frequency },
      uSpeed:            { value: wave.speed },
      uTurbulence:       { value: wave.turbulence },
      uColor:            { value: new THREE.Color(fc.color) },
      uOpacity:          { value: fc.opacity },
      uEmissive:         { value: new THREE.Color(fc.emissive) },
      uEmissiveIntensity:{ value: fc.emissiveIntensity },
    },
    vertexShader: WAVE_VERT, fragmentShader: WAVE_FRAG,
    transparent: true, side: THREE.DoubleSide, depthWrite: false,
    stencilWrite: false,
    stencilRef,
    stencilFunc: stencilRef > 0 ? THREE.EqualStencilFunc : THREE.AlwaysStencilFunc,
  });
}

/* ── Fill disc geometry ──────────────────────────────────────────────────── */
/**
 * Flat polygon matching the zone opening outline.
 * Used for both the visible fill mesh and the stencil mask mesh.
 */
export function buildZoneFillGeo(zone: ZoneData): THREE.BufferGeometry {
  const outerPts = shapePoints(zone);
  const shape = new THREE.Shape(outerPts.map(p => new THREE.Vector2(p.x, p.y)));
  if (zone.isMoat) {
    const innerPts = shapePoints({
      openingShape: zone.innerOpeningShape,
      radiusX: zone.innerRadiusX, radiusZ: zone.innerRadiusZ,
      sides: zone.innerSides, starInner: zone.innerStarInner,
    });
    shape.holes.push(new THREE.Path(innerPts.map(p => new THREE.Vector2(p.x, p.y))));
  }
  const geo = new THREE.ShapeGeometry(shape, 32);
  geo.rotateX(Math.PI / 2);
  return geo;
}

/* ── Fill Y constant ────────────────────────────────────────────────────────
   Fill is ZONE_FILL_OFFSET cm below the zone rim — appears as liquid pooling
   at the surface. Exported so callers compute fillY identically.
────────────────────────────────────────────────────────────────────────── */
export function computeFillY(surfFn: (alx: number, alz: number) => number, cx: number, cz: number): number {
  return surfFn(cx, cz) + ZONE_FILL_OFFSET;
}

/* Re-export so callers don't need to import from surfaceUtils */
export { FILL_WAVE, zoneFillConfig };

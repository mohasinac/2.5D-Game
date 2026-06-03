import * as THREE from 'three';
import { Sandbox, SandboxOptions } from './Sandbox';
import { gameConfirm } from '../utils/dialog';

/* ── Constants ───────────────────────────────────────────────────────────── */
const TWO_PI = Math.PI * 2;
const APOTHEM = 100;
const DEG2RAD = Math.PI / 180;

export const OCTAGON_BASE = {
  radius: APOTHEM / Math.cos(Math.PI / 8),
  height: 30, sides: 8, align: Math.PI / 8,
};

/* ── Opening shape / wall profile types ─────────────────────────────────── */
type OpeningShape = 'circle' | 'ellipse' | 'rectangle' | 'hexagon' | 'triangle' | 'star';
type WallProfile  = 'parabolic' | 'straight';

const SHAPE_LABEL: Record<OpeningShape, string> = {
  circle: 'Circle', ellipse: 'Ellipse', rectangle: 'Rect',
  hexagon: 'Hexagon', triangle: 'Triangle', star: 'Star',
};
const SHAPE_ICON: Record<OpeningShape, string> = {
  circle: '●', ellipse: '◯', rectangle: '▭',
  hexagon: '⬡', triangle: '△', star: '★',
};

/* ── Surface material system ─────────────────────────────────────────────── */
type SurfaceType =
  | 'plain' | 'checker' | 'grid' | 'hex' | 'stripes' | 'dots'
  | 'concrete' | 'metal' | 'wood' | 'ice' | 'sand' | 'lava_rock' | 'custom_png';

const SURFACE_LABEL: Record<SurfaceType, string> = {
  plain: 'Plain', checker: 'Checker', grid: 'Grid', hex: 'Hex',
  stripes: 'Stripes', dots: 'Dots', concrete: 'Concrete', metal: 'Metal',
  wood: 'Wood', ice: 'Ice', sand: 'Sand', lava_rock: 'Lava', custom_png: 'Custom',
};

interface SurfaceMaterialOpts {
  color:           number;
  surface:         SurfaceType;
  customTileData?: string | null;
  tileScale:       number;
  transparent?:    boolean;
  opacity?:        number;
}

/* Module-level caches — textures and materials are reused across surfaces */
const _texCache = new Map<string, { tex: THREE.Texture; refs: number }>();
const _matCache = new Map<string, { mat: THREE.MeshStandardMaterial; refs: number }>();

function _texKey(opts: SurfaceMaterialOpts): string {
  if (opts.surface === 'custom_png' && opts.customTileData) {
    // Use first 40 chars of data URL as a fingerprint key
    return `custom:${opts.customTileData.slice(0, 40)}:${opts.tileScale}`;
  }
  return `${opts.color}_${opts.surface}`;
}
function _matKey(opts: SurfaceMaterialOpts): string {
  return `${_texKey(opts)}:${opts.transparent ? 't' : 'o'}:${opts.opacity ?? 1}`;
}

/** Paint a 256×256 canvas with the requested surface pattern. */
function _paintCanvas(color: number, surface: SurfaceType): HTMLCanvasElement {
  const C = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = C;
  const ctx = cv.getContext('2d')!;

  const r = (color >> 16) & 0xff;
  const g = (color >>  8) & 0xff;
  const b =  color        & 0xff;
  const base = `rgb(${r},${g},${b})`;

  const lighter = `rgba(${Math.min(r + 64, 255)},${Math.min(g + 64, 255)},${Math.min(b + 64, 255)},0.55)`;
  const darker  = `rgba(${Math.max(r - 50, 0)},${Math.max(g - 50, 0)},${Math.max(b - 50, 0)},0.60)`;

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, C, C);

  switch (surface) {
    case 'checker': {
      const sz = 32;
      ctx.fillStyle = lighter;
      for (let x = 0; x < C; x += sz)
        for (let y = 0; y < C; y += sz)
          if (((x / sz) + (y / sz)) % 2 === 0) ctx.fillRect(x, y, sz, sz);
      break;
    }
    case 'grid': {
      ctx.strokeStyle = lighter; ctx.lineWidth = 2;
      for (let i = 0; i <= C; i += 32) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, C); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(C, i); ctx.stroke();
      }
      break;
    }
    case 'hex': {
      const sz = 28; const h = sz * Math.sqrt(3) / 2;
      ctx.strokeStyle = lighter; ctx.lineWidth = 2;
      for (let row = -1; row < C / h + 1; row++) {
        for (let col = -1; col < C / sz + 1; col++) {
          const cx = col * sz * 1.5 + (row % 2) * sz * 0.75;
          const cy = row * h;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i * 60 - 30) * DEG2RAD;
            const px = cx + sz / 2 * Math.cos(a); const py = cy + sz / 2 * Math.sin(a);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath(); ctx.stroke();
        }
      }
      break;
    }
    case 'stripes': {
      ctx.strokeStyle = lighter; ctx.lineWidth = 10;
      for (let i = -C; i < C * 2; i += 24) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + C, C); ctx.stroke();
      }
      break;
    }
    case 'dots': {
      ctx.fillStyle = lighter;
      for (let x = 16; x < C; x += 32)
        for (let y = 16; y < C; y += 32) {
          ctx.beginPath(); ctx.arc(x, y, 6, 0, TWO_PI); ctx.fill();
        }
      break;
    }
    case 'concrete': {
      // Noise-like stipple
      ctx.fillStyle = lighter;
      const rng = () => Math.random();
      for (let i = 0; i < 1800; i++) {
        const px = rng() * C; const py = rng() * C; const sz2 = rng() * 5 + 1;
        ctx.fillRect(px, py, sz2, sz2 * 0.4);
      }
      break;
    }
    case 'metal': {
      // Brushed horizontal stripes
      for (let y = 0; y < C; y += 3) {
        const alpha = Math.random() * 0.15;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(0, y, C, 2);
      }
      break;
    }
    case 'wood': {
      // Concentric ring grain
      for (let i = 8; i < C; i += 14) {
        ctx.strokeStyle = darker; ctx.lineWidth = 3 + (i % 3);
        ctx.beginPath(); ctx.arc(C / 2, C / 2, i, 0, TWO_PI); ctx.stroke();
      }
      break;
    }
    case 'ice': {
      // Fractal-like crack lines
      ctx.strokeStyle = lighter; ctx.lineWidth = 1.5;
      const cracks = [[50, 0, 180, 200], [200, 30, 60, 220], [120, 80, 240, 180],
        [0, 120, 160, 256], [80, 180, 250, 40]] as [number, number, number, number][];
      for (const [x0, y0, x1, y1] of cracks) {
        ctx.beginPath(); ctx.moveTo(x0, y0);
        ctx.lineTo((x0 + x1) / 2 + (Math.random() - 0.5) * 40, (y0 + y1) / 2 + (Math.random() - 0.5) * 40);
        ctx.lineTo(x1, y1); ctx.stroke();
      }
      break;
    }
    case 'sand': {
      ctx.fillStyle = lighter;
      for (let i = 0; i < 3000; i++) {
        const px = Math.random() * C; const py = Math.random() * C;
        ctx.fillRect(px, py, 1.5, 1.5);
      }
      break;
    }
    case 'lava_rock': {
      // Voronoi-like blobs
      const centres: [number, number][] = [];
      for (let i = 0; i < 25; i++) centres.push([Math.random() * C, Math.random() * C]);
      const imgData = ctx.getImageData(0, 0, C, C);
      for (let py = 0; py < C; py++) {
        for (let px = 0; px < C; px++) {
          let minD = Infinity; let nearest = 0;
          for (let ci = 0; ci < centres.length; ci++) {
            const d = (px - centres[ci][0]) ** 2 + (py - centres[ci][1]) ** 2;
            if (d < minD) { minD = d; nearest = ci; }
          }
          const t = (nearest % 2 === 0) ? 0.85 : 1.0;
          const idx = (py * C + px) * 4;
          imgData.data[idx]     = Math.round(r * t);
          imgData.data[idx + 1] = Math.round(g * t);
          imgData.data[idx + 2] = Math.round(b * t);
          imgData.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      break;
    }
    default: break; // 'plain' — solid fill already done
  }
  return cv;
}

function buildSurfaceMaterial(opts: SurfaceMaterialOpts): THREE.MeshStandardMaterial {
  const mk = _matKey(opts);
  const cached = _matCache.get(mk);
  if (cached) { cached.refs++; return cached.mat; }

  let map: THREE.Texture | null = null;
  if (opts.surface !== 'plain') {
    const tk = _texKey(opts);
    const ct = _texCache.get(tk);
    if (ct) {
      ct.refs++; map = ct.tex;
    } else {
      let tex: THREE.Texture;
      if (opts.surface === 'custom_png' && opts.customTileData) {
        tex = new THREE.TextureLoader().load(opts.customTileData);
      } else {
        const cv = _paintCanvas(opts.color, opts.surface);
        tex = new THREE.CanvasTexture(cv);
      }
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(20 / opts.tileScale, 20 / opts.tileScale);
      _texCache.set(tk, { tex, refs: 1 });
      map = tex;
    }
  }

  const roughness = opts.surface === 'metal' ? 0.25 : opts.surface === 'ice' ? 0.10 : 0.65;
  const metalness = opts.surface === 'metal' ? 0.70 : opts.surface === 'ice' ? 0.10 : 0.08;

  const mat = new THREE.MeshStandardMaterial({
    color: opts.surface === 'plain' ? opts.color : 0xffffff,
    map: map ?? undefined,
    side: THREE.DoubleSide,
    roughness,
    metalness,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
  });
  _matCache.set(mk, { mat, refs: 1 });
  return mat;
}

function releaseMaterial(opts: SurfaceMaterialOpts): void {
  const mk = _matKey(opts);
  const mc = _matCache.get(mk);
  if (!mc) return;
  mc.refs--;
  if (mc.refs <= 0) {
    mc.mat.dispose();
    _matCache.delete(mk);
    const tk = _texKey(opts);
    const tc = _texCache.get(tk);
    if (tc) {
      tc.refs--;
      if (tc.refs <= 0) { tc.tex.dispose(); _texCache.delete(tk); }
    }
  }
}

/* ── Zone fill system ────────────────────────────────────────────────────── */
type ZoneFill = 'water' | 'lava' | 'swamp' | 'poison' | 'sand' | 'ice' | 'void' | 'custom';

interface FillPreset { color: number; opacity: number; emissive: number; emissiveIntensity: number; glowColor: number | null; }
const FILL_PRESET: Record<ZoneFill, FillPreset> = {
  water:  { color: 0x1a7fd4, opacity: 0.65, emissive: 0x0044ff, emissiveIntensity: 0.08, glowColor: 0x3399ff },
  lava:   { color: 0xff3300, opacity: 0.80, emissive: 0xff2200, emissiveIntensity: 0.35, glowColor: 0xff6600 },
  swamp:  { color: 0x3d5c1a, opacity: 0.75, emissive: 0x224400, emissiveIntensity: 0.05, glowColor: 0x335500 },
  poison: { color: 0x8800cc, opacity: 0.70, emissive: 0x6600aa, emissiveIntensity: 0.15, glowColor: 0xaa00ff },
  sand:   { color: 0xd4a843, opacity: 0.85, emissive: 0x000000, emissiveIntensity: 0.00, glowColor: null },
  ice:    { color: 0xaaddff, opacity: 0.60, emissive: 0x88ccff, emissiveIntensity: 0.08, glowColor: 0xaaddff },
  void:   { color: 0x000000, opacity: 1.00, emissive: 0x000000, emissiveIntensity: 0.00, glowColor: null },
  custom: { color: 0xffffff, opacity: 0.70, emissive: 0x000000, emissiveIntensity: 0.00, glowColor: null },
};
const FILL_LABEL: Record<ZoneFill, string> = {
  water: '💧 Water', lava: '🔥 Lava', swamp: '🌿 Swamp', poison: '☠ Poison',
  sand: '🏜 Sand', ice: '❄ Ice', void: '🌑 Void', custom: '🎨 Custom',
};

/* ── Wave / ripple parameters per fill type ──────────────────────────────── */
interface WaveParams { amplitude: number; frequency: number; speed: number; turbulence: number; }
const FILL_WAVE: Record<ZoneFill, WaveParams> = {
  water:  { amplitude: 0.25, frequency: 0.10, speed: 1.20, turbulence: 0.15 },
  lava:   { amplitude: 0.60, frequency: 0.04, speed: 0.20, turbulence: 0.80 },
  swamp:  { amplitude: 0.18, frequency: 0.05, speed: 0.25, turbulence: 0.50 },
  poison: { amplitude: 0.35, frequency: 0.13, speed: 1.60, turbulence: 0.65 },
  sand:   { amplitude: 0.00, frequency: 0.00, speed: 0.00, turbulence: 0.00 },
  ice:    { amplitude: 0.00, frequency: 0.00, speed: 0.00, turbulence: 0.00 },
  void:   { amplitude: 0.00, frequency: 0.00, speed: 0.00, turbulence: 0.00 },
  custom: { amplitude: 0.20, frequency: 0.08, speed: 0.80, turbulence: 0.30 },
};

/* Multi-octave sine wave vertex + fragment shaders for liquid fill surfaces.
   Phasing (different spatial offsets per harmonic) creates complex interference
   patterns that simulate viscosity — high-turbulence fill types add a third
   high-frequency chaotic harmonic. */
const WAVE_VERT = /* glsl */`
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uSpeed;
  uniform float uTurbulence;
  varying float vHeight;

  void main() {
    vec3 pos = position;
    float h = 0.0;
    if (uAmplitude > 0.0) {
      float f  = uFrequency;
      float sp = uSpeed;
      // Primary ripple — radial outward wave
      float r = length(pos.xz);
      float w1 = sin(r * f * 1.5 - uTime * sp);
      // Secondary cross-wave with phase offset π/2
      float w2 = sin(pos.x * f + uTime * sp * 0.7 + 1.5708)
               * cos(pos.z * f * 0.8 - uTime * sp * 0.9);
      // Tertiary harmonic (contributes via turbulence)
      float w3 = sin(pos.x * f * 2.7 + pos.z * f * 2.0 + uTime * sp * 2.1 + 0.785)
               * cos(pos.x * f * 1.8 - pos.z * f * 2.5 - uTime * sp * 1.6 + 3.14);
      h = w1 * 0.45 + w2 * 0.35 + w3 * uTurbulence * 0.20;
      pos.y += uAmplitude * h;
    }
    vHeight = h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const WAVE_FRAG = /* glsl */`
  uniform vec3  uColor;
  uniform float uOpacity;
  uniform vec3  uEmissive;
  uniform float uEmissiveIntensity;
  varying float vHeight;

  void main() {
    float bright = 1.0 + vHeight * 0.22;
    vec3 col = uColor * bright + uEmissive * uEmissiveIntensity * (1.0 + vHeight * 0.4);
    gl_FragColor = vec4(clamp(col, 0.0, 2.0), uOpacity);
  }
`;

/* ── Data model ──────────────────────────────────────────────────────────── */
interface ShapeParams {
  openingShape: OpeningShape; radiusX: number; radiusZ: number; sides: number; starInner: number;
}

interface ArenaData {
  name: string;
  openingShape: OpeningShape;
  wallProfile:  WallProfile;
  radiusX:      number;
  radiusZ:      number;
  depth:        number;
  sides:        number;
  starInner:    number;
  color:        number;
  surface:      SurfaceType;
  customTileData: string | null;
  tileScale:    number;
  posX:         number;
  posZ:         number;
  rotY:         number;
  // Moat fields
  isMoat:       boolean;
  innerRadiusX: number;
  innerRadiusZ: number;
  // Child IDs
  pitIds:       string[];
  zoneIds:      string[];
  // Three.js objects
  mesh:         THREE.Mesh;
  edges:        THREE.LineSegments;
  floorMesh:    THREE.Mesh | null;   // straight-wall arena only
  islandMesh:   THREE.Mesh | null;   // moat only
}

interface PitData {
  id:            string;
  name:          string;
  parentArenaId: string;
  openingShape:  OpeningShape;
  wallProfile:   WallProfile;
  radiusX:       number;
  radiusZ:       number;
  sides:         number;
  starInner:     number;
  depth:         number;
  color:         number;
  surface:       SurfaceType;
  customTileData: string | null;
  tileScale:     number;
  posR:          number;   // radial distance from arena centre (cm)
  posAngle:      number;   // degrees [0..360)
  rotY:          number;   // shape self-rotation, degrees
  isMoat:        boolean;
  innerRadiusX:  number;
  innerRadiusZ:  number;
  mesh:          THREE.Mesh;
  edges:         THREE.LineSegments;
}

interface ZoneData {
  id:            string;
  name:          string;
  parentArenaId: string;
  openingShape:  OpeningShape;
  radiusX:       number;
  radiusZ:       number;
  sides:         number;
  starInner:     number;
  depth:         number;
  color:         number;
  surface:       SurfaceType;
  customTileData: string | null;
  tileScale:     number;
  fill:          ZoneFill;
  fillColor:     number | null;
  fillOpacity:   number;
  fillGlow:      boolean;
  posR:          number;
  posAngle:      number;
  rotY:          number;
  isMoat:        boolean;
  innerRadiusX:  number;
  innerRadiusZ:  number;
  mesh:          THREE.Mesh;
  edges:         THREE.LineSegments;
  fillMesh:      THREE.Mesh;
  fillLight:     THREE.PointLight | null;
}

/* ── LocalStorage schema v2 ──────────────────────────────────────────────── */
interface ArenaSave {
  id: string; name: string;
  openingShape: OpeningShape; wallProfile: WallProfile;
  radiusX: number; radiusZ: number; depth: number; sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  posX: number; posZ: number; rotY: number;
  isMoat: boolean; innerRadiusX: number; innerRadiusZ: number;
  pits:  PitSave[];
  zones: ZoneSave[];
}
interface PitSave {
  id: string; name: string;
  openingShape: OpeningShape; wallProfile: WallProfile;
  radiusX: number; radiusZ: number; depth: number; sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  posR: number; posAngle: number; rotY: number;
  isMoat: boolean; innerRadiusX: number; innerRadiusZ: number;
}
interface ZoneSave {
  id: string; name: string;
  openingShape: OpeningShape;
  radiusX: number; radiusZ: number; depth: number; sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  fill: ZoneFill; fillColor: number | null; fillOpacity: number; fillGlow: boolean;
  posR: number; posAngle: number; rotY: number;
  isMoat: boolean; innerRadiusX: number; innerRadiusZ: number;
}
interface ArenaConfig {
  version:    2;
  baseConfig: { height: number; sides: number; color: number; surface: SurfaceType; customTileData: string | null; tileScale: number };
  arenas:     ArenaSave[];
  arenaSeq:   number;
  pitSeq:     number;
  zoneSeq:    number;
}

function defaultArena(name: string): ArenaData {
  return {
    name, openingShape: 'circle', wallProfile: 'parabolic',
    radiusX: 50, radiusZ: 50, depth: 20,
    sides: 5, starInner: 0.5, color: 0x888888,
    surface: 'plain', customTileData: null, tileScale: 20,
    posX: 0, posZ: 0, rotY: 0,
    isMoat: false, innerRadiusX: 25, innerRadiusZ: 25,
    pitIds: [], zoneIds: [],
    mesh:  null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    floorMesh:  null,
    islandMesh: null,
  };
}

function defaultPit(name: string, parentArenaId: string, id: string): PitData {
  return {
    id, name, parentArenaId,
    openingShape: 'circle', wallProfile: 'straight',
    radiusX: 10, radiusZ: 10, depth: 8,
    sides: 5, starInner: 0.5, color: 0x555555,
    surface: 'plain', customTileData: null, tileScale: 10,
    posR: 0, posAngle: 0, rotY: 0,
    isMoat: false, innerRadiusX: 5, innerRadiusZ: 5,
    mesh:  null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
  };
}

function defaultZone(name: string, parentArenaId: string, id: string): ZoneData {
  return {
    id, name, parentArenaId,
    openingShape: 'circle',
    radiusX: 15, radiusZ: 15, depth: 8,
    sides: 5, starInner: 0.5, color: 0x336699,
    surface: 'plain', customTileData: null, tileScale: 10,
    fill: 'water', fillColor: null, fillOpacity: 0.65, fillGlow: true,
    posR: 0, posAngle: 0, rotY: 0,
    isMoat: false, innerRadiusX: 8, innerRadiusZ: 8,
    mesh:  null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    fillMesh:  null as unknown as THREE.Mesh,
    fillLight: null,
  };
}

/* ── 2-D opening shape points ────────────────────────────────────────────── */
function shapePoints(data: ShapeParams): THREE.Vector2[] {
  const { radiusX: rx, radiusZ: rz, openingShape, sides, starInner } = data;
  const pts: THREE.Vector2[] = [];
  switch (openingShape) {
    case 'circle':
    case 'ellipse': {
      const N = 48;
      for (let i = 0; i < N; i++) {
        const θ = (i / N) * TWO_PI;
        pts.push(new THREE.Vector2(rx * Math.cos(θ), rz * Math.sin(θ)));
      }
      break;
    }
    case 'rectangle':
      pts.push(
        new THREE.Vector2( rx,  rz), new THREE.Vector2(-rx,  rz),
        new THREE.Vector2(-rx, -rz), new THREE.Vector2( rx, -rz),
      );
      break;
    case 'hexagon':
      for (let i = 0; i < 6; i++) {
        const θ = (i / 6) * TWO_PI + Math.PI / 6;
        pts.push(new THREE.Vector2(rx * Math.cos(θ), rz * Math.sin(θ)));
      }
      break;
    case 'triangle':
      for (let i = 0; i < 3; i++) {
        const θ = (i / 3) * TWO_PI - Math.PI / 2;
        pts.push(new THREE.Vector2(rx * Math.cos(θ), rz * Math.sin(θ)));
      }
      break;
    case 'star': {
      const n = Math.max(3, Math.min(12, Math.round(sides)));
      const inner = Math.max(0.1, Math.min(0.95, starInner));
      for (let i = 0; i < n * 2; i++) {
        const θ = (i / (n * 2)) * TWO_PI - Math.PI / 2;
        const r = i % 2 === 0 ? 1 : inner;
        pts.push(new THREE.Vector2(rx * r * Math.cos(θ), rz * r * Math.sin(θ)));
      }
      break;
    }
  }
  return pts;
}

/* ── Geometry builders ───────────────────────────────────────────────────── */

/** Parabolic bowl: opening at y=baseY, deepest at y=baseY−depth. */
function buildParabolicBowl(pts: THREE.Vector2[], depth: number, baseY = OCTAGON_BASE.height): THREE.BufferGeometry {
  const N = pts.length; const RINGS = 24;
  const pos: number[] = []; const idx: number[] = [];
  pos.push(0, baseY - depth, 0);
  for (let r = 1; r <= RINGS; r++) {
    const t = r / RINGS; const y = baseY - depth * (1 - t * t);
    for (let i = 0; i < N; i++) pos.push(pts[i].x * t, y, pts[i].y * t);
  }
  for (let i = 0; i < N; i++) idx.push(0, 1 + (i + 1) % N, 1 + i);
  for (let r = 1; r < RINGS; r++) {
    const b0 = 1 + (r - 1) * N; const b1 = 1 + r * N;
    for (let i = 0; i < N; i++) {
      const a0 = b0 + i; const c0 = b0 + (i + 1) % N;
      const a1 = b1 + i; const c1 = b1 + (i + 1) % N;
      idx.push(a0, c0, a1, c0, c1, a1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

/** Straight-wall extrusion: vertical sides + flat floor. */
function buildStraightCut(pts: THREE.Vector2[], depth: number, baseY = OCTAGON_BASE.height): THREE.BufferGeometry {
  const N = pts.length;
  const pos: number[] = []; const idx: number[] = [];
  for (const p of pts) pos.push(p.x, baseY, p.y);
  for (const p of pts) pos.push(p.x, baseY - depth, p.y);
  pos.push(0, baseY - depth, 0);
  for (let i = 0; i < N; i++) {
    const t0 = i; const t1 = (i + 1) % N; const b0 = N + i; const b1 = N + (i + 1) % N;
    idx.push(t0, t1, b0, t1, b1, b0);
  }
  for (let i = 0; i < N; i++) idx.push(2 * N, N + (i + 1) % N, N + i);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

/** Edge lines: opening rim + depth guides. */
function buildEdgeLines(pts: THREE.Vector2[], depth: number, profile: WallProfile, baseY = OCTAGON_BASE.height): THREE.BufferGeometry {
  const N = pts.length; const v: number[] = [];
  for (let i = 0; i < N; i++) {
    const a = pts[i]; const b = pts[(i + 1) % N];
    v.push(a.x, baseY, a.y, b.x, baseY, b.y);
  }
  if (profile === 'parabolic') {
    const step = Math.max(1, Math.floor(N / 8));
    for (let i = 0; i < N; i += step) {
      for (let s = 0; s < 12; s++) {
        const t0 = s / 12; const t1 = (s + 1) / 12;
        const y0 = baseY - depth * (1 - t0 * t0); const y1 = baseY - depth * (1 - t1 * t1);
        v.push(pts[i].x * t0, y0, pts[i].y * t0, pts[i].x * t1, y1, pts[i].y * t1);
      }
    }
  } else {
    for (let i = 0; i < N; i++) {
      const a = pts[i]; const b = pts[(i + 1) % N];
      v.push(a.x, baseY - depth, a.y, b.x, baseY - depth, b.y);
    }
    const step = Math.max(1, Math.floor(N / 8));
    for (let i = 0; i < N; i += step)
      v.push(pts[i].x, baseY, pts[i].y, pts[i].x, baseY - depth, pts[i].y);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

/**
 * Moat parabolic bowl: ring channel.
 * Both rims (outer and inner) sit at baseY; valley sits at baseY−depth at the midpoint.
 * Uses a single strip of rings that linearly lerps position between outerPts and innerPts,
 * with depth driven by the inverted parabola:  depth * 4 * b * (1−b)  where b ∈ [0,1].
 */
function buildMoatParabolicBowl(
  outerPts: THREE.Vector2[], innerPts: THREE.Vector2[],
  depth: number, baseY = OCTAGON_BASE.height,
): THREE.BufferGeometry {
  const N = outerPts.length; const RINGS = 32;
  const pos: number[] = []; const idx: number[] = [];

  for (let r = 0; r <= RINGS; r++) {
    const b = r / RINGS;                         // 0 = outer rim, 1 = inner rim
    const y = baseY - depth * 4 * b * (1 - b);  // deepest at b=0.5
    for (let i = 0; i < N; i++) {
      pos.push(
        outerPts[i].x + (innerPts[i].x - outerPts[i].x) * b,
        y,
        outerPts[i].y + (innerPts[i].y - outerPts[i].y) * b,
      );
    }
  }

  for (let r = 0; r < RINGS; r++) {
    const b0 = r * N; const b1 = (r + 1) * N;
    for (let i = 0; i < N; i++) {
      const a0 = b0 + i; const c0 = b0 + (i + 1) % N;
      const a1 = b1 + i; const c1 = b1 + (i + 1) % N;
      idx.push(a0, c0, a1, c0, c1, a1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

/** Moat straight walls: outer walls down + ring floor + inner walls up. */
function buildMoatStraightWalls(
  outerPts: THREE.Vector2[], innerPts: THREE.Vector2[],
  depth: number, baseY = OCTAGON_BASE.height,
): THREE.BufferGeometry {
  const N = outerPts.length; const floorY = baseY - depth;
  const pos: number[] = []; const idx: number[] = [];

  // Outer top ring
  for (const p of outerPts) pos.push(p.x, baseY, p.y);
  // Outer bottom ring
  for (const p of outerPts) pos.push(p.x, floorY, p.y);
  // Inner bottom ring
  for (const p of innerPts) pos.push(p.x, floorY, p.y);
  // Inner top ring
  for (const p of innerPts) pos.push(p.x, baseY, p.y);

  // Outer walls (top to bottom)
  for (let i = 0; i < N; i++) {
    const t0 = i; const t1 = (i + 1) % N; const b0 = N + i; const b1 = N + (i + 1) % N;
    idx.push(t0, t1, b0, t1, b1, b0);
  }
  // Floor ring (outer bottom to inner bottom)
  for (let i = 0; i < N; i++) {
    const o0 = N + i; const o1 = N + (i + 1) % N;
    const ii0 = 2 * N + i; const ii1 = 2 * N + (i + 1) % N;
    idx.push(o0, o1, ii0, o1, ii1, ii0);
  }
  // Inner walls (bottom to top)
  for (let i = 0; i < N; i++) {
    const b0 = 2 * N + i; const b1 = 2 * N + (i + 1) % N;
    const t0 = 3 * N + i; const t1 = 3 * N + (i + 1) % N;
    idx.push(b0, b1, t0, b1, t1, t0);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

/** Edge lines for moat shapes. */
function buildMoatEdgeLines(
  outerPts: THREE.Vector2[], innerPts: THREE.Vector2[],
  depth: number, baseY = OCTAGON_BASE.height,
): THREE.BufferGeometry {
  const N = outerPts.length; const v: number[] = [];
  for (let i = 0; i < N; i++) {
    const a = outerPts[i]; const b = outerPts[(i + 1) % N];
    v.push(a.x, baseY, a.y, b.x, baseY, b.y);
    v.push(a.x, baseY - depth, a.y, b.x, baseY - depth, b.y);
    v.push(a.x, baseY, a.y, a.x, baseY - depth, a.y);
  }
  for (let i = 0; i < N; i++) {
    const a = innerPts[i]; const b = innerPts[(i + 1) % N];
    v.push(a.x, baseY, a.y, b.x, baseY, b.y);
    v.push(a.x, baseY - depth, a.y, b.x, baseY - depth, b.y);
    v.push(a.x, baseY, a.y, a.x, baseY - depth, a.y);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

/**
 * Top face of the base — polygon with actual voids for each arena opening.
 * ShapeGeometry lives in XY; after rotateX(PI/2) + translate(0,H,0):
 *   shapeX → worldX, shapeY → worldZ, flat at worldY = H.
 */
function buildTopFaceGeo(
  baseSides: number, baseRadius: number, align: number,
  baseHeight: number, arenas: ArenaData[],
): THREE.BufferGeometry {
  const outerPts: THREE.Vector2[] = [];
  for (let i = 0; i < baseSides; i++) {
    const a = (i / baseSides) * TWO_PI + align;
    outerPts.push(new THREE.Vector2(baseRadius * Math.cos(a), baseRadius * Math.sin(a)));
  }
  const shape = new THREE.Shape(outerPts);

  for (const arena of arenas) {
    const local = shapePoints(arena);
    const cos = Math.cos(arena.rotY); const sin = Math.sin(arena.rotY);
    const holePts = local.map(p => new THREE.Vector2(
      p.x * cos - p.y * sin + arena.posX,
      p.x * sin + p.y * cos + arena.posZ,
    )).reverse();
    shape.holes.push(new THREE.Path(holePts));
    // For moat: add island cap instead of a second hole — handled separately
  }

  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(Math.PI / 2);
  geo.translate(0, baseHeight, 0);
  return geo;
}

/** Flat arena floor cap for straight-wall arenas, with pit/zone holes. */
function buildArenaFloorGeo(arena: ArenaData, pits: PitData[], zones: ZoneData[]): THREE.BufferGeometry {
  const H = OCTAGON_BASE.height;
  const floorY = H - arena.depth;
  const outerLocal = shapePoints(arena);
  const cosA = Math.cos(arena.rotY); const sinA = Math.sin(arena.rotY);
  const outerShape2D = outerLocal.map(p => new THREE.Vector2(
    p.x * cosA - p.y * sinA, p.x * sinA + p.y * cosA,
  ));
  const floorShape = new THREE.Shape(outerShape2D);

  // Punch holes for each pit/zone that sits inside this arena
  const allChildren: { params: ShapeParams; posR: number; posAngle: number; rotY: number }[] = [
    ...pits.map(p => ({ params: p as ShapeParams, posR: p.posR, posAngle: p.posAngle, rotY: p.rotY })),
    ...zones.map(z => ({ params: z as ShapeParams, posR: z.posR, posAngle: z.posAngle, rotY: z.rotY })),
  ];
  for (const child of allChildren) {
    const childLocal = shapePoints(child.params);
    const localX = child.posR * Math.cos(child.posAngle * DEG2RAD);
    const localZ = child.posR * Math.sin(child.posAngle * DEG2RAD);
    const worldOffX = localX * cosA - localZ * sinA;
    const worldOffZ = localX * sinA + localZ * cosA;
    const cosC = Math.cos(child.rotY * DEG2RAD); const sinC = Math.sin(child.rotY * DEG2RAD);
    const holePts = childLocal.map(p => new THREE.Vector2(
      p.x * cosC - p.y * sinC + worldOffX,
      p.x * sinC + p.y * cosC + worldOffZ,
    )).reverse();
    floorShape.holes.push(new THREE.Path(holePts));
  }

  const geo = new THREE.ShapeGeometry(floorShape);
  geo.rotateX(Math.PI / 2);
  geo.translate(0, floorY, 0);
  return geo;
}

/** Island cap for moat arenas: flat disc at y=H matching inner boundary. */
function buildIslandCapGeo(arena: ArenaData): THREE.BufferGeometry {
  const H = OCTAGON_BASE.height;
  const innerParams: ShapeParams = {
    openingShape: arena.openingShape, radiusX: arena.innerRadiusX, radiusZ: arena.innerRadiusZ,
    sides: arena.sides, starInner: arena.starInner,
  };
  const innerPts = shapePoints(innerParams);
  const shape = new THREE.Shape(innerPts);
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(Math.PI / 2);
  geo.translate(0, H, 0);
  return geo;
}

/** Tessellated disc for zone liquid surface — sufficient vertex density for wave displacement. */
function buildZoneFillGeo(zone: { radiusX: number; radiusZ: number }): THREE.BufferGeometry {
  const r = Math.min(zone.radiusX, zone.radiusZ) * 0.93;
  const geo = new THREE.CircleGeometry(r, 64, 20);
  geo.rotateX(-Math.PI / 2); // XY → XZ, flat on ground
  return geo;
}

function buildFillShaderMaterial(fc: { color: number; opacity: number; emissive: number; emissiveIntensity: number }, wave: WaveParams): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime:              { value: 0 },
      uAmplitude:         { value: wave.amplitude },
      uFrequency:         { value: wave.frequency },
      uSpeed:             { value: wave.speed },
      uTurbulence:        { value: wave.turbulence },
      uColor:             { value: new THREE.Color(fc.color) },
      uOpacity:           { value: fc.opacity },
      uEmissive:          { value: new THREE.Color(fc.emissive) },
      uEmissiveIntensity: { value: fc.emissiveIntensity },
    },
    vertexShader:   WAVE_VERT,
    fragmentShader: WAVE_FRAG,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

/* ── Arena world-space position helpers ──────────────────────────────────── */
function pitWorldPos(arena: ArenaData, pit: { posR: number; posAngle: number; rotY: number }): { wx: number; wz: number; wRotY: number } {
  const localX = pit.posR * Math.cos(pit.posAngle * DEG2RAD);
  const localZ = pit.posR * Math.sin(pit.posAngle * DEG2RAD);
  const cosA = Math.cos(arena.rotY); const sinA = Math.sin(arena.rotY);
  return {
    wx: arena.posX + localX * cosA - localZ * sinA,
    wz: arena.posZ + localX * sinA + localZ * cosA,
    wRotY: arena.rotY + pit.rotY * DEG2RAD,
  };
}

/* ── Build arena Three.js objects ────────────────────────────────────────── */
function buildArenaObjects(data: ArenaData): [THREE.Mesh, THREE.LineSegments] {
  const pts = shapePoints(data);
  const mat = buildSurfaceMaterial({
    color: data.color, surface: data.surface,
    customTileData: data.customTileData, tileScale: data.tileScale,
  });

  let meshGeo: THREE.BufferGeometry;
  let edgeGeo: THREE.BufferGeometry;

  if (data.isMoat) {
    const innerParams: ShapeParams = {
      openingShape: data.openingShape, radiusX: data.innerRadiusX, radiusZ: data.innerRadiusZ,
      sides: data.sides, starInner: data.starInner,
    };
    const innerPts = shapePoints(innerParams);
    meshGeo = data.wallProfile === 'parabolic'
      ? buildMoatParabolicBowl(pts, innerPts, data.depth)
      : buildMoatStraightWalls(pts, innerPts, data.depth);
    edgeGeo = buildMoatEdgeLines(pts, innerPts, data.depth);
  } else {
    meshGeo = data.wallProfile === 'parabolic'
      ? buildParabolicBowl(pts, data.depth)
      : buildStraightCut(pts, data.depth);
    edgeGeo = buildEdgeLines(pts, data.depth, data.wallProfile);
  }

  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(data.posX, 0, data.posZ);
  mesh.rotation.y = data.rotY;

  const edgeCol = new THREE.Color(data.color).lerp(new THREE.Color(0xffffff), 0.5);
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
  edges.position.set(data.posX, 0, data.posZ);
  edges.rotation.y = data.rotY;
  return [mesh, edges];
}

function applyArena(data: ArenaData): void {
  const pts = shapePoints(data);
  data.mesh.geometry.dispose();
  data.edges.geometry.dispose();

  if (data.isMoat) {
    const innerParams: ShapeParams = {
      openingShape: data.openingShape, radiusX: data.innerRadiusX, radiusZ: data.innerRadiusZ,
      sides: data.sides, starInner: data.starInner,
    };
    const innerPts = shapePoints(innerParams);
    data.mesh.geometry  = data.wallProfile === 'parabolic'
      ? buildMoatParabolicBowl(pts, innerPts, data.depth)
      : buildMoatStraightWalls(pts, innerPts, data.depth);
    data.edges.geometry = buildMoatEdgeLines(pts, innerPts, data.depth);
  } else {
    data.mesh.geometry  = data.wallProfile === 'parabolic'
      ? buildParabolicBowl(pts, data.depth)
      : buildStraightCut(pts, data.depth);
    data.edges.geometry = buildEdgeLines(pts, data.depth, data.wallProfile);
  }

  for (const obj of [data.mesh, data.edges]) {
    obj.position.set(data.posX, 0, data.posZ);
    obj.rotation.y = data.rotY;
  }
}

function applyArenaColor(data: ArenaData): void {
  const prevOpts: SurfaceMaterialOpts = {
    color: (data.mesh.material as THREE.MeshStandardMaterial).color.getHex(),
    surface: data.surface, customTileData: data.customTileData, tileScale: data.tileScale,
  };
  releaseMaterial(prevOpts);
  const newMat = buildSurfaceMaterial({
    color: data.color, surface: data.surface,
    customTileData: data.customTileData, tileScale: data.tileScale,
  });
  data.mesh.material = newMat;
  const edgeCol = new THREE.Color(data.color).lerp(new THREE.Color(0xffffff), 0.5);
  (data.edges.material as THREE.LineBasicMaterial).color.copy(edgeCol);
}

/* ── Build pit Three.js objects ──────────────────────────────────────────── */
function buildPitObjects(pit: PitData, arena: ArenaData): [THREE.Mesh, THREE.LineSegments] {
  const H = OCTAGON_BASE.height;
  const baseY = H - arena.depth;
  const pts = shapePoints(pit);
  const mat = buildSurfaceMaterial({
    color: pit.color, surface: pit.surface,
    customTileData: pit.customTileData, tileScale: pit.tileScale,
  });
  const meshGeo = pit.wallProfile === 'parabolic'
    ? buildParabolicBowl(pts, pit.depth, baseY)
    : buildStraightCut(pts, pit.depth, baseY);
  const edgeGeo = buildEdgeLines(pts, pit.depth, pit.wallProfile, baseY);

  const { wx, wz, wRotY } = pitWorldPos(arena, pit);
  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(wx, 0, wz);
  mesh.rotation.y = wRotY;

  const edgeCol = new THREE.Color(pit.color).lerp(new THREE.Color(0xffffff), 0.5);
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
  edges.position.set(wx, 0, wz);
  edges.rotation.y = wRotY;
  return [mesh, edges];
}

function applyPit(pit: PitData, arena: ArenaData): void {
  const H = OCTAGON_BASE.height;
  const baseY = H - arena.depth;
  const pts = shapePoints(pit);
  pit.mesh.geometry.dispose();
  pit.edges.geometry.dispose();
  pit.mesh.geometry  = pit.wallProfile === 'parabolic'
    ? buildParabolicBowl(pts, pit.depth, baseY)
    : buildStraightCut(pts, pit.depth, baseY);
  pit.edges.geometry = buildEdgeLines(pts, pit.depth, pit.wallProfile, baseY);
  const { wx, wz, wRotY } = pitWorldPos(arena, pit);
  for (const obj of [pit.mesh, pit.edges]) { obj.position.set(wx, 0, wz); obj.rotation.y = wRotY; }
}

/* ── Build zone Three.js objects ─────────────────────────────────────────── */
function zoneFillConfig(zone: ZoneData): { color: number; opacity: number; emissive: number; emissiveIntensity: number; glowColor: number | null } {
  if (zone.fill === 'custom') {
    return { color: zone.fillColor ?? 0xffffff, opacity: zone.fillOpacity, emissive: 0x000000, emissiveIntensity: 0, glowColor: null };
  }
  const p = FILL_PRESET[zone.fill];
  return { color: p.color, opacity: p.opacity, emissive: p.emissive, emissiveIntensity: p.emissiveIntensity, glowColor: p.glowColor };
}

function buildZoneObjects(zone: ZoneData, arena: ArenaData): [THREE.Mesh, THREE.LineSegments, THREE.Mesh, THREE.PointLight | null] {
  const H = OCTAGON_BASE.height;
  const baseY = H - arena.depth;
  const pts = shapePoints(zone);
  const mat = buildSurfaceMaterial({
    color: zone.color, surface: zone.surface,
    customTileData: zone.customTileData, tileScale: zone.tileScale,
  });
  const meshGeo  = buildParabolicBowl(pts, zone.depth, baseY);
  const edgeGeo  = buildEdgeLines(pts, zone.depth, 'parabolic', baseY);

  const { wx, wz, wRotY } = pitWorldPos(arena, zone);
  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(wx, 0, wz);
  mesh.rotation.y = wRotY;

  const edgeCol = new THREE.Color(zone.color).lerp(new THREE.Color(0xffffff), 0.5);
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
  edges.position.set(wx, 0, wz);
  edges.rotation.y = wRotY;

  // Fill surface — tessellated disc with sine wave shader
  const fc = zoneFillConfig(zone);
  const fillY = baseY - zone.depth + 0.1;
  const fillGeo = buildZoneFillGeo(zone);
  const wave    = FILL_WAVE[zone.fill];
  const fillMat = buildFillShaderMaterial(fc, wave);
  const fillMesh = new THREE.Mesh(fillGeo, fillMat);
  // Scale to match ellipse ratio
  if (zone.radiusX !== zone.radiusZ) {
    const r = Math.min(zone.radiusX, zone.radiusZ);
    fillMesh.scale.set(zone.radiusX / r, 1, zone.radiusZ / r);
  }
  fillMesh.position.set(wx, fillY, wz);
  fillMesh.rotation.y = wRotY;
  fillMesh.onBeforeRender = (_r, _s, _c, _g, mat) => {
    (mat as THREE.ShaderMaterial).uniforms['uTime'].value = performance.now() / 1000;
  };

  // Glow point light
  let fillLight: THREE.PointLight | null = null;
  if (zone.fillGlow && fc.glowColor !== null) {
    fillLight = new THREE.PointLight(fc.glowColor, 2, arena.radiusX * 1.5);
    fillLight.position.set(wx, fillY + 2, wz);
  }

  return [mesh, edges, fillMesh, fillLight];
}

function applyZone(zone: ZoneData, arena: ArenaData, scene: THREE.Scene | null): void {
  const H = OCTAGON_BASE.height;
  const baseY = H - arena.depth;
  const pts = shapePoints(zone);
  const { wx, wz, wRotY } = pitWorldPos(arena, zone);
  const fillY = baseY - zone.depth + 0.1;

  zone.mesh.geometry.dispose();
  zone.mesh.geometry = buildParabolicBowl(pts, zone.depth, baseY);
  zone.edges.geometry.dispose();
  zone.edges.geometry = buildEdgeLines(pts, zone.depth, 'parabolic', baseY);
  for (const obj of [zone.mesh, zone.edges]) { obj.position.set(wx, 0, wz); obj.rotation.y = wRotY; }

  zone.fillMesh.geometry.dispose();
  zone.fillMesh.geometry = buildZoneFillGeo(zone);
  if (zone.radiusX !== zone.radiusZ) {
    const r = Math.min(zone.radiusX, zone.radiusZ);
    zone.fillMesh.scale.set(zone.radiusX / r, 1, zone.radiusZ / r);
  } else {
    zone.fillMesh.scale.set(1, 1, 1);
  }
  zone.fillMesh.position.set(wx, fillY, wz);
  zone.fillMesh.rotation.y = wRotY;

  // Rebuild shader material with updated fill config + wave params
  const fc = zoneFillConfig(zone);
  const wave = FILL_WAVE[zone.fill];
  ;(zone.fillMesh.material as THREE.Material).dispose();
  const newFillMat = buildFillShaderMaterial(fc, wave);
  zone.fillMesh.material = newFillMat;
  zone.fillMesh.onBeforeRender = (_r, _s, _c, _g, mat) => {
    (mat as THREE.ShaderMaterial).uniforms['uTime'].value = performance.now() / 1000;
  };

  // Rebuild glow light
  if (zone.fillLight) { scene?.remove(zone.fillLight); zone.fillLight.dispose(); zone.fillLight = null; }
  if (zone.fillGlow && fc.glowColor !== null) {
    zone.fillLight = new THREE.PointLight(fc.glowColor, 2, arena.radiusX * 1.5);
    zone.fillLight.position.set(wx, fillY + 2, wz);
    scene?.add(zone.fillLight);
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   SceneTree
   ══════════════════════════════════════════════════════════════════════════ */
interface TreeNode {
  id: string; label: string; icon: string;
  parentId: string | null; childIds: string[];
  expanded: boolean;
  rowEl: HTMLElement; childrenEl: HTMLElement; nodeEl: HTMLElement;
}
type DropPos = 'before' | 'inside' | 'after';
type CtxItem = { label: string; action: () => void; disabled?: boolean };
interface AddChildBtn { label: string; title: string; className?: string; onClick: () => void; }
interface NodeOpts { onAddChild?: () => void; addChildButtons?: AddChildBtn[]; }

export class SceneTree {
  private bodyEl:   HTMLElement;
  private headerEl: HTMLElement;
  private nodes   = new Map<string, TreeNode>();
  private sel     = new Set<string>();
  private dragId:  string | null = null;
  private dropTarget: { id: string; pos: DropPos } | null = null;
  private ctxMenu: HTMLElement;
  private idSeq   = 0;
  private nodeActions = new Map<string, CtxItem[]>();

  onDelete:           (ids: string[]) => void = () => {};
  onGroup:            (newGroupId: string, childIds: string[]) => void = () => {};
  onCombine:          (ids: string[]) => void = () => {};
  onReparent:         (nodeId: string, newParentId: string | null, beforeId: string | null) => void = () => {};
  onSelect:           (ids: string[]) => void = () => {};
  onVisibilityToggle: (id: string, visible: boolean) => void = () => {};

  get header(): HTMLElement { return this.headerEl; }

  constructor(private container: HTMLElement) {
    container.innerHTML = `
      <div class="scene-tree-header">
        <span class="scene-tree-header-title">SCENE</span>
      </div>
      <div class="scene-tree-body"></div>
    `;
    this.headerEl = container.querySelector<HTMLElement>('.scene-tree-header')!;
    this.bodyEl   = container.querySelector<HTMLElement>('.scene-tree-body')!;

    this.ctxMenu = document.createElement('div');
    this.ctxMenu.className = 'tree-ctx-menu hidden';
    document.body.appendChild(this.ctxMenu);

    document.addEventListener('pointerdown', (e) => {
      if (!this.ctxMenu.contains(e.target as Node)) this.hideCtx();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Delete') this.deleteSelected();
      if (e.key === 'Escape') this.clearSel();
    });
  }

  add(id: string, label: string, icon: string, parentId: string | null = null, opts?: NodeOpts): void {
    const nodeEl = document.createElement('div');
    nodeEl.className = 'tree-node'; nodeEl.dataset['id'] = id;

    const rowEl = document.createElement('div');
    rowEl.className = 'tree-node-row'; rowEl.draggable = true;
    rowEl.style.setProperty('--depth', String(this.depthOf(parentId)));

    const caret  = document.createElement('span'); caret.className = 'tree-caret';
    const iconEl = document.createElement('span'); iconEl.className = 'tree-node-icon'; iconEl.textContent = icon;
    const labelEl = document.createElement('span'); labelEl.className = 'tree-node-label'; labelEl.textContent = label;
    rowEl.appendChild(caret); rowEl.appendChild(iconEl); rowEl.appendChild(labelEl);

    // Single add-child button (legacy)
    if (opts?.onAddChild) {
      const addBtn = document.createElement('button');
      addBtn.className = 'tree-add-btn'; addBtn.textContent = '+'; addBtn.title = 'Add arena';
      addBtn.addEventListener('click', (e) => { e.stopPropagation(); opts.onAddChild!(); });
      rowEl.appendChild(addBtn);
    }

    // Multiple add-child buttons (arena [P+][Z+])
    if (opts?.addChildButtons) {
      for (const cb of opts.addChildButtons) {
        const btn = document.createElement('button');
        btn.className = `tree-add-btn${cb.className ? ' ' + cb.className : ''}`;
        btn.textContent = cb.label; btn.title = cb.title;
        btn.addEventListener('click', (e) => { e.stopPropagation(); cb.onClick(); });
        rowEl.appendChild(btn);
      }
    }

    const visBtn = document.createElement('button');
    visBtn.className = 'tree-vis-btn'; visBtn.textContent = '👁'; visBtn.title = 'Toggle visibility'; visBtn.tabIndex = -1;
    rowEl.appendChild(visBtn);

    const childrenEl = document.createElement('div'); childrenEl.className = 'tree-children';
    nodeEl.appendChild(rowEl); nodeEl.appendChild(childrenEl);

    const node: TreeNode = { id, label, icon, parentId, childIds: [], expanded: true, rowEl, childrenEl, nodeEl };
    this.nodes.set(id, node);

    if (parentId) {
      const parent = this.nodes.get(parentId);
      if (parent) { parent.childIds.push(id); parent.childrenEl.appendChild(nodeEl); this.refreshCaret(parent); }
    } else {
      this.bodyEl.appendChild(nodeEl);
    }
    this.wireRow(node, visBtn);
  }

  remove(id: string): void {
    const node = this.nodes.get(id); if (!node) return;
    [...node.childIds].forEach(cid => this.remove(cid));
    if (node.parentId) {
      const p = this.nodes.get(node.parentId);
      if (p) { p.childIds = p.childIds.filter(c => c !== id); this.refreshCaret(p); }
    }
    node.nodeEl.remove(); this.nodes.delete(id); this.sel.delete(id); this.nodeActions.delete(id);
  }

  setLabel(id: string, label: string): void {
    const node = this.nodes.get(id); if (!node) return;
    node.label = label;
    const el = node.rowEl.querySelector<HTMLElement>('.tree-node-label');
    if (el) el.textContent = label;
  }

  setNodeActions(id: string, items: CtxItem[]): void { this.nodeActions.set(id, items); }

  private select(id: string, multi: boolean): void {
    if (!multi) { this.sel.forEach(s => this.nodes.get(s)?.rowEl.classList.remove('tree-node--selected')); this.sel.clear(); }
    if (this.sel.has(id) && multi) { this.sel.delete(id); this.nodes.get(id)?.rowEl.classList.remove('tree-node--selected'); }
    else { this.sel.add(id); this.nodes.get(id)?.rowEl.classList.add('tree-node--selected'); }
    this.onSelect([...this.sel]);
  }

  clearSel(): void {
    this.sel.forEach(id => this.nodes.get(id)?.rowEl.classList.remove('tree-node--selected'));
    this.sel.clear(); this.onSelect([]);
  }

  private showCtx(x: number, y: number, id: string): void {
    if (!this.sel.has(id)) this.select(id, false);
    const ids = [...this.sel];
    const customItems = this.nodeActions.get(id) ?? [];
    const stdItems: CtxItem[] = [
      { label: 'Delete',  action: () => this.deleteSelected() },
      { label: 'Group',   action: () => this.groupSelected(),   disabled: ids.length < 1 },
      { label: 'Combine', action: () => this.combineSelected(), disabled: ids.length < 2 },
    ];
    this.ctxMenu.innerHTML = '';
    const append = (items: CtxItem[]) => items.forEach(item => {
      const btn = document.createElement('button'); btn.className = 'tree-ctx-item'; btn.textContent = item.label;
      if (item.disabled) btn.disabled = true;
      btn.addEventListener('click', () => { item.action(); this.hideCtx(); });
      this.ctxMenu.appendChild(btn);
    });
    append(customItems);
    if (customItems.length) { const sep = document.createElement('div'); sep.className = 'tree-ctx-sep'; this.ctxMenu.appendChild(sep); }
    append(stdItems);
    this.ctxMenu.classList.remove('hidden');
    const r = this.ctxMenu.getBoundingClientRect();
    this.ctxMenu.style.left = `${Math.min(x, window.innerWidth  - r.width  - 8)}px`;
    this.ctxMenu.style.top  = `${Math.min(y, window.innerHeight - r.height - 8)}px`;
  }

  private hideCtx(): void { this.ctxMenu.classList.add('hidden'); }

  private deleteSelected(): void {
    const ids = [...this.sel]; if (!ids.length) return;
    ids.forEach(id => this.remove(id)); this.onDelete(ids);
  }

  private groupSelected(): void {
    const ids = [...this.sel]; if (!ids.length) return;
    const groupId = `group-${++this.idSeq}`;
    this.add(groupId, 'Group', '▣', this.nodes.get(ids[0])!.parentId ?? null);
    ids.forEach(id => this.reparentTo(id, groupId));
    this.clearSel(); this.select(groupId, false); this.onGroup(groupId, ids);
  }

  private combineSelected(): void {
    const ids = [...this.sel]; if (ids.length < 2) return; this.onCombine(ids);
  }

  private refreshCaret(node: TreeNode): void {
    const c = node.rowEl.querySelector<HTMLElement>('.tree-caret');
    if (c) c.textContent = node.childIds.length === 0 ? '' : node.expanded ? '▾' : '▸';
  }

  private toggleExpand(id: string): void {
    const node = this.nodes.get(id); if (!node || !node.childIds.length) return;
    node.expanded = !node.expanded;
    node.childrenEl.classList.toggle('tree-children--collapsed', !node.expanded);
    this.refreshCaret(node);
  }

  private wireRow(node: TreeNode, visBtn: HTMLButtonElement): void {
    const { rowEl, id } = node;
    rowEl.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t.classList.contains('tree-caret')) this.toggleExpand(id);
      else if (!t.classList.contains('tree-vis-btn') && !t.classList.contains('tree-add-btn'))
        this.select(id, e.ctrlKey || e.metaKey);
    });

    let visible = true;
    visBtn.addEventListener('click', (e) => {
      e.stopPropagation(); visible = !visible;
      visBtn.textContent = visible ? '👁' : '🚫';
      visBtn.classList.toggle('hidden-obj', !visible);
      this.onVisibilityToggle(id, visible);
    });

    rowEl.addEventListener('contextmenu', (e) => { e.preventDefault(); this.showCtx(e.clientX, e.clientY, id); });
    rowEl.addEventListener('dragstart',   (e) => { this.dragId = id; e.dataTransfer!.effectAllowed = 'move'; rowEl.classList.add('tree-node--dragging'); });
    rowEl.addEventListener('dragend',     () =>  { this.dragId = null; rowEl.classList.remove('tree-node--dragging'); this.clearDrop(); });
    rowEl.addEventListener('dragover', (e) => {
      if (!this.dragId || this.dragId === id) return;
      e.preventDefault(); e.dataTransfer!.dropEffect = 'move';
      const rel = (e.clientY - rowEl.getBoundingClientRect().top) / rowEl.getBoundingClientRect().height;
      const pos: DropPos = rel < 0.28 ? 'before' : rel > 0.72 ? 'after' : 'inside';
      this.clearDrop(); this.dropTarget = { id, pos }; rowEl.classList.add(`tree-drop-${pos}`);
    });
    rowEl.addEventListener('dragleave', () => this.clearDrop());
    rowEl.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!this.dragId || !this.dropTarget || this.dropTarget.id !== id) return;
      const src = this.dragId; const { pos } = this.dropTarget; this.clearDrop();
      if (pos === 'inside') this.reparentTo(src, id);
      else { const t = this.nodes.get(id)!; this.reparentTo(src, t.parentId, pos === 'before' ? id : null, pos === 'after' ? id : null); }
    });
  }

  private reparentTo(srcId: string, newParentId: string | null, beforeId: string | null = null, afterId: string | null = null): void {
    const src = this.nodes.get(srcId); if (!src) return;
    if (src.parentId) { const old = this.nodes.get(src.parentId); if (old) { old.childIds = old.childIds.filter(c => c !== srcId); this.refreshCaret(old); } }
    src.nodeEl.remove(); src.parentId = newParentId;
    src.rowEl.style.setProperty('--depth', String(this.depthOf(newParentId)));
    const pc = newParentId ? this.nodes.get(newParentId)?.childrenEl : this.bodyEl; if (!pc) return;
    if (beforeId)     pc.insertBefore(src.nodeEl, this.nodes.get(beforeId)?.nodeEl ?? null);
    else if (afterId) { const ref = this.nodes.get(afterId)?.nodeEl; ref ? ref.after(src.nodeEl) : pc.appendChild(src.nodeEl); }
    else              pc.appendChild(src.nodeEl);
    if (newParentId) { const np = this.nodes.get(newParentId)!; np.childIds = [...np.childrenEl.children].map(el => (el as HTMLElement).dataset['id'] ?? '').filter(Boolean); this.refreshCaret(np); }
    this.onReparent(srcId, newParentId, beforeId ?? afterId);
  }

  private clearDrop(): void {
    if (!this.dropTarget) return;
    this.nodes.get(this.dropTarget.id)?.rowEl.classList.remove('tree-drop-before', 'tree-drop-inside', 'tree-drop-after');
    this.dropTarget = null;
  }

  private depthOf(parentId: string | null): number {
    if (!parentId) return 0;
    const p = this.nodes.get(parentId);
    return p ? this.depthOf(p.parentId) + 1 : 0;
  }

  dispose(): void { this.ctxMenu.remove(); }
}

/* ══════════════════════════════════════════════════════════════════════════
   PropertiesPanel
   ══════════════════════════════════════════════════════════════════════════ */
class PropertiesPanel {
  private content: HTMLElement;
  onClose: () => void = () => {};

  constructor(container: HTMLElement) {
    container.innerHTML = `
      <div class="prop-header">
        PROPERTIES
        <button class="prop-close-btn" title="Close panel">×</button>
      </div>
      <div class="prop-content"></div>
    `;
    this.content = container.querySelector<HTMLElement>('.prop-content')!;
    container.querySelector<HTMLButtonElement>('.prop-close-btn')!
      .addEventListener('click', () => this.onClose());
    this.showEmpty();
  }

  showEmpty(): void {
    this.content.innerHTML = `<div class="prop-empty">Select an item<br>to inspect</div>`;
  }

  showBase(
    cfg: { height: number; sides: number; color: number; surface: SurfaceType; customTileData: string | null; tileScale: number },
    onRebuild: () => void,
    onColorChange: (hex: number) => void,
    onSurfaceChange: () => void,
  ): void {
    this.content.innerHTML = '';
    this.section('OCTAGON BASE');
    this.readRow('Flat-to-flat', '200 cm');
    this.numRow('Height', cfg.height, 5, 80, 1,  v => { cfg.height = v;             onRebuild(); });
    this.numRow('Sides',  cfg.sides,  3, 16, 1,  v => { cfg.sides  = Math.round(v); onRebuild(); });
    this.section('SURFACE');
    this.colorRow('Color', cfg.color, hex => { cfg.color = hex; onColorChange(hex); });
    this.surfaceRow(cfg, onSurfaceChange);
    const hint = document.createElement('div');
    hint.className = 'prop-hint';
    hint.textContent = 'Click [+] on the base node to add an arena';
    this.content.appendChild(hint);
  }

  showArena(
    data: ArenaData,
    onGeomChange: () => void,
    onFullChange: () => void,
    onRename: (name: string) => void,
    onColorChange: () => void,
    onSurfaceChange: () => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = data.name;
    nameInp.addEventListener('input', () => { data.name = nameInp.value; onRename(data.name); });
    this.content.appendChild(nameInp);

    this.section('OPENING SHAPE');
    this.shapeGrid(data, onFullChange);

    if (data.openingShape === 'star') {
      this.numRow('Points',     data.sides,     3, 12,   1,    v => { data.sides     = Math.round(v); onFullChange(); });
      this.numRow('Inner frac', data.starInner, 0.1, 0.95, 0.05, v => { data.starInner = v; onGeomChange(); });
    }

    this.section('MOAT');
    this.toggleRow('Ring/Moat', data.isMoat, v => { data.isMoat = v; onFullChange(); });
    if (data.isMoat) {
      this.numRow('Inner R X', data.innerRadiusX, 5, data.radiusX - 5, 1, v => { data.innerRadiusX = v; onGeomChange(); });
      this.numRow('Inner R Z', data.innerRadiusZ, 5, data.radiusZ - 5, 1, v => { data.innerRadiusZ = v; onGeomChange(); });
    }

    this.section('WALL PROFILE');
    const profRow = document.createElement('div'); profRow.className = 'prop-profile-row';
    (['parabolic', 'straight'] as WallProfile[]).forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (data.wallProfile === p ? ' active' : '');
      btn.textContent = p === 'parabolic' ? '⌣ Bowl' : '▮ Straight';
      btn.addEventListener('click', () => { data.wallProfile = p; onFullChange(); });
      profRow.appendChild(btn);
    });
    this.content.appendChild(profRow);

    this.section('DIMENSIONS');
    this.numRow('Radius X', data.radiusX, 5, APOTHEM, 1,             v => { data.radiusX = v; onGeomChange(); });
    this.numRow('Radius Z', data.radiusZ, 5, APOTHEM, 1,             v => { data.radiusZ = v; onGeomChange(); });
    this.numRow('Depth',    data.depth,   1, OCTAGON_BASE.height, 0.5, v => { data.depth   = v; onGeomChange(); });

    this.section('SURFACE');
    this.colorRow('Color', data.color, v => { data.color = v; onColorChange(); });
    this.surfaceRow(data, onSurfaceChange);

    this.section('POSITION');
    this.numRow('X',       data.posX,  -APOTHEM, APOTHEM, 1, v => { data.posX = v; onGeomChange(); });
    this.numRow('Z',       data.posZ,  -APOTHEM, APOTHEM, 1, v => { data.posZ = v; onGeomChange(); });
    this.numRow('Rot Y °', THREE.MathUtils.radToDeg(data.rotY), -180, 180, 1,
      v => { data.rotY = THREE.MathUtils.degToRad(v); onGeomChange(); });
  }

  showPit(
    pit: PitData,
    arena: ArenaData,
    onGeomChange: () => void,
    onFullChange: () => void,
    onRename: (name: string) => void,
    onColorChange: () => void,
    onSurfaceChange: () => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = pit.name;
    nameInp.addEventListener('input', () => { pit.name = nameInp.value; onRename(pit.name); });
    this.content.appendChild(nameInp);

    this.section('OPENING SHAPE');
    this.shapeGrid(pit, onFullChange);

    if (pit.openingShape === 'star') {
      this.numRow('Points',     pit.sides,     3, 12,   1,    v => { pit.sides     = Math.round(v); onFullChange(); });
      this.numRow('Inner frac', pit.starInner, 0.1, 0.95, 0.05, v => { pit.starInner = v; onGeomChange(); });
    }

    this.section('WALL PROFILE');
    const profRow = document.createElement('div'); profRow.className = 'prop-profile-row';
    (['parabolic', 'straight'] as WallProfile[]).forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (pit.wallProfile === p ? ' active' : '');
      btn.textContent = p === 'parabolic' ? '⌣ Bowl' : '▮ Straight';
      btn.addEventListener('click', () => { pit.wallProfile = p; onFullChange(); });
      profRow.appendChild(btn);
    });
    this.content.appendChild(profRow);

    this.section('DIMENSIONS');
    const maxR = Math.min(arena.radiusX, arena.radiusZ);
    this.numRow('Radius X', pit.radiusX, 2, maxR, 1, v => { pit.radiusX = v; onGeomChange(); });
    this.numRow('Radius Z', pit.radiusZ, 2, maxR, 1, v => { pit.radiusZ = v; onGeomChange(); });
    this.numRow('Depth',    pit.depth,   1, arena.depth, 0.5, v => { pit.depth = v; onGeomChange(); });

    this.section('SURFACE');
    this.colorRow('Color', pit.color, v => { pit.color = v; onColorChange(); });
    this.surfaceRow(pit, onSurfaceChange);

    this.section('POSITION (arena-local)');
    const maxDist = Math.min(arena.radiusX, arena.radiusZ);
    this.numRow('Dist (cm)', pit.posR,     0, maxDist, 1,   v => { pit.posR     = v; onGeomChange(); });
    this.numRow('Angle °',   pit.posAngle, 0, 360,     1,   v => { pit.posAngle = v; onGeomChange(); });
    this.numRow('Rotate °',  pit.rotY,     0, 360,     1,   v => { pit.rotY     = v; onGeomChange(); });
  }

  showZone(
    zone: ZoneData,
    arena: ArenaData,
    onGeomChange: () => void,
    onFullChange: () => void,
    onRename: (name: string) => void,
    onSurfaceChange: () => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = zone.name;
    nameInp.addEventListener('input', () => { zone.name = nameInp.value; onRename(zone.name); });
    this.content.appendChild(nameInp);

    this.section('OPENING SHAPE');
    this.shapeGrid(zone, onFullChange);

    if (zone.openingShape === 'star') {
      this.numRow('Points',     zone.sides,     3, 12,   1,    v => { zone.sides     = Math.round(v); onFullChange(); });
      this.numRow('Inner frac', zone.starInner, 0.1, 0.95, 0.05, v => { zone.starInner = v; onGeomChange(); });
    }

    this.section('DIMENSIONS');
    const maxR = Math.min(arena.radiusX, arena.radiusZ) * 0.75;
    const maxDepth = Math.min(15, arena.depth);
    this.numRow('Radius X', zone.radiusX, 2, maxR, 1, v => { zone.radiusX = v; onGeomChange(); });
    this.numRow('Radius Z', zone.radiusZ, 2, maxR, 1, v => { zone.radiusZ = v; onGeomChange(); });
    this.numRow('Depth',    zone.depth,   1, maxDepth, 0.5, v => { zone.depth = v; onGeomChange(); });

    this.section('FILL');
    this.fillGrid(zone, onGeomChange);

    this.section('BOWL SURFACE');
    this.colorRow('Color', zone.color, v => { zone.color = v; onGeomChange(); });
    this.surfaceRow(zone, onSurfaceChange);

    this.section('POSITION (arena-local)');
    const maxDist = Math.min(arena.radiusX, arena.radiusZ);
    this.numRow('Dist (cm)', zone.posR,     0, maxDist, 1,   v => { zone.posR     = v; onGeomChange(); });
    this.numRow('Angle °',   zone.posAngle, 0, 360,     1,   v => { zone.posAngle = v; onGeomChange(); });
    this.numRow('Rotate °',  zone.rotY,     0, 360,     1,   v => { zone.rotY     = v; onGeomChange(); });
  }

  /* ── Shared UI helpers ── */
  private shapeGrid(data: ShapeParams, onChange: () => void): void {
    const shapeGrid = document.createElement('div'); shapeGrid.className = 'prop-shape-grid';
    (['circle', 'ellipse', 'rectangle', 'hexagon', 'triangle', 'star'] as OpeningShape[]).forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'prop-shape-btn' + (data.openingShape === s ? ' active' : '');
      btn.innerHTML = `<span class="prop-shape-icon">${SHAPE_ICON[s]}</span><span>${SHAPE_LABEL[s]}</span>`;
      btn.addEventListener('click', () => { data.openingShape = s; onChange(); });
      shapeGrid.appendChild(btn);
    });
    this.content.appendChild(shapeGrid);
  }

  private surfaceRow(
    target: { surface: SurfaceType; customTileData: string | null; tileScale: number; color: number },
    onChange: () => void,
  ): void {
    const SURFACES: SurfaceType[] = ['plain', 'checker', 'grid', 'hex', 'stripes', 'dots', 'concrete', 'metal', 'wood', 'ice', 'sand', 'lava_rock', 'custom_png'];
    const grid = document.createElement('div'); grid.className = 'prop-surface-grid';

    const btns: HTMLButtonElement[] = [];
    for (const s of SURFACES) {
      const btn = document.createElement('button');
      btn.className = 'prop-surface-btn' + (target.surface === s ? ' active' : '');
      btn.title = SURFACE_LABEL[s];

      if (s !== 'custom_png') {
        // Mini canvas preview
        const cv = document.createElement('canvas');
        cv.className = 'prop-surface-preview';
        cv.width = 32; cv.height = 32;
        const miniCtx = cv.getContext('2d')!;
        const srcCv = _paintCanvas(target.color, s);
        miniCtx.drawImage(srcCv, 0, 0, 32, 32);
        btn.appendChild(cv);
        btn.appendChild(document.createTextNode(SURFACE_LABEL[s]));
      } else {
        btn.textContent = '📁 ' + SURFACE_LABEL[s];
      }

      btn.addEventListener('click', () => {
        if (s === 'custom_png') {
          this.openPngPicker(target, onChange, grid);
          return;
        }
        target.surface = s;
        btns.forEach((b, i) => b.classList.toggle('active', SURFACES[i] === s));
        onChange();
      });
      btns.push(btn);
      grid.appendChild(btn);
    }
    this.content.appendChild(grid);

    if (target.surface === 'custom_png') this.renderCustomTileRow(target, onChange);
  }

  private openPngPicker(
    target: { surface: SurfaceType; customTileData: string | null; tileScale: number; color: number },
    onChange: () => void,
    parentGrid: HTMLDivElement,
  ): void {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/png,image/jpeg';
    inp.addEventListener('change', () => {
      const file = inp.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        target.customTileData = reader.result as string;
        target.surface = 'custom_png';
        // Re-render
        const existingCustomRow = this.content.querySelector('.prop-surface-custom-row');
        existingCustomRow?.remove();
        this.renderCustomTileRow(target, onChange);
        // Mark btn active
        for (const btn of parentGrid.querySelectorAll<HTMLButtonElement>('.prop-surface-btn'))
          btn.classList.toggle('active', btn.title === SURFACE_LABEL['custom_png']);
        onChange();
      };
      reader.readAsDataURL(file);
    });
    inp.click();
  }

  private renderCustomTileRow(
    target: { surface: SurfaceType; customTileData: string | null; tileScale: number; color: number },
    onChange: () => void,
  ): void {
    const row = document.createElement('div'); row.className = 'prop-surface-custom-row';

    if (target.customTileData) {
      const thumb = document.createElement('img');
      thumb.className = 'prop-surface-thumb'; thumb.src = target.customTileData;
      row.appendChild(thumb);
    }

    const scaleLabel = document.createElement('span'); scaleLabel.className = 'prop-label'; scaleLabel.textContent = 'Tile scale';
    const scaleInp = document.createElement('input'); scaleInp.type = 'number'; scaleInp.className = 'prop-input';
    scaleInp.value = String(target.tileScale); scaleInp.min = '1'; scaleInp.max = '200'; scaleInp.step = '1';
    scaleInp.addEventListener('input', () => { target.tileScale = parseFloat(scaleInp.value) || 20; onChange(); });

    const clearBtn = document.createElement('button'); clearBtn.className = 'game-btn'; clearBtn.textContent = '✕ Clear';
    clearBtn.addEventListener('click', () => {
      target.customTileData = null; target.surface = 'plain';
      row.remove(); onChange();
    });

    row.appendChild(scaleLabel); row.appendChild(scaleInp); row.appendChild(clearBtn);
    this.content.appendChild(row);
  }

  private fillGrid(zone: ZoneData, onChange: () => void): void {
    const FILLS: ZoneFill[] = ['water', 'lava', 'swamp', 'poison', 'sand', 'ice', 'void', 'custom'];
    const grid = document.createElement('div'); grid.className = 'prop-fill-grid';
    const btns: HTMLButtonElement[] = [];
    for (const f of FILLS) {
      const btn = document.createElement('button');
      btn.className = 'prop-fill-btn' + (zone.fill === f ? ' active' : '');
      const swatch = document.createElement('span'); swatch.className = 'prop-fill-swatch';
      swatch.style.background = '#' + FILL_PRESET[f].color.toString(16).padStart(6, '0');
      btn.appendChild(swatch);
      btn.appendChild(document.createTextNode(FILL_LABEL[f]));
      btn.addEventListener('click', () => {
        zone.fill = f;
        btns.forEach((b, i) => b.classList.toggle('active', FILLS[i] === f));
        this.updateFillCustomRow(zone, onChange);
        onChange();
      });
      btns.push(btn); grid.appendChild(btn);
    }
    this.content.appendChild(grid);

    // Glow toggle
    const glowRow = document.createElement('div'); glowRow.className = 'prop-row';
    const glowLbl = document.createElement('span'); glowLbl.className = 'prop-label'; glowLbl.textContent = 'Glow light';
    const glowBtn = document.createElement('button');
    glowBtn.className = 'prop-profile-btn prop-fill-glow-toggle' + (zone.fillGlow ? ' active' : '');
    glowBtn.textContent = zone.fillGlow ? '✦ On' : '◌ Off';
    glowBtn.addEventListener('click', () => {
      zone.fillGlow = !zone.fillGlow;
      glowBtn.textContent = zone.fillGlow ? '✦ On' : '◌ Off';
      glowBtn.classList.toggle('active', zone.fillGlow);
      onChange();
    });
    glowRow.appendChild(glowLbl); glowRow.appendChild(glowBtn); this.content.appendChild(glowRow);

    // Opacity row
    this.numRow('Opacity', zone.fillOpacity, 0.1, 1.0, 0.05, v => { zone.fillOpacity = v; onChange(); });

    // Custom color row (shown when fill='custom')
    if (zone.fill === 'custom') this.buildFillCustomRow(zone, onChange);
  }

  private updateFillCustomRow(zone: ZoneData, onChange: () => void): void {
    const existing = this.content.querySelector('.prop-fill-custom-row');
    existing?.remove();
    if (zone.fill === 'custom') this.buildFillCustomRow(zone, onChange);
  }

  private buildFillCustomRow(zone: ZoneData, onChange: () => void): void {
    const row = document.createElement('div'); row.className = 'prop-fill-custom-row prop-row';
    const lbl = document.createElement('span'); lbl.className = 'prop-label'; lbl.textContent = 'Fill color';
    const inp = document.createElement('input'); inp.type = 'color'; inp.className = 'prop-color-input';
    inp.value = '#' + (zone.fillColor ?? 0xffffff).toString(16).padStart(6, '0');
    inp.addEventListener('input', () => { zone.fillColor = parseInt(inp.value.slice(1), 16); onChange(); });
    row.appendChild(lbl); row.appendChild(inp); this.content.appendChild(row);
  }

  private toggleRow(label: string, value: boolean, onChange: (v: boolean) => void): void {
    const row = document.createElement('div'); row.className = 'prop-row';
    const lbl = document.createElement('span'); lbl.className = 'prop-label'; lbl.textContent = label;
    const btn = document.createElement('button');
    btn.className = 'prop-profile-btn' + (value ? ' active' : '');
    btn.textContent = value ? '✦ On' : '◌ Off';
    btn.addEventListener('click', () => {
      const next = !(btn.classList.contains('active'));
      btn.classList.toggle('active', next);
      btn.textContent = next ? '✦ On' : '◌ Off';
      onChange(next);
    });
    row.appendChild(lbl); row.appendChild(btn); this.content.appendChild(row);
  }

  private section(title: string): void {
    const el = document.createElement('div'); el.className = 'prop-section-title'; el.textContent = title;
    this.content.appendChild(el);
  }
  private readRow(label: string, value: string): void {
    const row = document.createElement('div'); row.className = 'prop-row';
    row.innerHTML = `<span class="prop-label">${label}</span><span class="prop-value-read">${value}</span>`;
    this.content.appendChild(row);
  }
  private numRow(label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void): void {
    const row = document.createElement('div'); row.className = 'prop-row';
    const lbl = document.createElement('span'); lbl.className = 'prop-label'; lbl.textContent = label;
    const inp = document.createElement('input'); inp.className = 'prop-input'; inp.type = 'number';
    inp.value = String(parseFloat(value.toFixed(2))); inp.min = String(min); inp.max = String(max); inp.step = String(step);
    inp.addEventListener('input', () => onChange(parseFloat(inp.value) || 0));
    row.appendChild(lbl); row.appendChild(inp); this.content.appendChild(row);
  }
  private colorRow(label: string, value: number, onChange: (v: number) => void): void {
    const row = document.createElement('div'); row.className = 'prop-row';
    const lbl = document.createElement('span'); lbl.className = 'prop-label'; lbl.textContent = label;
    const inp = document.createElement('input'); inp.type = 'color'; inp.className = 'prop-color-input';
    inp.value = '#' + value.toString(16).padStart(6, '0');
    inp.addEventListener('input', () => onChange(parseInt(inp.value.slice(1), 16)));
    row.appendChild(lbl); row.appendChild(inp); this.content.appendChild(row);
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   ArenaSandbox
   ══════════════════════════════════════════════════════════════════════════ */
export class ArenaSandbox extends Sandbox {
  private baseMesh:    THREE.Mesh | null = null;
  private baseEdges:   THREE.LineSegments | null = null;
  private topFaceMesh: THREE.Mesh | null = null;
  private solidMode = true;
  private modeBtn:  HTMLButtonElement;
  private readonly arenaStorageKey: string;

  private baseConfig = {
    height: OCTAGON_BASE.height, sides: OCTAGON_BASE.sides, color: 0xe8dcc0,
    surface: 'plain' as SurfaceType, customTileData: null as string | null, tileScale: 20,
  };

  protected sceneTree: SceneTree;
  private sceneObjects = new Map<string, THREE.Object3D[]>();
  private arenas        = new Map<string, ArenaData>();
  private arenaSeq      = 0;
  private pits          = new Map<string, PitData>();
  private pitSeq        = 0;
  private zones         = new Map<string, ZoneData>();
  private zoneSeq       = 0;
  private props:        PropertiesPanel;
  private selectedId:   string | null = null;

  constructor(container: HTMLElement, opts: SandboxOptions) {
    super(container, opts);
    this.arenaStorageKey = `bey_arena_${opts.title.toLowerCase().replace(/\s+/g, '_')}`;

    this.modeBtn = this.addTopBarButton('● Solid', 'Toggle solid / mesh view');
    this.modeBtn.addEventListener('click', () => this.toggleMode());

    const resetArenaBtn = this.addTopBarButton('Reset Arena', 'Reset arena configuration');
    resetArenaBtn.className += ' reset-arena-btn';
    resetArenaBtn.addEventListener('click', () => { void this.resetArena(); });

    const leftPanel = this.addOverlayPanel('sandbox-left-panel');
    this.sceneTree  = new SceneTree(leftPanel);

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'tree-collapse-btn'; collapseBtn.textContent = '◀'; collapseBtn.title = 'Collapse panel';
    this.sceneTree.header.appendChild(collapseBtn);
    collapseBtn.addEventListener('click', () => {
      const collapsed = leftPanel.classList.toggle('sandbox-left-panel--collapsed');
      collapseBtn.textContent = collapsed ? '▶' : '◀';
      collapseBtn.title       = collapsed ? 'Expand panel' : 'Collapse panel';
    });

    this.sceneTree.add('octagon-base', 'Octagon Base', '⬡', null, {
      onAddChild: () => this.addArena(),
    });

    const rightPanel = this.addOverlayPanel('sandbox-right-panel');
    this.props = new PropertiesPanel(rightPanel);
    this.props.onClose = () => {
      this.selectedId = null;
      this.sceneTree.clearSel();
      this.props.showEmpty();
    };

    this.sceneTree.onSelect = (ids) => {
      this.selectedId = ids.length === 1 ? ids[0] : null;
      this.renderProps();
    };

    this.sceneTree.onVisibilityToggle = (id, visible) => {
      (this.sceneObjects.get(id) ?? []).forEach(o => { o.visible = visible; });
    };

    this.sceneTree.onDelete = (ids) => {
      for (const id of ids) {
        // Remove scene objects
        const objs = this.sceneObjects.get(id);
        if (objs) { this.removeFromScene(...objs); this.sceneObjects.delete(id); }

        // Dispose arena
        const arena = this.arenas.get(id);
        if (arena) {
          this.disposeArena(arena);
          // Remove child pits/zones from scene tree (already done by remove cascade) and maps
          for (const pid of arena.pitIds) { const p = this.pits.get(pid); if (p) this.disposePit(p); this.pits.delete(pid); this.sceneObjects.delete(pid); }
          for (const zid of arena.zoneIds) { const z = this.zones.get(zid); if (z) this.disposeZone(z); this.zones.delete(zid); this.sceneObjects.delete(zid); }
          this.arenas.delete(id);
          this.updateTopFace();
        }

        // Dispose pit
        const pit = this.pits.get(id);
        if (pit) {
          this.disposePit(pit);
          this.pits.delete(id);
          const parentArena = this.arenas.get(pit.parentArenaId);
          if (parentArena) { parentArena.pitIds = parentArena.pitIds.filter(x => x !== id); this.updateArenaFloor(parentArena); }
        }

        // Dispose zone
        const zone = this.zones.get(id);
        if (zone) {
          this.disposeZone(zone);
          this.zones.delete(id);
          const parentArena = this.arenas.get(zone.parentArenaId);
          if (parentArena) { parentArena.zoneIds = parentArena.zoneIds.filter(x => x !== id); this.updateArenaFloor(parentArena); }
        }
      }

      if (ids.some(id => id === this.selectedId)) { this.selectedId = null; this.props.showEmpty(); }
      this.saveArena();
    };
  }

  private disposeArena(arena: ArenaData): void {
    arena.mesh.geometry.dispose();
    (arena.mesh.material as THREE.Material).dispose();
    arena.edges.geometry.dispose();
    (arena.edges.material as THREE.Material).dispose();
    if (arena.floorMesh)  { arena.floorMesh.geometry.dispose();  (arena.floorMesh.material  as THREE.Material).dispose(); this.removeFromScene(arena.floorMesh); }
    if (arena.islandMesh) { arena.islandMesh.geometry.dispose(); (arena.islandMesh.material as THREE.Material).dispose(); this.removeFromScene(arena.islandMesh); }
  }

  private disposePit(pit: PitData): void {
    pit.mesh.geometry.dispose();
    (pit.mesh.material as THREE.Material).dispose();
    pit.edges.geometry.dispose();
    (pit.edges.material as THREE.Material).dispose();
  }

  private disposeZone(zone: ZoneData): void {
    zone.mesh.geometry.dispose();
    (zone.mesh.material as THREE.Material).dispose();
    zone.edges.geometry.dispose();
    (zone.edges.material as THREE.Material).dispose();
    zone.fillMesh.geometry.dispose();
    (zone.fillMesh.material as THREE.Material).dispose();
    if (zone.fillLight) { this.removeFromScene(zone.fillLight); zone.fillLight.dispose(); }
  }

  protected override buildCustom(scene: THREE.Scene): void {
    OCTAGON_BASE.height = this.baseConfig.height;
    OCTAGON_BASE.sides  = this.baseConfig.sides;
    OCTAGON_BASE.radius = APOTHEM / Math.cos(Math.PI / this.baseConfig.sides);
    OCTAGON_BASE.align  = Math.PI / this.baseConfig.sides;
    const { radius: R, height: H, sides, align } = OCTAGON_BASE;

    const baseMat = buildSurfaceMaterial({
      color: this.baseConfig.color, surface: this.baseConfig.surface,
      customTileData: this.baseConfig.customTileData, tileScale: this.baseConfig.tileScale,
    });
    this.baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, sides, 1, true), baseMat);
    this.baseMesh.rotation.y = align;
    this.baseMesh.position.y = H / 2;
    scene.add(this.baseMesh);

    const fullGeo = new THREE.CylinderGeometry(R, R, H, sides, 1, false);
    this.baseEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(fullGeo),
      new THREE.LineBasicMaterial({ color: 0xb8a888 }),
    );
    this.baseEdges.rotation.y = align;
    this.baseEdges.position.y = H / 2;
    scene.add(this.baseEdges);
    fullGeo.dispose();

    const topFaceMat = buildSurfaceMaterial({
      color: this.baseConfig.color, surface: this.baseConfig.surface,
      customTileData: this.baseConfig.customTileData, tileScale: this.baseConfig.tileScale,
    });
    this.topFaceMesh = new THREE.Mesh(buildTopFaceGeo(sides, R, align, H, []), topFaceMat);
    scene.add(this.topFaceMesh);

    this.sceneObjects.set('octagon-base', [this.baseMesh, this.baseEdges, this.topFaceMesh]);

    this.loadArena();
  }

  private rebuildBase(): void {
    if (!this.baseMesh || !this.baseEdges || !this.topFaceMesh) return;
    OCTAGON_BASE.height = this.baseConfig.height;
    OCTAGON_BASE.sides  = this.baseConfig.sides;
    OCTAGON_BASE.radius = APOTHEM / Math.cos(Math.PI / this.baseConfig.sides);
    OCTAGON_BASE.align  = Math.PI / this.baseConfig.sides;
    const { radius: R, height: H, sides, align } = OCTAGON_BASE;

    this.baseMesh.geometry.dispose();
    this.baseMesh.geometry = new THREE.CylinderGeometry(R, R, H, sides, 1, true);
    this.baseMesh.rotation.y = align;
    this.baseMesh.position.y = H / 2;

    const newBaseMat = buildSurfaceMaterial({
      color: this.baseConfig.color, surface: this.baseConfig.surface,
      customTileData: this.baseConfig.customTileData, tileScale: this.baseConfig.tileScale,
    });
    (this.baseMesh.material as THREE.Material).dispose();
    this.baseMesh.material = newBaseMat;

    const fullGeo = new THREE.CylinderGeometry(R, R, H, sides, 1, false);
    this.baseEdges.geometry.dispose();
    this.baseEdges.geometry = new THREE.EdgesGeometry(fullGeo);
    this.baseEdges.rotation.y = align;
    this.baseEdges.position.y = H / 2;
    fullGeo.dispose();

    const newTopMat = buildSurfaceMaterial({
      color: this.baseConfig.color, surface: this.baseConfig.surface,
      customTileData: this.baseConfig.customTileData, tileScale: this.baseConfig.tileScale,
    });
    (this.topFaceMesh.material as THREE.Material).dispose();
    this.topFaceMesh.material = newTopMat;

    for (const arena of this.arenas.values()) {
      if (arena.depth > H) arena.depth = H;
      applyArena(arena);
    }
  }

  private updateTopFace(): void {
    if (!this.topFaceMesh) return;
    const { radius: R, height: H, sides, align } = OCTAGON_BASE;
    const newGeo = buildTopFaceGeo(sides, R, align, H, [...this.arenas.values()]);
    this.topFaceMesh.geometry.dispose();
    this.topFaceMesh.geometry = newGeo;
  }

  private updateArenaFloor(arena: ArenaData): void {
    if (arena.wallProfile !== 'straight' || arena.isMoat) {
      if (arena.floorMesh) { this.removeFromScene(arena.floorMesh); arena.floorMesh.geometry.dispose(); (arena.floorMesh.material as THREE.Material).dispose(); arena.floorMesh = null; }
      return;
    }
    const pitsForArena  = arena.pitIds.map(id => this.pits.get(id)!).filter(Boolean);
    const zonesForArena = arena.zoneIds.map(id => this.zones.get(id)!).filter(Boolean);
    const newGeo = buildArenaFloorGeo(arena, pitsForArena, zonesForArena);
    if (arena.floorMesh) {
      arena.floorMesh.geometry.dispose();
      arena.floorMesh.geometry = newGeo;
    } else {
      const mat = buildSurfaceMaterial({
        color: arena.color, surface: arena.surface,
        customTileData: arena.customTileData, tileScale: arena.tileScale,
      });
      arena.floorMesh = new THREE.Mesh(newGeo, mat);
      arena.floorMesh.position.set(arena.posX, 0, arena.posZ);
      arena.floorMesh.rotation.y = arena.rotY;
      this.addToScene(arena.floorMesh);
      const objs = this.sceneObjects.get(this._arenaIdFor(arena));
      if (objs) objs.push(arena.floorMesh);
    }
  }

  private updateIslandCap(arena: ArenaData, id: string): void {
    if (!arena.isMoat) {
      if (arena.islandMesh) { this.removeFromScene(arena.islandMesh); arena.islandMesh.geometry.dispose(); (arena.islandMesh.material as THREE.Material).dispose(); arena.islandMesh = null; }
      return;
    }
    const newGeo = buildIslandCapGeo(arena);
    if (arena.islandMesh) {
      arena.islandMesh.geometry.dispose();
      arena.islandMesh.geometry = newGeo;
      arena.islandMesh.position.set(arena.posX, 0, arena.posZ);
      arena.islandMesh.rotation.y = arena.rotY;
    } else {
      const mat = buildSurfaceMaterial({
        color: this.baseConfig.color, surface: this.baseConfig.surface,
        customTileData: this.baseConfig.customTileData, tileScale: this.baseConfig.tileScale,
      });
      arena.islandMesh = new THREE.Mesh(newGeo, mat);
      arena.islandMesh.position.set(arena.posX, 0, arena.posZ);
      arena.islandMesh.rotation.y = arena.rotY;
      this.addToScene(arena.islandMesh);
      const objs = this.sceneObjects.get(id);
      if (objs) objs.push(arena.islandMesh);
    }
  }

  private _arenaIdFor(arena: ArenaData): string {
    for (const [id, a] of this.arenas.entries()) if (a === arena) return id;
    return '';
  }

  /* ── Properties panel ── */
  private renderProps(): void {
    const id = this.selectedId;
    if (!id) { this.props.showEmpty(); return; }

    if (id === 'octagon-base') {
      this.props.showBase(
        this.baseConfig,
        () => { this.rebuildBase(); this.updateTopFace(); this.saveArena(); },
        (hex) => {
          this.baseConfig.color = hex;
          const newMat = buildSurfaceMaterial({
            color: this.baseConfig.color, surface: this.baseConfig.surface,
            customTileData: this.baseConfig.customTileData, tileScale: this.baseConfig.tileScale,
          });
          (this.baseMesh!.material as THREE.Material).dispose();    this.baseMesh!.material    = newMat;
          (this.topFaceMesh!.material as THREE.Material).dispose(); this.topFaceMesh!.material = buildSurfaceMaterial({
            color: this.baseConfig.color, surface: this.baseConfig.surface,
            customTileData: this.baseConfig.customTileData, tileScale: this.baseConfig.tileScale,
          });
          this.saveArena();
        },
        () => { this.rebuildBase(); this.updateTopFace(); this.saveArena(); },
      );
      return;
    }

    const arena = this.arenas.get(id);
    if (arena) {
      this.props.showArena(
        arena,
        () => { applyArena(arena); this.updateArenaFloor(arena); this.updateIslandCap(arena, id); this.updateTopFace(); this.saveArena(); },
        () => { applyArena(arena); this.updateArenaFloor(arena); this.updateIslandCap(arena, id); this.updateTopFace(); this.renderProps(); this.saveArena(); },
        (name) => { this.sceneTree.setLabel(id, name); this.saveArena(); },
        () => { applyArenaColor(arena); this.saveArena(); },
        () => { applyArenaColor(arena); this.saveArena(); },
      );
      return;
    }

    const pit = this.pits.get(id);
    if (pit) {
      const parentArena = this.arenas.get(pit.parentArenaId)!;
      this.props.showPit(
        pit, parentArena,
        () => { applyPit(pit, parentArena); this.updateArenaFloor(parentArena); this.saveArena(); },
        () => { applyPit(pit, parentArena); this.updateArenaFloor(parentArena); this.renderProps(); this.saveArena(); },
        (name) => { this.sceneTree.setLabel(id, name); this.saveArena(); },
        () => {
          const edgeCol = new THREE.Color(pit.color).lerp(new THREE.Color(0xffffff), 0.5);
          (pit.edges.material as THREE.LineBasicMaterial).color.copy(edgeCol);
          applyPit(pit, parentArena); this.saveArena();
        },
        () => { applyPit(pit, parentArena); this.saveArena(); },
      );
      return;
    }

    const zone = this.zones.get(id);
    if (zone) {
      const parentArena = this.arenas.get(zone.parentArenaId)!;
      this.props.showZone(
        zone, parentArena,
        () => { applyZone(zone, parentArena, this.getScene()); this.updateArenaFloor(parentArena); this.saveArena(); },
        () => { applyZone(zone, parentArena, this.getScene()); this.updateArenaFloor(parentArena); this.renderProps(); this.saveArena(); },
        (name) => { this.sceneTree.setLabel(id, name); this.saveArena(); },
        () => { applyZone(zone, parentArena, this.getScene()); this.saveArena(); },
      );
      return;
    }

    this.props.showEmpty();
  }

  /* Expose scene reference for zone glow lights */
  private getScene(): THREE.Scene | null {
    return (this as unknown as { scene: THREE.Scene | null }).scene;
  }

  private toggleMode(): void {
    this.solidMode = !this.solidMode;
    this.modeBtn.textContent = this.solidMode ? '● Solid' : '○ Mesh';
    if (this.baseMesh)    this.baseMesh.visible    = this.solidMode;
    if (this.topFaceMesh) this.topFaceMesh.visible = this.solidMode;
    for (const arena of this.arenas.values()) {
      arena.mesh.visible  = this.solidMode;
      if (arena.floorMesh)  arena.floorMesh.visible  = this.solidMode;
      if (arena.islandMesh) arena.islandMesh.visible = this.solidMode;
    }
    for (const pit  of this.pits.values())  pit.mesh.visible  = this.solidMode;
    for (const zone of this.zones.values()) { zone.mesh.visible = this.solidMode; zone.fillMesh.visible = this.solidMode; }
  }

  /* ── Add arena ── */
  private addArena(): void {
    const id   = `arena-${++this.arenaSeq}`;
    const data = defaultArena(`Arena ${this.arenaSeq}`);
    const [mesh, edges] = buildArenaObjects(data);
    data.mesh = mesh; data.edges = edges;

    this.addToScene(mesh, edges);
    this.sceneObjects.set(id, [mesh, edges]);
    this.arenas.set(id, data);
    this.sceneTree.add(id, data.name, '⏺', 'octagon-base', {
      addChildButtons: [
        { label: 'P+', title: 'Add pit',  className: 'pit-btn',  onClick: () => this.addPit(id) },
        { label: 'Z+', title: 'Add zone', className: 'zone-btn', onClick: () => this.addZone(id) },
      ],
    });
    this.updateTopFace();
    this.saveArena();
  }

  /* ── Add pit ── */
  private addPit(arenaId: string): void {
    const arena = this.arenas.get(arenaId); if (!arena) return;
    const id  = `pit-${++this.pitSeq}`;
    const pit = defaultPit(`Pit ${this.pitSeq}`, arenaId, id);

    const [mesh, edges] = buildPitObjects(pit, arena);
    pit.mesh = mesh; pit.edges = edges;

    this.addToScene(mesh, edges);
    this.sceneObjects.set(id, [mesh, edges]);
    this.pits.set(id, pit);
    arena.pitIds.push(id);

    this.sceneTree.add(id, pit.name, '▼', arenaId);
    this.updateArenaFloor(arena);
    this.saveArena();
  }

  /* ── Add zone ── */
  private addZone(arenaId: string): void {
    const arena = this.arenas.get(arenaId); if (!arena) return;
    const id   = `zone-${++this.zoneSeq}`;
    const zone = defaultZone(`Zone ${this.zoneSeq}`, arenaId, id);

    const [mesh, edges, fillMesh, fillLight] = buildZoneObjects(zone, arena);
    zone.mesh = mesh; zone.edges = edges; zone.fillMesh = fillMesh; zone.fillLight = fillLight;

    this.addToScene(mesh, edges, fillMesh);
    if (fillLight) this.addToScene(fillLight);
    this.sceneObjects.set(id, fillLight ? [mesh, edges, fillMesh, fillLight] : [mesh, edges, fillMesh]);
    this.zones.set(id, zone);
    arena.zoneIds.push(id);

    this.sceneTree.add(id, zone.name, '◈', arenaId);
    this.updateArenaFloor(arena);
    this.saveArena();
  }

  /* ── Persistence ── */
  private saveArena(): void {
    const config: ArenaConfig = {
      version: 2,
      baseConfig: { ...this.baseConfig },
      arenaSeq: this.arenaSeq,
      pitSeq:   this.pitSeq,
      zoneSeq:  this.zoneSeq,
      arenas: [...this.arenas.entries()].map(([id, a]) => ({
        id, name: a.name, openingShape: a.openingShape, wallProfile: a.wallProfile,
        radiusX: a.radiusX, radiusZ: a.radiusZ, depth: a.depth,
        sides: a.sides, starInner: a.starInner,
        color: a.color, surface: a.surface, customTileData: a.customTileData, tileScale: a.tileScale,
        posX: a.posX, posZ: a.posZ, rotY: a.rotY,
        isMoat: a.isMoat, innerRadiusX: a.innerRadiusX, innerRadiusZ: a.innerRadiusZ,
        pits:  a.pitIds.map(pid => { const p = this.pits.get(pid)!; return {
          id: p.id, name: p.name, openingShape: p.openingShape, wallProfile: p.wallProfile,
          radiusX: p.radiusX, radiusZ: p.radiusZ, depth: p.depth,
          sides: p.sides, starInner: p.starInner,
          color: p.color, surface: p.surface, customTileData: p.customTileData, tileScale: p.tileScale,
          posR: p.posR, posAngle: p.posAngle, rotY: p.rotY,
          isMoat: p.isMoat, innerRadiusX: p.innerRadiusX, innerRadiusZ: p.innerRadiusZ,
        }; }).filter(Boolean),
        zones: a.zoneIds.map(zid => { const z = this.zones.get(zid)!; return {
          id: z.id, name: z.name, openingShape: z.openingShape,
          radiusX: z.radiusX, radiusZ: z.radiusZ, depth: z.depth,
          sides: z.sides, starInner: z.starInner,
          color: z.color, surface: z.surface, customTileData: z.customTileData, tileScale: z.tileScale,
          fill: z.fill, fillColor: z.fillColor, fillOpacity: z.fillOpacity, fillGlow: z.fillGlow,
          posR: z.posR, posAngle: z.posAngle, rotY: z.rotY,
          isMoat: z.isMoat, innerRadiusX: z.innerRadiusX, innerRadiusZ: z.innerRadiusZ,
        }; }).filter(Boolean),
      })),
    };
    localStorage.setItem(this.arenaStorageKey, JSON.stringify(config));
  }

  private loadArena(): void {
    try {
      const raw = localStorage.getItem(this.arenaStorageKey);
      if (!raw) return;
      const cfg = JSON.parse(raw) as ArenaConfig;
      if (cfg.version !== 2) {
        // Discard old saves — no migration
        localStorage.removeItem(this.arenaStorageKey);
        return;
      }

      this.baseConfig = { ...this.baseConfig, ...cfg.baseConfig };
      this.rebuildBase();

      this.arenaSeq = cfg.arenaSeq;
      this.pitSeq   = cfg.pitSeq;
      this.zoneSeq  = cfg.zoneSeq;

      for (const as of cfg.arenas) {
        const data: ArenaData = {
          name: as.name, openingShape: as.openingShape, wallProfile: as.wallProfile,
          radiusX: as.radiusX, radiusZ: as.radiusZ, depth: as.depth,
          sides: as.sides, starInner: as.starInner,
          color: as.color, surface: as.surface, customTileData: as.customTileData, tileScale: as.tileScale,
          posX: as.posX, posZ: as.posZ, rotY: as.rotY,
          isMoat: as.isMoat, innerRadiusX: as.innerRadiusX, innerRadiusZ: as.innerRadiusZ,
          pitIds: [], zoneIds: [],
          mesh:  null as unknown as THREE.Mesh,
          edges: null as unknown as THREE.LineSegments,
          floorMesh:  null,
          islandMesh: null,
        };
        const [mesh, edges] = buildArenaObjects(data);
        data.mesh = mesh; data.edges = edges;
        this.addToScene(mesh, edges);
        const objs: THREE.Object3D[] = [mesh, edges];
        this.arenas.set(as.id, data);

        if (data.isMoat) {
          const islandGeo = buildIslandCapGeo(data);
          const islandMat = buildSurfaceMaterial({
            color: this.baseConfig.color, surface: this.baseConfig.surface,
            customTileData: this.baseConfig.customTileData, tileScale: this.baseConfig.tileScale,
          });
          data.islandMesh = new THREE.Mesh(islandGeo, islandMat);
          data.islandMesh.position.set(data.posX, 0, data.posZ);
          data.islandMesh.rotation.y = data.rotY;
          this.addToScene(data.islandMesh);
          objs.push(data.islandMesh);
        }

        this.sceneTree.add(as.id, data.name, '⏺', 'octagon-base', {
          addChildButtons: [
            { label: 'P+', title: 'Add pit',  className: 'pit-btn',  onClick: () => this.addPit(as.id) },
            { label: 'Z+', title: 'Add zone', className: 'zone-btn', onClick: () => this.addZone(as.id) },
          ],
        });

        // Restore pits
        for (const ps of as.pits) {
          const pit: PitData = {
            id: ps.id, name: ps.name, parentArenaId: as.id,
            openingShape: ps.openingShape, wallProfile: ps.wallProfile,
            radiusX: ps.radiusX, radiusZ: ps.radiusZ, depth: ps.depth,
            sides: ps.sides, starInner: ps.starInner,
            color: ps.color, surface: ps.surface, customTileData: ps.customTileData, tileScale: ps.tileScale,
            posR: ps.posR, posAngle: ps.posAngle, rotY: ps.rotY,
            isMoat: ps.isMoat, innerRadiusX: ps.innerRadiusX, innerRadiusZ: ps.innerRadiusZ,
            mesh:  null as unknown as THREE.Mesh,
            edges: null as unknown as THREE.LineSegments,
          };
          const [pm, pe] = buildPitObjects(pit, data);
          pit.mesh = pm; pit.edges = pe;
          this.addToScene(pm, pe);
          this.sceneObjects.set(ps.id, [pm, pe]);
          this.pits.set(ps.id, pit);
          data.pitIds.push(ps.id);
          this.sceneTree.add(ps.id, pit.name, '▼', as.id);
        }

        // Restore zones
        for (const zs of as.zones) {
          const zone: ZoneData = {
            id: zs.id, name: zs.name, parentArenaId: as.id,
            openingShape: zs.openingShape,
            radiusX: zs.radiusX, radiusZ: zs.radiusZ, depth: zs.depth,
            sides: zs.sides, starInner: zs.starInner,
            color: zs.color, surface: zs.surface, customTileData: zs.customTileData, tileScale: zs.tileScale,
            fill: zs.fill, fillColor: zs.fillColor, fillOpacity: zs.fillOpacity, fillGlow: zs.fillGlow,
            posR: zs.posR, posAngle: zs.posAngle, rotY: zs.rotY,
            isMoat: zs.isMoat, innerRadiusX: zs.innerRadiusX, innerRadiusZ: zs.innerRadiusZ,
            mesh:  null as unknown as THREE.Mesh,
            edges: null as unknown as THREE.LineSegments,
            fillMesh:  null as unknown as THREE.Mesh,
            fillLight: null,
          };
          const [zm, ze, zfm, zfl] = buildZoneObjects(zone, data);
          zone.mesh = zm; zone.edges = ze; zone.fillMesh = zfm; zone.fillLight = zfl;
          this.addToScene(zm, ze, zfm);
          if (zfl) this.addToScene(zfl);
          this.sceneObjects.set(zs.id, zfl ? [zm, ze, zfm, zfl] : [zm, ze, zfm]);
          this.zones.set(zs.id, zone);
          data.zoneIds.push(zs.id);
          this.sceneTree.add(zs.id, zone.name, '◈', as.id);
        }

        // Arena floor for straight-wall arenas
        if (data.wallProfile === 'straight' && !data.isMoat) {
          const pitsForArena  = data.pitIds.map(pid => this.pits.get(pid)!).filter(Boolean);
          const zonesForArena = data.zoneIds.map(zid => this.zones.get(zid)!).filter(Boolean);
          const floorGeo = buildArenaFloorGeo(data, pitsForArena, zonesForArena);
          const floorMat = buildSurfaceMaterial({
            color: data.color, surface: data.surface,
            customTileData: data.customTileData, tileScale: data.tileScale,
          });
          data.floorMesh = new THREE.Mesh(floorGeo, floorMat);
          data.floorMesh.position.set(data.posX, 0, data.posZ);
          data.floorMesh.rotation.y = data.rotY;
          this.addToScene(data.floorMesh);
          objs.push(data.floorMesh);
        }

        this.sceneObjects.set(as.id, objs);
      }
      this.updateTopFace();
    } catch { /* corrupted */ }
  }

  /* ── Reset ── */
  private async resetArena(): Promise<void> {
    const ok = await gameConfirm(
      'Reset arena?\nAll arenas, pits, zones and base settings will be cleared.',
      'Reset', 'Cancel',
    );
    if (!ok) return;

    for (const [id, arena] of this.arenas.entries()) {
      for (const pid of arena.pitIds)  { const p = this.pits.get(pid);  if (p)  this.disposePit(p);  this.pits.delete(pid);  this.sceneObjects.delete(pid); }
      for (const zid of arena.zoneIds) { const z = this.zones.get(zid); if (z)  this.disposeZone(z); this.zones.delete(zid); this.sceneObjects.delete(zid); }
      this.disposeArena(arena);
      this.removeFromScene(arena.mesh, arena.edges);
      this.sceneObjects.delete(id);
      this.sceneTree.remove(id);
    }
    this.arenas.clear(); this.arenaSeq = 0;
    this.pits.clear();   this.pitSeq   = 0;
    this.zones.clear();  this.zoneSeq  = 0;

    this.baseConfig = { height: 30, sides: 8, color: 0xe8dcc0, surface: 'plain', customTileData: null, tileScale: 20 };
    this.rebuildBase();
    this.updateTopFace();

    this.selectedId = null;
    this.sceneTree.clearSel();
    this.props.showEmpty();
    localStorage.removeItem(this.arenaStorageKey);
  }
}

import * as THREE from 'three';

/* ── Stencil ref counter — each zone gets a unique ref (1–255, wraps) ─────── */
let _stencilCtr = 0;
function nextStencilRef(): number { return (_stencilCtr++ % 255) + 1; }

/* ── Constants ───────────────────────────────────────────────────────────── */
export const TWO_PI = Math.PI * 2;
export const APOTHEM = 100;
export const DEG2RAD = Math.PI / 180;

export const OCTAGON_BASE = {
  radius: APOTHEM / Math.cos(Math.PI / 8),
  height: 30, sides: 8, align: Math.PI / 8,
};

/* ── Opening shape / wall profile types ─────────────────────────────────── */
export type OpeningShape = 'circle' | 'ellipse' | 'rectangle' | 'hexagon' | 'triangle' | 'star';
export type WallProfile  = 'parabolic' | 'straight';

/* ── Surface material system ─────────────────────────────────────────────── */
export type SurfaceType =
  | 'plain' | 'checker' | 'grid' | 'hex' | 'stripes' | 'dots'
  | 'concrete' | 'metal' | 'wood' | 'ice' | 'sand' | 'lava_rock' | 'custom_png';

export interface SurfaceMaterialOpts {
  color:           number;
  surface:         SurfaceType;
  customTileData?: string | null;
  tileScale:       number;
  transparent?:    boolean;
  opacity?:        number;
  side?:           THREE.Side;
}

/* Module-level caches */
export const _texCache = new Map<string, { tex: THREE.Texture; refs: number }>();
export const _matCache = new Map<string, { mat: THREE.MeshStandardMaterial; refs: number }>();

export function _texKey(opts: SurfaceMaterialOpts): string {
  if (opts.surface === 'custom_png' && opts.customTileData)
    return `custom:${opts.customTileData.slice(0, 40)}:${opts.tileScale}`;
  return `${opts.color}_${opts.surface}`;
}
export function _matKey(opts: SurfaceMaterialOpts): string {
  return `${_texKey(opts)}:${opts.transparent ? 't' : 'o'}:${opts.opacity ?? 1}:${opts.side ?? THREE.DoubleSide}`;
}

export function _paintCanvas(color: number, surface: SurfaceType): HTMLCanvasElement {
  const C = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = C;
  const ctx = cv.getContext('2d')!;
  const r = (color >> 16) & 0xff, g = (color >> 8) & 0xff, b = color & 0xff;
  const base = `rgb(${r},${g},${b})`;
  const lighter = `rgba(${Math.min(r+64,255)},${Math.min(g+64,255)},${Math.min(b+64,255)},0.55)`;
  const darker  = `rgba(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)},0.60)`;
  ctx.fillStyle = base; ctx.fillRect(0, 0, C, C);
  switch (surface) {
    case 'checker': { const sz=32; ctx.fillStyle=lighter; for(let x=0;x<C;x+=sz) for(let y=0;y<C;y+=sz) if(((x/sz)+(y/sz))%2===0) ctx.fillRect(x,y,sz,sz); break; }
    case 'grid': { ctx.strokeStyle=lighter; ctx.lineWidth=2; for(let i=0;i<=C;i+=32){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,C);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(C,i);ctx.stroke();} break; }
    case 'hex': { const sz=28,h=sz*Math.sqrt(3)/2; ctx.strokeStyle=lighter; ctx.lineWidth=2; for(let row=-1;row<C/h+1;row++) for(let col=-1;col<C/sz+1;col++){const cx=col*sz*1.5+(row%2)*sz*0.75,cy=row*h; ctx.beginPath(); for(let i=0;i<6;i++){const a=(i*60-30)*DEG2RAD; i===0?ctx.moveTo(cx+sz/2*Math.cos(a),cy+sz/2*Math.sin(a)):ctx.lineTo(cx+sz/2*Math.cos(a),cy+sz/2*Math.sin(a));} ctx.closePath(); ctx.stroke();} break; }
    case 'stripes': { ctx.strokeStyle=lighter; ctx.lineWidth=10; for(let i=-C;i<C*2;i+=24){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+C,C);ctx.stroke();} break; }
    case 'dots': { ctx.fillStyle=lighter; for(let x=16;x<C;x+=32) for(let y=16;y<C;y+=32){ctx.beginPath();ctx.arc(x,y,6,0,TWO_PI);ctx.fill();} break; }
    case 'concrete': { ctx.fillStyle=lighter; for(let i=0;i<1800;i++){const px=Math.random()*C,py=Math.random()*C,s=Math.random()*5+1;ctx.fillRect(px,py,s,s*0.4);} break; }
    case 'metal': { for(let y=0;y<C;y+=3){ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.15})`;ctx.fillRect(0,y,C,2);} break; }
    case 'wood': { for(let i=8;i<C;i+=14){ctx.strokeStyle=darker;ctx.lineWidth=3+(i%3);ctx.beginPath();ctx.arc(C/2,C/2,i,0,TWO_PI);ctx.stroke();} break; }
    case 'ice': { ctx.strokeStyle=lighter; ctx.lineWidth=1.5; const cracks=[[50,0,180,200],[200,30,60,220],[120,80,240,180],[0,120,160,256],[80,180,250,40]] as [number,number,number,number][]; for(const[x0,y0,x1,y1]of cracks){ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo((x0+x1)/2+(Math.random()-0.5)*40,(y0+y1)/2+(Math.random()-0.5)*40);ctx.lineTo(x1,y1);ctx.stroke();} break; }
    case 'sand': { ctx.fillStyle=lighter; for(let i=0;i<3000;i++){const px=Math.random()*C,py=Math.random()*C;ctx.fillRect(px,py,1.5,1.5);} break; }
    case 'lava_rock': { const centres:[number,number][]=[];for(let i=0;i<25;i++)centres.push([Math.random()*C,Math.random()*C]);const imgData=ctx.getImageData(0,0,C,C);for(let py=0;py<C;py++)for(let px=0;px<C;px++){let minD=Infinity,nearest=0;for(let ci=0;ci<centres.length;ci++){const d=(px-centres[ci][0])**2+(py-centres[ci][1])**2;if(d<minD){minD=d;nearest=ci;}}const t=(nearest%2===0)?0.85:1.0;const idx=(py*C+px)*4;imgData.data[idx]=Math.round(r*t);imgData.data[idx+1]=Math.round(g*t);imgData.data[idx+2]=Math.round(b*t);imgData.data[idx+3]=255;}ctx.putImageData(imgData,0,0); break; }
    default: break;
  }
  return cv;
}

export function buildSurfaceMaterial(opts: SurfaceMaterialOpts): THREE.MeshStandardMaterial {
  const mk = _matKey(opts);
  const cached = _matCache.get(mk);
  if (cached) { cached.refs++; return cached.mat; }
  let map: THREE.Texture | null = null;
  if (opts.surface !== 'plain') {
    const tk = _texKey(opts);
    const ct = _texCache.get(tk);
    if (ct) { ct.refs++; map = ct.tex; }
    else {
      let tex: THREE.Texture;
      if (opts.surface === 'custom_png' && opts.customTileData) tex = new THREE.TextureLoader().load(opts.customTileData);
      else { const cv = _paintCanvas(opts.color, opts.surface); tex = new THREE.CanvasTexture(cv); }
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(20 / opts.tileScale, 20 / opts.tileScale);
      _texCache.set(tk, { tex, refs: 1 }); map = tex;
    }
  }
  const roughness = opts.surface==='metal'?0.25:opts.surface==='ice'?0.10:0.65;
  const metalness = opts.surface==='metal'?0.70:opts.surface==='ice'?0.10:0.08;
  const mat = new THREE.MeshStandardMaterial({
    color: opts.surface==='plain'?opts.color:0xffffff,
    map: map??undefined, side: opts.side ?? THREE.DoubleSide,
    roughness, metalness,
    transparent: opts.transparent??false, opacity: opts.opacity??1,
  });
  _matCache.set(mk, { mat, refs: 1 }); return mat;
}

export function releaseMaterial(opts: SurfaceMaterialOpts): void {
  const mk = _matKey(opts);
  const mc = _matCache.get(mk); if (!mc) return;
  mc.refs--;
  if (mc.refs <= 0) {
    mc.mat.dispose(); _matCache.delete(mk);
    const tk = _texKey(opts);
    const tc = _texCache.get(tk);
    if (tc) { tc.refs--; if (tc.refs <= 0) { tc.tex.dispose(); _texCache.delete(tk); } }
  }
}

/* ── Zone fill system ────────────────────────────────────────────────────── */
export type ZoneFill = 'water' | 'lava' | 'swamp' | 'poison' | 'sand' | 'ice' | 'void' | 'custom';
export interface FillPreset { color: number; opacity: number; emissive: number; emissiveIntensity: number; glowColor: number | null; }
export const FILL_PRESET: Record<ZoneFill, FillPreset> = {
  water:  { color:0x1a7fd4, opacity:0.65, emissive:0x0044ff, emissiveIntensity:0.08, glowColor:0x3399ff },
  lava:   { color:0xff3300, opacity:0.80, emissive:0xff2200, emissiveIntensity:0.35, glowColor:0xff6600 },
  swamp:  { color:0x3d5c1a, opacity:0.75, emissive:0x224400, emissiveIntensity:0.05, glowColor:0x335500 },
  poison: { color:0x8800cc, opacity:0.70, emissive:0x6600aa, emissiveIntensity:0.15, glowColor:0xaa00ff },
  sand:   { color:0xd4a843, opacity:0.85, emissive:0x000000, emissiveIntensity:0.00, glowColor:null },
  ice:    { color:0xaaddff, opacity:0.60, emissive:0x88ccff, emissiveIntensity:0.08, glowColor:0xaaddff },
  void:   { color:0x000000, opacity:1.00, emissive:0x000000, emissiveIntensity:0.00, glowColor:null },
  custom: { color:0xffffff, opacity:0.70, emissive:0x000000, emissiveIntensity:0.00, glowColor:null },
};
export const FILL_LABEL: Record<ZoneFill, string> = {
  water:'💧 Water', lava:'🔥 Lava', swamp:'🌿 Swamp', poison:'☠ Poison',
  sand:'🏜 Sand', ice:'❄ Ice', void:'🌑 Void', custom:'🎨 Custom',
};

export interface WaveParams { amplitude: number; frequency: number; speed: number; turbulence: number; }
export const FILL_WAVE: Record<ZoneFill, WaveParams> = {
  water:  { amplitude:0.25, frequency:0.10, speed:1.20, turbulence:0.15 },
  lava:   { amplitude:0.60, frequency:0.04, speed:0.20, turbulence:0.80 },
  swamp:  { amplitude:0.18, frequency:0.05, speed:0.25, turbulence:0.50 },
  poison: { amplitude:0.35, frequency:0.13, speed:1.60, turbulence:0.65 },
  sand:   { amplitude:0.00, frequency:0.00, speed:0.00, turbulence:0.00 },
  ice:    { amplitude:0.00, frequency:0.00, speed:0.00, turbulence:0.00 },
  void:   { amplitude:0.00, frequency:0.00, speed:0.00, turbulence:0.00 },
  custom: { amplitude:0.20, frequency:0.08, speed:0.80, turbulence:0.30 },
};

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

/* ── Data model ──────────────────────────────────────────────────────────── */
export interface ShapeParams {
  openingShape: OpeningShape; radiusX: number; radiusZ: number; sides: number; starInner: number;
}

export interface ArenaData {
  name: string;
  openingShape: OpeningShape; wallProfile: WallProfile;
  radiusX: number; radiusZ: number; depth: number;
  sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  posX: number; posZ: number; posY: number; rotY: number;
  /* Moat */
  isMoat:             boolean;
  innerRadiusX:       number; innerRadiusZ: number;
  innerOpeningShape:  OpeningShape;
  innerSides:         number; innerStarInner: number;
  innerWallProfile:   WallProfile;
  innerRimOffset:     number;   // inner rim Y = baseY + offset (+ve = taller island)
  /* Children */
  pitIds: string[]; zoneIds: string[];
  /* Three.js */
  mesh: THREE.Mesh; edges: THREE.LineSegments;
  floorMesh: THREE.Mesh | null;
  islandMesh: THREE.Mesh | null;
}

export interface PitData {
  id: string; name: string; parentArenaId: string;
  /** Direct parent — exactly one of these is non-null (the other two null) */
  parentPitId:  string | null; parentZoneId: string | null;
  openingShape: OpeningShape; wallProfile: WallProfile;
  radiusX: number; radiusZ: number; depth: number;
  sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  posR: number; posAngle: number; rotY: number;
  isMoat: boolean;
  innerRadiusX: number; innerRadiusZ: number;
  innerOpeningShape: OpeningShape;
  innerSides: number; innerStarInner: number;
  innerWallProfile: WallProfile;
  innerRimOffset: number;
  /** Nested children */
  pitIds: string[]; zoneIds: string[];
  mesh: THREE.Mesh; edges: THREE.LineSegments;
}

export interface ZoneData {
  id: string; name: string; parentArenaId: string;
  /** Direct parent — exactly one of these is non-null (the other two null) */
  parentPitId:  string | null; parentZoneId: string | null;
  openingShape: OpeningShape;
  radiusX: number; radiusZ: number; depth: number;
  sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  fill: ZoneFill; fillColor: number | null; fillOpacity: number; fillGlow: boolean;
  posR: number; posAngle: number; rotY: number;
  isMoat: boolean;
  innerRadiusX: number; innerRadiusZ: number;
  innerOpeningShape: OpeningShape;
  innerSides: number; innerStarInner: number;
  innerWallProfile: WallProfile;
  innerRimOffset: number;
  /** Nested children */
  pitIds: string[]; zoneIds: string[];
  mesh: THREE.Mesh; edges: THREE.LineSegments;
  fillMesh: THREE.Mesh; fillLight: THREE.PointLight | null;
  /** Stencil cap — clips fillMesh to the zone opening. Runtime-only, never serialized. */
  maskMesh: THREE.Mesh;
}

/* ── ChildHole — used to punch holes in arena bowl mesh ─────────────────── */
export interface ChildHole {
  cx: number; cz: number;   // child centre in arena geometry local space (XZ)
  rx: number; rz: number;   // shape half-radii for ellipse test
  rotY: number;              // shape self-rotation (rad) for oriented ellipse
}
export function inChildHole(x: number, z: number, holes: ChildHole[]): boolean {
  for (const h of holes) {
    const dx = x - h.cx; const dz = z - h.cz;
    const c = Math.cos(-h.rotY); const s = Math.sin(-h.rotY);
    const lx = dx * c - dz * s; const lz = dx * s + dz * c;
    if ((lx / h.rx) ** 2 + (lz / h.rz) ** 2 <= 1.08) return true;
  }
  return false;
}

export interface IslandHole { cx: number; cz: number; rx: number; rz: number; }

/* ── 2-D opening shape points ────────────────────────────────────────────── */
export function shapePoints(data: ShapeParams): THREE.Vector2[] {
  const { radiusX: rx, radiusZ: rz, openingShape, sides, starInner } = data;
  const pts: THREE.Vector2[] = [];
  switch (openingShape) {
    case 'circle': case 'ellipse': { const N=96; for(let i=0;i<N;i++){const θ=i/N*TWO_PI;pts.push(new THREE.Vector2(rx*Math.cos(θ),rz*Math.sin(θ)));} break; }
    case 'rectangle': pts.push(new THREE.Vector2(rx,rz),new THREE.Vector2(-rx,rz),new THREE.Vector2(-rx,-rz),new THREE.Vector2(rx,-rz)); break;
    case 'hexagon': for(let i=0;i<6;i++){const θ=i/6*TWO_PI+Math.PI/6;pts.push(new THREE.Vector2(rx*Math.cos(θ),rz*Math.sin(θ)));} break;
    case 'triangle': for(let i=0;i<3;i++){const θ=i/3*TWO_PI-Math.PI/2;pts.push(new THREE.Vector2(rx*Math.cos(θ),rz*Math.sin(θ)));} break;
    case 'star': { const n=Math.max(3,Math.min(12,Math.round(sides))); const inner=Math.max(0.1,Math.min(0.95,starInner)); for(let i=0;i<n*2;i++){const θ=i/(n*2)*TWO_PI-Math.PI/2;const r=i%2===0?1:inner;pts.push(new THREE.Vector2(rx*r*Math.cos(θ),rz*r*Math.sin(θ)));} break; }
  }
  return pts;
}

/**
 * Resample a closed polygon to exactly N evenly-spaced points along its perimeter.
 * Allows mixing shapes with different vertex counts (e.g. circle outer, hexagon inner).
 */
export function resamplePts(pts: THREE.Vector2[], N: number): THREE.Vector2[] {
  if (pts.length === N) return pts;
  const M = pts.length;
  // cumulative perimeter distances
  const dist: number[] = [0];
  for (let i = 0; i < M; i++) {
    const a = pts[i]; const b = pts[(i + 1) % M];
    dist.push(dist[i] + Math.hypot(b.x - a.x, b.y - a.y));
  }
  const total = dist[M];
  const out: THREE.Vector2[] = [];
  for (let k = 0; k < N; k++) {
    const target = (k / N) * total;
    // find which segment contains target
    let seg = 0;
    for (let i = 0; i < M; i++) { if (dist[i + 1] >= target) { seg = i; break; } }
    const segLen = dist[seg + 1] - dist[seg];
    const t = segLen > 0 ? (target - dist[seg]) / segLen : 0;
    const a = pts[seg]; const b = pts[(seg + 1) % M];
    out.push(new THREE.Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
  }
  return out;
}

/* ── Arena surface Y at child radial position ────────────────────────────── */
export function childArenaBaseY(arena: ArenaData, posR: number): number {
  const H = OCTAGON_BASE.height + arena.posY;
  if (arena.wallProfile === 'straight') return H - arena.depth;
  const maxR = Math.max(arena.radiusX, arena.radiusZ, 0.001);
  const t = Math.min(posR / maxR, 1);
  return H - arena.depth * (1 - t * t);
}

/**
 * Arena world-space surface Y at a given arena-local XZ position.
 * Used by scoop geometry to make pits/zones conform to the bowl curvature.
 */
export function arenaSurfaceYAtArenaLocal(arena: ArenaData, alx: number, alz: number): number {
  const H = OCTAGON_BASE.height + arena.posY;
  if (arena.wallProfile === 'straight') return H - arena.depth;
  const t = Math.min(Math.sqrt((alx / arena.radiusX) ** 2 + (alz / arena.radiusZ) ** 2), 1);
  return H - arena.depth * (1 - t * t);
}

/**
 * Compute the surface Y for a nested child at arena-local position (alx, alz)
 * using the parent pit/zone's own floor surface.
 * The parent's floor at its center is: parentSurfY - parentDepth*(1 - t²)
 * where t = distance/parentMaxRadius.
 */
export function parentSurfaceY(
  parent: PitData | ZoneData,
  arena: ArenaData,
  alx: number, alz: number,
): number {
  // parent's center in arena-local coordinates
  const pCX = parent.posR * Math.cos(parent.posAngle * DEG2RAD);
  const pCZ = parent.posR * Math.sin(parent.posAngle * DEG2RAD);
  // parent's surface Y at (alx, alz) in arena-local space
  const parentSurfAtCenter = arenaSurfaceYAtArenaLocal(arena, pCX, pCZ);
  // position relative to parent center, un-rotated
  const pRotY = parent.rotY * DEG2RAD;
  const cosP = Math.cos(-pRotY); const sinP = Math.sin(-pRotY);
  const dx = alx - pCX; const dz = alz - pCZ;
  const lx = dx * cosP - dz * sinP; const lz = dx * sinP + dz * cosP;
  // parabolic t within parent
  const maxR = Math.max(parent.radiusX, parent.radiusZ, 0.001);
  const t = Math.min(Math.sqrt((lx / parent.radiusX) ** 2 + (lz / parent.radiusZ) ** 2), 1);
  void maxR; // suppress unused-var warning
  return parentSurfAtCenter - parent.depth * (1 - t * t);
}

/**
 * Surface-conforming bowl for pits/zones.
 * Each vertex Y = surf(x,z) - depression(t) so the rim sits flush with
 * (actually RIM_EPS above) the parent surface and the bowl dips below it.
 * pitCX/pitCZ: pit centre in arena-local XZ.
 * pitRotY: pit self-rotation in radians (NOT arena.rotY — that cancels out).
 * surfFn: function returning world-space Y for a given arena-local (x,z).
 */
export function buildScoopGeometry(
  pts: THREE.Vector2[], depth: number, profile: WallProfile,
  pitCX: number, pitCZ: number, pitRotY: number,
  surfFn: (alx: number, alz: number) => number,
  RIM_EPS = 0.02,
): THREE.BufferGeometry {
  const N = pts.length;
  const RINGS = 36;
  const cosR = Math.cos(pitRotY); const sinR = Math.sin(pitRotY);

  function surfY(lx: number, lz: number): number {
    return surfFn(
      pitCX + lx * cosR - lz * sinR,
      pitCZ + lx * sinR + lz * cosR,
    );
  }

  const pos: number[] = [];
  const idx: number[] = [];
  const centerSurfY = surfY(0, 0);

  if (profile === 'parabolic') {
    // Center vertex at bottom of scoop
    pos.push(0, centerSurfY - depth, 0);
    for (let r = 1; r <= RINGS; r++) {
      const t = r / RINGS;
      for (let i = 0; i < N; i++) {
        const lx = pts[i].x * t; const lz = pts[i].y * t;
        const sy = surfY(lx, lz);
        // y = sy - depth*(1-t²) + RIM_EPS*t²
        // → at t=1: sy+RIM_EPS (rim above surface), at t=0: centerSurfY-depth (bowl bottom)
        pos.push(lx, sy - depth * (1 - t * t) + RIM_EPS * t * t, lz);
      }
    }
    // Center fan — CCW from above so the bowl bottom is front-facing toward the camera
    for (let i = 0; i < N; i++) idx.push(0, 1 + i, 1 + (i + 1) % N);
    // Ring strips
    for (let r = 1; r < RINGS; r++) {
      const b0 = 1 + (r - 1) * N; const b1 = 1 + r * N;
      for (let i = 0; i < N; i++) {
        const a0=b0+i,c0=b0+(i+1)%N,a1=b1+i,c1=b1+(i+1)%N;
        idx.push(a0, c0, a1, c0, c1, a1);
      }
    }
  } else {
    // Straight: rim ring at surfY+eps, then wall rings down, then floor fan
    // Wall rings: keep same XZ as rim (full radius), Y decreases linearly from rim to floor
    const floorY = centerSurfY - depth;
    const WALLS = 6;
    // Rim (ring 0)
    for (let i = 0; i < N; i++) {
      pos.push(pts[i].x, surfY(pts[i].x, pts[i].y) + RIM_EPS, pts[i].y);
    }
    // Wall rings 1..WALLS (XZ = rim, Y decreases)
    for (let w = 1; w <= WALLS; w++) {
      const frac = w / WALLS;
      for (let i = 0; i < N; i++) {
        const sy = surfY(pts[i].x, pts[i].y);
        pos.push(pts[i].x, sy + RIM_EPS - (sy + RIM_EPS - floorY) * frac, pts[i].y);
      }
    }
    // Center floor vertex
    const floorVtx = (WALLS + 1) * N;
    pos.push(0, floorY, 0);
    // Wall strips: rim→wall rings
    for (let w = 0; w < WALLS; w++) {
      const b0 = w * N; const b1 = (w + 1) * N;
      for (let i = 0; i < N; i++) {
        const a0=b0+i,c0=b0+(i+1)%N,a1=b1+i,c1=b1+(i+1)%N;
        idx.push(a0, a1, c0, c0, a1, c1);
      }
    }
    // Floor fan — winding reversed so normals face up toward camera
    const lastRing = WALLS * N;
    for (let i = 0; i < N; i++) idx.push(floorVtx, lastRing + (i + 1) % N, lastRing + i);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** Edge lines for a surface-conforming scoop. */
export function buildScoopEdgeLines(
  pts: THREE.Vector2[], depth: number, profile: WallProfile,
  pitCX: number, pitCZ: number, pitRotY: number,
  surfFn: (alx: number, alz: number) => number,
  RIM_EPS = 0.02,
): THREE.BufferGeometry {
  const N = pts.length;
  const cosR = Math.cos(pitRotY); const sinR = Math.sin(pitRotY);
  function surfY(lx: number, lz: number): number {
    return surfFn(
      pitCX + lx * cosR - lz * sinR,
      pitCZ + lx * sinR + lz * cosR,
    );
  }
  const v: number[] = [];
  const centerSurfY = surfY(0, 0);
  const bottomY = centerSurfY - depth;
  // Rim loop
  for (let i = 0; i < N; i++) {
    const a = pts[i]; const b = pts[(i + 1) % N];
    const ay = surfY(a.x, a.y) + RIM_EPS;
    const by = surfY(b.x, b.y) + RIM_EPS;
    v.push(a.x, ay, a.y, b.x, by, b.y);
  }
  // Depth guides at ~8 evenly-spaced rim vertices
  const step = Math.max(1, Math.floor(N / 8));
  for (let i = 0; i < N; i += step) {
    const p = pts[i]; const rimY = surfY(p.x, p.y) + RIM_EPS;
    if (profile === 'parabolic') {
      for (let s = 0; s < 12; s++) {
        const t0 = s / 12; const t1 = (s + 1) / 12;
        const sy0 = surfY(p.x * t0, p.y * t0); const sy1 = surfY(p.x * t1, p.y * t1);
        const y0 = t0 === 0 ? bottomY : sy0 - depth * (1 - t0 * t0) + RIM_EPS * t0 * t0;
        const y1 = t1 === 1 ? rimY    : sy1 - depth * (1 - t1 * t1) + RIM_EPS * t1 * t1;
        v.push(p.x * t0, y0, p.y * t0, p.x * t1, y1, p.y * t1);
      }
    } else {
      v.push(p.x, rimY, p.y, p.x, bottomY, p.y);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

/* ── Geometry builders ───────────────────────────────────────────────────── */

/**
 * Parabolic bowl: opening at y=baseY, deepest at y=baseY−depth.
 * When holes[] is provided, triangles whose centroid falls inside a hole are skipped
 * (leaves openings in the bowl surface where pits/zones cut through).
 */
export function buildParabolicBowl(
  pts: THREE.Vector2[], depth: number,
  baseY = OCTAGON_BASE.height,
  holes: ChildHole[] = [],
): THREE.BufferGeometry {
  const N = pts.length;
  const RINGS = holes.length > 0 ? 128 : 64;
  const pos: number[] = []; const idx: number[] = [];
  pos.push(0, baseY - depth, 0);
  for (let r = 1; r <= RINGS; r++) {
    const t = r / RINGS; const y = baseY - depth * (1 - t * t);
    for (let i = 0; i < N; i++) pos.push(pts[i].x * t, y, pts[i].y * t);
  }
  const hasHoles = holes.length > 0;
  // Center fan
  for (let i = 0; i < N; i++) {
    const a = 1 + i; const b = 1 + (i + 1) % N;
    if (hasHoles) {
      const cx = (pos[0] + pos[a*3] + pos[b*3]) / 3;
      const cz = (pos[2] + pos[a*3+2] + pos[b*3+2]) / 3;
      if (inChildHole(cx, cz, holes)) continue;
    }
    idx.push(0, 1 + (i + 1) % N, 1 + i);
  }
  // Ring strips
  for (let r = 1; r < RINGS; r++) {
    const b0 = 1 + (r - 1) * N; const b1 = 1 + r * N;
    for (let i = 0; i < N; i++) {
      const a0 = b0 + i; const c0 = b0 + (i + 1) % N;
      const a1 = b1 + i; const c1 = b1 + (i + 1) % N;
      if (hasHoles) {
        const qx = (pos[a0*3] + pos[c0*3] + pos[a1*3] + pos[c1*3]) / 4;
        const qz = (pos[a0*3+2] + pos[c0*3+2] + pos[a1*3+2] + pos[c1*3+2]) / 4;
        if (inChildHole(qx, qz, holes)) continue;
      }
      idx.push(a0, c0, a1, c0, c1, a1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

export function buildStraightCut(pts: THREE.Vector2[], depth: number, baseY = OCTAGON_BASE.height): THREE.BufferGeometry {
  const N = pts.length;
  const pos: number[] = []; const idx: number[] = [];
  for (const p of pts) pos.push(p.x, baseY, p.y);
  for (const p of pts) pos.push(p.x, baseY - depth, p.y);
  pos.push(0, baseY - depth, 0);
  for (let i = 0; i < N; i++) {
    const t0=i,t1=(i+1)%N,b0=N+i,b1=N+(i+1)%N;
    idx.push(t0,t1,b0,t1,b1,b0);
  }
  for (let i = 0; i < N; i++) idx.push(2*N, N+(i+1)%N, N+i);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

export function buildEdgeLines(pts: THREE.Vector2[], depth: number, profile: WallProfile, baseY = OCTAGON_BASE.height): THREE.BufferGeometry {
  const N = pts.length; const v: number[] = [];
  // Rim loop
  for (let i = 0; i < N; i++) {
    const a = pts[i]; const b = pts[(i+1)%N];
    v.push(a.x,baseY,a.y,b.x,baseY,b.y);
  }
  if (profile === 'straight') {
    // Floor loop + vertical pillars at ~8 points
    for (let i = 0; i < N; i++) {
      const a=pts[i],b=pts[(i+1)%N];
      v.push(a.x,baseY-depth,a.y,b.x,baseY-depth,b.y);
    }
    const step=Math.max(1,Math.floor(N/8));
    for (let i = 0; i < N; i+=step) v.push(pts[i].x,baseY,pts[i].y,pts[i].x,baseY-depth,pts[i].y);
  }
  // parabolic: rim loop only — no interior spider-web guides
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

/**
 * Unified moat geometry builder.
 * outer rim at baseY, valley at baseY−depth, inner rim at baseY+innerRimOffset.
 * outerProfile controls outer wall shape, innerProfile controls inner wall shape.
 * Each half can independently be parabolic (bowl-curved, XZ slides toward valley)
 * or straight (vertical wall — XZ stays fixed, requires an explicit floor strip).
 */
export function buildMoatGeometry(
  outerPts: THREE.Vector2[], _innerPts: THREE.Vector2[],
  depth: number,
  outerProfile: WallProfile, innerProfile: WallProfile,
  innerRimOffset: number,
  baseY = OCTAGON_BASE.height,
): THREE.BufferGeometry {
  const N = outerPts.length;
  const innerPts = resamplePts(_innerPts, N);
  const HALF = 20;  // rings per section
  const valleyY   = baseY - depth;
  const innerRimY = baseY + innerRimOffset;
  const innerRise = depth + innerRimOffset;

  const midPts = outerPts.map((op, i) => new THREE.Vector2(
    (op.x + innerPts[i].x) / 2, (op.y + innerPts[i].y) / 2,
  ));

  const allRings: [number, number, number][][] = [];

  // ── Outer section: outer rim → valley ──
  const outerEndXZ = outerProfile === 'parabolic' ? midPts : outerPts;
  for (let r = 0; r <= HALF; r++) {
    const b = r / HALF;
    const t = 1 - b;
    const y = outerProfile === 'parabolic'
      ? baseY - depth * (1 - t * t)   // steep at rim, flat at valley
      : baseY - depth * b;             // linear
    const row: [number,number,number][] = [];
    for (let i = 0; i < N; i++) {
      row.push([
        outerPts[i].x*(1-b) + outerEndXZ[i].x*b,
        y,
        outerPts[i].y*(1-b) + outerEndXZ[i].y*b,
      ]);
    }
    allRings.push(row);
  }

  // ── Floor strip (only when at least one wall is straight) ──
  if (outerProfile === 'straight' || innerProfile === 'straight') {
    const innerStartXZ = innerProfile === 'parabolic' ? midPts : innerPts;
    const FLOOR = 8;
    for (let r = 1; r <= FLOOR; r++) {
      const b = r / FLOOR;
      const row: [number,number,number][] = [];
      for (let i = 0; i < N; i++) {
        row.push([
          outerEndXZ[i].x*(1-b) + innerStartXZ[i].x*b,
          valleyY,
          outerEndXZ[i].y*(1-b) + innerStartXZ[i].y*b,
        ]);
      }
      allRings.push(row);
    }

    const innerStartRef = innerProfile === 'parabolic' ? midPts : innerPts;
    for (let r = 1; r <= HALF; r++) {
      const b = r / HALF;
      const y = innerProfile === 'parabolic'
        ? valleyY + innerRise * b * b
        : valleyY + innerRise * b;
      const row: [number,number,number][] = [];
      for (let i = 0; i < N; i++) {
        row.push([
          innerStartRef[i].x*(1-b) + innerPts[i].x*b,
          y,
          innerStartRef[i].y*(1-b) + innerPts[i].y*b,
        ]);
      }
      allRings.push(row);
    }
  } else {
    // Both parabolic: no floor strip
    for (let r = 1; r <= HALF; r++) {
      const b = r / HALF;
      const y = valleyY + innerRise * b * b;
      const row: [number,number,number][] = [];
      for (let i = 0; i < N; i++) {
        row.push([
          midPts[i].x*(1-b) + innerPts[i].x*b,
          y,
          midPts[i].y*(1-b) + innerPts[i].y*b,
        ]);
      }
      allRings.push(row);
    }
  }

  const pos: number[] = [];
  for (const ring of allRings) for (const v of ring) pos.push(v[0], v[1], v[2]);

  const idx: number[] = [];
  const TOTAL = allRings.length;
  for (let r = 0; r < TOTAL - 1; r++) {
    const b0 = r * N; const b1 = (r+1) * N;
    for (let i = 0; i < N; i++) {
      const a0=b0+i,c0=b0+(i+1)%N,a1=b1+i,c1=b1+(i+1)%N;
      idx.push(a0,c0,a1,c0,c1,a1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

export function buildMoatEdgeLines(
  outerPts: THREE.Vector2[], _innerPts: THREE.Vector2[],
  depth: number, innerRimOffset: number, baseY = OCTAGON_BASE.height,
): THREE.BufferGeometry {
  const N = outerPts.length;
  const innerPts = resamplePts(_innerPts, N);
  const v: number[] = [];
  const innerRimY = baseY + innerRimOffset;
  const step = Math.max(1, Math.floor(N / 8));
  // Outer: rim loop + floor loop + ~8 vertical pillars
  for (let i = 0; i < N; i++) {
    const a=outerPts[i],b=outerPts[(i+1)%N];
    v.push(a.x,baseY,a.y,b.x,baseY,b.y);
    v.push(a.x,baseY-depth,a.y,b.x,baseY-depth,b.y);
    if (i % step === 0) v.push(a.x,baseY,a.y,a.x,baseY-depth,a.y);
  }
  // Inner: rim loop + floor loop + ~8 vertical pillars
  for (let i = 0; i < N; i++) {
    const a=innerPts[i],b=innerPts[(i+1)%N];
    v.push(a.x,innerRimY,a.y,b.x,innerRimY,b.y);
    v.push(a.x,baseY-depth,a.y,b.x,baseY-depth,b.y);
    if (i % step === 0) v.push(a.x,innerRimY,a.y,a.x,baseY-depth,a.y);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

/** Self-contained arena: interior bowl + outer skirt walls + bottom cap. posY applied by mesh.position. */
export function buildFreeArenaMesh(pts: THREE.Vector2[], depth: number, wallProfile: WallProfile, baseY = OCTAGON_BASE.height, holes: ChildHole[] = []): THREE.BufferGeometry {
  const N = pts.length;
  const floorY = baseY - depth;
  const pos: number[] = [];
  const idx: number[] = [];
  let base = 0;

  // Interior bowl
  if (wallProfile === 'parabolic') {
    const RINGS = holes.length > 0 ? 128 : 48;
    pos.push(0, floorY, 0); // center
    for (let r = 1; r <= RINGS; r++) {
      const t = r / RINGS;
      const y = baseY - depth * (1 - t * t);
      for (let i = 0; i < N; i++) pos.push(pts[i].x * t, y, pts[i].y * t);
    }
    // center fan
    for (let i = 0; i < N; i++) {
      const a = 1 + i, b = 1 + (i + 1) % N;
      if (holes.length > 0) {
        const cx = (pos[0] + pos[a*3] + pos[b*3]) / 3;
        const cz = (pos[2] + pos[a*3+2] + pos[b*3+2]) / 3;
        if (inChildHole(cx, cz, holes)) continue;
      }
      idx.push(base + 0, base + b, base + a);
    }
    // ring strips
    for (let r = 1; r < RINGS; r++) {
      const b0 = base + 1 + (r - 1) * N, b1 = base + 1 + r * N;
      for (let i = 0; i < N; i++) {
        const a0 = b0 + i, c0 = b0 + (i + 1) % N, a1 = b1 + i, c1 = b1 + (i + 1) % N;
        if (holes.length > 0) {
          const qx = (pos[a0*3] + pos[c0*3] + pos[a1*3] + pos[c1*3]) / 4;
          const qz = (pos[a0*3+2] + pos[c0*3+2] + pos[a1*3+2] + pos[c1*3+2]) / 4;
          if (inChildHole(qx, qz, holes)) continue;
        }
        idx.push(a0, c0, a1, c0, c1, a1);
      }
    }
    base += 1 + RINGS * N;
  } else {
    // straight interior
    const rimB = base;
    for (const p of pts) pos.push(p.x, baseY, p.y);
    const flrB = rimB + N;
    for (const p of pts) pos.push(p.x, floorY, p.y);
    for (let i = 0; i < N; i++) {
      const t0=rimB+i, t1=rimB+(i+1)%N, b0=flrB+i, b1=flrB+(i+1)%N;
      idx.push(t0, t1, b0, t1, b1, b0);
    }
    // interior floor fan (with hole skipping)
    const fc = flrB + N;
    pos.push(0, floorY, 0);
    for (let i = 0; i < N; i++) {
      if (holes.length > 0 && inChildHole((pts[i].x + pts[(i+1)%N].x) / 3, (pts[i].y + pts[(i+1)%N].y) / 3, holes)) continue;
      idx.push(fc, flrB + i, flrB + (i + 1) % N);
    }
    base = fc + 1;
  }

  // Outer skirt (vertical walls, outward-facing)
  const outerRimB = base;
  for (const p of pts) pos.push(p.x, baseY, p.y);
  const outerFlrB = outerRimB + N;
  for (const p of pts) pos.push(p.x, floorY, p.y);
  for (let i = 0; i < N; i++) {
    const t0=outerRimB+i, t1=outerRimB+(i+1)%N, b0=outerFlrB+i, b1=outerFlrB+(i+1)%N;
    idx.push(t0, b0, t1, t1, b0, b1);  // reversed winding = outward normals
  }
  base = outerFlrB + N;

  // Bottom cap (facing down)
  const capCtr = base;
  pos.push(0, floorY, 0);
  const capRim = capCtr + 1;
  for (const p of pts) pos.push(p.x, floorY, p.y);
  for (let i = 0; i < N; i++) {
    idx.push(capCtr, capRim + i, capRim + (i + 1) % N);  // downward normal
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** Edge lines for a free-floating arena: rim loop + floor loop + vertical pillars. */
export function buildFreeArenaEdges(pts: THREE.Vector2[], depth: number, baseY = OCTAGON_BASE.height): THREE.BufferGeometry {
  const N = pts.length;
  const floorY = baseY - depth;
  const v: number[] = [];
  for (let i = 0; i < N; i++) {
    const a = pts[i], b = pts[(i + 1) % N];
    v.push(a.x, baseY, a.y, b.x, baseY, b.y);
    v.push(a.x, floorY, a.y, b.x, floorY, b.y);
  }
  const step = Math.max(1, Math.floor(N / 8));
  for (let i = 0; i < N; i += step) {
    v.push(pts[i].x, baseY, pts[i].y, pts[i].x, floorY, pts[i].y);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

/** Top face of base — polygon with actual voids for arena openings. */
export function buildTopFaceGeo(
  baseSides: number, baseRadius: number, align: number,
  baseHeight: number, arenas: ArenaData[],
): THREE.BufferGeometry {
  const outerPts: THREE.Vector2[] = [];
  for (let i = 0; i < baseSides; i++) {
    const a = i/baseSides*TWO_PI+align;
    outerPts.push(new THREE.Vector2(baseRadius*Math.cos(a),baseRadius*Math.sin(a)));
  }
  const shape = new THREE.Shape(outerPts);
  for (const arena of arenas) {
    if (arena.posY > 0.5) continue;  // elevated arenas — no top-face hole
    // Skip if center sits inside a LARGER arena (that arena's hole already exposes the area)
    const aMaxR = Math.max(arena.radiusX, arena.radiusZ);
    const insideOther = arenas.some(other => {
      if (other === arena || other.posY > 0.5) return false;
      if (Math.max(other.radiusX, other.radiusZ) <= aMaxR) return false; // other is not larger
      const dx = arena.posX - other.posX;
      const dz = arena.posZ - other.posZ;
      const cosR = Math.cos(-other.rotY), sinR = Math.sin(-other.rotY);
      const lx = dx * cosR - dz * sinR, lz = dx * sinR + dz * cosR;
      return (lx / other.radiusX) ** 2 + (lz / other.radiusZ) ** 2 <= 1.0;
    });
    if (insideOther) continue;
    const local = shapePoints(arena);
    const cos=Math.cos(arena.rotY),sin=Math.sin(arena.rotY);
    const holePts = local.map(p=>new THREE.Vector2(p.x*cos-p.y*sin+arena.posX,p.x*sin+p.y*cos+arena.posZ)).reverse();
    shape.holes.push(new THREE.Path(holePts));
  }
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(Math.PI/2); geo.translate(0,baseHeight,0);
  return geo;
}

/** Flat arena floor for straight-wall arenas, with pit+zone holes. */
export function buildArenaFloorGeo(arena: ArenaData, pits: PitData[], zones: ZoneData[]): THREE.BufferGeometry {
  const floorY = OCTAGON_BASE.height - arena.depth;
  const cosA=Math.cos(arena.rotY),sinA=Math.sin(arena.rotY);
  const outerShape2D = shapePoints(arena).map(p=>new THREE.Vector2(p.x*cosA-p.y*sinA,p.x*sinA+p.y*cosA));
  const floorShape = new THREE.Shape(outerShape2D);
  for (const child of [...pits,...zones]) {
    const localX=child.posR*Math.cos(child.posAngle*DEG2RAD);
    const localZ=child.posR*Math.sin(child.posAngle*DEG2RAD);
    const wox=localX*cosA-localZ*sinA, woz=localX*sinA+localZ*cosA;
    const cosC=Math.cos(child.rotY*DEG2RAD),sinC=Math.sin(child.rotY*DEG2RAD);
    const holePts=shapePoints(child).map(p=>new THREE.Vector2(p.x*cosC-p.y*sinC+wox,p.x*sinC+p.y*cosC+woz)).reverse();
    floorShape.holes.push(new THREE.Path(holePts));
  }
  const geo = new THREE.ShapeGeometry(floorShape);
  geo.rotateX(Math.PI/2); geo.translate(0,floorY,0);
  return geo;
}

/** Island cap for moat: flat disc at Y = baseY + innerRimOffset, with optional holes for child arenas. */
export function buildIslandCapGeo(arena: ArenaData, holes: IslandHole[] = []): THREE.BufferGeometry {
  const H = OCTAGON_BASE.height + arena.innerRimOffset;  // posY applied by islandMesh.position
  const innerPts = shapePoints({ openingShape:arena.innerOpeningShape, radiusX:arena.innerRadiusX, radiusZ:arena.innerRadiusZ, sides:arena.innerSides, starInner:arena.innerStarInner });
  const shape = new THREE.Shape(innerPts);
  for (const h of holes) {
    const holePath = new THREE.Path();
    holePath.absellipse(h.cx, h.cz, h.rx, h.rz, 0, TWO_PI, false, 0);
    shape.holes.push(holePath);
  }
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(Math.PI/2); geo.translate(0,H,0);
  return geo;
}

/** Flat polygon for zone liquid surface matching the exact zone opening outline.
 *  Stencil masking clips the fill to the visible zone opening from any camera angle.
 */
export function buildZoneFillGeo(zone: ZoneData): THREE.BufferGeometry {
  const outerPts = shapePoints(zone);
  const shape = new THREE.Shape(outerPts.map(p => new THREE.Vector2(p.x, p.y)));
  if (zone.isMoat) {
    const innerPts = shapePoints({ openingShape: zone.innerOpeningShape, radiusX: zone.innerRadiusX, radiusZ: zone.innerRadiusZ, sides: zone.innerSides, starInner: zone.innerStarInner });
    shape.holes.push(new THREE.Path(innerPts.map(p => new THREE.Vector2(p.x, p.y))));
  }
  const geo = new THREE.ShapeGeometry(shape, 32);
  geo.rotateX(Math.PI / 2);
  return geo;
}

export function buildFillShaderMaterial(fc: { color: number; opacity: number; emissive: number; emissiveIntensity: number }, wave: WaveParams, stencilRef = 0): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: {value:0}, uAmplitude:{value:wave.amplitude}, uFrequency:{value:wave.frequency},
      uSpeed:{value:wave.speed}, uTurbulence:{value:wave.turbulence},
      uColor:{value:new THREE.Color(fc.color)}, uOpacity:{value:fc.opacity},
      uEmissive:{value:new THREE.Color(fc.emissive)}, uEmissiveIntensity:{value:fc.emissiveIntensity},
    },
    vertexShader: WAVE_VERT, fragmentShader: WAVE_FRAG,
    transparent: true, side: THREE.DoubleSide, depthWrite: false,
    stencilWrite: false,
    stencilRef,
    stencilFunc: stencilRef > 0 ? THREE.EqualStencilFunc : THREE.AlwaysStencilFunc,
  });
}

/* ── World-space position for pit/zone relative to arena ─────────────────── */
export function childWorldPos(arena: ArenaData, child: { posR: number; posAngle: number; rotY: number }): { wx: number; wz: number; wRotY: number } {
  const localX = child.posR*Math.cos(child.posAngle*DEG2RAD);
  const localZ = child.posR*Math.sin(child.posAngle*DEG2RAD);
  const cosA=Math.cos(arena.rotY),sinA=Math.sin(arena.rotY);
  return {
    wx: arena.posX + localX*cosA - localZ*sinA,
    wz: arena.posZ + localX*sinA + localZ*cosA,
    wRotY: arena.rotY + child.rotY*DEG2RAD,
  };
}

/* ── Surface function factory ─────────────────────────────────────────────── */
/**
 * Returns the appropriate surface-Y function for a pit/zone given its parentage.
 * If it has a direct pit/zone parent, the floor of that parent is the reference.
 * Otherwise the arena bowl surface is used.
 */
export function makeSurfFn(
  pit: { parentPitId: string | null; parentZoneId: string | null },
  arena: ArenaData,
  pits: Map<string, PitData>,
  zones: Map<string, ZoneData>,
): (alx: number, alz: number) => number {
  if (pit.parentPitId) {
    const parentPit = pits.get(pit.parentPitId);
    if (parentPit) return (alx, alz) => parentSurfaceY(parentPit, arena, alx, alz);
  }
  if (pit.parentZoneId) {
    const parentZone = zones.get(pit.parentZoneId);
    if (parentZone) return (alx, alz) => parentSurfaceY(parentZone, arena, alx, alz);
  }
  return (alx, alz) => arenaSurfaceYAtArenaLocal(arena, alx, alz);
}

export function zoneFillConfig(zone: ZoneData): { color: number; opacity: number; emissive: number; emissiveIntensity: number; glowColor: number | null } {
  if (zone.fill === 'custom')
    return { color:zone.fillColor??0xffffff, opacity:zone.fillOpacity, emissive:0x000000, emissiveIntensity:0, glowColor:null };
  const p = FILL_PRESET[zone.fill];
  return { color:p.color, opacity:p.opacity, emissive:p.emissive, emissiveIntensity:p.emissiveIntensity, glowColor:p.glowColor };
}

/* ── Build arena Three.js objects ────────────────────────────────────────── */
export function buildArenaObjects(data: ArenaData, holes: ChildHole[] = []): [THREE.Mesh, THREE.LineSegments] {
  const pts = shapePoints(data);
  const mat = buildSurfaceMaterial({ color:data.color, surface:data.surface, customTileData:data.customTileData, tileScale:data.tileScale });
  let meshGeo: THREE.BufferGeometry;
  let edgeGeo: THREE.BufferGeometry;
  const baseY = OCTAGON_BASE.height;  // geometry local Y; mesh.posY handles elevation

  if (data.isMoat) {
    const innerPts = shapePoints({ openingShape:data.innerOpeningShape, radiusX:data.innerRadiusX, radiusZ:data.innerRadiusZ, sides:data.innerSides, starInner:data.innerStarInner });
    meshGeo = buildMoatGeometry(pts, innerPts, data.depth, data.wallProfile, data.innerWallProfile, data.innerRimOffset, baseY);
    edgeGeo = buildMoatEdgeLines(pts, innerPts, data.depth, data.innerRimOffset, baseY);
  } else if (data.posY > 0.5) {
    // elevated (e.g. on moat island) — self-contained container, no connection to octagon
    meshGeo = buildFreeArenaMesh(pts, data.depth, data.wallProfile, baseY, holes);
    edgeGeo = buildFreeArenaEdges(pts, data.depth, baseY);
  } else {
    meshGeo = data.wallProfile === 'parabolic'
      ? buildParabolicBowl(pts, data.depth, baseY, holes)
      : buildStraightCut(pts, data.depth, baseY);
    edgeGeo = buildEdgeLines(pts, data.depth, data.wallProfile, baseY);
  }

  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(data.posX, data.posY, data.posZ);
  mesh.rotation.y = data.rotY;
  const edgeCol = new THREE.Color(data.color).lerp(new THREE.Color(0xffffff), 0.5);
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
  edges.position.set(data.posX, data.posY, data.posZ);
  edges.rotation.y = data.rotY;
  return [mesh, edges];
}

export function applyArena(data: ArenaData, holes: ChildHole[] = []): void {
  const pts = shapePoints(data);
  data.mesh.geometry.dispose(); data.edges.geometry.dispose();
  const baseY = OCTAGON_BASE.height;
  if (data.isMoat) {
    const innerPts = shapePoints({ openingShape:data.innerOpeningShape, radiusX:data.innerRadiusX, radiusZ:data.innerRadiusZ, sides:data.innerSides, starInner:data.innerStarInner });
    data.mesh.geometry  = buildMoatGeometry(pts, innerPts, data.depth, data.wallProfile, data.innerWallProfile, data.innerRimOffset, baseY);
    data.edges.geometry = buildMoatEdgeLines(pts, innerPts, data.depth, data.innerRimOffset, baseY);
  } else if (data.posY > 0.5) {
    data.mesh.geometry  = buildFreeArenaMesh(pts, data.depth, data.wallProfile, baseY, holes);
    data.edges.geometry = buildFreeArenaEdges(pts, data.depth, baseY);
  } else {
    data.mesh.geometry  = data.wallProfile === 'parabolic'
      ? buildParabolicBowl(pts, data.depth, baseY, holes)
      : buildStraightCut(pts, data.depth, baseY);
    data.edges.geometry = buildEdgeLines(pts, data.depth, data.wallProfile, baseY);
  }
  for (const obj of [data.mesh, data.edges]) { obj.position.set(data.posX, data.posY, data.posZ); obj.rotation.y = data.rotY; }
}

export function applyArenaColor(data: ArenaData): void {
  const prevOpts: SurfaceMaterialOpts = { color:data.color, surface:data.surface, customTileData:data.customTileData, tileScale:data.tileScale };
  releaseMaterial(prevOpts);
  const newMat = buildSurfaceMaterial(prevOpts);
  data.mesh.material = newMat;
  const edgeCol = new THREE.Color(data.color).lerp(new THREE.Color(0xffffff), 0.5);
  (data.edges.material as THREE.LineBasicMaterial).color.copy(edgeCol);
}

/* ── Build pit Three.js objects ──────────────────────────────────────────── */
export function buildPitObjects(pit: PitData, arena: ArenaData, pits: Map<string, PitData>, zones: Map<string, ZoneData>): [THREE.Mesh, THREE.LineSegments] {
  const pts = shapePoints(pit);
  const mat = buildSurfaceMaterial({ color:pit.color, surface:pit.surface, customTileData:pit.customTileData, tileScale:pit.tileScale, side: pit.isMoat ? THREE.DoubleSide : THREE.FrontSide });
  const pitCX = pit.posR * Math.cos(pit.posAngle * DEG2RAD);
  const pitCZ = pit.posR * Math.sin(pit.posAngle * DEG2RAD);
  const pitRotY = pit.rotY * DEG2RAD;
  const surfFn = makeSurfFn(pit, arena, pits, zones);

  let meshGeo: THREE.BufferGeometry;
  let edgeGeo: THREE.BufferGeometry;
  if (pit.isMoat) {
    const baseY = childArenaBaseY(arena, pit.posR);
    const innerPts = shapePoints({ openingShape:pit.innerOpeningShape, radiusX:pit.innerRadiusX, radiusZ:pit.innerRadiusZ, sides:pit.innerSides, starInner:pit.innerStarInner });
    meshGeo = buildMoatGeometry(pts, innerPts, pit.depth, pit.wallProfile, pit.innerWallProfile, pit.innerRimOffset, baseY);
    edgeGeo = buildMoatEdgeLines(pts, innerPts, pit.depth, pit.innerRimOffset, baseY);
  } else {
    meshGeo = buildScoopGeometry(pts, pit.depth, pit.wallProfile, pitCX, pitCZ, pitRotY, surfFn);
    edgeGeo = buildScoopEdgeLines(pts, pit.depth, pit.wallProfile, pitCX, pitCZ, pitRotY, surfFn);
  }

  const { wx, wz, wRotY } = childWorldPos(arena, pit);
  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(wx, 0, wz); mesh.rotation.y = wRotY;
  const edgeCol = new THREE.Color(pit.color).lerp(new THREE.Color(0xffffff), 0.5);
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
  edges.position.set(wx, 0, wz); edges.rotation.y = wRotY;
  return [mesh, edges];
}

export function applyPit(pit: PitData, arena: ArenaData, pits: Map<string, PitData>, zones: Map<string, ZoneData>): void {
  const pts = shapePoints(pit);
  const pitCX = pit.posR * Math.cos(pit.posAngle * DEG2RAD);
  const pitCZ = pit.posR * Math.sin(pit.posAngle * DEG2RAD);
  const pitRotY = pit.rotY * DEG2RAD;
  const surfFn = makeSurfFn(pit, arena, pits, zones);
  pit.mesh.geometry.dispose(); pit.edges.geometry.dispose();
  if (pit.isMoat) {
    const baseY = childArenaBaseY(arena, pit.posR);
    const innerPts = shapePoints({ openingShape:pit.innerOpeningShape, radiusX:pit.innerRadiusX, radiusZ:pit.innerRadiusZ, sides:pit.innerSides, starInner:pit.innerStarInner });
    pit.mesh.geometry  = buildMoatGeometry(pts, innerPts, pit.depth, pit.wallProfile, pit.innerWallProfile, pit.innerRimOffset, baseY);
    pit.edges.geometry = buildMoatEdgeLines(pts, innerPts, pit.depth, pit.innerRimOffset, baseY);
  } else {
    pit.mesh.geometry  = buildScoopGeometry(pts, pit.depth, pit.wallProfile, pitCX, pitCZ, pitRotY, surfFn);
    pit.edges.geometry = buildScoopEdgeLines(pts, pit.depth, pit.wallProfile, pitCX, pitCZ, pitRotY, surfFn);
  }
  const { wx, wz, wRotY } = childWorldPos(arena, pit);
  for (const obj of [pit.mesh, pit.edges]) { obj.position.set(wx, 0, wz); obj.rotation.y = wRotY; }
}

/* ── Build zone Three.js objects ─────────────────────────────────────────── */
export function buildZoneObjects(zone: ZoneData, arena: ArenaData, pits: Map<string, PitData>, zones: Map<string, ZoneData>): [THREE.Mesh, THREE.LineSegments, THREE.Mesh, THREE.PointLight | null, THREE.Mesh] {
  const pts = shapePoints(zone);
  const mat = buildSurfaceMaterial({ color:zone.color, surface:zone.surface, customTileData:zone.customTileData, tileScale:zone.tileScale, side: zone.isMoat ? THREE.DoubleSide : THREE.FrontSide });
  const zoneCX = zone.posR * Math.cos(zone.posAngle * DEG2RAD);
  const zoneCZ = zone.posR * Math.sin(zone.posAngle * DEG2RAD);
  const zoneRotY = zone.rotY * DEG2RAD;
  const surfFn = makeSurfFn(zone, arena, pits, zones);

  let meshGeo: THREE.BufferGeometry; let edgeGeo: THREE.BufferGeometry;
  if (zone.isMoat) {
    const baseY = childArenaBaseY(arena, zone.posR);
    const innerPts = shapePoints({ openingShape:zone.innerOpeningShape, radiusX:zone.innerRadiusX, radiusZ:zone.innerRadiusZ, sides:zone.innerSides, starInner:zone.innerStarInner });
    meshGeo = buildMoatGeometry(pts, innerPts, zone.depth, 'parabolic', zone.innerWallProfile, zone.innerRimOffset, baseY);
    edgeGeo = buildMoatEdgeLines(pts, innerPts, zone.depth, zone.innerRimOffset, baseY);
  } else {
    meshGeo = buildScoopGeometry(pts, zone.depth, 'parabolic', zoneCX, zoneCZ, zoneRotY, surfFn);
    edgeGeo = buildScoopEdgeLines(pts, zone.depth, 'parabolic', zoneCX, zoneCZ, zoneRotY, surfFn);
  }

  const { wx, wz, wRotY } = childWorldPos(arena, zone);
  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(wx, 0, wz); mesh.rotation.y = wRotY;
  const edgeCol = new THREE.Color(zone.color).lerp(new THREE.Color(0xffffff), 0.5);
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
  edges.position.set(wx, 0, wz); edges.rotation.y = wRotY;

  const fc = zoneFillConfig(zone);
  /* Fill is 1 cm below the zone rim — appears as liquid pooling inside the bowl.
     Mask renders first (renderOrder=-1, depthTest=false) to write the stencil
     footprint unconditionally; fill reads that stencil so it clips to the zone
     shape, then its own depthTest prevents it rendering through solid walls. */
  const fillY = surfFn(zoneCX, zoneCZ) - 1.0;
  const sRef = nextStencilRef();

  const maskGeo = buildZoneFillGeo(zone);
  const maskMat = new THREE.MeshBasicMaterial({
    colorWrite: false, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
    stencilWrite: true, stencilRef: sRef,
    stencilFunc: THREE.AlwaysStencilFunc, stencilZPass: THREE.ReplaceStencilOp,
  });
  const maskMesh = new THREE.Mesh(maskGeo, maskMat);
  maskMesh.renderOrder = -1;
  maskMesh.position.set(wx, fillY, wz); maskMesh.rotation.y = wRotY;

  const fillGeo = buildZoneFillGeo(zone);
  const fillMat = buildFillShaderMaterial(fc, FILL_WAVE[zone.fill], sRef);
  const fillMesh = new THREE.Mesh(fillGeo, fillMat);
  fillMesh.position.set(wx, fillY, wz); fillMesh.rotation.y = wRotY;
  fillMesh.onBeforeRender = (_r,_s,_c,_g,mat) => { (mat as THREE.ShaderMaterial).uniforms['uTime'].value = performance.now()/1000; };

  let fillLight: THREE.PointLight | null = null;
  if (zone.fillGlow && fc.glowColor !== null) {
    fillLight = new THREE.PointLight(fc.glowColor, 2, arena.radiusX*1.5);
    fillLight.position.set(wx, fillY+2, wz);
  }
  return [mesh, edges, fillMesh, fillLight, maskMesh];
}

export function applyZone(zone: ZoneData, arena: ArenaData, scene: THREE.Scene | null, pits: Map<string, PitData>, zones: Map<string, ZoneData>): void {
  const pts = shapePoints(zone);
  const zoneCX = zone.posR * Math.cos(zone.posAngle * DEG2RAD);
  const zoneCZ = zone.posR * Math.sin(zone.posAngle * DEG2RAD);
  const zoneRotY = zone.rotY * DEG2RAD;
  const { wx, wz, wRotY } = childWorldPos(arena, zone);
  const surfFn = makeSurfFn(zone, arena, pits, zones);
  const fillY = surfFn(zoneCX, zoneCZ) - 1.0;

  zone.mesh.geometry.dispose();
  zone.edges.geometry.dispose();
  if (zone.isMoat) {
    const baseY = childArenaBaseY(arena, zone.posR);
    const innerPts = shapePoints({ openingShape:zone.innerOpeningShape, radiusX:zone.innerRadiusX, radiusZ:zone.innerRadiusZ, sides:zone.innerSides, starInner:zone.innerStarInner });
    zone.mesh.geometry  = buildMoatGeometry(pts, innerPts, zone.depth, 'parabolic', zone.innerWallProfile, zone.innerRimOffset, baseY);
    zone.edges.geometry = buildMoatEdgeLines(pts, innerPts, zone.depth, zone.innerRimOffset, baseY);
  } else {
    zone.mesh.geometry  = buildScoopGeometry(pts, zone.depth, 'parabolic', zoneCX, zoneCZ, zoneRotY, surfFn);
    zone.edges.geometry = buildScoopEdgeLines(pts, zone.depth, 'parabolic', zoneCX, zoneCZ, zoneRotY, surfFn);
  }
  for (const obj of [zone.mesh, zone.edges]) { obj.position.set(wx, 0, wz); obj.rotation.y = wRotY; }

  zone.fillMesh.geometry.dispose();
  zone.fillMesh.geometry = buildZoneFillGeo(zone);
  zone.fillMesh.scale.set(1, 1, 1);
  zone.fillMesh.position.set(wx, fillY, wz); zone.fillMesh.rotation.y = wRotY;

  /* Rebuild mask cap with same shape and position as fill. */
  zone.maskMesh.geometry.dispose();
  zone.maskMesh.geometry = buildZoneFillGeo(zone);
  zone.maskMesh.position.set(wx, fillY, wz); zone.maskMesh.rotation.y = wRotY;

  const fc = zoneFillConfig(zone);
  const sRef = (zone.maskMesh.material as THREE.MeshBasicMaterial).stencilRef;
  ;(zone.fillMesh.material as THREE.Material).dispose();
  const newFillMat = buildFillShaderMaterial(fc, FILL_WAVE[zone.fill], sRef);
  zone.fillMesh.material = newFillMat;
  zone.fillMesh.onBeforeRender = (_r,_s,_c,_g,mat) => { (mat as THREE.ShaderMaterial).uniforms['uTime'].value = performance.now()/1000; };

  if (zone.fillLight) { scene?.remove(zone.fillLight); zone.fillLight.dispose(); zone.fillLight = null; }
  if (zone.fillGlow && fc.glowColor !== null) {
    zone.fillLight = new THREE.PointLight(fc.glowColor, 2, arena.radiusX*1.5);
    zone.fillLight.position.set(wx, fillY+2, wz);
    scene?.add(zone.fillLight);
  }
}

/* ── Default factories ────────────────────────────────────────────────────── */
export function defaultArena(name: string): ArenaData {
  return {
    name, openingShape: 'circle', wallProfile: 'parabolic',
    radiusX: 50, radiusZ: 50, depth: 20,
    sides: 5, starInner: 0.5, color: 0x888888,
    surface: 'plain', customTileData: null, tileScale: 20,
    posX: 0, posZ: 0, posY: 0, rotY: 0,
    isMoat: false, innerRadiusX: 25, innerRadiusZ: 25,
    innerOpeningShape: 'circle', innerSides: 5, innerStarInner: 0.5,
    innerWallProfile: 'parabolic', innerRimOffset: 0,
    pitIds: [], zoneIds: [],
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    floorMesh: null, islandMesh: null,
  };
}
export function defaultPit(name: string, parentArenaId: string, id: string, parentPitId: string | null = null, parentZoneId: string | null = null): PitData {
  return {
    id, name, parentArenaId, parentPitId, parentZoneId,
    openingShape: 'circle', wallProfile: 'straight',
    radiusX: 10, radiusZ: 10, depth: 8,
    sides: 5, starInner: 0.5, color: 0x555555,
    surface: 'plain', customTileData: null, tileScale: 10,
    posR: 0, posAngle: 0, rotY: 0,
    isMoat: false, innerRadiusX: 5, innerRadiusZ: 5,
    innerOpeningShape: 'circle', innerSides: 5, innerStarInner: 0.5,
    innerWallProfile: 'straight', innerRimOffset: 0,
    pitIds: [], zoneIds: [],
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
  };
}
export function defaultZone(name: string, parentArenaId: string, id: string, parentPitId: string | null = null, parentZoneId: string | null = null): ZoneData {
  return {
    id, name, parentArenaId, parentPitId, parentZoneId, openingShape: 'circle',
    radiusX: 15, radiusZ: 15, depth: 8,
    sides: 5, starInner: 0.5, color: 0x336699,
    surface: 'plain', customTileData: null, tileScale: 10,
    fill: 'water', fillColor: null, fillOpacity: 0.65, fillGlow: true,
    posR: 0, posAngle: 0, rotY: 0,
    isMoat: false, innerRadiusX: 8, innerRadiusZ: 8,
    innerOpeningShape: 'circle', innerSides: 5, innerStarInner: 0.5,
    innerWallProfile: 'parabolic', innerRimOffset: 0,
    pitIds: [], zoneIds: [],
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    fillMesh: null as unknown as THREE.Mesh,
    fillLight: null,
    maskMesh: null as unknown as THREE.Mesh,
  };
}

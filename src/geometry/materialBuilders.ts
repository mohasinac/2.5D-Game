import * as THREE from 'three';
import { TWO_PI, DEG2RAD } from '../config/arenaConstants';
import { SurfaceType, SurfaceMaterialOpts, FillPreset } from '../types/arenaTypes';

/* ══════════════════════════════════════════════════════════════════════════
   Surface material builders.
   Responsible for: canvas texture generation and THREE.MeshStandardMaterial
   creation/caching. Changes here when a new surface texture type is added.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Module-level caches ─────────────────────────────────────────────────── */
export const _texCache = new Map<string, { tex: THREE.Texture; refs: number }>();
export const _matCache = new Map<string, { mat: THREE.MeshStandardMaterial; refs: number }>();

export function _texKey(opts: SurfaceMaterialOpts): string {
  if (opts.surface === 'custom_png' && opts.customTileData)
    return `custom:${opts.customTileData.slice(0, 40)}:${opts.tileScale}`;
  return `${opts.color}_${opts.surface}`;
}
export function _matKey(opts: SurfaceMaterialOpts): string {
  return `${_texKey(opts)}:${opts.transparent ? 't' : 'o'}:${opts.opacity ?? 1}:${opts.side ?? THREE.DoubleSide}:${opts.baseMaterial ?? ''}`;
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
  const PBR = { abs: [0.65, 0.00], metal: [0.15, 0.88], stone: [0.90, 0.02] } as const;
  const [roughness, metalness] = opts.baseMaterial
    ? PBR[opts.baseMaterial]
    : [opts.surface==='metal'?0.25:opts.surface==='ice'?0.10:0.65,
       opts.surface==='metal'?0.70:opts.surface==='ice'?0.10:0.08];
  const mat = new THREE.MeshStandardMaterial({
    color: opts.surface==='plain'?opts.color:0xffffff,
    map: map??undefined, side: opts.side ?? THREE.DoubleSide,
    roughness, metalness,
    transparent: opts.transparent??false, opacity: opts.opacity??1,
  });
  _matCache.set(mk, { mat, refs: 1 }); return mat;
}

/** MeshStandardMaterial coloured by a zone fill preset — used for zone bowl. */
export function buildFillBowlMaterial(fc: FillPreset, opacity = 1): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(fc.color),
    emissive: new THREE.Color(fc.emissive),
    emissiveIntensity: fc.emissiveIntensity * 0.5,
    side: THREE.DoubleSide,
    roughness: 0.6,
    metalness: 0,
    transparent: opacity < 1.0,
    opacity,
    depthWrite: opacity >= 1.0,
  });
}

/**
 * MeshStandardMaterial for the zone lid — same fill colour as the bowl,
 * with opacity support (phasing) and stencil write for clipping the fill wave.
 */
export function buildFillLidMaterial(fc: FillPreset, opacity: number, stencilRef: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(fc.color),
    emissive: new THREE.Color(fc.emissive),
    emissiveIntensity: fc.emissiveIntensity * 0.5,
    transparent: opacity < 1.0,
    opacity,
    depthWrite: opacity >= 1.0,
    side: THREE.DoubleSide,
    stencilWrite: true,
    stencilRef,
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilZPass: THREE.ReplaceStencilOp,
  });
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

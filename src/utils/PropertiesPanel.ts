import * as THREE from 'three';
import { APOTHEM } from '../config/arenaConstants';
import {
  ArenaData, PitData, ZoneData,
  OpeningShape, WallProfile, ZoneFill, SurfaceType, ShapeParams,
} from '../types/arenaTypes';
import { _paintCanvas } from '../geometry/materialBuilders';
import { FILL_PRESET, FILL_LABEL } from '../geometry/surfaceUtils';
import { AbstractPropertiesPanel } from './AbstractPropertiesPanel';

export const SHAPE_LABEL: Record<OpeningShape, string> = {
  circle: 'Circle', ellipse: 'Ellipse', rectangle: 'Rect',
  hexagon: 'Hexagon', triangle: 'Triangle', star: 'Star',
};
export const SHAPE_ICON: Record<OpeningShape, string> = {
  circle: '●', ellipse: '◯', rectangle: '▭',
  hexagon: '⬡', triangle: '△', star: '★',
};
export const SURFACE_LABEL: Record<SurfaceType, string> = {
  plain: 'Plain', checker: 'Checker', grid: 'Grid', hex: 'Hex',
  stripes: 'Stripes', dots: 'Dots', concrete: 'Concrete', metal: 'Metal',
  wood: 'Wood', ice: 'Ice', sand: 'Sand', lava_rock: 'Lava', custom_png: 'Custom',
};

export class PropertiesPanel extends AbstractPropertiesPanel {

  showBase(
    cfg: { height: number; sides: number; color: number; surface: SurfaceType; customTileData: string | null; tileScale: number },
    onRebuild: () => void,
    onColorChange: (hex: number) => void,
    onSurfaceChange: () => void,
  ): void {
    this.content.innerHTML = '';
    this.section('OCTAGON BASE');
    this.readRow('Flat-to-flat', '200 cm');
    this.numRow('Height', cfg.height, 5, 80, 1,  v => { cfg.height=v; onRebuild(); });
    this.numRow('Sides',  cfg.sides,  3, 16, 1,  v => { cfg.sides=Math.round(v); onRebuild(); });
    this.section('SURFACE');
    this.colorRow('Color', cfg.color, hex => { cfg.color=hex; onColorChange(hex); });
    this.surfaceRow(cfg, onSurfaceChange);
    const hint=document.createElement('div'); hint.className='prop-hint';
    hint.textContent='Click [+] on the base node to add an arena';
    this.content.appendChild(hint);
  }

  showArena(
    data: ArenaData,
    baseHeight: number,
    onGeomChange: () => void,
    onFullChange: () => void,
    onRename: (name: string) => void,
    onColorChange: () => void,
    onSurfaceChange: () => void,
  ): void {
    this.content.innerHTML = '';
    this.section('NAME');
    const nameInp=document.createElement('input');
    nameInp.type='text'; nameInp.className='prop-text-input'; nameInp.value=data.name;
    nameInp.addEventListener('input', ()=>{ data.name=nameInp.value; onRename(data.name); });
    this.content.appendChild(nameInp);

    this.section('OPENING SHAPE');
    this.shapeGrid(data, onFullChange);
    if (data.openingShape==='star') {
      this.numRow('Points',     data.sides,     3, 12,   1,    v=>{ data.sides=Math.round(v); onFullChange(); });
      this.numRow('Inner frac', data.starInner, 0.1,0.95,0.05, v=>{ data.starInner=v; onGeomChange(); });
    }

    this.section('MOAT');
    this.toggleRow('Ring/Moat', data.isMoat, v=>{ data.isMoat=v; onFullChange(); });
    if (data.isMoat) {
      this.numRow('Inner R X',    data.innerRadiusX, 5, data.radiusX-5, 1, v=>{ data.innerRadiusX=v; onGeomChange(); });
      this.numRow('Inner R Z',    data.innerRadiusZ, 5, data.radiusZ-5, 1, v=>{ data.innerRadiusZ=v; onGeomChange(); });
      this.numRow('Inner Y offset', data.innerRimOffset, -data.depth+1, 200, 1, v=>{ data.innerRimOffset=v; onGeomChange(); });
      this.section('INNER SHAPE');
      this.innerShapeGrid(data, onFullChange);
      this.section('OUTER WALL');
      this.profileRow(data, 'wallProfile', onFullChange);
      this.section('INNER WALL');
      this.innerProfileRow(data, onFullChange);
    }

    if (!data.isMoat) {
      this.section('WALL PROFILE');
      this.profileRow(data, 'wallProfile', onFullChange);
    }

    this.section('DIMENSIONS');
    this.numRow('Radius X', data.radiusX, 5, APOTHEM, 1, v=>{ data.radiusX=v; onGeomChange(); });
    this.numRow('Radius Z', data.radiusZ, 5, APOTHEM, 1, v=>{ data.radiusZ=v; onGeomChange(); });
    this.numRow('Depth',    data.depth,   1, baseHeight, 0.5, v=>{ data.depth=v; onGeomChange(); });

    this.section('SURFACE');
    this.colorRow('Color', data.color, v=>{ data.color=v; onColorChange(); });
    this.surfaceRow(data, onSurfaceChange);

    this.section('POSITION');
    this.numRow('X',        data.posX, -APOTHEM, APOTHEM, 1, v=>{ data.posX=v; onGeomChange(); });
    this.numRow('Z',        data.posZ, -APOTHEM, APOTHEM, 1, v=>{ data.posZ=v; onGeomChange(); });
    this.numRow('Y (tower)', data.posY, 0, 200, 1, v=>{ data.posY=v; onGeomChange(); });
    this.numRow('Rot Y °',  THREE.MathUtils.radToDeg(data.rotY), -180, 180, 1,
      v=>{ data.rotY=THREE.MathUtils.degToRad(v); onGeomChange(); });
  }

  showPit(
    pit: PitData, arena: ArenaData,
    onGeomChange: () => void, onFullChange: () => void,
    onRename: (name: string) => void, onColorChange: () => void, onSurfaceChange: () => void,
  ): void {
    this.content.innerHTML = '';
    this.section('NAME');
    const nameInp=document.createElement('input');
    nameInp.type='text'; nameInp.className='prop-text-input'; nameInp.value=pit.name;
    nameInp.addEventListener('input', ()=>{ pit.name=nameInp.value; onRename(pit.name); });
    this.content.appendChild(nameInp);

    this.section('OPENING SHAPE');
    this.shapeGrid(pit, onFullChange);
    if (pit.openingShape==='star') {
      this.numRow('Points',     pit.sides,     3, 12,   1,    v=>{ pit.sides=Math.round(v); onFullChange(); });
      this.numRow('Inner frac', pit.starInner, 0.1,0.95,0.05, v=>{ pit.starInner=v; onGeomChange(); });
    }

    this.section('DIMENSIONS');
    const arenaMinR_pit = Math.min(arena.radiusX, arena.radiusZ);
    this.numRow('Radius X', pit.radiusX, 2, Math.max(2, arenaMinR_pit - pit.posR), 1, v=>{ pit.radiusX=v; onGeomChange(); });
    this.numRow('Radius Z', pit.radiusZ, 2, Math.max(2, arenaMinR_pit - pit.posR), 1, v=>{ pit.radiusZ=v; onGeomChange(); });
    this.numRow('Depth',    pit.depth,   1, arena.depth, 0.5, v=>{ pit.depth=v; onGeomChange(); });

    this.section('SURFACE');
    this.colorRow('Color', pit.color, v=>{ pit.color=v; onColorChange(); });
    this.surfaceRow(pit, onSurfaceChange);

    this.section('POSITION (arena-local)');
    const maxChildR_pit = Math.max(pit.radiusX, pit.radiusZ);
    this.numRow('Dist (cm)', pit.posR,     0, Math.max(0, arenaMinR_pit - maxChildR_pit), 1, v=>{ pit.posR=v; onGeomChange(); });
    this.numRow('Angle °',   pit.posAngle, 0, 360,     1, v=>{ pit.posAngle=v; onGeomChange(); });
    this.numRow('Rotate °',  pit.rotY,     0, 360,     1, v=>{ pit.rotY=v; onGeomChange(); });
  }

  showZone(
    zone: ZoneData, arena: ArenaData,
    onGeomChange: () => void, onFullChange: () => void,
    onRename: (name: string) => void,
  ): void {
    this.content.innerHTML = '';
    this.section('NAME');
    const nameInp=document.createElement('input');
    nameInp.type='text'; nameInp.className='prop-text-input'; nameInp.value=zone.name;
    nameInp.addEventListener('input', ()=>{ zone.name=nameInp.value; onRename(zone.name); });
    this.content.appendChild(nameInp);

    this.section('OPENING SHAPE');
    this.shapeGrid(zone, onFullChange);
    if (zone.openingShape==='star') {
      this.numRow('Points',     zone.sides,     3, 12,   1,    v=>{ zone.sides=Math.round(v); onFullChange(); });
      this.numRow('Inner frac', zone.starInner, 0.1,0.95,0.05, v=>{ zone.starInner=v; onGeomChange(); });
    }

    this.section('MOAT');
    this.toggleRow('Ring/Moat', zone.isMoat, v=>{ zone.isMoat=v; onFullChange(); });
    if (zone.isMoat) {
      this.numRow('Inner R X',    zone.innerRadiusX, 2, zone.radiusX-2, 1, v=>{ zone.innerRadiusX=v; onGeomChange(); });
      this.numRow('Inner R Z',    zone.innerRadiusZ, 2, zone.radiusZ-2, 1, v=>{ zone.innerRadiusZ=v; onGeomChange(); });
      this.numRow('Inner Y offset', zone.innerRimOffset, -(zone.depth-1), 100, 1, v=>{ zone.innerRimOffset=v; onGeomChange(); });
      this.section('INNER SHAPE');
      this.innerShapeGrid(zone, onFullChange);
      this.section('INNER WALL');
      this.innerProfileRow(zone, onFullChange);
    }

    this.section('DIMENSIONS');
    const arenaMinR_zone = Math.min(arena.radiusX, arena.radiusZ);
    const maxDepth = Math.min(15, arena.depth);
    this.numRow('Radius X', zone.radiusX, 2, Math.max(2, arenaMinR_zone - zone.posR), 1, v=>{ zone.radiusX=v; onGeomChange(); });
    this.numRow('Radius Z', zone.radiusZ, 2, Math.max(2, arenaMinR_zone - zone.posR), 1, v=>{ zone.radiusZ=v; onGeomChange(); });
    this.numRow('Depth',    zone.depth,   1, maxDepth, 0.5, v=>{ zone.depth=v; onGeomChange(); });

    this.section('FILL');
    this.fillGrid(zone, onGeomChange);

    this.section('POSITION (arena-local)');
    const maxChildR_zone = Math.max(zone.radiusX, zone.radiusZ);
    this.numRow('Dist (cm)', zone.posR,     0, Math.max(0, arenaMinR_zone - maxChildR_zone), 1, v=>{ zone.posR=v; onGeomChange(); });
    this.numRow('Angle °',   zone.posAngle, 0, 360,     1, v=>{ zone.posAngle=v; onGeomChange(); });
    this.numRow('Rotate °',  zone.rotY,     0, 360,     1, v=>{ zone.rotY=v; onGeomChange(); });
  }

  /* ── Shared UI helpers ── */
  private shapeGrid(data: ShapeParams, onChange: () => void): void {
    const grid=document.createElement('div'); grid.className='prop-shape-grid';
    (['circle','ellipse','rectangle','hexagon','triangle','star'] as OpeningShape[]).forEach(s=>{
      const btn=document.createElement('button');
      btn.className='prop-shape-btn'+(data.openingShape===s?' active':'');
      btn.innerHTML=`<span class="prop-shape-icon">${SHAPE_ICON[s]}</span><span>${SHAPE_LABEL[s]}</span>`;
      btn.addEventListener('click',()=>{ data.openingShape=s; onChange(); });
      grid.appendChild(btn);
    });
    this.content.appendChild(grid);
  }

  private innerShapeGrid(data: { innerOpeningShape: OpeningShape; innerSides: number; innerStarInner: number }, onChange: () => void): void {
    const grid=document.createElement('div'); grid.className='prop-shape-grid';
    (['circle','ellipse','rectangle','hexagon','triangle','star'] as OpeningShape[]).forEach(s=>{
      const btn=document.createElement('button');
      btn.className='prop-shape-btn'+(data.innerOpeningShape===s?' active':'');
      btn.innerHTML=`<span class="prop-shape-icon">${SHAPE_ICON[s]}</span><span>${SHAPE_LABEL[s]}</span>`;
      btn.addEventListener('click',()=>{ data.innerOpeningShape=s; onChange(); });
      grid.appendChild(btn);
    });
    this.content.appendChild(grid);
    if (data.innerOpeningShape==='star') {
      this.numRow('Points',     data.innerSides,     3, 12,   1,    v=>{ data.innerSides=Math.round(v); onChange(); });
      this.numRow('Inner frac', data.innerStarInner, 0.1,0.95,0.05, v=>{ data.innerStarInner=v; onChange(); });
    }
  }

  private profileRow(data: { wallProfile: WallProfile }, _field: 'wallProfile', onChange: () => void): void {
    const row=document.createElement('div'); row.className='prop-profile-row';
    (['parabolic','straight'] as WallProfile[]).forEach(p=>{
      const btn=document.createElement('button');
      btn.className='prop-profile-btn'+(data.wallProfile===p?' active':'');
      btn.textContent=p==='parabolic'?'⌣ Bowl':'▮ Straight';
      btn.addEventListener('click',()=>{ data.wallProfile=p; onChange(); });
      row.appendChild(btn);
    });
    this.content.appendChild(row);
  }

  private innerProfileRow(data: { innerWallProfile: WallProfile }, onChange: () => void): void {
    const row=document.createElement('div'); row.className='prop-profile-row';
    (['parabolic','straight'] as WallProfile[]).forEach(p=>{
      const btn=document.createElement('button');
      btn.className='prop-profile-btn'+(data.innerWallProfile===p?' active':'');
      btn.textContent=p==='parabolic'?'⌣ Bowl':'▮ Straight';
      btn.addEventListener('click',()=>{ data.innerWallProfile=p; onChange(); });
      row.appendChild(btn);
    });
    this.content.appendChild(row);
  }

  private surfaceRow(
    target: { surface: SurfaceType; customTileData: string | null; tileScale: number; color: number },
    onChange: () => void,
  ): void {
    const SURFACES: SurfaceType[] = ['plain','checker','grid','hex','stripes','dots','concrete','metal','wood','ice','sand','lava_rock','custom_png'];
    const grid=document.createElement('div'); grid.className='prop-surface-grid';
    const btns: HTMLButtonElement[] = [];
    for (const s of SURFACES) {
      const btn=document.createElement('button');
      btn.className='prop-surface-btn'+(target.surface===s?' active':'');
      btn.title=SURFACE_LABEL[s];
      if (s!=='custom_png') {
        const cv=document.createElement('canvas'); cv.className='prop-surface-preview';
        cv.width=32; cv.height=32;
        cv.getContext('2d')!.drawImage(_paintCanvas(target.color,s),0,0,32,32);
        btn.appendChild(cv); btn.appendChild(document.createTextNode(SURFACE_LABEL[s]));
      } else { btn.textContent='📁 '+SURFACE_LABEL[s]; }
      btn.addEventListener('click',()=>{
        if(s==='custom_png'){ this.openPngPicker(target,onChange,grid); return; }
        target.surface=s;
        btns.forEach((b,i)=>b.classList.toggle('active',SURFACES[i]===s));
        onChange();
      });
      btns.push(btn); grid.appendChild(btn);
    }
    this.content.appendChild(grid);
    if (target.surface==='custom_png') this.renderCustomTileRow(target,onChange);
  }

  private openPngPicker(target: { surface: SurfaceType; customTileData: string | null; tileScale: number; color: number }, onChange: () => void, parentGrid: HTMLDivElement): void {
    const inp=document.createElement('input'); inp.type='file'; inp.accept='image/png,image/jpeg';
    inp.addEventListener('change',()=>{
      const file=inp.files?.[0]; if(!file) return;
      const reader=new FileReader();
      reader.onload=()=>{
        target.customTileData=reader.result as string; target.surface='custom_png';
        this.content.querySelector('.prop-surface-custom-row')?.remove();
        this.renderCustomTileRow(target,onChange);
        for(const btn of parentGrid.querySelectorAll<HTMLButtonElement>('.prop-surface-btn'))
          btn.classList.toggle('active',btn.title===SURFACE_LABEL['custom_png']);
        onChange();
      };
      reader.readAsDataURL(file);
    });
    inp.click();
  }

  private renderCustomTileRow(target: { surface: SurfaceType; customTileData: string | null; tileScale: number; color: number }, onChange: () => void): void {
    const row=document.createElement('div'); row.className='prop-surface-custom-row';
    if(target.customTileData){const thumb=document.createElement('img');thumb.className='prop-surface-thumb';thumb.src=target.customTileData;row.appendChild(thumb);}
    const lbl=document.createElement('span');lbl.className='prop-label';lbl.textContent='Tile scale';
    const inp=document.createElement('input');inp.type='number';inp.className='prop-input';
    inp.value=String(target.tileScale);inp.min='1';inp.max='200';inp.step='1';
    inp.addEventListener('input',()=>{target.tileScale=parseFloat(inp.value)||20;onChange();});
    const clearBtn=document.createElement('button');clearBtn.className='game-btn';clearBtn.textContent='✕ Clear';
    clearBtn.addEventListener('click',()=>{target.customTileData=null;target.surface='plain';row.remove();onChange();});
    row.appendChild(lbl);row.appendChild(inp);row.appendChild(clearBtn);this.content.appendChild(row);
  }

  private fillGrid(zone: ZoneData, onChange: () => void): void {
    const FILLS: ZoneFill[] = ['water','lava','swamp','poison','sand','ice','void','custom'];
    const grid=document.createElement('div'); grid.className='prop-fill-grid';
    const btns: HTMLButtonElement[] = [];
    for (const f of FILLS) {
      const btn=document.createElement('button');
      btn.className='prop-fill-btn'+(zone.fill===f?' active':'');
      const swatch=document.createElement('span');swatch.className='prop-fill-swatch';
      swatch.style.background='#'+FILL_PRESET[f].color.toString(16).padStart(6,'0');
      btn.appendChild(swatch);btn.appendChild(document.createTextNode(FILL_LABEL[f]));
      btn.addEventListener('click',()=>{
        zone.fill=f;btns.forEach((b,i)=>b.classList.toggle('active',FILLS[i]===f));
        this.updateFillCustomRow(zone,onChange);onChange();
      });
      btns.push(btn);grid.appendChild(btn);
    }
    this.content.appendChild(grid);
    this.numRow('Opacity',zone.fillOpacity,0.1,1.0,0.05,v=>{zone.fillOpacity=v;onChange();});
    if(zone.fill==='custom') this.buildFillCustomRow(zone,onChange);
  }

  private updateFillCustomRow(zone: ZoneData, onChange: () => void): void {
    this.content.querySelector('.prop-fill-custom-row')?.remove();
    if(zone.fill==='custom') this.buildFillCustomRow(zone,onChange);
  }
  private buildFillCustomRow(zone: ZoneData, onChange: () => void): void {
    const row=document.createElement('div');row.className='prop-fill-custom-row prop-row';
    const lbl=document.createElement('span');lbl.className='prop-label';lbl.textContent='Fill color';
    const inp=document.createElement('input');inp.type='color';inp.className='prop-color-input';
    inp.value='#'+(zone.fillColor??0xffffff).toString(16).padStart(6,'0');
    inp.addEventListener('input',()=>{zone.fillColor=parseInt(inp.value.slice(1),16);onChange();});
    row.appendChild(lbl);row.appendChild(inp);this.content.appendChild(row);
  }

}

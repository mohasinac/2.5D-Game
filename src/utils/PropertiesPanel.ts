import * as THREE from 'three';
import { APOTHEM, MIN_WALL_HEIGHT, MIN_WALL_GAP, ARENA_MATERIAL_PRESETS, SL } from '../config/arenaConstants';
import {
  ArenaData, PitData, ZoneData, SpeedLineData, SpeedLineSegment,
  OpeningShape, WallProfile, RampMode, ZoneFill, SurfaceType, ArenaMaterial, ShapeParams,
  WallData, WallTopProfile, WallHoleData,
  BridgeData, BridgeSection, BridgeSegmentData, BridgeSegmentType, BridgeCrossSection,
  BridgeEndpointRef, BridgeEndpointType,
} from '../types/arenaTypes';
import {
  templateStraight, templateCircle, templateSpiral, templateZigzag, templateWave,
  templateClimb, templateLoop, templateCorkscrew, templateLaunchRamp,
} from '../geometry/speedLineBuilders';
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
      this.wallProfileSection(data, onFullChange, onGeomChange);
    }

    this.section('DIMENSIONS');
    this.numRow('Radius X', data.radiusX, 5, APOTHEM, 1, v=>{ data.radiusX=v; onGeomChange(); this._refreshStepCountMax(data); });
    this.numRow('Radius Z', data.radiusZ, 5, APOTHEM, 1, v=>{ data.radiusZ=v; onGeomChange(); });
    this.numRow('Depth',    data.depth,   1, baseHeight, 0.5, v=>{ data.depth=v; this._refreshStepCountMax(data); onGeomChange(); });

    this.section('SURFACE');
    this.materialRow(data, onColorChange);
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

  private _stepCountSlider: HTMLInputElement | null = null;

  private _refreshStepCountMax(data: ArenaData): void {
    if (!this._stepCountSlider) return;
    const maxSteps = Math.max(1, Math.floor((data.depth - data.stepStartDepth) / 10));
    this._stepCountSlider.max = String(maxSteps);
    if (data.stepCount > maxSteps) data.stepCount = maxSteps;
    this._stepCountSlider.value = String(data.stepCount);
  }

  private profileRow(data: { wallProfile: WallProfile }, _field: 'wallProfile', onChange: () => void): void {
    const row=document.createElement('div'); row.className='prop-profile-row';
    const defs: [WallProfile, string][] = [['parabolic','⌣ Bowl'],['straight','▮ Straight'],['step','▭ Step'],['spiral','↺ Spiral']];
    for (const [p, label] of defs) {
      const btn=document.createElement('button');
      btn.className='prop-profile-btn'+(data.wallProfile===p?' active':'');
      btn.textContent=label;
      btn.addEventListener('click',()=>{ data.wallProfile=p; onChange(); });
      row.appendChild(btn);
    }
    this.content.appendChild(row);
  }

  private innerProfileRow(data: { innerWallProfile: WallProfile }, onChange: () => void): void {
    const row=document.createElement('div'); row.className='prop-profile-row';
    const defs: [WallProfile, string][] = [['parabolic','⌣ Bowl'],['straight','▮ Straight'],['step','▭ Step']];
    for (const [p, label] of defs) {
      const btn=document.createElement('button');
      btn.className='prop-profile-btn'+(data.innerWallProfile===p?' active':'');
      btn.textContent=label;
      btn.addEventListener('click',()=>{ data.innerWallProfile=p; onChange(); });
      row.appendChild(btn);
    }
    this.content.appendChild(row);
  }

  private wallProfileSection(data: ArenaData, onFullChange: () => void, onGeomChange: () => void): void {
    const isCircleOrEllipse = data.openingShape === 'circle' || data.openingShape === 'ellipse';

    // Apply to all edges checkbox
    this.toggleRow('Apply to all edges', data.stepApplyToAll, v => {
      data.stepApplyToAll = v;
      if (v && data.wallProfile === 'step') {
        // reset per-edge profiles
        data.stepEdgeProfiles = [];
      }
      onFullChange();
    });

    if (data.stepApplyToAll) {
      // 4-button all-edges row
      const row = document.createElement('div'); row.className = 'prop-profile-row';
      const defs: [WallProfile, string][] = [
        ['parabolic','⌣ Bowl'],['straight','▮ Straight'],['step','▭ Step'],['spiral','↺ Spiral'],
      ];
      for (const [p, label] of defs) {
        const btn = document.createElement('button');
        btn.className = 'prop-profile-btn' + (data.wallProfile === p ? ' active' : '');
        btn.textContent = label;
        btn.addEventListener('click', () => { data.wallProfile = p; onFullChange(); });
        row.appendChild(btn);
      }
      this.content.appendChild(row);
    } else {
      // Arc divisions (circle/ellipse only)
      if (isCircleOrEllipse) {
        const divRow = document.createElement('div'); divRow.className = 'prop-profile-row';
        const divLabel = document.createElement('span'); divLabel.className = 'prop-row-label';
        divLabel.textContent = 'Arc Divs'; divRow.appendChild(divLabel);
        for (const n of [1, 2, 4, 8] as const) {
          const btn = document.createElement('button');
          btn.className = 'prop-profile-btn' + (data.stepArcDivisions === n ? ' active' : '');
          btn.textContent = String(n);
          btn.addEventListener('click', () => { data.stepArcDivisions = n; onFullChange(); });
          divRow.appendChild(btn);
        }
        this.content.appendChild(divRow);
      }

      // Per-edge selectors
      const edgeCount = this._edgeCount(data);
      const edgeLabels = this._edgeLabels(data, edgeCount);
      if (data.stepEdgeProfiles.length !== edgeCount) {
        data.stepEdgeProfiles = Array.from({ length: edgeCount }, (_, i) => data.stepEdgeProfiles[i] ?? data.wallProfile ?? 'parabolic');
      }
      for (let i = 0; i < edgeCount; i++) {
        const lbl = document.createElement('div'); lbl.className = 'prop-edge-label';
        lbl.textContent = edgeLabels[i];
        this.content.appendChild(lbl);
        const row = document.createElement('div'); row.className = 'prop-profile-row';
        const defs: [WallProfile, string][] = [['parabolic','⌣ Bowl'],['straight','▮ Straight'],['step','▭ Step']];
        for (const [p, label] of defs) {
          const btn = document.createElement('button');
          const idx = i;
          btn.className = 'prop-profile-btn' + (data.stepEdgeProfiles[idx] === p ? ' active' : '');
          btn.textContent = label;
          btn.addEventListener('click', () => { data.stepEdgeProfiles[idx] = p; onFullChange(); });
          row.appendChild(btn);
        }
        this.content.appendChild(row);
      }
    }

    // Determine if any edge uses step
    const anyStep = data.stepApplyToAll
      ? data.wallProfile === 'step'
      : data.stepEdgeProfiles.some(p => p === 'step');

    // Step sub-section
    if (anyStep) {
      const maxSteps = Math.max(1, Math.floor((data.depth - data.stepStartDepth) / 10));
      if (data.stepCount > maxSteps) data.stepCount = maxSteps;

      const subHead = document.createElement('div'); subHead.className = 'prop-sub-section';
      subHead.textContent = '— Step Options —'; this.content.appendChild(subHead);

      this.numRow('Step Start (cm)', data.stepStartDepth, 0, Math.max(0, data.depth - 10), 1, v => {
        data.stepStartDepth = v; this._refreshStepCountMax(data); onGeomChange();
      });

      // Step Count with dynamic max — store slider ref for _refreshStepCountMax
      this._stepCountSlider = null;
      this.numRow('Step Count', data.stepCount, 1, maxSteps, 1, v => {
        data.stepCount = Math.round(v); onGeomChange();
      });
      // Capture slider after numRow appends it
      const sliders = this.content.querySelectorAll<HTMLInputElement>('input[type=range]');
      this._stepCountSlider = sliders[sliders.length - 1] ?? null;

      // Riser shape
      const riserRow = document.createElement('div'); riserRow.className = 'prop-profile-row';
      const riserLabel = document.createElement('span'); riserLabel.className = 'prop-row-label';
      riserLabel.textContent = 'Riser'; riserRow.appendChild(riserLabel);
      for (const [val, label] of [['parabolic','⌣ Parabolic'],['straight','╱ Straight']] as [string,string][]) {
        const btn = document.createElement('button');
        btn.className = 'prop-profile-btn' + (data.stepRiserProfile === val ? ' active' : '');
        btn.textContent = label;
        btn.addEventListener('click', () => { data.stepRiserProfile = val as 'parabolic'|'straight'; onGeomChange(); });
        riserRow.appendChild(btn);
      }
      this.content.appendChild(riserRow);

      // Ramp mode
      const rampRow = document.createElement('div'); rampRow.className = 'prop-profile-row';
      const rampLabel = document.createElement('span'); rampLabel.className = 'prop-row-label';
      rampLabel.textContent = 'Ramp'; rampRow.appendChild(rampLabel);
      const rampModes: [RampMode, string][] = [['full','Full'],['one-side','1-Side'],['zigzag','Zigzag'],['none','None']];
      for (const [m, label] of rampModes) {
        const btn = document.createElement('button');
        btn.className = 'prop-profile-btn' + (data.rampMode === m ? ' active' : '');
        btn.textContent = label;
        btn.addEventListener('click', () => { data.rampMode = m; onGeomChange(); });
        rampRow.appendChild(btn);
      }
      this.content.appendChild(rampRow);

      if (data.rampMode !== 'full' && data.rampMode !== 'none') {
        this.numRow('Ramp Angle°', data.rampAngle, 0, 359, 1, v => { data.rampAngle = v; onGeomChange(); });
        this.numRow('Ramp Width°', data.rampWidth, 10, 180, 1, v => { data.rampWidth = v; onGeomChange(); });
      }
    }

    // Spiral sub-section
    if (data.stepApplyToAll && data.wallProfile === 'spiral') {
      const subHead = document.createElement('div'); subHead.className = 'prop-sub-section';
      subHead.textContent = '— Spiral Options —'; this.content.appendChild(subHead);

      this.numRow('Turns', data.spiralTurns, 0.5, 4, 0.5, v => { data.spiralTurns = v; onFullChange(); });
      this.numRow('Helices', data.spiralCount, 1, 4, 1, v => { data.spiralCount = Math.round(v); onFullChange(); });
      this.toggleRow('Clockwise', data.spiralClockwise, v => { data.spiralClockwise = v; onFullChange(); });
      this.numRow('Ledge Width cm', data.spiralLedgeWidth, 1, 8, 0.5, v => { data.spiralLedgeWidth = v; onFullChange(); });
      this.numRow('Ledge Height cm', data.spiralLedgeHeight, 0.3, 3, 0.1, v => { data.spiralLedgeHeight = v; onFullChange(); });
      this.numRow('Wall Radius', data.spiralRadiusFrac, 0.3, 1, 0.05, v => { data.spiralRadiusFrac = v; onFullChange(); });
    }
  }

  private _edgeCount(data: ArenaData): number {
    const s = data.openingShape;
    if (s === 'circle' || s === 'ellipse') return data.stepArcDivisions;
    if (s === 'rectangle') return 4;
    if (s === 'hexagon') return 6;
    if (s === 'triangle') return 3;
    if (s === 'star') return Math.max(3, Math.min(12, Math.round(data.sides)));
    return 4;
  }

  private _edgeLabels(data: ArenaData, count: number): string[] {
    const s = data.openingShape;
    if (s === 'rectangle') return ['N side','E side','S side','W side'];
    if (s === 'circle' || s === 'ellipse') return Array.from({length: count}, (_,i) => `Arc ${i+1}`);
    return Array.from({length: count}, (_,i) => `Side ${i+1}`);
  }

  private materialRow(data: ArenaData, onChange: () => void): void {
    const MATERIALS: [ArenaMaterial, string, string][] = [
      ['abs',   '▣ ABS',   'Plastic (smooth, low grip)'],
      ['metal', '⬡ Metal', 'Metal (shiny, very low friction)'],
      ['stone', '◈ Stone', 'Stone (rough, high grip)'],
    ];
    const wrap = document.createElement('div'); wrap.className = 'prop-row';
    const label = document.createElement('span'); label.className = 'prop-label'; label.textContent = 'Material';
    wrap.appendChild(label);
    const btnGroup = document.createElement('div'); btnGroup.className = 'prop-profile-row';
    const btns: HTMLButtonElement[] = [];
    for (const [mat, icon, tip] of MATERIALS) {
      const btn = document.createElement('button');
      btn.className = 'game-btn prop-profile-btn' + (data.baseMaterial === mat ? ' active' : '');
      btn.textContent = icon; btn.title = tip;
      btn.addEventListener('click', () => {
        data.baseMaterial = mat;
        btns.forEach((b, i) => b.classList.toggle('active', MATERIALS[i][0] === mat));
        onChange();
      });
      btns.push(btn); btnGroup.appendChild(btn);
    }
    wrap.appendChild(btnGroup); this.content.appendChild(wrap);
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

  /* ═══════════════════════════════════════════════════════════════════════
     WALL PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showWall(
    wall: WallData,
    onGeomChange: () => void,
    onRename: (name: string) => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = wall.name;
    nameInp.addEventListener('input', () => { wall.name = nameInp.value; onRename(wall.name); });
    this.content.appendChild(nameInp);

    // ── Attachment ────────────────────────────────────────────────────────
    this.section('ATTACHMENT');
    if (wall.parentType === 'base') {
      this.numRow('X (cm)',     wall.basePosX, -200, 200, 1, v => { wall.basePosX = v; onGeomChange(); });
      this.numRow('Z (cm)',     wall.basePosZ, -200, 200, 1, v => { wall.basePosZ = v; onGeomChange(); });
      this.numRow('Rot Y°',    wall.baseRotY,  0, 360,   1, v => { wall.baseRotY = v; onGeomChange(); });
      this.numRow('Length (cm)', wall.baseLength, 10, 500, 1, v => { wall.baseLength = v; onGeomChange(); });
    } else {
      this.toggleRow('Full Perimeter', wall.fullPerimeter, v => {
        wall.fullPerimeter = v;
        if (v && !wall.hasGaps) wall.tilt = 0;
        onGeomChange();
      });
      if (!wall.fullPerimeter) {
        this.numRow('Arc Start°', wall.arcStart, 0, 360, 1, v => { wall.arcStart = v; onGeomChange(); });
        this.numRow('Arc End°',   wall.arcEnd,   0, 360, 1, v => { wall.arcEnd = v;   onGeomChange(); });
      }
    }

    // ── Profile ───────────────────────────────────────────────────────────
    this.section('PROFILE');
    this.numRow('Height (cm)', wall.height, MIN_WALL_HEIGHT, 100, 1, v => { wall.height = v; onGeomChange(); });

    const tiltDisabled = wall.fullPerimeter && !wall.hasGaps;
    const tiltWrap = this.numRow('Tilt°', wall.tilt, -90, 30, 1, v => {
      if (tiltDisabled) return;
      wall.tilt = v; onGeomChange();
    });
    if (tiltDisabled) {
      const hint = document.createElement('div'); hint.className = 'prop-hint';
      hint.textContent = 'Use partial arc or gaps to enable tilt';
      tiltWrap?.appendChild(hint);
    }

    this.section('TOP PROFILE');
    this._wallTopProfileRow(wall, onGeomChange);
    if (wall.topProfile !== 'flat') {
      this.numRow('Amplitude (cm)', wall.topAmplitude, 0, 10, 0.5, v => { wall.topAmplitude = v; onGeomChange(); });
      this.numRow('Frequency', wall.topFrequency, 0.1, 5, 0.1, v => { wall.topFrequency = v; onGeomChange(); });
    }

    // ── Gaps ──────────────────────────────────────────────────────────────
    this.section('GAPS');
    this.toggleRow('Has Gaps', wall.hasGaps, v => {
      wall.hasGaps = v;
      if (!v && wall.fullPerimeter) wall.tilt = 0;
      onGeomChange();
    });
    if (wall.hasGaps) {
      this.numRow('Panel Width (cm)', wall.panelWidth, MIN_WALL_GAP, 500, 1, v => { wall.panelWidth = v; onGeomChange(); });
      this.numRow('Gap Width (cm)',   wall.gapWidth,   MIN_WALL_GAP, 500, 1, v => { wall.gapWidth = v;   onGeomChange(); });
    }

    // ── Double wall ───────────────────────────────────────────────────────
    this.section('DOUBLE WALL (/\\)');
    this.toggleRow('Enable', wall.isDouble, v => { wall.isDouble = v; onGeomChange(); });
    if (wall.isDouble) {
      this.numRow('Peak Height (cm)', wall.peakHeight, 1, wall.height, 1, v => { wall.peakHeight = v; onGeomChange(); });
      this.numRow('Peak Tilt°',       wall.peakTilt,   0, 60, 1,         v => { wall.peakTilt = v;   onGeomChange(); });
    }

    // ── Physics material ──────────────────────────────────────────────────
    this.section('PHYSICS MATERIAL');
    this._wallMaterialRow(wall, ['rubber','stone','abs','metal'], onGeomChange);

    // ── Appearance ────────────────────────────────────────────────────────
    this.section('APPEARANCE');
    this.colorRow('Color', wall.color, v => { wall.color = v; onGeomChange(); });
    this.surfaceRow(
      { surface: wall.surface, customTileData: null, tileScale: 20, color: wall.color },
      () => onGeomChange(),
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     BRIDGE PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showBridge(
    bridge: BridgeData,
    arenaNames: Map<string, string>,    // id → name
    wallNames: Map<string, string>,
    onGeomChange: () => void,
    onRename: (name: string) => void,
    onAddSegment: (type: BridgeSegmentType) => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = bridge.name;
    nameInp.addEventListener('input', () => { bridge.name = nameInp.value; onRename(bridge.name); });
    this.content.appendChild(nameInp);

    // ── Start anchor ─────────────────────────────────────────────────────
    this.section('START ANCHOR');
    const ref = bridge.startRef;
    const types: [BridgeEndpointType | 'none', string][] = [
      ['none', 'Floating'], ['arena', 'Arena'], ['wall', 'Wall'], ['freepoint', 'Free pt'],
    ];
    const typeRow = document.createElement('div'); typeRow.className = 'prop-profile-row';
    const curType = ref?.type ?? 'none';
    for (const [t, label] of types) {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (curType === t ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        if (t === 'none') { bridge.startRef = null; }
        else {
          bridge.startRef = bridge.startRef ?? {
            type: t as BridgeEndpointType, id: '', angle: 0, wallHeight: 0,
            freePosX: 0, freePosY: 31, freePosZ: 0, freeDirDeg: 0,
          };
          bridge.startRef.type = t as BridgeEndpointType;
        }
        onGeomChange();
      });
      typeRow.appendChild(btn);
    }
    this.content.appendChild(typeRow);

    if (ref?.type === 'arena') {
      this._selectRow('Arena', [...arenaNames.entries()], ref.id, v => { ref.id = v; onGeomChange(); });
      this.numRow('Angle°', ref.angle, 0, 360, 1, v => { ref.angle = v; onGeomChange(); });
    } else if (ref?.type === 'wall') {
      this._selectRow('Wall', [...wallNames.entries()], ref.id, v => { ref.id = v; onGeomChange(); });
      this.numRow('Angle°', ref.angle, 0, 360, 1, v => { ref.angle = v; onGeomChange(); });
      this.numRow('Height t', ref.wallHeight, 0, 1, 0.05, v => { ref.wallHeight = v; onGeomChange(); });
    } else if (ref?.type === 'freepoint') {
      this.numRow('X (cm)',    ref.freePosX,  -500, 500, 1,  v => { ref.freePosX = v;  onGeomChange(); });
      this.numRow('Y (cm)',    ref.freePosY,     0, 500, 1,  v => { ref.freePosY = v;  onGeomChange(); });
      this.numRow('Z (cm)',    ref.freePosZ,  -500, 500, 1,  v => { ref.freePosZ = v;  onGeomChange(); });
      this.numRow('Heading°', ref.freeDirDeg, 0, 360, 1, v => { ref.freeDirDeg = v; onGeomChange(); });
    }

    // ── Track cross-section ───────────────────────────────────────────────
    this.section('TRACK CROSS-SECTION');
    const sec = bridge.section;
    this.numRow('Width (cm)', sec.width, 5, 100, 1, v => { sec.width = v; onGeomChange(); });
    const csRow = document.createElement('div'); csRow.className = 'prop-profile-row';
    for (const [cs, label] of [['flat','━ Flat'],['u_channel','⌣ U-Channel']] as [BridgeCrossSection, string][]) {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (sec.crossSection === cs ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => { sec.crossSection = cs; onGeomChange(); });
      csRow.appendChild(btn);
    }
    this.content.appendChild(csRow);
    if (sec.crossSection === 'u_channel') {
      this.numRow('Depth (cm)', sec.depth, 1, 20, 0.5, v => { sec.depth = v; onGeomChange(); });
    }
    this.toggleRow('Left Rail Wall',  sec.hasLeftWall,  v => { sec.hasLeftWall = v;  onGeomChange(); });
    this.toggleRow('Right Rail Wall', sec.hasRightWall, v => { sec.hasRightWall = v; onGeomChange(); });
    if (sec.hasLeftWall || sec.hasRightWall) {
      this.numRow('Rail Wall Height (cm)', sec.sideWallHeight, 2, 30, 1, v => { sec.sideWallHeight = v; onGeomChange(); });
    }
    this.section('BRIDGE MATERIAL');
    this._wallMaterialRow(sec, ['stone','abs','metal'], onGeomChange);

    // ── Appearance ────────────────────────────────────────────────────────
    this.section('APPEARANCE');
    this.colorRow('Color', bridge.color, v => { bridge.color = v; onGeomChange(); });
    this.surfaceRow(
      { surface: bridge.surface, customTileData: null, tileScale: 20, color: bridge.color },
      () => onGeomChange(),
    );

    // ── Add segment ───────────────────────────────────────────────────────
    this.section('SEGMENTS');
    const addHint = document.createElement('div'); addHint.className = 'prop-hint';
    addHint.textContent = 'Track shape does not change when you add segments — only path does.';
    this.content.appendChild(addHint);
    this._addSegmentButtons(onAddSegment);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     BRIDGE SEGMENT PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showBridgeSegment(
    seg: BridgeSegmentData,
    onGeomChange: () => void,
    onRename: (name: string) => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = seg.name;
    nameInp.addEventListener('input', () => { seg.name = nameInp.value; onRename(seg.name); });
    this.content.appendChild(nameInp);

    // ── Type ──────────────────────────────────────────────────────────────
    this.section('SEGMENT TYPE');
    this._addSegmentButtons(type => { seg.type = type; onGeomChange(); }, seg.type);

    // ── Shape params (per type) ───────────────────────────────────────────
    this.section('SHAPE');
    switch (seg.type) {
      case 'straight':
        this.numRow('Length (cm)', seg.length, 5, 500, 1, v => { seg.length = v; onGeomChange(); });
        break;
      case 'ramp':
        this.numRow('Length (cm)', seg.length, 5, 500, 1, v => { seg.length = v; onGeomChange(); });
        this.numRow('Ramp Angle°', seg.rampAngle, -45, 45, 1, v => { seg.rampAngle = v; onGeomChange(); });
        break;
      case 'curve':
        this.numRow('Radius (cm)', seg.curveRadius, 5, 200, 1, v => { seg.curveRadius = v; onGeomChange(); });
        this.numRow('Angle°',      seg.curveAngle,  10, 360, 5, v => { seg.curveAngle = v; onGeomChange(); });
        this._dirRow(seg, onGeomChange);
        this.numRow('Bank°',       seg.bankAngle, 0, 60, 1, v => { seg.bankAngle = v; onGeomChange(); });
        break;
      case 'hairpin':
        this.numRow('Radius (cm)', seg.curveRadius, 5, 100, 1, v => { seg.curveRadius = v; onGeomChange(); });
        this._dirRow(seg, onGeomChange);
        break;
      case 'loop':
        this.numRow('Loop Radius (cm)', seg.loopRadius, 5, 100, 1, v => { seg.loopRadius = v; onGeomChange(); });
        break;
      case 'corkscrew':
        this.numRow('Length (cm)', seg.corkscrewLength, 10, 300, 1, v => { seg.corkscrewLength = v; onGeomChange(); });
        this.numRow('Turns',       seg.corkscrewTurns,  0.5, 5, 0.5, v => { seg.corkscrewTurns = v; onGeomChange(); });
        break;
      case 'chicane':
        this.numRow('Radius (cm)',    seg.curveRadius, 5, 100, 1,  v => { seg.curveRadius = v; onGeomChange(); });
        this.numRow('Half Angle°',    seg.curveAngle / 2, 10, 90, 5, v => { seg.curveAngle = v * 2; onGeomChange(); });
        this._dirRow(seg, onGeomChange);
        break;
      case 'bezier':
        this.numRow('CP1 X', seg.cp1X, -200, 200, 1, v => { seg.cp1X = v; onGeomChange(); });
        this.numRow('CP1 Y', seg.cp1Y, -100, 200, 1, v => { seg.cp1Y = v; onGeomChange(); });
        this.numRow('CP1 Z', seg.cp1Z, -200, 200, 1, v => { seg.cp1Z = v; onGeomChange(); });
        this.numRow('CP2 X', seg.cp2X, -200, 200, 1, v => { seg.cp2X = v; onGeomChange(); });
        this.numRow('CP2 Y', seg.cp2Y, -100, 200, 1, v => { seg.cp2Y = v; onGeomChange(); });
        this.numRow('CP2 Z', seg.cp2Z, -200, 200, 1, v => { seg.cp2Z = v; onGeomChange(); });
        this.numRow('End X', seg.endX, -200, 200, 1, v => { seg.endX = v; onGeomChange(); });
        this.numRow('End Y', seg.endY, -100, 200, 1, v => { seg.endY = v; onGeomChange(); });
        this.numRow('End Z', seg.endZ, -200, 200, 1, v => { seg.endZ = v; onGeomChange(); });
        break;
    }

    // ── Appearance (optional override) ────────────────────────────────────
    this.section('APPEARANCE');
    const inheritHint = document.createElement('div'); inheritHint.className = 'prop-hint';
    inheritHint.textContent = 'Cross-section (width/depth/physics) is always set on the parent bridge.';
    this.content.appendChild(inheritHint);
  }

  /* ── Wall / bridge private helpers ─────────────────────────────────── */

  private _wallTopProfileRow(wall: WallData, onChange: () => void): void {
    const defs: [WallTopProfile, string][] = [
      ['flat','━ Flat'], ['triangles','▲ Triangles'], ['waves','∿ Waves'],
      ['serrated','⟋ Serrated'], ['crenellated','⊓ Crenellated'],
    ];
    const row = document.createElement('div'); row.className = 'prop-profile-row';
    const btns: HTMLButtonElement[] = [];
    for (const [p, label] of defs) {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (wall.topProfile === p ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        wall.topProfile = p;
        btns.forEach((b, i) => b.classList.toggle('active', defs[i][0] === p));
        onChange();
      });
      btns.push(btn); row.appendChild(btn);
    }
    this.content.appendChild(row);
  }

  private _wallMaterialRow(
    target: { material: ArenaMaterial },
    allowed: ArenaMaterial[],
    onChange: () => void,
  ): void {
    const LABELS: Record<ArenaMaterial, string> = { rubber:'🔴 Rubber', stone:'◈ Stone', abs:'▣ ABS', metal:'⬡ Metal' };
    const row = document.createElement('div'); row.className = 'prop-profile-row';
    const btns: HTMLButtonElement[] = [];
    for (const mat of allowed) {
      const preset = ARENA_MATERIAL_PRESETS[mat];
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (target.material === mat ? ' active' : '');
      btn.textContent = LABELS[mat];
      btn.title = `Restitution ${preset.restitution} · Spin-loss ${preset.spinLossFactor} · Damage ×${preset.damageFactor}`;
      btn.addEventListener('click', () => {
        target.material = mat;
        btns.forEach((b, i) => b.classList.toggle('active', allowed[i] === mat));
        onChange();
      });
      btns.push(btn); row.appendChild(btn);
    }
    this.content.appendChild(row);
  }

  private _addSegmentButtons(onAdd: (type: BridgeSegmentType) => void, active?: BridgeSegmentType): void {
    const defs: [BridgeSegmentType, string, string][] = [
      ['straight',  '━',  'Straight'],
      ['ramp',      '↗',  'Ramp'],
      ['curve',     '↩',  'Curve'],
      ['hairpin',   '↺',  'Hairpin'],
      ['loop',      '⭕', 'Loop'],
      ['corkscrew', '🌀', 'Corkscrew'],
      ['chicane',   '⟨⟩', 'Chicane'],
      ['bezier',    '〜', 'Bezier'],
    ];
    const grid = document.createElement('div'); grid.className = 'prop-shape-grid';
    for (const [type, icon, label] of defs) {
      const btn = document.createElement('button');
      btn.className = 'prop-shape-btn' + (active === type ? ' active' : '');
      btn.innerHTML = `<span class="prop-shape-icon">${icon}</span><span>${label}</span>`;
      btn.addEventListener('click', () => onAdd(type));
      grid.appendChild(btn);
    }
    this.content.appendChild(grid);
  }

  private _dirRow(seg: BridgeSegmentData, onChange: () => void): void {
    const row = document.createElement('div'); row.className = 'prop-profile-row';
    const lbl = document.createElement('span'); lbl.className = 'prop-row-label'; lbl.textContent = 'Direction';
    row.appendChild(lbl);
    for (const [d, label] of [['left','↰ Left'],['right','↱ Right']] as ['left'|'right', string][]) {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (seg.curveDirection === d ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => { seg.curveDirection = d; onChange(); });
      row.appendChild(btn);
    }
    this.content.appendChild(row);
  }

  private _selectRow(label: string, options: [string, string][], value: string, onChange: (v: string) => void): void {
    const row = document.createElement('div'); row.className = 'prop-row';
    const lbl = document.createElement('span'); lbl.className = 'prop-label'; lbl.textContent = label;
    const sel = document.createElement('select'); sel.className = 'prop-input';
    for (const [id, name] of options) {
      const opt = document.createElement('option'); opt.value = id; opt.textContent = name;
      if (id === value) opt.selected = true;
      sel.appendChild(opt);
    }
    sel.addEventListener('change', () => onChange(sel.value));
    row.appendChild(lbl); row.appendChild(sel); this.content.appendChild(row);
  }

  /* ── Speed Line ─────────────────────────────────────────────────────────── */

  showSpeedLine(
    sl: SpeedLineData,
    arena: ArenaData,
    onGeomChange: () => void,
    onSegmentChange: (k: number) => void,
    onRename: (name: string) => void,
    onColorChange: () => void,
    onAddSegment: (segs: SpeedLineSegment[]) => void,
    onRemoveSegment: (k: number) => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = sl.name;
    nameInp.addEventListener('input', () => { sl.name = nameInp.value; onRename(sl.name); });
    this.content.appendChild(nameInp);

    this.section('START');
    const arenaMaxR = Math.min(arena.radiusX, arena.radiusZ);
    this.numRow('Start Dist',  sl.startR,     0, arenaMaxR, 0.5, v => { sl.startR = v;     onGeomChange(); });
    this.numRow('Start Angle', sl.startAngle, 0, 360,       1,   v => { sl.startAngle = v; onGeomChange(); });
    this.numRow('Start Dir °', sl.startDir,   -180, 180,    1,   v => { sl.startDir = v;   onGeomChange(); });

    this.section('SEGMENTS');

    // Template dropdown
    const tmplRow = document.createElement('div');
    tmplRow.className = 'prop-row';
    const tmplLbl = document.createElement('span');
    tmplLbl.className = 'prop-label'; tmplLbl.textContent = 'Add from template';
    const tmplSel = document.createElement('select');
    tmplSel.className = 'prop-select';
    for (const [v, lbl] of [
      ['blank','Blank'],['straight','Straight'],['circle','Circle'],
      ['spiral','Spiral'],['zigzag','Zigzag'],['wave','Wave'],
      ['climb','Climb'],['loop','Loop (aerial)'],['corkscrew','Corkscrew'],
      ['ramp','Launch Ramp'],
    ]) {
      const o = document.createElement('option'); o.value = v; o.textContent = lbl; tmplSel.appendChild(o);
    }
    const tmplBtn = document.createElement('button');
    tmplBtn.className = 'game-btn'; tmplBtn.style.marginLeft = '4px'; tmplBtn.textContent = '+ Add';
    tmplBtn.addEventListener('click', () => {
      let segs: SpeedLineSegment[] = [];
      switch (tmplSel.value) {
        case 'blank':      segs = [{ id:'', length: SL.DEFAULT_SEG_LENGTH, rotX:0, rotY:0, rotZ:0, speedMult:0, objRotX:0, objRotY:0, objRotZ:0 }]; break;
        case 'straight':   segs = templateStraight(40, 5); break;
        case 'circle':     segs = templateCircle(20, 36); if (!sl.surfaceFollow) { /* keep */ } break;
        case 'spiral':     segs = templateSpiral(20, 1, 18); break;
        case 'zigzag':     segs = templateZigzag(8, 8, 8); break;
        case 'wave':       segs = templateWave(5, 8, 8); break;
        case 'climb':      segs = templateClimb(15, 6, 8); break;
        case 'loop':       segs = templateLoop(12, 12); sl.surfaceFollow = false; sl.overridePhysics = true; break;
        case 'corkscrew':  segs = templateCorkscrew(10, 1, 12); sl.surfaceFollow = false; break;
        case 'ramp':       segs = templateLaunchRamp(45, 3, 6, 8); sl.surfaceFollow = false; break;
      }
      onAddSegment(segs);
    });
    tmplRow.appendChild(tmplLbl); tmplRow.appendChild(tmplSel); tmplRow.appendChild(tmplBtn);
    this.content.appendChild(tmplRow);

    // Per-segment collapsible rows
    for (let k = 0; k < sl.segments.length; k++) {
      const seg = sl.segments[k];
      const segHeader = document.createElement('div');
      segHeader.className = 'prop-row';
      segHeader.style.cursor = 'pointer';
      const segTitle = document.createElement('span');
      segTitle.className = 'prop-label'; segTitle.textContent = `▶ Segment ${k + 1}`;
      const delBtn = document.createElement('button');
      delBtn.className = 'game-btn'; delBtn.textContent = '✕';
      delBtn.style.marginLeft = 'auto'; delBtn.style.fontSize = '0.75em';
      delBtn.addEventListener('click', e => { e.stopPropagation(); onRemoveSegment(k); });
      segHeader.appendChild(segTitle); segHeader.appendChild(delBtn);
      this.content.appendChild(segHeader);

      const segBody = document.createElement('div');
      segBody.style.display = 'none'; segBody.style.paddingLeft = '12px';
      segHeader.addEventListener('click', () => {
        const open = segBody.style.display !== 'none';
        segBody.style.display = open ? 'none' : 'block';
        segTitle.textContent = (open ? '▶' : '▼') + ` Segment ${k + 1}`;
      });

      const addSegNum = (lbl: string, val: number, min: number, max: number, step: number, set: (v: number) => void) => {
        const r = document.createElement('div'); r.className = 'prop-row';
        const lb = document.createElement('span'); lb.className = 'prop-label'; lb.textContent = lbl;
        const inp = document.createElement('input'); inp.type = 'number'; inp.className = 'prop-input';
        inp.value = String(val); inp.min = String(min); inp.max = String(max); inp.step = String(step);
        inp.addEventListener('input', () => { set(parseFloat(inp.value) || 0); onSegmentChange(k); });
        r.appendChild(lb); r.appendChild(inp); segBody.appendChild(r);
      };

      addSegNum('Length cm', seg.length, 0.5, 100, 0.5, v => { seg.length = v; });
      addSegNum('Rot X °',   seg.rotX,   -180, 180, 1,   v => { seg.rotX = v; });
      addSegNum('Rot Y °',   seg.rotY,   -180, 180, 1,   v => { seg.rotY = v; });
      addSegNum('Rot Z °',   seg.rotZ,   -180, 180, 1,   v => { seg.rotZ = v; });
      addSegNum('Speed ×',   seg.speedMult, 0, SL.SPEED_MULT_MAX, 0.1, v => { seg.speedMult = v; });
      addSegNum('Obj Rot X°/cm', seg.objRotX, -45, 45, 0.5, v => { seg.objRotX = v; });
      addSegNum('Obj Rot Y°/cm', seg.objRotY, -45, 45, 0.5, v => { seg.objRotY = v; });
      addSegNum('Obj Rot Z°/cm', seg.objRotZ, -45, 45, 0.5, v => { seg.objRotZ = v; });

      this.content.appendChild(segBody);
    }

    // Add blank segment button
    const addBtn = document.createElement('button');
    addBtn.className = 'game-btn'; addBtn.textContent = '+ Add segment';
    addBtn.style.width = '100%'; addBtn.style.margin = '4px 0';
    addBtn.addEventListener('click', () => onAddSegment([{
      id: '', length: SL.DEFAULT_SEG_LENGTH, rotX: 0, rotY: 0, rotZ: 0,
      speedMult: 0, objRotX: 0, objRotY: 0, objRotZ: 0,
    }]));
    this.content.appendChild(addBtn);

    this.toggleRow('Surface Follow', sl.surfaceFollow, v => { sl.surfaceFollow = v; onGeomChange(); });

    this.section('RIBBON');
    this.numRow('Width cm', sl.width, SL.WIDTH_MIN, SL.WIDTH_MAX, 0.1, v => { sl.width = v; onColorChange(); });
    this.colorRow('Color', sl.color, v => { sl.color = v; onColorChange(); });
    this.numRow('Opacity', sl.opacity, 0, 1, 0.05, v => { sl.opacity = v; onColorChange(); });
    this.toggleRow('Glow', sl.glowColor !== null, v => {
      sl.glowColor = v ? sl.color : null; onColorChange();
    });

    this.section('TARGET & ACTIVATION');
    this.selectRow('Target', [
      {value:'beyblade',label:'Beyblade'},{value:'water',label:'Water'},
      {value:'obstacle',label:'Obstacle'},{value:'item',label:'Item'},
      {value:'any',label:'Any'},{value:'custom',label:'Custom'},
    ], sl.targetType, v => { sl.targetType = v as SpeedLineData['targetType']; onGeomChange(); });
    if (sl.targetType === 'custom') {
      this.textRow('Target Tag', sl.targetTag, v => { sl.targetTag = v; });
    }
    this.selectRow('Activation', [
      {value:'always',label:'Always'},{value:'event',label:'Event'},
      {value:'periodic',label:'Periodic'},{value:'proximity',label:'Proximity'},
    ], sl.activationMode, v => { sl.activationMode = v as SpeedLineData['activationMode']; onGeomChange(); });
    if (sl.activationMode === 'event') {
      this.textRow('Trigger Event', sl.triggerEvent, v => { sl.triggerEvent = v; });
      this.textRow('End Event', sl.endEvent, v => { sl.endEvent = v; });
      this.numRow('Active ms', sl.activeDuration, 0, 60000, 100, v => { sl.activeDuration = v; });
      this.numRow('Fade In ms', sl.fadeIn, 0, 5000, 50, v => { sl.fadeIn = v; });
      this.numRow('Fade Out ms', sl.fadeOut, 0, 5000, 50, v => { sl.fadeOut = v; });
    } else if (sl.activationMode === 'periodic') {
      this.numRow('Period ms', sl.period, 100, 10000, 100, v => { sl.period = v; });
      this.numRow('Duty 0–1',  sl.activeDuty, 0, 1, 0.05, v => { sl.activeDuty = v; });
      this.numRow('Fade In ms', sl.fadeIn, 0, 5000, 50, v => { sl.fadeIn = v; });
      this.numRow('Fade Out ms', sl.fadeOut, 0, 5000, 50, v => { sl.fadeOut = v; });
    } else if (sl.activationMode === 'proximity') {
      this.numRow('Radius cm', sl.activationRadius, 1, 100, 1, v => { sl.activationRadius = v; onGeomChange(); });
    }

    this.section('OSCILLATION');
    this.toggleRow('Oscillate', sl.oscillate, v => { sl.oscillate = v; });
    if (sl.oscillate) {
      this.selectRow('Axis', [
        {value:'path',label:'Path'},{value:'lateral',label:'Lateral'},
        {value:'normal',label:'Normal'},{value:'all',label:'All'},
      ], sl.oscAxis, v => { sl.oscAxis = v as SpeedLineData['oscAxis']; });
      this.numRow('Amplitude cm', sl.oscAmplitude, 0, 20, 0.5, v => { sl.oscAmplitude = v; });
      this.numRow('Frequency Hz', sl.oscFrequency, 0.1, 10, 0.1, v => { sl.oscFrequency = v; });
      this.numRow('Phase °', sl.oscPhase, 0, 360, 5, v => { sl.oscPhase = v; });
    }

    this.section('GAMEPLAY');
    this.numRow('Speed ×', sl.speedMultiplier, SL.SPEED_MULT_MIN, SL.SPEED_MULT_MAX, 0.1, v => { sl.speedMultiplier = v; });
    this.selectRow('Entry', [
      {value:'always',label:'Always'},{value:'moving_only',label:'Moving only'},
      {value:'fast_only',label:'Fast only'},{value:'slow_only',label:'Slow only'},
    ], sl.entryCondition, v => { sl.entryCondition = v as SpeedLineData['entryCondition']; });
    this.selectRow('Direction', [
      {value:'forward',label:'Forward'},{value:'reverse',label:'Reverse'},
      {value:'bidirectional',label:'Both'},
    ], sl.direction, v => { sl.direction = v as SpeedLineData['direction']; });
    this.selectRow('Exit', [
      {value:'normal',label:'Normal'},{value:'launch',label:'Launch'},
      {value:'loop',label:'Loop (repeat)'},{value:'special_move',label:'Special Move'},
    ], sl.exitBehavior, v => { sl.exitBehavior = v as SpeedLineData['exitBehavior']; onGeomChange(); });
    if (sl.exitBehavior === 'launch') {
      this.numRow('Launch ×', sl.launchForce, SL.LAUNCH_FORCE_MIN, SL.LAUNCH_FORCE_MAX, 0.1, v => { sl.launchForce = v; });
    }
    if (sl.exitBehavior === 'special_move') {
      this.textRow('Move Name', sl.specialMoveName, v => { sl.specialMoveName = v; });
    }
    this.toggleRow('Mid-Air Entry', sl.allowMidAirEntry, v => { sl.allowMidAirEntry = v; });
    this.toggleRow('Override Physics', sl.overridePhysics, v => { sl.overridePhysics = v; });
    this.numRow('Swap Priority', sl.swapPriority, SL.SWAP_PRIORITY_MIN, SL.SWAP_PRIORITY_MAX, 1, v => { sl.swapPriority = Math.round(v); });

    this.section('INFO');
    this.readRow('Total Length', `${sl.totalLength.toFixed(1)} cm`);
    this.readRow('Segments', String(sl.segments.length));
    this.readRow('Overlaps', String(sl.overlapMarkers.length));
  }

}

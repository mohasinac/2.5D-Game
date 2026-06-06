import * as THREE from 'three';
import {
  APOTHEM, MIN_WALL_HEIGHT, MIN_WALL_GAP, ARENA_MATERIAL_PRESETS, SL, JL,
  MIN_OBSTACLE_DIM, MIN_TRAP_DIM, BUFF_TIER_PRESETS, ARENA_LIGHT_PRESETS,
  MIN_ZONE_DEPTH, ROT, ENV,
} from '../config/arenaConstants';
import {
  ArenaData, PitData, ZoneData, SpeedLineData, SpeedLineSegment,
  OpeningShape, WallProfile, RampMode, ZoneFill, SurfaceType, ArenaMaterial, ShapeParams,
  WallData, WallTopProfile, WallHoleData,
  BridgeData, BridgeSection, BridgeSegmentData, BridgeSegmentType, BridgeCrossSection,
  BridgeEndpointRef, BridgeEndpointType,
  ObstacleData, ObstacleShape, ObstacleTheme,
  TrapData, TrapShape, TrapEffect, TrapVariant, TrapTierEffect, TrapDurationTier,
  PortalData, PortalDestType,
  RotationData, BridgeSnapRule,
  ParticlePreset,
  BaseFootingData, WeatherPreset,
  PresentConfig, ParticleConfig,
  SpeedLinePresetType, SpeedLineSection, SpeedLineStatModifiers, SpeedLineRampProfile,
  SpeedLineModType, SpeedLineModWaveform, SpeedLinePresetParams,
  JumpLinkData, JumpLinkEndpoint, JumpEndpointMode, JumpLinkParentType, JumpArcProfile,
  EnvProperty, EnvKeyframe, EnvScheduleEntry,
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
    onLightChange?: () => void,
    onParticleChange?: () => void,
    onStlImport?: (cb: (b64: string) => void) => void,
    onStlClear?: () => void,
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
      if (data.wallProfile === 'step')   this._moatOuterStepSubOptions(data, onGeomChange, onFullChange);
      if (data.wallProfile === 'spiral') this._spiralSubOptions(data, onFullChange);
      this.section('INNER WALL');
      this.innerProfileRow(data, onFullChange);
      if (data.innerWallProfile === 'step')   this._moatInnerStepSubOptions(data, onGeomChange, onFullChange);
      if (data.innerWallProfile === 'spiral') this._innerSpiralSubOptions(data, onFullChange);
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

    if (data.wallProfile === 'step') {
      this.section('STEPS APPEARANCE');
      this.colorRow('Steps Color', data.stepsColor ?? data.color, v => { data.stepsColor = v; onFullChange(); });
      const stepsProxy = {
        surface: (data.stepsSurface ?? 'plain') as SurfaceType,
        customTileData: data.stepsCustomTileData,
        tileScale: 1,
        color: data.stepsColor ?? data.color,
      };
      this.surfaceRow(stepsProxy, () => {
        data.stepsSurface = stepsProxy.surface;
        data.stepsCustomTileData = stepsProxy.customTileData;
        onFullChange();
      });
    }

    if (data.wallProfile === 'spiral' && data.spiralCount > 0) {
      this.section('SPIRAL APPEARANCE');
      this.colorRow('Spiral Color', data.spiralColor ?? data.color, v => { data.spiralColor = v; onFullChange(); });
      const spiralProxy = {
        surface: (data.spiralSurface ?? 'plain') as SurfaceType,
        customTileData: data.spiralCustomTileData,
        tileScale: 1,
        color: data.spiralColor ?? data.color,
      };
      this.surfaceRow(spiralProxy, () => {
        data.spiralSurface = spiralProxy.surface;
        data.spiralCustomTileData = spiralProxy.customTileData;
        onFullChange();
      });
    }

    this.section('ARENA LIGHT');
    const lightPresetRow = document.createElement('div'); lightPresetRow.className = 'prop-profile-row';
    for (const [key, preset] of Object.entries(ARENA_LIGHT_PRESETS)) {
      const btn = document.createElement('button');
      btn.className = 'game-btn prop-profile-btn'; btn.textContent = key;
      if (preset.intensity > 0) btn.style.color = '#' + preset.color.toString(16).padStart(6, '0');
      btn.addEventListener('click', () => {
        data.lightColor = preset.color; data.lightIntensity = preset.intensity;
        data.lightPosY = preset.posY; data.lightRange = preset.range;
        (onLightChange ?? onGeomChange)();
      });
      lightPresetRow.appendChild(btn);
    }
    this.content.appendChild(lightPresetRow);
    this.colorRow('Light Color', data.lightColor, v => { data.lightColor = v; (onLightChange ?? onGeomChange)(); });
    this.numRow('Intensity', data.lightIntensity, 0, 3, 0.1, v => { data.lightIntensity = v; (onLightChange ?? onGeomChange)(); });
    this.numRow('Height cm', data.lightPosY, 0, 100, 1, v => { data.lightPosY = v; (onLightChange ?? onGeomChange)(); });
    this.numRow('Range cm', data.lightRange, 50, 500, 10, v => { data.lightRange = v; (onLightChange ?? onGeomChange)(); });

    this.section('PARTICLES');
    const PARTICLE_OPTS: ParticlePreset[] = ['none','embers','snow','sparks','dust','bubbles','void_motes'];
    this.selectRow('Preset', PARTICLE_OPTS.map(p => ({ value: p, label: p })), data.particlePreset, v => {
      data.particlePreset = v as ParticlePreset; (onParticleChange ?? onGeomChange)();
    });

    this.section('PRESENTATION STL');
    this.buttonRow('', data.presentStlb64 ? '✓ Replace STL…' : 'Import STL…', () => {
      onStlImport?.((b64) => { data.presentStlb64 = b64; onGeomChange(); });
    });
    if (data.presentStlb64) {
      this.colorRow('Present Color', data.presentColor, v => { data.presentColor = v; onGeomChange(); });
      this.buttonRow('', 'Clear STL', () => { data.presentStlb64 = null; onStlClear?.(); onGeomChange(); });
    }
  }

  showPit(
    pit: PitData, arena: ArenaData,
    onGeomChange: () => void, onFullChange: () => void,
    onRename: (name: string) => void, onColorChange: () => void, onSurfaceChange: () => void,
    onGlowChange?: () => void,
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
    this.readRow('Depth', '10 cm (fixed)');

    this.section('SURFACE');
    this.colorRow('Color', pit.color, v=>{ pit.color=v; onColorChange(); });
    this.surfaceRow(pit, onSurfaceChange);

    this.section('POSITION (arena-local)');
    const maxChildR_pit = Math.max(pit.radiusX, pit.radiusZ);
    this.numRow('Dist (cm)', pit.posR,     0, Math.max(0, arenaMinR_pit - maxChildR_pit), 1, v=>{ pit.posR=v; onGeomChange(); });
    this.numRow('Angle °',   pit.posAngle, 0, 360,     1, v=>{ pit.posAngle=v; onGeomChange(); });
    this.numRow('Rotate °',  pit.rotY,     0, 360,     1, v=>{ pit.rotY=v; onGeomChange(); });

    this.section('RIM GLOW');
    this.colorRow('Glow Color', pit.rimGlowColor, v => { pit.rimGlowColor = v; (onGlowChange ?? onGeomChange)(); });
    this.numRow('Intensity', pit.rimGlowIntensity, 0, 3, 0.1, v => { pit.rimGlowIntensity = v; (onGlowChange ?? onGeomChange)(); });
  }

  showZone(
    zone: ZoneData, arena: ArenaData,
    onGeomChange: () => void, onFullChange: () => void,
    onRename: (name: string) => void,
    onGlowChange?: () => void,
    onParticleChange?: () => void,
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
      if (zone.innerWallProfile === 'step')   this._moatInnerStepSubOptions(zone as unknown as ArenaData, onGeomChange, onFullChange);
      if (zone.innerWallProfile === 'spiral') this._innerSpiralSubOptions(zone, onFullChange);
    }

    this.section('DIMENSIONS');
    const arenaMinR_zone = Math.min(arena.radiusX, arena.radiusZ);
    const maxDepth = Math.min(15, arena.depth);
    this.numRow('Radius X', zone.radiusX, 2, Math.max(2, arenaMinR_zone - zone.posR), 1, v=>{ zone.radiusX=v; onGeomChange(); });
    this.numRow('Radius Z', zone.radiusZ, 2, Math.max(2, arenaMinR_zone - zone.posR), 1, v=>{ zone.radiusZ=v; onGeomChange(); });
    this.numRow('Depth',    zone.depth,   MIN_ZONE_DEPTH, maxDepth, 0.5, v=>{ zone.depth=v; onGeomChange(); });

    this.section('FILL');
    this.fillGrid(zone, onGeomChange);

    this.section('POSITION (arena-local)');
    const maxChildR_zone = Math.max(zone.radiusX, zone.radiusZ);
    this.numRow('Dist (cm)', zone.posR,     0, Math.max(0, arenaMinR_zone - maxChildR_zone), 1, v=>{ zone.posR=v; onGeomChange(); });
    this.numRow('Angle °',   zone.posAngle, 0, 360,     1, v=>{ zone.posAngle=v; onGeomChange(); });
    this.numRow('Rotate °',  zone.rotY,     0, 360,     1, v=>{ zone.rotY=v; onGeomChange(); });

    this.section('SEAM GLOW');
    this.colorRow('Glow Color', zone.seamGlowColor, v => { zone.seamGlowColor = v; (onGlowChange ?? onGeomChange)(); });
    this.numRow('Intensity', zone.seamGlowIntensity, 0, 3, 0.1, v => { zone.seamGlowIntensity = v; (onGlowChange ?? onGeomChange)(); });

    this.section('PARTICLES');
    const ZONE_PARTICLE_OPTS: ParticlePreset[] = ['none','embers','snow','sparks','dust','bubbles','void_motes'];
    this.selectRow('Preset', ZONE_PARTICLE_OPTS.map(p => ({ value: p, label: p })), zone.particlePreset, v => {
      zone.particlePreset = v as ParticlePreset; (onParticleChange ?? onGeomChange)();
    });
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

  /** Full step sub-options for the moat OUTER wall. Uses stepCount/stepStartDepth/rampMode etc.
   *  Max steps = floor(depth / 10). */
  private _moatOuterStepSubOptions(data: ArenaData, onGeomChange: () => void, onFullChange: () => void): void {
    const maxSteps = Math.max(1, Math.floor((data.depth - Math.max(0, data.stepStartDepth)) / 10));
    data.stepCount = Math.min(data.stepCount, maxSteps);

    this.numRow('Step Start (cm)', data.stepStartDepth, 0, Math.max(0, data.depth - 10), 1, v => {
      data.stepStartDepth = v;
      data.stepCount = Math.min(data.stepCount, Math.max(1, Math.floor((data.depth - v) / 10)));
      onGeomChange();
    });
    this.numRow('Step Count', data.stepCount, 1, maxSteps, 1, v => {
      data.stepCount = Math.round(Math.max(1, Math.min(v, maxSteps)));
      onGeomChange();
    });

    // Riser shape
    const riserRow = document.createElement('div'); riserRow.className = 'prop-profile-row';
    const riserLabel = document.createElement('span'); riserLabel.className = 'prop-row-label';
    riserLabel.textContent = 'Riser'; riserRow.appendChild(riserLabel);
    for (const [val, label] of [['parabolic','⌣ Parabolic'],['straight','╱ Straight']] as [string, string][]) {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (data.stepRiserProfile === val ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => { data.stepRiserProfile = val as 'parabolic' | 'straight'; onGeomChange(); });
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
      btn.addEventListener('click', () => { data.rampMode = m; onFullChange(); });
      rampRow.appendChild(btn);
    }
    this.content.appendChild(rampRow);
    if (data.rampMode !== 'full' && data.rampMode !== 'none') {
      this.numRow('Ramp Angle°', data.rampAngle, 0, 359, 1, v => { data.rampAngle = v; onGeomChange(); });
      this.numRow('Ramp Width°', data.rampWidth, 10, 180, 1, v => { data.rampWidth = v; onGeomChange(); });
    }
  }

  /** Full step sub-options for the moat INNER wall. Uses innerStepCount/innerStepStartDepth/innerRampMode etc.
   *  Max steps = floor((depth + innerRimOffset) / 10). */
  private _moatInnerStepSubOptions(data: ArenaData, onGeomChange: () => void, onFullChange: () => void): void {
    const innerHeight = data.depth + data.innerRimOffset;
    const maxSteps = Math.max(1, Math.floor((innerHeight - Math.max(0, data.innerStepStartDepth)) / 10));
    data.innerStepCount = Math.min(data.innerStepCount, maxSteps);

    this.numRow('Step Start (cm)', data.innerStepStartDepth, 0, Math.max(0, innerHeight - 10), 1, v => {
      data.innerStepStartDepth = v;
      data.innerStepCount = Math.min(data.innerStepCount, Math.max(1, Math.floor((innerHeight - v) / 10)));
      onGeomChange();
    });
    this.numRow('Step Count', data.innerStepCount, 1, maxSteps, 1, v => {
      data.innerStepCount = Math.round(Math.max(1, Math.min(v, maxSteps)));
      onGeomChange();
    });

    // Riser shape
    const riserRow = document.createElement('div'); riserRow.className = 'prop-profile-row';
    const riserLabel = document.createElement('span'); riserLabel.className = 'prop-row-label';
    riserLabel.textContent = 'Riser'; riserRow.appendChild(riserLabel);
    for (const [val, label] of [['parabolic','⌣ Parabolic'],['straight','╱ Straight']] as [string, string][]) {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (data.innerStepRiserProfile === val ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => { data.innerStepRiserProfile = val as 'parabolic' | 'straight'; onGeomChange(); });
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
      btn.className = 'prop-profile-btn' + (data.innerRampMode === m ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => { data.innerRampMode = m; onFullChange(); });
      rampRow.appendChild(btn);
    }
    this.content.appendChild(rampRow);
    if (data.innerRampMode !== 'full' && data.innerRampMode !== 'none') {
      this.numRow('Ramp Angle°', data.innerRampAngle, 0, 359, 1, v => { data.innerRampAngle = v; onGeomChange(); });
      this.numRow('Ramp Width°', data.innerRampWidth, 10, 180, 1, v => { data.innerRampWidth = v; onGeomChange(); });
    }
  }

  private _refreshStepCountMax(data: ArenaData): void {
    if (!this._stepCountSlider) return;
    const maxSteps = Math.max(1, Math.floor((data.depth - data.stepStartDepth) / 10));
    this._stepCountSlider.max = String(maxSteps);
    if (data.stepCount > maxSteps) data.stepCount = maxSteps;
    this._stepCountSlider.value = String(data.stepCount);
    const numInp = this._stepCountSlider.parentElement?.querySelector<HTMLInputElement>('input[type=number]');
    if (numInp) numInp.value = String(data.stepCount);
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
    const defs: [WallProfile, string][] = [['parabolic','⌣ Bowl'],['straight','▮ Straight'],['step','▭ Step'],['spiral','↺ Spiral']];
    for (const [p, label] of defs) {
      const btn=document.createElement('button');
      btn.className='prop-profile-btn'+(data.innerWallProfile===p?' active':'');
      btn.textContent=label;
      btn.addEventListener('click',()=>{ data.innerWallProfile=p; onChange(); });
      row.appendChild(btn);
    }
    this.content.appendChild(row);
  }

  private _spiralSubOptions(data: {
    spiralTurns: number; spiralCount: number; spiralClockwise: boolean;
    spiralLedgeWidth: number; spiralLedgeHeight: number; spiralRadiusFrac: number;
  }, onFullChange: () => void): void {
    this.numRow('Turns',        data.spiralTurns,       0.5, 4,   0.5, v => { data.spiralTurns      = v; onFullChange(); });
    this.numRow('Helices',      data.spiralCount,       1,   4,   1,   v => { data.spiralCount      = Math.round(v); onFullChange(); });
    this.toggleRow('Clockwise', data.spiralClockwise,            v => { data.spiralClockwise = v; onFullChange(); });
    this.numRow('Ledge Width cm',  data.spiralLedgeWidth,  1, 8,   0.5, v => { data.spiralLedgeWidth  = v; onFullChange(); });
    this.numRow('Ledge Height cm', data.spiralLedgeHeight, 0.3, 3, 0.1, v => { data.spiralLedgeHeight = v; onFullChange(); });
    this.numRow('Wall Radius',     data.spiralRadiusFrac,  0.3, 1, 0.05,v => { data.spiralRadiusFrac  = v; onFullChange(); });
  }

  private _innerSpiralSubOptions(data: {
    innerSpiralTurns: number; innerSpiralCount: number; innerSpiralClockwise: boolean;
    innerSpiralLedgeWidth: number; innerSpiralLedgeHeight: number; innerSpiralRadiusFrac: number;
  }, onFullChange: () => void): void {
    this.numRow('Turns',        data.innerSpiralTurns,       0.5, 4,   0.5, v => { data.innerSpiralTurns      = v; onFullChange(); });
    this.numRow('Helices',      data.innerSpiralCount,       1,   4,   1,   v => { data.innerSpiralCount      = Math.round(v); onFullChange(); });
    this.toggleRow('Clockwise', data.innerSpiralClockwise,            v => { data.innerSpiralClockwise = v; onFullChange(); });
    this.numRow('Ledge Width cm',  data.innerSpiralLedgeWidth,  1, 8,   0.5, v => { data.innerSpiralLedgeWidth  = v; onFullChange(); });
    this.numRow('Ledge Height cm', data.innerSpiralLedgeHeight, 0.3, 3, 0.1, v => { data.innerSpiralLedgeHeight = v; onFullChange(); });
    this.numRow('Wall Radius',     data.innerSpiralRadiusFrac,  0.3, 1, 0.05,v => { data.innerSpiralRadiusFrac  = v; onFullChange(); });
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
        btn.addEventListener('click', () => { data.rampMode = m; onFullChange(); });
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
      this._spiralSubOptions(data, onFullChange);
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
    onFullChange: () => void,
    onRename: (name: string) => void,
    onStlImport?: (cb: (b64: string) => void) => void,
    onStlClear?: () => void,
    parentArena?: ArenaData,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = wall.name;
    nameInp.addEventListener('input', () => { wall.name = nameInp.value; onRename(wall.name); });
    this.content.appendChild(nameInp);

    // ── Attachment ────────────────────────────────────────────────────────
    this.section('ATTACHMENT');
    if (wall.parentType === 'arena') {
      this.toggleRow('Full Perimeter', wall.fullPerimeter, v => {
        wall.fullPerimeter = v;
        if (v && !wall.hasGaps) wall.tilt = 0;
        onFullChange();
      });
      if (!wall.fullPerimeter) {
        this.numRow('Arc Start°', wall.arcStart, 0, 360, 1, v => { wall.arcStart = v; onGeomChange(); });
        this.numRow('Arc End°',   wall.arcEnd,   0, 360, 1, v => { wall.arcEnd = v;   onGeomChange(); });
      }
      this.toggleRow('Auto-join adjacent', wall.autoJoin, v => { wall.autoJoin = v; onFullChange(); });
      // Moat ring selection
      if (parentArena?.isMoat) {
        this.selectRow('Ring', [
          { value: 'outer', label: 'Outer rim' },
          { value: 'inner', label: 'Inner rim' },
        ], wall.moatRing, v => { wall.moatRing = v as 'outer' | 'inner'; onFullChange(); });
      }
    }

    // ── Profile ───────────────────────────────────────────────────────────
    this.section('PROFILE');
    this.numRow('Height (cm)',    wall.height,    MIN_WALL_HEIGHT, 100, 1,   v => { wall.height = v;    onGeomChange(); });
    this.numRow('Thickness (cm)', wall.thickness, 0.1,             30,  0.5, v => { wall.thickness = v; onGeomChange(); });
    this.selectRow('Thickness Side',
      [{ value: 'outward (back)', label: 'Outward (back)' }, { value: 'inward (front)', label: 'Inward (front)' }],
      wall.thicknessDirection === 'inward' ? 'inward (front)' : 'outward (back)',
      v => { wall.thicknessDirection = v === 'inward (front)' ? 'inward' : 'outward'; onGeomChange(); });

    const tiltDisabled = wall.parentType === 'arena' && wall.fullPerimeter && !wall.hasGaps;
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
    this._wallTopProfileRow(wall, onFullChange);
    if (wall.topProfile !== 'flat') {
      this.numRow('Amplitude (cm)', wall.topAmplitude, 0, 10, 0.5, v => { wall.topAmplitude = v; onGeomChange(); });
      this.numRow('Frequency', wall.topFrequency, 0.1, 5, 0.1, v => { wall.topFrequency = v; onGeomChange(); });
    }

    // ── Gaps ──────────────────────────────────────────────────────────────
    if (wall.parentType === 'arena') {
      this.section('GAPS');
      this.toggleRow('Has Gaps', wall.hasGaps, v => {
        wall.hasGaps = v;
        if (!v && wall.fullPerimeter) wall.tilt = 0;
        onFullChange();
      });
      if (wall.hasGaps) {
        this.numRow('Panel Width (cm)', wall.panelWidth, MIN_WALL_GAP, 500, 1, v => { wall.panelWidth = v; onGeomChange(); });
        this.numRow('Gap Width (cm)',   wall.gapWidth,   MIN_WALL_GAP, 500, 1, v => { wall.gapWidth = v;   onGeomChange(); });
      }
    }

    // ── Double wall ───────────────────────────────────────────────────────
    this.section('DOUBLE WALL (/\\)');
    this.toggleRow('Enable', wall.isDouble, v => { wall.isDouble = v; onFullChange(); });
    if (wall.isDouble) {
      this.numRow('Peak Height (cm)', wall.peakHeight, 1, wall.height, 1, v => { wall.peakHeight = v; onGeomChange(); });
      this.numRow('Peak Tilt°',       wall.peakTilt,   0, 60, 1,         v => { wall.peakTilt = v;   onGeomChange(); });
    }

    // ── Physics ───────────────────────────────────────────────────────────
    this.section('PHYSICS');
    this.toggleRow('Destructible', wall.isDestructible, v => { wall.isDestructible = v; onFullChange(); });
    if (wall.isDestructible) {
      this.numRow('Hit Points', wall.hitPoints, 1, 1000, 10, v => { wall.hitPoints = v; onGeomChange(); });
    }

    // ── Physics material ──────────────────────────────────────────────────
    this.section('PHYSICS MATERIAL');
    this._wallMaterialRow(wall, ['rubber','stone','abs','metal'], onFullChange);

    // ── Rotation (arena rim walls only) ───────────────────────────────────
    if (wall.parentType === 'arena') {
      this.section('ROTATION');
      this.toggleRow('Rotate on arena', wall.rotateOnArena, v => { wall.rotateOnArena = v; onFullChange(); });
      if (wall.rotateOnArena) {
        this.selectRow('Mode', [
          { value: 'continuous', label: 'Continuous' },
          { value: 'step',       label: 'Step' },
          { value: 'oscillate',  label: 'Oscillate' },
        ], wall.arenaRotateMode, v => {
          wall.arenaRotateMode = v as 'continuous' | 'step' | 'oscillate';
          onFullChange();
        });
        if (wall.arenaRotateMode === 'continuous') {
          this.numRow('Speed (°/s)', wall.arenaRotateSpeed, 1, 720, 5, v => { wall.arenaRotateSpeed = v; onGeomChange(); });
        } else if (wall.arenaRotateMode === 'step') {
          this.numRow('Step (°)',      wall.arenaRotateStepDeg,      1,   180, 5,   v => { wall.arenaRotateStepDeg = v;      onGeomChange(); });
          this.numRow('Interval (s)', wall.arenaRotateStepInterval, 0.1, 60,  0.1, v => { wall.arenaRotateStepInterval = v; onGeomChange(); });
        } else {
          this.numRow('Amplitude (°)',  wall.arenaRotateOscAmp,  1,   180, 5,   v => { wall.arenaRotateOscAmp = v;  onGeomChange(); });
          this.numRow('Frequency (Hz)', wall.arenaRotateOscFreq, 0.1, 5,   0.1, v => { wall.arenaRotateOscFreq = v; onGeomChange(); });
        }
      }
    }

    // ── Appearance ────────────────────────────────────────────────────────
    this.section('APPEARANCE');
    this.colorRow('Color', wall.color, v => { wall.color = v; onGeomChange(); });
    this.surfaceRow(wall, onFullChange);
    this.numRow('Tile Scale', wall.tileScale, 0.1, 20, 0.1, v => { wall.tileScale = v; onGeomChange(); });
    this.colorRow('Glow Color', wall.emissiveColor, v => { wall.emissiveColor = v; onGeomChange(); });
    this.numRow('Glow Intensity', wall.emissiveIntensity, 0, 3, 0.1, v => { wall.emissiveIntensity = v; onGeomChange(); });
    this.numRow('Opacity', wall.opacity, 0, 1, 0.05, v => { wall.opacity = v; onGeomChange(); });
    this.themeRow(theme => {
      wall.color = theme.color; wall.surface = theme.surface;
      wall.emissiveColor = theme.emissiveColor; wall.emissiveIntensity = theme.emissiveIntensity;
      wall.material = theme.baseMaterial; wall.tileScale = theme.tileScale;
      onFullChange();
    });

    this.section('PRESENTATION STL');
    this.buttonRow('', wall.presentStlb64 ? '✓ Replace STL…' : 'Import STL…', () => {
      onStlImport?.((b64) => { wall.presentStlb64 = b64; onGeomChange(); });
    });
    if (wall.presentStlb64) {
      this.colorRow('Present Color', wall.presentColor, v => { wall.presentColor = v; onGeomChange(); });
      this.buttonRow('', 'Clear STL', () => { wall.presentStlb64 = null; onStlClear?.(); onGeomChange(); });
    }
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
    onStlImport?: (cb: (b64: string) => void) => void,
    onStlClear?: () => void,
    getSpeedLines?: () => Array<{id: string; name: string}>,
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
    this.section('DECK APPEARANCE');
    this.colorRow('Color', sec.color, v => { sec.color = v; onGeomChange(); });
    this.surfaceRow(sec, () => onGeomChange());
    this.numRow('Tile Scale', sec.tileScale, 0.1, 20, 0.1, v => { sec.tileScale = v; onGeomChange(); });
    this.colorRow('Glow Color', sec.emissiveColor, v => { sec.emissiveColor = v; onGeomChange(); });
    this.numRow('Glow Intensity', sec.emissiveIntensity, 0, 3, 0.1, v => { sec.emissiveIntensity = v; onGeomChange(); });
    this.numRow('Opacity', sec.opacity, 0, 1, 0.05, v => { sec.opacity = v; onGeomChange(); });
    this.themeRow(theme => {
      sec.color = theme.color; sec.surface = theme.surface;
      sec.emissiveColor = theme.emissiveColor; sec.emissiveIntensity = theme.emissiveIntensity;
      sec.material = theme.baseMaterial; sec.tileScale = theme.tileScale;
      onGeomChange();
    });

    this.section('PRESENTATION STL');
    this.buttonRow('', bridge.presentStlb64 ? '✓ Replace STL…' : 'Import STL…', () => {
      onStlImport?.((b64) => { bridge.presentStlb64 = b64; onGeomChange(); });
    });
    if (bridge.presentStlb64) {
      this.colorRow('Present Color', bridge.presentColor, v => { bridge.presentColor = v; onGeomChange(); });
      this.buttonRow('', 'Clear STL', () => { bridge.presentStlb64 = null; onStlClear?.(); onGeomChange(); });
    }

    // ── Speed Line Link ───────────────────────────────────────────────────
    if (getSpeedLines) {
      this.section('SPEED LINE LINK');
      const sls = getSpeedLines();
      const slNames = ['None', ...sls.map(s => s.name)];
      const cur = sls.find(s => s.id === bridge.linkedSpeedLineId)?.name ?? 'None';
      this.selectRow('Linked Speed Line', slNames.map(n => ({ value: n, label: n })), cur, v => {
        bridge.linkedSpeedLineId = v === 'None' ? null : (sls.find(s => s.name === v)?.id ?? null);
        onGeomChange();
      });
    }

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
    onFullChange?: () => void,
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
      case 'loop': {
        this.numRow('Loop Radius (cm)', seg.loopRadius, 5, 100, 1, v => { seg.loopRadius = v; onGeomChange(); });
        const orientRow = document.createElement('div'); orientRow.className = 'prop-profile-row';
        for (const [val, label] of [['vertical', '↺ Vertical'], ['horizontal', '↻ Horizontal']] as ['vertical'|'horizontal', string][]) {
          const btn = document.createElement('button');
          btn.className = 'prop-profile-btn' + (seg.loopOrientation === val ? ' active' : '');
          btn.textContent = label;
          btn.addEventListener('click', () => { seg.loopOrientation = val; onGeomChange(); });
          orientRow.appendChild(btn);
        }
        this.content.appendChild(orientRow);
        break;
      }
      case 'return_loop':
        this.numRow('Loop Radius (cm)', seg.loopRadius, 5, 100, 1, v => { seg.loopRadius = v; onGeomChange(); });
        break;
      case 'exit_loop':
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

    // ── Roll / tilt (all types) ───────────────────────────────────────────
    this.section('TILT / ROLL');
    this.numRow('Tilt Angle°', seg.tiltAngle, -180, 180, 5, v => { seg.tiltAngle = v; onGeomChange(); });

    // ── Appearance (optional override) ────────────────────────────────────
    this.section('APPEARANCE');
    const inheritHint = document.createElement('div'); inheritHint.className = 'prop-hint';
    inheritHint.textContent = 'Cross-section (width/depth/physics) is always set on the parent bridge.';
    this.content.appendChild(inheritHint);

    this.toggleRow('Custom Color', seg.color !== null, v => {
      seg.color = v ? 0x00aaff : null;
      onGeomChange();
    });
    if (seg.color !== null) {
      this.colorRow('Color', seg.color, v => { seg.color = v; onGeomChange(); });
    }

    // ── Segment Animation ─────────────────────────────────────────────────
    const refresh = onFullChange ?? onGeomChange;
    this.section('SEGMENT ANIMATION');
    this.toggleRow('Enable', seg.animEnabled, v => { seg.animEnabled = v; if (!v) seg._animTimer = 0; refresh(); });
    if (seg.animEnabled) {
      this.numRow('Offset X (cm)', seg.animOffsetX, -200, 200, 0.5, v => { seg.animOffsetX = v; });
      this.numRow('Offset Y (cm)', seg.animOffsetY, -50, 50, 0.5, v => { seg.animOffsetY = v; });
      this.numRow('Offset Z (cm)', seg.animOffsetZ, -200, 200, 0.5, v => { seg.animOffsetZ = v; });
      this.numRow('Rotate X°', seg.animRotX, -180, 180, 1, v => { seg.animRotX = v; });
      this.numRow('Rotate Y°', seg.animRotY, -180, 180, 1, v => { seg.animRotY = v; });
      this.numRow('Rotate Z°', seg.animRotZ, -180, 180, 1, v => { seg.animRotZ = v; });
      this.numRow('Start delay (ms)', seg.animStartMs, 0, 10000, 100, v => { seg.animStartMs = v; });
      this.numRow('Interval (ms)', seg.animIntervalMs, 100, 10000, 100, v => { seg.animIntervalMs = v; });
      this.numRow('Hold (ms)', seg.animHoldMs, 50, 10000, 50, v => { seg.animHoldMs = v; });
    }
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
      ['straight',    '━',  'Straight'],
      ['ramp',        '↗',  'Ramp'],
      ['curve',       '↩',  'Curve'],
      ['hairpin',     '↺',  'Hairpin'],
      ['loop',        '⭕', 'Loop'],
      ['return_loop', '↩⭕', 'Return'],
      ['exit_loop',   '↑⭕', 'Exit'],
      ['corkscrew',   '🌀', 'Corkscrew'],
      ['chicane',     '⟨⟩', 'Chicane'],
      ['bezier',      '〜', 'Bezier'],
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
    onPresetChange: () => void,
    onStlImport?: (cb: (b64: string) => void) => void,
    onStlClear?: () => void,
    getBridges?: () => BridgeData[],
    getTraps?:   () => TrapData[],
  ): void {
    this.content.innerHTML = '';

    const refresh = () => this.showSpeedLine(sl, arena, onGeomChange, onSegmentChange, onRename, onColorChange, onAddSegment, onRemoveSegment, onPresetChange, onStlImport, onStlClear, getBridges, getTraps);

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = sl.name;
    nameInp.addEventListener('input', () => { sl.name = nameInp.value; onRename(sl.name); });
    this.content.appendChild(nameInp);

    const arenaMaxR = Math.min(arena.radiusX, arena.radiusZ);
    const isCustom = sl.presetType === 'custom';
    const isPointZone = sl.presetType === 'point_zone';
    const p = sl.presetParams;

    /* ── PRESET ─────────────────────────────────────────────────────────── */
    this.section('PRESET');
    this.selectRow('Shape', [
      { value: 'custom',       label: 'Custom (manual segments)' },
      { value: 'circle',       label: '● Circle' },
      { value: 'ellipse',      label: '◯ Ellipse' },
      { value: 'polygon',      label: '⬡ Polygon' },
      { value: 'triangle',     label: '△ Triangle' },
      { value: 'star',         label: '★ Star' },
      { value: 'flower',       label: '✿ Flower / Rose Curve' },
      { value: 'spiral_in',    label: '@ Spiral In' },
      { value: 'spiral_out',   label: '@ Spiral Out' },
      { value: 'helix',        label: '⬡ Helix' },
      { value: 'zigzag',       label: '/\\ Zigzag' },
      { value: 'wave',         label: '~ Wave' },
      { value: 'cosine_wave',  label: '~ Cosine Wave' },
      { value: 'damped_wave',  label: '∿ Damped Wave' },
      { value: 'growing_wave', label: '↗ Growing Wave' },
      { value: 'snake',        label: 's Snake' },
      { value: 'figure_8',     label: '8 Figure-8' },
      { value: 'lemniscate',   label: '∞ Lemniscate' },
      { value: 'trefoil',      label: '☘ Trefoil' },
      { value: 'cardioid',     label: '♥ Cardioid' },
      { value: 'astroid',      label: '✦ Astroid' },
      { value: 'epicycloid',   label: '✿ Epicycloid' },
      { value: 'hypocycloid',  label: '⬡ Hypocycloid' },
      { value: 'point_zone',   label: '● Point Zone (trigger disc)' },
      { value: 'jump',         label: '⤻ Jump Arc (ballistic launch)' },
    ], sl.presetType, v => {
      sl.presetType = v as SpeedLinePresetType;
      onPresetChange();
      refresh();
    });

    const isJump = sl.presetType === 'jump';

    if (!isCustom) {
      if (isJump) {
        /* ── Jump destination endpoint ────────────────────────────────────── */
        this.section('JUMP DESTINATION');
        this._slHint('Bey leaves this speed line and is launched to the destination. In-flight = not on this line.');
        this.selectRow('Dst Mode', [
          { value: 'parent_surface', label: 'Parent Surface (local XZ)' },
          { value: 'world_point',    label: 'World Coordinates' },
        ], p.jumpDstMode ?? 'parent_surface', v => { p.jumpDstMode = v as JumpEndpointMode; onPresetChange(); refresh(); });
        if ((p.jumpDstMode ?? 'parent_surface') === 'parent_surface') {
          this.selectRow('Dst Parent Type', [
            { value: 'arena',    label: 'Arena' },
            { value: 'obstacle', label: 'Obstacle' },
            { value: 'trap',     label: 'Trap' },
            { value: 'base',     label: 'Octagon Base' },
          ], p.jumpDstParentType ?? 'arena', v => { p.jumpDstParentType = v as JumpLinkParentType; onPresetChange(); });
          this.numRow('Dst Local X cm', p.jumpDstLocalX ?? 0, -arenaMaxR, arenaMaxR, 1, v => { p.jumpDstLocalX = v; onPresetChange(); });
          this.numRow('Dst Local Z cm', p.jumpDstLocalZ ?? 0, -arenaMaxR, arenaMaxR, 1, v => { p.jumpDstLocalZ = v; onPresetChange(); });
        } else {
          this.numRow('Dst World X cm', p.jumpDstWorldX ?? 0, -500, 500, 1, v => { p.jumpDstWorldX = v; onPresetChange(); });
          this.numRow('Dst World Y cm', p.jumpDstWorldY ?? 0, 0, 500, 1,   v => { p.jumpDstWorldY = v; onPresetChange(); });
          this.numRow('Dst World Z cm', p.jumpDstWorldZ ?? 0, -500, 500, 1, v => { p.jumpDstWorldZ = v; onPresetChange(); });
        }

        /* ── Arc shape ──────────────────────────────────────────────────── */
        this.section('ARC SHAPE');
        this.selectRow('Arc Profile', [
          { value: 'parabolic', label: 'Parabolic (natural arc)' },
          { value: 'bezier',    label: 'Bezier (smooth control)' },
          { value: 'instant',   label: 'Instant (straight line)' },
        ], p.jumpArcProfile ?? 'parabolic', v => { p.jumpArcProfile = v as JumpArcProfile; onPresetChange(); });
        this.numRow('Arc Height cm',  p.jumpArcHeight  ?? JL.DEFAULT_ARC_HEIGHT,  0, 200, 1,  v => { p.jumpArcHeight  = v; onPresetChange(); });
        this.numRow('Disc Radius cm', p.jumpDiscRadius ?? JL.DEFAULT_DISC_RADIUS, 1, 40,  0.5, v => { p.jumpDiscRadius = v; onPresetChange(); });

        /* ── Flight config ──────────────────────────────────────────────── */
        const fc = p.jumpFlight;
        if (fc) {
          this.section('LAUNCH PHYSICS');
          this._slHint('Travel time = arcDuration ms. Arc is aimed at destination position at that time offset.');
          this.numRow('Arc Duration ms', fc.arcDuration,    100, 5000, 50, v => { fc.arcDuration    = v; });
          this.numRow('Launch Angle °',  fc.launchAngleDeg, 0,   90,   1,  v => { fc.launchAngleDeg = v; });
          this.numRow('Launch Force cm/s', fc.launchForce,  10,  1000, 10, v => { fc.launchForce    = v; });
          this.numRow('Gravity Scale',   fc.gravityScale,   0,   5,    0.1, v => { fc.gravityScale   = v; });
          this.numRow('Air Drag',        fc.airDrag,        0,   1,    0.01, v => { fc.airDrag       = v; });
          this.section('LANDING');
          this.numRow('Landing Impact',  fc.landingImpact,  0, 1, 0.05, v => { fc.landingImpact  = v; });
          this.numRow('Landing Bounce',  fc.landingBounce,  0, 1, 0.05, v => { fc.landingBounce  = v; });
          this.section('IN-FLIGHT SPIN');
          this.numRow('Spin Rate Mult',  fc.spinRateMult,  0, 3, 0.05, v => { fc.spinRateMult  = v; });
          this.numRow('Spin Delta RPM',  fc.spinDeltaRPM, -2000, 2000, 50, v => { fc.spinDeltaRPM = v; });
        }

      } else if (isPointZone) {
        this.numRow('Center X cm', p.centerX, -arenaMaxR, arenaMaxR, 1, v => { p.centerX = v; onPresetChange(); });
        this.numRow('Center Z cm', p.centerZ, -arenaMaxR, arenaMaxR, 1, v => { p.centerZ = v; onPresetChange(); });
        this.numRow('Diameter cm', p.radiusX * 2, SL.POINT_ZONE_DIAMETER_MIN, SL.POINT_ZONE_DIAMETER_MAX, 0.1,
          v => { p.radiusX = v / 2; onPresetChange(); });
      } else {
        /* ── Shape common positioning ────────────────────────────────────── */
        this.numRow('Center X cm',      p.centerX,   -arenaMaxR, arenaMaxR, 1,   v => { p.centerX   = v; onPresetChange(); });
        this.numRow('Center Z cm',      p.centerZ,   -arenaMaxR, arenaMaxR, 1,   v => { p.centerZ   = v; onPresetChange(); });
        this.numRow('Shape Rotation °', p.rotationY, 0,          360,       1,   v => { p.rotationY = v; onPresetChange(); });

        const waveTypes = ['wave', 'cosine_wave', 'damped_wave', 'growing_wave', 'zigzag', 'snake'];
        const spiralTypes = ['spiral_in', 'spiral_out', 'helix'];
        if (waveTypes.includes(sl.presetType)) {
          this.numRow('Length cm',    p.radiusX, 1, arenaMaxR * 2, 1,   v => { p.radiusX = v; onPresetChange(); });
          this.numRow('Amplitude cm', p.radiusZ, 0.5, arenaMaxR,   0.5, v => { p.radiusZ = v; onPresetChange(); });
          if (sl.presetType === 'snake') {
            this.numRow('Periods', p.turns, 1, 10, 0.5, v => { p.turns = v; onPresetChange(); });
          }
        } else {
          this.numRow('Radius X cm', p.radiusX, 1, arenaMaxR, 1, v => { p.radiusX = v; onPresetChange(); });
          if (sl.presetType === 'ellipse') {
            this.numRow('Radius Z cm', p.radiusZ, 1, arenaMaxR, 1, v => { p.radiusZ = v; onPresetChange(); });
          }
          if (['polygon', 'triangle'].includes(sl.presetType)) {
            this.numRow('Sides', p.sides, SL.PRESET_SIDES_MIN, SL.PRESET_SIDES_MAX, 1,
              v => { p.sides = Math.round(v); onPresetChange(); });
          }
          if (['flower', 'rose_curve', 'star', 'epicycloid', 'hypocycloid'].includes(sl.presetType)) {
            this.numRow('Petals', p.petals, SL.PRESET_PETALS_MIN, SL.PRESET_PETALS_MAX, 1,
              v => { p.petals = Math.round(v); onPresetChange(); });
          }
          if (['flower', 'rose_curve', 'star'].includes(sl.presetType)) {
            this.numRow('Inner Radius', p.innerRadius, 0.1, 0.9, 0.05, v => { p.innerRadius = v; onPresetChange(); });
          }
          if (spiralTypes.includes(sl.presetType)) {
            this.numRow('Turns',         p.turns,        SL.PRESET_TURNS_MIN, SL.PRESET_TURNS_MAX, 0.5, v => { p.turns        = v; onPresetChange(); });
            this.numRow('Pitch/Turn cm', p.pitchPerTurn, -100, 100, 1,                                  v => { p.pitchPerTurn = v; onPresetChange(); });
            this._slHint('Positive = ascend, negative = descend. 0 = flat spiral.');
            if (sl.presetType !== 'helix') {
              this.numRow('Loop Gap cm', p.loopGap, 0, p.radiusX, 0.5, v => { p.loopGap = v; onPresetChange(); });
              this.selectRow('Radius Easing', [
                { value: 'linear',    label: 'Linear' },
                { value: 'ease_in',   label: 'Ease In (burst)' },
                { value: 'ease_out',  label: 'Ease Out (slow)' },
                { value: 'ease_inout', label: 'Ease In-Out' },
              ], p.radiusEasing, v => { p.radiusEasing = v as SpeedLinePresetParams['radiusEasing']; onPresetChange(); });
            }
          }
        }

        this.numRow('Total Steps',    p.steps,       SL.PRESET_STEPS_MIN, SL.PRESET_STEPS_MAX, 1,   v => { p.steps       = Math.round(v); onPresetChange(); });
        this.numRow('Height Delta cm', p.heightDelta, 0, 200, 1,                                     v => { p.heightDelta = v;            onPresetChange(); });

        /* ── Shape Modulation ───────────────────────────────────────────── */
        this.section('SHAPE MODULATION');
        this.selectRow('Mod Type', [
          { value: 'none',         label: 'None' },
          { value: 'radial_scale', label: 'Radial Scale (breathe in/out)' },
          { value: 'angle_drift',  label: 'Angle Drift (wobble/spiral)' },
          { value: 'xyz_shift',    label: 'XZ Shift (side-to-side)' },
        ], p.modulation.type, v => { p.modulation.type = v as SpeedLineModType; onPresetChange(); refresh(); });

        if (p.modulation.type !== 'none') {
          this.selectRow('Waveform', [
            { value: 'sine',             label: 'Sine' },
            { value: 'cosine',           label: 'Cosine (starts at peak)' },
            { value: 'triangle',         label: 'Triangle (ramp up-down)' },
            { value: 'sawtooth',         label: 'Sawtooth (ramp/reset)' },
            { value: 'inverse_sawtooth', label: 'Inv. Sawtooth' },
            { value: 'square',           label: 'Square' },
            { value: 'pulse',            label: 'Pulse (spike)' },
            { value: 'exp_rise',         label: 'Exp Rise (convex J)' },
            { value: 'exp_decay',        label: 'Exp Decay (concave)' },
            { value: 'damped_sine',      label: 'Damped Sine (dies out)' },
            { value: 'growing_sine',     label: 'Growing Sine (builds up)' },
          ], p.modulation.waveform, v => { p.modulation.waveform = v as SpeedLineModWaveform; onPresetChange(); refresh(); });

          const ampLabel = p.modulation.type === 'angle_drift' ? 'Amplitude °' : 'Amplitude cm';
          this.numRow(ampLabel,        p.modulation.amplitude,   0, 50, 0.5, v => { p.modulation.amplitude   = v;            onPresetChange(); });
          this.numRow('Period (steps)', p.modulation.periodSteps, 1, p.steps, 1, v => { p.modulation.periodSteps = Math.round(v); onPresetChange(); });
          this.numRow('Phase °',        p.modulation.modPhase,    0, 360, 5,    v => { p.modulation.modPhase    = v;            onPresetChange(); });
          if (p.modulation.waveform === 'pulse') {
            this.numRow('Pulse Width', p.modulation.pulseWidth, 0.1, 0.9, 0.05, v => { p.modulation.pulseWidth = v; onPresetChange(); });
          }
        }

        /* ── Arc Fraction + Close Loop ──────────────────────────────────── */
        this.section('ARC & LOOP');
        this.numRow('Arc Fraction', p.arcFraction, 0.01, 1.0, 0.05, v => { p.arcFraction = v; onPresetChange(); });
        this._slHint('1.0 = full shape  |  0.5 = symmetric half  |  0.25 = quarter arc');
        if (p.arcFraction >= 1.0) {
          this.toggleRow('Close Loop', p.closeLoop, v => { p.closeLoop = v; onPresetChange(); });
        }

        /* ── 3D Positioning ─────────────────────────────────────────────── */
        this.section('3D POSITION');
        this.numRow('Center Y cm', p.centerY, 0, 200, 1, v => { p.centerY = v; onPresetChange(); });
        const openShapes = ['wave', 'cosine_wave', 'damped_wave', 'growing_wave', 'zigzag', 'snake', 'lemniscate', 'figure_8', 'spiral_in', 'spiral_out'];
        if (openShapes.includes(sl.presetType) && !p.closeLoop) {
          this.numRow('Start X cm', p.startPosX, -arenaMaxR, arenaMaxR, 0.5, v => { p.startPosX = v; onPresetChange(); });
          this.numRow('Start Z cm', p.startPosZ, -arenaMaxR, arenaMaxR, 0.5, v => { p.startPosZ = v; onPresetChange(); });
          this.numRow('Start Y cm', p.startPosY, 0, 200, 0.5,                 v => { p.startPosY = v; onPresetChange(); });
          this.numRow('End X cm',   p.endPosX,   -arenaMaxR, arenaMaxR, 0.5, v => { p.endPosX   = v; onPresetChange(); });
          this.numRow('End Z cm',   p.endPosZ,   -arenaMaxR, arenaMaxR, 0.5, v => { p.endPosZ   = v; onPresetChange(); });
          this.numRow('End Y cm',   p.endPosY,   0, 200, 0.5,                 v => { p.endPosY   = v; onPresetChange(); });
        }

        /* ── Sections ───────────────────────────────────────────────────── */
        this.section('SECTIONS');
        this._slHint('Divide shape into arcs with independent buffs, conditions, and Y offsets. Empty = one uniform arc.');
        this._slSectionsUI(sl, onPresetChange, refresh);
      }

      /* ── Regenerate button ───────────────────────────────────────────── */
      const regenBtn = document.createElement('button');
      regenBtn.className = 'game-btn'; regenBtn.textContent = '↺ Regenerate Shape';
      regenBtn.style.cssText = 'width:100%;margin:8px 0;';
      regenBtn.addEventListener('click', () => { onPresetChange(); refresh(); });
      this.content.appendChild(regenBtn);
    }

    /* ── START (custom only) ────────────────────────────────────────────── */
    if (isCustom) {
      this.section('START');
      this.numRow('Start Dist',  sl.startR,     0, arenaMaxR, 0.5, v => { sl.startR    = v; onGeomChange(); });
      this.numRow('Start Angle', sl.startAngle, 0, 360, 1,         v => { sl.startAngle = v; onGeomChange(); });
      this.numRow('Start Dir °', sl.startDir,   -180, 180, 1,      v => { sl.startDir   = v; onGeomChange(); });

      /* ── SEGMENTS (custom only) ───────────────────────────────────────── */
      this.section('SEGMENTS');
      const tmplRow = document.createElement('div'); tmplRow.className = 'prop-row';
      const tmplLbl = document.createElement('span'); tmplLbl.className = 'prop-label'; tmplLbl.textContent = 'Add from template';
      const tmplSel = document.createElement('select'); tmplSel.className = 'prop-select';
      for (const [v, lbl] of [
        ['blank','Blank'], ['straight','Straight'], ['circle','Circle'],
        ['spiral','Spiral'], ['zigzag','Zigzag'], ['wave','Wave'],
        ['climb','Climb'], ['loop','Loop (aerial)'], ['corkscrew','Corkscrew'], ['ramp','Launch Ramp'],
      ]) { const o = document.createElement('option'); o.value = v; o.textContent = lbl; tmplSel.appendChild(o); }
      const tmplBtn = document.createElement('button');
      tmplBtn.className = 'game-btn'; tmplBtn.style.marginLeft = '4px'; tmplBtn.textContent = '+ Add';
      tmplBtn.addEventListener('click', () => {
        let segs: SpeedLineSegment[] = [];
        switch (tmplSel.value) {
          case 'blank':     segs = [{ id: '', length: SL.DEFAULT_SEG_LENGTH, rotX: 0, rotY: 0, rotZ: 0, speedMult: 0, objRotX: 0, objRotY: 0, objRotZ: 0, maxStayDuration: 0, statModifiers: null, sectionIndex: -1 }]; break;
          case 'straight':  segs = templateStraight(40, 5); break;
          case 'circle':    segs = templateCircle(20, 36); break;
          case 'spiral':    segs = templateSpiral(20, 1, 18); break;
          case 'zigzag':    segs = templateZigzag(8, 8, 8); break;
          case 'wave':      segs = templateWave(5, 8, 8); break;
          case 'climb':     segs = templateClimb(15, 6, 8); break;
          case 'loop':      segs = templateLoop(12, 12); sl.surfaceFollow = false; sl.overridePhysics = true; break;
          case 'corkscrew': segs = templateCorkscrew(10, 1, 12); sl.surfaceFollow = false; break;
          case 'ramp':      segs = templateLaunchRamp(45, 3, 6, 8); sl.surfaceFollow = false; break;
        }
        onAddSegment(segs);
      });
      tmplRow.appendChild(tmplLbl); tmplRow.appendChild(tmplSel); tmplRow.appendChild(tmplBtn);
      this.content.appendChild(tmplRow);

      for (let k = 0; k < sl.segments.length; k++) {
        const seg = sl.segments[k];
        const segHeader = document.createElement('div'); segHeader.className = 'prop-row'; segHeader.style.cursor = 'pointer';
        const segTitle = document.createElement('span'); segTitle.className = 'prop-label'; segTitle.textContent = `▶ Seg ${k + 1}`;
        const delBtn = document.createElement('button'); delBtn.className = 'game-btn'; delBtn.textContent = '✕';
        delBtn.style.cssText = 'margin-left:auto;font-size:0.75em;';
        delBtn.addEventListener('click', e => { e.stopPropagation(); onRemoveSegment(k); });
        segHeader.appendChild(segTitle); segHeader.appendChild(delBtn); this.content.appendChild(segHeader);
        const segBody = document.createElement('div'); segBody.style.cssText = 'display:none;padding-left:12px;';
        segHeader.addEventListener('click', () => {
          const open = segBody.style.display !== 'none';
          segBody.style.display = open ? 'none' : 'block';
          segTitle.textContent = (open ? '▶' : '▼') + ` Seg ${k + 1}`;
        });
        const addSegNum = (lbl: string, val: number, mn: number, mx: number, step: number, set: (v: number) => void) => {
          const r = document.createElement('div'); r.className = 'prop-row';
          const lb = document.createElement('span'); lb.className = 'prop-label'; lb.textContent = lbl;
          const inp = document.createElement('input'); inp.type = 'number'; inp.className = 'prop-input';
          inp.value = String(val); inp.min = String(mn); inp.max = String(mx); inp.step = String(step);
          inp.addEventListener('input', () => { set(parseFloat(inp.value) || 0); onSegmentChange(k); });
          r.appendChild(lb); r.appendChild(inp); segBody.appendChild(r);
        };
        addSegNum('Length cm',       seg.length,   0.5, 100, 0.5,              v => { seg.length   = v; });
        addSegNum('Rot X °',         seg.rotX,     -180, 180, 1,               v => { seg.rotX     = v; });
        addSegNum('Rot Y °',         seg.rotY,     -180, 180, 1,               v => { seg.rotY     = v; });
        addSegNum('Rot Z °',         seg.rotZ,     -180, 180, 1,               v => { seg.rotZ     = v; });
        addSegNum('Speed ×',         seg.speedMult, 0, SL.SPEED_MULT_MAX, 0.1, v => { seg.speedMult = v; });
        addSegNum('Obj Rot X°/cm',   seg.objRotX,  -45, 45, 0.5,              v => { seg.objRotX  = v; });
        addSegNum('Obj Rot Y°/cm',   seg.objRotY,  -45, 45, 0.5,              v => { seg.objRotY  = v; });
        addSegNum('Obj Rot Z°/cm',   seg.objRotZ,  -45, 45, 0.5,              v => { seg.objRotZ  = v; });
        this.content.appendChild(segBody);
      }

      const addBtn = document.createElement('button'); addBtn.className = 'game-btn'; addBtn.textContent = '+ Add segment';
      addBtn.style.cssText = 'width:100%;margin:4px 0;';
      addBtn.addEventListener('click', () => onAddSegment([{ id: '', length: SL.DEFAULT_SEG_LENGTH, rotX: 0, rotY: 0, rotZ: 0, speedMult: 0, objRotX: 0, objRotY: 0, objRotZ: 0, maxStayDuration: 0, statModifiers: null, sectionIndex: -1 }]));
      this.content.appendChild(addBtn);
      this.toggleRow('Surface Follow', sl.surfaceFollow, v => { sl.surfaceFollow = v; onGeomChange(); });
    }

    /* ── RIBBON ─────────────────────────────────────────────────────────── */
    this.section('RIBBON');
    this.numRow('Width cm', sl.width, SL.WIDTH_MIN, SL.WIDTH_MAX_OVERRIDE, 0.1, v => { sl.width = v; onColorChange(); });
    this._slHint('Lane width — wider lanes allow multiple beyblades simultaneously.');
    this.colorRow('Color', sl.color, v => { sl.color = v; onColorChange(); });
    this.numRow('Opacity', sl.opacity, 0, 1, 0.05, v => { sl.opacity = v; onColorChange(); });
    this.toggleRow('Glow', sl.glowColor !== null, v => { sl.glowColor = v ? sl.color : null; onColorChange(); });
    this.numRow('Surface Offset cm', sl.surfaceOffset, 0, 10, 0.05, v => { sl.surfaceOffset = v; onGeomChange(); });

    this.section('RIBBON TEXTURE');
    const slTexProxy = {
      surface: (sl.customTileData ? 'custom_png' : 'plain') as SurfaceType,
      customTileData: sl.customTileData,
      tileScale: sl.tileScale,
      color: sl.color,
    };
    this.surfaceRow(slTexProxy, () => {
      sl.customTileData = slTexProxy.surface === 'custom_png' ? slTexProxy.customTileData : null;
      onGeomChange();
    });
    this.numRow('Tile Scale', sl.tileScale, 0.1, 20, 0.1, v => { sl.tileScale = v; onGeomChange(); });

    /* ── SPEED RAMP ─────────────────────────────────────────────────────── */
    this.section('SPEED RAMP');
    this.selectRow('Profile', [
      { value: 'constant',     label: 'Constant' },
      { value: 'accelerate',   label: 'Accelerate (ramp up)' },
      { value: 'decelerate',   label: 'Decelerate (ramp down)' },
      { value: 'bell',         label: 'Bell (up then down)' },
      { value: 'inverse_bell', label: 'Inverse Bell (down then up)' },
    ], sl.speedRamp.profile, v => { sl.speedRamp.profile = v as SpeedLineRampProfile; if (!isCustom) onPresetChange(); refresh(); });
    this.numRow('Min Speed ×', sl.speedRamp.speedMin, 0.5, 5.0, 0.1, v => { sl.speedRamp.speedMin = v; if (!isCustom) onPresetChange(); });
    this.numRow('Max Speed ×', sl.speedRamp.speedMax, 0.5, 5.0, 0.1, v => { sl.speedRamp.speedMax = v; if (!isCustom) onPresetChange(); });
    if (sl.speedRamp.profile !== 'constant') {
      this.numRow('Entry Steps', sl.speedRamp.entrySteps, 0, SL.RAMP_STEPS_MAX, 1,
        v => { sl.speedRamp.entrySteps = Math.round(v); if (!isCustom) onPresetChange(); });
      if (sl.speedRamp.profile !== 'accelerate') {
        this.numRow('Exit Steps', sl.speedRamp.exitSteps, 0, SL.RAMP_STEPS_MAX, 1,
          v => { sl.speedRamp.exitSteps = Math.round(v); if (!isCustom) onPresetChange(); });
      }
    }

    /* ── TARGET & ACTIVATION ────────────────────────────────────────────── */
    this.section('TARGET & ACTIVATION');
    this.selectRow('Target', [
      { value: 'beyblade',          label: 'Beyblade' },
      { value: 'water',             label: 'Water' },
      { value: 'obstacle',          label: 'Obstacle' },
      { value: 'item',              label: 'Item' },
      { value: 'any',               label: 'Any' },
      { value: 'custom',            label: 'Custom tag' },
      { value: 'nearest_opponent',  label: 'Nearest Opponent' },
      { value: 'nearest_obstacle',  label: 'Nearest Obstacle' },
      { value: 'on_path_obstacle',  label: 'On-Path Obstacle' },
      { value: 'linked_bridge',     label: 'Linked Bridge' },
      { value: 'linked_trap',       label: 'Linked Trap' },
    ], sl.targetType, v => { sl.targetType = v as SpeedLineData['targetType']; onGeomChange(); refresh(); });
    if (sl.targetType === 'custom') {
      this.textRow('Target Tag', sl.targetTag, v => { sl.targetTag = v; });
    }
    if (sl.targetType === 'linked_bridge' && getBridges) {
      const bridges = getBridges();
      const names = ['None', ...bridges.map(b => b.name)];
      const cur = bridges.find(b => b.id === sl.targetBridgeId)?.name ?? 'None';
      this.selectRow('Bridge', names.map(n => ({ value: n, label: n })), cur, v => {
        sl.targetBridgeId = v === 'None' ? null : (bridges.find(b => b.name === v)?.id ?? null);
        onGeomChange();
      });
    }
    if (sl.targetType === 'linked_trap' && getTraps) {
      const traps = getTraps();
      const names = ['None', ...traps.map(t => t.name)];
      const cur = traps.find(t => t.id === sl.targetTrapId)?.name ?? 'None';
      this.selectRow('Trap', names.map(n => ({ value: n, label: n })), cur, v => {
        sl.targetTrapId = v === 'None' ? null : (traps.find(t => t.name === v)?.id ?? null);
        onGeomChange();
      });
    }
    if (['nearest_opponent', 'nearest_obstacle', 'on_path_obstacle'].includes(sl.targetType)) {
      this.selectRow('Target Selection', [
        { value: 'at_entrance', label: 'At Entrance (lock-on)' },
        { value: 'dynamic',     label: 'Dynamic (track every frame)' },
      ], sl.targetSelectionMode, v => { sl.targetSelectionMode = v as SpeedLineData['targetSelectionMode']; });
    }

    /* ── LINK ─────────────────────────────────────────────────────────────── */
    if (sl.linkedBridgeId || sl.linkedTrapId) {
      this.section('LINK');
      const linkLabel = sl.linkedBridgeId
        ? `Bridge: ${getBridges?.()?.find(b => b.id === sl.linkedBridgeId)?.name ?? sl.linkedBridgeId}`
        : `Trap: ${getTraps?.()?.find(t => t.id === sl.linkedTrapId)?.name ?? sl.linkedTrapId}`;
      this.readRow('Linked to:', linkLabel);
      this.toggleRow('Enabled', sl.enabled, v => { sl.enabled = v; onGeomChange(); });
    }
    this.selectRow('Activation', [
      { value: 'always',    label: 'Always' },
      { value: 'event',     label: 'Event' },
      { value: 'periodic',  label: 'Periodic' },
      { value: 'proximity', label: 'Proximity' },
    ], sl.activationMode, v => { sl.activationMode = v as SpeedLineData['activationMode']; onGeomChange(); refresh(); });
    if (sl.activationMode === 'event') {
      this.textRow('Trigger Event', sl.triggerEvent, v => { sl.triggerEvent = v; });
      this.textRow('End Event',     sl.endEvent,     v => { sl.endEvent     = v; });
      this.numRow('Active ms',   sl.activeDuration, 0, 60000, 100, v => { sl.activeDuration = v; });
      this.numRow('Fade In ms',  sl.fadeIn,  0, 5000, 50, v => { sl.fadeIn  = v; });
      this.numRow('Fade Out ms', sl.fadeOut, 0, 5000, 50, v => { sl.fadeOut = v; });
    } else if (sl.activationMode === 'periodic') {
      this.numRow('Period ms',  sl.period,      100, 10000, 100, v => { sl.period      = v; });
      this.numRow('Duty 0–1',   sl.activeDuty,  0,   1,    0.05, v => { sl.activeDuty  = v; });
      this.numRow('Fade In ms', sl.fadeIn,       0,   5000, 50,   v => { sl.fadeIn      = v; });
      this.numRow('Fade Out ms', sl.fadeOut,     0,   5000, 50,   v => { sl.fadeOut     = v; });
    } else if (sl.activationMode === 'proximity') {
      this.numRow('Radius cm', sl.activationRadius, 1, 100, 1, v => { sl.activationRadius = v; onGeomChange(); });
    }

    /* ── OSCILLATION ────────────────────────────────────────────────────── */
    this.section('OSCILLATION');
    this.toggleRow('Oscillate', sl.oscillate, v => { sl.oscillate = v; refresh(); });
    if (sl.oscillate) {
      this.selectRow('Axis', [
        { value: 'path',    label: 'Path' },
        { value: 'lateral', label: 'Lateral' },
        { value: 'normal',  label: 'Normal' },
        { value: 'all',     label: 'All' },
      ], sl.oscAxis, v => { sl.oscAxis = v as SpeedLineData['oscAxis']; });
      this.numRow('Amplitude cm', sl.oscAmplitude, 0, 20, 0.5, v => { sl.oscAmplitude = v; });
      this.numRow('Frequency Hz', sl.oscFrequency, 0.1, 10, 0.1, v => { sl.oscFrequency = v; });
      this.numRow('Phase °',      sl.oscPhase,     0, 360, 5,   v => { sl.oscPhase     = v; });
    }

    /* ── GAMEPLAY ───────────────────────────────────────────────────────── */
    this.section('GAMEPLAY');
    this.numRow('Speed ×', sl.speedMultiplier, SL.SPEED_MULT_MIN, SL.SPEED_MULT_MAX, 0.1, v => { sl.speedMultiplier = v; });
    this.selectRow('Entry', [
      { value: 'always',      label: 'Always' },
      { value: 'moving_only', label: 'Moving only' },
      { value: 'fast_only',   label: 'Fast only' },
      { value: 'slow_only',   label: 'Slow only' },
    ], sl.entryCondition, v => { sl.entryCondition = v as SpeedLineData['entryCondition']; });
    this.selectRow('Direction', [
      { value: 'forward',       label: 'Forward' },
      { value: 'reverse',       label: 'Reverse' },
      { value: 'bidirectional', label: 'Both' },
    ], sl.direction, v => { sl.direction = v as SpeedLineData['direction']; });
    this.selectRow('Exit', [
      { value: 'normal',       label: 'Normal' },
      { value: 'launch',       label: 'Launch' },
      { value: 'loop',         label: 'Loop (repeat)' },
      { value: 'special_move', label: 'Special Move' },
      { value: 'jump_link',    label: '⤻ Jump Link (activate on exit)' },
    ], sl.exitBehavior, v => { sl.exitBehavior = v as SpeedLineData['exitBehavior']; onGeomChange(); refresh(); });
    if (sl.exitBehavior === 'launch') {
      this.numRow('Launch ×', sl.launchForce, SL.LAUNCH_FORCE_MIN, SL.LAUNCH_FORCE_MAX, 0.1, v => { sl.launchForce = v; });
    }
    if (sl.exitBehavior === 'special_move') {
      this.textRow('Move Name', sl.specialMoveName, v => { sl.specialMoveName = v; });
    }
    if (sl.exitBehavior === 'jump_link') {
      this.textRow('Jump Link ID', sl.jumpLinkId ?? '', v => { sl.jumpLinkId = v || null; onGeomChange(); });
      this.readRow('Note', 'Speed line triggers jump at exit. In-flight bey is not on this speed line.');
    }
    this.toggleRow('Mid-Air Entry',   sl.allowMidAirEntry, v => { sl.allowMidAirEntry = v; });
    this.toggleRow('Override Physics', sl.overridePhysics, v => { sl.overridePhysics  = v; });
    this.numRow('Swap Priority', sl.swapPriority, SL.SWAP_PRIORITY_MIN, SL.SWAP_PRIORITY_MAX, 1, v => { sl.swapPriority = Math.round(v); });
    this.toggleRow('Surface Orient Object', sl.surfaceOrientObject, v => { sl.surfaceOrientObject = v; refresh(); });
    this._slHint('Align spin axis to surface normal (wall = horizontal spin; bowl = tilted).');
    if (sl.surfaceOrientObject) {
      this.selectRow('In-Air Normal', [
        { value: 'upright',        label: 'Upright (world Y)' },
        { value: 'lean_center',    label: 'Lean to Center' },
        { value: 'lean_curvature', label: 'Lean to Path Curvature' },
      ], sl.airNormalMode, v => { sl.airNormalMode = v as SpeedLineData['airNormalMode']; refresh(); });
      if (sl.airNormalMode !== 'upright') {
        this.numRow('Air Tilt °', sl.airNormalTiltDeg, 0, 45, 1, v => { sl.airNormalTiltDeg = v; });
      }
    }

    /* ── STAT MODIFIERS ─────────────────────────────────────────────────── */
    this.section('STAT MODIFIERS');
    this._slHint('Global multipliers applied while object is on this path. 1.0 = no change. Per-section overrides in Sections.');
    this._slStatModRows(sl.statModifiers, () => { if (!isCustom) onPresetChange(); });

    /* ── BASE CONDITION ─────────────────────────────────────────────────── */
    this.section('BASE CONDITION');
    this.selectRow('Condition', [
      { value: 'none',       label: 'None' },
      { value: 'always',     label: 'Always Active' },
      { value: 'game_phase', label: 'Game Phase' },
    ], sl.baseCondition, v => { sl.baseCondition = v as SpeedLineData['baseCondition']; refresh(); });
    if (sl.baseCondition === 'game_phase') {
      this.selectRow('Phase', [
        { value: 'any',          label: 'Any' },
        { value: 'pre_battle',   label: 'Pre-Battle' },
        { value: 'battle',       label: 'Battle' },
        { value: 'sudden_death', label: 'Sudden Death' },
      ], sl.conditionPhase, v => { sl.conditionPhase = v as SpeedLineData['conditionPhase']; });
    }
    this.numRow('Check Interval ms', sl.conditionCheckIntervalMs, 16, 5000, 16,
      v => { sl.conditionCheckIntervalMs = Math.round(v); });
    this._slHint('How often conditions are re-checked while object is on path. Fail → eject. 16ms = every frame.');
    this.selectRow('Eject Behavior', [
      { value: 'toward_center', label: 'Toward Center' },
      { value: 'forward',       label: 'Forward' },
      { value: 'backward',      label: 'Backward' },
      { value: 'launch',        label: 'Launch' },
    ], sl.ejectBehavior, v => { sl.ejectBehavior = v as SpeedLineData['ejectBehavior']; });

    /* ── INFO ───────────────────────────────────────────────────────────── */
    this.section('INFO');
    this.readRow('Total Length', `${sl.totalLength.toFixed(1)} cm`);
    this.readRow('Segments',     String(sl.segments.length));
    this.readRow('Overlaps',     String(sl.overlapMarkers.length));

    this.section('PRESENTATION STL');
    this.buttonRow('', sl.presentStlb64 ? '✓ Replace STL…' : 'Import STL…', () => {
      onStlImport?.((b64) => { sl.presentStlb64 = b64; onGeomChange(); });
    });
    if (sl.presentStlb64) {
      this.colorRow('Present Color', sl.presentColor, v => { sl.presentColor = v; onGeomChange(); });
      this.buttonRow('', 'Clear STL', () => { sl.presentStlb64 = null; onStlClear?.(); onGeomChange(); });
    }
  }

  /* ── Speed line helpers ──────────────────────────────────────────────────── */

  private _slHint(text: string): void {
    const el = document.createElement('div');
    el.className = 'prop-hint';
    el.textContent = text;
    this.content.appendChild(el);
  }

  private _slStatModRows(mods: SpeedLineStatModifiers, onChange: () => void): void {
    this.numRow('Spin Rate ×',     mods.spinRateMult,    SL.STAT_MULT_MIN, SL.STAT_MULT_MAX, 0.05, v => { mods.spinRateMult    = v; onChange(); });
    this.numRow('Stamina Drain ×', mods.staminaMult,     SL.STAT_MULT_MIN, SL.STAT_MULT_MAX, 0.05, v => { mods.staminaMult     = v; onChange(); });
    this.numRow('Attack ×',        mods.attackMult,      SL.STAT_MULT_MIN, 3.0,              0.05, v => { mods.attackMult      = v; onChange(); });
    this.numRow('Defense ×',       mods.defenseMult,     SL.STAT_MULT_MIN, 3.0,              0.05, v => { mods.defenseMult     = v; onChange(); });
    this.numRow('Weight ×',        mods.weightMult,      0.1,              3.0,              0.05, v => { mods.weightMult      = v; onChange(); });
    this.numRow('Burst Resist ×',  mods.burstResistMult, SL.STAT_MULT_MIN, SL.STAT_MULT_MAX, 0.05, v => { mods.burstResistMult = v; onChange(); });
    this.numRow('Tilt °',          mods.tiltAngleDeg,   -45, 45, 1, v => { mods.tiltAngleDeg = v; onChange(); });
    if (mods.tiltAngleDeg !== 0) {
      this.toggleRow('Tilt Spin-Sensitive', mods.tiltSpinSensitive, v => { mods.tiltSpinSensitive = v; onChange(); });
      this.selectRow('Tilt Apply Phase',
        [{ value: 'entry', label: 'Entry' }, { value: 'exit', label: 'Exit' }, { value: 'continuous', label: 'Continuous' }],
        mods.tiltApplyPhase, v => { mods.tiltApplyPhase = v as typeof mods.tiltApplyPhase; onChange(); });
    }
  }

  private _slSectionsUI(sl: SpeedLineData, onPresetChange: () => void, refresh: () => void): void {
    const sections = sl.presetParams.sections;

    /* ── Section sum warning ─────────────────────────────────────────────── */
    const sumEl = document.createElement('div'); sumEl.className = 'prop-hint';
    const updateSum = () => {
      const total = sections.reduce((s, sec) => s + sec.angleDeg, 0);
      sumEl.textContent = `Total: ${total.toFixed(0)}° / 360°`;
      sumEl.style.color = Math.abs(total - 360) < 1 ? '' : 'var(--accent-orange, #ff6b35)';
    };
    updateSum();
    this.content.appendChild(sumEl);

    /* ── Sync All button ─────────────────────────────────────────────────── */
    const syncBtn = document.createElement('button'); syncBtn.className = 'game-btn';
    syncBtn.textContent = '↺ Sync All to Global'; syncBtn.style.cssText = 'width:100%;margin:4px 0;font-size:0.8em;';
    syncBtn.title = 'Reset all section property overrides to inherit from global SpeedLine settings';
    syncBtn.addEventListener('click', () => {
      for (const sec of sections) {
        sec.statModifiers  = null;
        sec.surfaceFollow  = null;
        sec.entryCondition = null;
        sec.exitBehavior   = null;
        sec.color          = null;
        sec.opacity        = null;
        sec.speedMult      = null;
        sec.activationMode = null;
      }
      onPresetChange(); refresh();
    });
    this.content.appendChild(syncBtn);

    /* ── Per-section rows ────────────────────────────────────────────────── */
    for (let idx = 0; idx < sections.length; idx++) {
      const sec = sections[idx];
      const secWrap = document.createElement('div');
      secWrap.style.cssText = 'border:1px solid rgba(0,229,255,0.2);margin:4px 0;padding:4px;';

      /* header: "Sec N  [▼]  [✕]" */
      const secHead = document.createElement('div'); secHead.className = 'prop-row'; secHead.style.cursor = 'pointer';
      const secTitle = document.createElement('span'); secTitle.className = 'prop-label'; secTitle.textContent = `▶ Section ${idx + 1}`;
      const delSecBtn = document.createElement('button'); delSecBtn.className = 'game-btn'; delSecBtn.textContent = '✕';
      delSecBtn.style.cssText = 'margin-left:auto;font-size:0.75em;';
      delSecBtn.addEventListener('click', e => {
        e.stopPropagation();
        sections.splice(idx, 1);
        onPresetChange(); refresh();
      });
      secHead.appendChild(secTitle); secHead.appendChild(delSecBtn); secWrap.appendChild(secHead);

      const secBody = document.createElement('div'); secBody.style.cssText = 'display:none;padding-left:8px;';
      secHead.addEventListener('click', () => {
        const open = secBody.style.display !== 'none';
        secBody.style.display = open ? 'none' : 'block';
        secTitle.textContent = (open ? '▶' : '▼') + ` Section ${idx + 1}`;
      });

      /* ── Angle & core properties ── */
      const addSecNum = (lbl: string, val: number, mn: number, mx: number, step: number, set: (v: number) => void) => {
        const r = document.createElement('div'); r.className = 'prop-row';
        const lb = document.createElement('span'); lb.className = 'prop-label'; lb.textContent = lbl;
        const inp = document.createElement('input'); inp.type = 'number'; inp.className = 'prop-input';
        inp.value = String(parseFloat(val.toFixed(3))); inp.min = String(mn); inp.max = String(mx); inp.step = String(step);
        inp.addEventListener('input', () => { set(parseFloat(inp.value) || 0); updateSum(); onPresetChange(); });
        r.appendChild(lb); r.appendChild(inp); secBody.appendChild(r);
      };
      addSecNum('Angle °',      sec.angleDeg,        5, 355, 5,   v => { sec.angleDeg        = v; });
      addSecNum('Y Offset cm',  sec.yOffset,         -100, 100, 1, v => { sec.yOffset        = v; });
      addSecNum('Max Stay s',   sec.maxStayDuration, 0, 300, 1,   v => { sec.maxStayDuration = v; });

      /* Surface Follow: 3-way (Inherit / On / Off) */
      const sfRow = document.createElement('div'); sfRow.className = 'prop-row';
      const sfLbl = document.createElement('span'); sfLbl.className = 'prop-label'; sfLbl.textContent = 'Surface Follow';
      const sfSel = document.createElement('select'); sfSel.className = 'prop-select';
      for (const [v, lbl] of [['inherit','Inherit'],['on','On'],['off','Off']]) {
        const o = document.createElement('option'); o.value = v; o.textContent = lbl;
        o.selected = (v === 'inherit' && sec.surfaceFollow === null) || (v === 'on' && sec.surfaceFollow === true) || (v === 'off' && sec.surfaceFollow === false);
        sfSel.appendChild(o);
      }
      sfSel.addEventListener('change', () => {
        sec.surfaceFollow = sfSel.value === 'inherit' ? null : sfSel.value === 'on';
        onPresetChange();
      });
      sfRow.appendChild(sfLbl); sfRow.appendChild(sfSel); secBody.appendChild(sfRow);

      /* ── Speed Mult with inherit toggle ── */
      const smRow = document.createElement('div'); smRow.className = 'prop-row';
      const smLbl = document.createElement('span'); smLbl.className = 'prop-label'; smLbl.textContent = 'Speed ×';
      const smInhBtn = document.createElement('button'); smInhBtn.className = 'game-btn';
      smInhBtn.style.cssText = 'font-size:0.7em;margin-right:4px;';
      const smInp = document.createElement('input'); smInp.type = 'number'; smInp.className = 'prop-input';
      smInp.min = '0.5'; smInp.max = '5'; smInp.step = '0.1';
      const refreshSm = () => {
        smInhBtn.textContent = sec.speedMult === null ? '[global]' : '[custom]';
        smInp.style.display = sec.speedMult === null ? 'none' : '';
        smInp.value = String(sec.speedMult ?? 1);
      };
      refreshSm();
      smInhBtn.addEventListener('click', () => {
        sec.speedMult = sec.speedMult === null ? 1.0 : null;
        refreshSm(); onPresetChange();
      });
      smInp.addEventListener('input', () => { sec.speedMult = parseFloat(smInp.value) || 1; onPresetChange(); });
      smRow.appendChild(smLbl); smRow.appendChild(smInhBtn); smRow.appendChild(smInp); secBody.appendChild(smRow);

      /* ── Color with inherit toggle ── */
      const colRow = document.createElement('div'); colRow.className = 'prop-row';
      const colLbl = document.createElement('span'); colLbl.className = 'prop-label'; colLbl.textContent = 'Color';
      const colInhBtn = document.createElement('button'); colInhBtn.className = 'game-btn';
      colInhBtn.style.cssText = 'font-size:0.7em;margin-right:4px;';
      const colInp = document.createElement('input'); colInp.type = 'color'; colInp.className = 'prop-color-input';
      const refreshCol = () => {
        colInhBtn.textContent = sec.color === null ? '[global]' : '[custom]';
        colInp.style.display = sec.color === null ? 'none' : '';
        colInp.value = '#' + (sec.color ?? 0x00e5ff).toString(16).padStart(6, '0');
      };
      refreshCol();
      colInhBtn.addEventListener('click', () => {
        sec.color = sec.color === null ? 0x00e5ff : null;
        refreshCol(); onPresetChange();
      });
      colInp.addEventListener('input', () => { sec.color = parseInt(colInp.value.slice(1), 16); onPresetChange(); });
      colRow.appendChild(colLbl); colRow.appendChild(colInhBtn); colRow.appendChild(colInp); secBody.appendChild(colRow);

      /* ── Buffs collapsible ── */
      const bufsBtn = document.createElement('button'); bufsBtn.className = 'game-btn'; bufsBtn.textContent = 'Buffs ▼';
      bufsBtn.style.cssText = 'width:100%;margin:2px 0;font-size:0.8em;';
      const bufsBody = document.createElement('div'); bufsBody.style.cssText = 'display:none;padding-left:8px;';
      bufsBtn.addEventListener('click', () => { bufsBody.style.display = bufsBody.style.display === 'none' ? 'block' : 'none'; bufsBtn.textContent = bufsBody.style.display === 'none' ? 'Buffs ▼' : 'Buffs ▲'; });
      secBody.appendChild(bufsBtn);
      /* inherit toggle for stats */
      const statsInhRow = document.createElement('div'); statsInhRow.className = 'prop-row';
      const statsInhBtn = document.createElement('button'); statsInhBtn.className = 'game-btn';
      statsInhBtn.style.cssText = 'width:100%;font-size:0.75em;';
      const statsNumRows: HTMLElement[] = [];
      const refreshStats = () => {
        statsInhBtn.textContent = sec.statModifiers === null ? 'Using Global Mods — Click to Override' : 'Using Custom Mods — Click to Inherit';
        statsNumRows.forEach(el => { el.style.display = sec.statModifiers === null ? 'none' : ''; });
      };
      statsInhBtn.addEventListener('click', () => {
        if (sec.statModifiers === null) {
          sec.statModifiers = { spinRateMult: 1, staminaMult: 1, attackMult: 1, defenseMult: 1, weightMult: 1, burstResistMult: 1, tiltAngleDeg: 0, tiltSpinSensitive: false, tiltApplyPhase: 'exit' };
        } else {
          sec.statModifiers = null;
        }
        refreshStats(); onPresetChange();
      });
      statsInhRow.appendChild(statsInhBtn); bufsBody.appendChild(statsInhRow);
      if (sec.statModifiers !== null) {
        const mods = sec.statModifiers;
        const addModRow = (lbl: string, val: number, set: (v: number) => void) => {
          const r = document.createElement('div'); r.className = 'prop-row'; statsNumRows.push(r);
          const lb = document.createElement('span'); lb.className = 'prop-label'; lb.textContent = lbl;
          const inp = document.createElement('input'); inp.type = 'number'; inp.className = 'prop-input';
          inp.value = String(val); inp.min = '0'; inp.max = '5'; inp.step = '0.05';
          inp.addEventListener('input', () => { set(parseFloat(inp.value) || 1); onPresetChange(); });
          r.appendChild(lb); r.appendChild(inp); bufsBody.appendChild(r);
        };
        addModRow('Spin Rate ×',     mods.spinRateMult,    v => { mods.spinRateMult    = v; });
        addModRow('Stamina Drain ×', mods.staminaMult,     v => { mods.staminaMult     = v; });
        addModRow('Attack ×',        mods.attackMult,      v => { mods.attackMult      = v; });
        addModRow('Defense ×',       mods.defenseMult,     v => { mods.defenseMult     = v; });
        addModRow('Weight ×',        mods.weightMult,      v => { mods.weightMult      = v; });
        addModRow('Burst Resist ×',  mods.burstResistMult, v => { mods.burstResistMult = v; });
        addModRow('Tilt °',          mods.tiltAngleDeg,    v => { mods.tiltAngleDeg    = v; });
      }
      refreshStats();
      secBody.appendChild(bufsBody);

      /* ── Conditions collapsible ── */
      const condBtn = document.createElement('button'); condBtn.className = 'game-btn'; condBtn.textContent = 'Conditions ▼';
      condBtn.style.cssText = 'width:100%;margin:2px 0;font-size:0.8em;';
      const condBody = document.createElement('div'); condBody.style.cssText = 'display:none;padding-left:8px;';
      condBtn.addEventListener('click', () => { condBody.style.display = condBody.style.display === 'none' ? 'block' : 'none'; condBtn.textContent = condBody.style.display === 'none' ? 'Conditions ▼' : 'Conditions ▲'; });
      secBody.appendChild(condBtn);

      const addCondSel = (lbl: string, opts: {value:string,label:string}[], curNull: boolean, cur: string, setVal: (v:string|null)=>void) => {
        const r = document.createElement('div'); r.className = 'prop-row';
        const lb = document.createElement('span'); lb.className = 'prop-label'; lb.textContent = lbl;
        const sel = document.createElement('select'); sel.className = 'prop-select';
        const fullOpts = [{ value: '__inherit__', label: 'Inherit' }, ...opts];
        for (const opt of fullOpts) {
          const o = document.createElement('option'); o.value = opt.value; o.textContent = opt.label;
          o.selected = curNull ? opt.value === '__inherit__' : opt.value === cur;
          sel.appendChild(o);
        }
        sel.addEventListener('change', () => { setVal(sel.value === '__inherit__' ? null : sel.value); onPresetChange(); });
        r.appendChild(lb); r.appendChild(sel); condBody.appendChild(r);
      };
      addCondSel('Entry', [
        { value: 'always', label: 'Always' }, { value: 'moving_only', label: 'Moving only' },
        { value: 'fast_only', label: 'Fast only' }, { value: 'slow_only', label: 'Slow only' },
      ], sec.entryCondition === null, sec.entryCondition ?? 'always',
        v => { sec.entryCondition = v as SpeedLineData['entryCondition'] | null; });
      addCondSel('Exit', [
        { value: 'normal', label: 'Normal' }, { value: 'launch', label: 'Launch' },
        { value: 'loop', label: 'Loop' }, { value: 'special_move', label: 'Special Move' },
      ], sec.exitBehavior === null, sec.exitBehavior ?? 'normal',
        v => { sec.exitBehavior = v as SpeedLineData['exitBehavior'] | null; });
      addCondSel('Activation', [
        { value: 'always', label: 'Always' }, { value: 'event', label: 'Event' },
        { value: 'periodic', label: 'Periodic' }, { value: 'proximity', label: 'Proximity' },
      ], sec.activationMode === null, sec.activationMode ?? 'always',
        v => { sec.activationMode = v as SpeedLineData['activationMode'] | null; });
      secBody.appendChild(condBody);

      secWrap.appendChild(secBody);
      this.content.appendChild(secWrap);
    }

    /* ── Add Section button ──────────────────────────────────────────────── */
    const addSecBtn = document.createElement('button'); addSecBtn.className = 'game-btn';
    addSecBtn.textContent = '+ Add Section'; addSecBtn.style.cssText = 'width:100%;margin:4px 0;';
    addSecBtn.addEventListener('click', () => {
      const usedDeg = sections.reduce((s, sec) => s + sec.angleDeg, 0);
      const remaining = Math.max(5, Math.round(360 - usedDeg));
      sections.push({
        angleDeg: remaining, yOffset: 0, maxStayDuration: 0,
        statModifiers: null, surfaceFollow: null, entryCondition: null,
        exitBehavior: null, color: null, opacity: null, speedMult: null, activationMode: null,
      });
      onPresetChange(); refresh();
    });
    this.content.appendChild(addSecBtn);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     OBSTACLE PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showObstacle(
    data: ObstacleData,
    onGeomChange: () => void,
    onFullChange: () => void,
    onRename: (name: string) => void,
    speedLineNames: Map<string, string>,
    onStlImport?: (cb: (b64: string) => void) => void,
    onStlClear?: () => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = data.name;
    nameInp.addEventListener('input', () => { data.name = nameInp.value; onRename(data.name); });
    this.content.appendChild(nameInp);

    this.section('SHAPE');
    this.selectRow('Shape', [
      { value: 'cube',     label: '⬛ Cube' },
      { value: 'cuboid',   label: '▬ Cuboid' },
      { value: 'sphere',   label: '● Sphere' },
      { value: 'cylinder', label: '⬭ Cylinder' },
      { value: 'pyramid',  label: '△ Pyramid' },
      { value: 'frustum',  label: '⬡ Frustum' },
    ], data.shape, s => {
      data.shape = s as ObstacleShape; this._refreshObstacleDims(data, onGeomChange); onFullChange();
    });

    this.section('DIMENSIONS');
    this._obstaclesDimRows(data, onGeomChange);

    this.section('POSITION');
    this.numRow('X (cm)', data.posX, -200, 200, 1, v => { data.posX = v; onGeomChange(); });
    this.numRow('Y (cm)', data.posY, -10,  200, 1, v => { data.posY = v; onGeomChange(); });
    this.numRow('Z (cm)', data.posZ, -200, 200, 1, v => { data.posZ = v; onGeomChange(); });

    this.section('ROTATION');
    this.numRow('Rot X°', data.rotX, -180, 180, 1, v => { data.rotX = v; onGeomChange(); });
    this.numRow('Rot Y°', data.rotY, -180, 180, 1, v => { data.rotY = v; onGeomChange(); });
    this.numRow('Rot Z°', data.rotZ, -180, 180, 1, v => { data.rotZ = v; onGeomChange(); });

    this.section('PHYSICS');
    this.toggleRow('Floating', data.isFloating, v => { data.isFloating = v; });
    this.toggleRow('Destructible', data.isDestructible, v => { data.isDestructible = v; onFullChange(); });
    if (data.isDestructible) {
      this.numRow('Hit Points', data.hitPoints, 1, 100, 1, v => { data.hitPoints = Math.round(v); });
    }
    this.numRow('Force X (cm/s)', data.contactForceX, -500, 500, 1, v => { data.contactForceX = v; });
    this.numRow('Force Y (cm/s)', data.contactForceY, -500, 500, 1, v => { data.contactForceY = v; });
    this.numRow('Force Z (cm/s)', data.contactForceZ, -500, 500, 1, v => { data.contactForceZ = v; });

    this.section('SURFACE');
    this._wallMaterialRow(data, ['abs','metal','stone','rubber'], onFullChange);
    this.colorRow('Color', data.color, v => { data.color = v; onGeomChange(); });
    this.surfaceRow(data, onFullChange);
    this.numRow('Tile Scale', data.tileScale, 0.1, 20, 0.1, v => { data.tileScale = v; onGeomChange(); });
    this.colorRow('Glow Color', data.emissiveColor, v => { data.emissiveColor = v; onGeomChange(); });
    this.numRow('Glow Intensity', data.emissiveIntensity, 0, 3, 0.1, v => { data.emissiveIntensity = v; onGeomChange(); });
    this.numRow('Opacity', data.opacity, 0, 1, 0.05, v => { data.opacity = v; onGeomChange(); });
    this.themeRow(theme => {
      data.color = theme.color; data.surface = theme.surface;
      data.emissiveColor = theme.emissiveColor; data.emissiveIntensity = theme.emissiveIntensity;
      data.material = theme.baseMaterial; data.tileScale = theme.tileScale;
      onFullChange();
    });

    this.section('THEME');
    const THEMES: ObstacleTheme[] = ['default','rock','boat','aircraft','bird','cloud'];
    this.selectRow('Theme', THEMES.map(t => ({ value: t, label: t })), data.theme, v => {
      data.theme = v as ObstacleTheme;
    });

    this.section('SPEED PATH');
    const slOpts = [{ value: '', label: '— None —' }, ...[...speedLineNames.entries()].map(([id,name]) => ({ value: id, label: name }))];
    this.selectRow('Speed Path', slOpts, data.speedPathId ?? '', v => {
      data.speedPathId = v || null;
    });

    this.section('PRESENTATION STL');
    this.buttonRow('', data.presentStlb64 ? '✓ Replace STL…' : 'Import STL…', () => {
      onStlImport?.((b64) => { data.presentStlb64 = b64; onGeomChange(); });
    });
    if (data.presentStlb64) {
      this.colorRow('Present Color', data.presentColor, v => { data.presentColor = v; onGeomChange(); });
      this.buttonRow('', 'Clear STL', () => { data.presentStlb64 = null; onStlClear?.(); onGeomChange(); });
    }
  }

  private _obstaclesDimRows(data: ObstacleData, onGeomChange: () => void): void {
    switch (data.shape) {
      case 'cube':
        this.numRow('Side (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => {
          data.dimX = data.dimY = data.dimZ = v; onGeomChange();
        });
        break;
      case 'cuboid':
        this.numRow('Width  (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimX = v; onGeomChange(); });
        this.numRow('Height (cm)', data.dimY, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimY = v; onGeomChange(); });
        this.numRow('Depth  (cm)', data.dimZ, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimZ = v; onGeomChange(); });
        break;
      case 'sphere':
        this.numRow('Diameter (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimX = v; onGeomChange(); });
        break;
      case 'cylinder':
        this.numRow('Diameter (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimX = v; onGeomChange(); });
        this.numRow('Height   (cm)', data.dimY, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimY = v; onGeomChange(); });
        break;
      case 'pyramid':
        this.numRow('Base W (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimX = v; onGeomChange(); });
        this.numRow('Base D (cm)', data.dimZ, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimZ = v; onGeomChange(); });
        this.numRow('Height (cm)', data.dimY, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimY = v; onGeomChange(); });
        break;
      case 'frustum':
        this.numRow('Bottom D (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimX = v; onGeomChange(); });
        this.numRow('Top D    (cm)', data.dimZ, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimZ = v; onGeomChange(); });
        this.numRow('Height   (cm)', data.dimY, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimY = v; onGeomChange(); });
        break;
    }
  }

  private _refreshObstacleDims(_data: ObstacleData, _onGeomChange: () => void): void {
    // Re-render will happen via onGeomChange → renderProps — dims section is rebuilt
  }


  /* ═══════════════════════════════════════════════════════════════════════
     TRAP PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showTrap(
    data: TrapData,
    onGeomChange: () => void,
    onFullChange: () => void,
    onRename: (name: string) => void,
    speedLineNames: Map<string, string>,
    onStlImport?: (cb: (b64: string) => void) => void,
    onStlClear?: () => void,
    getSpeedLines?: () => Array<{id: string; name: string}>,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = data.name;
    nameInp.addEventListener('input', () => { data.name = nameInp.value; onRename(data.name); });
    this.content.appendChild(nameInp);

    this.section('SHAPE');
    this.selectRow('Shape', [
      { value: 'rectangle', label: '▭ Rectangle' },
      { value: 'circle',    label: '● Circle' },
      { value: 'ellipse',   label: '◯ Ellipse' },
      { value: 'hexagon',   label: '⬡ Hexagon' },
    ], data.shape, s => {
      data.shape = s as TrapShape; onGeomChange();
    });

    this.section('VARIANT');
    const VARIANTS: TrapVariant[] = ['generic','spike','trampoline','hammer','saw','buff','chomper','hidden_pit'];
    this.selectRow('Variant', VARIANTS.map(v => ({ value: v, label: v })), data.variant, v => {
      data.variant = v as TrapVariant; onGeomChange();
    });

    this.section('DIMENSIONS');
    this.numRow('Width  (cm)', data.dimX, MIN_TRAP_DIM, 200, 1, v => { data.dimX = v; onGeomChange(); });
    this.numRow('Depth  (cm)', data.dimZ, MIN_TRAP_DIM, 200, 1, v => { data.dimZ = v; onGeomChange(); });

    this.section('POSITION');
    if (data.parentType === 'arena') {
      this.numRow('Radius (cm)',  data.posR,     0, 200, 1,   v => { data.posR = v;     onGeomChange(); });
      this.numRow('Angle°',       data.posAngle, 0, 360, 1,   v => { data.posAngle = v; onGeomChange(); });
    } else {
      this.numRow('X (cm)', data.basePosX, -200, 200, 1, v => { data.basePosX = v; onGeomChange(); });
      this.numRow('Z (cm)', data.basePosZ, -200, 200, 1, v => { data.basePosZ = v; onGeomChange(); });
    }
    this.numRow('Rot Y°', data.rotY, -180, 180, 1, v => { data.rotY = v; onGeomChange(); });

    this.section('EFFECT');
    const EFFECTS: TrapEffect[] = ['damage','heal','launch','reverse_controls','freeze','buff_zone','hidden_pit','chomper','gravity_pull','earthquake','rpm','projectile'];
    this.selectRow('Effect', EFFECTS.map(e => ({ value: e, label: e })), data.effect, v => {
      data.effect = v as TrapEffect; onFullChange();
    });
    this._trapEffectRows(data, onGeomChange);

    if (data.effect === 'gravity_pull') {
      this.section('GRAVITY PULL');
      this.numRow('Range (cm)',       data.gravityRange,         5,   200, 1,   v => { data.gravityRange    = v; onGeomChange(); });
      this.numRow('Strength (cm/s²)', data.gravityStrength,      1,   500, 1,   v => { data.gravityStrength = v; onGeomChange(); });
      const gRow = document.createElement('div'); gRow.className = 'prop-profile-row';
      const gLabel = document.createElement('span'); gLabel.className = 'prop-row-label'; gLabel.textContent = 'Mode'; gRow.appendChild(gLabel);
      for (const [m, lbl] of [['continuous','Continuous'],['pulse','Pulse'],['conditional','Conditional']] as ['continuous'|'pulse'|'conditional', string][]) {
        const btn = document.createElement('button');
        btn.className = 'prop-profile-btn' + (data.gravityMode === m ? ' active' : '');
        btn.textContent = lbl;
        btn.addEventListener('click', () => { data.gravityMode = m; onFullChange(); });
        gRow.appendChild(btn);
      }
      this.content.appendChild(gRow);
      if (data.gravityMode === 'pulse') {
        this.numRow('Interval (s)', data.gravityPulseInterval, 0.1, 30, 0.1, v => { data.gravityPulseInterval = v; onGeomChange(); });
        this.numRow('Width (s)',    data.gravityPulseWidth,    0.1, 10, 0.1, v => { data.gravityPulseWidth    = v; onGeomChange(); });
      }
    }

    if (data.effect === 'earthquake') {
      this.section('EARTHQUAKE');
      this.numRow('Rings',           data.eqRingCount,       1,  10, 1,  v => { data.eqRingCount      = Math.round(v); onGeomChange(); });
      this.numRow('Sectors/Ring',    data.eqSegmentsPerRing, 3,  24, 1,  v => { data.eqSegmentsPerRing = Math.round(v); onGeomChange(); });
      this.numRow('Max Elev (cm)',   data.eqMaxElevationCm,  0.5,50, 0.5,v => { data.eqMaxElevationCm  = v; onGeomChange(); });
      this.selectRow('Elevation Mode', [
        { value: 'random', label: 'Random' }, { value: 'wave', label: 'Wave' },
        { value: 'ripple', label: 'Ripple' }, { value: 'checkerboard', label: 'Checkerboard' },
      ], data.eqElevationMode, v => {
        data.eqElevationMode = v as typeof data.eqElevationMode; onFullChange();
      });
      this.toggleRow('Permanent', data.eqPermanent, v => { data.eqPermanent = v; onGeomChange(); });
      if (!data.eqPermanent) {
        this.numRow('Fade Cycles (0=∞)', data.eqFadeCycles, 0, 20, 1, v => { data.eqFadeCycles = Math.round(v); });
      }
      this.selectRow('Pulse Mode', [
        { value: 'triggered', label: 'Triggered' }, { value: 'continuous', label: 'Continuous' }, { value: 'periodic', label: 'Periodic' },
      ], data.eqPulseMode, v => {
        data.eqPulseMode = v as typeof data.eqPulseMode; onFullChange();
      });
      if (data.eqPulseMode !== 'triggered') {
        this.numRow('Interval (ms)', data.eqPulseIntervalMs, 100, 10000, 100, v => { data.eqPulseIntervalMs = v; });
        this.numRow('Width (ms)',    data.eqPulseWidthMs,    100, 5000,  100, v => { data.eqPulseWidthMs    = v; });
      }
    }

    if (data.effect === 'rpm') {
      this.section('RPM TRAP');
      this.numRow('Speed (°/s)', data.rpmSpeed, -3600, 3600, 10, v => { data.rpmSpeed = v; onGeomChange(); });
      this.selectRow('Effect', [
        { value: 'carry', label: 'Carry' }, { value: 'tangential', label: 'Tangential' },
        { value: 'centripetal', label: 'Centripetal' }, { value: 'centrifugal', label: 'Centrifugal' },
        { value: 'spin_boost', label: 'Spin Boost' }, { value: 'spin_drain', label: 'Spin Drain' },
        { value: 'gyroscopic', label: 'Gyroscopic' }, { value: 'full', label: 'Full' },
      ], data.rpmEffect, v => { data.rpmEffect = v as typeof data.rpmEffect; onGeomChange(); });
      this.numRow('Range (cm, 0=auto)', data.rpmRange, 0, 200, 1, v => { data.rpmRange = v; onGeomChange(); });
      this.numRow('Force Scale', data.rpmForceScale, 0, 5, 0.1, v => { data.rpmForceScale = v; onGeomChange(); });
      this.toggleRow('Match Spin Dir', data.rpmMatchSpin, v => { data.rpmMatchSpin = v; onGeomChange(); });
      this.selectRow('Pulse Mode', [
        { value: 'continuous', label: 'Continuous' }, { value: 'triggered', label: 'Triggered' }, { value: 'periodic', label: 'Periodic' },
      ], data.rpmPulseMode, v => {
        data.rpmPulseMode = v as typeof data.rpmPulseMode; onFullChange();
      });
      if (data.rpmPulseMode === 'periodic') {
        this.numRow('Interval (ms)', data.rpmPulseIntervalMs, 100, 10000, 100, v => { data.rpmPulseIntervalMs = v; });
        this.numRow('Width (ms)',    data.rpmPulseWidthMs,    100, 5000,  100, v => { data.rpmPulseWidthMs    = v; });
      }
    }

    if (data.effect === 'projectile') {
      this.section('LAUNCH');
      this.selectRow('Mode', [
        { value: 'single', label: 'Single' }, { value: 'spread', label: 'Spread' },
        { value: 'burst', label: 'Burst' }, { value: 'continuous', label: 'Continuous' }, { value: 'pattern', label: 'Pattern' },
      ], data.projLaunchMode, v => {
        data.projLaunchMode = v as typeof data.projLaunchMode; onFullChange();
      });
      this.numRow('Count', data.projCount, 1, 20, 1, v => { data.projCount = Math.round(v); });
      if (data.projLaunchMode === 'spread') {
        this.numRow('Spread° ', data.projSpreadAngleDeg, 5, 360, 5, v => { data.projSpreadAngleDeg = v; });
      }
      if (data.projLaunchMode === 'burst') {
        this.numRow('Burst Count', data.projBurstCount, 1, 10, 1, v => { data.projBurstCount = Math.round(v); });
        this.numRow('Burst Delay (ms)', data.projBurstDelayMs, 50, 2000, 50, v => { data.projBurstDelayMs = v; });
      }
      this.numRow('Launch Angle°', data.projLaunchAngleDeg, -180, 180, 5, v => { data.projLaunchAngleDeg = v; });
      this.numRow('Launch Delay (ms)', data.projLaunchDelayMs, 0, 5000, 100, v => { data.projLaunchDelayMs = v; });
      this.toggleRow('Randomize Angle', data.projRandomizeAngle, v => { data.projRandomizeAngle = v; });
      if (data.projLaunchMode === 'pattern') {
        this.selectRow('Pattern', [
          { value: 'ring', label: 'Ring' }, { value: 'spiral', label: 'Spiral' },
          { value: 'fan', label: 'Fan' }, { value: 'line', label: 'Line' }, { value: 'random', label: 'Random' },
        ], data.projPattern, v => { data.projPattern = v as typeof data.projPattern; onFullChange(); });
        this.numRow('Pattern Count', data.projPatternCount, 2, 20, 1, v => { data.projPatternCount = Math.round(v); });
      }
      this.selectRow('Pulse Mode', [
        { value: 'triggered', label: 'Triggered' }, { value: 'periodic', label: 'Periodic' }, { value: 'continuous', label: 'Continuous' },
      ], data.projPulseMode, v => {
        data.projPulseMode = v as typeof data.projPulseMode; onFullChange();
      });
      if (data.projPulseMode === 'periodic') {
        this.numRow('Interval (ms)', data.projPulseIntervalMs, 100, 10000, 100, v => { data.projPulseIntervalMs = v; });
      }
      this.numRow('Plate Spin (°/s)', data.projPlateSpin, -1800, 1800, 10, v => { data.projPlateSpin = v; onGeomChange(); });

      this.section('PROJECTILE SHAPE');
      const cfg = data.projConfig;
      this.selectRow('Shape', [
        { value: 'sphere', label: 'Sphere' }, { value: 'cube', label: 'Cube' },
        { value: 'cylinder', label: 'Cylinder' }, { value: 'cone', label: 'Cone' }, { value: 'diamond', label: 'Diamond' },
      ], cfg.shape, v => { cfg.shape = v as typeof cfg.shape; onGeomChange(); });
      this.numRow('Dim X (cm)', cfg.dimX, 0.5, 50, 0.5, v => { cfg.dimX = v; onGeomChange(); });
      this.numRow('Dim Y (cm)', cfg.dimY, 0.5, 50, 0.5, v => { cfg.dimY = v; onGeomChange(); });
      this.numRow('Dim Z (cm)', cfg.dimZ, 0.5, 50, 0.5, v => { cfg.dimZ = v; onGeomChange(); });
      this.colorRow('Color', cfg.color, v => { cfg.color = v; onGeomChange(); });
      this.colorRow('Glow', cfg.emissiveColor, v => { cfg.emissiveColor = v; onGeomChange(); });
      this.numRow('Glow Intensity', cfg.emissiveIntensity, 0, 3, 0.1, v => { cfg.emissiveIntensity = v; onGeomChange(); });
      this.numRow('Scale Factor', cfg.scaleFactor, 0.1, 5, 0.1, v => { cfg.scaleFactor = v; onGeomChange(); });
      this.toggleRow('Random Scale', cfg.scaleRandomize, v => { cfg.scaleRandomize = v; onFullChange(); });
      if (cfg.scaleRandomize) {
        this.numRow('Scale Min', cfg.scaleMin, 0.1, 5, 0.1, v => { cfg.scaleMin = v; });
        this.numRow('Scale Max', cfg.scaleMax, 0.1, 5, 0.1, v => { cfg.scaleMax = v; });
      }

      this.section('FLIGHT');
      this.numRow('Speed (cm/s)', cfg.speed, 1, 500, 5, v => { cfg.speed = v; });
      this.toggleRow('Airborne', cfg.isAirborne, v => { cfg.isAirborne = v; onFullChange(); });
      if (cfg.isAirborne) {
        this.numRow('Arc Height (cm)', cfg.arcHeight, 0, 200, 5, v => { cfg.arcHeight = v; });
      }
      this.numRow('Lifetime (ms)', cfg.lifetimeMs, 100, 10000, 100, v => { cfg.lifetimeMs = v; });
      this.numRow('Spin X (°/s)', cfg.spinX, -1080, 1080, 10, v => { cfg.spinX = v; });
      this.numRow('Spin Y (°/s)', cfg.spinY, -1080, 1080, 10, v => { cfg.spinY = v; });
      this.numRow('Spin Z (°/s)', cfg.spinZ, -1080, 1080, 10, v => { cfg.spinZ = v; });
      this.toggleRow('Boomerang', cfg.returnToTrap, v => { cfg.returnToTrap = v; onFullChange(); });
      if (cfg.returnToTrap) {
        this.numRow('Return After (ms)', cfg.returnAfterMs, 100, 5000, 100, v => { cfg.returnAfterMs = v; });
      }

      this.section('ORBIT');
      this.toggleRow('Orbit Source', cfg.orbitSource, v => { cfg.orbitSource = v; onFullChange(); });
      if (cfg.orbitSource) {
        this.numRow('Orbit Radius (cm)', cfg.orbitRadius,    1, 200, 1, v => { cfg.orbitRadius    = v; });
        this.numRow('Orbit Speed (°/s)', cfg.orbitSpeed, -1800, 1800, 10, v => { cfg.orbitSpeed   = v; });
        this.numRow('Elevation (cm)',    cfg.orbitElevation, 0, 100, 1, v => { cfg.orbitElevation = v; });
      }

      this.section('HOMING');
      this.toggleRow('Homing Enabled', cfg.homingEnabled, v => { cfg.homingEnabled = v; onFullChange(); });
      if (cfg.homingEnabled) {
        this.numRow('Homing Strength', cfg.homingStrength, 0, 10, 0.5, v => { cfg.homingStrength = v; });
      }

      this.section('ON-HIT EFFECT');
      this.selectRow('Hit Effect', [
        { value: 'damage', label: 'Damage' }, { value: 'buff', label: 'Buff' }, { value: 'debuff', label: 'Debuff' },
        { value: 'push', label: 'Push' }, { value: 'teleport', label: 'Teleport' }, { value: 'stun', label: 'Stun' }, { value: 'custom_event', label: 'Custom Event' },
      ], cfg.hitEffect, v => { cfg.hitEffect = v as typeof cfg.hitEffect; });
      this.numRow('Hit Strength', cfg.hitStrength, 0, 10, 0.1, v => { cfg.hitStrength = v; });
      this.numRow('Hit Duration (ms)', cfg.hitDurationMs, 0, 5000, 100, v => { cfg.hitDurationMs = v; });
      this.numRow('Hit Radius (cm)', cfg.hitRadius, 0.5, 50, 0.5, v => { cfg.hitRadius = v; });
    }

    // ── Speed Line Link ───────────────────────────────────────────────────
    if (getSpeedLines) {
      this.section('SPEED LINE LINK');
      const sls = getSpeedLines();
      const slOpts = [{ value: '', label: '— None —' }, ...sls.map(s => ({ value: s.id, label: s.name }))];
      this.selectRow('Linked Speed Line', slOpts, data.linkedSpeedLineId ?? '', v => {
        data.linkedSpeedLineId = v || null;
        onGeomChange();
      });
    }

    this.section('TIMING');
    this.toggleRow('Periodic', data.isPeriodic, v => { data.isPeriodic = v; onFullChange(); });
    if (data.isPeriodic) {
      this.numRow('Safe (s)',   data.safeInterval,   0.1, 60, 0.5, v => { data.safeInterval = v; });
      this.numRow('Unsafe (s)', data.unsafeInterval, 0.1, 60, 0.5, v => { data.unsafeInterval = v; });
    }
    this.numRow('Act. Limit (0=∞)', data.activationLimit, 0, 100, 1, v => { data.activationLimit = Math.round(v); });

    this.section('SPEED PATH');
    const slOpts = [{ value: '', label: '— None —' }, ...[...speedLineNames.entries()].map(([id,name]) => ({ value: id, label: name }))];
    this.selectRow('Speed Path', slOpts, data.speedPathId ?? '', v => { data.speedPathId = v || null; });

    if (data.effect === 'buff_zone') {
      this._trapDurationTiersSection(data, onGeomChange);
    }

    this.section('APPEARANCE');
    const trapMatProxy = { material: data.baseMaterial };
    this._wallMaterialRow(trapMatProxy, ['abs','metal','stone','rubber'], () => { data.baseMaterial = trapMatProxy.material; onFullChange(); });
    this.colorRow('Color', data.color, v => { data.color = v; onGeomChange(); });
    this.surfaceRow(data, onFullChange);
    this.numRow('Tile Scale', data.tileScale, 0.1, 20, 0.1, v => { data.tileScale = v; onGeomChange(); });
    this.colorRow('Glow Color', data.emissiveColor, v => { data.emissiveColor = v; onGeomChange(); });
    this.numRow('Glow Intensity', data.emissiveIntensity, 0, 3, 0.1, v => { data.emissiveIntensity = v; onGeomChange(); });
    this.themeRow(theme => {
      data.color = theme.color; data.surface = theme.surface;
      data.emissiveColor = theme.emissiveColor; data.emissiveIntensity = theme.emissiveIntensity;
      data.baseMaterial = theme.baseMaterial; data.tileScale = theme.tileScale;
      onFullChange();
    });

    this.section('ENV TRIGGER');
    this.textRow('Event Name', data.envTriggerEvent, v => { data.envTriggerEvent = v; onGeomChange(); });
    this.textRow('Target Arena ID', data.envTargetArenaId, v => { data.envTargetArenaId = v; onGeomChange(); });

    this.section('PRESENTATION STL');
    this.buttonRow('', data.presentStlb64 ? '✓ Replace STL…' : 'Import STL…', () => {
      onStlImport?.((b64) => { data.presentStlb64 = b64; onGeomChange(); });
    });
    if (data.presentStlb64) {
      this.colorRow('Present Color', data.presentColor, v => { data.presentColor = v; onGeomChange(); });
      this.buttonRow('', 'Clear STL', () => { data.presentStlb64 = null; onStlClear?.(); onGeomChange(); });
    }
  }

  private _trapEffectRows(data: TrapData, onGeomChange: () => void): void {
    switch (data.effect) {
      case 'damage':
        this.numRow('Damage Factor', data.damageFactor, 0, 1, 0.01, v => { data.damageFactor = v; });
        break;
      case 'heal':
        this.numRow('Heal Factor', data.healFactor, 0, 1, 0.01, v => { data.healFactor = v; });
        break;
      case 'launch':
        this.numRow('Force X (cm/s)', data.forceX, -500, 500, 1, v => { data.forceX = v; });
        this.numRow('Force Y (cm/s)', data.forceY, -500, 500, 1, v => { data.forceY = v; });
        this.numRow('Force Z (cm/s)', data.forceZ, -500, 500, 1, v => { data.forceZ = v; });
        break;
      case 'freeze':
        this.numRow('Duration (s)', data.freezeDuration, 0.5, 30, 0.5, v => { data.freezeDuration = v; });
        break;
      case 'buff_zone': {
        const SURFACES: SurfaceType[] = ['plain','checker','grid','hex','stripes','dots','concrete','metal','wood','ice','sand','lava_rock'];
        const surfOpts = SURFACES.map(s => ({ value: s, label: SURFACE_LABEL[s] }));
        this.selectRow('Buff Surface', surfOpts, data.buffSurface ?? 'plain', v => {
          data.buffSurface = v as SurfaceType;
        });
        break;
      }
      case 'chomper':
        this.numRow('Crush Damage', data.damageFactor, 0, 1, 0.01, v => { data.damageFactor = v; });
        break;
      case 'hidden_pit': {
        const PIT_SHAPES: OpeningShape[] = ['circle','ellipse','rectangle','hexagon','triangle','star'];
        this.selectRow('Pit Shape', PIT_SHAPES.map(s => ({ value: s, label: s })), data.pitShape, v => {
          data.pitShape = v as OpeningShape;
        });
        this.numRow('Pit Radius X (cm)', data.pitRadiusX, 5, 100, 1, v => { data.pitRadiusX = v; });
        this.numRow('Pit Radius Z (cm)', data.pitRadiusZ, 5, 100, 1, v => { data.pitRadiusZ = v; });
        this.numRow('Pit Depth  (cm)',   data.pitDepth,   5, 100, 1, v => { data.pitDepth = v; });
        break;
      }
      default:
        break;
    }
  }

  private _trapDurationTiersSection(data: TrapData, onGeomChange: () => void): void {
    this.section('DURATION TIERS');
    const hint = document.createElement('div'); hint.className = 'prop-hint';
    hint.textContent = 'Each tier activates after bey stays on trap for that many seconds.';
    this.content.appendChild(hint);

    const tiersContainer = document.createElement('div');
    tiersContainer.className = 'prop-tiers-container';
    this.content.appendChild(tiersContainer);

    const rebuild = () => {
      tiersContainer.innerHTML = '';
      data.durationTiers.forEach((tier, idx) => {
        const tierDiv = document.createElement('div');
        tierDiv.className = 'prop-tier-block';
        const TIER_EFFECTS: TrapTierEffect[] = ['friction','slow','burn_damage','chill','freeze','sand_pile','custom'];
        const header = document.createElement('div'); header.className = 'prop-tier-header';
        header.textContent = `Tier ${idx + 1}`;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'game-btn prop-tier-remove'; removeBtn.textContent = '✕';
        removeBtn.addEventListener('click', () => {
          data.durationTiers.splice(idx, 1); rebuild(); onGeomChange();
        });
        header.appendChild(removeBtn);
        tierDiv.appendChild(header);

        // After X seconds row
        const rowAfter = document.createElement('div'); rowAfter.className = 'prop-row';
        const lblAfter = document.createElement('span'); lblAfter.className = 'prop-label'; lblAfter.textContent = 'After (s)';
        const inpAfter = document.createElement('input'); inpAfter.type = 'number'; inpAfter.className = 'prop-input';
        inpAfter.min = '0'; inpAfter.step = '0.5'; inpAfter.value = String(tier.thresholdSeconds);
        inpAfter.addEventListener('input', () => { tier.thresholdSeconds = parseFloat(inpAfter.value) || 0; });
        rowAfter.appendChild(lblAfter); rowAfter.appendChild(inpAfter); tierDiv.appendChild(rowAfter);

        // Effect select
        const sel = this._appendSelectTo(tierDiv, 'Effect', TIER_EFFECTS.map(e => ({ value: e, label: e })), tier.tierEffect, v => {
          tier.tierEffect = v as TrapTierEffect;
        });

        // RPM loss / speed mult
        const rpmRow = document.createElement('div'); rpmRow.className = 'prop-row';
        const lblRpm = document.createElement('span'); lblRpm.className = 'prop-label'; lblRpm.textContent = 'RPM loss/s';
        const inpRpm = document.createElement('input'); inpRpm.type = 'number'; inpRpm.className = 'prop-input';
        inpRpm.min = '0'; inpRpm.max = '1'; inpRpm.step = '0.01'; inpRpm.value = String(tier.rpmLossFactor);
        inpRpm.addEventListener('input', () => { tier.rpmLossFactor = parseFloat(inpRpm.value) || 0; });
        rpmRow.appendChild(lblRpm); rpmRow.appendChild(inpRpm); tierDiv.appendChild(rpmRow);

        const spdRow = document.createElement('div'); spdRow.className = 'prop-row';
        const lblSpd = document.createElement('span'); lblSpd.className = 'prop-label'; lblSpd.textContent = 'Speed mult';
        const inpSpd = document.createElement('input'); inpSpd.type = 'number'; inpSpd.className = 'prop-input';
        inpSpd.min = '0'; inpSpd.max = '3'; inpSpd.step = '0.05'; inpSpd.value = String(tier.speedFactor);
        inpSpd.addEventListener('input', () => { tier.speedFactor = parseFloat(inpSpd.value) || 0; });
        spdRow.appendChild(lblSpd); spdRow.appendChild(inpSpd); tierDiv.appendChild(spdRow);

        const notesRow = document.createElement('div'); notesRow.className = 'prop-row';
        const lblNotes = document.createElement('span'); lblNotes.className = 'prop-label'; lblNotes.textContent = 'Notes';
        const inpNotes = document.createElement('input'); inpNotes.type = 'text'; inpNotes.className = 'prop-text-input';
        inpNotes.value = tier.notes;
        inpNotes.addEventListener('input', () => { tier.notes = inpNotes.value; });
        notesRow.appendChild(lblNotes); notesRow.appendChild(inpNotes); tierDiv.appendChild(notesRow);

        tiersContainer.appendChild(tierDiv);
        void sel; // suppress unused warning
      });

      // Add tier button
      const addBtn = document.createElement('button'); addBtn.className = 'game-btn prop-add-tier-btn';
      addBtn.textContent = '+ Add Tier';
      addBtn.addEventListener('click', () => {
        data.durationTiers.push({ thresholdSeconds: 0, tierEffect: 'friction', rpmLossFactor: 0.05, speedFactor: 0.9, notes: '' });
        rebuild(); onGeomChange();
      });
      tiersContainer.appendChild(addBtn);

      // Preset button (only for known buff surfaces)
      if (data.buffSurface && data.buffSurface in BUFF_TIER_PRESETS) {
        const presetBtn = document.createElement('button'); presetBtn.className = 'game-btn';
        presetBtn.textContent = '↺ Preset';
        presetBtn.title = `Re-seed tiers from ${data.buffSurface} preset`;
        presetBtn.addEventListener('click', () => {
          const key = data.buffSurface as keyof typeof BUFF_TIER_PRESETS;
          data.durationTiers = BUFF_TIER_PRESETS[key].map(t => ({...t}));
          rebuild(); onGeomChange();
        });
        tiersContainer.appendChild(presetBtn);
      }
    };

    rebuild();
  }

  private _appendSelectTo(
    parent: HTMLElement,
    label: string,
    options: { value: string; label: string }[],
    current: string,
    onChange: (v: string) => void,
  ): HTMLSelectElement {
    const row = document.createElement('div'); row.className = 'prop-row';
    const lbl = document.createElement('span'); lbl.className = 'prop-label'; lbl.textContent = label;
    const sel = document.createElement('select'); sel.className = 'prop-select';
    for (const opt of options) {
      const el = document.createElement('option');
      el.value = opt.value; el.textContent = opt.label; el.selected = opt.value === current;
      sel.appendChild(el);
    }
    sel.addEventListener('change', () => onChange(sel.value));
    row.appendChild(lbl); row.appendChild(sel); parent.appendChild(row);
    return sel;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     PORTAL PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showPortal(
    data: PortalData,
    arenaNames: Map<string, string>,
    portalNames: Map<string, string>,
    onGeomChange: () => void,
    onFullChange: () => void,
    onRename: (name: string) => void,
    onStlImport?: (cb: (b64: string) => void) => void,
    onStlClear?: () => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = data.name;
    nameInp.addEventListener('input', () => { data.name = nameInp.value; onRename(data.name); });
    this.content.appendChild(nameInp);

    this.section('SHAPE');
    this.selectRow('Shape', [
      { value: 'rectangle', label: '▭ Rectangle' },
      { value: 'circle',    label: '● Circle' },
      { value: 'ellipse',   label: '◯ Ellipse' },
      { value: 'hexagon',   label: '⬡ Hexagon' },
    ], data.shape, s => {
      data.shape = s as TrapShape; onGeomChange();
    });

    this.section('DIMENSIONS');
    this.numRow('Width (cm)', data.dimX, MIN_TRAP_DIM, 200, 1, v => { data.dimX = v; onGeomChange(); });
    this.numRow('Depth (cm)', data.dimZ, MIN_TRAP_DIM, 200, 1, v => { data.dimZ = v; onGeomChange(); });

    this.section('POSITION');
    if (data.parentType === 'arena') {
      this.numRow('Radius (cm)', data.posR,     0, 200, 1, v => { data.posR = v;     onGeomChange(); });
      this.numRow('Angle°',      data.posAngle, 0, 360, 1, v => { data.posAngle = v; onGeomChange(); });
    } else {
      this.numRow('X (cm)', data.basePosX, -200, 200, 1, v => { data.basePosX = v; onGeomChange(); });
      this.numRow('Z (cm)', data.basePosZ, -200, 200, 1, v => { data.basePosZ = v; onGeomChange(); });
    }
    this.numRow('Rot Y°', data.rotY, -180, 180, 1, v => { data.rotY = v; onGeomChange(); });

    this.section('DESTINATION');
    const DEST_TYPES: PortalDestType[] = ['portal','random_arena','world_point'];
    const DEST_LABELS: Record<PortalDestType, string> = {
      portal: 'Linked Portal', random_arena: 'Random Arena Drop', world_point: 'World Point',
    };
    this.selectRow('Type', DEST_TYPES.map(t => ({ value: t, label: DEST_LABELS[t] })), data.destType, v => {
      data.destType = v as PortalDestType; onFullChange();
    });

    if (data.destType === 'portal') {
      const others = [...portalNames.entries()].filter(([id]) => id !== data.id);
      const opts = [{ value: '', label: '— None —' }, ...others.map(([id,name]) => ({ value: id, label: name }))];
      this.selectRow('Target Portal', opts, data.destPortalId ?? '', v => { data.destPortalId = v || null; });
      this.toggleRow('Bidirectional', data.isBidirectional, v => { data.isBidirectional = v; });
    } else if (data.destType === 'random_arena') {
      const opts = [{ value: '', label: '— Any —' }, ...[...arenaNames.entries()].map(([id,name]) => ({ value: id, label: name }))];
      this.selectRow('Arena', opts, data.destArenaId ?? '', v => { data.destArenaId = v || null; });
    } else {
      this.numRow('Dest X (cm)', data.destPosX, -500, 500, 1, v => { data.destPosX = v; });
      this.numRow('Dest Y (cm)', data.destPosY, -500, 500, 1, v => { data.destPosY = v; });
      this.numRow('Dest Z (cm)', data.destPosZ, -500, 500, 1, v => { data.destPosZ = v; });
    }

    this.section('EXIT');
    this.numRow('Vel Scale', data.exitVelScale, 0.1, 3.0, 0.1, v => { data.exitVelScale = v; });
    this.numRow('Heading° (NaN=keep)', isNaN(data.exitRotY) ? 0 : data.exitRotY, -180, 180, 1, v => {
      data.exitRotY = v;
    });
    this.toggleRow('Preserve heading', isNaN(data.exitRotY), v => {
      data.exitRotY = v ? NaN : 0;
    });

    this.section('APPEARANCE');
    this.colorRow('Pad Color',  data.color,     v => { data.color = v;     onGeomChange(); });
    this.colorRow('Glow Color', data.glowColor, v => { data.glowColor = v; onGeomChange(); });
    this.surfaceRow(data, onFullChange);
    this.numRow('Tile Scale', data.tileScale, 0.1, 20, 0.1, v => { data.tileScale = v; onGeomChange(); });

    this.section('PRESENTATION STL');
    this.buttonRow('', data.presentStlb64 ? '✓ Replace STL…' : 'Import STL…', () => {
      onStlImport?.((b64) => { data.presentStlb64 = b64; onGeomChange(); });
    });
    if (data.presentStlb64) {
      this.colorRow('Present Color', data.presentColor, v => { data.presentColor = v; onGeomChange(); });
      this.buttonRow('', 'Clear STL', () => { data.presentStlb64 = null; onStlClear?.(); onGeomChange(); });
    }
  }

  showRotation(
    data: RotationData,
    onUpdate: () => void,
    onRename: (name: string) => void,
    bridgeNames?: Map<string, string>,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = this.textRow('Name', data.name, v => { data.name = v; onRename(v); });
    nameInp.style.fontFamily = 'Rajdhani, sans-serif';

    this.section('ROTATION');
    this.selectRow('Mode', [
      { value: 'continuous', label: 'Continuous' },
      { value: 'oscillate',  label: 'Oscillate' },
    ], data.mode, v => { data.mode = v as RotationData['mode']; this.showRotation(data, onUpdate, onRename, bridgeNames); });

    this.numRow('Speed (°/s)', data.speed, 0, 720, 1, v => { data.speed = v; });

    const dirBtn = this.toggleRow(
      data.direction === 1 ? '↺ CCW' : '↻ CW',
      data.direction === 1,
      v => { data.direction = v ? 1 : -1; dirBtn.textContent = v ? '↺ CCW' : '↻ CW'; },
    );

    this.toggleRow('Enabled', data.enabled, v => { data.enabled = v; });

    this.section('PIVOT');
    this.numRow('Pivot X (cm)', data.pivotX, -500, 500, 0.5, v => { data.pivotX = v; onUpdate(); });
    this.numRow('Pivot Y (cm)', data.pivotY,  -10, 500, 0.5, v => { data.pivotY = v; onUpdate(); });
    this.numRow('Pivot Z (cm)', data.pivotZ, -500, 500, 0.5, v => { data.pivotZ = v; onUpdate(); });

    if (data.mode === 'oscillate') {
      this.section('OSCILLATE');
      this.numRow('Amplitude (°)',   data.oscAmplitude, 0,   360,  1,   v => { data.oscAmplitude = v; });
      this.numRow('Frequency (Hz)',  data.oscFrequency, 0.1, 10,   0.1, v => { data.oscFrequency = v; });
      this.numRow('Phase (°)',       data.oscPhase * 180 / Math.PI, 0, 360, 1, v => { data.oscPhase = v * Math.PI / 180; });
    }

    if (bridgeNames && bridgeNames.size > 0) {
      this.section('BRIDGE SNAP RULES');
      for (const rule of data.snapRules) {
        const row = document.createElement('div');
        row.className = 'prop-row';
        const bname = bridgeNames.get(rule.bridgeId) ?? rule.bridgeId;
        row.innerHTML = `<span class="prop-label" style="font-size:0.75em">${bname}</span>`;
        const remBtn = document.createElement('button');
        remBtn.className = 'game-btn'; remBtn.textContent = '×';
        remBtn.style.cssText = 'padding:0 0.3em;font-size:0.8em;';
        remBtn.addEventListener('click', () => {
          data.snapRules = data.snapRules.filter(r => r.id !== rule.id);
          this.showRotation(data, onUpdate, onRename, bridgeNames);
        });
        this.content.appendChild(row);
        this.numRow(`  Min°`, rule.minDeg, 0, 360, 1, v => { rule.minDeg = v; });
        this.numRow(`  Max°`, rule.maxDeg, 0, 360, 1, v => { rule.maxDeg = v; });
        this.content.appendChild(remBtn);
      }
      if (bridgeNames.size > 0) {
        const addBtn = this.buttonRow('Add Snap Rule', '+ Rule', () => {
          const [[firstId]] = bridgeNames.entries();
          const newRule: BridgeSnapRule = {
            id: `sr-${Date.now()}`, bridgeId: firstId, minDeg: 0, maxDeg: 90,
          };
          data.snapRules.push(newRule);
          this.showRotation(data, onUpdate, onRename, bridgeNames);
        });
        void addBtn;
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     FOOTING PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showFooting(
    data: BaseFootingData,
    baseHeight: number,
    onGeomChange: () => void,
    onFullChange: () => void,
    onRename: (name: string) => void,
    onStlImport?: (cb: (b64: string) => void) => void,
    onStlClear?: () => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = data.name;
    nameInp.addEventListener('input', () => { data.name = nameInp.value; onRename(data.name); });
    this.content.appendChild(nameInp);

    this.section('SHAPE');
    this.selectRow('Shape', [
      { value: 'cube',     label: '⬛ Cube' },
      { value: 'cuboid',   label: '▬ Cuboid' },
      { value: 'sphere',   label: '● Sphere' },
      { value: 'cylinder', label: '⬭ Cylinder' },
      { value: 'pyramid',  label: '△ Pyramid' },
      { value: 'frustum',  label: '⬡ Frustum' },
    ], data.shape, s => {
      data.shape = s as ObstacleShape; onFullChange();
    });

    this.section('DIMENSIONS');
    this._footingDimRows(data, onGeomChange);

    this.section('POSITION');
    this.numRow('X (cm)',   data.basePosX, -APOTHEM, APOTHEM, 1, v => { data.basePosX = v; onGeomChange(); });
    this.numRow('Z (cm)',   data.basePosZ, -APOTHEM, APOTHEM, 1, v => { data.basePosZ = v; onGeomChange(); });
    this.numRow('Y lift (cm)', data.posY,  0, 200, 1, v => { data.posY = v; onGeomChange(); });
    this.numRow('Rot Y°',   data.baseRotY, -180, 180, 1, v => { data.baseRotY = v; onGeomChange(); });

    void baseHeight;

    this.section('SURFACE');
    this.colorRow('Color', data.color, v => { data.color = v; onGeomChange(); });
    this.surfaceRow(data, onFullChange);
    this.numRow('Tile Scale', data.tileScale, 0.1, 20, 0.1, v => { data.tileScale = v; onGeomChange(); });

    this.section('GLOW');
    this.colorRow('Glow Color', data.emissiveColor, v => { data.emissiveColor = v; onGeomChange(); });
    this.numRow('Glow Intensity', data.emissiveIntensity, 0, 3, 0.1, v => { data.emissiveIntensity = v; onGeomChange(); });

    this.section('OPACITY');
    this.numRow('Opacity', data.opacity, 0, 1, 0.05, v => { data.opacity = v; onGeomChange(); });

    this.themeRow(theme => {
      data.color = theme.color; data.surface = theme.surface;
      data.emissiveColor = theme.emissiveColor; data.emissiveIntensity = theme.emissiveIntensity;
      data.tileScale = theme.tileScale;
      onFullChange();
    });

    this.section('PRESENTATION STL');
    this.buttonRow('', data.presentStlb64 ? '✓ Replace STL…' : 'Import STL…', () => {
      onStlImport?.((b64) => { data.presentStlb64 = b64; onGeomChange(); });
    });
    if (data.presentStlb64) {
      this.colorRow('Present Color', data.presentColor, v => { data.presentColor = v; onGeomChange(); });
      this.buttonRow('', 'Clear STL', () => { data.presentStlb64 = null; onStlClear?.(); onGeomChange(); });
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     PRESENTATION PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showPresentation(
    data: PresentConfig,
    onChange: () => void,
    onStlImport?: (cb: (b64: string) => void) => void,
    onStlClear?: () => void,
  ): void {
    this.content.innerHTML = '';

    this.section('STL MODEL');
    this.buttonRow('', data.stlb64 ? '✓ Replace STL…' : 'Import STL…', () => {
      onStlImport?.((b64) => { data.stlb64 = b64; onChange(); });
    });
    if (data.stlb64) {
      this.buttonRow('', 'Clear STL', () => { data.stlb64 = null; onStlClear?.(); onChange(); });
    }

    this.section('APPEARANCE');
    this.colorRow('Tint Color', data.color, v => { data.color = v; onChange(); });

    this.section('SCALE');
    this.numRow('Scale X', data.scaleX, 0.01, 10, 0.01, v => { data.scaleX = v; onChange(); });
    this.numRow('Scale Y', data.scaleY, 0.01, 10, 0.01, v => { data.scaleY = v; onChange(); });
    this.numRow('Scale Z', data.scaleZ, 0.01, 10, 0.01, v => { data.scaleZ = v; onChange(); });

    this.section('ROTATION (°)');
    this.numRow('Rot X', data.rotX, -180, 180, 1, v => { data.rotX = v; onChange(); });
    this.numRow('Rot Y', data.rotY, -180, 180, 1, v => { data.rotY = v; onChange(); });
    this.numRow('Rot Z', data.rotZ, -180, 180, 1, v => { data.rotZ = v; onChange(); });

    this.section('OFFSET (cm)');
    this.numRow('Off X', data.offX, -200, 200, 0.5, v => { data.offX = v; onChange(); });
    this.numRow('Off Y', data.offY, -200, 200, 0.5, v => { data.offY = v; onChange(); });
    this.numRow('Off Z', data.offZ, -200, 200, 0.5, v => { data.offZ = v; onChange(); });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     PARTICLE EFFECT PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showParticle(
    data: ParticleConfig,
    onChange: () => void,
    showGlow?: boolean,
  ): void {
    this.content.innerHTML = '';

    this.section('PRESET');
    const PRESETS: ParticlePreset[] = [
      'none','embers','snow','sparks','dust','bubbles','void_motes',
      'rain','fog','ash','leaves','fireflies','steam',
    ];
    const grid = document.createElement('div'); grid.className = 'prop-shape-grid';
    for (const p of PRESETS) {
      const btn = document.createElement('button');
      btn.className = 'prop-shape-btn' + (data.preset === p ? ' active' : '');
      btn.textContent = p === 'none' ? '⊘ None' : p;
      btn.addEventListener('click', () => { data.preset = p; onChange(); });
      grid.appendChild(btn);
    }
    this.content.appendChild(grid);

    this.section('MODE');
    const modeRow = document.createElement('div'); modeRow.className = 'prop-profile-row';
    for (const [m, lbl] of [['surface','Surface'],['volume','Volume']] as ['surface'|'volume', string][]) {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (data.mode === m ? ' active' : '');
      btn.textContent = lbl;
      btn.addEventListener('click', () => { data.mode = m; onChange(); });
      modeRow.appendChild(btn);
    }
    this.content.appendChild(modeRow);

    this.section('DENSITY');
    this.numRow('ppcm² / ppcm³', data.density, 0.01, 10, 0.01, v => { data.density = v; onChange(); });

    if (showGlow) {
      this.section('GLOW (Speed Line)');
      this.toggleRow('Glow on Entry', data.glowOnActivation, v => { data.glowOnActivation = v; onChange(); });
      if (data.glowOnActivation) {
        this.colorRow('Glow Color', data.glowColor, v => { data.glowColor = v; onChange(); });
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     WEATHER PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showWeather(
    data: {
      weatherPreset: WeatherPreset; windEnabled: boolean; windDirectionDeg: number;
      windStrengthCms: number; windGustInterval: number; windGustMult: number;
    },
    onChange: () => void,
  ): void {
    this.content.innerHTML = '';

    this.section('WEATHER PRESET');
    const PRESETS: WeatherPreset[] = ['none','rain','snow','fog','sandstorm','ash','mist'];
    const grid = document.createElement('div'); grid.className = 'prop-shape-grid';
    for (const p of PRESETS) {
      const btn = document.createElement('button');
      btn.className = 'prop-shape-btn' + (data.weatherPreset === p ? ' active' : '');
      btn.textContent = p === 'none' ? '⊘ None' : p;
      btn.addEventListener('click', () => { data.weatherPreset = p; onChange(); });
      grid.appendChild(btn);
    }
    this.content.appendChild(grid);

    this.section('WIND');
    this.toggleRow('Enable Wind', data.windEnabled, v => { data.windEnabled = v; onChange(); });
    if (data.windEnabled) {
      this.numRow('Direction °', data.windDirectionDeg, 0, 360, 1,  v => { data.windDirectionDeg = v; onChange(); });
      this.numRow('Strength cm/s²', data.windStrengthCms, 0, 200, 1, v => { data.windStrengthCms = v; onChange(); });
      this.section('GUSTS');
      this.numRow('Interval (s)', data.windGustInterval, 1, 30, 0.5, v => { data.windGustInterval = v; onChange(); });
      this.numRow('Multiplier',   data.windGustMult,     1, 10, 0.1, v => { data.windGustMult    = v; onChange(); });
    }
  }

  private _footingDimRows(data: BaseFootingData, onGeomChange: () => void): void {
    switch (data.shape) {
      case 'cube':
        this.numRow('Side (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => {
          data.dimX = data.dimY = data.dimZ = v; onGeomChange();
        });
        break;
      case 'cuboid':
        this.numRow('Width  (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimX = v; onGeomChange(); });
        this.numRow('Height (cm)', data.dimY, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimY = v; onGeomChange(); });
        this.numRow('Depth  (cm)', data.dimZ, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimZ = v; onGeomChange(); });
        break;
      case 'sphere':
        this.numRow('Diameter (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimX = v; onGeomChange(); });
        break;
      case 'cylinder':
        this.numRow('Diameter (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimX = v; onGeomChange(); });
        this.numRow('Height   (cm)', data.dimY, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimY = v; onGeomChange(); });
        break;
      case 'pyramid':
        this.numRow('Base W (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimX = v; onGeomChange(); });
        this.numRow('Base D (cm)', data.dimZ, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimZ = v; onGeomChange(); });
        this.numRow('Height (cm)', data.dimY, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimY = v; onGeomChange(); });
        break;
      case 'frustum':
        this.numRow('Bottom D (cm)', data.dimX, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimX = v; onGeomChange(); });
        this.numRow('Top D    (cm)', data.dimZ, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimZ = v; onGeomChange(); });
        this.numRow('Height   (cm)', data.dimY, MIN_OBSTACLE_DIM, 500, 1, v => { data.dimY = v; onGeomChange(); });
        break;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     JUMP LINK PANEL
  ═══════════════════════════════════════════════════════════════════════ */

  showJumpLink(
    data:          JumpLinkData,
    arenaNames:    Map<string, string>,
    obstacleNames: Map<string, string>,
    trapNames:     Map<string, string>,
    speedLineNames:Map<string, string>,
    onGeomChange:  () => void,
    onFullChange:  () => void,
    onRename:      (name: string) => void,
  ): void {
    this.content.innerHTML = '';

    const refresh = () => this.showJumpLink(data, arenaNames, obstacleNames, trapNames,
      speedLineNames, onGeomChange, onFullChange, onRename);

    this.section('NAME');
    this.textRow('Name', data.name, v => { data.name = v; onRename(v); });

    const _endpointSection = (
      label: string,
      ep: JumpLinkEndpoint,
      onChange: () => void,
    ) => {
      this.section(label);
      this.selectRow('Mode', [
        { value: 'parent_surface', label: 'Parent Surface (local XZ)' },
        { value: 'world_point',    label: 'World Coordinates' },
        { value: 'speed_line_end', label: 'Speed Line Endpoint' },
      ], ep.mode, v => { ep.mode = v as JumpEndpointMode; onChange(); refresh(); });

      if (ep.mode === 'parent_surface') {
        this.selectRow('Parent Type', [
          { value: 'arena',    label: 'Arena' },
          { value: 'obstacle', label: 'Obstacle' },
          { value: 'trap',     label: 'Trap' },
          { value: 'base',     label: 'Octagon Base' },
        ], ep.parentType, v => { ep.parentType = v as JumpLinkParentType; onChange(); refresh(); });
        const parentMap: Map<string, string> =
          ep.parentType === 'arena' ? arenaNames :
          ep.parentType === 'obstacle' ? obstacleNames :
          ep.parentType === 'trap' ? trapNames : new Map([['octagon-base', 'Octagon Base']]);
        const opts = [...parentMap.entries()].map(([id, name]) => ({ value: id, label: name }));
        if (opts.length) {
          this.selectRow('Parent', opts, ep.parentId, v => { ep.parentId = v; onChange(); });
        }
        this.numRow('Local X cm', ep.localX, -500, 500, 0.5, v => { ep.localX = v; onChange(); });
        this.numRow('Local Z cm', ep.localZ, -500, 500, 0.5, v => { ep.localZ = v; onChange(); });
      } else if (ep.mode === 'world_point') {
        this.numRow('World X cm', ep.worldX, -500, 500, 0.5, v => { ep.worldX = v; onChange(); });
        this.numRow('World Y cm', ep.worldY, 0,    500, 0.5, v => { ep.worldY = v; onChange(); });
        this.numRow('World Z cm', ep.worldZ, -500, 500, 0.5, v => { ep.worldZ = v; onChange(); });
      } else {
        const slOpts = [...speedLineNames.entries()].map(([id, name]) => ({ value: id, label: name }));
        if (slOpts.length) {
          this.selectRow('Speed Line', slOpts, ep.speedLineId ?? slOpts[0].value, v => { ep.speedLineId = v; onChange(); });
        }
        this.selectRow('At', [
          { value: 'start', label: 'Start of speed line' },
          { value: 'end',   label: 'End of speed line' },
        ], ep.atStart ? 'start' : 'end', v => { ep.atStart = v === 'start'; onChange(); });
      }
    };

    _endpointSection('SOURCE', data.src, onGeomChange);
    _endpointSection('DESTINATION', data.dst, onGeomChange);

    this.section('CONNECTION');
    this.toggleRow('Bidirectional', data.isBidirectional, v => { data.isBidirectional = v; onGeomChange(); });

    this.section('TRIGGER');
    this.selectRow('Trigger', [
      { value: 'button',           label: 'Player button press' },
      { value: 'automatic',        label: 'Automatic (instant)' },
      { value: 'speed_line_exit',  label: 'Speed line exit' },
      { value: 'proximity',        label: 'Proximity' },
    ], data.trigger, v => { data.trigger = v as JumpLinkData['trigger']; onFullChange(); refresh(); });
    if (data.trigger === 'speed_line_exit') {
      const slOpts = [...speedLineNames.entries()].map(([id, name]) => ({ value: id, label: name }));
      if (slOpts.length) {
        this.selectRow('Trigger SL', slOpts, data.triggerSpeedLineId ?? slOpts[0].value, v => { data.triggerSpeedLineId = v; onGeomChange(); });
      }
    }
    if (data.trigger === 'proximity') {
      this.numRow('Proximity Radius cm', data.proximityRadius, 1, 100, 0.5, v => { data.proximityRadius = v; onGeomChange(); });
    }

    this.section('ARC SHAPE');
    this.selectRow('Arc Profile', [
      { value: 'parabolic', label: 'Parabolic (natural arc)' },
      { value: 'bezier',    label: 'Bezier (smooth)' },
      { value: 'instant',   label: 'Instant (teleport-like)' },
    ], data.arcProfile, v => { data.arcProfile = v as JumpArcProfile; onGeomChange(); });
    this.numRow('Arc Height cm', data.arcHeight, 0, 300, 1, v => { data.arcHeight = v; onGeomChange(); });

    const f = data.flight;
    this.section('LAUNCH PHYSICS');
    this.numRow('Arc Duration ms', f.arcDuration,    100, 5000, 50, v => { f.arcDuration    = v; });
    this.numRow('Launch Angle °',  f.launchAngleDeg, 0,   90,   1,  v => { f.launchAngleDeg = v; });
    this.numRow('Launch Force cm/s', f.launchForce,  10,  1000, 10, v => { f.launchForce    = v; });
    this.numRow('Gravity Scale',   f.gravityScale,   0,   5,    0.1, v => { f.gravityScale   = v; });
    this.numRow('Air Drag',        f.airDrag,        0,   1,    0.01, v => { f.airDrag       = v; });

    this.section('LANDING');
    this.numRow('Impact',  f.landingImpact,  0, 1, 0.05, v => { f.landingImpact  = v; });
    this.numRow('Bounce',  f.landingBounce,  0, 1, 0.05, v => { f.landingBounce  = v; });

    this.section('IN-FLIGHT SPIN');
    this.numRow('Spin Rate ×',    f.spinRateMult,  0.1, 3, 0.05, v => { f.spinRateMult  = v; });
    this.numRow('Spin Delta RPM', f.spinDeltaRPM, -2000, 2000, 50, v => { f.spinDeltaRPM = v; });

    this.section('IN-FLIGHT STATS');
    const sm = f.statModifiers;
    this.numRow('Spin Rate ×',     sm.spinRateMult,    0.1, 3, 0.05, v => { sm.spinRateMult    = v; });
    this.numRow('Stamina ×',       sm.staminaMult,     0.1, 3, 0.05, v => { sm.staminaMult     = v; });
    this.numRow('Attack ×',        sm.attackMult,      0.1, 3, 0.05, v => { sm.attackMult      = v; });
    this.numRow('Defense ×',       sm.defenseMult,     0.1, 3, 0.05, v => { sm.defenseMult     = v; });
    this.numRow('Weight ×',        sm.weightMult,      0.1, 3, 0.05, v => { sm.weightMult      = v; });
    this.numRow('Burst Resist ×',  sm.burstResistMult, 0.1, 3, 0.05, v => { sm.burstResistMult = v; });

    this.section('VISUAL TRAIL');
    this.toggleRow('Trail Enabled', f.trailEnabled, v => { f.trailEnabled = v; onFullChange(); refresh(); });
    if (f.trailEnabled) {
      this.colorRow('Trail Color', f.trailColor ?? data.color, v => { f.trailColor = v; onGeomChange(); });
      this.numRow('Trail Width cm', f.trailWidth, 0.1, 20, 0.1, v => { f.trailWidth = v; });
      this.numRow('Trail Fade', f.trailFade, 0, 1, 0.05, v => { f.trailFade = v; });
    }

    this.section('FLASH');
    this.toggleRow('Launch Flash', f.launchFlash, v => { f.launchFlash = v; });
    this.toggleRow('Land Flash',   f.landFlash,   v => { f.landFlash   = v; });
    this.colorRow('Flash Color', f.flashColor, v => { f.flashColor = v; });

    this.section('APPEARANCE');
    this.colorRow('Color',      data.color,           v => { data.color      = v; onGeomChange(); });
    this.colorRow('Glow Color', data.glowColor ?? data.color, v => { data.glowColor = v; onGeomChange(); });
    this.numRow('Opacity',      data.opacity,          0.1, 1, 0.05, v => { data.opacity    = v; onGeomChange(); });
    this.numRow('Disc Radius cm', data.discRadius,     1,   40, 0.5,  v => { data.discRadius = v; onGeomChange(); });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // showEnvironment — arena-wide environment panel (🌍 sub-node)
  // ══════════════════════════════════════════════════════════════════════════
  showEnvironment(
    arena: ArenaData,
    cbs: {
      onPhysicsChange:      () => void;
      onTiltChange:         () => void;
      onFogChange:          () => void;
      onScoreChange:        () => void;
      onWeatherSurfaceChange: () => void;
      addEntry:    (e: EnvScheduleEntry) => void;
      removeEntry: (id: string) => void;
      updateEntry: (e: EnvScheduleEntry) => void;
    },
  ): void {
    this.content.innerHTML = '';

    // ── GRAVITY ───────────────────────────────────────────────────────────
    this.section('GRAVITY');
    this.numRow('Scale',      arena.gravityScale,      ENV.MIN_GRAVITY_SCALE, ENV.MAX_GRAVITY_SCALE, 0.05, v => { arena.gravityScale = v;      cbs.onPhysicsChange(); });
    this.numRow('Direction X', arena.gravityDirectionX, -1, 1, 0.01, v => { arena.gravityDirectionX = v; cbs.onPhysicsChange(); });
    this.numRow('Direction Z', arena.gravityDirectionZ, -1, 1, 0.01, v => { arena.gravityDirectionZ = v; cbs.onPhysicsChange(); });

    // ── ARENA TILT ────────────────────────────────────────────────────────
    this.section('ARENA TILT');
    this.numRow('Tilt X (°)',  arena.tiltX, -ENV.MAX_TILT, ENV.MAX_TILT, 1, v => { arena.tiltX = v; cbs.onTiltChange(); });
    this.numRow('Tilt Z (°)',  arena.tiltZ, -ENV.MAX_TILT, ENV.MAX_TILT, 1, v => { arena.tiltZ = v; cbs.onTiltChange(); });
    this.toggleRow('Weight-Based Tilt', arena.weightTiltEnabled, v => { arena.weightTiltEnabled = v; cbs.onTiltChange(); });
    if (arena.weightTiltEnabled) {
      this.numRow('Sensitivity', arena.weightTiltSensitivity, 0.1, 5, 0.1, v => { arena.weightTiltSensitivity = v; cbs.onTiltChange(); });
      this.numRow('Dampening',   arena.weightTiltDampening,   0,   1, 0.05, v => { arena.weightTiltDampening  = v; cbs.onTiltChange(); });
    }

    // ── ATMOSPHERE (FOG) ──────────────────────────────────────────────────
    this.section('ATMOSPHERE (FOG)');
    this.numRow('Fog Density', arena.fogDensity, 0, 1, 0.01, v => { arena.fogDensity = v; cbs.onFogChange(); });

    // ── SCORING ───────────────────────────────────────────────────────────
    this.section('SCORING');
    this.numRow('Score Multiplier', arena.scoreMultiplier, 0, 10, 0.1, v => { arena.scoreMultiplier = v; cbs.onScoreChange(); });
    this.numRow('Points / Second',  arena.pointsPerSecond, 0, 100, 1,  v => { arena.pointsPerSecond = v; cbs.onScoreChange(); });
    this.readRow('Live Score', Math.floor(arena._score).toString());

    // ── WEATHER → SURFACE MAP ─────────────────────────────────────────────
    this.section('WEATHER → SURFACE MAP');
    const WEATHER_PRESETS: Exclude<WeatherPreset, 'none'>[] = ['rain','snow','fog','sandstorm','ash','mist'];
    const SURFACE_OPTS: { value: string; label: string }[] = [
      { value: '', label: '— no change —' },
      ...(['plain','checker','grid','hex','stripes','dots','concrete','metal','wood','ice','sand','lava_rock'] as SurfaceType[])
        .map(s => ({ value: s, label: s })),
    ];
    for (const wp of WEATHER_PRESETS) {
      this.selectRow(wp, SURFACE_OPTS, arena.weatherSurfaceMap[wp] ?? '', v => {
        if (v === '') delete arena.weatherSurfaceMap[wp];
        else (arena.weatherSurfaceMap as Record<string, string>)[wp] = v;
        cbs.onWeatherSurfaceChange();
      });
    }

    // ── ENVIRONMENT SCHEDULE ──────────────────────────────────────────────
    this.section('ENVIRONMENT SCHEDULE');

    let expandedId: string | null = null;

    const renderSchedule = () => {
      // Remove old schedule DOM
      let el = this.content.querySelector('.env-schedule-list');
      if (el) el.remove();

      const list = document.createElement('div');
      list.className = 'env-schedule-list';

      for (const entry of arena.envSchedule) {
        const row = document.createElement('div');
        row.className = 'prop-row env-entry-row';
        row.style.cssText = 'flex-direction:column;align-items:stretch;padding:calc(2*var(--mm)) 0;';

        // ── Header row ────────────────────────────────────────────────────
        const hdr = document.createElement('div');
        hdr.style.cssText = 'display:flex;align-items:center;gap:calc(2*var(--mm));';

        const chk = document.createElement('input');
        chk.type = 'checkbox'; chk.checked = entry.enabled;
        chk.addEventListener('change', () => { entry.enabled = chk.checked; cbs.updateEntry(entry); });

        const lbl = document.createElement('span');
        lbl.textContent = entry.label || '(unnamed)';
        lbl.style.cssText = 'flex:1;font-size:0.75em;color:#dde8ff;cursor:pointer;';

        const badge = document.createElement('span');
        badge.textContent = entry.triggerType;
        badge.style.cssText = 'font-size:0.65em;padding:1px 4px;background:#00e5ff22;color:#00e5ff;border-radius:2px;';

        const del = document.createElement('button');
        del.textContent = '✕'; del.className = 'prop-btn';
        del.style.cssText = 'font-size:0.7em;padding:1px 4px;';
        del.addEventListener('click', (e) => {
          e.stopPropagation();
          cbs.removeEntry(entry.id);
          expandedId = null;
          renderSchedule();
        });

        hdr.appendChild(chk); hdr.appendChild(lbl); hdr.appendChild(badge); hdr.appendChild(del);
        hdr.addEventListener('click', () => {
          expandedId = expandedId === entry.id ? null : entry.id;
          renderSchedule();
        });
        row.appendChild(hdr);

        // ── Detail panel (when expanded) ──────────────────────────────────
        if (expandedId === entry.id) {
          const detail = document.createElement('div');
          detail.style.cssText = 'padding:calc(2*var(--mm)) calc(4*var(--mm));background:#0a0a1a;border-left:2px solid #00e5ff44;margin-top:calc(2*var(--mm));';

          const save = () => cbs.updateEntry({ ...entry });

          // Label
          const labelRow = document.createElement('div'); labelRow.className='prop-row';
          const labelLbl = document.createElement('span'); labelLbl.className='prop-row-label'; labelLbl.textContent='Label';
          const labelInp = document.createElement('input'); labelInp.type='text'; labelInp.className='prop-input'; labelInp.value=entry.label;
          labelInp.addEventListener('change', () => { entry.label = labelInp.value; lbl.textContent = entry.label || '(unnamed)'; save(); });
          labelRow.appendChild(labelLbl); labelRow.appendChild(labelInp); detail.appendChild(labelRow);

          // Trigger type
          const typeDiv = document.createElement('div'); typeDiv.className='prop-profile-row';
          const typeLbl = document.createElement('span'); typeLbl.className='prop-row-label'; typeLbl.textContent='Trigger';
          typeDiv.appendChild(typeLbl);
          for (const t of ['interval','once','event'] as EnvScheduleEntry['triggerType'][]) {
            const btn = document.createElement('button');
            btn.className = 'prop-profile-btn' + (entry.triggerType === t ? ' active' : '');
            btn.textContent = t;
            btn.addEventListener('click', () => { entry.triggerType = t; save(); renderSchedule(); expandedId = entry.id; });
            typeDiv.appendChild(btn);
          }
          detail.appendChild(typeDiv);

          const addNumDetail = (labelTxt: string, val: number, min: number, max: number, step: number, setter: (v: number) => void) => {
            const r = document.createElement('div'); r.className='prop-row';
            const l = document.createElement('span'); l.className='prop-row-label'; l.textContent=labelTxt;
            const inp = document.createElement('input'); inp.type='range';
            inp.min=String(min); inp.max=String(max); inp.step=String(step); inp.value=String(val);
            inp.style.flex='1';
            const disp = document.createElement('span'); disp.style.cssText='min-width:3em;text-align:right;font-size:0.8em;'; disp.textContent=String(val);
            inp.addEventListener('input', () => { disp.textContent = inp.value; });
            inp.addEventListener('change', () => { setter(parseFloat(inp.value)); save(); });
            r.appendChild(l); r.appendChild(inp); r.appendChild(disp); detail.appendChild(r);
          };

          if (entry.triggerType === 'interval') {
            addNumDetail('Interval (s)', entry.intervalSec, 0.5, 300, 0.5, v => { entry.intervalSec = v; });
            addNumDetail('Init Delay (s)', entry.delaySec, 0, 60, 0.5, v => { entry.delaySec = v; });
          } else if (entry.triggerType === 'once') {
            addNumDetail('Delay (s)', entry.delaySec, 0, 300, 0.5, v => { entry.delaySec = v; });
          } else {
            const evRow = document.createElement('div'); evRow.className='prop-row';
            const evLbl = document.createElement('span'); evLbl.className='prop-row-label'; evLbl.textContent='Event Name';
            const evInp = document.createElement('input'); evInp.type='text'; evInp.className='prop-input'; evInp.value=entry.eventName;
            evInp.addEventListener('change', () => { entry.eventName = evInp.value; save(); });
            evRow.appendChild(evLbl); evRow.appendChild(evInp); detail.appendChild(evRow);
          }

          addNumDetail('Revert After (s)', entry.revertSec, 0, 300, 0.5, v => { entry.revertSec = v; });

          // Sound event
          const snRow = document.createElement('div'); snRow.className='prop-row';
          const snLbl = document.createElement('span'); snLbl.className='prop-row-label'; snLbl.textContent='Sound Event';
          const snInp = document.createElement('input'); snInp.type='text'; snInp.className='prop-input'; snInp.value=entry.soundEvent;
          snInp.addEventListener('change', () => { entry.soundEvent = snInp.value; save(); });
          snRow.appendChild(snLbl); snRow.appendChild(snInp); detail.appendChild(snRow);

          // Keyframes
          const kfTitle = document.createElement('div');
          kfTitle.style.cssText='font-size:0.7em;color:#00e5ff;margin-top:calc(2*var(--mm));margin-bottom:calc(1*var(--mm));';
          kfTitle.textContent = 'KEYFRAMES';
          detail.appendChild(kfTitle);

          const ENV_PROPS: EnvProperty[] = [
            'gravityScale','gravityDirectionX','gravityDirectionZ',
            'tiltX','tiltZ','fogDensity',
            'weatherPreset','windEnabled','windDirectionDeg','windStrengthCms','windGustInterval','windGustMult',
            'scoreMultiplier','pointsPerSecond',
          ];

          const renderKeyframes = () => {
            let kfList = detail.querySelector('.kf-list');
            if (kfList) kfList.remove();
            const kl = document.createElement('div'); kl.className='kf-list';
            for (let ki = 0; ki < entry.keyframes.length; ki++) {
              const kf = entry.keyframes[ki];
              const krow = document.createElement('div');
              krow.style.cssText='display:flex;gap:calc(2*var(--mm));align-items:center;margin-bottom:calc(1*var(--mm));';

              const pSel = document.createElement('select'); pSel.style.cssText='flex:1;background:#111;color:#dde8ff;border:1px solid #333;font-size:0.75em;';
              for (const p of ENV_PROPS) {
                const opt = document.createElement('option'); opt.value=p; opt.textContent=p;
                if (p === kf.property) opt.selected=true;
                pSel.appendChild(opt);
              }
              pSel.addEventListener('change', () => { kf.property = pSel.value as EnvProperty; save(); });

              const vInp = document.createElement('input'); vInp.type='text'; vInp.style.cssText='width:5em;background:#111;color:#dde8ff;border:1px solid #333;font-size:0.75em;';
              vInp.value = String(kf.value);
              vInp.addEventListener('change', () => {
                const raw = vInp.value;
                kf.value = raw === 'true' ? true : raw === 'false' ? false : isNaN(Number(raw)) ? raw : Number(raw);
                save();
              });

              const kdel = document.createElement('button'); kdel.textContent='✕'; kdel.className='prop-btn';
              kdel.style.fontSize='0.65em';
              kdel.addEventListener('click', () => { entry.keyframes.splice(ki, 1); save(); renderKeyframes(); });

              krow.appendChild(pSel); krow.appendChild(vInp); krow.appendChild(kdel);
              kl.appendChild(krow);
            }
            // Add keyframe button
            const addKf = document.createElement('button'); addKf.textContent='＋ Add Keyframe'; addKf.className='prop-btn';
            addKf.style.cssText='font-size:0.7em;margin-top:calc(1*var(--mm));';
            addKf.addEventListener('click', () => {
              entry.keyframes.push({ property: 'gravityScale', value: 1 } as EnvKeyframe);
              save(); renderKeyframes();
            });
            kl.appendChild(addKf);
            detail.appendChild(kl);
          };
          renderKeyframes();

          row.appendChild(detail);
        }

        list.appendChild(row);
      }

      // Add Entry button
      const addBtn = document.createElement('button');
      addBtn.textContent = '＋ Add Entry'; addBtn.className = 'prop-btn';
      addBtn.style.cssText = 'margin-top:calc(2*var(--mm));width:100%;';
      addBtn.addEventListener('click', () => {
        const newEntry: EnvScheduleEntry = {
          id: `env-entry-${Date.now().toString(36)}`,
          label: 'New Entry',
          triggerType: 'interval',
          intervalSec: ENV.DEFAULT_INTERVAL_SEC,
          delaySec: 0,
          eventName: '',
          keyframes: [],
          revertSec: ENV.DEFAULT_REVERT_SEC,
          soundEvent: '',
          enabled: true,
        };
        cbs.addEntry(newEntry);
        expandedId = newEntry.id;
        renderSchedule();
      });
      list.appendChild(addBtn);

      this.content.appendChild(list);
    };

    renderSchedule();
  }

}

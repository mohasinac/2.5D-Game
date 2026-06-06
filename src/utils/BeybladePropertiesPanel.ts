import { AbstractPropertiesPanel } from './AbstractPropertiesPanel';
import { AxisData, PartData, SectorData, GroupData, BeyMaterial } from '../types/beybladeTypes';
import { PresentConfig, ParticleConfig, ParticlePreset } from '../types/sharedTypes';

const MATERIALS: { value: BeyMaterial; label: string }[] = [
  { value: 'plastic', label: 'Plastic' },
  { value: 'metal',   label: 'Metal' },
  { value: 'rubber',  label: 'Rubber' },
  { value: 'resin',   label: 'Resin' },
  { value: 'custom',  label: 'Custom' },
];

export class BeybladePropertiesPanel extends AbstractPropertiesPanel {

  // ── Axis ──────────────────────────────────────────────────────────────────

  showAxis(
    axis: AxisData,
    onChange: (changes: Partial<AxisData>) => void,
  ): void {
    this.content.innerHTML = '';
    this.section('SPIN AXIS');
    this.numRow('Tilt angle °', axis.tiltAngle, 0, 45, 0.5, v => onChange({ tiltAngle: v }));
    this.numRow('Pivot offset cm', axis.pivotOffset, 0, 20, 0.1, v => onChange({ pivotOffset: v }));

    this.section('SPIN DIRECTION');
    const dirRow = document.createElement('div');
    dirRow.className = 'prop-profile-row';
    for (const dir of ['left', 'right'] as const) {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (axis.spinDir === dir ? ' active' : '');
      btn.textContent = dir === 'left' ? '◀ Left' : 'Right ▶';
      btn.addEventListener('click', () => {
        dirRow.querySelectorAll('.prop-profile-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        onChange({ spinDir: dir });
      });
      dirRow.appendChild(btn);
    }
    this.content.appendChild(dirRow);
  }

  // ── Part ──────────────────────────────────────────────────────────────────

  showPart(
    part: PartData,
    onChange: (changes: Partial<PartData>) => void,
    onCut: (count: number) => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    this.textRow('Name', part.name, v => onChange({ name: v }));

    this.section('TYPE');
    const typeRow = document.createElement('div');
    typeRow.className = 'prop-profile-row';
    for (const [isHollow, label] of [[false, '⬡ Solid'], [true, '◯ Pipe']] as const) {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (part.isHollow === isHollow ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        typeRow.querySelectorAll('.prop-profile-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        onChange({ isHollow });
      });
      typeRow.appendChild(btn);
    }
    this.content.appendChild(typeRow);

    this.toggleRow('Free Spin', part.freeSpin, v => onChange({ freeSpin: v }));

    this.section('POSITION');
    this.numRow('Y offset cm', part.axisOffsetY, -10, 30, 0.1, v => onChange({ axisOffsetY: v }));

    this.section('DIMENSIONS');
    this.numRow('Height cm',   part.height,       0.1, 10, 0.1, v => onChange({ height: v }));
    this.numRow('Top Rx cm',   part.topRadiusX,   0.1, 10, 0.1, v => onChange({ topRadiusX: v }));
    this.numRow('Top Rz cm',   part.topRadiusZ,   0.1, 10, 0.1, v => onChange({ topRadiusZ: v }));
    this.numRow('Bot Rx cm',   part.bottomRadiusX, 0.1, 10, 0.1, v => onChange({ bottomRadiusX: v }));
    this.numRow('Bot Rz cm',   part.bottomRadiusZ, 0.1, 10, 0.1, v => onChange({ bottomRadiusZ: v }));

    if (part.isHollow) {
      this.section('INNER DIMENSIONS');
      this.numRow('Top iRx cm', part.innerTopRadiusX,    0.05, 9, 0.05, v => onChange({ innerTopRadiusX: v }));
      this.numRow('Top iRz cm', part.innerTopRadiusZ,    0.05, 9, 0.05, v => onChange({ innerTopRadiusZ: v }));
      this.numRow('Bot iRx cm', part.innerBottomRadiusX, 0.05, 9, 0.05, v => onChange({ innerBottomRadiusX: v }));
      this.numRow('Bot iRz cm', part.innerBottomRadiusZ, 0.05, 9, 0.05, v => onChange({ innerBottomRadiusZ: v }));
    }

    this.section('MATERIAL');
    this.selectRow('Material', MATERIALS, part.material, v => onChange({ material: v as BeyMaterial }));
    this.numRow('Weight g', part.weight, 0.01, 200, 0.01, v => onChange({ weight: v }));
    this.colorRow('Color', part.color, v => onChange({ color: v }));

    this.section('SECTORS');
    if (part.sectorIds.length === 0) {
      this.buttonRow('Cut part', 'Cut into sectors…', () => {
        const raw = prompt('Number of sectors (2–12):', '3');
        const n = parseInt(raw ?? '3', 10);
        if (isNaN(n) || n < 2) return;
        onCut(Math.min(12, n));
      });
    } else {
      this.readRow('Sectors', String(part.sectorIds.length));
    }

  }

  // ── Presentation sub-node ─────────────────────────────────────────────────

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
    this.numRow('Off X', data.offX, -50, 50, 0.1, v => { data.offX = v; onChange(); });
    this.numRow('Off Y', data.offY, -50, 50, 0.1, v => { data.offY = v; onChange(); });
    this.numRow('Off Z', data.offZ, -50, 50, 0.1, v => { data.offZ = v; onChange(); });
  }

  // ── Particle sub-node ─────────────────────────────────────────────────────

  showParticle(
    data: ParticleConfig,
    onChange: () => void,
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
  }

  // ── Sector ────────────────────────────────────────────────────────────────

  showSector(
    sector: SectorData,
    parent: PartData,
    onChange: (changes: Partial<SectorData>) => void,
  ): void {
    this.content.innerHTML = '';

    this.section('NAME');
    this.textRow('Name', sector.name, v => onChange({ name: v }));

    this.section('ARC');
    this.numRow('Start angle °', sector.startAngle, 0,   360, 1, v => onChange({ startAngle: v }));
    this.numRow('End angle °',   sector.endAngle,   0,   360, 1, v => onChange({ endAngle: v }));

    this.section('DIMENSIONS');
    this.numRow('Height cm',  sector.height,       0.1, 10, 0.1, v => onChange({ height: v }));
    this.numRow('Top Rx cm',  sector.topRadiusX,   0.1, 10, 0.1, v => onChange({ topRadiusX: v }));
    this.numRow('Top Rz cm',  sector.topRadiusZ,   0.1, 10, 0.1, v => onChange({ topRadiusZ: v }));
    this.numRow('Bot Rx cm',  sector.bottomRadiusX, 0.1, 10, 0.1, v => onChange({ bottomRadiusX: v }));
    this.numRow('Bot Rz cm',  sector.bottomRadiusZ, 0.1, 10, 0.1, v => onChange({ bottomRadiusZ: v }));

    if (sector.isHollow) {
      this.section('INNER DIMENSIONS');
      this.numRow('Top iRx cm', sector.innerTopRadiusX,    0.05, 9, 0.05, v => onChange({ innerTopRadiusX: v }));
      this.numRow('Top iRz cm', sector.innerTopRadiusZ,    0.05, 9, 0.05, v => onChange({ innerTopRadiusZ: v }));
      this.numRow('Bot iRx cm', sector.innerBottomRadiusX, 0.05, 9, 0.05, v => onChange({ innerBottomRadiusX: v }));
      this.numRow('Bot iRz cm', sector.innerBottomRadiusZ, 0.05, 9, 0.05, v => onChange({ innerBottomRadiusZ: v }));
    }

    this.section('MATERIAL');
    this.selectRow('Material', MATERIALS, sector.material, v => onChange({ material: v as BeyMaterial }));
    this.colorRow('Color', sector.color, v => onChange({ color: v }));

    // Weight row with total constraint indicator
    this.section('WEIGHT');
    const siblings = parent.sectorIds.map(() => 0); // placeholder; real check done below
    const weightRow = document.createElement('div');
    weightRow.className = 'prop-row';
    const wLbl = document.createElement('span'); wLbl.className = 'prop-label'; wLbl.textContent = 'Weight g';
    const wInp = document.createElement('input');
    wInp.type = 'number'; wInp.className = 'prop-input';
    wInp.value = String(sector.weight); wInp.min = '0.001'; wInp.max = '200'; wInp.step = '0.001';
    const wHint = document.createElement('span');
    wHint.className = 'prop-weight-hint';
    wHint.textContent = `/ ${parent.weight.toFixed(3)} g total`;
    wInp.addEventListener('input', () => {
      onChange({ weight: parseFloat(wInp.value) || 0 });
    });
    weightRow.appendChild(wLbl); weightRow.appendChild(wInp); weightRow.appendChild(wHint);
    this.content.appendChild(weightRow);
    void siblings; // suppress warning
  }

  // ── Group ─────────────────────────────────────────────────────────────────

  showGroup(group: GroupData, onRename: (name: string) => void): void {
    this.content.innerHTML = '';
    this.section('GROUP');
    this.textRow('Name', group.name, onRename);
    this.readRow('Children', String(group.childIds.length));
  }
}

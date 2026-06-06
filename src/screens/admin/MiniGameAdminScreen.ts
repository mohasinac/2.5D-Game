import { svgAssetStore } from '../../rpg/stores/SVGAssetStore.ts';
import { saveAllRPGAssets } from '../../utils/rpgPersistence.ts';
import type { PipePuzzleLevel, PipeTile, PipeTileType, PlatformLevel, PlatformTile } from '../../types/rpgTypes.ts';

type Tab = 'pipe' | 'platform';

const PIPE_TYPES: PipeTileType[] = ['empty', 'straight', 'elbow', 'tee', 'cross', 'source', 'sink'];
const PIPE_COLORS: Record<string, string> = {
  empty: '#111122', straight: '#1a4a6a', elbow: '#1a6a7a', tee: '#1a6aaa',
  cross: '#2288bb', source: '#00e5ff', sink: '#ff6b35',
};
const PIPE_SYMBOLS: Record<string, string> = {
  empty: '', straight: '━', elbow: '┗', tee: '┣', cross: '╋', source: '●', sink: '◎',
};
const PLAT_COLORS: Record<string, string> = { solid: '#3a5a8a', spring: '#22aa44', spike: '#cc2222', crumble: '#aa8822', moving: '#8844aa' };

export class MiniGameAdminScreen {
  private el: HTMLElement;
  private tab: Tab = 'pipe';
  private selectedPipe: PipePuzzleLevel | null = null;
  private selectedPlat: PlatformLevel | null = null;
  private activePipeType: PipeTileType = 'straight';
  private activePlatType: PlatformTile['type'] = 'solid';
  private paintMode: 'tile' | 'erase' = 'tile';
  private painting = false;
  private pipeListEl!: HTMLElement;
  private platListEl!: HTMLElement;
  private pipeCanvasEl!: HTMLCanvasElement;
  private platCanvasEl!: HTMLCanvasElement;
  private pipePropEl!: HTMLElement;
  private platPropEl!: HTMLElement;

  constructor(container: HTMLElement, private opts: { onBack: () => void }) {
    this.el = document.createElement('div');
    this.el.className = 'screen admin-screen hidden';
    this.el.innerHTML = `
      <div style="display:flex;flex-direction:column;height:100%;overflow:hidden;">
        <div class="admin-toolbar" style="padding:8px;gap:8px;">
          <button class="admin-tab-btn active" data-tab="pipe">⚙ Pipe Puzzle</button>
          <button class="admin-tab-btn" data-tab="platform">▶ Platform</button>
        </div>

        <!-- PIPE TAB -->
        <div id="tab-pipe" class="admin-tab-content">
          <div class="admin-layout" style="flex:1;overflow:hidden;">
            <aside class="admin-tree">
              <div class="admin-tree-header"><span>PIPE LEVELS</span><button class="admin-add-btn" id="add-pipe">+ Add</button></div>
              <div class="admin-tree-list" id="pipe-list"></div>
            </aside>
            <main class="admin-center" style="flex-direction:column;gap:8px;">
              <div class="admin-toolbar" style="gap:4px;flex-wrap:wrap;">
                ${PIPE_TYPES.map(t => `<button class="admin-pipe-type" data-pt="${t}" style="background:${PIPE_COLORS[t]};min-width:36px;border:1px solid rgba(255,255,255,0.2);font-family:monospace;">${PIPE_SYMBOLS[t] || '□'}</button>`).join('')}
                <button class="admin-pipe-type" data-pt="__erase__" style="background:#441122;border:1px solid rgba(255,255,255,0.2);">⌫</button>
              </div>
              <canvas id="pipe-canvas" style="cursor:crosshair;background:#111122;max-width:100%;border:1px solid rgba(0,229,255,0.2);image-rendering:pixelated;"></canvas>
            </main>
            <aside class="admin-props" id="pipe-props"><p class="admin-empty-msg">Select a level</p></aside>
          </div>
        </div>

        <!-- PLATFORM TAB -->
        <div id="tab-platform" class="admin-tab-content hidden">
          <div class="admin-layout" style="flex:1;overflow:hidden;">
            <aside class="admin-tree">
              <div class="admin-tree-header"><span>PLATFORM LEVELS</span><button class="admin-add-btn" id="add-plat">+ Add</button></div>
              <div class="admin-tree-list" id="plat-list"></div>
            </aside>
            <main class="admin-center" style="flex-direction:column;gap:8px;">
              <div class="admin-toolbar" style="gap:4px;flex-wrap:wrap;">
                ${Object.keys(PLAT_COLORS).map(t => `<button class="admin-plat-type" data-plt="${t}" style="background:${PLAT_COLORS[t]};min-width:56px;border:1px solid rgba(255,255,255,0.2);font-size:10px;">${t}</button>`).join('')}
                <button class="admin-plat-type" data-plt="__erase__" style="background:#441122;border:1px solid rgba(255,255,255,0.2);">⌫</button>
              </div>
              <canvas id="plat-canvas" style="cursor:crosshair;background:#1a0a2e;max-width:100%;border:1px solid rgba(255,107,53,0.3);image-rendering:pixelated;"></canvas>
            </main>
            <aside class="admin-props" id="plat-props"><p class="admin-empty-msg">Select a level</p></aside>
          </div>
        </div>
      </div>
      <button class="admin-back-btn" id="back-btn">← Hub</button>
    `;
    container.appendChild(this.el);

    this.pipeListEl = this.el.querySelector('#pipe-list')!;
    this.platListEl = this.el.querySelector('#plat-list')!;
    this.pipeCanvasEl = this.el.querySelector('#pipe-canvas')!;
    this.platCanvasEl = this.el.querySelector('#plat-canvas')!;
    this.pipePropEl = this.el.querySelector('#pipe-props')!;
    this.platPropEl = this.el.querySelector('#plat-props')!;

    this.el.querySelector('#back-btn')!.addEventListener('click', opts.onBack);
    this.el.querySelector('#add-pipe')!.addEventListener('click', () => this.addPipeLevel());
    this.el.querySelector('#add-plat')!.addEventListener('click', () => this.addPlatLevel());

    this.el.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.el.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.tab = (btn as HTMLElement).dataset.tab as Tab;
        this.el.querySelector('#tab-pipe')!.classList.toggle('hidden', this.tab !== 'pipe');
        this.el.querySelector('#tab-platform')!.classList.toggle('hidden', this.tab !== 'platform');
      });
    });

    this.el.querySelectorAll('.admin-pipe-type').forEach(btn => {
      btn.addEventListener('click', () => {
        this.el.querySelectorAll('.admin-pipe-type').forEach(b => (b as HTMLElement).style.outline = '');
        (btn as HTMLElement).style.outline = '2px solid #00e5ff';
        const pt = (btn as HTMLElement).dataset.pt!;
        if (pt === '__erase__') { this.paintMode = 'erase'; }
        else { this.paintMode = 'tile'; this.activePipeType = pt as PipeTileType; }
      });
    });

    this.el.querySelectorAll('.admin-plat-type').forEach(btn => {
      btn.addEventListener('click', () => {
        this.el.querySelectorAll('.admin-plat-type').forEach(b => (b as HTMLElement).style.outline = '');
        (btn as HTMLElement).style.outline = '2px solid #ff6b35';
        const pt = (btn as HTMLElement).dataset.plt!;
        if (pt === '__erase__') { this.paintMode = 'erase'; }
        else { this.paintMode = 'tile'; this.activePlatType = pt as PlatformTile['type']; }
      });
    });

    this.setupCanvasEvents(this.pipeCanvasEl, () => this.onPipePaint.bind(this));
    this.setupCanvasEvents(this.platCanvasEl, () => this.onPlatPaint.bind(this));
    this.refresh();
  }

  private setupCanvasEvents(canvas: HTMLCanvasElement, getCb: () => (e: MouseEvent) => void): void {
    canvas.addEventListener('mousedown', (e) => { this.painting = true; getCb()(e); });
    canvas.addEventListener('mousemove', (e) => { if (this.painting) getCb()(e); });
    canvas.addEventListener('mouseup', () => { this.painting = false; });
    canvas.addEventListener('mouseleave', () => { this.painting = false; });
  }

  private onPipePaint(e: MouseEvent): void {
    const level = this.selectedPipe; if (!level) return;
    const cell = this.getCanvasCell(this.pipeCanvasEl, e, level.cols, level.rows);
    if (!cell) return;
    const { col, row } = cell;
    if (this.paintMode === 'erase') {
      level.grid[row][col] = { type: 'empty', rotation: 0, locked: false };
    } else {
      const locked = this.activePipeType === 'source' || this.activePipeType === 'sink';
      level.grid[row][col] = { type: this.activePipeType, rotation: 0, locked };
    }
    saveAllRPGAssets(); this.drawPipeGrid(level);
  }

  private onPlatPaint(e: MouseEvent): void {
    const level = this.selectedPlat; if (!level) return;
    const cell = this.getCanvasCell(this.platCanvasEl, e, level.cols, level.rows);
    if (!cell) return;
    const { col, row } = cell;
    if (this.paintMode === 'erase') {
      level.tiles = level.tiles.filter(t => !(t.col === col && t.row === row));
    } else {
      const existing = level.tiles.find(t => t.col === col && t.row === row);
      if (existing) existing.type = this.activePlatType;
      else level.tiles.push({ col, row, type: this.activePlatType });
    }
    saveAllRPGAssets(); this.drawPlatGrid(level);
  }

  private getCanvasCell(canvas: HTMLCanvasElement, e: MouseEvent, cols: number, rows: number): { col: number; row: number } | null {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const cw = canvas.width / cols; const ch = canvas.height / rows;
    const col = Math.floor(mx / cw); const row = Math.floor(my / ch);
    if (col < 0 || col >= cols || row < 0 || row >= rows) return null;
    return { col, row };
  }

  private drawPipeGrid(level: PipePuzzleLevel): void {
    const CELL = 40;
    const w = level.cols * CELL; const h = level.rows * CELL;
    this.pipeCanvasEl.width = w; this.pipeCanvasEl.height = h;
    const ctx = this.pipeCanvasEl.getContext('2d')!;
    ctx.clearRect(0, 0, w, h);
    for (let r = 0; r < level.rows; r++) {
      for (let c = 0; c < level.cols; c++) {
        const tile = level.grid[r]?.[c] ?? { type: 'empty' };
        ctx.fillStyle = PIPE_COLORS[tile.type] ?? '#111122';
        ctx.fillRect(c * CELL, r * CELL, CELL - 1, CELL - 1);
        const sym = PIPE_SYMBOLS[tile.type]; if (!sym) continue;
        ctx.fillStyle = '#dde8ff'; ctx.font = '18px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(sym, c * CELL + CELL / 2, r * CELL + CELL / 2);
      }
    }
    ctx.strokeStyle = 'rgba(0,229,255,0.15)'; ctx.lineWidth = 0.5;
    for (let c = 0; c <= level.cols; c++) { ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, h); ctx.stroke(); }
    for (let r = 0; r <= level.rows; r++) { ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(w, r * CELL); ctx.stroke(); }
  }

  private drawPlatGrid(level: PlatformLevel): void {
    const CELL = 32;
    const w = level.cols * CELL; const h = level.rows * CELL;
    this.platCanvasEl.width = w; this.platCanvasEl.height = h;
    const ctx = this.platCanvasEl.getContext('2d')!;
    ctx.clearRect(0, 0, w, h);
    level.tiles.forEach(t => {
      ctx.fillStyle = PLAT_COLORS[t.type] ?? '#3a5a8a';
      ctx.fillRect(t.col * CELL, t.row * CELL, CELL - 1, CELL - 1);
    });
    // Spawn
    ctx.fillStyle = '#00e5ff'; ctx.beginPath(); ctx.arc(level.spawnCol * CELL + CELL / 2, level.spawnRow * CELL + CELL / 2, 6, 0, Math.PI * 2); ctx.fill();
    // Exit
    ctx.fillStyle = '#ffcc00'; ctx.fillRect(level.exitCol * CELL + 4, level.exitRow * CELL + 4, CELL - 9, CELL - 9);
    ctx.strokeStyle = 'rgba(255,107,53,0.15)'; ctx.lineWidth = 0.5;
    for (let c = 0; c <= level.cols; c++) { ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, h); ctx.stroke(); }
    for (let r = 0; r <= level.rows; r++) { ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(w, r * CELL); ctx.stroke(); }
  }

  private refresh(): void {
    this.pipeListEl.innerHTML = '';
    svgAssetStore.getAllPipeLevels().forEach(lvl => {
      const item = document.createElement('div');
      item.className = 'admin-tree-item' + (this.selectedPipe?.id === lvl.id ? ' active' : '');
      item.textContent = lvl.name; item.addEventListener('click', () => { this.selectedPipe = lvl; this.refresh(); this.drawPipeGrid(lvl); this.showPipeProps(lvl); });
      const del = document.createElement('button'); del.className = 'admin-tree-del'; del.textContent = '✕';
      del.addEventListener('click', (e) => { e.stopPropagation(); svgAssetStore.removePipeLevel(lvl.id); saveAllRPGAssets(); this.selectedPipe = null; this.refresh(); });
      item.appendChild(del); this.pipeListEl.appendChild(item);
    });
    this.platListEl.innerHTML = '';
    svgAssetStore.getAllPlatformLevels().forEach(lvl => {
      const item = document.createElement('div');
      item.className = 'admin-tree-item' + (this.selectedPlat?.id === lvl.id ? ' active' : '');
      item.textContent = lvl.name; item.addEventListener('click', () => { this.selectedPlat = lvl; this.refresh(); this.drawPlatGrid(lvl); this.showPlatProps(lvl); });
      const del = document.createElement('button'); del.className = 'admin-tree-del'; del.textContent = '✕';
      del.addEventListener('click', (e) => { e.stopPropagation(); svgAssetStore.removePlatformLevel(lvl.id); saveAllRPGAssets(); this.selectedPlat = null; this.refresh(); });
      item.appendChild(del); this.platListEl.appendChild(item);
    });
  }

  private showPipeProps(lvl: PipePuzzleLevel): void {
    this.pipePropEl.innerHTML = `<div class="admin-section-header">PIPE: ${lvl.name}</div>`;
    this.appendProps(this.pipePropEl, [
      ['Name', 'text', lvl.name, (v: string) => { lvl.name = v; saveAllRPGAssets(); this.refresh(); }],
      ['Cols', 'number', lvl.cols, (v: number) => { lvl.cols = v; this.resizePipeGrid(lvl); saveAllRPGAssets(); this.drawPipeGrid(lvl); }],
      ['Rows', 'number', lvl.rows, (v: number) => { lvl.rows = v; this.resizePipeGrid(lvl); saveAllRPGAssets(); this.drawPipeGrid(lvl); }],
      ['Time (s)', 'number', lvl.timeLimitSec, (v: number) => { lvl.timeLimitSec = v; saveAllRPGAssets(); }],
      ['Reward Gold', 'number', lvl.rewardGold, (v: number) => { lvl.rewardGold = v; saveAllRPGAssets(); }],
      ['Reward Item', 'text', lvl.rewardItemId ?? '', (v: string) => { lvl.rewardItemId = v || null; saveAllRPGAssets(); }],
      ['Win Flag', 'text', lvl.winFlagKey ?? '', (v: string) => { lvl.winFlagKey = v || null; saveAllRPGAssets(); }],
    ] as [string, string, string | number, (v: string & number) => void][]);
  }

  private showPlatProps(lvl: PlatformLevel): void {
    this.platPropEl.innerHTML = `<div class="admin-section-header">PLATFORM: ${lvl.name}</div>`;
    this.appendProps(this.platPropEl, [
      ['Name', 'text', lvl.name, (v: string) => { lvl.name = v; saveAllRPGAssets(); this.refresh(); }],
      ['Cols', 'number', lvl.cols, (v: number) => { lvl.cols = v; saveAllRPGAssets(); }],
      ['Rows', 'number', lvl.rows, (v: number) => { lvl.rows = v; saveAllRPGAssets(); }],
      ['Time (s)', 'number', lvl.timeLimitSec, (v: number) => { lvl.timeLimitSec = v; saveAllRPGAssets(); }],
      ['Gravity', 'number', lvl.gravity, (v: number) => { lvl.gravity = v; saveAllRPGAssets(); }],
      ['Spawn Col', 'number', lvl.spawnCol, (v: number) => { lvl.spawnCol = v; saveAllRPGAssets(); this.drawPlatGrid(lvl); }],
      ['Spawn Row', 'number', lvl.spawnRow, (v: number) => { lvl.spawnRow = v; saveAllRPGAssets(); this.drawPlatGrid(lvl); }],
      ['Exit Col', 'number', lvl.exitCol, (v: number) => { lvl.exitCol = v; saveAllRPGAssets(); this.drawPlatGrid(lvl); }],
      ['Exit Row', 'number', lvl.exitRow, (v: number) => { lvl.exitRow = v; saveAllRPGAssets(); this.drawPlatGrid(lvl); }],
      ['Reward Gold', 'number', lvl.rewardGold, (v: number) => { lvl.rewardGold = v; saveAllRPGAssets(); }],
      ['Reward Item', 'text', lvl.rewardItemId ?? '', (v: string) => { lvl.rewardItemId = v || null; saveAllRPGAssets(); }],
      ['Win Flag', 'text', lvl.winFlagKey ?? '', (v: string) => { lvl.winFlagKey = v || null; saveAllRPGAssets(); }],
    ] as [string, string, string | number, (v: string & number) => void][]);
  }

  private appendProps(container: HTMLElement, rows: [string, string, string | number, (v: string & number) => void][]): void {
    rows.forEach(([label, type, val, cb]) => {
      const wrap = document.createElement('div'); wrap.className = 'admin-prop-row';
      const lbl = document.createElement('label'); lbl.className = 'admin-label'; lbl.textContent = label;
      const inp = document.createElement('input'); inp.type = type; inp.className = 'admin-input'; inp.value = String(val);
      inp.addEventListener('change', () => cb(type === 'number' ? (Number(inp.value) as unknown as string & number) : (inp.value as unknown as string & number)));
      wrap.append(lbl, inp); container.appendChild(wrap);
    });
  }

  private resizePipeGrid(lvl: PipePuzzleLevel): void {
    const newGrid: PipeTile[][] = Array.from({ length: lvl.rows }, (_, r) =>
      Array.from({ length: lvl.cols }, (_, c) => lvl.grid[r]?.[c] ?? { type: 'empty' as PipeTileType, rotation: 0 as const, locked: false })
    );
    lvl.grid = newGrid;
  }

  private addPipeLevel(): void {
    const id = `pp_${Date.now()}`;
    const cols = 5, rows = 4;
    const grid: PipeTile[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ type: 'empty' as PipeTileType, rotation: 0 as const, locked: false })));
    svgAssetStore.addPipeLevel({ id, name: 'New Pipe Level', cols, rows, timeLimitSec: 30, grid, rewardItemId: null, rewardGold: 0, winFlagKey: null });
    saveAllRPGAssets(); this.selectedPipe = svgAssetStore.getPipeLevel(id) ?? null; this.refresh();
    if (this.selectedPipe) { this.drawPipeGrid(this.selectedPipe); this.showPipeProps(this.selectedPipe); }
  }

  private addPlatLevel(): void {
    const id = `pl_${Date.now()}`;
    svgAssetStore.addPlatformLevel({ id, name: 'New Platform Level', cols: 12, rows: 8, tileSize: 40, timeLimitSec: 60, spawnCol: 0, spawnRow: 6, exitCol: 11, exitRow: 1, tiles: [], collectibles: [], bgColor: '#1a0a2e', gravity: 800, rewardItemId: null, rewardGold: 0, winFlagKey: null });
    saveAllRPGAssets(); this.selectedPlat = svgAssetStore.getPlatformLevel(id) ?? null; this.refresh();
    if (this.selectedPlat) { this.drawPlatGrid(this.selectedPlat); this.showPlatProps(this.selectedPlat); }
  }

  setVisible(v: boolean): void { this.el.classList.toggle('hidden', !v); if (v) this.refresh(); }
}

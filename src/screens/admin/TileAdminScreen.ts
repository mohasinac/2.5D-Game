import { svgAssetStore } from '../../rpg/stores/SVGAssetStore.ts';
import { saveAllRPGAssets } from '../../utils/rpgPersistence.ts';
import type { SVGTilesetData, TileData, CollisionType, ZLayer } from '../../types/rpgTypes.ts';

export class TileAdminScreen {
  private el: HTMLElement;
  private selectedTileset: SVGTilesetData | null = null;
  private selectedTile: TileData | null = null;
  private treeEl!: HTMLElement;
  private canvasEl!: HTMLCanvasElement;
  private propsEl!: HTMLElement;

  constructor(container: HTMLElement, private opts: { onBack: () => void }) {
    this.el = document.createElement('div');
    this.el.className = 'screen admin-screen hidden';
    this.el.innerHTML = `
      <div class="admin-layout">
        <aside class="admin-tree">
          <div class="admin-tree-header">
            <span>TILESETS</span>
            <button class="admin-add-btn" id="add-ts">+ Add</button>
          </div>
          <div class="admin-tree-list" id="tile-tree"></div>
        </aside>
        <main class="admin-center">
          <canvas id="tile-preview" width="320" height="256"
            style="cursor:crosshair;image-rendering:pixelated;background:#111122;max-width:100%;"></canvas>
          <p class="admin-empty-msg" style="color:#556677;font-size:11px">
            Click a tile in the grid to select / create it
          </p>
        </main>
        <aside class="admin-props" id="tile-props">
          <p class="admin-empty-msg">Select a tileset or tile</p>
        </aside>
      </div>
      <button class="admin-back-btn" id="back-btn">← Hub</button>
    `;
    container.appendChild(this.el);

    this.treeEl   = this.el.querySelector('#tile-tree')!;
    this.canvasEl = this.el.querySelector('#tile-preview')!;
    this.propsEl  = this.el.querySelector('#tile-props')!;

    this.el.querySelector('#back-btn')!.addEventListener('click', opts.onBack);
    this.el.querySelector('#add-ts')!.addEventListener('click', () => this.addTileset());
    this.canvasEl.addEventListener('click', (e) => this.onCanvasClick(e));
    this.refresh();
  }

  private refresh(): void {
    this.treeEl.innerHTML = '';
    svgAssetStore.getAllTilesets().forEach(ts => {
      const item = document.createElement('div');
      item.className = 'admin-tree-item' + (this.selectedTileset?.id === ts.id ? ' active' : '');
      item.textContent = ts.name || ts.id;
      item.addEventListener('click', () => {
        this.selectedTileset = ts; this.selectedTile = null;
        this.refresh(); this.drawTileset(ts); this.showTilesetProps(ts);
      });
      const del = document.createElement('button');
      del.className = 'admin-tree-del'; del.textContent = '✕';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        svgAssetStore.removeTileset(ts.id); saveAllRPGAssets();
        this.selectedTileset = null; this.refresh();
      });
      item.appendChild(del);
      this.treeEl.appendChild(item);

      if (this.selectedTileset?.id === ts.id) {
        svgAssetStore.getTilesForTileset(ts.id).forEach(tile => {
          const child = document.createElement('div');
          child.className = 'admin-tree-item admin-tree-child' + (this.selectedTile?.id === tile.id ? ' active' : '');
          child.textContent = `  ${tile.name || tile.id} [${tile.collision}]`;
          child.addEventListener('click', (e) => {
            e.stopPropagation(); this.selectedTile = tile; this.showTileProps(tile);
          });
          this.treeEl.appendChild(child);
        });
      }
    });
    if (this.selectedTileset) this.drawTileset(this.selectedTileset);
  }

  private drawTileset(ts: SVGTilesetData): void {
    const ctx = this.canvasEl.getContext('2d')!;
    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    if (!ts.svgBase64) return;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, this.canvasEl.width, this.canvasEl.height);
      this.drawGrid(ts, ctx);
    };
    img.src = `data:image/svg+xml;base64,${ts.svgBase64}`;
  }

  private drawGrid(ts: SVGTilesetData, ctx: CanvasRenderingContext2D): void {
    const COLS = 8, ROWS = 4;
    const cw = this.canvasEl.width / COLS;
    const ch = this.canvasEl.height / ROWS;
    ctx.strokeStyle = 'rgba(0,229,255,0.3)'; ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(c * cw, 0); ctx.lineTo(c * cw, this.canvasEl.height); ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * ch); ctx.lineTo(this.canvasEl.width, r * ch); ctx.stroke();
    }
    if (this.selectedTile) {
      const fi = this.selectedTile.frameIndex;
      const col = fi % COLS; const row = Math.floor(fi / COLS);
      ctx.fillStyle = 'rgba(0,229,255,0.25)';
      ctx.fillRect(col * cw, row * ch, cw, ch);
    }
  }

  private onCanvasClick(e: MouseEvent): void {
    const ts = this.selectedTileset; if (!ts) return;
    const COLS = 8, ROWS = 4;
    const rect = this.canvasEl.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (this.canvasEl.width / rect.width);
    const my = (e.clientY - rect.top)  * (this.canvasEl.height / rect.height);
    const col = Math.floor(mx / (this.canvasEl.width / COLS));
    const row = Math.floor(my / (this.canvasEl.height / ROWS));
    const fi = row * COLS + col;

    let tile = svgAssetStore.getTilesForTileset(ts.id).find(t => t.frameIndex === fi);
    if (!tile) {
      const id = `tile_${ts.id}_${fi}`;
      svgAssetStore.addTile({ id, name: `Tile ${fi}`, tilesetId: ts.id, frameIndex: fi, collision: 'none', zLayer: 'ground', animFrames: [], animFps: 0, tags: [] });
      saveAllRPGAssets();
      tile = svgAssetStore.getTile(id)!;
    }
    this.selectedTile = tile; this.refresh(); this.showTileProps(tile);
  }

  private showTilesetProps(ts: SVGTilesetData): void {
    this.propsEl.innerHTML = `<div class="admin-section-header">TILESET: ${ts.name}</div>`;
    const addRow = (label: string, el: HTMLElement) => {
      const wrap = document.createElement('div'); wrap.className = 'admin-prop-row';
      const lbl = document.createElement('label'); lbl.className = 'admin-label'; lbl.textContent = label;
      wrap.append(lbl, el); this.propsEl.appendChild(wrap);
    };
    const textInp = (val: string, cb: (v: string) => void): HTMLInputElement => {
      const i = document.createElement('input'); i.type = 'text'; i.className = 'admin-input'; i.value = val;
      i.addEventListener('change', () => cb(i.value)); return i;
    };
    const numInp = (val: number, cb: (v: number) => void): HTMLInputElement => {
      const i = document.createElement('input'); i.type = 'number'; i.className = 'admin-input'; i.value = String(val);
      i.addEventListener('change', () => cb(Number(i.value))); return i;
    };
    addRow('Name',   textInp(ts.name,      v => { ts.name = v; saveAllRPGAssets(); this.refresh(); }));
    addRow('Tile W', numInp(ts.tileWidth,  v => { ts.tileWidth = v; saveAllRPGAssets(); }));
    addRow('Tile H', numInp(ts.tileHeight, v => { ts.tileHeight = v; saveAllRPGAssets(); }));
    const upBtn = document.createElement('button'); upBtn.className = 'admin-btn'; upBtn.textContent = '📁 Upload SVG';
    upBtn.addEventListener('click', () => {
      const fi = document.createElement('input'); fi.type = 'file'; fi.accept = '.svg';
      fi.addEventListener('change', () => {
        const f = fi.files?.[0]; if (!f) return;
        const reader = new FileReader();
        reader.onload = () => { ts.svgBase64 = btoa(reader.result as string); saveAllRPGAssets(); this.drawTileset(ts); };
        reader.readAsBinaryString(f);
      }); fi.click();
    });
    addRow('SVG', upBtn);
  }

  private showTileProps(tile: TileData): void {
    this.propsEl.innerHTML = `<div class="admin-section-header">TILE: ${tile.name}</div>`;
    const addRow = (label: string, el: HTMLElement) => {
      const wrap = document.createElement('div'); wrap.className = 'admin-prop-row';
      const lbl = document.createElement('label'); lbl.className = 'admin-label'; lbl.textContent = label;
      wrap.append(lbl, el); this.propsEl.appendChild(wrap);
    };
    const textInp = (val: string, cb: (v: string) => void) => {
      const i = document.createElement('input'); i.type = 'text'; i.className = 'admin-input'; i.value = val;
      i.addEventListener('change', () => cb(i.value)); return i;
    };
    const sel = (options: string[], val: string, cb: (v: string) => void): HTMLSelectElement => {
      const s = document.createElement('select'); s.className = 'admin-input';
      options.forEach(o => { const op = document.createElement('option'); op.value = op.textContent = o; if (o === val) op.selected = true; s.appendChild(op); });
      s.addEventListener('change', () => cb(s.value)); return s;
    };
    addRow('Name',      textInp(tile.name, v => { tile.name = v; saveAllRPGAssets(); this.refresh(); }));
    addRow('Collision', sel(['none','solid','slope_up','slope_down','water','bush'] as CollisionType[], tile.collision, v => { tile.collision = v as CollisionType; saveAllRPGAssets(); }));
    addRow('Z-Layer',   sel(['ground','decor','overhead'] as ZLayer[], tile.zLayer, v => { tile.zLayer = v as ZLayer; saveAllRPGAssets(); }));
    addRow('Tags',      textInp(tile.tags.join(','), v => { tile.tags = v.split(',').map(t => t.trim()).filter(Boolean); saveAllRPGAssets(); }));
  }

  private addTileset(): void {
    const id = `ts_${Date.now()}`;
    svgAssetStore.addTileset({ id, name: 'New Tileset', svgBase64: '', tileWidth: 32, tileHeight: 32, tileIds: [] });
    saveAllRPGAssets();
    this.selectedTileset = svgAssetStore.getTileset(id) ?? null;
    this.refresh();
    this.showTilesetProps(this.selectedTileset!);
  }

  setVisible(v: boolean): void { this.el.classList.toggle('hidden', !v); if (v) this.refresh(); }
}

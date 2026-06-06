import { svgAssetStore } from '../../rpg/stores/SVGAssetStore.ts';
import { saveAllRPGAssets } from '../../utils/rpgPersistence.ts';
import type { MapData, MapLayer, NPCEntityPlacement, EventZonePlacement } from '../../types/rpgTypes.ts';
import { TILE_SIZE } from '../../rpg/config/rpgConstants.ts';

export class MapAdminScreen {
  private el: HTMLElement;
  private selectedMap: MapData | null = null;
  private selectedLayer: MapLayer | null = null;
  private treeEl!: HTMLElement;
  private canvasEl!: HTMLCanvasElement;
  private propsEl!: HTMLElement;
  private activeTool: 'pencil' | 'eraser' | 'entity' | 'event' = 'pencil';
  private activeTileId: string | null = null;
  private painting = false;

  constructor(container: HTMLElement, private opts: { onBack: () => void }) {
    this.el = document.createElement('div');
    this.el.className = 'screen admin-screen hidden';
    this.el.innerHTML = `
      <div class="admin-layout">
        <aside class="admin-tree">
          <div class="admin-tree-header">
            <span>MAPS</span>
            <button class="admin-add-btn" id="add-map">+ Add</button>
          </div>
          <div class="admin-tree-list" id="map-tree"></div>
        </aside>
        <main class="admin-center" style="flex-direction:column;gap:8px;">
          <div class="admin-toolbar">
            <button class="admin-tool-btn active" data-tool="pencil">✏</button>
            <button class="admin-tool-btn" data-tool="eraser">⌫</button>
            <button class="admin-tool-btn" data-tool="entity">👤</button>
            <button class="admin-tool-btn" data-tool="event">⚡</button>
            <span style="margin-left:8px;font-size:11px;color:#556677;">Tile:</span>
            <select class="admin-input" id="tile-select" style="width:120px"></select>
          </div>
          <canvas id="map-canvas" width="600" height="400"
            style="cursor:crosshair;background:#111122;max-width:100%;border:1px solid rgba(0,229,255,0.2);"></canvas>
        </main>
        <aside class="admin-props" id="map-props">
          <p class="admin-empty-msg">Select a map to edit</p>
        </aside>
      </div>
      <button class="admin-back-btn" id="back-btn">← Hub</button>
    `;
    container.appendChild(this.el);

    this.treeEl   = this.el.querySelector('#map-tree')!;
    this.canvasEl = this.el.querySelector('#map-canvas')!;
    this.propsEl  = this.el.querySelector('#map-props')!;

    this.el.querySelector('#back-btn')!.addEventListener('click', opts.onBack);
    this.el.querySelector('#add-map')!.addEventListener('click', () => this.addMap());

    this.el.querySelectorAll('.admin-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.el.querySelectorAll('.admin-tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTool = (btn as HTMLElement).dataset.tool as typeof this.activeTool;
      });
    });

    const tileSelect = this.el.querySelector('#tile-select') as HTMLSelectElement;
    tileSelect.addEventListener('change', () => { this.activeTileId = tileSelect.value || null; });

    this.canvasEl.addEventListener('mousedown', (e) => { this.painting = true; this.onPaint(e); });
    this.canvasEl.addEventListener('mousemove', (e) => { if (this.painting) this.onPaint(e); });
    this.canvasEl.addEventListener('mouseup', () => { this.painting = false; });
    this.canvasEl.addEventListener('mouseleave', () => { this.painting = false; });

    this.refresh();
  }

  private refresh(): void {
    this.treeEl.innerHTML = '';
    this.populateTileSelect();
    svgAssetStore.getAllMaps().forEach(map => {
      const item = document.createElement('div');
      item.className = 'admin-tree-item' + (this.selectedMap?.id === map.id ? ' active' : '');
      item.textContent = map.name || map.id;
      item.addEventListener('click', () => { this.selectedMap = map; this.selectedLayer = map.layers[0] ?? null; this.refresh(); this.showMapProps(map); this.drawMap(); });
      const del = document.createElement('button');
      del.className = 'admin-tree-del'; del.textContent = '✕';
      del.addEventListener('click', (e) => { e.stopPropagation(); svgAssetStore.removeMap(map.id); saveAllRPGAssets(); this.selectedMap = null; this.refresh(); });
      item.appendChild(del);
      this.treeEl.appendChild(item);

      if (this.selectedMap?.id === map.id) {
        map.layers.forEach(layer => {
          const li = document.createElement('div');
          li.className = 'admin-tree-item admin-tree-child' + (this.selectedLayer?.id === layer.id ? ' active' : '');
          li.textContent = `  ▤ ${layer.name}`;
          li.addEventListener('click', (e) => { e.stopPropagation(); this.selectedLayer = layer; this.refresh(); });
          this.treeEl.appendChild(li);
        });
      }
    });
  }

  private populateTileSelect(): void {
    const sel = this.el.querySelector('#tile-select') as HTMLSelectElement;
    sel.innerHTML = '<option value="">— pick tile —</option>';
    svgAssetStore.getAllTiles().forEach(t => {
      const op = document.createElement('option'); op.value = t.id; op.textContent = t.name || t.id;
      if (t.id === this.activeTileId) op.selected = true;
      sel.appendChild(op);
    });
  }

  private onPaint(e: MouseEvent): void {
    const map = this.selectedMap; const layer = this.selectedLayer;
    if (!map || !layer) return;
    const rect = this.canvasEl.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (this.canvasEl.width / rect.width);
    const my = (e.clientY - rect.top)  * (this.canvasEl.height / rect.height);
    const cw = this.canvasEl.width  / map.cols;
    const ch = this.canvasEl.height / map.rows;
    const col = Math.floor(mx / cw); const row = Math.floor(my / ch);
    if (col < 0 || col >= map.cols || row < 0 || row >= map.rows) return;

    if (!layer.cells[row]) layer.cells[row] = [];
    if (this.activeTool === 'pencil') {
      layer.cells[row][col] = { tileId: this.activeTileId };
    } else if (this.activeTool === 'eraser') {
      layer.cells[row][col] = { tileId: null };
    } else if (this.activeTool === 'entity') {
      this.addEntity(map, col, row);
      return;
    } else if (this.activeTool === 'event') {
      this.addEvent(map, col, row);
      return;
    }
    saveAllRPGAssets();
    this.drawMap();
  }

  private addEntity(map: MapData, col: number, row: number): void {
    const npcId = prompt('NPC id (e.g. npc_kai):'); if (!npcId) return;
    const placement: NPCEntityPlacement = { id: `npc_${Date.now()}`, npcId, tileX: col, tileY: row, facing: 'down', patrolPath: [] };
    map.entities.push(placement); saveAllRPGAssets(); this.drawMap();
  }

  private addEvent(map: MapData, col: number, row: number): void {
    const triggerId = prompt('Trigger id:'); if (!triggerId) return;
    const ev: EventZonePlacement = { id: `ev_${Date.now()}`, tileX: col, tileY: row, widthTiles: 2, heightTiles: 2, triggerId };
    map.events.push(ev); saveAllRPGAssets(); this.drawMap();
  }

  private drawMap(): void {
    const map = this.selectedMap; if (!map) return;
    const ctx = this.canvasEl.getContext('2d')!;
    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    const cw = this.canvasEl.width / map.cols;
    const ch = this.canvasEl.height / map.rows;

    for (const layer of map.layers) {
      if (!layer.visible) continue;
      for (let r = 0; r < map.rows; r++) {
        for (let c = 0; c < map.cols; c++) {
          const cell = layer.cells[r]?.[c];
          if (!cell?.tileId) continue;
          const tile = svgAssetStore.getTile(cell.tileId);
          if (!tile) continue;
          const col = tile.collision === 'solid' ? '#1a3a5a' : tile.collision === 'bush' ? '#1a4a1a' : '#1a2a3a';
          ctx.fillStyle = col; ctx.fillRect(c * cw, r * ch, cw - 0.5, ch - 0.5);
        }
      }
    }
    // Grid
    ctx.strokeStyle = 'rgba(0,229,255,0.08)'; ctx.lineWidth = 0.5;
    for (let c = 0; c <= map.cols; c++) { ctx.beginPath(); ctx.moveTo(c * cw, 0); ctx.lineTo(c * cw, this.canvasEl.height); ctx.stroke(); }
    for (let r = 0; r <= map.rows; r++) { ctx.beginPath(); ctx.moveTo(0, r * ch); ctx.lineTo(this.canvasEl.width, r * ch); ctx.stroke(); }
    // Entities
    ctx.fillStyle = '#00e5ff';
    map.entities.forEach(e => { ctx.fillRect(e.tileX * cw + cw * 0.2, e.tileY * ch + ch * 0.2, cw * 0.6, ch * 0.6); });
    // Events
    ctx.fillStyle = 'rgba(255,107,53,0.5)';
    map.events.forEach(e => { ctx.fillRect(e.tileX * cw, e.tileY * ch, e.widthTiles * cw, e.heightTiles * ch); });
  }

  private showMapProps(map: MapData): void {
    this.propsEl.innerHTML = `<div class="admin-section-header">MAP: ${map.name}</div>`;
    const addRow = (label: string, el: HTMLElement) => {
      const wrap = document.createElement('div'); wrap.className = 'admin-prop-row';
      const lbl = document.createElement('label'); lbl.className = 'admin-label'; lbl.textContent = label;
      wrap.append(lbl, el); this.propsEl.appendChild(wrap);
    };
    const textInp = (val: string, cb: (v: string) => void) => {
      const i = document.createElement('input'); i.type = 'text'; i.className = 'admin-input'; i.value = val;
      i.addEventListener('change', () => cb(i.value)); return i;
    };
    const numInp = (val: number, cb: (v: number) => void) => {
      const i = document.createElement('input'); i.type = 'number'; i.className = 'admin-input'; i.value = String(val);
      i.addEventListener('change', () => cb(Number(i.value))); return i;
    };
    addRow('Name', textInp(map.name, v => { map.name = v; saveAllRPGAssets(); this.refresh(); }));
    addRow('Cols', numInp(map.cols, v => { map.cols = v; saveAllRPGAssets(); }));
    addRow('Rows', numInp(map.rows, v => { map.rows = v; saveAllRPGAssets(); }));
    addRow('BG Color', textInp(map.bgColor, v => { map.bgColor = v; saveAllRPGAssets(); }));

    const addLayerBtn = document.createElement('button'); addLayerBtn.className = 'admin-btn'; addLayerBtn.textContent = '+ Add Layer';
    addLayerBtn.addEventListener('click', () => {
      const id = `layer_${Date.now()}`;
      const cells: { tileId: string | null }[][] = Array.from({ length: map.rows }, () => Array.from({ length: map.cols }, () => ({ tileId: null })));
      map.layers.push({ id, name: 'New Layer', visible: true, cells });
      saveAllRPGAssets(); this.refresh();
    });
    this.propsEl.appendChild(addLayerBtn);

    void TILE_SIZE;
  }

  private addMap(): void {
    const id = `map_${Date.now()}`;
    const cols = 20, rows = 15;
    const cells = (): { tileId: string | null }[][] => Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ tileId: null })));
    svgAssetStore.addMap({
      id, name: 'New Map', cols, rows, tileSize: 48, bgColor: '#111122',
      tilesetId: svgAssetStore.getAllTilesets()[0]?.id ?? '', bgmId: null,
      layers: [{ id: 'ground', name: 'Ground', visible: true, cells: cells() }],
      entities: [], events: [],
    });
    saveAllRPGAssets();
    this.selectedMap = svgAssetStore.getMap(id) ?? null;
    this.selectedLayer = this.selectedMap?.layers[0] ?? null;
    this.refresh();
  }

  setVisible(v: boolean): void { this.el.classList.toggle('hidden', !v); if (v) this.refresh(); }
}
